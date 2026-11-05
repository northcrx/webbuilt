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
      if (!d || d.target !== 'app' || !Array.isArray(d.pages) || !d.pages.length) return;
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
      if (!d || d.target !== 'app' || !id) return false;
      if (d.activePageId === id) return false;
      var page = this.pageById(id);
      if (!page) return false;

      this.syncActivePage();
      d.activePageId = page.id;
      d.screen = page.screen;
      d.selectedId = null;
      if (S.iconTarget) S.iconTarget = null;
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

    addPage: function () {
      var d = this.data;
      this.syncActivePage();
      if (!Array.isArray(d.pages)) d.pages = [];

      var source = null;
      d.pages.forEach(function (page) {
        if (source) return;
        (page.screen || []).forEach(function (block) {
          if (!source && block.type === 'bottomnav') source = block;
        });
      });

      var index = d.pages.length;
      var page = { id: S.util.uid(), name: 'Screen ' + (index + 1), icon: 'msr:apps', screen: [] };
      if (source) {
        var nav = S.makeBlock('bottomnav', {
          items: source.props.items,
          active: index,
          style: source.props.style || 'material'
        });
        if (nav) page.screen.push(nav);
      }
      d.pages.push(page);
      d.activePageId = page.id;
      d.screen = page.screen;
      d.selectedId = null;
      this.syncNavFromPages();
      this.commit('page:add');
      if (S.App) S.App.refresh('all');
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
      if (!d || d.target !== 'app') return;
      this.syncActivePage();
      var value = style || 'material';
      (d.pages || []).forEach(function (page) {
        (page.screen || []).forEach(function (block) {
          if (block.type === 'bottomnav') block.props.style = value;
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
      if (!d || d.target !== 'app') return;
      var source = null;
      var pages = d.pages || [];
      for (var i = 0; i < pages.length && !source; i++) {
        (pages[i].screen || []).forEach(function (block) {
          if (!source && block.type === 'bottomnav') source = block;
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
      if (this.data.target === 'app' && Array.isArray(parsed.pages) && parsed.pages.length) {
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
      out.push({
        id: id,
        name: String(page.name == null ? '' : page.name).trim() || ('Screen ' + (index + 1)),
        icon: typeof page.icon === 'string' && page.icon.trim() ? page.icon.trim() : 'msr:apps',
        screen: normScreen(page.screen, seen)
      });
    });
    return out;
  }

  /* Mirror page names and icons into every bottom navigation block. Defined
     outside the state object so normalisation can call it before init. */
  function syncNavFor(d) {
    if (!d || !Array.isArray(d.pages) || !d.pages.length) return;
    var items = d.pages.map(function (page) {
      var icon = S.iconName ? S.iconName(page.icon || 'msr:apps') : (page.icon || 'apps');
      return (icon || 'apps') + ':' + String(page.name || 'Screen').replace(/[\r\n]+/g, ' ');
    }).join('\n');

    /* Every screen needs its own navigation so switching tabs never dead-ends.
       Find one tab bar first, then clone it onto pages that lost theirs. */
    var template = null;
    d.pages.forEach(function (page) {
      (page.screen || []).forEach(function (block) {
        if (!template && block.type === 'bottomnav') template = block;
      });
    });
    var navStyle = (template && template.props.style) || 'material';

    d.pages.forEach(function (page, index) {
      page.screen = page.screen || [];
      var navs = page.screen.filter(function (block) { return block.type === 'bottomnav'; });
      if (!navs.length && template && S.makeBlock) {
        var clone = S.makeBlock('bottomnav', {
          items: items,
          active: index,
          style: navStyle
        });
        if (clone) {
          page.screen.push(clone);
          navs = [clone];
        }
      }
      navs.forEach(function (block) {
        block.props.items = items;
        block.props.active = index;
        block.props.style = navStyle;
      });
    });
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
    if (!saved || !Array.isArray(saved.screen)) return null;
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
    theme.fonts = Object.assign({}, base.theme.fonts, (saved.theme || {}).fonts || {});
    theme.type = Object.assign({}, base.theme.type, (saved.theme || {}).type || {});
    theme.icons = Object.assign({}, base.theme.icons, (saved.theme || {}).icons || {});
    base.theme = theme;
    base.ui = normUI(saved.ui);
    base.compare = Object.assign(base.compare, saved.compare || {});

    /* Restore the multi-screen model. Saved pages win, otherwise the single
       saved screen becomes the first page and tabs are derived from any bottom
       navigation block it contains. */
    if (base.target === 'app' && Array.isArray(saved.pages) && saved.pages.length) {
      base.pages = normPages(saved.pages, seen);
      base.activePageId = saved.activePageId || base.pages[0].id;
      var activePage = base.pages.filter(function (p) { return p.id === base.activePageId; })[0] || base.pages[0];
      base.activePageId = activePage.id;
      base.screen = activePage.screen;
    } else {
      base.screen = normScreen(saved.screen, seen);
      if (base.target === 'app') {
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
