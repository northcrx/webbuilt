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

    /* One exported screen: scrollable content plus its pinned dock. */
    exportPageMarkup: function (page, index, active) {
      var self = this;
      var screen = (page && page.screen) || [];
      var flow = screen.filter(function (item) {
        return !item.hidden && !self.isDockBlock(item);
      }).map(function (item) { return self.exportBlock(item); }).join('\n');
      var dock = screen.filter(function (item) {
        return !item.hidden && self.isDockBlock(item);
      });
      dock.sort(function (a, b) {
        var order = { miniplayer: 0 };
        if (a.type.indexOf('bottomnav') === 0) return 1;
        if (b.type.indexOf('bottomnav') === 0) return -1;
        var scoreA = order[a.type] !== undefined ? order[a.type] : 2;
        var scoreB = order[b.type] !== undefined ? order[b.type] : 2;
        return scoreA - scoreB;
      });
      var dock = dock.map(function (item) { return self.exportBlock(item); }).join('\n');

      if (!flow) flow = '<div class="screen-empty"><strong>Empty screen</strong></div>';

      return '<div class="screen-page' + (active ? ' active' : '') + '" data-page-index="' + index + '" ' +
        'data-page-label="' + esc(page.name || ('Screen ' + (index + 1))) + '">' +
        '<div class="screen-flow">' + flow + '</div>' +
        (dock ? '<div class="screen-dock">' + dock + '</div>' : '') +
        '</div>';
    },

    /* Every page is exported so bottom-navigation tabs keep working offline. */
    exportPages: function () {
      var d = S.State.data;
      var pages = (Array.isArray(d.pages) && d.pages.length) ? d.pages : [{ name: 'Home', screen: d.screen }];
      var activeIndex = 0;
      pages.forEach(function (page, index) {
        if (page.id === d.activePageId) activeIndex = index;
      });
      var body = pages.map(function (page, index) {
        return this.exportPageMarkup(page, index, index === activeIndex);
      }, this).join('\n');
      return { html: body, count: pages.length, activeIndex: activeIndex };
    },

    /* Drawer, three-dot menu and search screen. Kept in shared markup so the
       exporter gets exactly the same controls as the editor preview. */
    overlayMarkup: function () {
      var d = S.State.data;
      var ui = (d.ui && d.ui.drawer && d.ui.menu) ? d.ui : S.defaultUI();
      var drawer = ui.drawer || {};
      var header = drawer.header || {};
      var search = ui.search || {};
      var showHeader = drawer.showHeader !== false;

      var shapeRadius = { pill: '99px', rounded: '14px', square: '4px' }[drawer.itemShape] || '99px';
      var densityPad = {
        compact: '8px 12px',
        cozy: '12px 14px',
        roomy: '15px 16px'
      }[drawer.density] || '12px 14px';
      var densityGap = { compact: '0px', cozy: '2px', roomy: '6px' }[drawer.density] || '2px';
      var drawerStyle = '--ui-drawer-w:' + (Number(drawer.width) || 84) + '%;' +
        '--ui-item-radius:' + shapeRadius + ';' +
        '--ui-item-pad:' + densityPad + ';' +
        '--ui-nav-gap:' + densityGap;

      var closeMarkup = '';
      if (drawer.closeStyle !== 'none') {
        var isText = drawer.closeStyle === 'text';
        closeMarkup = '<button type="button" class="ui-icon-btn ui-drawer-close' +
          (isText ? ' has-label' : '') + '" data-ui-close="1" aria-label="Close navigation">' +
          '<span class="mi">close</span>' +
          (isText ? '<span class="ui-close-label">' + esc(drawer.closeLabel || 'Close') + '</span>' : '') +
          '</button>';
      }

      var drawerItems = (drawer.items || []).map(function (it) {
        return '<button type="button" class="ui-drawer-item' + (it.active ? ' active' : '') + '" ' +
          'data-ui-item="drawer" data-ui-id="' + esc(it.id) + '" data-ui-label="' + esc(it.label) +
          '" aria-label="' + esc(it.label) + '">' +
          (drawer.showIcons !== false ? '<span class="ui-ico">' + S.icon(it.icon) + '</span>' : '') +
          '<span class="ui-item-text">' + esc(it.label) + '</span>' +
          '</button>';
      }).join('');

      var menuItems = (ui.menu.items || []).map(function (it) {
        return '<button type="button" class="ui-menu-item" role="menuitem" ' +
          'data-ui-item="menu" data-ui-id="' + esc(it.id) + '" data-ui-label="' + esc(it.label) + '">' +
          '<span class="ui-ico">' + S.icon(it.icon) + '</span><span class="ui-item-text">' + esc(it.label) + '</span>' +
          '</button>';
      }).join('');

      var chips = String(search.chips || '').split(',').map(function (c) {
        return c.trim();
      }).filter(Boolean);
      var chipsMarkup = chips.length
        ? '<div class="ui-search-chips" role="group" aria-label="Search filters">' +
          '<span class="ui-chips-label">Filters</span>' +
          chips.map(function (label) {
            return '<button type="button" class="ui-chip" data-ui-chip="' + esc(label) + '">' + esc(label) + '</button>';
          }).join('') + '</div>'
        : '';

      var guide = String(search.guide || '').trim();
      var guideMarkup = (search.showGuide !== false && guide)
        ? '<div class="ui-search-guide"><span class="mi">tips_and_updates</span><span>' + esc(guide) + '</span></div>'
        : '';

      var radius = Number(search.fieldRadius);
      if (!isFinite(radius) || radius < 0) radius = 21;

      return '<div class="ui-scrim" data-ui-close="1" aria-hidden="true"></div>' +
        '<aside class="ui-drawer' + (showHeader ? '' : ' no-head') +
        '" data-appearance="' + esc(drawer.appearance || 'surface') +
        '" data-close-shape="' + esc(drawer.closeShape || 'circle') +
        '" style="' + esc(drawerStyle) + '" role="dialog" aria-modal="true" aria-label="Navigation drawer" aria-hidden="true">' +
        (closeMarkup && !showHeader ? '<div class="ui-drawer-top">' + closeMarkup + '</div>' : '') +
        (showHeader ? '<div class="ui-drawer-head">' +
          '<span class="ui-avatar">' + esc(header.avatar || 'A') + '</span>' +
          '<div class="ui-drawer-id"><strong>' + esc(header.title || 'Navigation') + '</strong>' +
          '<small>' + esc(header.subtitle || '') + '</small></div>' +
          closeMarkup +
          '</div>' : '') +
        '<nav class="ui-drawer-nav">' + (drawerItems || '<p class="ui-empty">No drawer items yet.</p>') + '</nav>' +
        '</aside>' +
        '<div class="ui-menu" role="menu" aria-label="More actions" aria-hidden="true">' +
        (menuItems || '<p class="ui-empty">No menu items yet.</p>') +
        '</div>' +
        '<div class="ui-search" data-search-hint="' + esc(search.hint || '') + '" ' +
        'data-reaction="' + esc(search.reaction || 'slide') + '" ' +
        'data-results="' + esc(search.resultStyle || 'list') + '" ' +
        'data-recents="' + (search.showRecents !== false ? '1' : '0') + '" ' +
        'data-quick="' + (search.showQuickLinks !== false ? '1' : '0') + '" ' +
        'data-guide="' + (search.showGuide !== false ? '1' : '0') + '" ' +
        'data-guide-text="' + esc(guide) + '" ' +
        'style="--ui-search-radius:' + Math.round(radius) + 'px" ' +
        'role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true">' +
        '<div class="ui-search-bar">' +
        '<button type="button" class="ui-icon-btn" data-ui-close="1" aria-label="Close search"><span class="mi">arrow_back</span></button>' +
        '<input type="search" class="ui-search-input" placeholder="' + esc(search.placeholder || 'Search pages and actions…') + '" aria-label="Search" autocomplete="off">' +
        '<button type="button" class="ui-icon-btn" data-ui-search-clear="1" aria-label="Clear search"><span class="mi">close</span></button>' +
        '</div>' +
        guideMarkup +
        chipsMarkup +
        '<div class="ui-search-body"><div class="ui-search-results" aria-live="polite"></div></div>' +
        '</div>' +
        this.playerModalMarkup() +
        this.navPromptMarkup();
    },

    sleepTimerClockMarkup: function (curTimer, isDedicated) {
      curTimer = curTimer || '30m';
      var customMin = parseInt(curTimer, 10);
      var timerMap = {
        '15m': { min: 15, deg: 90, digital: '15:00', lbl: 'MINS', sub: 'Pauses audio in 15 mins' },
        '30m': { min: 30, deg: 180, digital: '30:00', lbl: 'MINS', sub: 'Pauses audio in 30 mins' },
        '45m': { min: 45, deg: 270, digital: '45:00', lbl: 'MINS', sub: 'Pauses audio in 45 mins' },
        '60m': { min: 60, deg: 360, digital: '60:00', lbl: '1 HR', sub: 'Pauses audio in 1 hour' },
        'track': { min: 0, deg: 30, digital: 'END', lbl: 'TRACK', sub: 'Pauses at end of track' },
        'off': { min: 0, deg: 0, digital: 'OFF', lbl: 'TIMER', sub: 'Audio plays continuously' }
      };
      var tInfo;
      if (timerMap[curTimer]) {
        tInfo = timerMap[curTimer];
      } else if (!isNaN(customMin) && customMin > 0) {
        var cDeg = Math.round((customMin % 60) * 6);
        if (cDeg === 0) cDeg = 360;
        var minStr = customMin < 10 ? '0' + customMin : '' + customMin;
        tInfo = {
          min: customMin,
          deg: cDeg,
          digital: minStr + ':00',
          lbl: customMin >= 60 ? (Math.floor(customMin / 60) + 'h ' + (customMin % 60 ? (customMin % 60) + 'm' : '')) : 'MINS',
          sub: 'Pauses audio in ' + customMin + ' mins'
        };
      } else {
        tInfo = timerMap['30m'];
      }
      var deg = tInfo.deg;
      var rad = (deg - 90) * Math.PI / 180;
      var cx = 75, cy = 75, r = 52;
      var hx = Math.round(cx + (curTimer === 'off' ? 0 : r * Math.cos(rad)));
      var hy = Math.round(cy + (curTimer === 'off' ? 0 : r * Math.sin(rad)));
      var circ = 2 * Math.PI * r;
      var pct = curTimer === 'off' ? 0 : (curTimer === 'track' ? 0.08 : (tInfo.min / 60));
      var arcOffset = (circ * (1 - pct)).toFixed(1);

      var ticks = '';
      for (var i = 0; i < 12; i++) {
        var ta = (i * 30 - 90) * Math.PI / 180;
        var isMajor = i % 3 === 0;
        var tr1 = r + 4;
        var tr2 = r + (isMajor ? 12 : 8);
        var x1 = (cx + tr1 * Math.cos(ta)).toFixed(1);
        var y1 = (cy + tr1 * Math.sin(ta)).toFixed(1);
        var x2 = (cx + tr2 * Math.cos(ta)).toFixed(1);
        var y2 = (cy + tr2 * Math.sin(ta)).toFixed(1);
        ticks += '<line class="mp-clk-tick' + (isMajor ? ' major' : '') + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"></line>';
      }

      var currentMinVal = tInfo.min || 30;

      return '<div class="mp-mod-bar mp-mod-sleep-bar' + (isDedicated ? ' is-dedicated-sleep' : '') + '">' +
        '<div class="mp-mod-head">' +
        '<div class="mp-mod-head-left"><span class="mi">schedule</span><span>Sleep Timer: <strong class="mp-active-timer-val">' + esc(curTimer) + '</strong></span></div>' +
        '<span class="mp-timer-sub-tag">' + esc(tInfo.sub) + '</span>' +
        '</div>' +
        '<div class="mp-clock-picker">' +
        '<div class="mp-clock-dial" data-timer="' + esc(curTimer) + '">' +
        '<svg class="mp-clock-svg" viewBox="0 0 150 150">' +
        '<circle class="mp-clock-bg" cx="' + cx + '" cy="' + cy + '" r="' + (r + 14) + '"></circle>' +
        '<circle class="mp-clock-track" cx="' + cx + '" cy="' + cy + '" r="' + r + '"></circle>' +
        '<circle class="mp-clock-arc' + (curTimer !== 'off' ? ' is-active' : '') + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + arcOffset + '"></circle>' +
        ticks +
        (curTimer !== 'off' ? '<line class="mp-clock-hand" x1="' + cx + '" y1="' + cy + '" x2="' + hx + '" y2="' + hy + '"></line>' +
        '<circle class="mp-clock-pointer" cx="' + hx + '" cy="' + hy + '" r="' + 6.5 + '"></circle>' : '') +
        '<circle class="mp-clock-pivot" cx="' + cx + '" cy="' + cy + '" r="' + 25 + '"></circle>' +
        '</svg>' +
        '<div class="mp-clock-center-readout">' +
        '<span class="mp-clock-val">' + esc(tInfo.digital) + '</span>' +
        '<span class="mp-clock-lbl">' + esc(tInfo.lbl) + '</span>' +
        '</div>' +
        '<button type="button" class="mp-clk-node node-15' + (curTimer === '15m' ? ' on' : '') + '" data-mp-timer="15m" title="15 mins">15m</button>' +
        '<button type="button" class="mp-clk-node node-30' + (curTimer === '30m' ? ' on' : '') + '" data-mp-timer="30m" title="30 mins">30m</button>' +
        '<button type="button" class="mp-clk-node node-45' + (curTimer === '45m' ? ' on' : '') + '" data-mp-timer="45m" title="45 mins">45m</button>' +
        '<button type="button" class="mp-clk-node node-60' + (curTimer === '60m' ? ' on' : '') + '" data-mp-timer="60m" title="60 mins">60m</button>' +
        '</div>' +
        '</div>' +

        // Custom Timing Builder (User can set any minute)
        '<div class="mp-custom-builder">' +
        '<div class="mp-custom-builder-head"><span>Set Custom Timing</span><small class="mp-custom-hint">Type any minutes or step</small></div>' +
        '<div class="mp-custom-row">' +
        '<button type="button" class="mp-stepper-btn" data-mp-timer-step="-5" title="Minus 5 minutes">-5m</button>' +
        '<div class="mp-custom-input-box">' +
        '<input type="number" class="mp-custom-input" min="1" max="360" value="' + currentMinVal + '" data-mp-custom-timer="1" aria-label="Custom timer minutes">' +
        '<span>mins</span>' +
        '</div>' +
        '<button type="button" class="mp-stepper-btn" data-mp-timer-step="5" title="Plus 5 minutes">+5m</button>' +
        '</div>' +
        '<div class="mp-timer-add-chips">' +
        '<button type="button" class="mp-timer-add-chip" data-mp-timer-add="5">+5 min</button>' +
        '<button type="button" class="mp-timer-add-chip" data-mp-timer-add="15">+15 min</button>' +
        '<button type="button" class="mp-timer-add-chip" data-mp-timer-add="30">+30 min</button>' +
        '<button type="button" class="mp-timer-add-chip" data-mp-timer-add="60">+1 hour</button>' +
        '</div>' +
        '<div class="mp-timer-toggles">' +
        '<label class="mp-toggle-row"><input type="checkbox" checked data-mp-opt="fade"><span><span class="mi">volume_down</span>Fade out audio gradually in last 60s</span></label>' +
        '<label class="mp-toggle-row"><input type="checkbox" data-mp-opt="endtrack"><span><span class="mi">music_note</span>Pause at end of current track</span></label>' +
        '</div>' +
        '</div>' +

        '<div class="mp-timer-actions">' +
        '<button type="button" class="mp-timer-start-btn" data-mp-timer-start="1"><span class="mi">play_arrow</span><span>Start Sleep Timer (' + currentMinVal + 'm)</span></button>' +
        '<button type="button" class="mp-timer-cancel-btn" data-mp-timer="off"><span class="mi">close</span><span>Cancel</span></button>' +
        '</div>' +

        '<div class="mp-mod-chips mp-timer-chips">' +
        '<button type="button" class="mp-mod-chip' + (curTimer === 'off' ? ' on' : '') + '" data-mp-timer="off"><span class="mi">timer_off</span>Off</button>' +
        '<button type="button" class="mp-mod-chip' + (curTimer === '15m' ? ' on' : '') + '" data-mp-timer="15m">15m</button>' +
        '<button type="button" class="mp-mod-chip' + (curTimer === '30m' ? ' on' : '') + '" data-mp-timer="30m">30m</button>' +
        '<button type="button" class="mp-mod-chip' + (curTimer === '45m' ? ' on' : '') + '" data-mp-timer="45m">45m</button>' +
        '<button type="button" class="mp-mod-chip' + (curTimer === '60m' ? ' on' : '') + '" data-mp-timer="60m">60m</button>' +
        '<button type="button" class="mp-mod-chip' + (curTimer === 'track' ? ' on' : '') + '" data-mp-timer="track"><span class="mi">skip_next</span>End</button>' +
        '</div>' +
        '</div>';
    },

    equalizerRackMarkup: function (props, playing, isDedicated) {
      props = props || {};
      var curEq = props.eqPreset || 'Bass Boost';
      var presetCurves = {
        'Flat': [0, 0, 0, 0, 0],
        'Bass Boost': [7, 5, 1, 2, 3],
        'Vocal': [-2, 1, 6, 4, 1],
        'Electronic': [6, 4, 0, 3, 5],
        'Rock': [5, 3, -1, 3, 6],
        'Acoustic': [3, 2, 1, 4, 3],
        'Studio Master': [2, 1, 0, 2, 2]
      };
      var bands = Array.isArray(props.eqBands) && props.eqBands.length === 5
        ? props.eqBands
        : (presetCurves[curEq] || presetCurves['Bass Boost']);

      var freqs = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];
      var bandLabels = ['Sub', 'Bass', 'Mid', 'Presence', 'Air'];

      var pts = bands.map(function (db, idx) {
        var x = 20 + idx * 55;
        var clampedDb = Math.max(-12, Math.min(12, Number(db) || 0));
        var y = Math.round(40 - (clampedDb / 12) * 28);
        return { x: x, y: y, db: clampedDb };
      });

      var pathD = 'M ' + pts[0].x + ' ' + pts[0].y;
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i];
        var p1 = pts[i + 1];
        var mx = (p0.x + p1.x) / 2;
        pathD += ' C ' + mx + ' ' + p0.y + ', ' + mx + ' ' + p1.y + ', ' + p1.x + ' ' + p1.y;
      }
      var areaD = pathD + ' L ' + pts[pts.length - 1].x + ' 76 L ' + pts[0].x + ' 76 Z';

      var fadersHtml = bands.map(function (db, idx) {
        var clampedDb = Math.max(-12, Math.min(12, Number(db) || 0));
        var dbStr = (clampedDb > 0 ? '+' : '') + clampedDb + 'dB';
        var pct = Math.round(((clampedDb + 12) / 24) * 100);
        return '<div class="mp-eq-col mp-eq-band" data-eq-col="' + idx + '">' +
          '<span class="mp-eq-db">' + dbStr + '</span>' +
          '<div class="mp-eq-track mp-eq-fader" data-mp-eq-band="' + idx + '">' +
          '<div class="mp-eq-zero-line"></div>' +
          '<div class="mp-eq-fill" style="height:' + pct + '%"><span style="height:' + pct + '%"></span></div>' +
          '<input type="range" class="mp-eq-range" min="-12" max="12" step="1" value="' + clampedDb + '" data-mp-eq-band="' + idx + '" aria-label="' + freqs[idx] + ' ' + bandLabels[idx] + '">' +
          '<div class="mp-eq-thumb" style="bottom:' + pct + '%"></div>' +
          '</div>' +
          '<span class="mp-eq-hz mp-eq-lbl">' + freqs[idx] + '</span>' +
          '<span class="mp-eq-subtag">' + bandLabels[idx] + '</span>' +
          '</div>';
      }).join('');

      var presets = ['Flat', 'Bass Boost', 'Vocal', 'Electronic', 'Rock', 'Acoustic', 'Studio Master'];
      var presetChips = presets.map(function (pName) {
        var on = curEq === pName;
        return '<button type="button" class="mp-mod-chip' + (on ? ' on' : '') + '" data-mp-eq="' + esc(pName) + '">' + esc(pName) + '</button>';
      }).join('');

      var rotaryFxHtml = isDedicated ? (
        '<div class="mp-eq-fx-row">' +
        '<div class="mp-eq-rotary-card">' +
        '<div class="mp-eq-rotary-dial" data-mp-rotary="bass"><span class="mp-eq-rotary-val">+6dB</span></div>' +
        '<span class="mp-eq-rotary-lbl">Bass Boost</span>' +
        '<small class="mp-eq-rotary-sub">60Hz Punch</small>' +
        '</div>' +
        '<div class="mp-eq-rotary-card">' +
        '<div class="mp-eq-rotary-dial" data-mp-rotary="surround"><span class="mp-eq-rotary-val">65%</span></div>' +
        '<span class="mp-eq-rotary-lbl">3D Surround</span>' +
        '<small class="mp-eq-rotary-sub">Virtualizer</small>' +
        '</div>' +
        '<div class="mp-eq-rotary-card">' +
        '<div class="mp-eq-rotary-dial" data-mp-rotary="clarity"><span class="mp-eq-rotary-val">+3dB</span></div>' +
        '<span class="mp-eq-rotary-lbl">Vocal Clarity</span>' +
        '<small class="mp-eq-rotary-sub">Presence</small>' +
        '</div>' +
        '</div>'
      ) : '';

      return '<div class="mp-mod-bar mp-mod-eq-rack mp-rack-eq' + (isDedicated ? ' is-dedicated-eq' : '') + '">' +
        '<div class="mp-mod-head">' +
        '<div class="mp-mod-head-left">' +
        '<span class="mi">equalizer</span>' +
        '<span>Equalizer: <strong>' + esc(curEq) + '</strong></span>' +
        '</div>' +
        '<div class="mp-vu-mini-strip mp-vu-row">' +
        '<div class="mp-vu-mini mp-vu-meter"><span class="mp-vu-tag mp-vu-lbl">CH-L</span><div class="mp-vu-track mp-vu-mini-bar"><div class="mp-vu-fill mp-vu-mini-fill' + (playing ? ' live' : '') + '" style="width:' + (playing ? '84%' : '16%') + ';height:' + (playing ? '84%' : '16%') + '"></div></div><small class="mp-vu-db">+4dB</small></div>' +
        '<div class="mp-vu-mini mp-vu-meter"><span class="mp-vu-tag mp-vu-lbl">CH-R</span><div class="mp-vu-track mp-vu-mini-bar"><div class="mp-vu-fill mp-vu-mini-fill' + (playing ? ' live' : '') + '" style="width:' + (playing ? '78%' : '16%') + ';height:' + (playing ? '78%' : '16%') + '"></div></div><small class="mp-vu-db">+2dB</small></div>' +
        '</div>' +
        '</div>' +
        '<div class="mp-eq-curve-card">' +
        '<svg class="mp-eq-curve-svg" viewBox="0 0 260 80">' +
        '<defs>' +
        '<linearGradient id="eqCurveGrad" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="var(--md-primary)" stop-opacity="0.32"></stop>' +
        '<stop offset="100%" stop-color="var(--md-primary)" stop-opacity="0.0"></stop>' +
        '</linearGradient>' +
        '</defs>' +
        '<line class="mp-eq-grid-line" x1="10" y1="12" x2="250" y2="12"></line>' +
        '<line class="mp-eq-grid-line zero" x1="10" y1="40" x2="250" y2="40"></line>' +
        '<line class="mp-eq-grid-line" x1="10" y1="68" x2="250" y2="68"></line>' +
        '<text class="mp-eq-grid-txt" x="12" y="16">+12dB</text>' +
        '<text class="mp-eq-grid-txt" x="12" y="44">0dB</text>' +
        '<text class="mp-eq-grid-txt" x="12" y="72">-12dB</text>' +
        '<path class="mp-eq-curve-area" d="' + areaD + '" fill="url(#eqCurveGrad)"></path>' +
        '<path class="mp-eq-curve-stroke" d="' + pathD + '"></path>' +
        pts.map(function (p) {
          return '<circle class="mp-eq-curve-pt" cx="' + p.x + '" cy="' + p.y + '" r="3.5"></circle>';
        }).join('') +
        '</svg>' +
        '</div>' +
        '<div class="mp-eq-faders-grid mp-eq-bands">' + fadersHtml + '</div>' +
        rotaryFxHtml +
        '<div class="mp-mod-chips mp-eq-preset-chips">' + presetChips + '</div>' +
        '</div>';
    },

    playerModalMarkup: function () {
      var d = S.State.data;
      var target = (d && d.target) || 'app';
      if (target !== 'app') return '';
      var mpBlock = (d.screen || []).filter(function (it) {
        return it.type === 'miniplayer' || it.type === 'musicplayer';
      })[0];
      if (!mpBlock) return '';
      var props = (mpBlock && mpBlock.props) || {};
      var title = props.title || 'Midnight Drive';
      var artist = props.artist || 'Nova Lane';
      var album = props.album || 'Neon Hours';
      var coverIcon = props.coverIcon || 'headphones';
      var style = props.fullPlayerStyle || props.style || 'vinyl';
      var progress = Number(props.progress) || 45;
      var elapsed = props.elapsed || '1:48';
      var duration = props.duration || '4:12';
      var liked = props.liked !== false;
      var playing = props.playing !== false;
      var audioRoute = props.audioRoute || 'Phone Speaker';
      var curEq = props.eqPreset || 'Bass Boost';
      var curTimer = props.sleepTimer || '30m';

      var artHtml = '';
      var coverContent = props.coverImage
        ? '<img src="' + esc(props.coverImage) + '" alt="Cover" class="mp-vinyl-img">'
        : S.icon(coverIcon, 'mp-vinyl-icon');

      if (style === 'vinyl') {
        artHtml = '<div class="mp-vinyl-wrapper">' +
          '<div class="mp-tonearm"><span class="mp-tonearm-head"></span></div>' +
          '<div class="mp-vinyl-disc' + (playing ? ' spinning' : '') + '" data-ui-player-spin="1">' +
          '<div class="mp-vinyl-grooves"></div>' +
          '<div class="mp-vinyl-center">' + coverContent + '</div>' +
          '</div></div>';
      } else if (style === 'cassette') {
        artHtml = '<div class="mp-cassette-shell" data-ui-player-spin="1">' +
          '<div class="mp-cass-screw tl"></div><div class="mp-cass-screw tr"></div>' +
          '<div class="mp-cass-screw bl"></div><div class="mp-cass-screw br"></div>' +
          '<div class="mp-cass-label">' +
          '<span class="mp-cass-side">SIDE A · CHROME · DOLBY B-NR</span>' +
          '<strong class="mp-cass-title">' + esc(title) + '</strong>' +
          '<span class="mp-cass-artist">' + esc(artist) + '</span>' +
          '</div>' +
          '<div class="mp-cass-window">' +
          '<div class="mp-cass-spool left"><div class="mp-tape-roll' + (playing ? ' spinning' : '') + '"></div><div class="mp-hub' + (playing ? ' spinning' : '') + '"></div></div>' +
          '<div class="mp-cass-counter"><span>042</span></div>' +
          '<div class="mp-cass-spool right"><div class="mp-tape-roll thin' + (playing ? ' spinning' : '') + '"></div><div class="mp-hub' + (playing ? ' spinning' : '') + '"></div></div>' +
          '</div>' +
          '<div class="mp-cass-bottom"><span class="mp-guide"></span><span class="mp-head"></span><span class="mp-guide"></span></div>' +
          '</div>';
      } else if (style === 'glass') {
        artHtml = '<div class="mp-glass-card' + (playing ? ' playing' : '') + '">' +
          '<div class="mp-glass-aura"></div>' +
          '<div class="mp-glass-ring' + (playing ? ' pulsing' : '') + '"></div>' +
          '<div class="mp-glass-center">' + coverContent + '</div>' +
          '</div>';
      } else if (style === 'equalizer') {
        artHtml = this.equalizerRackMarkup(props, playing, false);
      } else if (style === 'lyrics') {
        var waveBars = [24, 48, 72, 35, 90, 60, 40, 85, 95, 55, 30, 75, 45, 65, 80, 50];
        var waveHtml = waveBars.map(function (h, i) {
          var delay = (i * 0.08).toFixed(2);
          return '<span class="mp-wave-bar' + (playing ? ' animated' : '') + '" style="height:' + h + '%;animation-delay:-' + delay + 's"></span>';
        }).join('');
        var rawLyrics = (props.lyricsText || 'Neon lights reflecting on the wet pavement\nDriving through the empty city midnight mist\nLost inside the echoes of the stereo\nOnly you and me beneath the starlight').split('\n').filter(Boolean);
        var lyricsHtml = rawLyrics.map(function (line, idx) {
          return '<p class="mp-lyric-line' + (idx === 1 ? ' active' : '') + '">' + esc(line.trim()) + '</p>';
        }).join('');
        artHtml = '<div class="mp-waveform">' + waveHtml + '</div>' +
          '<div class="mp-lyrics-box" aria-label="Lyrics">' + lyricsHtml + '</div>';
      } else {
        var coverImg = props.coverImage
          ? '<img src="' + esc(props.coverImage) + '" alt="Cover" class="mp-art-img">'
          : S.icon(coverIcon, 'mp-glyph');
        artHtml = '<div class="mp-art mp-art-' + style + '">' +
          coverImg +
          '<button type="button" class="mp-fav' + (liked ? ' on' : '') + '" data-ui-player-fav="1" aria-label="Favourite">' +
          S.icon(liked ? 'favorite' : 'favorite_border') + '</button></div>';
      }

      // Dropdown menu in top right header
      var menuHtml = '<div class="ui-pm-menu-wrap">' +
        '<button type="button" class="ui-pm-inspect" data-ui-player-menu-btn="1" title="Sound Effects & Utilities" aria-label="Sound Effects & Utilities" aria-haspopup="true"><span class="mi">tune</span></button>' +
        '<div class="ui-pm-dropdown-menu" id="ui-pm-dropdown-menu" hidden role="menu">' +
        '<button type="button" class="ui-pm-menu-item" data-pm-goto="equalizer" role="menuitem">' +
        '<span class="mi">equalizer</span>' +
        '<div class="ui-pm-mi-text"><strong>Studio Equalizer & FX</strong><small>Bézier curve, 5-band faders & VU</small></div>' +
        '</button>' +
        '<button type="button" class="ui-pm-menu-item" data-pm-goto="timer" role="menuitem">' +
        '<span class="mi">schedule</span>' +
        '<div class="ui-pm-mi-text"><strong>Sleep Timer</strong><small>Custom time builder & fade out</small></div>' +
        '</button>' +
        '<button type="button" class="ui-pm-menu-item" data-pm-goto="speed" role="menuitem">' +
        '<span class="mi">speed</span>' +
        '<div class="ui-pm-mi-text"><strong>Speed & Volume</strong><small>Tempo, pitch & volume booster</small></div>' +
        '</button>' +
        '<button type="button" class="ui-pm-menu-item" data-pm-goto="download" role="menuitem">' +
        '<span class="mi">download_for_offline</span>' +
        '<div class="ui-pm-mi-text"><strong>Download Quality</strong><small>Lossless FLAC, 320k, offline storage</small></div>' +
        '</button>' +
        '<div class="ui-pm-menu-sep" role="separator"></div>' +
        '<button type="button" class="ui-pm-menu-item" data-pm-act="inspect" role="menuitem">' +
        '<span class="mi">tune</span>' +
        '<div class="ui-pm-mi-text"><strong>Customize in Inspector</strong><small>Edit block styling & theme</small></div>' +
        '</button>' +
        '</div>' +
        '</div>';

      var handleBar = '<div class="ui-pm-handle-bar">' +
        '<button type="button" class="ui-pm-close" data-ui-player-close="1" title="Minimize player" aria-label="Minimize player"><span class="mi">keyboard_arrow_down</span></button>' +
        '<div class="ui-pm-route"><span class="mi">speaker_group</span><span class="ui-pm-route-name">' + esc(audioRoute) + '</span></div>' +
        menuHtml +
        '</div>';

      // VIEW 1: Clean, spacious Now Playing view (WITHOUT sleeper/equalizer cluttering playback!)
      var nowPlayingView = '<div class="ui-pm-view ui-pm-view-nowplaying is-active" data-view-id="nowplaying">' +
        '<div class="ui-pm-body">' +
        artHtml +
        '<div class="mp-meta">' +
        '<span class="mp-kicker">NOW PLAYING · ' + esc(style.toUpperCase()) + '</span>' +
        '<h3 data-edit="title">' + esc(title) + '</h3>' +
        '<p><span data-edit="artist">' + esc(artist) + '</span> · <span data-edit="album">' + esc(album) + '</span></p>' +
        '</div>' +
        '<div class="mp-progress">' +
        '<div class="mp-bar"><span style="width:' + progress + '%"></span></div>' +
        '<div class="mp-times"><span>' + esc(elapsed) + '</span><span>' + esc(duration) + '</span></div>' +
        '</div>' +
        '<div class="mp-controls">' +
        '<button type="button" class="mp-btn" data-ui-player-btn="shuffle" aria-label="Shuffle">' + S.icon('shuffle') + '</button>' +
        '<button type="button" class="mp-btn" data-ui-player-btn="prev" aria-label="Previous track">' + S.icon('skip_previous') + '</button>' +
        '<button type="button" class="mp-play" data-ui-player-play="1" aria-label="' + (playing ? 'Pause' : 'Play') + '">' +
        S.icon(playing ? 'pause' : 'play_arrow') + '</button>' +
        '<button type="button" class="mp-btn" data-ui-player-btn="next" aria-label="Next track">' + S.icon('skip_next') + '</button>' +
        '<button type="button" class="mp-btn" data-ui-player-btn="repeat" aria-label="Repeat">' + S.icon('repeat') + '</button>' +
        '</div>' +
        '<div class="ui-pm-quick-bar">' +
        '<button type="button" class="ui-pm-quick-chip" data-pm-goto="equalizer" title="Open Studio Equalizer"><span class="mi">equalizer</span><span>Equalizer: <strong>' + esc(curEq) + '</strong></span></button>' +
        '<button type="button" class="ui-pm-quick-chip" data-pm-goto="timer" title="Open Sleep Timer"><span class="mi">schedule</span><span>Sleep Timer: <strong>' + esc(curTimer) + '</strong></span></button>' +
        '</div>' +
        '<div class="mp-foot">' +
        '<button type="button" class="mp-text" data-ui-player-lyrics="1">' + S.icon('lyrics') + '<span>Lyrics</span></button>' +
        '<button type="button" class="mp-text" data-ui-player-queue="1">' + S.icon('queue_music') + '<span>Up next (12)</span></button>' +
        '</div>' +
        '</div>' +
        '</div>';

      // VIEW 2: Dedicated Equalizer Page (Full screen height & high fidelity)
      var equalizerView = '<div class="ui-pm-view ui-pm-view-equalizer" data-view-id="equalizer">' +
        '<div class="ui-pm-sub-head">' +
        '<button type="button" class="ui-pm-back-btn" data-pm-back="1" title="Back to Now Playing"><span class="mi">arrow_back</span></button>' +
        '<div class="ui-pm-sub-title"><strong>Audio FX & Equalizer</strong><small>Studio Master Sound Engine</small></div>' +
        '<label class="mp-eq-master-switch" title="Toggle Equalizer"><input type="checkbox" checked data-mp-eq-power="1"><span class="mp-eq-switch-slider"></span></label>' +
        '</div>' +
        '<div class="ui-pm-sub-content">' +
        this.equalizerRackMarkup(props, playing, true) +
        '</div>' +
        '</div>';

      // VIEW 3: Dedicated Sleep Timer Page (Create your own timing builder)
      var timerView = '<div class="ui-pm-view ui-pm-view-timer" data-view-id="timer">' +
        '<div class="ui-pm-sub-head">' +
        '<button type="button" class="ui-pm-back-btn" data-pm-back="1" title="Back to Now Playing"><span class="mi">arrow_back</span></button>' +
        '<div class="ui-pm-sub-title"><strong>Sleep Timer</strong><small>Create your own custom duration</small></div>' +
        '<button type="button" class="ui-pm-head-action" data-mp-timer="off"><span class="mi">timer_off</span><span>Turn Off</span></button>' +
        '</div>' +
        '<div class="ui-pm-sub-content">' +
        this.sleepTimerClockMarkup(props.sleepTimer || '30m', true) +
        '</div>' +
        '</div>';

      // VIEW 4: Dedicated Speed & Volume Page
      var curSpeed = props.playbackSpeed || '1.0x';
      var curVol = props.volume || 80;
      var speedView = '<div class="ui-pm-view ui-pm-view-speed" data-view-id="speed">' +
        '<div class="ui-pm-sub-head">' +
        '<button type="button" class="ui-pm-back-btn" data-pm-back="1" title="Back to Now Playing"><span class="mi">arrow_back</span></button>' +
        '<div class="ui-pm-sub-title"><strong>Speed & Volume</strong><small>Playback Tempo & Master Volume</small></div>' +
        '</div>' +
        '<div class="ui-pm-sub-content">' +
        '<div class="mp-mod-speed-vol" style="margin-top:16px;">' +
        '<button type="button" class="mp-mod-chip mp-speed-btn" data-mp-speed="cycle" title="Change speed"><span class="mi">speed</span><span>Speed: ' + esc(curSpeed) + '</span></button>' +
        '<div class="mp-vol-row"><span class="mi">volume_up</span><div class="mp-vol-track"><span class="mp-vol-fill" style="width:' + curVol + '%"></span></div><span class="mp-vol-num">' + curVol + '%</span></div>' +
        '</div>' +
        '</div>' +
        '</div>';

      // VIEW 5: Dedicated Download Options Page
      var dlQuality = props.downloadQuality || 'lossless';
      var dlStorage = props.downloadStorage || 'internal';
      var dlStatus = props.downloadStatus || 'downloaded';
      var qLabels = {
        lossless: 'Lossless FLAC 24/96 (48MB)',
        high: 'High 320kbps MP3 (11MB)',
        standard: 'Standard 256kbps AAC (8MB)',
        saver: 'Data Saver 96kbps (3.5MB)'
      };
      var statusBadge = dlStatus === 'downloaded'
        ? '<span class="mp-dl-status-badge is-saved"><span class="mi">offline_pin</span> Saved Offline</span>'
        : (dlStatus === 'downloading'
          ? '<span class="mp-dl-status-badge is-saving"><span class="mi">sync</span> Downloading... 68%</span>'
          : '<span class="mp-dl-status-badge"><span class="mi">download</span> Ready to download</span>');

      var downloadView = '<div class="ui-pm-view ui-pm-view-download" data-view-id="download">' +
        '<div class="ui-pm-sub-head">' +
        '<button type="button" class="ui-pm-back-btn" data-pm-back="1" title="Back to Now Playing"><span class="mi">arrow_back</span></button>' +
        '<div class="ui-pm-sub-title"><strong>Download & Storage</strong><small>Offline Audio Settings</small></div>' +
        '</div>' +
        '<div class="ui-pm-sub-content">' +
        '<div class="mp-mod-bar mp-mod-dl-bar" style="border:0;padding:0;">' +
        '<div class="mp-mod-head"><span class="mi">download_for_offline</span><span>Quality: <strong>' + esc(qLabels[dlQuality] || dlQuality) + '</strong></span>' + statusBadge + '</div>' +
        '<div class="mp-dl-quality-cards">' +
        '<button type="button" class="mp-dl-qcard' + (dlQuality === 'lossless' ? ' on' : '') + '" data-mp-dl-quality="lossless">' +
        '<div class="mp-dl-qhead"><strong>Studio FLAC 24-bit</strong><span class="mp-dl-size">48.2 MB</span></div>' +
        '<small>Hi-Res 96kHz Lossless master reference</small>' +
        '</button>' +
        '<button type="button" class="mp-dl-qcard' + (dlQuality === 'high' ? ' on' : '') + '" data-mp-dl-quality="high">' +
        '<div class="mp-dl-qhead"><strong>320 kbps MP3</strong><span class="mp-dl-size">11.4 MB</span></div>' +
        '<small>High fidelity audio, universal playback</small>' +
        '</button>' +
        '<button type="button" class="mp-dl-qcard' + (dlQuality === 'standard' ? ' on' : '') + '" data-mp-dl-quality="standard">' +
        '<div class="mp-dl-qhead"><strong>256 kbps AAC</strong><span class="mp-dl-size">7.8 MB</span></div>' +
        '<small>Optimal balance for Bluetooth earbuds</small>' +
        '</button>' +
        '<button type="button" class="mp-dl-qcard' + (dlQuality === 'saver' ? ' on' : '') + '" data-mp-dl-quality="saver">' +
        '<div class="mp-dl-qhead"><strong>Data Saver</strong><span class="mp-dl-size">3.1 MB</span></div>' +
        '<small>96 kbps Opus compact mobile storage</small>' +
        '</button>' +
        '</div>' +
        '<div class="mp-dl-extra-row">' +
        '<button type="button" class="mp-mod-chip' + (dlStorage === 'internal' ? ' on' : '') + '" data-mp-dl-storage="internal"><span class="mi">smartphone</span>Internal (45GB Free)</button>' +
        '<button type="button" class="mp-mod-chip' + (dlStorage === 'sdcard' ? ' on' : '') + '" data-mp-dl-storage="sdcard"><span class="mi">sd_card</span>SD Card (112GB Free)</button>' +
        '<button type="button" class="mp-dl-action-btn' + (dlStatus === 'downloaded' ? ' is-done' : '') + '" data-mp-dl-action="toggle">' +
        '<span class="mi">' + (dlStatus === 'downloaded' ? 'check_circle' : 'download') + '</span>' +
        '<span>' + (dlStatus === 'downloaded' ? 'Downloaded (Offline Ready)' : 'Download Track') + '</span>' +
        '</button>' +
        '</div></div>' +
        '</div>' +
        '</div>';

      return '<div class="ui-player-modal" id="ui-player-modal" role="dialog" aria-modal="true" aria-label="Now playing" aria-hidden="true" data-style="' + esc(style) + '" data-active-view="nowplaying">' +
        handleBar +
        nowPlayingView +
        equalizerView +
        timerView +
        speedView +
        downloadView +
        '</div>';
    },

    isDockBlock: function (item) {
      if (!item) return false;
      var target = (S.State.data && S.State.data.target) || 'app';
      if (target !== 'app') return false;
      if (item.type === 'bottomnav' || (item.type && item.type.indexOf('bottomnav') === 0)) {
        return true;
      }
      if (item.type === 'miniplayer') {
        return true;
      }
      return false;
    },

    blockMarkup: function (item, selecting, selectedId) {
      var def = S.components[item.type];
      if (!def) return '';
      var classes = 'cmp cmp-' + item.type;
      if (selecting && item.id === selectedId) classes += ' is-selected';
      if (item.hidden) classes += ' is-hidden';
      if (item.locked) classes += ' is-locked';
      var style = [this.blockStyle(item), this.typographyStyle(item)].filter(Boolean).join(';');
      return '<section class="' + classes + '" data-id="' + item.id + '"' +
        (this.hasTypography(item) ? ' data-typo="1"' : '') +
        (style ? ' style="' + esc(style) + '"' : '') + '>' +
        def.html(item.props || {}, item) + this.blockChrome(item) + '</section>';
    },

    dockMarkup: function (selecting, selectedId, list) {
      var d = S.State.data;
      var target = (d && d.target) || 'app';
      if (target !== 'app') return '';
      var self = this;
      var rawItems = (list || d.screen).filter(function (item) {
        return self.isDockBlock(item);
      });
      // Deduplicate: guarantee only ONE bottom navigation bar and only ONE miniplayer is rendered in dock
      var seenNav = false;
      var seenPlayer = false;
      var items = [];
      rawItems.forEach(function (item) {
        var isNav = item.type === 'bottomnav' || (item.type && item.type.indexOf('bottomnav') === 0);
        if (isNav) {
          if (seenNav) return; // strip duplicate
          seenNav = true;
        }
        if (item.type === 'miniplayer') {
          if (seenPlayer) return; // strip duplicate miniplayer
          seenPlayer = true;
        }
        items.push(item);
      });

      /* Always ensure miniplayer is sorted BEFORE bottomnav so it sits above the tab bar */
      items.sort(function (a, b) {
        var order = { miniplayer: 0 };
        if (a.type.indexOf('bottomnav') === 0) return 1;
        if (b.type.indexOf('bottomnav') === 0) return -1;
        var scoreA = order[a.type] !== undefined ? order[a.type] : 2;
        var scoreB = order[b.type] !== undefined ? order[b.type] : 2;
        return scoreA - scoreB;
      });
      var html = items.map(function (item) {
        return self.blockMarkup(item, selecting, selectedId);
      }).join('');
      return html ? '<div class="screen-dock">' + html + '</div>' : '';
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

    screenMarkup: function (selecting, selectedId, flowOnly, list) {
      var data = S.State.data;
      var self = this;
      var blocks = list || data.screen;
      var html = blocks.filter(function (item) {
        return !(flowOnly && self.isDockBlock(item));
      }).map(function (item) {
        return self.blockMarkup(item, selecting, selectedId);
      }).join('');

      if (!html) {
        html = '<div class="screen-empty"><strong>Empty screen</strong>Pick a block on the left to start.</div>';
      }
      return html;
    },

        /* Interactive Screen Linker & Recommendation Prompt Modal */
    navPromptMarkup: function () {
      var d = S.State.data;
      var pagesList = (d.target === 'app' && Array.isArray(d.pages)) ? d.pages : [];
      var activeId = d.activePageId;

      var pills = pagesList.map(function (page, idx) {
        var on = page.id === activeId;
        return '<button type="button" class="unp-pill' + (on ? ' is-active' : '') + '" data-unp-pill="' + idx + '" title="Link to ' + esc(page.name) + '">' +
          S.icon(page.icon || 'msr:apps') + '<span>' + esc(page.name) + '</span>' +
          '</button>';
      }).join('');

      return '<div class="ui-nav-prompt" id="ui-nav-prompt" role="dialog" aria-modal="true" aria-label="Connect screen" aria-hidden="true">' +
        '<div class="unp-card">' +
        '<div class="unp-header">' +
        '<span class="mi unp-ico">alt_route</span>' +
        '<div class="unp-title-wrap">' +
        '<strong>Connect or Create Screen</strong>' +
        '<small class="unp-sub">Target "<span class="unp-target-name">Settings</span>" is not connected yet.</small>' +
        '</div>' +
        '<button type="button" class="unp-close" data-unp-close="1" title="Close" aria-label="Close prompt"><span class="mi">close</span></button>' +
        '</div>' +
        '<div class="unp-body">' +
        '<p>Choose a screen recommendation to build or link to an existing screen:</p>' +
        '<div class="unp-actions">' +
        '<button type="button" class="unp-btn unp-btn-create" data-unp-action="create-settings">' +
        '<span class="mi">settings</span><span>+ Create Settings Screen (1-Click)</span>' +
        '</button>' +
        '<button type="button" class="unp-btn unp-btn-blank" data-unp-action="create-page">' +
        '<span class="mi">note_add</span><span>+ Create New Blank Screen</span>' +
        '</button>' +
        '</div>' +
        '<div class="unp-links">' +
        '<span class="unp-label">Or link directly to an existing screen:</span>' +
        '<div class="unp-pill-list">' + (pills || '<small style="color:var(--md-on-surface-variant)">No other screens yet</small>') + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    },

    phoneInner: function (selecting) {
      var d = S.State.data;
      return '<div class="camera-hole"></div>' +
        '<div class="phone-screen"' + (d.device.statusBar ? ' style="--ui-top:34px"' : '') + '>' +
        (d.device.statusBar ? this.statusBar() : '') +
        '<div class="app-screen screen-surface' + (selecting ? ' selecting' : '') + '">' +
        this.screenMarkup(selecting, d.selectedId, true) +
        '</div>' +
        this.dockMarkup(selecting, d.selectedId) +
        (d.device.gestureBar ? this.gestureBar() : '') +
        '</div>';
    },

    webInner: function (selecting) {
      var d = S.State.data;
      var t = S.targets.web;
      var webBlocks = (d.screen || []).filter(function (b) {
        return b.type !== 'bottomnav' && b.type.indexOf('bottomnav') !== 0 && b.type !== 'miniplayer';
      });
      return '<div class="browser-bar">' +
        '<div class="browser-dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>' +
        '<div class="browser-url">' + S.icon('lock') + '<span>' + esc(t.url) + '</span></div>' +
        '<span class="browser-act">' + S.icon('more_horiz') + '</span>' +
        '</div>' +
        '<div class="browser-screen"><div class="web-screen screen-surface' + (selecting ? ' selecting' : '') + '">' +
        '<div class="web-page">' + this.screenMarkup(selecting, d.selectedId, true, webBlocks) + '</div>' +
        '</div>' +
        '</div>';
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
        if (host && target === 'app') host.insertAdjacentHTML('beforeend', self.overlayMarkup());
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
      var category = String((S.App && S.App.blockCategory) || 'all').toLowerCase();
      var groups = {};
      var total = 0;
      var shown = 0;

      Object.keys(S.components).forEach(function (key) {
        var def = S.components[key];
        var targets = def.targets || (key.indexOf('web') === 0 ? ['web'] : key.indexOf('ext') === 0 ? ['ext'] : ['app', 'ext']);
        if (targets.indexOf(target) === -1) return;
        total++;

        // Visual Category Filtering
        if (category && category !== 'all') {
          var gLow = (def.group || '').toLowerCase();
          var kLow = key.toLowerCase();
          var matchCat = false;
          if (category === 'nav') {
            matchCat = gLow.indexOf('nav') !== -1 || kLow.indexOf('nav') !== -1 || kLow.indexOf('topappbar') !== -1 || kLow.indexOf('tab') !== -1 || kLow.indexOf('rail') !== -1 || kLow.indexOf('drawer') !== -1;
          } else if (category === 'media') {
            matchCat = gLow.indexOf('media') !== -1 || kLow.indexOf('player') !== -1 || kLow.indexOf('audio') !== -1 || kLow.indexOf('video') !== -1 || kLow.indexOf('music') !== -1;
          } else if (category === 'settings') {
            matchCat = gLow.indexOf('setting') !== -1 || gLow.indexOf('list') !== -1 || kLow.indexOf('setting') !== -1 || kLow.indexOf('profile') !== -1 || kLow.indexOf('list') !== -1 || kLow.indexOf('secret') !== -1;
          } else if (category === 'cards') {
            matchCat = gLow.indexOf('card') !== -1 || kLow.indexOf('card') !== -1 || kLow.indexOf('hero') !== -1 || kLow.indexOf('feed') !== -1 || kLow.indexOf('post') !== -1 || kLow.indexOf('stat') !== -1;
          } else if (category === 'inputs') {
            matchCat = gLow.indexOf('input') !== -1 || gLow.indexOf('form') !== -1 || kLow.indexOf('input') !== -1 || kLow.indexOf('search') !== -1 || kLow.indexOf('field') !== -1 || kLow.indexOf('slider') !== -1;
          } else if (category === 'actions') {
            matchCat = gLow.indexOf('action') !== -1 || gLow.indexOf('button') !== -1 || kLow.indexOf('btn') !== -1 || kLow.indexOf('button') !== -1 || kLow.indexOf('fab') !== -1 || kLow.indexOf('chip') !== -1 || kLow.indexOf('dialog') !== -1;
          }
          if (!matchCat) return;
        }

        var haystack = (def.label + ' ' + key + ' ' + (def.group || '')).toLowerCase();
        if (query && haystack.indexOf(query) === -1) return;
        shown++;
        var g = def.group || 'Other';
        (groups[g] = groups[g] || []).push([key, def]);
      });

      var html = '';
      if (!shown) {
        html = '<p class="empty palette-empty">No blocks match “' + esc(query || category) + '”. Try a different category or search word.</p>';
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
      if (hint) hint.textContent = (query || (category && category !== 'all')) ? shown + ' of ' + total + ' shown' : 'click to add';
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
      var target = d.target || 'app';
      var list = S.templates[target] || [];
      var customList = S.getCustomTemplates ? S.getCustomTemplates().filter(function (c) {
        return !c.target || c.target === target;
      }) : [];

      var toolbar = '<div class="tpl-toolbar">' +
        '<button type="button" class="tpl-save-btn" data-tpl-action="save" title="Save current screen as a reusable custom template">' +
        '<span class="mi">bookmark_add</span><span>Save current design</span></button>' +
        '<div class="tpl-actions-row">' +
        '<button type="button" class="btn-tool" data-tpl-action="export" title="Export custom templates as JSON"><span class="mi">file_download</span>Export</button>' +
        '<button type="button" class="btn-tool" data-tpl-action="import" title="Import custom templates from JSON"><span class="mi">file_upload</span>Import</button>' +
        '<input type="file" id="tpl-file-input" accept=".json" style="display:none">' +
        '</div>' +
        '</div>';

      var customMarkup = '';
      if (customList.length) {
        customMarkup = '<div class="tpl-group-title"><span>Saved Custom Designs</span><span class="tpl-badge">' + customList.length + '</span></div>' +
          '<div class="tpl-strip tpl-custom-strip">' +
          customList.map(function (c) {
            return '<div class="tpl tpl-custom-item" data-tpl="' + esc(c.id) + '" title="Apply custom design: ' + esc(c.label) + '">' +
              '<span class="tpl-ico">' + S.icon(c.icon || 'dashboard_customize') + '</span>' +
              '<div class="tpl-info"><strong>' + esc(c.label) + '</strong><small>' + esc(c.date || 'Custom') + '</small></div>' +
              '<button type="button" class="tpl-del-btn" data-tpl-del="' + esc(c.id) + '" title="Delete custom template" aria-label="Delete ' + esc(c.label) + '"><span class="mi">close</span></button>' +
              '</div>';
          }).join('') +
          '</div>';
      }

      var builtInMarkup = '<div class="tpl-group-title"><span>Built-in App Templates</span><span class="tpl-badge">' + list.length + '</span></div>' +
        '<div class="tpl-strip">' +
        list.map(function (t) {
          return '<button type="button" class="tpl" data-tpl="' + esc(t.id) + '" title="Replace screen with ' + esc(t.label) + ' template">' +
            '<span class="tpl-ico">' + S.icon(t.icon) + '</span>' +
            '<div class="tpl-info"><strong>' + esc(t.label) + '</strong>' +
            (t.badge ? '<span class="tpl-badge-tag">' + esc(t.badge) + '</span>' : '') +
            '</div></button>';
        }).join('') +
        '</div>';

      box.innerHTML = toolbar + customMarkup + builtInMarkup;
    },

    layers: function () {
      var d = S.State.data;
      var layerCount = document.getElementById('left-layer-count');
      if (layerCount) layerCount.textContent = (d && d.screen) ? d.screen.length : 0;

      var list = document.getElementById('layers');
      var empty = document.getElementById('layers-empty');
      if (!list || !empty) return;

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

    pages: function () {
      var d = S.State.data;
      var pages = (d && d.target === 'app' && Array.isArray(d.pages)) ? d.pages : [];
      var activeId = d ? d.activePageId : null;

      var countEl = document.getElementById('left-page-count');
      if (countEl) countEl.textContent = pages.length;

      var box = document.getElementById('pages-list');
      if (!box) return;

      if (!pages.length) {
        box.innerHTML = '<li class="empty" style="padding:16px;text-align:center;color:var(--muted)">No screens created yet.</li>';
        return;
      }

      var html = pages.map(function (page, idx) {
        var on = page.id === activeId;
        var isHidden = !!page.hiddenFromNav;
        var tagLabel = isHidden ? 'Sub-page' : 'Tab ' + (idx + 1);
        var tagCls = isHidden ? 'tag-subpage' : (on ? 'tag-active' : '');
        var hideTitle = isHidden ? 'Include in bottom nav tabs' : 'Hide from bottom navigation (Sub-page)';
        var hideIcon = isHidden ? 'visibility_off' : 'visibility';

        return '<li class="page-row' + (on ? ' is-active' : '') + '" data-page-id="' + esc(page.id) + '" draggable="true">' +
          '<span class="page-grip mi" draggable="true" title="Drag to reorder or combine screens" aria-hidden="true">drag_indicator</span>' +
          '<span class="page-ico">' + S.icon(page.icon || 'msr:apps') + '</span>' +
          '<div class="page-meta">' +
          '<div class="page-name" data-edit-page-name="' + esc(page.id) + '" title="Click to switch screen">' + esc(page.name) + '</div>' +
          '<div class="page-sub">' +
          '<span class="page-tag ' + tagCls + '">' + esc(tagLabel) + '</span>' +
          '<span>' + (page.screen ? page.screen.length : 0) + ' blocks</span>' +
          '</div></div>' +
          '<div class="page-actions">' +
          '<button type="button" class="page-btn" data-act="combine-page" data-page-id="' + esc(page.id) + '" title="Combine / merge with another screen"><span class="mi">merge</span></button>' +
          '<button type="button" class="page-btn' + (isHidden ? ' on' : '') + '" data-act="toggle-hidden" data-page-id="' + esc(page.id) + '" title="' + esc(hideTitle) + '"><span class="mi">' + hideIcon + '</span></button>' +
          '<button type="button" class="page-btn" data-act="duplicate-page" data-page-id="' + esc(page.id) + '" title="Duplicate screen"><span class="mi">content_copy</span></button>' +
          '<button type="button" class="page-btn" data-act="rename-page" data-page-id="' + esc(page.id) + '" title="Rename screen"><span class="mi">edit</span></button>' +
          '<button type="button" class="page-btn danger" data-act="delete-page" data-page-id="' + esc(page.id) + '" title="Delete screen"><span class="mi">close</span></button>' +
          '</div></li>';
      }).join('');

      box.innerHTML = html;
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
      if (layerCount) layerCount.textContent = (d && d.screen) ? d.screen.length : 0;
      var pageCount = document.getElementById('left-page-count');
      if (pageCount) pageCount.textContent = (d && d.target === 'app' && Array.isArray(d.pages)) ? d.pages.length : (d && d.screen ? 1 : 0);

      document.querySelectorAll('#target-switch [data-target]').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-target') === (d.target || 'app'));
      });

      this.deviceMenu();
    },

    all: function () {
      this.drawScreen();
      this.layers();
      this.pages();
      this.chrome();
      this.templates();
      this.palette();
    }
  };
})();
