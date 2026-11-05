/* Right panel: context-sensitive inspector for the selected block.
   Sections: Content, Style, Size, Advanced. All controls target only the
   block currently selected in State.data.selectedId. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;
  var highlightTimer = null;
  var navDrag = null;
  var pageDrag = null;

  /* Friendly hints shown under every field. Explicit `hint` on a field wins. */
  var HINTS = {
    title: 'Main heading shown in this block.',
    subtitle: 'Smaller supporting line under the title.',
    kicker: 'Tiny label above the heading.',
    text: 'Body copy shown in this block.',
    body: 'Longer description or supporting copy.',
    message: 'Text shown inside the component.',
    label: 'Text shown on this control.',
    placeholder: 'Hint text shown while the field is empty.',
    value: 'Value that appears inside the field.',
    support: 'Small helper text under the field.',
    items: 'One item per line. Separate columns with a vertical bar ( | ).',
    labels: 'Comma-separated labels.',
    actions: 'Comma-separated action labels or icon names.',
    leading: 'What appears before each row.',
    trailing: 'What appears after each row.',
    leadingIcon: 'Icon used before the row title.',
    media: 'Show or hide the image area.',
    mediaIcon: 'Icon used as the image placeholder.',
    icon: 'Choose an icon from the icon library.',
    full: 'Stretch this control across the whole width.',
    variant: 'Choose the Material 3 visual style.',
    active: 'Index of the highlighted item (starts at 0).',
    on: 'Turn this option on or off.',
    height: 'Height of this block in pixels.'
  };

  var STYLE_ROWS = [
    { key: 'width', label: 'Width', max: 1200, step: 5, hint: '0 keeps the block full width.' },
    { key: 'height', label: 'Height', max: 1200, step: 5, hint: '0 lets the content decide the height.' },
    { key: 'padding', label: 'Padding', max: 64, step: 2, hint: 'Space inside the block.' },
    { key: 'margin', label: 'Margin (vertical)', max: 64, step: 2, hint: 'Space above and below the block.' },
    { key: 'radius', label: 'Corner radius', max: 80, step: 2, hint: 'Round the block corners.' }
  ];

  var Inspector = S.Inspector = {
    render: function () {
      var box = document.getElementById('tab-inspect');
      if (!box) return;
      var d = S.State.data;
      var item = d.screen.filter(function (it) { return it.id === d.selectedId; })[0];

      /* Preserve disclosures across add/delete/reorder rerenders. */
      var nav = box.querySelector('.nav-sect');
      if (nav) this._navOpen = nav.open;
      var pagesSect = box.querySelector('.pages-sect');
      if (pagesSect) this._pagesOpen = pagesSect.open;
      var searchSect = box.querySelector('.search-sect');
      if (searchSect) this._searchOpen = searchSect.open;

      box.innerHTML = item ? this.componentPanel(item) : this.emptyPanel();

      /* Delegated listeners survive innerHTML updates; bind them only once. */
      if (!box.dataset.inspectorBound) {
        box.dataset.inspectorBound = '1';
        this.bind(box);
      }
    },

    emptyPanel: function () {
      var d = S.State.data;
      var target = d.target || 'app';
      var meta = S.targets[target];
      var preset = S.matchDevice(target, d.device);
      var isApp = target === 'app';
      var hint = target === 'web'
        ? 'Click any section or text to edit it. Drag a block to reorder it on the page.'
        : target === 'ext'
          ? 'Click any popup block to edit it. Drag blocks to reorder the popup.'
          : 'Click any block to edit its content. Click its text to type directly.';
      var dark = d.theme.dark;
      var sizeLabel = preset ? preset.label : 'Custom size';
      var sizeIcon = preset ? preset.icon : meta.icon;

      return '<div class="sect">' +
        '<div class="sect-title">' + esc(meta.label) + ' · canvas</div>' +
        '<div class="f-row">' +
        '<div class="f-label"><span>Device size</span><span class="val">' + d.device.width + ' × ' + d.device.height + '</span></div>' +
        '<button type="button" class="device-open" data-open-devices aria-haspopup="true" aria-controls="device-menu">' +
        '<span class="mi">' + esc(sizeIcon) + '</span>' +
        '<span class="device-open-text">' + esc(sizeLabel) + '</span>' +
        '<span class="mi">expand_more</span>' +
        '</button>' +
        '<small class="f-hint">Pick a phone, tablet, foldable or page size.</small>' +
        '</div>' +
        (isApp
          ? '<div class="f-row"><div class="f-label">Status bar</div>' +
            '<button class="f-toggle' + (d.device.statusBar ? ' on' : '') + '" data-device="statusBar">' +
            '<span class="tgl"></span><span>Show status bar</span></button>' +
            '<small class="f-hint">Android status icons and clock at the top of the screen.</small></div>' +
            '<div class="f-row"><div class="f-label">Gesture bar</div>' +
            '<button class="f-toggle' + (d.device.gestureBar ? ' on' : '') + '" data-device="gestureBar">' +
            '<span class="tgl"></span><span>Show gesture bar</span></button>' +
            '<small class="f-hint">The swipe handle at the bottom of the phone.</small></div>'
          : '') +
        '<div class="f-row"><div class="f-label">Appearance</div>' +
        '<button class="f-toggle' + (dark ? ' on' : '') + '" data-theme-dark>' +
        '<span class="tgl"></span><span>Dark mode</span></button>' +
        '<small class="f-hint">Switch the whole project between light and dark surfaces.</small></div>' +
        '</div>' +

        this.pagesSection() +

        '<div class="sect">' +
        '<div class="sect-title">Start here</div>' +
        '<div class="inspect-help">' +
        '<span class="mi">ads_click</span>' +
        '<div><b>Select a block</b><p>' + hint + '</p></div>' +
        '</div>' +
        '<div class="inspect-help soft">' +
        '<span class="mi">keyboard</span>' +
        '<div><b>Shortcuts</b><p>Ctrl+Z undo · Ctrl+Y redo · Ctrl+D duplicate · Delete removes · Arrow keys move the selected block · / searches blocks.</p></div>' +
        '</div>' +
        '<button class="tb-btn" data-act="clear" style="width:100%"><span class="mi">delete_sweep</span><span>' +
        (isApp ? 'Clear screen' : 'Clear page') + '</span></button>' +
        '</div>' +
        this.navSection();
    },

    componentPanel: function (item) {
      var def = S.components[item.type];
      if (!def) return '';
      var fields = def.fields.map(function (f) { return this.field(f, item); }, this).join('');
      var lockLabel = item.locked ? 'Unlock' : 'Lock';
      var hideLabel = item.hidden ? 'Show' : 'Hide';

      return '<div class="inspect-head">' +
        '<div><div class="ih-type">' + esc(def.label) + '</div>' +
        '<div class="ih-sub">' + esc(item.type) + ' · ' + esc(item.id) +
        (item.locked ? ' · locked' : '') + (item.hidden ? ' · hidden' : '') + '</div></div>' +
        '<div class="ih-actions">' +
        '<button type="button" class="mini" data-act="duplicate" data-block-id="' + esc(item.id) + '" title="Duplicate (Ctrl+D)" aria-label="Duplicate block"><span class="mi">content_copy</span></button>' +
        '<button type="button" class="mini" data-act="up" data-block-id="' + esc(item.id) + '" title="Move up" aria-label="Move block up"><span class="mi">expand_less</span></button>' +
        '<button type="button" class="mini" data-act="down" data-block-id="' + esc(item.id) + '" title="Move down" aria-label="Move block down"><span class="mi">expand_more</span></button>' +
        '<button type="button" class="mini" data-act="del" data-block-id="' + esc(item.id) + '" title="Delete block" aria-label="Delete block"><span class="mi">close</span></button>' +
        '</div></div>' +

        /* Content */
        '<div class="sect">' +
        '<div class="sect-title">Content</div>' + fields +
        '</div>' +

        /* Phase A — typography for this block */
        S.Typography.section(item) +

        /* Style */
        this.styleSection(item) +

        /* Size */
        this.sizeSection(item) +

        /* Advanced */
        this.advancedSection(item, lockLabel, hideLabel) +

        /* Screens + Phase B — drawer / menu content */
        this.pagesSection() +
        this.navSection() +

        '<p class="inspect-note">Click any text in the preview to edit it directly. Enter saves · Esc cancels.</p>';
    },

    styleSection: function (item) {
      var style = item.style || {};
      var radius = STYLE_ROWS[4];
      var bg = typeof style.background === 'string' ? style.background : '';
      var shadow = style.shadow || '';
      var safeBg = /^#[0-9a-f]{6}$/i.test(bg) ? bg : '#ffffff';

      return '<div class="sect">' +
        '<div class="sect-title">Style</div>' +
        this.styleRow(item, radius) +
        '<div class="f-row" data-style-row="background">' +
        '<div class="f-label"><span>Background</span></div>' +
        '<div class="f-color">' +
        '<input type="color" value="' + safeBg + '" data-style-color="background" aria-label="Block background colour">' +
        '<input class="f-input" type="text" value="' + esc(bg) + '" placeholder="Transparent" data-style-color="background" aria-label="Block background CSS colour">' +
        '<button type="button" class="mini" data-act="style-clear" data-style-key="background" title="Clear background" aria-label="Clear background"><span class="mi">format_clear</span></button>' +
        '</div>' +
        '<small class="f-hint">A colour behind this block only.</small>' +
        '</div>' +
        '<div class="f-row">' +
        '<div class="f-label"><span>Shadow</span></div>' +
        '<select class="f-select" data-style-select="shadow" aria-label="Block shadow">' +
        '<option value=""' + (!shadow ? ' selected' : '') + '>None</option>' +
        '<option value="sm"' + (shadow === 'sm' ? ' selected' : '') + '>Soft</option>' +
        '<option value="md"' + (shadow === 'md' ? ' selected' : '') + '>Medium</option>' +
        '<option value="lg"' + (shadow === 'lg' ? ' selected' : '') + '>Large</option>' +
        '</select>' +
        '<small class="f-hint">Lift the block off the page.</small>' +
        '</div>' +
        '</div>';
    },

    sizeSection: function (item) {
      var html = STYLE_ROWS.slice(0, 4).map(function (row) {
        return this.styleRow(item, row);
      }, this).join('');
      return '<div class="sect">' +
        '<div class="sect-title">Size</div>' + html +
        '</div>';
    },

    styleRow: function (item, row) {
      var style = item.style || {};
      var value = Number(style[row.key]) || 0;
      var auto = (row.key === 'width' || row.key === 'height') && !value;
      var shown = auto ? 'Auto' : value + 'px';

      return '<div class="f-row" data-style-row="' + row.key + '">' +
        '<div class="f-label"><span>' + esc(row.label) + '</span>' +
        '<span class="val" data-style-val="' + row.key + '">' + shown + '</span></div>' +
        '<div class="f-pair">' +
        '<input type="range" class="f-range" data-style="' + row.key + '" min="0" max="' + row.max +
        '" step="' + row.step + '" value="' + value + '" aria-label="' + esc(row.label) + ' slider">' +
        '<input type="number" class="f-input f-num" data-style="' + row.key + '" min="0" max="' + row.max +
        '" step="' + row.step + '" value="' + value + '" aria-label="' + esc(row.label) + ' value">' +
        '</div>' +
        '<small class="f-hint">' + esc(row.hint) + '</small>' +
        '</div>';
    },

    advancedSection: function (item, lockLabel, hideLabel) {
      return '<div class="sect">' +
        '<div class="sect-title">Advanced</div>' +
        '<div class="adv-grid">' +
        '<button type="button" class="adv-btn' + (item.locked ? ' on' : '') + '" data-act="lock" data-block-id="' + esc(item.id) + '" aria-pressed="' + !!item.locked + '">' +
        '<span class="mi">' + (item.locked ? 'lock' : 'lock_open') + '</span><span>' + lockLabel + '</span></button>' +
        '<button type="button" class="adv-btn' + (item.hidden ? ' on' : '') + '" data-act="hide" data-block-id="' + esc(item.id) + '" aria-pressed="' + !!item.hidden + '">' +
        '<span class="mi">' + (item.hidden ? 'visibility' : 'visibility_off') + '</span><span>' + hideLabel + '</span></button>' +
        '<button type="button" class="adv-btn" data-act="duplicate" data-block-id="' + esc(item.id) + '">' +
        '<span class="mi">content_copy</span><span>Duplicate</span></button>' +
        '<button type="button" class="adv-btn danger" data-act="del" data-block-id="' + esc(item.id) + '">' +
        '<span class="mi">delete</span><span>Delete</span></button>' +
        '</div>' +
        '<div class="f-row" style="margin-top:10px">' +
        '<div class="f-label"><span>Block ID</span></div>' +
        '<input class="f-input" type="text" value="' + esc(item.id) + '" readonly aria-label="Block ID">' +
        '<small class="f-hint">Unique identifier used by save, undo and export.</small>' +
        '</div>' +
        '</div>';
    },

    /* Screens are the bottom-navigation tabs. Renaming, recolouring or moving
       one here immediately updates every tab bar on every screen. */
    pagesSection: function () {
      var d = S.State.data;
      if (d.target !== 'app' || !Array.isArray(d.pages) || !d.pages.length) return '';
      this._pagesOpen = this._pagesOpen !== false;

      var rows = d.pages.map(function (page, index) {
        var active = page.id === d.activePageId;
        return '<div class="page-row' + (active ? ' is-active' : '') + '" data-page-row="' + esc(page.id) + '" data-page-index="' + index + '">' +
          '<span class="nav-grip mi" draggable="true" data-page-grip="' + esc(page.id) + '" title="Drag to reorder" aria-hidden="true">drag_indicator</span>' +
          '<button type="button" class="nav-ico" data-page-icon="' + esc(page.id) + '" title="Change tab icon" aria-label="Change icon for ' + esc(page.name) + '">' + S.icon(page.icon || 'msr:apps') + '</button>' +
          '<input class="f-input nav-name" type="text" value="' + esc(page.name) + '" data-page-name="' + esc(page.id) + '" placeholder="Screen name" aria-label="Screen name">' +
          '<button type="button" class="mini' + (active ? ' on' : '') + '" data-page-open="' + esc(page.id) + '" title="' + (active ? 'Editing this screen' : 'Edit this screen') + '" aria-label="Open ' + esc(page.name) + '"><span class="mi">' + (active ? 'check' : 'open_in_new') + '</span></button>' +
          '<button type="button" class="mini" data-page-move="-1" data-page-id="' + esc(page.id) + '" title="Move left" aria-label="Move screen left"><span class="mi">chevron_left</span></button>' +
          '<button type="button" class="mini" data-page-move="1" data-page-id="' + esc(page.id) + '" title="Move right" aria-label="Move screen right"><span class="mi">chevron_right</span></button>' +
          (d.pages.length > 1 ? '<button type="button" class="mini danger" data-page-del="' + esc(page.id) + '" title="Delete screen" aria-label="Delete screen"><span class="mi">close</span></button>' : '') +
          '</div>';
      }).join('');

      return '<details class="sect pages-sect"' + (this._pagesOpen ? ' open' : '') + '>' +
        '<summary class="sect-title">Screens <span class="count">' + d.pages.length + '</span></summary>' +
        '<div class="pages-list">' + rows + '</div>' +
        '<div class="f-pair" style="margin-top:8px">' +
        '<button type="button" class="mini wide" data-page-add><span class="mi">add</span>Add screen</button>' +
        '<button type="button" class="mini wide" data-page-add-search><span class="mi">manage_search</span>Search screen</button>' +
        '</div>' +
        '<small class="f-hint">Each screen is a bottom-navigation tab. Drag the grip to reorder; every tab bar updates.</small>' +
        '</details>';
    },

    /* Search overlay settings: mode, placeholder, filter chips and hint. */
    searchSection: function () {
      var d = S.State.data;
      var ui = d.ui || S.defaultUI();
      var search = ui.search || S.defaultUI().search;
      this._searchOpen = !!this._searchOpen;
      return '<details class="sect search-sect"' + (this._searchOpen ? ' open' : '') + '>' +
        '<summary class="sect-title">Search experience</summary>' +
        '<div class="f-row"><div class="f-label">Opens as</div>' +
        '<select class="f-select" data-search-mode aria-label="Search opening mode">' +
        '<option value="overlay"' + (search.mode !== 'page' ? ' selected' : '') + '>Overlay sheet</option>' +
        '<option value="page"' + (search.mode === 'page' ? ' selected' : '') + '>Dedicated screen</option>' +
        '</select><small class="f-hint">Dedicated mode jumps to the screen that contains a Search page block.</small></div>' +
        '<div class="f-row"><div class="f-label">Placeholder</div>' +
        '<input class="f-input" type="text" value="' + esc(search.placeholder || '') + '" data-search-field="placeholder" aria-label="Search placeholder">' +
        '<small class="f-hint">Shown inside the search field before anything is typed.</small></div>' +
        '<div class="f-row"><div class="f-label">Filter chips (comma separated)</div>' +
        '<input class="f-input" type="text" value="' + esc(search.chips || '') + '" data-search-field="chips" aria-label="Search filter chips">' +
        '<small class="f-hint">Quick filters displayed under the search bar.</small></div>' +
        '<div class="f-row"><div class="f-label">Helper text</div>' +
        '<input class="f-input" type="text" value="' + esc(search.hint || '') + '" data-search-field="hint" aria-label="Search helper text">' +
        '<small class="f-hint">Empty-state tip shown before a query is entered.</small></div>' +
        '</details>';
    },

    /* Phase B — edit the drawer header and the items inside the drawer and
       three-dot menu. Icons reuse the existing icon picker. */
    navSection: function () {
      var d = S.State.data;
      var ui = d.ui || S.defaultUI();
      var header = ui.drawer.header || {};
      var self = this;
      this._navOpen = this._navOpen || false;

      var row = function (list, it) {
        return '<div class="nav-row" data-nav-row="' + list + '" data-nav-id="' + esc(it.id) + '">' +
          '<span class="nav-grip mi" draggable="true" data-nav-grip="' + list + '" data-nav-id="' + esc(it.id) + '" title="Drag to reorder" aria-hidden="true">drag_indicator</span>' +
          '<button type="button" class="nav-ico" data-nav-icon="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Change icon" aria-label="Change icon for ' + esc(it.label) + '">' + S.icon(it.icon) + '</button>' +
          '<input class="f-input nav-name" type="text" value="' + esc(it.label) + '" data-nav-item="' + esc(it.id) +
          '" data-nav-list="' + list + '" data-nav-field="label" placeholder="Item name" aria-label="Item name">' +
          '<button type="button" class="mini" data-nav-move="-1" data-nav-id="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Move up" aria-label="Move item up"><span class="mi">expand_less</span></button>' +
          '<button type="button" class="mini" data-nav-move="1" data-nav-id="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Move down" aria-label="Move item down"><span class="mi">expand_more</span></button>' +
          '<button type="button" class="mini danger" data-nav-del="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Delete item" aria-label="Delete item"><span class="mi">close</span></button>' +
          '</div>';
      };

      var rows = function (list) {
        var items = ((ui[list] || {}).items) || [];
        return items.length ? items.map(function (it) { return row(list, it); }).join('') :
          '<p class="nav-empty">No items yet. Add one below.</p>';
      };

      var count = ((ui.drawer.items || []).length) + ((ui.menu.items || []).length);

      return '<details class="sect nav-sect"' + (this._navOpen ? ' open' : '') + '>' +
        '<summary class="sect-title">Navigation <span class="count">' + count + '</span></summary>' +

        '<div class="nav-head-edit">' +
        '<div class="f-label"><span>Drawer header</span></div>' +
        '<button type="button" class="f-toggle' + (ui.drawer.showHeader !== false ? ' on' : '') + '" data-drawer-header-toggle aria-pressed="' + (ui.drawer.showHeader !== false) + '">' +
        '<span class="tgl"></span><span>' + (ui.drawer.showHeader !== false ? 'Profile header shown' : 'Profile header hidden') + '</span></button>' +
        '<input class="f-input" type="text" value="' + esc(header.title || '') + '" data-nav-header="title" placeholder="Title" aria-label="Drawer title">' +
        '<div class="f-pair">' +
        '<input class="f-input" type="text" value="' + esc(header.subtitle || '') + '" data-nav-header="subtitle" placeholder="Subtitle" aria-label="Drawer subtitle">' +
        '<input class="f-input" type="text" value="' + esc(header.avatar || '') + '" data-nav-header="avatar" placeholder="Avatar" aria-label="Drawer avatar initials" maxlength="3">' +
        '</div>' +
        '<small class="f-hint">Shown at the top of the slide-in drawer.</small>' +
        '</div>' +

        '<div class="nav-group">' +
        '<div class="nav-group-title"><span>Drawer items</span>' +
        '<button type="button" class="mini wide" data-nav-add="drawer"><span class="mi">add</span>Add</button></div>' +
        rows('drawer') +
        '</div>' +

        '<div class="nav-group">' +
        '<div class="nav-group-title"><span>Three-dot menu</span>' +
        '<button type="button" class="mini wide" data-nav-add="menu"><span class="mi">add</span>Add</button></div>' +
        rows('menu') +
        '</div>' +

        '<small class="f-hint">Drag the grip to reorder. Click an icon to swap it. Changes save automatically and undo with Ctrl+Z.</small>' +
        '</details>' +
        this.searchSection();
    },

    navEntry: function (list) {
      var d = S.State.data;
      d.ui = d.ui || S.defaultUI();
      if (!d.ui[list]) d.ui[list] = { items: [] };
      if (!Array.isArray(d.ui[list].items)) d.ui[list].items = [];
      if (list === 'drawer' && !d.ui.drawer.header) d.ui.drawer.header = S.defaultUI().drawer.header;
      return d.ui[list];
    },

    navItem: function (list, id) {
      var entry = this.navEntry(list);
      return entry.items.filter(function (it) { return it.id === id; })[0] || null;
    },

    navAdd: function (list) {
      var entry = this.navEntry(list);
      entry.items.push({
        id: U.uid(),
        label: list === 'drawer' ? 'New page' : 'New action',
        icon: list === 'drawer' ? 'msr:pages' : 'msr:bolt',
        active: false
      });
      S.State.commit('ui:add:' + list);
      this.afterNavChange();
    },

    navRemove: function (list, id) {
      var entry = this.navEntry(list);
      entry.items = entry.items.filter(function (it) { return it.id !== id; });
      S.State.commit('ui:del:' + list);
      this.afterNavChange();
    },

    navMove: function (list, id, dir) {
      var entry = this.navEntry(list);
      var idx = entry.items.map(function (it) { return it.id; }).indexOf(id);
      var to = idx + dir;
      if (idx < 0 || to < 0 || to >= entry.items.length) {
        U.toast(dir < 0 ? 'Already at the top' : 'Already at the bottom');
        return;
      }
      var item = entry.items.splice(idx, 1)[0];
      entry.items.splice(to, 0, item);
      S.State.commit('ui:move:' + list);
      this.afterNavChange();
    },

    /* Drag-and-drop reorder: move one nav item before another. */
    navMoveBefore: function (list, id, beforeId) {
      var entry = this.navEntry(list);
      var from = entry.items.map(function (it) { return it.id; }).indexOf(id);
      if (from < 0 || id === beforeId) return false;
      var item = entry.items.splice(from, 1)[0];
      var to = entry.items.map(function (it) { return it.id; }).indexOf(beforeId);
      if (to < 0) to = entry.items.length;
      if (from < to) to--;
      entry.items.splice(to, 0, item);
      S.State.commit('ui:move:' + list);
      this.afterNavChange();
      return true;
    },

    afterNavChange: function () {
      S.Render.drawScreen();
      this.render();
    },

    /* Apply a typography field to the selected block. */
    setTypo: function (key, raw, source) {
      var item = this.selected();
      if (!item) return;
      if (this.guardLocked(item)) return;

      item.typography = item.typography || {};
      var t = item.typography;
      var value = raw;

      if (key === 'size' || key === 'lineHeight' || key === 'letterSpacing' || key === 'weight') {
        var n = Number(raw);
        if (raw === '' || raw == null || !isFinite(n)) {
          delete t[key];
        } else if (key === 'size') {
          if (n > 0) t.size = Math.round(n * 10) / 10; else delete t.size;
        } else if (key === 'lineHeight') {
          if (n > 0) t.lineHeight = Math.round(n * 100) / 100; else delete t.lineHeight;
        } else if (key === 'letterSpacing') {
          if (n === 0) delete t.letterSpacing; else t.letterSpacing = Math.round(n * 100) / 100;
        } else {
          if (n >= 100) t.weight = Math.round(n); else delete t.weight;
        }
      } else {
        value = String(raw == null ? '' : raw).trim();
        if (value) t[key] = value; else delete t[key];
      }

      if (key === 'color') {
        var box = document.getElementById('tab-inspect');
        if (box) {
          box.querySelectorAll('[data-typo="color"]').forEach(function (other) {
            if (other !== source) other.value = value;
          });
        }
      }

      S.Render.drawScreen();
      S.State.commit('typo:' + item.id + ':' + key);
    },

    setTypoAlign: function (align) {
      var item = this.selected();
      if (!item) return;
      if (this.guardLocked(item)) return;

      item.typography = item.typography || {};
      if (item.typography.align === align) delete item.typography.align;
      else item.typography.align = align;

      var box = document.getElementById('tab-inspect');
      if (box) box.querySelectorAll('[data-typo-align]').forEach(function (btn) {
        var on = btn.getAttribute('data-typo-align') === item.typography.align;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      S.Render.drawScreen();
      S.State.commit('typo:' + item.id + ':align');
    },

    field: function (f, item) {
      var value = U.getPath(item.props, f.key);
      var id = 'f_' + item.id + '_' + f.key;
      var labelTag = (f.type === 'toggle' || f.type === 'icon') ? 'div' : 'label';
      var labelAttrs = labelTag === 'label' ? ' for="' + id + '"' : '';
      var head = '<' + labelTag + ' class="f-label"' + labelAttrs + '><span>' + esc(f.label) + '</span>' +
        ((f.type === 'range' || f.type === 'number') ? '<span class="val" data-val="' + esc(f.key) + '">' + value + (f.suffix || '') + '</span>' : '') +
        '</' + labelTag + '>';
      var hint = '<small class="f-hint">' + esc(f.hint || HINTS[f.key] || this.hintForType(f)) + '</small>';
      var wrap = function (control) {
        return '<div class="f-row" data-field-row="' + esc(f.key) + '">' + head + control + hint + '</div>';
      };

      if (f.type === 'textarea') {
        return wrap('<textarea class="f-textarea" id="' + id + '" data-key="' + esc(f.key) + '" rows="3">' + esc(value) + '</textarea>');
      }
      if (f.type === 'select') {
        return wrap('<select class="f-select" id="' + id + '" data-key="' + esc(f.key) + '">' +
          (f.options || []).map(function (opt) {
            return '<option value="' + esc(opt[0]) + '"' + (String(value) === String(opt[0]) ? ' selected' : '') + '>' + esc(opt[1]) + '</option>';
          }).join('') + '</select>');
      }
      if (f.type === 'toggle') {
        return wrap('<button type="button" class="f-toggle' + (value ? ' on' : '') + '" data-key="' + esc(f.key) + '" data-toggle="1">' +
          '<span class="tgl"></span><span>' + (value ? 'On' : 'Off') + '</span></button>');
      }
      if (f.type === 'range') {
        var min = f.min == null ? 0 : f.min;
        var max = f.max == null ? 100 : f.max;
        var step = f.step || 1;
        return wrap('<div class="f-pair">' +
          '<input class="f-range" type="range" id="' + id + '" data-key="' + esc(f.key) + '" min="' + min +
          '" max="' + max + '" step="' + step + '" value="' + value + '">' +
          '<input class="f-input f-num" type="number" data-key="' + esc(f.key) + '" min="' + min +
          '" max="' + max + '" step="' + step + '" value="' + value + '">' +
          '</div>');
      }
      if (f.type === 'number') {
        return wrap('<input class="f-input" type="number" id="' + id + '" data-key="' + esc(f.key) + '" min="' + (f.min == null ? '' : f.min) +
          '" max="' + (f.max == null ? '' : f.max) + '" value="' + esc(value) + '">');
      }
      if (f.type === 'icon') {
        return wrap('<button type="button" class="icon-field" data-key="' + esc(f.key) + '" data-icon-field="1">' +
          '<span class="if-preview">' + S.icon(value) + '</span>' +
          '<span class="if-name">' + esc(S.iconName(value) || 'choose an icon') + '</span>' +
          '<span class="if-go">Pick</span></button>');
      }
      return wrap('<input class="f-input" type="text" id="' + id + '" data-key="' + esc(f.key) + '" value="' + esc(value) + '">');
    },

    hintForType: function (f) {
      if (f.type === 'select') return 'Choose one of the available options.';
      if (f.type === 'toggle') return 'Turn this option on or off.';
      if (f.type === 'icon') return 'Choose an icon from the icon library.';
      if (f.type === 'textarea') return 'Multi-line content. Use line breaks to separate items.';
      if (f.type === 'range' || f.type === 'number') return 'Drag the slider or type an exact value.';
      return 'Text shown in this block.';
    },

    guardLocked: function (item) {
      if (!item || !item.locked) return false;
      U.toast('Block is locked — unlock it to edit');
      return true;
    },

    /* Keep an inspector input in sync when text was edited directly in the
       preview (the panel may not have been re-rendered yet). */
    syncField: function (path, value) {
      var box = document.getElementById('tab-inspect');
      if (!box || !path) return;
      var key = String(path).split('.')[0];
      box.querySelectorAll('[data-key]').forEach(function (el) {
        var elKey = el.getAttribute('data-key');
        if (elKey !== path && elKey !== key) return;
        if (el.type !== 'range' && el.type !== 'number') el.value = value;
      });
      box.querySelectorAll('[data-val]').forEach(function (el) {
        if (el.getAttribute('data-val') === path || el.getAttribute('data-val') === key) {
          el.textContent = value;
        }
      });
    },

    bind: function (box) {
      var self = this;

      /* `toggle` does not bubble, so listen in the capture phase. */
      box.addEventListener('toggle', function (e) {
        if (e.target.classList && e.target.classList.contains('nav-sect')) {
          self._navOpen = e.target.open;
        }
      }, true);

      box.addEventListener('input', function (e) {
        var el = e.target;

        if (self.selected() && self.selected().locked &&
            (el.hasAttribute('data-key') || el.hasAttribute('data-style') || el.hasAttribute('data-style-color') || el.hasAttribute('data-typo'))) {
          self.guardLocked(self.selected());
          return;
        }

        /* Screen name — keeps every bottom navigation tab in sync. */
        var pageName = el.getAttribute('data-page-name');
        if (pageName) {
          S.State.renamePage(pageName, el.value);
          S.Render.drawScreen();
          return;
        }

        /* Search overlay settings */
        var searchField = el.getAttribute('data-search-field');
        if (searchField) {
          var searchData = S.State.data;
          searchData.ui = searchData.ui || S.defaultUI();
          searchData.ui.search = searchData.ui.search || S.defaultUI().search;
          searchData.ui.search[searchField] = el.value;
          S.Render.drawScreen();
          S.State.commit('ui:search:' + searchField);
          return;
        }

        /* Drawer header text */
        var navHeader = el.getAttribute('data-nav-header');
        if (navHeader) {
          var navData = S.State.data;
          navData.ui = navData.ui || S.defaultUI();
          navData.ui.drawer = navData.ui.drawer || S.defaultUI().drawer;
          navData.ui.drawer.header = navData.ui.drawer.header || S.defaultUI().drawer.header;
          navData.ui.drawer.header[navHeader] = el.value;
          S.Render.drawScreen();
          S.State.commit('ui:header:' + navHeader);
          return;
        }

        /* Drawer / menu item name */
        var navId = el.getAttribute('data-nav-item');
        if (navId) {
          var navList = el.getAttribute('data-nav-list');
          var navRow = self.navItem(navList, navId);
          if (!navRow) return;
          navRow[el.getAttribute('data-nav-field') || 'label'] = el.value;
          S.Render.drawScreen();
          S.State.commit('ui:item:' + navId + ':label');
          return;
        }

        /* Per-block typography */
        var typoKey = el.getAttribute('data-typo');
        if (typoKey) {
          self.setTypo(typoKey, el.value, el);
          return;
        }

        /* Component content props */
        var key = el.getAttribute('data-key');
        if (key) {
          var item = self.selected();
          if (!item) return;
          var field = self.fieldDef(item, key);
          var value = el.value;
          if (el.type === 'range' || el.type === 'number') {
            value = Number(value);
            if (!isFinite(value)) value = 0;
            if (field && field.min != null) value = Math.max(field.min, value);
            if (field && field.max != null) value = Math.min(field.max, value);
          }
          U.setPath(item.props, key, value);

          /* Editing a bottom-navigation tab list grows/shrinks the screen list
             too, keeping page content by position. */
          if (item.type === 'bottomnav' && key === 'items') {
            S.State.syncPagesFromNav();
            S.State.syncNavFromPages();
          }
          if (item.type === 'bottomnav' && key === 'style') {
            S.State.syncNavStyle(value);
          }

          box.querySelectorAll('[data-key="' + key + '"]').forEach(function (other) {
            if (other !== el) other.value = value;
          });
          box.querySelectorAll('[data-val="' + key + '"]').forEach(function (val) {
            val.textContent = value + ((field && field.suffix) || '');
          });

          S.Render.drawScreen();
          /* Each design pick is its own undo step, even when clicked quickly. */
          S.State.commit(item.type === 'bottomnav' && key === 'style'
            ? null
            : 'prop:' + item.id + ':' + key);
          return;
        }

        /* Per-block numeric style (padding, width, radius, …) */
        var styleKey = el.getAttribute('data-style');
        if (styleKey) {
          var styleItem = self.selected();
          if (!styleItem) return;
          var num = Math.max(0, Number(el.value) || 0);
          styleItem.style = styleItem.style || {};
          styleItem.style[styleKey] = Math.round(num);

          box.querySelectorAll('[data-style="' + styleKey + '"]').forEach(function (other) {
            if (other !== el) other.value = num;
          });
          self.setStyleLabel(box, styleKey, num);
          S.Render.drawScreen();
          S.State.commit('style:' + styleItem.id + ':' + styleKey);
          return;
        }

        /* Background colour (colour picker + text input share this attribute) */
        var colorKey = el.getAttribute('data-style-color');
        if (colorKey) {
          var colorItem = self.selected();
          if (!colorItem) return;
          colorItem.style = colorItem.style || {};
          colorItem.style[colorKey] = el.value.trim();
          box.querySelectorAll('[data-style-color="' + colorKey + '"]').forEach(function (other) {
            if (other !== el) other.value = el.value;
          });
          S.Render.drawScreen();
          S.State.commit('style:' + colorItem.id + ':' + colorKey);
        }
      });

      box.addEventListener('change', function (e) {
        var el = e.target;

        if (self.selected() && self.selected().locked &&
            (el.hasAttribute('data-key') || el.hasAttribute('data-style-select') || el.hasAttribute('data-typo'))) {
          self.guardLocked(self.selected());
          return;
        }

        var typoSelect = el.getAttribute('data-typo');
        if (typoSelect) {
          self.setTypo(typoSelect, el.value, el);
          return;
        }

        if (el.hasAttribute('data-search-mode')) {
          var searchData = S.State.data;
          searchData.ui = searchData.ui || S.defaultUI();
          searchData.ui.search = searchData.ui.search || S.defaultUI().search;
          searchData.ui.search.mode = el.value === 'page' ? 'page' : 'overlay';
          S.Render.drawScreen();
          S.State.commit('ui:search-mode');
          return;
        }

        var styleSelect = el.getAttribute('data-style-select');
        if (styleSelect) {
          var styleItem = self.selected();
          if (!styleItem) return;
          styleItem.style = styleItem.style || {};
          styleItem.style[styleSelect] = el.value;
          S.Render.drawScreen();
          S.State.commit('style:' + styleItem.id + ':' + styleSelect);
          return;
        }

        if (el.tagName === 'SELECT') {
          var key = el.getAttribute('data-key');
          var item = self.selected();
          if (!item || !key) return;
          U.setPath(item.props, key, el.value);
          S.Render.drawScreen();
          S.State.commit('prop:' + item.id + ':' + key);
        }
      });

      box.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn) return;

        /* Typography alignment / clear */
        if (btn.hasAttribute('data-typo-align')) {
          self.setTypoAlign(btn.getAttribute('data-typo-align'));
          return;
        }
        if (btn.hasAttribute('data-typo-clear')) {
          self.setTypo(btn.getAttribute('data-typo-clear'), '', null);
          return;
        }

        /* Navigation editor: pick an icon, add, delete or reorder items */
        var navIcon = btn.getAttribute('data-nav-icon');
        if (navIcon) {
          S.iconTarget = { ui: true, list: btn.getAttribute('data-nav-list'), itemId: navIcon };
          S.App.showTab('icons');
          S.IconsPanel.sync();
          return;
        }
        var navDel = btn.getAttribute('data-nav-del');
        if (navDel) {
          self.navRemove(btn.getAttribute('data-nav-list'), navDel);
          return;
        }
        var navMove = btn.getAttribute('data-nav-move');
        if (navMove) {
          self.navMove(btn.getAttribute('data-nav-list'), btn.getAttribute('data-nav-id'), Number(navMove));
          return;
        }
        if (btn.hasAttribute('data-nav-add')) {
          self.navAdd(btn.getAttribute('data-nav-add'));
          return;
        }

        /* Screen manager */
        if (btn.hasAttribute('data-page-add')) {
          S.State.addPage();
          S.App.refresh('all');
          S.App.select(null);
          U.toast('Screen added to the bottom navigation');
          return;
        }
        if (btn.hasAttribute('data-page-add-search')) {
          var searchPageData = S.State.addPage();
          var searchBlock = S.makeBlock('searchpage');
          if (searchBlock) searchPageData.screen.push(searchBlock);
          S.State.commit('page:search');
          S.App.refresh('all');
          S.App.select(searchBlock ? searchBlock.id : null);
          U.toast('Search screen added');
          return;
        }
        var pageOpen = btn.getAttribute('data-page-open');
        if (pageOpen) {
          if (pageOpen !== S.State.data.activePageId) {
            S.State.switchPage(pageOpen);
            S.App.select(null);
          }
          return;
        }
        var pageDel = btn.getAttribute('data-page-del');
        if (pageDel) {
          S.State.removePage(pageDel);
          S.App.refresh('all');
          return;
        }
        var pageMove = btn.getAttribute('data-page-move');
        if (pageMove) {
          S.State.movePage(btn.getAttribute('data-page-id'), Number(pageMove));
          S.App.refresh('all');
          return;
        }
        var pageIcon = btn.getAttribute('data-page-icon');
        if (pageIcon) {
          S.iconTarget = { page: pageIcon };
          S.App.showTab('icons');
          S.IconsPanel.sync();
          return;
        }

        if (btn.hasAttribute('data-drawer-header-toggle')) {
          var toggleData = S.State.data;
          toggleData.ui = toggleData.ui || S.defaultUI();
          toggleData.ui.drawer = toggleData.ui.drawer || S.defaultUI().drawer;
          toggleData.ui.drawer.showHeader = toggleData.ui.drawer.showHeader === false;
          S.Render.drawScreen();
          S.State.commit('ui:drawer-head');
          self.render();
          return;
        }

        if (btn.hasAttribute('data-open-devices')) {
          S.App.toggleDeviceMenu(true);
          return;
        }

        if (btn.hasAttribute('data-toggle')) {
          var key = btn.getAttribute('data-key');
          var item = self.selected();
          if (!item || !key) return;
          if (self.guardLocked(item)) return;
          var next = !U.getPath(item.props, key);
          U.setPath(item.props, key, next);
          btn.classList.toggle('on', next);
          btn.lastElementChild.textContent = next ? 'On' : 'Off';
          S.Render.drawScreen();
          S.State.commit('prop:' + item.id + ':' + key);
          return;
        }

        if (btn.hasAttribute('data-icon-field')) {
          var fieldKey = btn.getAttribute('data-key');
          var targetItem = self.selected();
          if (!targetItem) return;
          if (self.guardLocked(targetItem)) return;
          S.iconTarget = { id: targetItem.id, key: fieldKey };
          S.App.showTab('icons');
          if (S.IconsPanel) S.IconsPanel.sync();
          return;
        }

        if (btn.getAttribute('data-act') === 'style-clear') {
          var styleKey = btn.getAttribute('data-style-key');
          var styleItem = self.selected();
          if (!styleItem || !styleKey) return;
          if (self.guardLocked(styleItem)) return;
          styleItem.style = styleItem.style || {};
          delete styleItem.style[styleKey];
          S.State.commit('style:' + styleItem.id + ':' + styleKey);
          S.Render.drawScreen();
          S.Inspector.render();
          return;
        }

        var act = btn.getAttribute('data-act');
        if (act) {
          var id = btn.getAttribute('data-block-id') || (self.selected() || {}).id;
          if (!id) return;
          if (act === 'duplicate') S.App.duplicateSelected(id);
          else if (act === 'up') S.App.moveSelected(-1, id);
          else if (act === 'down') S.App.moveSelected(1, id);
          else if (act === 'del') S.App.deleteSelected(id);
          else if (act === 'lock') S.App.toggleLock(id);
          else if (act === 'hide') S.App.toggleHidden(id);
          else if (act === 'clear') {
            if (confirm('Remove every block from this ' + (S.State.data.target === 'app' ? 'screen' : 'page') + '?')) S.App.clearScreen();
          }
          return;
        }

        var dev = btn.getAttribute('data-device');
        if (dev) {
          S.State.data.device[dev] = !S.State.data.device[dev];
          btn.classList.toggle('on', S.State.data.device[dev]);
          S.Render.drawScreen();
          S.State.commit('device:' + dev);
          return;
        }

        if (btn.hasAttribute('data-theme-dark')) {
          S.Theme.setDark(!S.State.data.theme.dark);
        }
      });

      /* Drag-to-reorder for drawer/menu rows and screen rows. The grip is the
         only draggable part so text inputs keep their normal selection. */
      function clearDragMarks() {
        box.querySelectorAll('.is-dragging, .drag-over').forEach(function (el) {
          el.classList.remove('is-dragging', 'drag-over');
        });
      }

      box.addEventListener('dragstart', function (e) {
        var grip = e.target.closest('[data-nav-grip],[data-page-grip]');
        if (!grip) return;
        if (grip.hasAttribute('data-nav-grip')) {
          navDrag = { list: grip.getAttribute('data-nav-grip'), id: grip.getAttribute('data-nav-id') };
          var navRow = grip.closest('.nav-row');
          if (navRow) navRow.classList.add('is-dragging');
        } else {
          pageDrag = { id: grip.getAttribute('data-page-grip') };
          var pageRow = grip.closest('.page-row');
          if (pageRow) pageRow.classList.add('is-dragging');
        }
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', ''); } catch (err) { /* older browsers */ }
        }
      });

      box.addEventListener('dragover', function (e) {
        var row = e.target.closest('.nav-row,.page-row');
        if (!row) return;
        var usable = (navDrag && row.classList.contains('nav-row') &&
          row.getAttribute('data-nav-row') === navDrag.list) ||
          (pageDrag && row.classList.contains('page-row'));
        if (!usable) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        box.querySelectorAll('.drag-over').forEach(function (el) {
          if (el !== row) el.classList.remove('drag-over');
        });
        row.classList.add('drag-over');
      });

      box.addEventListener('dragleave', function (e) {
        var row = e.target.closest('.nav-row,.page-row');
        if (row) row.classList.remove('drag-over');
      });

      box.addEventListener('drop', function (e) {
        var row = e.target.closest('.nav-row,.page-row');
        if (!row) return;
        e.preventDefault();

        /* Drop below the pointer midpoint so dragging down feels natural. */
        var rect = row.getBoundingClientRect();
        var after = e.clientY > rect.top + rect.height / 2;
        var next = after ? row.nextElementSibling : row;

        if (navDrag && row.classList.contains('nav-row') &&
            row.getAttribute('data-nav-row') === navDrag.list) {
          var beforeId = null;
          if (next && next.classList && next.classList.contains('nav-row')) {
            beforeId = next.getAttribute('data-nav-id');
          } else if (!after) {
            beforeId = row.getAttribute('data-nav-id');
          }
          var moved = navDrag;
          navDrag = null;
          clearDragMarks();
          self.navMoveBefore(moved.list, moved.id, beforeId);
          return;
        }

        if (pageDrag && row.classList.contains('page-row')) {
          var pageBefore = next && next.classList && next.classList.contains('page-row')
            ? next.getAttribute('data-page-row') : null;
          var movedPage = pageDrag;
          pageDrag = null;
          clearDragMarks();
          S.State.movePageBefore(movedPage.id, pageBefore);
          return;
        }
      });

      box.addEventListener('dragend', function () {
        navDrag = null;
        pageDrag = null;
        clearDragMarks();
      });
    },

    setStyleLabel: function (box, key, value) {
      var label = box.querySelector('[data-style-val="' + key + '"]');
      if (!label) return;
      var auto = (key === 'width' || key === 'height') && !value;
      label.textContent = auto ? 'Auto' : Math.round(value) + 'px';
    },

    /* Flash the inspector field that matches an inline-edited text path. */
    highlight: function (path) {
      var box = document.getElementById('tab-inspect');
      if (!box || !path) return;
      var key = String(path).split('.')[0];
      var row = null;
      box.querySelectorAll('.f-row').forEach(function (el) {
        var input = el.querySelector('[data-key]');
        if (input && (input.getAttribute('data-key') === path || input.getAttribute('data-key') === key)) {
          row = el;
        }
      });
      if (!row) return;
      box.querySelectorAll('.f-row.is-highlight').forEach(function (el) { el.classList.remove('is-highlight'); });
      row.classList.add('is-highlight');
      try { row.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (err) { row.scrollIntoView(); }
      clearTimeout(highlightTimer);
      highlightTimer = setTimeout(function () { row.classList.remove('is-highlight'); }, 1800);
    },

    selected: function () {
      var d = S.State.data;
      return d.screen.filter(function (it) { return it.id === d.selectedId; })[0] || null;
    },

    fieldDef: function (item, key) {
      var def = S.components[item.type];
      return def ? def.fields.filter(function (f) { return f.key === key; })[0] : null;
    }
  };
})();
