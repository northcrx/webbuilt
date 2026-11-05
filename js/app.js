/* Boot + all the editor wiring. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var editing = null;

  function $(sel) { return document.querySelector(sel); }

  var App = S.App = {
    zoom: 0.82,
    uiTheme: 'dark',
    previewMode: false,
    blockQuery: '',
    leftTab: 'blocks',
    autoFit: true,

    init: function () {
      injectStyles();
      this.initUITheme();
      this.initLeftTab();
      S.State.init();
      S.Render.zoom = this.zoom;

      S.Render.palette();
      S.Render.templates();
      S.Theme.init();
      S.Fonts.init();
      S.IconsPanel.init();
      S.Render.all();
      S.Inspector.render();
      this.loadThemeFonts();

      this.bindToolbar();
      this.bindTabs();
      this.bindLeftTabs();
      this.bindBlockSearch();
      this.bindTargets();
      this.bindTemplates();
      this.bindPalette();
      this.bindLayers();
      this.bindStage();
      this.bindKeyboard();
      this.bindModal();
      this.bindZoom();
      this.bindDeviceMenu();
      this.bindMoreMenu();
      this.bindViewport();
      S.Drag.init();

      this.showLeftTab(this.leftTab, true);
      this.requestFit();

      setTimeout(function () {
        U.toast('Tip: click any text in the preview to edit it directly');
      }, 700);
    },

    initLeftTab: function () {
      var saved = 'blocks';
      try { saved = localStorage.getItem('droidlab.ui.left') || 'blocks'; } catch (err) { saved = 'blocks'; }
      if (['templates', 'blocks', 'layers'].indexOf(saved) === -1) saved = 'blocks';
      this.leftTab = saved;
    },

    initUITheme: function () {
      var saved = 'dark';
      try { saved = localStorage.getItem('droidlab.ui') || 'dark'; } catch (err) { saved = 'dark'; }
      this.setUITheme(saved, true);
    },

    setUITheme: function (theme, silent) {
      theme = theme === 'light' ? 'light' : 'dark';
      this.uiTheme = theme;
      document.documentElement.setAttribute('data-ui', theme);
      try { localStorage.setItem('droidlab.ui', theme); } catch (err) { /* private mode */ }
      var btn = document.querySelector('#btn-ui-theme .mi');
      if (btn) btn.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
      var label = document.querySelector('#btn-ui-theme [data-ui-label]');
      if (label) label.textContent = theme === 'dark' ? 'Light editor' : 'Dark editor';
      var tb = document.getElementById('btn-ui-theme');
      if (tb) tb.title = theme === 'dark' ? 'Switch editor to light mode' : 'Switch editor to dark mode';
      if (!silent) U.toast(theme === 'dark' ? 'Editor: dark' : 'Editor: light');
    },

    toggleUITheme: function () {
      this.setUITheme(this.uiTheme === 'dark' ? 'light' : 'dark');
    },

    loadThemeFonts: function () {
      if (!S.Fonts || !S.Fonts.load) return;
      var t = S.State.data.theme;
      if (t.fonts && t.fonts.ui) S.Fonts.load(t.fonts.ui);
      if (t.fonts && t.fonts.display) S.Fonts.load(t.fonts.display);
    },

    selected: function () {
      var d = S.State.data;
      return d.screen.filter(function (it) { return it.id === d.selectedId; })[0] || null;
    },

    blockById: function (id) {
      if (!id) return null;
      return S.State.data.screen.filter(function (it) { return it.id === id; })[0] || null;
    },

    /* Apply one of the presets defined on the active target. */
    setDevice: function (id) {
      var d = S.State.data;
      var target = d.target || 'app';
      var preset = S.targetDevices(target).filter(function (p) { return p.id === id; })[0];
      if (!preset) return;

      d.device.width = preset.width;
      d.device.height = preset.height;
      d.device.preset = preset.id;
      if (target === 'app') {
        if (typeof preset.statusBar === 'boolean') d.device.statusBar = preset.statusBar;
        if (typeof preset.gestureBar === 'boolean') d.device.gestureBar = preset.gestureBar;
      }

      S.State.commit('device:preset');
      this.refresh('device');
      this.closeDeviceMenu(true);
      this.autoFit = true;
      this.requestFit();
      U.toast(preset.label + ' · ' + preset.width + ' × ' + preset.height);
    },

    openDeviceMenu: function (focusItem) {
      var menu = document.getElementById('device-menu');
      var btn = document.getElementById('device-btn');
      if (!menu || !btn) return;
      S.Render.deviceMenu();
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      this.closeMoreMenu();
      if (focusItem) {
        var item = menu.querySelector('.dm-item.active') || menu.querySelector('.dm-item');
        if (item) item.focus();
      }
    },

    closeDeviceMenu: function (returnFocus) {
      var menu = document.getElementById('device-menu');
      var btn = document.getElementById('device-btn');
      if (!menu) return;
      var wasOpen = !menu.hidden;
      menu.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (returnFocus && wasOpen && btn) btn.focus();
    },

    toggleDeviceMenu: function (force) {
      var menu = document.getElementById('device-menu');
      if (!menu) return;
      var open = force == null ? menu.hidden : !!force;
      if (open) this.openDeviceMenu(true);
      else this.closeDeviceMenu(true);
    },

    showLeftTab: function (name, silent) {
      var names = ['templates', 'blocks', 'layers'];
      if (names.indexOf(name) === -1) name = 'blocks';
      this.leftTab = name;

      document.querySelectorAll('#left-tabs .ltab').forEach(function (btn) {
        var on = btn.getAttribute('data-ltab') === name;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        btn.tabIndex = on ? 0 : -1;
      });
      names.forEach(function (key) {
        var panel = document.getElementById('left-' + key);
        if (panel) panel.hidden = key !== name;
      });

      if (!silent) {
        try { localStorage.setItem('droidlab.ui.left', name); } catch (err) { /* private mode */ }
      }
      if (name === 'blocks') S.Render.palette();
      if (name === 'templates') S.Render.templates();
      if (name === 'layers') {
        S.Render.layers();
        var selected = document.querySelector('#layers .layer.is-selected');
        if (selected) {
          try { selected.scrollIntoView({ block: 'nearest' }); } catch (err) { /* ignore */ }
        }
      }
    },

    setPreview: function (on) {
      var next = on == null ? !this.previewMode : !!on;
      if (next === this.previewMode) return;

      if (next) {
        this.finishInlineEdit();
        this.closeDeviceMenu();
        this.closeMoreMenu();
      }
      this.previewMode = next;
      document.body.classList.toggle('preview-mode', next);

      var btn = document.getElementById('btn-preview');
      if (btn) {
        btn.classList.toggle('active', next);
        btn.setAttribute('aria-pressed', next ? 'true' : 'false');
        var icon = btn.querySelector('.mi');
        var text = btn.querySelector('span:not(.mi)');
        if (icon) icon.textContent = next ? 'edit' : 'visibility';
        if (text) text.textContent = next ? 'Editing' : 'Preview';
        btn.title = next ? 'Back to editing (Esc)' : 'Preview without the editor';
      }

      this.autoFit = true;
      this.requestFit();
      U.toast(next ? 'Preview mode — press Esc to return' : 'Back to editing');
    },

    /* Deep-copy a block and give every copied block a fresh id. */
    cloneBlock: function (item) {
      var copy = JSON.parse(JSON.stringify(item));
      (function regen(block) {
        block.id = U.uid();
        (block.children || []).forEach(regen);
      })(copy);
      copy.locked = false;
      copy.hidden = false;
      return copy;
    },

    select: function (id) {
      var d = S.State.data;
      var next = id || null;
      if (next && S.iconTarget && S.iconTarget.id !== next) S.iconTarget = null;

      var changed = d.selectedId !== next;
      d.selectedId = next;

      var screens = document.querySelectorAll('.screen-surface');
      Array.prototype.forEach.call(screens, function (screenEl) {
        var on = !d.compare.on;
        screenEl.classList.toggle('selecting', on);
        Array.prototype.forEach.call(screenEl.querySelectorAll('.cmp'), function (cmp) {
          cmp.classList.toggle('is-selected', on && cmp.getAttribute('data-id') === next);
        });
      });

      S.Render.layers();
      S.Inspector.render();
      if (changed) this.showTab('inspect');
    },

    addBlock: function (type) {
      var def = S.components[type];
      if (!def) return;
      var item = S.makeBlock(type);
      if (!item) return;

      S.State.data.screen.push(item);
      S.State.data.selectedId = item.id;
      S.State.commit(null);
      this.refresh('structure');
      this.select(item.id);
      this.scrollToBottom();
      U.toast(def.label + ' added');
    },

    duplicateSelected: function (id) {
      var d = S.State.data;
      var item = this.blockById(id || d.selectedId);
      if (!item) return;
      var idx = d.screen.indexOf(item);
      var copy = this.cloneBlock(item);
      d.screen.splice(idx + 1, 0, copy);
      d.selectedId = copy.id;
      S.State.commit(null);
      this.refresh('structure');
      this.select(copy.id);
      U.toast(S.components[copy.type].label + ' duplicated');
    },

    deleteSelected: function (id) {
      var d = S.State.data;
      var item = this.blockById(id || d.selectedId);
      if (!item) return;
      if (item.locked) {
        U.toast('Block is locked — unlock it to delete');
        return;
      }

      var label = S.components[item.type] ? S.components[item.type].label : 'Block';
      var idx = d.screen.indexOf(item);
      var target = d.target;
      d.screen.splice(idx, 1);
      d.selectedId = d.screen[idx] ? d.screen[idx].id : (d.screen[idx - 1] ? d.screen[idx - 1].id : null);
      S.State.commit(null);
      this.refresh('structure');
      this.select(d.selectedId);

      U.toast(label + ' deleted', {
        action: 'Undo',
        onAction: function () {
          var now = S.State.data;
          if (now.target !== target) {
            U.toast('Undo is no longer available after switching canvas');
            return;
          }
          if (now.screen.indexOf(item) !== -1) return;
          var at = Math.min(idx, now.screen.length);
          now.screen.splice(at, 0, item);
          now.selectedId = item.id;
          S.State.commit(null);
          S.App.refresh('structure');
          S.App.select(item.id);
          U.toast(label + ' restored');
        }
      });
    },

    moveSelected: function (dir, id) {
      var d = S.State.data;
      var item = this.blockById(id || d.selectedId);
      if (!item) return;
      if (item.locked) {
        U.toast('Block is locked — unlock it to move');
        return;
      }

      var idx = d.screen.indexOf(item);
      var to = idx + dir;
      if (to < 0 || to >= d.screen.length) {
        U.toast(dir < 0 ? 'Already at the top' : 'Already at the bottom');
        return;
      }
      d.screen.splice(idx, 1);
      d.screen.splice(to, 0, item);
      d.selectedId = item.id;
      S.State.commit(null);
      this.refresh('structure');
      this.select(item.id);
    },

    toggleLock: function (id) {
      var d = S.State.data;
      var item = this.blockById(id || d.selectedId);
      if (!item) return;
      item.locked = !item.locked;
      d.selectedId = item.id;
      S.State.commit(null);
      this.refresh('structure');
      this.select(item.id);
      U.toast(item.locked ? 'Block locked' : 'Block unlocked');
    },

    toggleHidden: function (id) {
      var d = S.State.data;
      var item = this.blockById(id || d.selectedId);
      if (!item) return;
      item.hidden = !item.hidden;
      d.selectedId = item.id;
      S.State.commit(null);
      this.refresh('structure');
      this.select(item.id);
      U.toast(item.hidden ? 'Block hidden — click the eye again to show it' : 'Block shown');
    },

    /* One entry point for the toolbar inside the preview and the Layers list. */
    handleBlockAction: function (id, act) {
      if (!id || !act) return;
      if (act === 'up') this.moveSelected(-1, id);
      else if (act === 'down') this.moveSelected(1, id);
      else if (act === 'del') this.deleteSelected(id);
      else if (act === 'duplicate') this.duplicateSelected(id);
      else if (act === 'lock') this.toggleLock(id);
      else if (act === 'hide') this.toggleHidden(id);
    },

    inlineEditElement: function () {
      return editing ? editing.el : null;
    },

    finishInlineEdit: function () {
      if (!editing) return false;
      finishEdit(false, { noHighlight: true });
      return true;
    },

    clearScreen: function () {
      S.State.data.screen = [];
      S.State.data.selectedId = null;
      S.State.commit(null);
      this.refresh('structure');
      U.toast(S.State.data.target === 'app' ? 'Screen cleared' : 'Page cleared');
    },

    setTarget: function (target) {
      var d = S.State.data;
      if (!S.targets[target] || d.target === target) return;

      d.stash[d.target] = { screen: d.screen, device: d.device, selectedId: d.selectedId };

      var entry = d.stash[target];
      if (!entry) {
        entry = S.newTarget(target);
        d.stash[target] = entry;
      }

      d.target = target;
      d.screen = entry.screen;
      d.device = entry.device;
      d.selectedId = entry.selectedId || null;
      S.iconTarget = null;

      S.State.commit('target:' + target);
      this.refresh('all');
      this.loadThemeFonts();
      this.autoFit = true;
      this.requestFit();
      U.toast(S.targets[target].label + ' canvas');
    },

    applyTemplate: function (id) {
      var d = S.State.data;
      var built = S.buildTemplate(d.target, id);
      if (!built.template) return;

      d.screen = built.screen;
      d.device = built.device;
      d.selectedId = null;
      d.theme = built.theme;

      S.State.commit('template:' + id);
      this.refresh('all');
      this.loadThemeFonts();
      this.autoFit = true;
      this.requestFit();
      U.toast(built.template.label + ' template applied · Ctrl+Z to undo');
    },

    requestFit: function () {
      var self = this;
      requestAnimationFrame(function () {
        if (self.fitStage) self.fitStage();
      });
    },

    scrollToBottom: function () {
      requestAnimationFrame(function () {
        document.querySelectorAll('.screen-surface').forEach(function (el) {
          el.scrollTop = el.scrollHeight;
        });
      });
    },

    showTab: function (name) {
      document.querySelectorAll('.ptab').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-tab') === name);
      });
      ['inspect', 'theme', 'type', 'icons'].forEach(function (tab) {
        var el = document.getElementById('tab-' + tab);
        if (el) el.hidden = tab !== name;
      });
      if (name === 'theme') S.Theme.sync();
      if (name === 'type') S.Fonts.sync();
      if (name === 'icons') S.IconsPanel.sync();
    },

    refresh: function (kind) {
      S.Render.drawScreen();
      S.Render.layers();
      S.Render.chrome();
      if (kind === 'structure' || kind === 'all') S.Inspector.render();
      if (kind === 'all') {
        S.Render.palette();
        S.Render.templates();
        S.Theme.sync();
        S.Fonts.sync();
        S.IconsPanel.sync();
      }
    },

    undo: function () {
      if (S.State.undo()) {
        this.refresh('all');
        if (this.autoFit) this.requestFit();
        U.toast('Undone');
      }
    },

    redo: function () {
      if (S.State.redo()) {
        this.refresh('all');
        if (this.autoFit) this.requestFit();
        U.toast('Redone');
      }
    },

    bindToolbar: function () {
      var self = this;
      var undo = $('#btn-undo');
      var redo = $('#btn-redo');
      var preview = $('#btn-preview');
      var compare = $('#btn-compare');
      var reset = $('#btn-reset');
      var exportBtn = $('#btn-export');
      var uiTheme = $('#btn-ui-theme');

      if (undo) undo.addEventListener('click', function () { self.undo(); });
      if (redo) redo.addEventListener('click', function () { self.redo(); });
      if (preview) preview.addEventListener('click', function () { self.setPreview(); });
      if (compare) compare.addEventListener('click', function () { S.Fonts.toggleCompare(); });
      if (exportBtn) exportBtn.addEventListener('click', function () { S.Export.open(); });
      if (uiTheme) uiTheme.addEventListener('click', function () { self.toggleUITheme(); });
      if (reset) {
        reset.addEventListener('click', function () {
          if (!confirm('Reset the project, theme and fonts to the starting demo?')) return;
          S.State.reset();
          self.refresh('all');
          self.loadThemeFonts();
          self.autoFit = true;
          self.requestFit();
          U.toast('Reset to demo');
        });
      }
    },

    bindLeftTabs: function () {
      var self = this;
      var nav = document.getElementById('left-tabs');
      if (!nav) return;

      nav.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-ltab]');
        if (!btn) return;
        self.showLeftTab(btn.getAttribute('data-ltab'));
      });

      /* WAI-ARIA tab keyboard pattern: arrows, Home and End. */
      nav.addEventListener('keydown', function (e) {
        var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (keys.indexOf(e.key) === -1) return;
        var tabs = Array.prototype.slice.call(nav.querySelectorAll('.ltab'));
        var index = tabs.indexOf(document.activeElement);
        if (index < 0) index = tabs.findIndex(function (b) { return b.classList.contains('active'); });
        if (e.key === 'ArrowLeft') index = (index - 1 + tabs.length) % tabs.length;
        else if (e.key === 'ArrowRight') index = (index + 1) % tabs.length;
        else if (e.key === 'Home') index = 0;
        else index = tabs.length - 1;
        e.preventDefault();
        tabs[index].focus();
        self.showLeftTab(tabs[index].getAttribute('data-ltab'));
      });
    },

    bindBlockSearch: function () {
      var self = this;
      var input = document.getElementById('block-search');
      var clear = document.getElementById('block-search-clear');
      if (!input) return;

      function apply() {
        self.blockQuery = input.value.trim();
        if (clear) clear.hidden = !self.blockQuery;
        S.Render.palette();
      }

      input.addEventListener('input', apply);
      input.addEventListener('search', apply);
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        e.preventDefault();
        input.value = '';
        apply();
      });

      if (clear) {
        clear.addEventListener('click', function () {
          input.value = '';
          apply();
          input.focus();
        });
      }
    },

    bindDeviceMenu: function () {
      var self = this;
      var btn = document.getElementById('device-btn');
      var menu = document.getElementById('device-menu');
      if (!btn || !menu) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.toggleDeviceMenu();
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          self.openDeviceMenu(true);
        }
      });

      menu.addEventListener('click', function (e) {
        var item = e.target.closest('[data-device-id]');
        if (!item) return;
        self.setDevice(item.getAttribute('data-device-id'));
      });

      menu.addEventListener('keydown', function (e) {
        var items = Array.prototype.slice.call(menu.querySelectorAll('.dm-item'));
        if (!items.length) return;
        var index = items.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(index + 1 + items.length) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(index - 1 + items.length) % items.length].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          self.closeDeviceMenu(true);
        }
      });

      document.addEventListener('pointerdown', function (e) {
        if (menu.hidden) return;
        if (e.target.closest && e.target.closest('.device-switch')) return;
        self.closeDeviceMenu();
      });
    },

    bindMoreMenu: function () {
      var self = this;
      var btn = document.getElementById('btn-more');
      var menu = document.getElementById('tb-more-menu');
      if (!btn || !menu) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menu.hidden;
        menu.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          self.closeDeviceMenu();
          var first = menu.querySelector('.tm-item');
          if (first) first.focus();
        }
      });

      menu.addEventListener('keydown', function (e) {
        var items = Array.prototype.slice.call(menu.querySelectorAll('.tm-item'));
        var index = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (items.length) items[(index + 1) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (items.length) items[(index - 1 + items.length) % items.length].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          self.closeMoreMenu(true);
        }
      });

      /* Menu actions reuse the existing buttons; the menu just gets out of the way. */
      menu.addEventListener('click', function (e) {
        if (e.target.closest('.tm-item')) self.closeMoreMenu();
      });

      document.addEventListener('pointerdown', function (e) {
        if (menu.hidden) return;
        if (e.target.closest && e.target.closest('.tb-menu-wrap')) return;
        self.closeMoreMenu();
      });
    },

    closeMoreMenu: function (returnFocus) {
      var menu = document.getElementById('tb-more-menu');
      var btn = document.getElementById('btn-more');
      if (!menu) return;
      var wasOpen = !menu.hidden;
      menu.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (returnFocus && wasOpen && btn) btn.focus();
    },

    bindViewport: function () {
      var self = this;
      window.addEventListener('resize', U.debounce(function () {
        if (self.autoFit && self.fitStage) self.fitStage();
      }, 140));
    },

    bindTargets: function () {
      var self = this;
      document.querySelectorAll('#target-switch [data-target]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          self.setTarget(btn.getAttribute('data-target'));
        });
      });
    },

    bindTemplates: function () {
      var self = this;
      var box = $('#templates');
      if (!box) return;
      box.addEventListener('click', function (e) {
        var tpl = e.target.closest('[data-tpl]');
        if (!tpl) return;
        self.applyTemplate(tpl.getAttribute('data-tpl'));
      });
    },

    bindTabs: function () {
      var self = this;
      document.querySelectorAll('.ptab').forEach(function (btn) {
        btn.addEventListener('click', function () {
          self.showTab(btn.getAttribute('data-tab'));
        });
      });
    },

    bindPalette: function () {
      var self = this;
      var palette = $('#palette');
      if (!palette) return;
      palette.addEventListener('click', function (e) {
        var block = e.target.closest('[data-type]');
        if (!block) return;
        self.addBlock(block.getAttribute('data-type'));
      });
    },

    bindLayers: function () {
      var self = this;
      var list = $('#layers');
      if (!list) return;

      list.addEventListener('click', function (e) {
        var li = e.target.closest('.layer');
        if (!li) return;
        var id = li.getAttribute('data-id');
        var actBtn = e.target.closest('[data-act]');

        if (actBtn) {
          var act = actBtn.getAttribute('data-act');
          self.handleBlockAction(id, act);
          return;
        }

        self.select(id);
      });
    },

    bindStage: function () {
      var self = this;
      var stage = $('#stage');
      if (!stage) return;

      /* If the user starts using another panel while text is being edited,
         save first. Clicks inside the stage are handled by its click listener. */
      document.addEventListener('pointerdown', function (e) {
        if (!editing) return;
        if (editing.el.contains(e.target)) return;
        if (e.target.closest && e.target.closest('#stage')) return;
        var keep = !!(e.target.closest && e.target.closest('#tab-inspect'));
        finishEdit(false, { keepInspector: keep, noHighlight: keep });
      }, true);

      function findEditEl(id, path) {
        var cmp = stage.querySelector('.cmp[data-id="' + id + '"]');
        if (!cmp) return null;
        var found = null;
        Array.prototype.forEach.call(cmp.querySelectorAll('[data-edit]'), function (el) {
          if (el.getAttribute('data-edit') === path) found = el;
        });
        return found;
      }

      stage.addEventListener('click', function (e) {
        if (S.Drag && S.Drag.shouldIgnoreClick && S.Drag.shouldIgnoreClick()) return;
        if (self.previewMode) return;
        if (S.State.data.compare.on) return;

        if (!e.target.closest('.mock-frame')) {
          if (editing) finishEdit(false);
          return;
        }

        /* Read the target ids before finishEdit might redraw the preview. */
        var chromeBtn = e.target.closest('.cmp-chrome [data-act]');
        var chromeCmp = chromeBtn ? chromeBtn.closest('.cmp') : null;
        var resizeHit = e.target.closest('.cmp-resize');
        var cmpOld = e.target.closest('.cmp');
        var editOld = e.target.closest('[data-edit]');

        if (editing && editing.el.contains(e.target)) return;
        if (editing) finishEdit(false);

        if (chromeBtn && chromeCmp) {
          e.preventDefault();
          self.handleBlockAction(chromeCmp.getAttribute('data-id'), chromeBtn.getAttribute('data-act'));
          return;
        }
        if (resizeHit) return;

        if (!cmpOld) {
          self.select(null);
          return;
        }

        var id = cmpOld.getAttribute('data-id');
        var path = editOld ? editOld.getAttribute('data-edit') : null;
        e.preventDefault();

        if (path) {
          if (S.State.data.selectedId !== id) self.select(id);
          self.showTab('inspect');
          var item = self.blockById(id);
          if (!item) return;
          if (item.locked) {
            U.toast('Block is locked — unlock it to edit');
            S.Inspector.highlight(path);
            return;
          }
          startInlineEdit(findEditEl(id, path) || editOld, item, path);
          return;
        }

        self.select(id);
      });

      stage.addEventListener('focusout', function (e) {
        if (!editing || editing.el !== e.target) return;
        setTimeout(function () {
          if (!editing) return;
          var active = document.activeElement;
          if (active && editing.el.contains(active)) return;
          var keep = !!(active && active.closest && active.closest('#tab-inspect'));
          finishEdit(false, { keepInspector: keep, noHighlight: keep });
        }, 0);
      });

      stage.addEventListener('keydown', function (e) {
        if (!editing) return;
        if (e.key === 'Enter') {
          e.preventDefault();
          finishEdit(false);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          finishEdit(true);
        }
      });
    },

    bindKeyboard: function () {
      var self = this;
      document.addEventListener('keydown', function (e) {
        /* Preview is read-only: only Esc matters there. */
        if (self.previewMode) {
          if (e.key === 'Escape') {
            e.preventDefault();
            self.setPreview(false);
          }
          return;
        }

        var tag = (e.target.tagName || '').toLowerCase();
        var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          if (typing) return;
          e.preventDefault();
          if (e.shiftKey) self.redo(); else self.undo();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          if (typing) return;
          e.preventDefault();
          self.redo();
          return;
        }
        if (typing) return;

        if (e.key === '/') {
          e.preventDefault();
          self.showLeftTab('blocks');
          var search = document.getElementById('block-search');
          if (search) search.focus();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
          e.preventDefault();
          if (self.selected()) self.duplicateSelected();
          return;
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (self.selected()) { e.preventDefault(); self.deleteSelected(); }
          return;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          if (self.selected()) {
            e.preventDefault();
            self.moveSelected((e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 1);
          }
          return;
        }
        if (e.key === 'Escape') {
          var deviceMenu = document.getElementById('device-menu');
          if (deviceMenu && !deviceMenu.hidden) { self.closeDeviceMenu(true); return; }
          var moreMenu = document.getElementById('tb-more-menu');
          if (moreMenu && !moreMenu.hidden) { self.closeMoreMenu(true); return; }
          S.Export.close();
        }
      });
    },

    bindModal: function () {
      var modal = $('#export-modal');
      var close = $('#export-close');
      var copy = $('#export-copy');
      var download = $('#export-download');

      if (close) close.addEventListener('click', function () { S.Export.close(); });
      if (copy) copy.addEventListener('click', function () { S.Export.copy(); });
      if (download) download.addEventListener('click', function () { S.Export.download(); });
      if (modal) {
        modal.addEventListener('click', function (e) {
          if (e.target === modal) S.Export.close();
        });
      }
    },

    bindZoom: function () {
      var self = this;
      var inBtn = $('#zoom-in');
      var outBtn = $('#zoom-out');
      var fitBtn = $('#zoom-fit');
      var stage = $('#stage');

      function apply(z) {
        self.autoFit = false;
        S.Render.zoom = Math.floor(U.clamp(z, 0.15, 1.25) * 100) / 100;
        S.Render.drawScreen();
      }

      function fit() {
        if (!stage) return;
        self.autoFit = true;
        var d = S.State.data;
        var wraps = stage.querySelectorAll('.device-wrap');
        var bar = stage.querySelector('.stage-bar');
        var devices = document.getElementById('devices');
        var cs = devices ? getComputedStyle(devices) : null;

        /* Use the real paddings so the fitted frame does not create a
           scrollbar in the stage. */
        var padX = cs ? parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) : 48;
        var padY = cs ? parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) : 96;
        var barH = bar ? bar.getBoundingClientRect().height : 0;
        var availW = Math.max(260, stage.clientWidth - padX);
        var availH = Math.max(240, stage.clientHeight - barH - padY);

        var frameW = d.device.width;
        var frameH = d.device.height;
        if (wraps.length && S.Render.zoom > 0) {
          var first = wraps[0].getBoundingClientRect();
          frameW = first.width / S.Render.zoom;
          frameH = first.height / S.Render.zoom;
        }

        var count = wraps.length || (d.compare && d.compare.on ? 3 : 1);
        var gap = count > 1 ? 22 : 0;
        var totalW = count * frameW + (count - 1) * gap;
        apply(Math.min(availW / totalW, availH / frameH));
        /* apply() disables auto-fit for manual zooms; this was an auto fit. */
        self.autoFit = true;
      }

      if (inBtn) inBtn.addEventListener('click', function () { apply(S.Render.zoom + 0.08); });
      if (outBtn) outBtn.addEventListener('click', function () { apply(S.Render.zoom - 0.08); });
      if (fitBtn) fitBtn.addEventListener('click', fit);
      self.apply = apply;
      self.fitStage = fit;
    }
  };

  /* Begin editing a [data-edit] element in the preview. */
  function startInlineEdit(el, item, path) {
    if (!el || !item) return;
    if (editing) finishEdit(false);

    editing = {
      el: el,
      item: item,
      path: path || el.getAttribute('data-edit'),
      original: el.textContent
    };
    el.setAttribute('contenteditable', 'true');
    el.classList.add('inline-edit');
    try { el.focus(); } catch (err) { /* ignore */ }

    try {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (err) { /* ignore */ }

    // Point the user at the matching inspector field.
    if (S.Inspector && S.Inspector.highlight) S.Inspector.highlight(editing.path);
  }

  /* Save or cancel the active inline edit.
     opts.keepInspector keeps the right panel DOM alive so a click that is
     already in progress is not destroyed by a re-render. */
  function finishEdit(cancel, opts) {
    opts = opts || {};
    if (!editing) return;

    var state = editing;
    editing = null;
    state.el.removeAttribute('contenteditable');
    state.el.classList.remove('inline-edit');

    if (cancel) {
      state.el.textContent = state.original;
      return;
    }

    var text = state.el.textContent.replace(/\s+/g, ' ').trim();
    if (text === state.original) {
      if (!opts.keepInspector) S.Inspector.render();
      return;
    }

    U.setPath(state.item.props, state.path, text);
    S.State.commit('inline:' + state.item.id + ':' + state.path);
    S.Render.drawScreen();

    if (opts.keepInspector && S.Inspector.syncField) {
      S.Inspector.syncField(state.path, text);
    } else {
      S.Inspector.render();
    }
    if (!opts.noHighlight && S.Inspector.highlight) S.Inspector.highlight(state.path);
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'mockup-styles';
    style.textContent = S.mockupCSS +
      '\n.screen-surface [contenteditable="true"]{outline:2px solid #6aa4ff;outline-offset:2px;border-radius:2px;cursor:text}' +
      '\n.screen-surface [data-edit]{cursor:text}';
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { S.App.init(); });
  } else {
    S.App.init();
  }
})();
