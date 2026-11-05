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
      var d = this.data;
      return JSON.stringify({
        target: d.target,
        device: d.device,
        theme: d.theme,
        screen: d.screen,
        stash: d.stash,
        selectedId: d.selectedId,
        ui: d.ui,
        compare: d.compare
      });
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

    var drawer = raw.drawer && typeof raw.drawer === 'object' ? raw.drawer : {};
    var menu = raw.menu && typeof raw.menu === 'object' ? raw.menu : {};
    return {
      drawer: {
        header: normHeader(drawer.header),
        items: normItems(drawer.items, base.drawer.items)
      },
      menu: { items: normItems(menu.items, base.menu.items) }
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

    base.screen = normScreen(saved.screen, seen);

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
