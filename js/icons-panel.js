/* Right panel: searchable icon picker across five icon packs. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  var Icons = S.IconsPanel = {
    set: 'msr',
    query: '',

    init: function () {
      var box = document.getElementById('tab-icons');
      if (!box) return;

      box.innerHTML =
        '<div class="icon-target" id="icon-target"></div>' +
        '<div class="f-row"><div class="f-label">Icon pack</div>' +
        '<select class="f-select" id="icon-pack">' +
        S.iconPacks.map(function (p) {
          return '<option value="' + p.id + '"' + (p.id === Icons.set ? ' selected' : '') + '>' + esc(p.label) + '</option>';
        }).join('') + '</select></div>' +
        '<div class="font-search-row"><input class="f-input" id="icon-search" placeholder="Search icons…" spellcheck="false">' +
        '<button class="tb-btn" id="icon-style" title="Size, weight and fill"><span class="mi">tune</span></button></div>' +
        '<div class="icon-count" id="icon-count"></div>' +
        '<div class="icon-grid" id="icon-grid"></div>' +
        '<p class="icon-hint" id="icon-extra"></p>' +
        '<div class="font-search-row" id="icon-custom-row" style="margin-top:12px">' +
        '<input class="f-input" id="icon-custom" placeholder="Any Material icon name" spellcheck="false">' +
        '<button class="tb-btn" id="icon-use">Use</button></div>' +
        '<p class="icon-hint">Tip: <b>Material</b> packs need internet. <b>Lucide</b> is inline SVG and works offline. <b>Phosphor</b> loads on demand.</p>';

      this.bind(box);
      this.sync();
      this.renderGrid();
    },

    pack: function () {
      return S.iconPacks.filter(function (p) { return p.id === Icons.set; })[0] || S.iconPacks[0];
    },

    resolveTarget: function () {
      var d = S.State.data;

      /* Drawer / three-dot menu item icons. */
      if (S.iconTarget && S.iconTarget.ui) {
        var ui = d.ui || S.defaultUI();
        var entry = ui[S.iconTarget.list];
        var navItem = entry && (entry.items || []).filter(function (it) {
          return it.id === S.iconTarget.itemId;
        })[0];
        if (navItem) {
          return {
            ui: true,
            list: S.iconTarget.list,
            itemId: navItem.id,
            key: 'icon',
            label: (S.iconTarget.list === 'drawer' ? 'Drawer' : 'Menu') + ' · ' + navItem.label,
            manual: true
          };
        }
        S.iconTarget = null;
      }

      /* Screen tab icons. */
      if (S.iconTarget && S.iconTarget.page) {
        var page = (d.pages || []).filter(function (p) { return p.id === S.iconTarget.page; })[0];
        if (page) {
          return { page: true, id: page.id, label: page.name, manual: true };
        }
        S.iconTarget = null;
      }

      if (S.iconTarget) {
        var item = d.screen.filter(function (it) { return it.id === S.iconTarget.id; })[0];
        if (item) {
          var def = S.components[item.type];
          var field = def && def.fields.filter(function (f) { return f.key === S.iconTarget.key && f.type === 'icon'; })[0];
          if (field) return { id: item.id, key: S.iconTarget.key, label: def.label, manual: true };
        }
        S.iconTarget = null;
      }
      var sel = d.screen.filter(function (it) { return it.id === d.selectedId; })[0];
      if (!sel) return null;
      var selDef = S.components[sel.type];
      if (!selDef) return null;
      var iconField = selDef.fields.filter(function (f) { return f.type === 'icon'; })[0];
      if (!iconField) return null;
      return { id: sel.id, key: iconField.key, label: selDef.label, manual: false };
    },

    sync: function () {
      var target = this.resolveTarget();
      var banner = document.getElementById('icon-target');
      if (banner) {
        if (target && (target.ui || target.page)) {
          banner.innerHTML = '<span class="mi">ads_click</span><span>Picking for <b>' + esc(target.label) + '</b> · icon</span>' +
            '<button class="mini" id="icon-target-done">Done</button>';
        } else if (target) {
          var field = S.components[S.State.data.screen.filter(function (i) { return i.id === target.id; })[0].type]
            .fields.filter(function (f) { return f.key === target.key; })[0];
          banner.innerHTML = '<span class="mi">ads_click</span><span>Picking for <b>' + esc(target.label) + '</b> · ' + esc(field ? field.label : target.key) + '</span>' +
            (target.manual ? '<button class="mini" id="icon-target-done">Done</button>' : '');
        } else {
          banner.innerHTML = '<span class="mi">info</span><span>Select a block with an icon field to start picking.</span>';
        }
      }

      var select = document.getElementById('icon-pack');
      if (select) select.value = Icons.set;

      var customRow = document.getElementById('icon-custom-row');
      if (customRow) customRow.hidden = this.pack().kind !== 'material';

      var input = document.getElementById('icon-custom');
      if (input) input.placeholder = 'Any ' + this.pack().label.replace(' — inline SVG', '').replace(' — 100+ names', '') + ' name';

      var extra = document.getElementById('icon-extra');
      if (extra) {
        var p = this.pack();
        extra.textContent = p.kind === 'material'
          ? p.label + ': popular names below, or type any Material Symbols name above.'
          : p.kind === 'svg'
            ? 'Lucide: line icons drawn as inline SVG. Stroke width lives in the Theme tab.'
            : 'Phosphor: a curated set of 100+ names. The font loads the first time you pick one.';
      }
    },

    renderGrid: function () {
      var grid = document.getElementById('icon-grid');
      if (!grid) return;

      var q = this.query.toLowerCase().trim();
      var pack = this.pack();
      var names;
      if (pack.kind === 'material') {
        names = S.materialIcons.map(function (n) { return pack.id + ':' + n; });
      } else if (pack.kind === 'svg') {
        names = Object.keys(S.lucide).map(function (n) { return 'lucide:' + n; });
      } else {
        S.ensureIconPack('ph');
        names = S.phosphorIcons.map(function (n) { return 'ph:' + n; });
      }

      names = names.filter(function (name) {
        if (!q) return true;
        var plain = S.iconName(name).replace(/[_-]/g, ' ').toLowerCase();
        return plain.indexOf(q) > -1;
      });

      var count = document.getElementById('icon-count');
      if (count) count.textContent = names.length + ' icons · ' + pack.label.split(' — ')[0];

      grid.innerHTML = names.map(function (name) {
        return '<button class="icon-cell" data-icon="' + esc(name) + '" title="' + esc(S.iconName(name)) + '">' +
          S.icon(name) + '</button>';
      }).join('');
    },

    insert: function (name) {
      var target = this.resolveTarget();
      if (!target) { U.toast('Select a block that has an icon first'); return; }

      /* Screen tab icon */
      if (target.page) {
        S.State.setPageIcon(target.id, name);
        S.Render.drawScreen();
        if (S.Inspector) S.Inspector.render();
        this.sync();
        U.toast('Icon: ' + S.iconName(name));
        return;
      }

      /* Drawer / menu item icon */
      if (target.ui) {
        var d = S.State.data;
        var entry = (d.ui || S.defaultUI())[target.list];
        var navItem = entry && entry.items.filter(function (it) { return it.id === target.itemId; })[0];
        if (!navItem) { U.toast('That item is gone — pick another'); return; }
        navItem.icon = name;
        S.State.commit('ui:icon:' + target.itemId);
        S.Render.drawScreen();
        if (S.Inspector) S.Inspector.render();
        this.sync();
        U.toast('Icon: ' + S.iconName(name));
        return;
      }

      var item = S.State.data.screen.filter(function (it) { return it.id === target.id; })[0];
      if (!item) { U.toast('That block is gone — pick another'); return; }

      U.setPath(item.props, target.key, name);
      S.State.commit('icon:' + item.id + ':' + target.key);
      S.Render.drawScreen();
      if (S.Inspector) S.Inspector.render();
      this.sync();
      U.toast('Icon: ' + S.iconName(name));
    },

    bind: function (box) {
      var self = this;

      box.addEventListener('change', function (e) {
        if (e.target.id === 'icon-pack') {
          self.set = e.target.value;
          if (self.pack().kind === 'ph') S.ensureIconPack('ph');
          self.sync();
          self.renderGrid();
        }
      });

      box.addEventListener('click', function (e) {
        var cell = e.target.closest('.icon-cell');
        if (cell) { self.insert(cell.getAttribute('data-icon')); return; }

        if (e.target.closest('#icon-style')) { S.App.showTab('theme'); return; }

        if (e.target.closest('#icon-target-done')) {
          S.iconTarget = null;
          self.sync();
          return;
        }

        if (e.target.closest('#icon-use')) {
          var input = document.getElementById('icon-custom');
          var name = (input.value || '').trim();
          if (!/^[a-z0-9_]{2,48}$/i.test(name)) { U.toast('Use a name like auto_awesome'); return; }
          if (S.materialIcons.indexOf(name) === -1) S.materialIcons.push(name);
          input.value = '';
          self.insert(self.pack().prefix + name);
        }
      });

      box.addEventListener('input', function (e) {
        if (e.target.id === 'icon-search') {
          self.query = e.target.value;
          self.renderGrid();
        }
      });
    }
  };
})();
