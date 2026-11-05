/* Turns state into DOM: frames, layers, palette, templates. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  var Render = S.Render = {
    zoom: 0.82,

    tokens: function (theme, fontOverride) {
      var p = theme.primary || '#6750a4';
      var dark = !!theme.dark;
      var c = dark ? {
        primary: U.mix(p, '#ffffff', 0.55),
        onPrimary: U.mix(p, '#000000', 0.65),
        primaryContainer: U.mix(p, '#000000', 0.5),
        onPrimaryContainer: U.mix(p, '#ffffff', 0.86),
        secondaryContainer: U.mix(p, '#000000', 0.62),
        onSecondaryContainer: U.mix(p, '#ffffff', 0.86),
        tertiary: U.mix(p, '#ffb4a9', 0.42)
      } : {
        primary: p,
        onPrimary: U.onColor(p),
        primaryContainer: U.mix(p, '#ffffff', 0.8),
        onPrimaryContainer: U.mix(p, '#000000', 0.72),
        secondaryContainer: U.mix(p, '#ffffff', 0.72),
        onSecondaryContainer: U.mix(p, '#000000', 0.68),
        tertiary: U.mix(p, '#7d5260', 0.42)
      };

      var pad = theme.density === 'compact' ? 12 : theme.density === 'comfy' ? 20 : 16;
      var type = theme.type || { size: 15, weight: 400, spacing: 0 };
      var icons = theme.icons || { weight: 400, fill: 0, stroke: 1.8 };
      var fui = (fontOverride && fontOverride.ui) || (theme.fonts && theme.fonts.ui) || 'Inter';
      var fdisp = (fontOverride && fontOverride.display) || (theme.fonts && theme.fonts.display) || fui;

      /* website + extension palette */
      var wAccent = dark ? U.mix(p, '#ffffff', 0.34) : p;
      var wBg = dark ? U.mix('#0b0b10', p, 0.07) : '#ffffff';
      var wSoft = dark ? U.mix('#12121a', p, 0.10) : U.mix('#ffffff', p, 0.035);
      var wCard = dark ? U.mix('#15151d', p, 0.11) : '#ffffff';
      var wText = dark ? '#f3f0fb' : '#14121a';
      var wMuted = dark ? '#a6a0b6' : '#625e70';
      var wLine = dark ? 'rgba(255,255,255,.11)' : 'rgba(20,18,26,.12)';
      var wAccent2 = dark ? U.mix(p, '#7ef0c2', 0.44) : U.mix(p, '#ff8a5c', 0.55);

      return [
        '--md-primary:' + c.primary,
        '--md-on-primary:' + c.onPrimary,
        '--md-primary-container:' + c.primaryContainer,
        '--md-on-primary-container:' + c.onPrimaryContainer,
        '--md-secondary-container:' + c.secondaryContainer,
        '--md-on-secondary-container:' + c.onSecondaryContainer,
        '--md-tertiary:' + c.tertiary,
        '--font-ui:' + U.fontStack(fui),
        '--font-display:' + U.fontStack(fdisp),
        '--fs-base:' + (Number(type.size) || 15) + 'px',
        '--fw-base:' + (Number(type.weight) || 400),
        '--ls-base:' + (Number(type.spacing) || 0) + 'px',
        '--md-radius:' + (Number(theme.radius) || 16) + 'px',
        '--pad-x:' + pad + 'px',
        '--icon-weight:' + (icons.weight == null ? 400 : icons.weight),
        '--icon-fill:' + (icons.fill == null ? 0 : icons.fill),
        '--icon-stroke:' + (icons.stroke == null ? 1.8 : icons.stroke),
        '--w-accent:' + wAccent,
        '--w-on-accent:' + U.onColor(wAccent),
        '--w-accent-2:' + wAccent2,
        '--w-bg:' + wBg,
        '--w-soft:' + wSoft,
        '--w-card:' + wCard,
        '--w-text:' + wText,
        '--w-muted:' + wMuted,
        '--w-line:' + wLine,
        '--w-radius:' + ((Number(theme.radius) || 16) + 4) + 'px'
      ].join(';') + ';';
    },

    statusBar: function () {
      return '<div class="status-bar"><span class="sb-time">9:41</span><span class="sb-icons">' +
        '<svg width="15" height="11" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">' +
        '<rect x="0" y="8" width="3" height="4" rx="1"/><rect x="4.5" y="6" width="3" height="6" rx="1"/>' +
        '<rect x="9" y="3.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="1" width="3" height="11" rx="1"/></svg>' +
        '<svg width="15" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5.5 12.5a10 10 0 0 1 13 0"/><path d="M9 16.5a5 5 0 0 1 6 0"/>' +
        '<circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>' +
        '<svg width="20" height="11" viewBox="0 0 24 12" fill="none" stroke="currentColor" aria-hidden="true">' +
        '<rect x="1" y="1" width="18" height="10" rx="3" stroke-width="1.4" opacity=".55"/>' +
        '<rect x="2.8" y="2.8" width="13.4" height="6.4" rx="1.6" fill="currentColor" stroke="none"/>' +
        '<rect x="20.5" y="4" width="2" height="4" rx="1" fill="currentColor" stroke="none" opacity=".6"/></svg>' +
        '</span></div>';
    },

    gestureBar: function () { return '<div class="gesture-bar"><span></span></div>'; },

    componentMarkup: function (item) {
      var def = S.components[item.type];
      if (!def) return '';
      return def.html(item.props || {}, item);
    },

    /* Inline CSS for the per-block Size/Style controls. Kept separate from
       component props so a block's content stays portable. */
    blockStyle: function (item) {
      var s = (item && item.style) || {};
      var css = [];
      var px = function (v) {
        var n = Number(v);
        return v !== '' && v != null && isFinite(n) && n > 0 ? Math.round(n) + 'px' : '';
      };

      var w = px(s.width);
      if (w) css.push('width:' + w, 'max-width:100%');
      var h = px(s.height);
      if (h) css.push('height:' + h);
      var pad = px(s.padding);
      if (pad) css.push('padding:' + pad);
      var margin = px(s.margin);
      if (margin) css.push('margin:' + margin + ' 0');
      var radius = px(s.radius);
      if (radius) css.push('border-radius:' + radius);
      if (s.background) css.push('background-color:' + s.background);

      var shadows = {
        sm: '0 2px 8px rgba(0,0,0,.14)',
        md: '0 10px 26px rgba(0,0,0,.18)',
        lg: '0 20px 48px rgba(0,0,0,.28)'
      };
      if (s.shadow && shadows[s.shadow]) css.push('box-shadow:' + shadows[s.shadow]);
      return css.join(';');
    },

    /* Per-block typography becomes CSS variables so the inspector can update
       one block without touching the theme or the shared component styles. */
    typographyStyle: function (item) {
      var t = (item && item.typography) || {};
      var css = [];
      if (t.family) css.push('--typo-family:' + U.fontStack(t.family));
      if (t.size) css.push('--typo-size:' + t.size + 'px');
      if (t.weight) css.push('--typo-weight:' + t.weight);
      if (t.color) css.push('--typo-color:' + t.color);
      if (t.align) css.push('--typo-align:' + t.align);
      if (t.lineHeight) css.push('--typo-line-height:' + t.lineHeight);
      if (t.letterSpacing) css.push('--typo-letter-spacing:' + t.letterSpacing + 'px');
      return css.join(';');
    },

    hasTypography: function (item) {
      var t = (item && item.typography) || {};
      return !!(t.family || t.size || t.weight || t.color || t.align || t.lineHeight || t.letterSpacing);
    },

    /* Exported blocks keep the per-block size/style controls as well as the
       typography, but none of the editor-only chrome. */
    exportBlock: function (item) {
      var def = S.components[item.type];
      if (!def) return '';
      var style = [this.blockStyle(item), this.typographyStyle(item)].filter(Boolean).join(';');
      return '<section class="cmp cmp-' + item.type + '"' +
        (this.hasTypography(item) ? ' data-typo="1"' : '') +
        (style ? ' style="' + esc(style) + '"' : '') + '>' +
        def.html(item.props || {}, item) + '</section>';
    },

    /* Drawer, three-dot menu and search screen. Kept in shared markup so the
       exporter gets exactly the same controls as the editor preview. */
    overlayMarkup: function () {
      var d = S.State.data;
      var ui = (d.ui && d.ui.drawer && d.ui.menu) ? d.ui : S.defaultUI();
      var header = ui.drawer.header || {};

      var drawerItems = (ui.drawer.items || []).map(function (it) {
        return '<button type="button" class="ui-drawer-item' + (it.active ? ' active' : '') + '" ' +
          'data-ui-item="drawer" data-ui-id="' + esc(it.id) + '" data-ui-label="' + esc(it.label) + '">' +
          '<span class="ui-ico">' + S.icon(it.icon) + '</span><span class="ui-item-text">' + esc(it.label) + '</span>' +
          '</button>';
      }).join('');

      var menuItems = (ui.menu.items || []).map(function (it) {
        return '<button type="button" class="ui-menu-item" role="menuitem" ' +
          'data-ui-item="menu" data-ui-id="' + esc(it.id) + '" data-ui-label="' + esc(it.label) + '">' +
          '<span class="ui-ico">' + S.icon(it.icon) + '</span><span class="ui-item-text">' + esc(it.label) + '</span>' +
          '</button>';
      }).join('');

      return '<div class="ui-scrim" data-ui-close="1" aria-hidden="true"></div>' +
        '<aside class="ui-drawer" role="dialog" aria-modal="true" aria-label="Navigation drawer" aria-hidden="true">' +
        '<div class="ui-drawer-head">' +
        '<span class="ui-avatar">' + esc(header.avatar || 'A') + '</span>' +
        '<div class="ui-drawer-id"><strong>' + esc(header.title || 'Navigation') + '</strong>' +
        '<small>' + esc(header.subtitle || '') + '</small></div>' +
        '<button type="button" class="ui-icon-btn" data-ui-close="1" aria-label="Close navigation"><span class="mi">close</span></button>' +
        '</div>' +
        '<nav class="ui-drawer-nav">' + (drawerItems || '<p class="ui-empty">No drawer items yet.</p>') + '</nav>' +
        '</aside>' +
        '<div class="ui-menu" role="menu" aria-label="More actions" aria-hidden="true">' +
        (menuItems || '<p class="ui-empty">No menu items yet.</p>') +
        '</div>' +
        '<div class="ui-search" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true">' +
        '<div class="ui-search-bar">' +
        '<button type="button" class="ui-icon-btn" data-ui-close="1" aria-label="Close search"><span class="mi">arrow_back</span></button>' +
        '<input type="search" class="ui-search-input" placeholder="Search pages and actions…" aria-label="Search">' +
        '<button type="button" class="ui-icon-btn" data-ui-search-clear="1" aria-label="Clear search"><span class="mi">close</span></button>' +
        '</div>' +
        '<div class="ui-search-body"><div class="ui-search-results"></div></div>' +
        '</div>';
    },

    /* Small editor-only toolbar shown on the selected block. Export uses
       componentMarkup, so none of this reaches the exported file. */
    blockChrome: function (item) {
      var lockLabel = item.locked ? 'Unlock block' : 'Lock block';
      var hideLabel = item.hidden ? 'Show block' : 'Hide block';
      return '<div class="cmp-chrome" contenteditable="false">' +
        '<button type="button" data-act="up" title="Move up" aria-label="Move block up"><span class="mi">expand_less</span></button>' +
        '<button type="button" data-act="down" title="Move down" aria-label="Move block down"><span class="mi">expand_more</span></button>' +
        '<button type="button" data-act="lock" class="' + (item.locked ? 'on' : '') + '" title="' + lockLabel + '" aria-label="' + lockLabel + '" aria-pressed="' + !!item.locked + '"><span class="mi">' + (item.locked ? 'lock' : 'lock_open') + '</span></button>' +
        '<button type="button" data-act="hide" class="' + (item.hidden ? 'on' : '') + '" title="' + hideLabel + '" aria-label="' + hideLabel + '" aria-pressed="' + !!item.hidden + '"><span class="mi">' + (item.hidden ? 'visibility' : 'visibility_off') + '</span></button>' +
        '<button type="button" data-act="duplicate" title="Duplicate block" aria-label="Duplicate block"><span class="mi">content_copy</span></button>' +
        '<button type="button" data-act="del" class="danger" title="Delete block" aria-label="Delete block"><span class="mi">close</span></button>' +
        '</div>' +
        '<span class="cmp-resize" data-resize="1" title="Resize block" aria-hidden="true"></span>';
    },

    screenMarkup: function (selecting, selectedId) {
      var data = S.State.data;
      var self = this;
      var html = data.screen.map(function (item) {
        var def = S.components[item.type];
        if (!def) return '';
        var classes = 'cmp cmp-' + item.type;
        if (selecting && item.id === selectedId) classes += ' is-selected';
        if (item.hidden) classes += ' is-hidden';
        if (item.locked) classes += ' is-locked';
        var style = [self.blockStyle(item), self.typographyStyle(item)].filter(Boolean).join(';');
        return '<section class="' + classes + '" data-id="' + item.id + '"' +
          (self.hasTypography(item) ? ' data-typo="1"' : '') +
          (style ? ' style="' + esc(style) + '"' : '') + '>' +
          def.html(item.props || {}, item) + self.blockChrome(item) + '</section>';
      }).join('');

      if (!html) {
        html = '<div class="screen-empty"><strong>Empty screen</strong>Pick a block on the left to start.</div>';
      }
      return html;
    },

    phoneInner: function (selecting) {
      var d = S.State.data;
      return '<div class="camera-hole"></div>' +
        '<div class="phone-screen">' +
        (d.device.statusBar ? this.statusBar() : '') +
        '<div class="app-screen screen-surface' + (selecting ? ' selecting' : '') + '">' +
        this.screenMarkup(selecting, d.selectedId) +
        '</div>' +
        (d.device.gestureBar ? this.gestureBar() : '') +
        '</div>';
    },

    webInner: function (selecting) {
      var d = S.State.data;
      var t = S.targets.web;
      return '<div class="browser-bar">' +
        '<div class="browser-dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>' +
        '<div class="browser-url">' + S.icon('lock') + '<span>' + esc(t.url) + '</span></div>' +
        '<span class="browser-act">' + S.icon('more_horiz') + '</span>' +
        '</div>' +
        '<div class="browser-screen"><div class="web-screen screen-surface' + (selecting ? ' selecting' : '') + '">' +
        '<div class="web-page">' + this.screenMarkup(selecting, d.selectedId) + '</div>' +
        '</div></div>';
    },

    extInner: function (selecting) {
      var d = S.State.data;
      return '<div class="ext-bar">' +
        '<span class="ext-pin">' + S.icon('extension') + '</span>' +
        '<span class="ext-bar-title">Extensions</span>' +
        '<span class="ext-avatar">AL</span>' +
        '</div>' +
        '<div class="ext-screen screen-surface' + (selecting ? ' selecting' : '') + '">' +
        '<div class="ext-page">' + this.screenMarkup(selecting, d.selectedId) + '</div>' +
        '</div>';
    },

    frameInner: function (target, selecting) {
      if (target === 'web') return this.webInner(selecting);
      if (target === 'ext') return this.extInner(selecting);
      return this.phoneInner(selecting);
    },

    frameClass: function (target) {
      if (target === 'web') return 'browser';
      if (target === 'ext') return 'ext-window';
      return 'phone';
    },

    drawScreen: function () {
      var stage = document.getElementById('devices');
      if (!stage) return;
      var d = S.State.data;
      var target = d.target || 'app';
      var compare = !!(d.compare && d.compare.on);
      var zoom = this.zoom;

      var scrolls = Array.prototype.map.call(stage.querySelectorAll('.screen-surface'), function (el) {
        return el.scrollTop;
      });

      stage.style.setProperty('--zoom', zoom);
      stage.classList.toggle('compare', compare);
      stage.dataset.target = target;
      stage.innerHTML = '';

      var fonts = compare ? d.compare.fonts.slice(0, 3) : [null];
      var self = this;

      fonts.forEach(function (font) {
        var wrap = document.createElement('div');
        wrap.className = 'device-wrap';

        if (compare) {
          var label = document.createElement('div');
          label.className = 'compare-label';
          label.innerHTML = '<span class="dot"></span>' + esc(font);
          wrap.appendChild(label);
        }

        var frame = document.createElement('div');
        frame.className = self.frameClass(target) + ' mock-frame' + (d.theme.dark ? ' dark' : '');
        frame.setAttribute('style', self.tokens(d.theme, font ? { ui: font, display: font } : null) +
          'width:' + d.device.width + 'px;height:' + d.device.height + 'px');
        frame.innerHTML = self.frameInner(target, !compare);
        /* Keep overlays inside the page so they match the exported file:
           phone screen, web page, or the whole extension window. */
        var host = target === 'app' ? frame.querySelector('.phone-screen')
          : target === 'web' ? frame.querySelector('.web-page')
          : frame;
        if (host) host.insertAdjacentHTML('beforeend', self.overlayMarkup());
        wrap.appendChild(frame);
        stage.appendChild(wrap);
      });

      Array.prototype.forEach.call(stage.querySelectorAll('.screen-surface'), function (el, i) {
        if (scrolls[i]) el.scrollTop = scrolls[i];
      });

      var label = document.getElementById('zoom-label');
      if (label) label.textContent = Math.round(zoom * 100) + '%';
      var tag = document.getElementById('screen-size-tag');
      if (tag) {
        var preset = S.matchDevice(target, d.device);
        tag.textContent = d.device.width + ' × ' + d.device.height + (preset ? ' · ' + preset.label : '');
      }
      var meta = S.targets[target];
      var stageIcon = document.getElementById('stage-icon');
      var stageLabel = document.getElementById('stage-label');
      if (stageIcon) stageIcon.textContent = meta.icon;
      if (stageLabel) stageLabel.textContent = meta.stageLabel;

      /* Overlays are replaced with every redraw; let the interaction layer
         know any open drawer/menu/search was discarded. */
      if (S.Interactions) S.Interactions.afterRender();
    },

    palette: function () {
      var box = document.getElementById('palette');
      if (!box) return;
      var d = S.State.data;
      var target = d.target || 'app';
      var query = String((S.App && S.App.blockQuery) || '').trim().toLowerCase();
      var groups = {};
      var total = 0;
      var shown = 0;

      Object.keys(S.components).forEach(function (key) {
        var def = S.components[key];
        var targets = def.targets || (key.indexOf('web') === 0 ? ['web'] : key.indexOf('ext') === 0 ? ['ext'] : ['app', 'ext']);
        if (targets.indexOf(target) === -1) return;
        total++;
        var haystack = (def.label + ' ' + key + ' ' + (def.group || '')).toLowerCase();
        if (query && haystack.indexOf(query) === -1) return;
        shown++;
        var g = def.group || 'Other';
        (groups[g] = groups[g] || []).push([key, def]);
      });

      var html = '';
      if (!shown) {
        html = '<p class="empty palette-empty">No blocks match “' + esc(query) + '”. Try a different word.</p>';
      } else {
        Object.keys(groups).forEach(function (g) {
          html += '<div class="palette-group">' + esc(g) + '</div>';
          groups[g].forEach(function (pair) {
            var key = pair[0], def = pair[1];
            html += '<button class="block" data-type="' + key + '" title="Add ' + esc(def.label) + '">' +
              S.icon(def.icon) + '<span>' + esc(def.label) + '</span></button>';
          });
        });
      }
      box.innerHTML = html;

      var hint = document.getElementById('palette-hint');
      if (hint) hint.textContent = query ? shown + ' of ' + total + ' shown' : 'click to add';
    },

    deviceMenu: function () {
      var box = document.getElementById('device-menu');
      if (!box) return;
      var d = S.State.data;
      var target = d.target || 'app';
      var list = S.targetDevices(target);
      var active = S.matchDevice(target, d.device);

      box.innerHTML = '<div class="dm-head">' + esc(S.targets[target].label) + '</div>' +
        list.map(function (p) {
          var on = active && active.id === p.id;
          return '<button type="button" class="dm-item' + (on ? ' active' : '') + '" role="menuitemradio" ' +
            'aria-checked="' + (on ? 'true' : 'false') + '" data-device-id="' + esc(p.id) + '">' +
            '<span class="dm-ico"><span class="mi">' + esc(p.icon) + '</span></span>' +
            '<span class="dm-text"><strong>' + esc(p.label) + '</strong>' +
            '<small>' + p.width + ' × ' + p.height + ' px</small></span>' +
            '<span class="mi dm-check" aria-hidden="true">' + (on ? 'check' : '') + '</span>' +
            '</button>';
        }).join('') +
        '<div class="dm-foot">' + d.device.width + ' × ' + d.device.height + ' px</div>';

      var btn = document.getElementById('device-btn');
      var icon = document.getElementById('device-btn-icon');
      var label = document.getElementById('device-btn-label');
      if (btn) btn.title = active ? active.label + ' · ' + active.width + ' × ' + active.height : 'Choose a device size';
      if (icon) icon.textContent = active ? active.icon : S.targets[target].icon;
      if (label) label.textContent = active ? active.label : d.device.width + ' × ' + d.device.height;
    },

    templates: function () {
      var box = document.getElementById('templates');
      if (!box) return;
      var d = S.State.data;
      var list = S.templates[d.target || 'app'] || [];
      box.innerHTML = list.map(function (t) {
        return '<button class="tpl" data-tpl="' + esc(t.id) + '" title="Replace this ' + esc(S.targets[d.target].short) + ' with the ' + esc(t.label) + ' template">' +
          '<span class="tpl-ico">' + S.icon(t.icon) + '</span><span>' + esc(t.label) + '</span></button>';
      }).join('');
    },

    layers: function () {
      var list = document.getElementById('layers');
      var empty = document.getElementById('layers-empty');
      if (!list || !empty) return;
      var d = S.State.data;

      list.innerHTML = d.screen.map(function (item) {
        var def = S.components[item.type];
        if (!def) return '';
        var classes = 'layer';
        if (item.id === d.selectedId) classes += ' is-selected';
        if (item.hidden) classes += ' is-hidden';
        if (item.locked) classes += ' is-locked';
        var lockTitle = item.locked ? 'Unlock layer' : 'Lock layer';
        var hideTitle = item.hidden ? 'Show layer' : 'Hide layer';
        return '<li class="' + classes + '" data-id="' + item.id + '">' +
          '<button class="grip" aria-label="Drag to reorder" title="Drag to reorder">' +
          '<span class="mi">drag_indicator</span></button>' +
          '<span class="layer-ico">' + S.icon(item.hidden ? 'visibility_off' : def.icon) + '</span>' +
          '<span class="layer-name">' + esc(def.label) + '</span>' +
          '<span class="layer-tools">' +
          '<button data-act="lock" class="' + (item.locked ? 'on' : '') + '" title="' + lockTitle + '" aria-label="' + lockTitle + '" aria-pressed="' + !!item.locked + '"><span class="mi">' + (item.locked ? 'lock' : 'lock_open') + '</span></button>' +
          '<button data-act="hide" class="' + (item.hidden ? 'on' : '') + '" title="' + hideTitle + '" aria-label="' + hideTitle + '" aria-pressed="' + !!item.hidden + '"><span class="mi">' + (item.hidden ? 'visibility' : 'visibility_off') + '</span></button>' +
          '<button data-act="up" title="Move up" aria-label="Move layer up"><span class="mi">expand_less</span></button>' +
          '<button data-act="down" title="Move down" aria-label="Move layer down"><span class="mi">expand_more</span></button>' +
          '<button data-act="del" class="danger" title="Delete layer" aria-label="Delete layer"><span class="mi">close</span></button>' +
          '</span></li>';
      }).join('');

      empty.hidden = d.screen.length > 0;
    },

    chrome: function () {
      var d = S.State.data;
      var undo = document.getElementById('btn-undo');
      var redo = document.getElementById('btn-redo');
      var compare = document.getElementById('btn-compare');
      if (undo) undo.disabled = !S.State.canUndo();
      if (redo) redo.disabled = !S.State.canRedo();
      if (compare) compare.classList.toggle('active', !!(d.compare && d.compare.on));

      var layerCount = document.getElementById('left-layer-count');
      if (layerCount) layerCount.textContent = d.screen.length;

      document.querySelectorAll('#target-switch [data-target]').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-target') === (d.target || 'app'));
      });

      this.deviceMenu();
    },

    all: function () {
      this.drawScreen();
      this.layers();
      this.chrome();
      this.templates();
      this.palette();
    }
  };
})();
