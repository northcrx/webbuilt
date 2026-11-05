/* Right panel: context-sensitive inspector for the selected block.
   Sections: Content, Style, Size, Advanced. All controls target only the
   block currently selected in State.data.selectedId. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;
  var highlightTimer = null;

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
            '<span class="tgl"></span><span>Show status bar</span></button></div>' +
            '<div class="f-row"><div class="f-label">Gesture bar</div>' +
            '<button class="f-toggle' + (d.device.gestureBar ? ' on' : '') + '" data-device="gestureBar">' +
            '<span class="tgl"></span><span>Show gesture bar</span></button></div>'
          : '') +
        '<div class="f-row"><div class="f-label">Appearance</div>' +
        '<button class="f-toggle' + (dark ? ' on' : '') + '" data-theme-dark>' +
        '<span class="tgl"></span><span>Dark mode</span></button></div>' +
        '</div>' +

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
        '</div>';
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

        /* Style */
        this.styleSection(item) +

        /* Size */
        this.sizeSection(item) +

        /* Advanced */
        this.advancedSection(item, lockLabel, hideLabel) +

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

      box.addEventListener('input', function (e) {
        var el = e.target;

        if (self.selected() && self.selected().locked &&
            (el.hasAttribute('data-key') || el.hasAttribute('data-style') || el.hasAttribute('data-style-color'))) {
          self.guardLocked(self.selected());
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

          box.querySelectorAll('[data-key="' + key + '"]').forEach(function (other) {
            if (other !== el) other.value = value;
          });
          box.querySelectorAll('[data-val="' + key + '"]').forEach(function (val) {
            val.textContent = value + ((field && field.suffix) || '');
          });

          S.Render.drawScreen();
          S.State.commit('prop:' + item.id + ':' + key);
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
            (el.hasAttribute('data-key') || el.hasAttribute('data-style-select'))) {
          self.guardLocked(self.selected());
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
