/* Single source of truth + undo/redo + autosave. */
(function () {
  var S = window.Studio = window.Studio || {};
  var KEY = 'droidlab.v1';

  var State = S.State = {
    data: null,
    history: [],
    pointer: -1,
    lastKey: null,
    lastTime: 0,

    snapshot: function () {
      /* Keep the active screen and its page in sync before serialising so
         Undo / Redo and autosave always capture the same content. */
      this.syncActivePage();
      var d = this.data;
      return JSON.stringify({
        target: d.target,
        device: d.device,
        theme: d.theme,
        screen: d.screen,
        pages: d.pages,
        activePageId: d.activePageId,
        stash: d.stash,
        selectedId: d.selectedId,
        ui: d.ui,
        compare: d.compare
      });
    },

    /* The active page stores the screen array. Keeping data.screen pointing at
       that same array means every existing block operation keeps working while
       pages stay in sync for undo, save and export. */
    syncActivePage: function () {
      var d = this.data;
      if (!d || !Array.isArray(d.pages) || !d.pages.length) return;
      var page = this.pageById(d.activePageId) || d.pages[0];
      if (!page) return;
      d.activePageId = page.id;
      page.screen = d.screen;
    },

    pageById: function (id) {
      var pages = (this.data && this.data.pages) || [];
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].id === id) return pages[i];
      }
      return null;
    },

    pageIndex: function (id) {
      var pages = (this.data && this.data.pages) || [];
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].id === id) return i;
      }
      return -1;
    },

    switchPage: function (id, opts) {
      var d = this.data;
      if (!d || !id) return false;
      if (d.activePageId === id) return false;
      var page = this.pageById(id);
      if (!page) return false;

      this.syncActivePage();
      d.activePageId = page.id;
      d.screen = page.screen;
      d.selectedId = null;
      if (S.iconTarget) S.iconTarget = null;

      // Keep bottom navigation synchronized and deduplicated on page switch
      var pIndex = this.pageIndex(page.id);
      if (pIndex > -1 && d.target === 'app') {
        var navStyle = null;
        for (var pi = 0; pi < (d.pages || []).length && !navStyle; pi++) {
          (d.pages[pi].screen || []).forEach(function (b) {
            if (!navStyle && (b.type === 'bottomnav' || (b.type && b.type.indexOf('bottomnav') === 0))) {
              navStyle = (b.props && b.props.style) || 'material';
            }
          });
        }
        navStyle = navStyle || 'material';

        var seenNav = false;
        var cleanScreen = [];
        (d.screen || []).forEach(function (b) {
          var isNav = b.type === 'bottomnav' || (b.type && b.type.indexOf('bottomnav') === 0);
          if (isNav) {
            if (seenNav) return; // strip duplicate bottom nav
            seenNav = true;
            b.type = 'bottomnav';
            b.props = b.props || {};
            b.props.active = pIndex;
            b.props.style = navStyle;
          }
          cleanScreen.push(b);
        });
        d.screen = cleanScreen;
        page.screen = cleanScreen;
      }

      this.commit('page:open');
      if (!(opts && opts.silent) && S.App) {
        S.App.refresh('all');
        S.App.requestFit();
      }
      return true;
    },

    switchPageIndex: function (index, opts) {
      var pages = (this.data && this.data.pages) || [];
      var page = pages[index];
      return page ? this.switchPage(page.id, opts) : false;
    },

    addPage: function (name, opts) {
      opts = opts || {};
      var d = this.data;
      this.syncActivePage();
      if (!Array.isArray(d.pages)) d.pages = [];
      var currentBlocks = Array.isArray(d.screen) ? d.screen : [];
      var index = d.pages.length;
      var pageName = (typeof name === 'string' && name.trim()) ? name.trim() : ('Screen ' + (index + 1));
      var pageIcon = opts.icon || (d.target === 'web' ? 'msr:web' : 'msr:apps');
      var newScreen = [];
      if (opts.blank) {
        newScreen = [];
      } else if (Array.isArray(opts.screen) && opts.screen.length) {
        newScreen = regenIds(normScreen(opts.screen, {}));
      } else if (Array.isArray(opts.screen)) {
        newScreen = [];
      } else if (currentBlocks.length) {
        var headerTypes = ['appbar', 'searchheader', 'profilebar', 'storeheader', 'capsuleheader', 'tabs', 'tabspill', 'tabssegmented', 'tabsbadge', 'tabsicon', 'webnav', 'exthead'];
        var footerTypes = ['bottomnav', 'bottomnavfloating', 'bottomnavfab', 'bottomnavexpanding', 'bottomnavglass', 'miniplayer', 'webfooter', 'extfoot'];
        var persistentBlocks = [];
        currentBlocks.forEach(function (b) {
          if (headerTypes.indexOf(b.type) > -1 || footerTypes.indexOf(b.type) > -1) {
            var clone = JSON.parse(JSON.stringify(b));
            clone.id = S.util.uid();
            if (clone.type === 'tabs' && typeof opts.tabIndex === 'number') {
              clone.props.active = opts.tabIndex;
            }
            if (clone.type === 'bottomnav') {
              clone.props.active = index;
            }
            if (clone.props) {
              if (clone.type === 'appbar' || clone.type === 'searchheader' || clone.type === 'profilebar' || clone.type === 'storeheader' || clone.type === 'capsuleheader') {
                clone.props.title = pageName;
              }
              if (clone.type === 'tabs' && typeof opts.tabIndex !== 'number') {
                clone.props.active = 0;
              }
            }
            persistentBlocks.push(clone);
          }
        });
        var headers = persistentBlocks.filter(function (b) { return headerTypes.indexOf(b.type) > -1; });
        var footers = persistentBlocks.filter(function (b) { return footerTypes.indexOf(b.type) > -1; });
        var content = [];
        if (d.target === 'web') {
          if (S.makeBlock) {
            var webHero = S.makeBlock('webhero', {
              kicker: pageName + ' · 2026',
              title: pageName,
              text: 'Explore our curated ' + pageName.toLowerCase() + ' collection and featured stories.',
              cta: 'Shop ' + pageName,
              cta2: 'Learn more'
            });
            if (webHero) content.push(webHero);
          }
        } else if (d.target === 'ext') {
          if (S.makeBlock) {
            var extCard = S.makeBlock('extnotes', {
              title: pageName,
              body: 'Quick notes and tools for ' + pageName + ' screen.'
            });
            if (extCard) content.push(extCard);
          }
        } else {
          if (S.makeBlock) {
            var sec = S.makeBlock('section', {
              title: pageName,
              action: 'See all'
            });
            if (sec) content.push(sec);
            var card = S.makeBlock('card', {
              title: pageName + ' Overview',
              text: 'Add cards, lists, and components for ' + pageName.toLowerCase() + ' here.'
            });
            if (card) content.push(card);
          }
        }
        newScreen = headers.concat(content).concat(footers);
      }
      var page = {
        id: S.util.uid(),
        name: pageName,
        icon: pageIcon,
        hiddenFromNav: !!opts.hiddenFromNav,
        screen: newScreen
      };
      d.pages.push(page);
      d.activePageId = page.id;
      d.screen = page.screen;
      d.selectedId = null;
      if (S.iconTarget) S.iconTarget = null;
      this.syncNavFromPages();
      this.commit('page:add');
      if (S.App) {
        S.App.refresh('all');
        S.App.requestFit();
      }
      return page;
    },

    removePage: function (id) {
      var d = this.data;
      if (!Array.isArray(d.pages) || d.pages.length < 2) return false;
      var index = this.pageIndex(id);
      if (index < 0) return false;

      this.syncActivePage();
      d.pages.splice(index, 1);
      if (d.activePageId === id) {
        var next = d.pages[Math.min(index, d.pages.length - 1)];
        d.activePageId = next.id;
        d.screen = next.screen;
        d.selectedId = null;
      }
      this.syncNavFromPages();
      this.commit('page:del');
      if (S.App) S.App.refresh('all');
      return true;
    },

    movePage: function (id, dir) {
      var d = this.data;
      var index = this.pageIndex(id);
      var to = index + dir;
      if (index < 0 || to < 0 || to >= d.pages.length) return false;
      this.syncActivePage();
      var page = d.pages.splice(index, 1)[0];
      d.pages.splice(to, 0, page);
      this.syncNavFromPages();
      this.commit('page:move');
      if (S.App) S.App.refresh('all');
      return true;
    },

    /* Move a screen before another. A null target means "move to the end",
       which lets drag-and-drop drop below the last row. */
    movePageBefore: function (id, beforeId) {
      var d = this.data;
      var from = this.pageIndex(id);
      var to = beforeId ? this.pageIndex(beforeId) : d.pages.length;
      if (from < 0 || to < 0 || from === to || id === beforeId) return false;
      this.syncActivePage();
      var page = d.pages.splice(from, 1)[0];
      if (from < to) to--;
      if (to > d.pages.length) to = d.pages.length;
      d.pages.splice(to, 0, page);
      this.syncNavFromPages();
      this.commit('page:move');
      if (S.App) S.App.refresh('all');
      return true;
    },

    renamePage: function (id, name) {
      var page = this.pageById(id);
      if (!page) return;
      page.name = String(name || '').trim() || 'Untitled';
      this.syncNavFromPages();
      this.commit('page:name:' + id);
    },

        combinePages: function (srcId, targetId, opts) {
      opts = opts || {};
      var d = this.data;
      if (!d || !Array.isArray(d.pages) || srcId === targetId) return false;
      var src = this.pageById(srcId);
      var target = this.pageById(targetId);
      if (!src || !target) return false;

      this.syncActivePage();
      target.screen = target.screen || [];

      // Clone blocks from src with fresh IDs so they never conflict
      var cloneBlocks = JSON.parse(JSON.stringify(src.screen || []));
      regenIds(cloneBlocks);

      // Append blocks to target screen
      target.screen = target.screen.concat(cloneBlocks);

      // Mark source as sub-page or remove if requested
      if (opts.removeSource) {
        var sIdx = this.pageIndex(srcId);
        if (sIdx > -1) d.pages.splice(sIdx, 1);
      } else {
        src.hiddenFromNav = true;
      }

      d.activePageId = target.id;
      d.screen = target.screen;
      d.selectedId = null;

      this.syncNavFromPages();
      this.commit('page:combine');
      this.saveNow();
      if (S.App) S.App.refresh('all');
      return true;
    },

    deletePage: function (id) {
      var d = this.data;
      if (!d || !Array.isArray(d.pages)) return false;
      var idx = this.pageIndex(id);
      if (idx < 0) return false;
      this.syncActivePage();

      d.pages.splice(idx, 1);

      // If all pages were removed, ensure at least 1 blank screen exists
      if (d.pages.length === 0) {
        var blank = {
          id: S.util.uid(),
          name: 'Screen 1',
          icon: 'msr:smartphone',
          screen: [],
          hiddenFromNav: false
        };
        d.pages.push(blank);
        d.activePageId = blank.id;
        d.screen = blank.screen;
      } else if (d.activePageId === id) {
        // Switch to the adjacent page
        var nextIdx = Math.min(idx, d.pages.length - 1);
        d.activePageId = d.pages[nextIdx].id;
        d.screen = d.pages[nextIdx].screen || [];
      } else {
        var curr = this.pageById(d.activePageId) || d.pages[0];
        if (curr) {
          d.activePageId = curr.id;
          d.screen = curr.screen || [];
        }
      }

      d.selectedId = null;
      this.syncNavFromPages();
      this.commit('page:delete');
      this.saveNow();
      if (S.App) S.App.refresh('all');
      return true;
    },

    startBlank: function (target) {
      target = target || 'app';
      var d = this.data;
      var targetMeta = (S.targets && S.targets[target]) ? S.targets[target] : { device: { width: 390, height: 844, statusBar: true, gestureBar: true } };
      var device = Object.assign({}, targetMeta.device);
      var preset = S.matchDevice ? S.matchDevice(target, device) : null;
      device.preset = preset ? preset.id : null;

      var blankPage = {
        id: S.util.uid(),
        name: 'Screen 1',
        icon: 'msr:smartphone',
        screen: [],
        hiddenFromNav: false
      };

      this.data = {
        version: 2,
        target: target,
        device: device,
        screen: [],
        pages: target === 'app' ? [blankPage] : [],
        activePageId: target === 'app' ? blankPage.id : null,
        selectedId: null,
        stash: {},
        theme: Object.assign({
          dark: false,
          primary: '#6750a4',
          accent: '#7c4dff',
          radius: 16,
          density: 'normal',
          fonts: { ui: 'Inter', display: 'Plus Jakarta Sans' },
          type: { size: 15, weight: 400, spacing: 0 },
          icons: { weight: 400, fill: 0, stroke: 1.8 }
        }, S.baseTheme ? S.baseTheme() : {}),
        ui: S.defaultUI ? S.defaultUI() : {},
        compare: { on: false, fonts: ['Inter', 'Plus Jakarta Sans', 'DM Sans'] }
      };

      this.history = [this.snapshot()];
      this.pointer = 0;
      this.lastKey = null;
      this.saveNow();
      if (S.App) {
        S.App.target = target;
        S.App.refresh('all');
      }
      return this.data;
    },

    duplicatePage: function (id) {
      var d = this.data;
      var src = this.pageById(id) || this.pageById(d.activePageId);
      if (!src) return null;
      this.syncActivePage();
      var cloneScreen = JSON.parse(JSON.stringify(src.screen || []));
      regenIds(cloneScreen);
      var newName = uniquePageName(d.pages, src.name + ' Copy');
      var newPage = {
        id: S.util.uid(),
        name: newName,
        icon: src.icon || 'msr:apps',
        screen: cloneScreen,
        hiddenFromNav: !!src.hiddenFromNav
      };
      d.pages.push(newPage);
      d.activePageId = newPage.id;
      d.screen = newPage.screen;
      d.selectedId = null;
      this.syncNavFromPages();
      this.commit('page:duplicate');
      if (S.App) S.App.refresh('all');
      return newPage;
    },

    togglePageHidden: function (id) {
      var page = this.pageById(id);
      if (!page) return false;
      this.syncActivePage();
      page.hiddenFromNav = !page.hiddenFromNav;
      this.syncNavFromPages();
      this.commit('page:toggleNav');
      if (S.App) S.App.refresh('all');
      return true;
    },

    setPageIcon: function (id, icon) {
      var page = this.pageById(id);
      if (!page || !icon) return;
      page.icon = icon;
      this.syncNavFromPages();
      this.commit('page:icon:' + id);
    },

    /* The tab-bar design is one app-wide choice, so mirror a picked style
       onto every screen's navigation instead of only the selected copy. */
    syncNavStyle: function (style) {
      var d = this.data;
      if (!d) return;
      this.syncActivePage();
      var value = style || 'material';
      (d.pages || []).forEach(function (page) {
        (page.screen || []).forEach(function (block) {
          if (block.type === 'bottomnav' || (block.type && block.type.indexOf('bottomnav') === 0)) {
            block.type = 'bottomnav';
            block.props = block.props || {};
            block.props.style = value;
          }
        });
      });
    },

    /* Pages own the tab names and icons. Whenever the screen list changes,
       mirror that order into every bottom navigation block. */
    syncNavFromPages: function () {
      syncNavFor(this.data);
    },

    /* Editing the bottom-navigation items in the inspector updates the pages
       too. Screens are kept by position, so existing page content survives
       renames and icon changes. */
    syncPagesFromNav: function () {
      var d = this.data;
      if (!d) return;
      var source = null;
      var pages = d.pages || [];
      for (var i = 0; i < pages.length && !source; i++) {
        (pages[i].screen || []).forEach(function (block) {
          if (!source && (block.type === 'bottomnav' || (block.type && block.type.indexOf('bottomnav') === 0))) source = block;
        });
      }
      if (!source) return;

      var parsed = String(source.props.items || '').split('\n')
        .map(function (line) { return line.trim(); })
        .filter(Boolean)
        .map(function (line) {
          var idx = line.indexOf(':');
          return idx > -1
            ? { icon: line.slice(0, idx).trim() || 'apps', label: line.slice(idx + 1).trim() }
            : { icon: 'apps', label: line };
        });
      if (!parsed.length) return;

      this.syncActivePage();
      var next = parsed.map(function (entry, index) {
        var old = pages[index];
        if (old) {
          old.name = entry.label || old.name || ('Screen ' + (index + 1));
          old.icon = entry.icon || old.icon;
          return old;
        }
        return {
          id: S.util.uid(),
          name: entry.label || ('Screen ' + (index + 1)),
          icon: entry.icon || 'msr:apps',
          screen: []
        };
      });
      d.pages = next;

      if (!this.pageById(d.activePageId)) {
        d.activePageId = d.pages[0].id;
        d.screen = d.pages[0].screen;
        d.selectedId = null;
      }
    },

    init: function () {
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (err) { saved = null; }
      this.data = normalize(saved) || S.defaultState();
      this.history = [this.snapshot()];
      this.pointer = 0;
      this.saveSoon();
    },

    commit: function (key) {
      var snap = this.snapshot();
      if (snap === this.history[this.pointer]) return;
      var now = Date.now();
      if (key && key === this.lastKey && now - this.lastTime < 750) {
        this.history[this.pointer] = snap;
      } else {
        this.history = this.history.slice(0, this.pointer + 1);
        this.history.push(snap);
        if (this.history.length > 80) this.history.shift();
        this.pointer = this.history.length - 1;
      }
      this.lastKey = key || null;
      this.lastTime = now;
      this.saveSoon();
    },

    canUndo: function () { return this.pointer > 0; },
    canRedo: function () { return this.pointer < this.history.length - 1; },

    undo: function () {
      if (!this.canUndo()) return false;
      this.pointer--;
      this.restore(this.history[this.pointer]);
      return true;
    },

    redo: function () {
      if (!this.canRedo()) return false;
      this.pointer++;
      this.restore(this.history[this.pointer]);
      return true;
    },

    restore: function (snap) {
      var parsed = JSON.parse(snap);
      this.data.target = parsed.target || 'app';
      this.data.device = parsed.device;
      this.data.theme = parsed.theme;
      this.data.screen = parsed.screen;
      this.data.stash = parsed.stash || {};
      this.data.selectedId = parsed.selectedId || null;
      this.data.ui = normUI(parsed.ui);
      this.data.compare = parsed.compare || this.data.compare;

      /* Restore the multi-screen model alongside the active screen. The active
         page points at data.screen so every block operation keeps working. */
      if (Array.isArray(parsed.pages) && parsed.pages.length) {
        this.data.pages = parsed.pages;
        this.data.activePageId = parsed.activePageId || parsed.pages[0].id;
        var page = this.pageById(this.data.activePageId) || parsed.pages[0];
        if (page) {
          page.screen = this.data.screen;
          this.data.activePageId = page.id;
        }
      } else {
        var made = S.pagesFromScreen(this.data.screen);
        this.data.pages = made.pages;
        this.data.activePageId = made.activePageId;
      }
      syncNavFor(this.data);

      if (!this.data.screen.some(function (it) { return it.id === this.data.selectedId; }, this)) {
        this.data.selectedId = null;
      }
      this.lastKey = null;
      this.saveSoon();
    },

    reorder: function (ids) {
      var map = {};
      this.data.screen.forEach(function (item) { map[item.id] = item; });
      var next = ids.map(function (id) { return map[id]; }).filter(Boolean);
      if (next.length !== this.data.screen.length) return;
      this.data.screen = next;
      this.commit(null);
    },

    saveSoon: (function () {
      var timer = null;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(function () { State.saveNow(); }, 400);
      };
    })(),

    saveNow: function () {
      this.syncActivePage();
      try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (err) { /* private mode */ }
    },

    reset: function () {
      this.data = S.defaultState();
      this.history = [this.snapshot()];
      this.pointer = 0;
      this.lastKey = null;
      this.saveNow();
    },

    /* Replace the whole project with a normalised import. The previous
       project stays in history so Ctrl+Z can bring it back. */
    loadProject: function (raw) {
      var next = normalize(raw);
      if (!next) return false;
      this.syncActivePage();
      for (var k in this.data) {
        if (this.data.hasOwnProperty(k) && !next.hasOwnProperty(k)) {
          delete this.data[k];
        }
      }
      Object.assign(this.data, next);
      this.data.selectedId = null;
      if (S.iconTarget) S.iconTarget = null;
      this.syncActivePage();
      syncNavFor(this.data);
      this.lastKey = null;
      this.commit('project:load');
      this.saveNow();
      return true;
    },

    /* Replace the current page or canvas screen with imported blocks. */
    replaceCurrentPage: function (raw) {
      var d = this.data;
      if (!d || !raw) return false;
      var blocks = raw.screen || raw.blocks || [];
      if (!Array.isArray(blocks) && Array.isArray(raw)) blocks = raw;
      if (!Array.isArray(blocks)) return false;

      this.syncActivePage();
      var screen = regenIds(normScreen(blocks, {}));
      d.screen = screen;
      d.selectedId = null;
      if (S.iconTarget) S.iconTarget = null;

      var name = raw.name || (raw.project && raw.project.name) || 'Page';
      var icon = raw.icon || 'msr:apps';

      if (d.target === 'app') {
        if (!Array.isArray(d.pages) || !d.pages.length) {
          d.pages = [{
            id: S.util.uid(),
            name: name,
            icon: icon,
            screen: d.screen
          }];
          d.activePageId = d.pages[0].id;
        } else {
          var currPage = this.pageById(d.activePageId) || d.pages[0];
          if (currPage) {
            currPage.name = name;
            if (raw.icon) currPage.icon = icon;
            currPage.screen = d.screen;
          }
        }
      }

      if (raw.theme) {
        if (raw.theme.primary) d.theme.primary = raw.theme.primary;
        if (raw.theme.dark != null) d.theme.dark = !!raw.theme.dark;
        else if (raw.theme.mode != null) d.theme.dark = raw.theme.mode === 'dark';
        if (raw.theme.radius != null) d.theme.radius = Number(raw.theme.radius) || 18;
        if (raw.theme.fonts) d.theme.fonts = Object.assign({}, d.theme.fonts, raw.theme.fonts);
        if (raw.theme.type) d.theme.type = Object.assign({}, d.theme.type, raw.theme.type);
        if (raw.theme.icons) d.theme.icons = Object.assign({}, d.theme.icons, raw.theme.icons);
      }

      if (raw.device) {
        applyImportedDevice(d, raw.device);
      }

      if (d.target === 'app') {
        this.syncNavFromPages();
      }

      this.commit('page:import:replace');
      this.saveNow();
      return true;
    },

    /* Append an exported app page to the current project. */
    importPage: function (raw) {
      var d = this.data;
      if (!d || !raw) return false;
      var blocks = raw.screen || raw.blocks || [];
      if (!Array.isArray(blocks) && Array.isArray(raw)) blocks = raw;
      if (!Array.isArray(blocks)) return false;
      this.syncActivePage();
      if (!Array.isArray(d.pages)) d.pages = [];

      var screen = regenIds(normScreen(blocks, {}));
      var page = {
        id: S.util.uid(),
        name: uniquePageName(d.pages, raw.name || 'Imported page'),
        icon: typeof raw.icon === 'string' && raw.icon.trim() ? raw.icon.trim() : 'msr:apps',
        screen: screen
      };
      d.pages.push(page);
      d.activePageId = page.id;
      d.screen = page.screen;
      d.selectedId = null;
      if (S.iconTarget) S.iconTarget = null;
      this.syncNavFromPages();
      this.commit('page:import');
      this.saveNow();
      return page;
    },

    /* Replace the current website / extension canvas with an exported page. */
    replaceCanvasScreen: function (raw) {
      var d = this.data;
      if (!d || !raw || !Array.isArray(raw.screen)) return false;
      var target = raw.target === 'web' || raw.target === 'ext' ? raw.target : 'app';
      if (target !== d.target) return false;
      this.syncActivePage();
      d.screen = regenIds(normScreen(raw.screen, {}));
      d.selectedId = null;
      if (S.iconTarget) S.iconTarget = null;
      applyImportedDevice(d, raw.device);
      this.commit('page:import');
      this.saveNow();
      return true;
    }
  };

  /* Per-block typography. Empty fields deliberately stay out of the object so
     the block inherits the theme font / size. */
  function normTypo(raw) {
    var t = raw && typeof raw === 'object' ? raw : {};
    var out = {};
    if (typeof t.family === 'string' && t.family.trim()) out.family = t.family.trim();
    var size = Number(t.size);
    if (t.size !== '' && t.size != null && isFinite(size) && size > 0) out.size = Math.round(size * 10) / 10;
    var weight = Number(t.weight);
    if (t.weight !== '' && t.weight != null && isFinite(weight) && weight >= 100) out.weight = Math.round(weight);
    if (typeof t.color === 'string' && t.color.trim()) out.color = t.color.trim();
    if (['left', 'center', 'right', 'justify'].indexOf(t.align) > -1) out.align = t.align;
    var lh = Number(t.lineHeight);
    if (t.lineHeight !== '' && t.lineHeight != null && isFinite(lh) && lh > 0) out.lineHeight = Math.round(lh * 100) / 100;
    var ls = Number(t.letterSpacing);
    if (t.letterSpacing !== '' && t.letterSpacing != null && isFinite(ls) && ls !== 0) out.letterSpacing = Math.round(ls * 100) / 100;
    return out;
  }

  /* Drawer / menu content. Ids are guaranteed unique so icon targets and
     reorder operations always resolve to exactly one item. */
  function normUI(raw) {
    var base = S.defaultUI();
    if (!raw || typeof raw !== 'object') return base;

    function normHeader(head) {
      head = head && typeof head === 'object' ? head : {};
      return {
        title: head.title == null ? base.drawer.header.title : String(head.title),
        subtitle: head.subtitle == null ? base.drawer.header.subtitle : String(head.subtitle),
        avatar: head.avatar == null ? base.drawer.header.avatar : String(head.avatar)
      };
    }

    function normItems(list, fallback) {
      var src = Array.isArray(list) ? list : fallback;
      var seen = {};
      return src.map(function (it) {
        if (!it || typeof it !== 'object') return null;
        var label = String(it.label == null ? '' : it.label).trim() || 'Untitled';
        var icon = typeof it.icon === 'string' && it.icon.trim() ? it.icon.trim() : 'msr:star';
        var id = it.id;
        if (!id || typeof id !== 'string' || seen[id]) id = S.util.uid();
        seen[id] = true;
        return { id: id, label: label, icon: icon, active: !!it.active };
      }).filter(Boolean);
    }

    function oneOf(value, allowed, fallback) {
      return allowed.indexOf(value) > -1 ? value : fallback;
    }

    function clampInt(value, min, max, fallback) {
      var n = Number(value);
      if (value === '' || value == null || !isFinite(n)) return fallback;
      return Math.max(min, Math.min(max, Math.round(n)));
    }

    var drawer = raw.drawer && typeof raw.drawer === 'object' ? raw.drawer : {};
    var menu = raw.menu && typeof raw.menu === 'object' ? raw.menu : {};
    var search = raw.search && typeof raw.search === 'object' ? raw.search : {};
    return {
      drawer: {
        showHeader: drawer.showHeader !== false,
        header: normHeader(drawer.header),
        items: normItems(drawer.items, base.drawer.items),
        width: clampInt(drawer.width, 64, 96, base.drawer.width),
        appearance: oneOf(drawer.appearance, ['surface', 'tinted', 'glass'], base.drawer.appearance),
        itemShape: oneOf(drawer.itemShape, ['pill', 'rounded', 'square'], base.drawer.itemShape),
        density: oneOf(drawer.density, ['compact', 'cozy', 'roomy'], base.drawer.density),
        showIcons: drawer.showIcons !== false,
        closeStyle: oneOf(drawer.closeStyle, ['icon', 'text', 'none'], base.drawer.closeStyle),
        closeShape: oneOf(drawer.closeShape, ['circle', 'square'], base.drawer.closeShape),
        closeLabel: drawer.closeLabel == null ? base.drawer.closeLabel : String(drawer.closeLabel)
      },
      menu: { items: normItems(menu.items, base.menu.items) },
      search: {
        mode: search.mode === 'page' ? 'page' : 'overlay',
        placeholder: search.placeholder == null ? base.search.placeholder : String(search.placeholder),
        chips: search.chips == null ? base.search.chips : String(search.chips),
        hint: search.hint == null ? base.search.hint : String(search.hint),
        reaction: oneOf(search.reaction, ['slide', 'fade', 'zoom'], base.search.reaction),
        resultStyle: oneOf(search.resultStyle, ['list', 'compact', 'cards'], base.search.resultStyle),
        fieldRadius: clampInt(search.fieldRadius, 0, 28, base.search.fieldRadius),
        showRecents: search.showRecents !== false,
        showQuickLinks: search.showQuickLinks !== false,
        showGuide: search.showGuide !== false,
        guide: search.guide == null ? base.search.guide : String(search.guide)
      }
    };
  }

  function normStyle(raw) {
    var style = raw && typeof raw === 'object' ? raw : {};
    var out = {};
    ['width', 'height', 'padding', 'margin', 'radius'].forEach(function (key) {
      var n = Number(style[key]);
      if (style[key] !== '' && style[key] != null && isFinite(n) && n >= 0) out[key] = Math.round(n);
    });
    if (typeof style.background === 'string' && style.background) out.background = style.background;
    if (['sm', 'md', 'lg'].indexOf(style.shadow) > -1) out.shadow = style.shadow;
    return out;
  }

  /* Pages own a screen each. Unknown ids are replaced so icon targets and
     page switching always resolve to exactly one page. */
  function normPages(list, seen) {
    var out = [];
    var used = {};
    (Array.isArray(list) ? list : []).forEach(function (page, index) {
      if (!page || typeof page !== 'object') return;
      var id = page.id;
      if (!id || typeof id !== 'string' || used[id]) id = S.util.uid();
      used[id] = true;
      var blocks = page.screen || page.blocks || [];
      out.push({
        id: id,
        name: String(page.name == null ? '' : page.name).trim() || ('Screen ' + (index + 1)),
        icon: typeof page.icon === 'string' && page.icon.trim() ? page.icon.trim() : 'msr:apps',
        hiddenFromNav: !!page.hiddenFromNav,
        screen: normScreen(blocks, seen)
      });
    });
    return out;
  }

  /* Mirror page names and icons into every bottom navigation block. Defined
     outside the state object so normalisation can call it before init. */
  function isBottomNavType(type) {
    return type === 'bottomnav' || (typeof type === 'string' && type.indexOf('bottomnav') === 0);
  }

  function syncNavFor(d) {
    if (!d || !Array.isArray(d.pages) || !d.pages.length) return;
    var navPages = d.pages.filter(function (page) {
      return !page.hiddenFromNav;
    });
    if (!navPages.length) navPages = [d.pages[0]];

    var items = navPages.map(function (page) {
      var icon = S.iconName ? S.iconName(page.icon || 'msr:apps') : (page.icon || 'apps');
      return (icon || 'apps') + ':' + String(page.name || 'Screen').replace(/[\r\n]+/g, ' ');
    }).join('\n');

    /* Every screen needs its own navigation so switching tabs never dead-ends.
       Find one tab bar first, then clone it onto pages that lost theirs. */
    var template = null;
    d.pages.forEach(function (page) {
      (page.screen || []).forEach(function (block) {
        if (!template && isBottomNavType(block.type)) template = block;
      });
    });
    var navStyle = (template && template.props && template.props.style) || 'material';
    if (template && template.type === 'bottomnavfloating') navStyle = 'floating';
    else if (template && template.type === 'bottomnavfab') navStyle = 'center-fab';
    else if (template && template.type === 'bottomnavexpanding') navStyle = 'expanding-pill';
    else if (template && template.type === 'bottomnavglass') navStyle = 'glass';

    d.pages.forEach(function (page, index) {
      page.screen = page.screen || [];
      // Deduplicate: remove extra bottom navs from the screen array
      var seenNav = false;
      var cleanScreen = [];
      var primaryNav = null;
      page.screen.forEach(function (block) {
        if (isBottomNavType(block.type)) {
          if (seenNav) return; // strip duplicate
          seenNav = true;
          block.type = 'bottomnav';
          primaryNav = block;
        }
        cleanScreen.push(block);
      });
      page.screen = cleanScreen;

      if (!primaryNav && template && S.makeBlock) {
        var clone = S.makeBlock('bottomnav', {
          items: items,
          active: (navPages.indexOf(page) > -1 ? navPages.indexOf(page) : 0),
          style: navStyle
        });
        if (clone) {
          page.screen.push(clone);
          primaryNav = clone;
        }
      }
      if (primaryNav) {
        primaryNav.props = primaryNav.props || {};
        primaryNav.props.items = items;
        var navIdx = navPages.indexOf(page);
        primaryNav.props.active = navIdx > -1 ? navIdx : -1;
        primaryNav.props.style = navStyle;
      }
    });

    // Make sure d.screen (active screen) stays in sync with deduplicated page
    var curr = d.pages.filter(function (p) { return p.id === d.activePageId; })[0];
    if (curr) d.screen = curr.screen;
  }

  /* Imported pages start with fresh ids so they never collide with the
     project they are being added to. */
  function regenIds(list) {
    (list || []).forEach(function (block) {
      block.id = S.util.uid();
      regenIds(block.children);
    });
    return list;
  }

  function uniquePageName(pages, name) {
    var base = String(name || 'Imported page').replace(/\s+/g, ' ').trim() || 'Imported page';
    var used = {};
    (pages || []).forEach(function (page) {
      used[String(page.name || '').toLowerCase()] = true;
    });
    if (!used[base.toLowerCase()]) return base;
    var n = 2;
    while (used[(base + ' ' + n).toLowerCase()]) n++;
    return base + ' ' + n;
  }

  function applyImportedDevice(d, raw) {
    if (!d || !raw || typeof raw !== 'object') return;
    var meta = S.targets[d.target] || S.targets.app;
    var device = Object.assign({}, d.device || meta.device, raw);
    var preset = S.matchDevice(d.target, device);
    device.width = Number(device.width) || meta.device.width;
    device.height = Number(device.height) || meta.device.height;
    device.preset = preset ? preset.id : null;
    if (d.target === 'app') {
      if (typeof raw.statusBar === 'boolean') device.statusBar = raw.statusBar;
      if (typeof raw.gestureBar === 'boolean') device.gestureBar = raw.gestureBar;
    }
    d.device = device;
  }

  /* Normalise one block and guarantee a unique id. */
  function normBlock(item, seen) {
    if (!item) return null;
    var def = S.components[item.type];
    if (!def) return null;

    var id = item.id;
    if (!id || typeof id !== 'string' || seen[id]) id = S.util.uid();
    seen[id] = true;

    return {
      id: id,
      type: item.type,
      props: Object.assign({}, def.defaults, item.props || {}),
      children: normScreen(item.children, seen),
      style: normStyle(item.style),
      typography: normTypo(item.typography),
      locked: !!item.locked,
      hidden: !!item.hidden
    };
  }

  function normScreen(list, seen) {
    seen = seen || {};
    return (Array.isArray(list) ? list : []).map(function (item) {
      return normBlock(item, seen);
    }).filter(Boolean);
  }

  function normalize(saved) {
    if (!saved || typeof saved !== 'object') return null;

    if (Array.isArray(saved)) {
      saved = { screen: saved };
    }

    if (Array.isArray(saved.screens) && (!Array.isArray(saved.pages) || !saved.pages.length)) {
      saved.pages = saved.screens.map(function (s, idx) {
        return {
          id: s.id || S.util.uid(),
          name: s.name || ('Screen ' + (idx + 1)),
          icon: s.icon || 'msr:apps',
          screen: s.blocks || s.screen || []
        };
      });
    }

    if (Array.isArray(saved.pages) && saved.pages.length && (!Array.isArray(saved.screen) || !saved.screen.length)) {
      var actP = saved.activePageId ? saved.pages.filter(function (p) { return p.id === saved.activePageId; })[0] : null;
      saved.screen = (actP || saved.pages[0]).screen || (actP || saved.pages[0]).blocks || [];
    }

    if (!Array.isArray(saved.screen)) {
      if (Array.isArray(saved.blocks)) saved.screen = saved.blocks;
      else if (saved.page && Array.isArray(saved.page.screen)) saved.screen = saved.page.screen;
      else return null;
    }
    var base = S.defaultState();
    var seen = {};

    base.target = S.targets[saved.target] ? saved.target : 'app';
    var targetMeta = S.targets[base.target] || S.targets.app;
    var device = Object.assign({}, targetMeta.device, saved.device || {});
    var preset = S.matchDevice(base.target, device);
    device.width = Number(device.width) || targetMeta.device.width;
    device.height = Number(device.height) || targetMeta.device.height;
    device.preset = preset ? preset.id : null;
    base.device = device;

    var theme = Object.assign({}, base.theme, saved.theme || {});
    if (saved.theme && saved.theme.mode != null) {
      theme.dark = saved.theme.mode === 'dark';
    }
    theme.fonts = Object.assign({}, base.theme.fonts, (saved.theme || {}).fonts || {});
    theme.type = Object.assign({}, base.theme.type, (saved.theme || {}).type || {});
    theme.icons = Object.assign({}, base.theme.icons, (saved.theme || {}).icons || {});
    base.theme = theme;
    base.ui = normUI(saved.ui);
    base.compare = Object.assign(base.compare, saved.compare || {});

    /* Restore the multi-screen model. Saved pages win, otherwise the single
       saved screen becomes the first page and tabs are derived from any bottom
       navigation block it contains. */
    if (Array.isArray(saved.pages) && saved.pages.length) {
      base.pages = normPages(saved.pages, seen);
      base.activePageId = saved.activePageId || base.pages[0].id;
      var activePage = base.pages.filter(function (p) { return p.id === base.activePageId; })[0] || base.pages[0];
      base.activePageId = activePage.id;
      base.screen = activePage.screen;
    } else {
      base.screen = normScreen(saved.screen, seen);
      if (base.target) {
        var made = S.pagesFromScreen(base.screen);
        base.pages = made.pages;
        base.activePageId = made.activePageId;
        base.screen = made.pages[0].screen;
      }
    }
    syncNavFor(base);

    base.stash = {};
    var stash = saved.stash || {};
    Object.keys(stash).forEach(function (key) {
      if (!S.targets[key] || !stash[key]) return;
      var stashMeta = S.targets[key];
      var stashDevice = Object.assign({}, stashMeta.device, stash[key].device || {});
      var stashPreset = S.matchDevice(key, stashDevice);
      stashDevice.width = Number(stashDevice.width) || stashMeta.device.width;
      stashDevice.height = Number(stashDevice.height) || stashMeta.device.height;
      stashDevice.preset = stashPreset ? stashPreset.id : null;
      base.stash[key] = {
        screen: normScreen(stash[key].screen, seen),
        device: stashDevice,
        selectedId: stash[key].selectedId || null
      };
    });

    base.selectedId = saved.selectedId || null;
    if (base.selectedId && !base.screen.some(function (i) { return i.id === base.selectedId; })) {
      base.selectedId = null;
    }
    return base;
  }
})();
