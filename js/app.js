/* Boot + all the editor wiring. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var editing = null;

  function $(sel) { return document.querySelector(sel); }


  /* Universal In-App Prompt Dialog (Bypasses browser window.prompt blocking) */
  S.prompt = function (title, defaultValue, callback) {
    var modal = document.getElementById('app-prompt-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'app-prompt-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML =
        '<div class="modal prompt-modal" style="max-width:380px">' +
        '<div class="modal-head"><strong class="pm-title" id="apm-title">Prompt</strong><button type="button" class="tb-btn icon-only" id="apm-close"><span class="mi">close</span></button></div>' +
        '<div class="modal-body" style="padding:16px 20px">' +
        '<input type="text" class="f-input" id="apm-input" style="width:100%;height:36px;font-size:14px;padding:6px 12px;box-sizing:border-box">' +
        '<div class="f-pair" style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">' +
        '<button type="button" class="tb-btn" id="apm-cancel">Cancel</button>' +
        '<button type="button" class="tb-btn primary" id="apm-save">Save</button>' +
        '</div></div></div>';
      document.body.appendChild(modal);
    }

    var titleEl = document.getElementById('apm-title');
    var inputEl = document.getElementById('apm-input');
    var closeBtn = document.getElementById('apm-close');
    var cancelBtn = document.getElementById('apm-cancel');
    var saveBtn = document.getElementById('apm-save');

    if (titleEl) titleEl.textContent = title || 'Enter value';
    if (inputEl) inputEl.value = defaultValue || '';
    modal.hidden = false;

    function finish(val) {
      modal.hidden = true;
      if (typeof callback === 'function') callback(val);
    }

    if (closeBtn) closeBtn.onclick = function () { finish(null); };
    if (cancelBtn) cancelBtn.onclick = function () { finish(null); };
    if (saveBtn) saveBtn.onclick = function () { finish(inputEl.value); };

    if (inputEl) {
      inputEl.onkeydown = function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          finish(inputEl.value);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          finish(null);
        }
      };
      setTimeout(function () {
        inputEl.focus();
        inputEl.select();
      }, 50);
    }
  };

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
      this.bindStarterModal();
      S.State.init();
      S.Render.zoom = this.zoom;

      S.Render.palette();
      S.Render.templates();
      S.Theme.init();
      S.Fonts.init();
      S.IconsPanel.init();
      S.Render.all();
      S.Inspector.render();
      S.Typography.init();
      this.loadThemeFonts();

      this.bindToolbar();
      this.bindTabs();
      this.bindLeftTabs();
      this.bindBlockSearch();
      this.bindTargets();
      this.bindTemplates();
      this.bindPalette();
      this.bindLayers();
      this.bindPages();
      this.bindStage();
      this.bindCanvasHud();
      this.bindSpeedDial();
      this.bindGutterRail();
      this.bindLinkPill();
      if (S.IconSwitcher && S.IconSwitcher.init) S.IconSwitcher.init();
      if (S.ConnectPanel && S.ConnectPanel.init) S.ConnectPanel.init();
      if (S.Interactions) S.Interactions.init();
      this.bindKeyboard();
      this.bindModal();
      if (S.Import && S.Import.init) S.Import.init();
      this.bindZoom();
      this.bindDeviceMenu();
      this.bindMoreMenu();
      this.bindViewport();
      S.Drag.init();
      if (S.ContextMenu && S.ContextMenu.init) S.ContextMenu.init();

      this.showLeftTab(this.leftTab, true);
      this.requestFit();

      var hasSavedProject = false;
      try { hasSavedProject = !!localStorage.getItem('droidlab.v1'); } catch (e) {}
      if (!hasSavedProject) {
        S.State.startBlank('app');
        this.openStarterModal();
      }

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
      var names = ['templates', 'blocks', 'pages', 'layers'];
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
      if (name === 'pages') S.Render.pages();
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
      if (next && S.iconTarget && !S.iconTarget.ui && S.iconTarget.id !== next) S.iconTarget = null;

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

      this.updateCanvasHud(next);
      this.updateCanvasGutterRail(next);
      this.updateCanvasLinkPill(next);
      S.Render.layers();
      S.Inspector.render();
      if (changed) this.showTab('inspect');
    },

    updateCanvasHud: function (id) {
      var hud = document.getElementById("canvas-hud");
      if (!hud) return;
      if (!id) {
        hud.hidden = true;
        return;
      }
      var item = this.blockById(id);
      if (!item) {
        hud.hidden = true;
        return;
      }
      var def = S.components[item.type];
      var iconEl = document.getElementById("chud-icon");
      var titleEl = document.getElementById("chud-title");
      var lockIcon = document.getElementById("chud-lock-icon");
      var hideIcon = document.getElementById("chud-hide-icon");

      if (iconEl) iconEl.textContent = (def && def.icon) ? def.icon : "widgets";
      if (titleEl) titleEl.textContent = (def && def.label) ? def.label : item.type;
      if (lockIcon) lockIcon.textContent = item.locked ? "lock" : "lock_open";
      if (hideIcon) hideIcon.textContent = item.hidden ? "visibility_off" : "visibility";

      hud.hidden = false;
    },

    bindCanvasHud: function () {
      var self = this;
      var hud = document.getElementById("canvas-hud");
      if (!hud) return;
      hud.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-chud]");
        if (!btn) return;
        var act = btn.getAttribute("data-chud");
        var selId = S.State.data.selectedId;
        if (!selId) return;
        self.handleBlockAction(selId, act);
        self.updateCanvasHud(S.State.data.selectedId);
      });
    },

    updateCanvasGutterRail: function (id) {
      var rail = document.getElementById('canvas-gutter-rail');
      if (!rail) return;
      if (!id) {
        rail.hidden = true;
        return;
      }
      var cmp = document.querySelector('.screen-surface .cmp[data-id="' + id + '"]');
      var frame = document.querySelector('.mock-frame');
      if (!cmp || !frame) {
        rail.hidden = true;
        return;
      }

      var cmpRect = cmp.getBoundingClientRect();
      var frameRect = frame.getBoundingClientRect();
      var stageEl = document.getElementById('stage');
      var stageRect = stageEl ? stageEl.getBoundingClientRect() : { left: 0, top: 0 };

      var left = (frameRect.left - stageRect.left) - 40;
      var top = (cmpRect.top - stageRect.top);
      if (left < 10) left = 10;
      if (top < 50) top = 50;

      rail.style.left = left + 'px';
      rail.style.top = top + 'px';

      var item = this.blockById(id);
      var lockIcon = document.getElementById('cgr-lock-icon');
      var hideIcon = document.getElementById('cgr-hide-icon');
      if (item && lockIcon) lockIcon.textContent = item.locked ? 'lock' : 'lock_open';
      if (item && hideIcon) hideIcon.textContent = item.hidden ? 'visibility_off' : 'visibility';

      rail.hidden = false;
    },

    updateCanvasLinkPill: function (id) {
      var pill = document.getElementById('canvas-link-pill');
      if (!pill) return;
      if (!id) {
        pill.hidden = true;
        return;
      }
      var item = this.blockById(id);
      if (!item || !item.props) {
        pill.hidden = true;
        return;
      }

      var isLinkable = item.type === 'button' || item.type === 'card' || item.type === 'miniplayer' || item.type === 'settingslist' || item.type.indexOf('bottomnav') === 0;
      if (!isLinkable) {
        pill.hidden = true;
        return;
      }

      var cmp = document.querySelector('.screen-surface .cmp[data-id="' + id + '"]');
      var frame = document.querySelector('.mock-frame');
      if (!cmp || !frame) {
        pill.hidden = true;
        return;
      }

      var cmpRect = cmp.getBoundingClientRect();
      var frameRect = frame.getBoundingClientRect();
      var stageEl = document.getElementById('stage');
      var stageRect = stageEl ? stageEl.getBoundingClientRect() : { left: 0, top: 0 };

      var left = (frameRect.right - stageRect.left) + 12;
      var top = (cmpRect.top - stageRect.top);

      pill.style.left = left + 'px';
      pill.style.top = top + 'px';

      var select = document.getElementById('clp-target');
      if (select) {
        var pagesList = S.State.data.pages || [];
        var curTarget = item.props.navTarget || '';
        select.innerHTML = '<option value=""' + (!curTarget ? ' selected' : '') + '>No Screen Link</option>' +
          pagesList.map(function (p) {
            var on = curTarget === p.id || curTarget === p.name.toLowerCase();
            return '<option value="' + p.id + '"' + (on ? ' selected' : '') + '>' + p.name + '</option>';
          }).join('') +
          '<option value="__create_settings__">+ Create Settings</option>' +
          '<option value="__create_player__">+ Create Player</option>';
      }

      pill.hidden = false;
    },

    bindSpeedDial: function () {
      var self = this;
      var fab = document.getElementById('sd-fab');
      var menu = document.getElementById('sd-menu');
      if (!fab || !menu) return;

      fab.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = !menu.hidden;
        menu.hidden = isOpen;
        fab.classList.toggle('is-open', !isOpen);
      });

      menu.addEventListener('click', function (e) {
        var blockBtn = e.target.closest('[data-sd-block]');
        var item = e.target.closest('[data-sd-template]');
        if (!blockBtn && !item) return;

        menu.hidden = true;
        fab.classList.remove('is-open');

        // Essential Header & Bottom Navigation Bar Creation
        if (blockBtn) {
          var bType = blockBtn.getAttribute('data-sd-block');
          var bStyle = blockBtn.getAttribute('data-sd-style');
          self.addBlock(bType);
          if (bStyle && S.State.syncNavStyle) {
            S.State.syncNavStyle(bStyle);
          }
          self.refresh('all');
          var def = S.components[bType];
          U.toast('Added ' + (def ? def.label : bType) + ' to active screen');
          return;
        }

        // Screen Creation
        if (item) {
          var tpl = item.getAttribute('data-sd-template');
          if (tpl === 'import') {
            var importModal = document.getElementById('import-modal');
            if (importModal) importModal.hidden = false;
            return;
          }
          if (tpl === 'blank') {
            var bPage = S.State.addPage(null, { blank: true, screen: [] });
            self.refresh('all');
            U.toast('Blank screen added');
            return;
          }
          var newPage = S.State.addPage(tpl);
          self.refresh('all');
          if (S.ConnectPanel) S.ConnectPanel.render();
          U.toast('New screen created: ' + (newPage ? newPage.name : 'Screen'));
        }
      });

      document.addEventListener('pointerdown', function (e) {
        if (!menu.hidden && !menu.contains(e.target) && e.target !== fab) {
          menu.hidden = true;
          fab.classList.remove('is-open');
        }
      });
    },

    bindGutterRail: function () {
      var self = this;
      var rail = document.getElementById('canvas-gutter-rail');
      if (!rail) return;

      rail.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-cgr]');
        if (!btn) return;
        var act = btn.getAttribute('data-cgr');
        var selId = S.State.data.selectedId;
        if (!selId) return;
        self.handleBlockAction(selId, act);
        self.updateCanvasGutterRail(S.State.data.selectedId);
      });
    },

    bindLinkPill: function () {
      var self = this;
      var pill = document.getElementById('canvas-link-pill');
      if (!pill) return;

      var select = document.getElementById('clp-target');
      if (select) {
        select.addEventListener('change', function () {
          var selId = S.State.data.selectedId;
          if (!selId) return;
          var val = select.value;
          if (val === '__create_settings__') {
            var sp = S.State.addPage('settings');
            val = sp ? sp.id : 'settings';
          } else if (val === '__create_player__') {
            var pp = S.State.addPage('player');
            val = pp ? pp.id : 'player';
          }
          var block = self.blockById(selId);
          if (block && block.props) {
            block.props.navTarget = val;
            S.State.commit('link-target:' + selId + ':' + val);
            U.toast('✓ Connected to ' + val);
            if (S.ConnectPanel) S.ConnectPanel.render();
          }
        });
      }

      var testBtn = document.getElementById('clp-test');
      if (testBtn) {
        testBtn.addEventListener('click', function () {
          var selId = S.State.data.selectedId;
          if (!selId) return;
          var block = self.blockById(selId);
          var target = block && block.props ? block.props.navTarget : '';
          if (target && S.Interactions && S.Interactions.transitionToPage) {
            S.Interactions.transitionToPage(target, (block.props && block.props.transition) || 'slide');
            U.toast('▶ Playing transition in phone');
          } else {
            U.toast('Connect a screen first');
          }
        });
      }
    },

    addBlock: function (type) {
      var def = S.components[type];
      if (!def) return;
      var item = S.makeBlock(type);
      if (!item) return;

      var d = S.State.data;
      var isNav = type === 'bottomnav' || (typeof type === 'string' && type.indexOf('bottomnav') === 0);
      var isTopBar = type === 'appbar' || type === 'searchheader' || type === 'profilebar' || type === 'storeheader' || type === 'capsuleheader';
      var isTabsBlock = type === 'tabs' || (typeof type === 'string' && type.indexOf('tabs') === 0);

      // --- Smart Bottom Navigation Handling ---
      if (isNav) {
        var navStyle = (item.props && item.props.style) || 'material';
        if (type === 'bottomnavfloating') navStyle = 'floating';
        else if (type === 'bottomnavfab') navStyle = 'center-fab';
        else if (type === 'bottomnavexpanding') navStyle = 'expanding-pill';
        else if (type === 'bottomnavglass') navStyle = 'glass';

        var existingNav = (d.screen || []).filter(function (b) {
          return b.type === 'bottomnav' || (b.type && b.type.indexOf('bottomnav') === 0);
        })[0];

        if (existingNav) {
          // Replace/update style on existing bottom nav in-place; NEVER duplicate!
          existingNav.type = 'bottomnav';
          existingNav.props = existingNav.props || {};
          existingNav.props.style = navStyle;
          S.State.syncNavStyle(navStyle);
          S.State.syncNavFromPages();
          d.selectedId = existingNav.id;
          S.State.commit('prop:' + existingNav.id + ':style');
          this.refresh('structure');
          this.select(existingNav.id);
          U.toast(def.label + ' style applied across screens');
          return;
        }

        item.type = 'bottomnav';
        item.props = item.props || {};
        item.props.style = navStyle;
        d.screen.push(item);
        d.selectedId = item.id;
        S.State.syncNavStyle(navStyle);
        S.State.syncNavFromPages();
        S.State.commit('block:add:bottomnav');
        this.refresh('structure');
        this.select(item.id);
        U.toast(def.label + ' added');
        return;
      }

      // --- Smart Top App Bar Handling ---
      if (isTopBar) {
        var headerVariant = (item.props && item.props.variant) || 'small';
        if (type === 'searchheader') headerVariant = 'search';
        else if (type === 'profilebar') headerVariant = 'profile';
        else if (type === 'storeheader') headerVariant = 'store';
        else if (type === 'capsuleheader') headerVariant = 'capsule';

        var existingBar = (d.screen || []).filter(function (b) {
          return b.type === 'appbar' || b.type === 'searchheader' || b.type === 'profilebar' || b.type === 'storeheader' || b.type === 'capsuleheader';
        })[0];

        if (existingBar) {
          // Update existing top bar variant in-place
          existingBar.type = 'appbar';
          existingBar.props = Object.assign({}, existingBar.props, item.props, { variant: headerVariant });
          d.selectedId = existingBar.id;
          S.State.commit('prop:' + existingBar.id + ':variant');
          this.refresh('structure');
          this.select(existingBar.id);
          U.toast(def.label + ' updated');
          return;
        }

        item.type = 'appbar';
        item.props = item.props || {};
        item.props.variant = headerVariant;
        // Insert at index 0 (top of screen)
        d.screen.unshift(item);
        d.selectedId = item.id;
        S.State.commit('block:add:appbar');
        this.refresh('structure');
        this.select(item.id);
        U.toast(def.label + ' added at top');
        return;
      }

      // --- Smart Tabs Handling ---
      if (isTabsBlock) {
        var tabStyle = (item.props && item.props.style) || 'underline';
        if (type === 'tabspill') tabStyle = 'pill';
        else if (type === 'tabssegmented') tabStyle = 'segmented';
        else if (type === 'tabsbadge') tabStyle = 'badge';
        else if (type === 'tabsicon') tabStyle = 'stacked-icon';

        var existingTabs = (d.screen || []).filter(function (b) {
          return b.type === 'tabs' || (b.type && b.type.indexOf('tabs') === 0);
        })[0];

        if (existingTabs) {
          existingTabs.type = 'tabs';
          existingTabs.props = existingTabs.props || {};
          existingTabs.props.style = tabStyle;
          d.selectedId = existingTabs.id;
          S.State.commit('prop:' + existingTabs.id + ':style');
          this.refresh('structure');
          this.select(existingTabs.id);
          U.toast(def.label + ' style updated');
          return;
        }

        item.type = 'tabs';
        item.props = item.props || {};
        item.props.style = tabStyle;
      }

      d.screen.push(item);
      d.selectedId = item.id;
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
      S.State.syncActivePage();
      S.State.commit(null);
      this.refresh('structure');
      U.toast(S.State.data.target === 'app' ? 'Screen cleared' : 'Page cleared');
    },

    /* Open another bottom-navigation screen while staying in the editor. */
    switchPageIndex: function (index) {
      if (!S.State.switchPageIndex(index)) return;
      this.select(null);
      U.toast('Editing “' + (S.State.data.pages[index] || {}).name + '”');
    },

    /* Horizontal music-card rails use native scrolling; the arrow buttons just
       move them by roughly one viewport. Works in preview and export too. */
    scrollRail: function (button) {
      if (!button) return;
      var host = button.closest('.listen-now') || button.closest('.cmp');
      var rail = host && host.querySelector('.ln-rail');
      if (!rail) return;
      var direction = button.getAttribute('data-rail') === 'prev' ? -1 : 1;
      var step = Math.max(120, Math.round(rail.clientWidth * 0.8)) * direction;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (rail.scrollBy) {
        rail.scrollBy({ left: step, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        rail.scrollLeft += step;
      }
    },

    startRenamePage: function (pageId) {
      var cur = S.State.pageById(pageId);
      if (!cur) return;
      var self = this;

      if (this.showLeftTab) this.showLeftTab('pages');

      var row = document.querySelector('.page-row[data-page-id="' + pageId + '"]');
      if (!row) {
        S.prompt('Rename Screen', cur.name, function (nextName) {
          if (nextName && nextName.trim()) {
            S.State.renamePage(pageId, nextName.trim());
            self.refresh('all');
            U.toast('Renamed to “' + nextName.trim() + '”');
          }
        });
        return;
      }

      var nameEl = row.querySelector('.page-name');
      if (!nameEl) return;
      if (nameEl.querySelector('input')) return; // already inline editing

      var oldName = cur.name;
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'f-input page-rename-input';
      input.value = oldName;
      input.setAttribute('aria-label', 'Screen name');

      var committed = false;
      function commit() {
        if (committed) return;
        committed = true;
        var next = input.value.trim();
        if (next && next !== oldName) {
          S.State.renamePage(pageId, next);
          self.refresh('all');
          U.toast('Renamed to “' + next + '”');
        } else {
          nameEl.textContent = oldName;
        }
      }

      function cancel() {
        if (committed) return;
        committed = true;
        nameEl.textContent = oldName;
      }

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancel();
        }
      });

      input.addEventListener('blur', function () {
        commit();
      });

      nameEl.innerHTML = '';
      nameEl.appendChild(input);
      input.focus();
      input.select();
    },
    setTarget: function (target) {
      var d = S.State.data;
      if (!S.targets[target] || d.target === target) return;

      S.State.syncActivePage();
      d.stash = d.stash || {};

      // 1. Completely stash the current target workspace
      d.stash[d.target] = {
        screen: d.screen,
        device: d.device,
        selectedId: d.selectedId,
        pages: d.pages,
        activePageId: d.activePageId,
        theme: d.theme
      };

      // 2. Load or initialize isolated destination target workspace
      var entry = d.stash[target];
      if (!entry) {
        var built = S.buildTemplate(target, null);
        var targetPages = [];
        if (target === 'web') {
          var homePage = { id: S.util.uid(), name: 'Home', icon: 'msr:web', screen: built.screen };
          targetPages = [homePage];
          entry = {
            screen: built.screen,
            device: built.device,
            selectedId: null,
            theme: built.theme,
            pages: targetPages,
            activePageId: homePage.id
          };
        } else if (target === 'ext') {
          var popupPage = { id: S.util.uid(), name: 'Popup', icon: 'msr:extension', screen: built.screen };
          targetPages = [popupPage];
          entry = {
            screen: built.screen,
            device: built.device,
            selectedId: null,
            theme: built.theme,
            pages: targetPages,
            activePageId: popupPage.id
          };
        } else {
          // target === 'app'
          var appMade = S.pagesFromScreen(built.screen);
          var activeP = appMade.pages[0];
          entry = {
            screen: built.screen,
            device: built.device,
            selectedId: null,
            theme: built.theme,
            pages: appMade.pages,
            activePageId: activeP ? activeP.id : null
          };
        }
        d.stash[target] = entry;
      }

      d.target = target;
      d.screen = entry.screen || [];
      d.device = entry.device;
      d.selectedId = entry.selectedId || null;
      d.pages = entry.pages || [];
      d.activePageId = entry.activePageId || (d.pages[0] ? d.pages[0].id : null);
      if (entry.theme) d.theme = entry.theme;

      // In website mode, strictly purge any mobile dock blocks (bottomnav / miniplayer)
      if (target === 'web') {
        d.screen = d.screen.filter(function (b) {
          return b.type !== 'bottomnav' && b.type.indexOf('bottomnav') !== 0 && b.type !== 'miniplayer';
        });
      }

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

      /* A template replaces the whole project, so rebuild the screen list too. */
      if (d.target === 'app') {
        if (built.pages && built.pages.length) {
          d.pages = built.pages;
          var active = d.pages.filter(function (p) { return p.id === built.activePageId; })[0] || d.pages[0];
          d.activePageId = active.id;
          d.screen = active.screen;
        } else {
          var made = S.pagesFromScreen(built.screen);
          var active = made.pages.filter(function (p) { return p.id === made.activePageId; })[0] || made.pages[0];
          d.pages = made.pages;
          d.activePageId = active.id;
          d.screen = active.screen;
        }
      }

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
      ['inspect', 'connect', 'theme', 'type', 'icons'].forEach(function (tab) {
        var el = document.getElementById('tab-' + tab);
        if (el) el.hidden = tab !== name;
      });
      if (name === 'inspect') S.Inspector.render();
      if (name === 'connect' && S.ConnectPanel) S.ConnectPanel.render();
      if (name === 'theme') S.Theme.sync();
      if (name === 'type') S.Fonts.sync();
      if (name === 'icons') S.IconsPanel.sync();
    },

    refresh: function (kind) {
      S.Render.drawScreen();
      S.Render.layers();
      S.Render.pages();
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
      var importBtn = $('#btn-import');
      var uiTheme = $('#btn-ui-theme');
      var handoff = $('#btn-handoff');
      var openProject = $('#btn-open-project');
      var importPage = $('#btn-import-page');
      var projectFile = $('#import-project-file');
      var pageFile = $('#import-page-file');

      if (undo) undo.addEventListener('click', function () { self.undo(); });
      if (redo) redo.addEventListener('click', function () { self.redo(); });
      if (preview) preview.addEventListener('click', function () { self.setPreview(); });
      if (compare) compare.addEventListener('click', function () { S.Fonts.toggleCompare(); });
      if (exportBtn) exportBtn.addEventListener('click', function () { S.Export.open('html'); });
      if (importBtn) importBtn.addEventListener('click', function () { if (S.Import && S.Import.open) S.Import.open(); });
      if (uiTheme) uiTheme.addEventListener('click', function () { self.toggleUITheme(); });
      if (handoff) handoff.addEventListener('click', function () {
        self.closeMoreMenu();
        S.Export.open('android');
      });
      if (openProject && projectFile) {
        openProject.addEventListener('click', function () {
          self.closeMoreMenu();
          projectFile.click();
        });
      }
      if (importPage && pageFile) {
        importPage.addEventListener('click', function () {
          self.closeMoreMenu();
          pageFile.click();
        });
      }
      if (projectFile) {
        projectFile.addEventListener('change', function () {
          var file = projectFile.files && projectFile.files[0];
          projectFile.value = '';
          if (file && S.Project) S.Project.readFile(file, 'project');
        });
      }
      if (pageFile) {
        pageFile.addEventListener('change', function () {
          var file = pageFile.files && pageFile.files[0];
          pageFile.value = '';
          if (file && S.Project) S.Project.readFile(file, 'page');
        });
      }
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

    openStarterModal: function () {
      var modal = document.getElementById('starter-modal');
      if (modal) modal.hidden = false;
    },

    closeStarterModal: function () {
      var modal = document.getElementById('starter-modal');
      if (modal) modal.hidden = true;
    },

    bindStarterModal: function () {
      var self = this;
      var modal = document.getElementById('starter-modal');
      if (!modal) return;

      modal.addEventListener('click', function (e) {
        var card = e.target.closest('[data-start-target]');
        if (!card) return;
        var target = card.getAttribute('data-start-target');
        S.State.startBlank(target);
        self.closeStarterModal();
        U.toast('Started blank ' + (target === 'app' ? 'Mobile App' : (target === 'web' ? 'Website' : 'Extension')));
      });

      var closeBtn = document.getElementById('starter-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          self.closeStarterModal();
        });
      }
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
        // Delete custom template
        var delBtn = e.target.closest('[data-tpl-del]');
        if (delBtn) {
          e.preventDefault();
          e.stopPropagation();
          var delId = delBtn.getAttribute('data-tpl-del');
          if (confirm('Delete this custom template?')) {
            if (S.deleteCustomTemplate) S.deleteCustomTemplate(delId);
            S.Render.templates();
            U.toast('Custom template deleted');
          }
          return;
        }

        // Action buttons
        var actBtn = e.target.closest('[data-tpl-action]');
        if (actBtn) {
          e.preventDefault();
          e.stopPropagation();
          var action = actBtn.getAttribute('data-tpl-action');
          if (action === 'save') {
            var name = prompt('Enter a name for this custom design:', 'My Custom Design');
            if (name && name.trim()) {
              if (S.saveCustomTemplate) S.saveCustomTemplate(name.trim(), 'dashboard_customize');
              S.Render.templates();
              U.toast('Custom template "' + name.trim() + '" saved!');
            }
            return;
          }
          if (action === 'export') {
            if (S.exportCustomTemplates) S.exportCustomTemplates();
            U.toast('Exported custom templates as JSON');
            return;
          }
          if (action === 'import') {
            var fileInput = document.getElementById('tpl-file-input');
            if (fileInput) fileInput.click();
            return;
          }
        }

        var tpl = e.target.closest('[data-tpl]');
        if (!tpl) return;
        self.applyTemplate(tpl.getAttribute('data-tpl'));
      });

      // Handle file input for template importing
      box.addEventListener('change', function (e) {
        if (e.target.id !== 'tpl-file-input') return;
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          var count = S.importCustomTemplates ? S.importCustomTemplates(ev.target.result) : 0;
          S.Render.templates();
          U.toast('Imported ' + count + ' custom template(s)!');
        };
        reader.readAsText(file);
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
      if (palette) {
        palette.addEventListener('click', function (e) {
          var block = e.target.closest('[data-type]');
          if (!block) return;
          self.addBlock(block.getAttribute('data-type'));
        });
      }

      var catWrap = document.getElementById('palette-categories');
      if (catWrap) {
        catWrap.addEventListener('click', function (e) {
          var btn = e.target.closest('[data-pcat]');
          if (!btn) return;
          self.blockCategory = btn.getAttribute('data-pcat');
          Array.prototype.forEach.call(catWrap.querySelectorAll('.pcat-btn'), function (b) {
            b.classList.toggle('active', b === btn);
          });
          S.Render.palette();
        });
      }
    },

    

    bindPages: function () {
      var self = this;
      var quickBtn = document.getElementById('btn-add-page-quick');
      var menuBtn = document.getElementById('btn-add-page-menu');
      var menuPopup = document.getElementById('pages-add-menu');
      var list = document.getElementById('pages-list');

      if (quickBtn) {
        quickBtn.addEventListener('click', function () {
          var p = S.State.addPage();
          self.refresh('all');
          U.toast('New screen added: ' + (p ? p.name : 'Screen'));
        });
      }

      if (menuBtn && menuPopup) {
        menuBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          menuPopup.hidden = !menuPopup.hidden;
        });

        document.addEventListener('click', function (e) {
          if (!menuPopup.hidden && !e.target.closest('#pages-add-menu') && !e.target.closest('#btn-add-page-menu')) {
            menuPopup.hidden = true;
          }
        });

        menuPopup.addEventListener('click', function (e) {
          var item = e.target.closest('.pmp-item');
          if (!item) return;
          var tpl = item.getAttribute('data-template');
          menuPopup.hidden = true;
          if (tpl === 'settings') {
            S.createSettingsScreen('Settings');
            self.refresh('all');
            U.toast('Settings screen added');
          } else if (tpl === 'profile') {
            var profPage = S.State.addPage('Profile', { icon: 'msr:person', hiddenFromNav: true });
            if (profPage && S.makeBlock) {
              profPage.screen = [
                S.makeBlock('profilebar', { title: 'Alex Rivera', greeting: 'Account Center' }),
                S.makeBlock('hero', { kicker: 'User Account', title: 'Alex Rivera', subtitle: 'alex@droidlab.app', icon: 'account_circle' }),
                S.makeBlock('settingslist', {
                  title: 'Account & Security',
                  items: 'lock:Password & 2FA | Last changed 3 months ago | chevron\nfingerprint:Biometric Authentication | Fingerprint / Face ID | switch:on\nnotifications:Email Updates & Receipts | Monthly summary | switch:on'
                }),
                S.makeBlock('button', { label: 'Edit Profile Details', variant: 'filled' })
              ].filter(Boolean);
            }
            self.refresh('all');
            U.toast('Profile screen added');
          } else if (tpl === 'detail') {
            var detPage = S.State.addPage('Details', { icon: 'msr:article', hiddenFromNav: true });
            if (detPage && S.makeBlock) {
              detPage.screen = [
                S.makeBlock('appbar', { title: 'Story Details', leading: true, leadingIcon: 'arrow_back' }),
                S.makeBlock('hero', { kicker: 'Featured Story', title: 'Modern Architecture', subtitle: 'A deep dive into progressive design systems.' }),
                S.makeBlock('card', { title: 'Key Insights', body: 'Design tokens provide single source of truth across platforms.' })
              ].filter(Boolean);
            }
            self.refresh('all');
            U.toast('Detail screen added');
          } else if (tpl === 'player') {
            if (S.createNowPlayingScreen) {
              S.createNowPlayingScreen('vinyl');
            } else {
              S.State.addPage('Now Playing', { icon: 'msr:play_circle', hiddenFromNav: true });
            }
            self.refresh('all');
            U.toast('Fullscreen player screen added');
          } else if (tpl === 'blank') {
            var bPage = S.State.addPage(null, { blank: true, screen: [] });
            self.refresh('all');
            U.toast('Blank screen added: ' + (bPage ? bPage.name : 'Screen'));
          } else {
            var bPage = S.State.addPage();
            self.refresh('all');
            U.toast('New screen added: ' + (bPage ? bPage.name : 'Screen'));
          }
        });
      }

      if (list) {
        var draggedPageId = null;

        list.addEventListener('dragstart', function (e) {
          var row = e.target.closest('.page-row');
          if (!row) return;
          draggedPageId = row.getAttribute('data-page-id');
          row.classList.add('is-dragging');
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', draggedPageId);
            e.dataTransfer.effectAllowed = 'move';
          }
        });

        list.addEventListener('dragend', function (e) {
          draggedPageId = null;
          list.querySelectorAll('.page-row').forEach(function (r) {
            r.classList.remove('is-dragging', 'drag-over-top', 'drag-over-bottom', 'drag-combine');
          });
        });

        list.addEventListener('dragover', function (e) {
          var row = e.target.closest('.page-row');
          if (!row || !draggedPageId) return;
          var targetId = row.getAttribute('data-page-id');
          if (targetId === draggedPageId) return;

          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

          var rect = row.getBoundingClientRect();
          var relY = e.clientY - rect.top;
          var height = rect.height;

          row.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-combine');

          if (relY < height * 0.25) {
            row.classList.add('drag-over-top');
          } else if (relY > height * 0.75) {
            row.classList.add('drag-over-bottom');
          } else {
            row.classList.add('drag-combine');
          }
        });

        list.addEventListener('dragleave', function (e) {
          var row = e.target.closest('.page-row');
          if (row) {
            row.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-combine');
          }
        });

        list.addEventListener('drop', function (e) {
          var row = e.target.closest('.page-row');
          if (!row || !draggedPageId) return;
          e.preventDefault();
          var targetId = row.getAttribute('data-page-id');
          if (!targetId || targetId === draggedPageId) return;

          var isCombine = row.classList.contains('drag-combine');
          var isTop = row.classList.contains('drag-over-top');

          row.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-combine');

          var srcPage = S.State.pageById(draggedPageId);
          var tgtPage = S.State.pageById(targetId);

          if (isCombine && srcPage && tgtPage) {
            S.State.combinePages(draggedPageId, targetId, { removeSource: false });
            self.refresh('all');
            U.toast('Combined “' + srcPage.name + '” blocks into “' + tgtPage.name + '”');
            draggedPageId = null;
            return;
          }

          if (isTop) {
            S.State.movePageBefore(draggedPageId, targetId);
          } else {
            var d = S.State.data;
            var tIdx = S.State.pageIndex(targetId);
            var nextP = d.pages[tIdx + 1];
            S.State.movePageBefore(draggedPageId, nextP ? nextP.id : null);
          }

          self.refresh('all');
          U.toast('Screens reordered');
          draggedPageId = null;
        });

        list.addEventListener('click', function (e) {
          var row = e.target.closest('.page-row');
          if (!row) return;
          var pageId = row.getAttribute('data-page-id');
          if (!pageId) return;

          var actBtn = e.target.closest('[data-act]');
          if (actBtn) {
            e.stopPropagation();
            var act = actBtn.getAttribute('data-act');
            if (act === 'combine-page') {
              var srcP = S.State.pageById(pageId);
              var otherPages = (S.State.data.pages || []).filter(function (p) { return p.id !== pageId; });
              if (!otherPages.length) {
                U.toast('Create at least 2 screens to combine');
                return;
              }
              var names = otherPages.map(function (p, i) { return (i + 1) + ': ' + p.name; }).join('\n');
              var choice = prompt('Select screen number to combine with “' + (srcP ? srcP.name : 'this screen') + '”:\n\n' + names, '1');
              if (choice) {
                var cIdx = parseInt(choice, 10) - 1;
                var tgtP = otherPages[cIdx];
                if (tgtP) {
                  S.State.combinePages(pageId, tgtP.id, { removeSource: false });
                  self.refresh('all');
                  U.toast('Combined “' + srcP.name + '” into “' + tgtP.name + '”');
                }
              }
            } else if (act === 'toggle-hidden') {
              S.State.togglePageHidden(pageId);
              var p = S.State.pageById(pageId);
              U.toast(p && p.hiddenFromNav ? 'Screen hidden from bottom navigation' : 'Screen added to bottom navigation tabs');
            } else if (act === 'duplicate-page') {
              var dup = S.State.duplicatePage(pageId);
              if (dup) U.toast('Duplicated: ' + dup.name);
            } else if (act === 'rename-page') {
              self.startRenamePage(pageId);
            } else if (act === 'delete-page') {
              var delTarget = S.State.pageById(pageId);
              var name = delTarget ? delTarget.name : 'Screen';
              S.State.deletePage(pageId);
              self.refresh('all');
              U.toast('Deleted screen "' + name + '"');
            }
            return;
          }

          if (e.target.closest('input, button')) return;
          // Clicking anywhere else on the row switches to that page
          var switched = S.State.switchPage(pageId);
          self.refresh('all');
          var curP = S.State.pageById(pageId);
          if (curP) U.toast('Editing “' + curP.name + '”');
        });
      }
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

        /* Rail arrows scroll cards without selecting the block. Handled before
           the preview / edit guards so they work in both modes. */
        var railBtn = e.target.closest('[data-rail]');
        if (railBtn) {
          e.preventDefault();
          self.scrollRail(railBtn);
          return;
        }

        if (self.previewMode) return;
        if (S.State.data.compare.on) return;

        if (!e.target.closest('.mock-frame')) {
          if (editing) finishEdit(false);
          return;
        }

        /* 1. Direct Canvas Icon Click Switcher (Figma-style In-Canvas Popover) */
        var iconEl = e.target.closest('.mi, .icn, [data-icon], svg, .nav-icon');
        var insideCmp = iconEl ? iconEl.closest('.cmp') : null;
        if (iconEl && insideCmp && !e.target.closest('.cmp-chrome, .chud-btn, .mini, .cmp-resize')) {
          var cId = insideCmp.getAttribute('data-id');
          var bItem = self.blockById(cId);
          if (bItem && bItem.props) {
            var actBtn = iconEl.closest('[data-appbar-act-idx]');
            if (actBtn && S.getAppBarActionItems) {
              var aIdx = Number(actBtn.getAttribute('data-appbar-act-idx'));
              var actionItems = S.getAppBarActionItems(bItem.props);
              var actItem = actionItems[aIdx];
              var curIco = actItem ? actItem.icon : iconEl.textContent.trim();
              e.preventDefault();
              e.stopPropagation();
              if (bItem.locked) {
                U.toast('Block is locked � unlock it to change icon');
                return;
              }
              if (S.State.data.selectedId !== cId) self.select(cId);
              if (S.IconSwitcher && S.IconSwitcher.open) {
                S.IconSwitcher.open({
                  cmpId: cId,
                  cmpLabel: 'Top Bar Action ' + (aIdx + 1),
                  propKey: 'actionIcon',
                  currentIcon: curIco,
                  el: iconEl,
                  onSelect: function (newIcon) {
                    var items = S.getAppBarActionItems(bItem.props);
                    if (items[aIdx]) {
                      items[aIdx].icon = newIcon;
                      if (!items[aIdx].label || items[aIdx].label === curIco) items[aIdx].label = newIcon;
                    }
                    bItem.props.actionItems = items;
                    bItem.props.actions = items.map(function (it) { return it.icon; }).join(', ');
                    S.State.commit('appbar:action:icon:' + aIdx);
                    S.Render.drawScreen();
                    S.Inspector.render();
                    U.toast('Action icon updated to ' + newIcon);
                  }
                }, e);
              }
              return;
            }

            var pKey = 'icon';
            if (bItem.props.leadingIcon !== undefined) pKey = 'leadingIcon';
            else if (bItem.props.icon !== undefined) pKey = 'icon';
            else if (bItem.props.trailingIcon !== undefined) pKey = 'trailingIcon';
            else if (bItem.props.mediaIcon !== undefined) pKey = 'mediaIcon';
            
            var curIcon = bItem.props[pKey] || iconEl.textContent.trim();
            var defInfo = S.components[bItem.type];

            e.preventDefault();
            e.stopPropagation();

            if (bItem.locked) {
              U.toast('Block is locked — unlock it to change icon');
              return;
            }

            if (S.State.data.selectedId !== cId) self.select(cId);
            if (S.IconSwitcher && S.IconSwitcher.open) {
              S.IconSwitcher.open({
                cmpId: cId,
                cmpLabel: defInfo ? defInfo.label : bItem.type,
                propKey: pKey,
                currentIcon: curIcon,
                el: iconEl
              }, e);
            }
            return;
          }
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

        /* 2. Universal Direct Text Editing (Even if element lacked explicit data-edit) */
        if (!path && cmpOld) {
          var tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
          var isTextElement = tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6' ||
                              tag === 'p' || tag === 'span' || tag === 'b' || tag === 'strong' || tag === 'small' ||
                              tag === 'label' || tag === 'code' || tag === 'blockquote';
          if (isTextElement && !e.target.closest('.mi, .icn, svg, .cmp-chrome, .chud-btn, .cmp-resize')) {
            var rawText = (e.target.textContent || '').trim();
            var bBlock = self.blockById(id);
            if (bBlock && bBlock.props && rawText && rawText.length > 0 && rawText.length < 150) {
              var p = bBlock.props;
              var matchKey = null;
              ['title', 'subtitle', 'kicker', 'text', 'label', 'body', 'heading', 'sub', 'desc', 'action', 'cta', 'placeholder', 'brand', 'name', 'badge'].forEach(function (k) {
                if (!matchKey && typeof p[k] === 'string' && (p[k] === rawText || rawText.indexOf(p[k]) !== -1 || p[k].indexOf(rawText) !== -1)) {
                  matchKey = k;
                }
              });
              if (matchKey) {
                e.target.setAttribute('data-edit', matchKey);
                editOld = e.target;
                path = matchKey;
              }
            }
          }
        }

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

        var importModal = document.getElementById('import-modal');
        if (importModal && !importModal.hidden) {
          if (e.key === 'Escape') {
            e.preventDefault();
            if (S.Import && S.Import.close) S.Import.close();
            return;
          }
        }

        var tag = (e.target.tagName || '').toLowerCase();
        var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;

        if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'o' || e.key.toLowerCase() === 'i')) {
          if (typing) return;
          e.preventDefault();
          if (S.Import && S.Import.open) S.Import.open();
          return;
        }
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
      var zipBtn = $('#export-zip');
      var filePicker = $('#export-file-picker');
      var appName = $('#export-app-name');
      var pkgName = $('#export-package-name');
      var minSdk = $('#export-min-sdk');
      var tabs = document.getElementById('export-tabs');

      if (close) close.addEventListener('click', function () { S.Export.close(); });
      if (copy) copy.addEventListener('click', function () { S.Export.copy(); });
      if (download) download.addEventListener('click', function () { S.Export.download(); });
      if (zipBtn) zipBtn.addEventListener('click', function () { S.Export.exportZip(); });
      if (filePicker) {
        filePicker.addEventListener('change', function () {
          S.Export.selectAndroidFile(filePicker.value);
        });
      }
      [appName, pkgName, minSdk].forEach(function (el) {
        if (el) {
          el.addEventListener('input', function () { S.Export.updateAndroidState(); });
          el.addEventListener('change', function () { S.Export.updateAndroidState(); });
        }
      });
      if (tabs) {
        tabs.addEventListener('click', function (e) {
          var btn = e.target.closest('[data-mtab]');
          if (!btn) return;
          S.Export.setTab(btn.getAttribute('data-mtab'));
        });
        tabs.addEventListener('keydown', function (e) {
          var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
          if (keys.indexOf(e.key) === -1) return;
          var list = Array.prototype.slice.call(tabs.querySelectorAll('.mtab'));
          var index = list.indexOf(document.activeElement);
          if (index < 0) index = list.findIndex(function (b) { return b.classList.contains('active'); });
          if (e.key === 'ArrowLeft') index = (index - 1 + list.length) % list.length;
          else if (e.key === 'ArrowRight') index = (index + 1) % list.length;
          else if (e.key === 'Home') index = 0;
          else index = list.length - 1;
          e.preventDefault();
          list[index].focus();
          S.Export.setTab(list[index].getAttribute('data-mtab'));
        });
      }
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

    // Floating direct-edit indicator
    var pill = document.createElement('div');
    pill.className = 'inline-edit-pill';
    pill.id = 'active-inline-pill';
    pill.innerHTML = '<span>?? Press Enter to save ? Esc cancels</span>';
    el.style.position = 'relative';
    el.appendChild(pill);

    // Point the user at the matching inspector field.
    if (S.Inspector && S.Inspector.highlight) S.Inspector.highlight(editing.path);
  }

  /* Save or cancel the active inline edit.
     opts.keepInspector keeps the right panel DOM alive so a click that is
     already in progress is not destroyed by a re-render. */
  function finishEdit(cancel, opts) {
    opts = opts || {};
    if (!editing) return;

    var pill = document.getElementById('active-inline-pill');
    if (pill && pill.parentNode) pill.parentNode.removeChild(pill);

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

  /* ============================================================
     Direct In-Canvas Icon Switcher Popover
     ============================================================ */
  S.IconSwitcher = {
    activeTarget: null,
    activeCategory: 'all',

    init: function () {
      var self = this;
      var popover = document.getElementById('canvas-icon-popover');
      if (!popover) return;

      var closeBtn = document.getElementById('cip-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () { self.close(); });
      }

      var input = document.getElementById('cip-input');
      if (input) {
        input.addEventListener('input', function () {
          self.renderGrid(input.value, self.activeCategory);
        });
      }

      var catWrap = document.getElementById('cip-categories');
      if (catWrap) {
        catWrap.addEventListener('click', function (e) {
          var btn = e.target.closest('[data-cip-cat]');
          if (!btn) return;
          self.activeCategory = btn.getAttribute('data-cip-cat');
          Array.prototype.forEach.call(catWrap.querySelectorAll('.cip-cat'), function (b) {
            b.classList.toggle('active', b === btn);
          });
          self.renderGrid(input ? input.value : '', self.activeCategory);
        });
      }

      var grid = document.getElementById('cip-grid');
      if (grid) {
        grid.addEventListener('click', function (e) {
          var item = e.target.closest('[data-icon-name]');
          if (!item) return;
          var iconName = item.getAttribute('data-icon-name');
          self.applyIcon(iconName);
        });
      }

      var moreBtn = document.getElementById('cip-more');
      if (moreBtn) {
        moreBtn.addEventListener('click', function () {
          self.close();
          if (S.App) S.App.showTab('icons');
        });
      }

      document.addEventListener('pointerdown', function (e) {
        if (!popover.hidden && !popover.contains(e.target)) {
          self.close();
        }
      });
    },

    open: function (target, clickEvent) {
      var popover = document.getElementById('canvas-icon-popover');
      if (!popover) return;
      this.activeTarget = target;

      var popWidth = 330;
      var popHeight = 420;
      var anchorEl = target.el || target.targetEl || (clickEvent ? clickEvent.target : null);
      var rect = anchorEl && anchorEl.getBoundingClientRect ? anchorEl.getBoundingClientRect() : null;
      var x = 200, y = 200;
      if (rect) {
        var phone = document.querySelector('.phone-screen') || document.querySelector('.mock-frame');
        var phoneRect = phone ? phone.getBoundingClientRect() : null;
        if (phoneRect && phoneRect.right + popWidth + 24 < window.innerWidth) {
          x = phoneRect.right + 18;
          y = Math.max(68, Math.min(window.innerHeight - popHeight - 20, rect.top - 20));
        } else if (phoneRect && phoneRect.left - popWidth - 24 > 0) {
          x = phoneRect.left - popWidth - 18;
          y = Math.max(68, Math.min(window.innerHeight - popHeight - 20, rect.top - 20));
        } else {
          x = rect.right + 12;
          y = rect.top - 20;
        }
      } else if (clickEvent && clickEvent.clientX) {
        x = clickEvent.clientX + 14;
        y = clickEvent.clientY - 20;
      }
      if (x + popWidth > window.innerWidth - 10) x = window.innerWidth - popWidth - 10;
      if (y + popHeight > window.innerHeight - 10) y = window.innerHeight - popHeight - 10;
      if (x < 10) x = 10;
      if (y < 68) y = 68;

      popover.style.left = x + 'px';
      popover.style.top = y + 'px';
      popover.hidden = false;

      var prev = document.getElementById('cip-preview');
      if (prev) prev.textContent = target.currentIcon || 'star';

      var title = document.getElementById('cip-target-name');
      if (title) title.textContent = target.cmpLabel + ' · ' + target.propKey;

      var input = document.getElementById('cip-input');
      if (input) {
        input.value = '';
        setTimeout(function () { input.focus(); }, 50);
      }
      this.renderGrid('', this.activeCategory);
    },

    close: function () {
      var popover = document.getElementById('canvas-icon-popover');
      if (popover) popover.hidden = true;
      this.activeTarget = null;
    },

    getIcons: function (query, cat) {
      var popular = [
        'home', 'search', 'settings', 'favorite', 'favorite_border', 'star', 'star_border',
        'person', 'group', 'notifications', 'mail', 'send', 'call', 'chat',
        'play_arrow', 'pause', 'skip_next', 'skip_previous', 'volume_up', 'music_note',
        'arrow_forward', 'arrow_back', 'expand_more', 'expand_less', 'check', 'close',
        'add', 'remove', 'edit', 'delete', 'share', 'file_download', 'upload',
        'shopping_cart', 'credit_card', 'lock', 'visibility', 'camera_alt', 'image',
        'dashboard', 'tune', 'filter_list', 'refresh', 'more_vert', 'more_horiz',
        'thumb_up', 'thumb_down', 'bookmark', 'explore', 'map', 'navigation',
        'light_mode', 'dark_mode', 'wifi', 'battery_full', 'code', 'palette'
      ];
      var catMap = {
        nav: ['home', 'explore', 'navigation', 'map', 'menu', 'arrow_back', 'arrow_forward', 'expand_more', 'expand_less', 'close', 'apps', 'dashboard'],
        media: ['play_arrow', 'pause', 'skip_next', 'skip_previous', 'volume_up', 'volume_off', 'music_note', 'library_music', 'video_library', 'camera_alt', 'image', 'mic'],
        actions: ['add', 'edit', 'delete', 'share', 'file_download', 'upload', 'favorite', 'star', 'thumb_up', 'check', 'refresh', 'send', 'filter_list', 'tune'],
        ui: ['settings', 'person', 'lock', 'notifications', 'search', 'mail', 'call', 'shopping_cart', 'credit_card', 'visibility', 'wifi', 'battery_full', 'palette']
      };

      var list = (cat && catMap[cat]) ? catMap[cat] : popular;
      if (query) {
        var q = query.toLowerCase().trim();
        var all = (S.material || []).concat(popular);
        var seen = {};
        var res = [];
        all.forEach(function (ic) {
          if (!seen[ic] && ic.toLowerCase().indexOf(q) !== -1) {
            seen[ic] = true;
            res.push(ic);
          }
        });
        return res.slice(0, 48);
      }
      return list;
    },

    renderGrid: function (query, cat) {
      var grid = document.getElementById('cip-grid');
      if (!grid) return;
      var icons = this.getIcons(query, cat);
      if (!icons.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;padding:24px;text-align:center;font-size:11px;color:var(--muted-2);">No icons found</div>';
        return;
      }
      grid.innerHTML = icons.map(function (ic) {
        return '<button type="button" class="cip-item" data-icon-name="' + ic + '" title="' + ic + '"><span class="mi">' + ic + '</span></button>';
      }).join('');
    },

    applyIcon: function (iconName) {
      if (!this.activeTarget) return;
      var t = this.activeTarget;
      if (typeof t.onSelect === 'function') {
        t.onSelect(iconName);
        this.close();
        return;
      }
      var block = S.State.data.screen.filter(function (b) { return b.id === t.cmpId; })[0];
      if (block && block.props) {
        block.props[t.propKey] = iconName;
        S.State.commit('icon-switch:' + t.cmpId + ':' + iconName);
        S.Render.drawScreen();
        S.Inspector.render();
        U.toast('✓ Icon updated to ' + iconName);
      }
      this.close();
    }
  };

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
