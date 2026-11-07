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

  function isBottomNav(type) {
    return type === 'bottomnav' || (typeof type === 'string' && type.indexOf('bottomnav') === 0);
  }

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
      var fields = def.fields.filter(function (f) {
        if (item.type === 'appbar') {
          var v = (item.props && item.props.variant) || 'small';
          if (f.key === 'greeting' && v !== 'profile') return false;
          if (f.key === 'searchPlaceholder' && v !== 'search' && v !== 'search-pill') return false;
          if (f.key === 'badgeText' && v !== 'store' && v !== 'social') return false;
          if (f.key === 'avatarInitials' && v !== 'profile' && v !== 'saas' && v !== 'search-pill') return false;
        }
        if (item.type === 'musiclisting') {
          var vm = (item.props && item.props.viewMode) || 'songs';
          if (f.key === 'items' && vm !== 'songs') return false;
          if (f.key === 'albumItems' && vm !== 'albums') return false;
          if (f.key === 'artistItems' && vm !== 'artists') return false;
          if (f.key === 'beatItems' && vm !== 'beats') return false;
          if (f.key === 'activeTrack' && vm !== 'songs') return false;
          if (f.key === 'layout' && vm !== 'songs') return false;
        }
        if (isBottomNav(item.type) && f.key === 'active') return false;
        return true;
      }).map(function (f) { return this.field(f, item); }, this).join('');
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
        '<button type="button" class="mini' + (item.locked ? ' on' : '') + '" data-act="lock" data-block-id="' + esc(item.id) + '" title="' + lockLabel + '" aria-label="' + lockLabel + '"><span class="mi">' + (item.locked ? 'lock' : 'lock_open') + '</span></button>' +
        '<button type="button" class="mini' + (item.hidden ? ' on' : '') + '" data-act="hide" data-block-id="' + esc(item.id) + '" title="' + hideLabel + '" aria-label="' + hideLabel + '"><span class="mi">' + (item.hidden ? 'visibility' : 'visibility_off') + '</span></button>' +
        '<button type="button" class="mini" data-act="del" data-block-id="' + esc(item.id) + '" title="Delete block" aria-label="Delete block"><span class="mi">close</span></button>' +
        '</div></div>' +

        /* Top Tabs Interactive Preview & Category Switcher */
        ((item.type === 'tabs' || item.type === 'tabspill') ? this.tabsPreviewSection(item) : '') +

        /* Music Listing Category View Switcher (Songs, Albums, Artists, Beats) */
        (item.type === 'musiclisting' ? this.musicListingOptionsSection(item) : '') +

        /* Content & Essentials */
        '<div class="sect">' +
        '<div class="sect-title">Content &amp; Properties</div>' + fields +
        '</div>' +

        /* Navigation Link & Screen Shortcut (Immediate visual connection) */
        this.navigationSection(item) +

        /* Full Screen Music Player Experience & Customization */
        ((item.type === 'miniplayer' || item.type === 'musicplayer') ? this.musicPlayerOptionsSection(item) : '') +

        /* Accordion: Typography & Fonts */
        '<details class="insp-accordion"><summary><span class="mi">format_size</span><span>Typography &amp; Fonts</span><span class="mi chev">expand_more</span></summary><div class="insp-accordion-body">' +
        S.Typography.section(item) +
        '</div></details>' +

        /* Accordion: Style & Colors */
        '<details class="insp-accordion"><summary><span class="mi">palette</span><span>Style &amp; Appearance</span><span class="mi chev">expand_more</span></summary><div class="insp-accordion-body">' +
        this.styleSection(item) +
        '</div></details>' +

        /* Accordion: Dimensions & Layout */
        '<details class="insp-accordion"><summary><span class="mi">aspect_ratio</span><span>Dimensions &amp; Sizing</span><span class="mi chev">expand_more</span></summary><div class="insp-accordion-body">' +
        this.sizeSection(item) +
        '</div></details>' +

        /* Accordion: Advanced Controls */
        '<details class="insp-accordion"><summary><span class="mi">tune</span><span>Advanced Settings</span><span class="mi chev">expand_more</span></summary><div class="insp-accordion-body">' +
        this.advancedSection(item, lockLabel, hideLabel) +
        '</div></details>' +

        /* Screens + Phase B — drawer / menu content */
        (!isBottomNav(item.type) ? this.pagesSection() : '') +
        (!isBottomNav(item.type) ? this.navSection() : '') +

        '<p class="inspect-note">Click any text on the phone to edit directly · Click any icon to switch it.</p>';
    },

    tabsPreviewSection: function (item) {
      var p = item.props || {};
      var rawLabels = String(p.labels || '').split(',');
      var active = Number(p.active) || 0;

      var tabChips = rawLabels.map(function (label, idx) {
        var clean = label.trim();
        var on = idx === active;
        return '<button type="button" class="tab-preview-chip' + (on ? ' is-active' : '') + '" data-tab-preview-idx="' + idx + '" title="Preview \'' + esc(clean) + '\' tab">' +
          '<span class="tab-chip-num">' + (idx + 1) + '</span>' +
          '<span class="tab-chip-lbl">' + esc(clean) + '</span>' +
          (on ? '<span class="mi tab-chip-check">check</span>' : '') +
          '</button>';
      }).join('');

      var presets = [
        { label: '🎵 Music (Songs, Albums, Artists, Beats)', val: 'Songs, Albums, Artists, Beats' },
        { label: '👥 Library (Playlists, Artists, Albums, Downloaded)', val: 'Playlists, Artists, Albums, Downloaded' },
        { label: '🔥 Browse (For You, Following, Discover, Charts)', val: 'For You, Following, Discover, Charts' }
      ];

      var presetBtns = presets.map(function (pr) {
        return '<button type="button" class="mini tab-preset-btn" data-tabs-preset="' + esc(pr.val) + '">' + esc(pr.label) + '</button>';
      }).join('');

      return '<div class="sect tabs-preview-sect">' +
        '<div class="sect-title">Active Tab Preview (Click to Switch View)</div>' +
        '<p class="f-hint" style="margin-bottom:8px">Click any tab chip below to preview how the screen looks under each category:</p>' +
        '<div class="tab-preview-chips-row">' + tabChips + '</div>' +
        '<div class="sect-title" style="margin-top:12px">Quick Category Presets</div>' +
        '<div class="tab-presets-row" style="display:flex;flex-direction:column;gap:5px;margin-top:6px">' + presetBtns + '</div>' +
        '</div>';
    },

    musicListingOptionsSection: function (item) {
      var p = item.props || {};
      var view = p.viewMode || 'songs';

      var views = [
        { id: 'songs', label: '1. Songs / Tracks', icon: 'music_note', desc: 'Numbered tracklist with EQ waves, badges & duration' },
        { id: 'albums', label: '2. Albums Discography', icon: 'album', desc: 'Vinyl sleeve cover art grid with track count & play FAB' },
        { id: 'artists', label: '3. Artists Profiles', icon: 'person', desc: 'Circular profiles with verified badges, listeners & Follow' },
        { id: 'beats', label: '4. Beats / Audio', icon: 'graphic_eq', desc: 'Audio waveform visualizers, BPM chips & licensing' }
      ];

      var viewCards = views.map(function (v) {
        var on = view === v.id;
        return '<button type="button" class="ml-cat-pill' + (on ? ' is-active' : '') + '" data-ml-set-view="' + v.id + '" title="' + esc(v.label) + '">' +
          '<span class="mi">' + v.icon + '</span>' +
          '<div class="ml-cat-meta"><strong>' + esc(v.label) + '</strong><small>' + esc(v.desc) + '</small></div>' +
          (on ? '<span class="mi ml-cat-chk">check_circle</span>' : '') +
          '</button>';
      }).join('');

      return '<div class="sect ml-category-sect">' +
        '<div class="sect-title">Listing Category View</div>' +
        '<p class="f-hint" style="margin-bottom:8px">Switch between Songs, Albums, Artists, and Beats views with 1 click:</p>' +
        '<div class="ml-cat-grid">' + viewCards + '</div>' +
        '</div>';
    },

    musicPlayerOptionsSection: function (item) {
      var p = item.props || {};
      var style = item.type === 'miniplayer' ? (p.fullPlayerStyle || 'vinyl') : (p.style || 'vinyl');
      var isMini = item.type === 'miniplayer';

      var styles = [
        { id: 'vinyl', label: '1. Vinyl Turntable', icon: 'album', desc: 'Rotating vinyl LP record with grooved rings & tonearm' },
        { id: 'classic', label: '2. Hero Album Card', icon: 'crop_square', desc: 'Large high-contrast rounded album art card with soft shadow' },
        { id: 'cassette', label: '3. Vintage Cassette', icon: 'tape', desc: 'Retro 80s/90s cassette tape with dual spinning spools & tape window' },
        { id: 'glass', label: '4. Frosted Glass Neumorphic', icon: 'blur_on', desc: 'Translucent glass card with neon aura & pulsating visualizer halo' },
        { id: 'equalizer', label: '5. Studio Master EQ Rack', icon: 'equalizer', desc: 'Hardware rack with VU meters, dB scale & 5-band frequency faders' },
        { id: 'lyrics', label: '6. Waveform & Lyrics', icon: 'lyrics', desc: 'Real-time animated audio visualizer bars & synced lyrics line' },
        { id: 'gradient', label: '7. Immersive Gradient', icon: 'gradient', desc: 'Full-bleed atmospheric mesh gradient with frosted glass controls' },
        { id: 'minimal', label: '8. Minimalist Hi-Fi', icon: 'tune', desc: 'Clean typography, decibel meter and refined studio controls' }
      ];

      var styleCards = styles.map(function (s) {
        var on = style === s.id;
        return '<button type="button" class="mp-style-pill' + (on ? ' is-active' : '') + '" data-mp-style="' + s.id + '" title="' + esc(s.label) + '">' +
          '<span class="mi">' + s.icon + '</span>' +
          '<div class="mp-style-meta"><strong>' + esc(s.label) + '</strong><small>' + esc(s.desc) + '</small></div>' +
          (on ? '<span class="mi mp-chk">check_circle</span>' : '') +
          '</button>';
      }).join('');

      // Modular Tooling Toggles
      var modules = [
        { key: 'showSleepTimer', label: 'Sleep Timer', icon: 'timer', on: !!p.showSleepTimer, val: p.sleepTimer || '30m' },
        { key: 'showEqualizer', label: 'Equalizer FX', icon: 'equalizer', on: !!p.showEqualizer, val: p.eqPreset || 'Bass Boost' },
        { key: 'showQualityBadge', label: 'Hi-Res Badge', icon: 'verified', on: !!p.showQualityBadge, val: '24-bit' },
        { key: 'showSpeedVolume', label: 'Speed & Volume', icon: 'speed', on: !!p.showSpeedVolume, val: (p.playbackSpeed || '1.0x') + ' · ' + (p.volume || 80) + '%' },
        { key: 'showQueue', label: 'Up Next Queue', icon: 'queue_music', on: !!p.showQueue, val: '3 tracks' },
        { key: 'showLyrics', label: 'Synced Lyrics', icon: 'lyrics', on: !!p.showLyrics, val: 'Sheet' },
        { key: 'showDownloadOptions', label: 'Download Options', icon: 'download_for_offline', on: !!p.showDownloadOptions, val: p.downloadQuality || 'Lossless' }
      ];

      var modulePills = modules.map(function (m) {
        return '<button type="button" class="mp-mod-toggle-btn' + (m.on ? ' is-active' : '') + '" data-mp-mod-toggle="' + m.key + '">' +
          '<span class="mi">' + m.icon + '</span>' +
          '<span class="mp-mtb-name">' + esc(m.label) + '</span>' +
          '<span class="mp-mtb-status">' + (m.on ? 'ON · ' + esc(m.val) : 'OFF') + '</span>' +
          '</button>';
      }).join('');

      return '<div class="sect mp-full-sect">' +
        '<div class="sect-title">Full-Screen Music Player Experience</div>' +
        '<p class="f-hint" style="margin-bottom:8px">Choose your player design variation below:</p>' +
        '<div class="mp-style-grid">' + styleCards + '</div>' +
        '<div class="sect-title" style="margin-top:14px">Modular Inside Features</div>' +
        '<p class="f-hint" style="margin-bottom:8px">Toggle modular tools and widgets inside the music player:</p>' +
        '<div class="mp-modules-grid">' + modulePills + '</div>' +
        '<div class="f-pair" style="margin-top:12px">' +
        '<button type="button" class="mini wide on" data-act="preview-player" title="Open and preview the full-screen music player in phone"><span class="mi">play_circle</span>Preview in phone</button>' +
        '<button type="button" class="mini wide" data-act="create-player-screen" title="Add a dedicated Now Playing screen with this style"><span class="mi">add_to_photos</span>Add as new screen</button>' +
        '</div>' +
        '</div>';
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

    navigationSection: function (item) {
      var d = S.State.data;
      if (d.target !== 'app') return '';
      if (isBottomNav(item.type) || item.type === 'appbar') return '';
      var p = item.props || {};
      var pagesList = Array.isArray(d.pages) ? d.pages : [];
      var navTarget = p.navTarget || '';
      var transition = p.transition || 'slide';

      var pageOptions = pagesList.map(function (page, idx) {
        var val = page.id;
        var label = page.name || ('Screen ' + (idx + 1));
        var on = navTarget === val || navTarget === label.toLowerCase() || (navTarget === 'settings' && /setting/i.test(label));
        return '<option value="' + esc(val) + '"' + (on ? ' selected' : '') + '>' + esc(label) + '</option>';
      }).join('');

      var isLinked = !!navTarget;
      var recommendation = '';
      if (!isLinked) {
        recommendation = '<div class="nav-recom-box">' +
          '<div class="nrb-head"><span class="mi">alt_route</span><strong>No screen linked</strong></div>' +
          '<small>Choose where this control moves when clicked in the phone preview:</small>' +
          '<div class="nrb-actions">' +
          '<button type="button" class="mini on" data-act="quick-link-settings"><span class="mi">settings</span>Connect Settings</button>' +
          (pagesList.length > 1 ? '<button type="button" class="mini" data-act="quick-link-page2"><span class="mi">open_in_new</span>Link to ' + esc(pagesList[1].name) + '</button>' : '') +
          '<button type="button" class="mini" data-act="quick-create-screen"><span class="mi">add</span>+ New Screen</button>' +
          '</div></div>';
      }

      return '<div class="sect nav-link-sect">' +
        '<div class="sect-title">Screen Navigation & Shortcut</div>' +
        '<div class="f-row">' +
        '<div class="f-label"><span>Link to Screen</span></div>' +
        '<select class="f-select" data-nav-field="navTarget" aria-label="Link to screen">' +
        '<option value=""' + (!navTarget ? ' selected' : '') + '>None (No navigation)</option>' +
        pageOptions +
        '<option value="__create_settings__">+ Create Settings Screen</option>' +
        '<option value="__create_blank__">+ Create Blank Screen</option>' +
        '</select>' +
        '<small class="f-hint">Clicking this control moves to the selected screen.</small>' +
        '</div>' +
        '<div class="f-row">' +
        '<div class="f-label"><span>Transition Animation</span></div>' +
        '<select class="f-select" data-nav-field="transition" aria-label="Transition animation">' +
        '<option value="slide"' + (transition === 'slide' ? ' selected' : '') + '>Shared Axis (Slide X)</option>' +
        '<option value="fade"' + (transition === 'fade' ? ' selected' : '') + '>Fade Through</option>' +
        '<option value="zoom"' + (transition === 'zoom' ? ' selected' : '') + '>Container Zoom</option>' +
        '<option value="sheet"' + (transition === 'sheet' ? ' selected' : '') + '>Bottom Sheet (Slide Up)</option>' +
        '</select>' +
        '<small class="f-hint">How the screen opens when performing this action.</small>' +
        '</div>' +
        recommendation +
        (isLinked ? '<button type="button" class="mini wide on" data-act="test-transition" style="margin-top:8px"><span class="mi">play_arrow</span>Test transition in phone</button>' : '') +
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
      this._pagesOpen = !!this._pagesOpen;

      var rows = d.pages.map(function (page, index) {
        var active = page.id === d.activePageId;
        return '<div class="page-row' + (active ? ' is-active' : '') + '" data-page-row="' + esc(page.id) + '" data-page-index="' + index + '">' +
          '<div class="nav-main">' +
          '<span class="nav-grip mi" draggable="true" data-page-grip="' + esc(page.id) + '" title="Drag to reorder" aria-hidden="true">drag_indicator</span>' +
          '<button type="button" class="nav-ico" data-page-icon="' + esc(page.id) + '" title="Change tab icon" aria-label="Change icon for ' + esc(page.name) + '">' + S.icon(page.icon || 'msr:apps') + '</button>' +
          '<input class="f-input nav-name" type="text" value="' + esc(page.name) + '" data-page-name="' + esc(page.id) + '" placeholder="Screen name" aria-label="Screen name">' +
          '<button type="button" class="mini' + (active ? ' on' : '') + '" data-page-open="' + esc(page.id) + '" title="' + (active ? 'Editing this screen' : 'Edit this screen') + '" aria-label="Open ' + esc(page.name) + '"><span class="mi">' + (active ? 'check' : 'open_in_new') + '</span></button>' +
          '</div>' +
          '<div class="nav-actions">' +
          '<button type="button" class="mini" data-page-move="-1" data-page-id="' + esc(page.id) + '" title="Move left" aria-label="Move screen left"><span class="mi">chevron_left</span></button>' +
          '<button type="button" class="mini" data-page-move="1" data-page-id="' + esc(page.id) + '" title="Move right" aria-label="Move screen right"><span class="mi">chevron_right</span></button>' +
          (d.pages.length > 1 ? '<button type="button" class="mini danger" data-page-del="' + esc(page.id) + '" title="Delete screen" aria-label="Delete screen"><span class="mi">close</span></button>' : '') +
          '</div>' +
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

    /* Search overlay settings: opening mode, motion, result layout, field
       shape, empty-state sections and the guidance strip. */
    searchSection: function () {
      var d = S.State.data;
      var ui = d.ui || S.defaultUI();
      var search = ui.search || S.defaultUI().search;
      var self = this;
      this._searchOpen = !!this._searchOpen;

      var toggle = function (key, on, label) {
        return '<button type="button" class="f-toggle' + (on ? ' on' : '') + '" data-search-toggle="' + key +
          '" aria-pressed="' + (on ? 'true' : 'false') + '"><span class="tgl"></span><span>' + esc(label) + '</span></button>';
      };

      var radius = Number(search.fieldRadius);
      if (!isFinite(radius)) radius = 21;

      var select = function (key, label, options, hint) {
        return '<div class="f-row"><div class="f-label">' + esc(label) + '</div>' +
          '<select class="f-select" data-search-field="' + key + '" aria-label="' + esc(label) + '">' +
          options.map(function (opt) {
            return '<option value="' + esc(opt[0]) + '"' +
              (String(search[key]) === String(opt[0]) ? ' selected' : '') + '>' + esc(opt[1]) + '</option>';
          }).join('') + '</select>' +
          (hint ? '<small class="f-hint">' + esc(hint) + '</small>' : '') + '</div>';
      };

      return '<details class="sect search-sect"' + (this._searchOpen ? ' open' : '') + '>' +
        '<summary class="sect-title">Search experience</summary>' +
        '<div class="f-row"><div class="f-label">Opens as</div>' +
        '<select class="f-select" data-search-mode aria-label="Search opening mode">' +
        '<option value="overlay"' + (search.mode !== 'page' ? ' selected' : '') + '>Overlay sheet</option>' +
        '<option value="page"' + (search.mode === 'page' ? ' selected' : '') + '>Dedicated screen</option>' +
        '</select><small class="f-hint">Dedicated mode jumps to the screen that contains a Search page block.</small></div>' +
        select('reaction', 'Open animation', [
          ['slide', 'Slide up'], ['fade', 'Fade in'], ['zoom', 'Zoom in']
        ], 'How the search sheet reacts when it opens.') +
        select('resultStyle', 'Result layout', [
          ['list', 'List rows'], ['compact', 'Compact rows'], ['cards', 'Card grid']
        ], 'Results keep the same data — only the presentation changes.') +
        '<div class="f-row"><div class="f-label"><span>Field shape</span>' +
        '<span class="val" data-search-val="fieldRadius">' + Math.round(radius) + 'px</span></div>' +
        '<input type="range" class="f-range" data-search-field="fieldRadius" min="0" max="28" step="1" value="' + Math.round(radius) + '" aria-label="Search field corner radius">' +
        '<small class="f-hint">Corner radius of the search field: 0px is square, 21px is fully rounded.</small></div>' +
        toggle('showRecents', search.showRecents !== false, 'Recent searches') +
        toggle('showQuickLinks', search.showQuickLinks !== false, 'Quick links') +
        toggle('showGuide', search.showGuide !== false, 'Guidance strip') +
        '<div class="f-row"><div class="f-label">Guidance text</div>' +
        '<input class="f-input" type="text" value="' + esc(search.guide || '') + '" data-search-field="guide" aria-label="Search guidance text">' +
        '<small class="f-hint">Tip shown above the filters to explain what can be searched.</small></div>' +
        '<div class="f-row"><div class="f-label">Placeholder</div>' +
        '<input class="f-input" type="text" value="' + esc(search.placeholder || '') + '" data-search-field="placeholder" aria-label="Search placeholder">' +
        '<small class="f-hint">Shown inside the search field before anything is typed.</small></div>' +
        '<div class="f-row"><div class="f-label">Filter chips (comma separated)</div>' +
        '<input class="f-input" type="text" value="' + esc(search.chips || '') + '" data-search-field="chips" aria-label="Search filter chips">' +
        '<small class="f-hint">Quick filters displayed under the search bar.</small></div>' +
        '<div class="f-row"><div class="f-label">Helper text</div>' +
        '<input class="f-input" type="text" value="' + esc(search.hint || '') + '" data-search-field="hint" aria-label="Search helper text">' +
        '<small class="f-hint">Empty-state tip shown when there are no recent searches.</small></div>' +
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

      /* Two-line rows: the name input owns the first line, reorder and delete
         controls sit on their own line so they never cover the text. */
      var row = function (list, it) {
        return '<div class="nav-row" data-nav-row="' + list + '" data-nav-id="' + esc(it.id) + '">' +
          '<div class="nav-main">' +
          '<span class="nav-grip mi" draggable="true" data-nav-grip="' + list + '" data-nav-id="' + esc(it.id) + '" title="Drag to reorder" aria-hidden="true">drag_indicator</span>' +
          '<button type="button" class="nav-ico" data-nav-icon="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Change icon" aria-label="Change icon for ' + esc(it.label) + '">' + S.icon(it.icon) + '</button>' +
          '<input class="f-input nav-name" type="text" value="' + esc(it.label) + '" data-nav-item="' + esc(it.id) +
          '" data-nav-list="' + list + '" data-nav-field="label" placeholder="Item name" aria-label="Item name">' +
          '</div>' +
          '<div class="nav-actions">' +
          '<button type="button" class="mini" data-nav-move="-1" data-nav-id="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Move up" aria-label="Move item up"><span class="mi">expand_less</span></button>' +
          '<button type="button" class="mini" data-nav-move="1" data-nav-id="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Move down" aria-label="Move item down"><span class="mi">expand_more</span></button>' +
          '<button type="button" class="mini danger" data-nav-del="' + esc(it.id) + '" data-nav-list="' + list +
          '" title="Delete item" aria-label="Delete item"><span class="mi">close</span></button>' +
          '</div>' +
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

        '<div class="nav-style-edit">' +
        '<div class="f-label"><span>Drawer style</span></div>' +
        '<div class="f-row"><div class="f-label"><span>Width</span>' +
        '<span class="val" data-drawer-val="width">' + (Number(ui.drawer.width) || 84) + '%</span></div>' +
        '<input type="range" class="f-range" data-drawer-field="width" min="64" max="96" step="1" value="' + (Number(ui.drawer.width) || 84) + '" aria-label="Drawer width">' +
        '<small class="f-hint">How much of the screen the open drawer covers.</small></div>' +
        '<div class="f-row"><div class="f-label">Surface</div>' +
        '<select class="f-select" data-drawer-field="appearance" aria-label="Drawer surface">' +
        '<option value="surface"' + (ui.drawer.appearance === 'surface' || !ui.drawer.appearance ? ' selected' : '') + '>Surface</option>' +
        '<option value="tinted"' + (ui.drawer.appearance === 'tinted' ? ' selected' : '') + '>Tinted</option>' +
        '<option value="glass"' + (ui.drawer.appearance === 'glass' ? ' selected' : '') + '>Frosted glass</option>' +
        '</select><small class="f-hint">Background treatment behind the navigation items.</small></div>' +
        '<div class="f-row"><div class="f-label">Item shape</div>' +
        '<select class="f-select" data-drawer-field="itemShape" aria-label="Drawer item shape">' +
        '<option value="pill"' + (ui.drawer.itemShape === 'pill' || !ui.drawer.itemShape ? ' selected' : '') + '>Pill</option>' +
        '<option value="rounded"' + (ui.drawer.itemShape === 'rounded' ? ' selected' : '') + '>Rounded</option>' +
        '<option value="square"' + (ui.drawer.itemShape === 'square' ? ' selected' : '') + '>Square</option>' +
        '</select><small class="f-hint">Corner style of each drawer row.</small></div>' +
        '<div class="f-row"><div class="f-label">Item spacing</div>' +
        '<select class="f-select" data-drawer-field="density" aria-label="Drawer item spacing">' +
        '<option value="compact"' + (ui.drawer.density === 'compact' ? ' selected' : '') + '>Compact</option>' +
        '<option value="cozy"' + (ui.drawer.density === 'cozy' || !ui.drawer.density ? ' selected' : '') + '>Cozy</option>' +
        '<option value="roomy"' + (ui.drawer.density === 'roomy' ? ' selected' : '') + '>Roomy</option>' +
        '</select><small class="f-hint">Padding and gap between navigation items.</small></div>' +
        '<button type="button" class="f-toggle' + (ui.drawer.showIcons !== false ? ' on' : '') + '" data-drawer-toggle="showIcons" aria-pressed="' + (ui.drawer.showIcons !== false) + '">' +
        '<span class="tgl"></span><span>' + (ui.drawer.showIcons !== false ? 'Item icons shown' : 'Item icons hidden') + '</span></button>' +
        '<div class="f-pair">' +
        '<div class="f-row"><div class="f-label">Close button</div>' +
        '<select class="f-select" data-drawer-field="closeStyle" aria-label="Drawer close button style">' +
        '<option value="icon"' + (ui.drawer.closeStyle === 'icon' || !ui.drawer.closeStyle ? ' selected' : '') + '>Icon</option>' +
        '<option value="text"' + (ui.drawer.closeStyle === 'text' ? ' selected' : '') + '>Icon + label</option>' +
        '<option value="none"' + (ui.drawer.closeStyle === 'none' ? ' selected' : '') + '>Hidden</option>' +
        '</select><small class="f-hint">Close control in the drawer header.</small></div>' +
        '<div class="f-row"><div class="f-label">Shape</div>' +
        '<select class="f-select" data-drawer-field="closeShape" aria-label="Drawer close button shape">' +
        '<option value="circle"' + (ui.drawer.closeShape === 'circle' || !ui.drawer.closeShape ? ' selected' : '') + '>Circle</option>' +
        '<option value="square"' + (ui.drawer.closeShape === 'square' ? ' selected' : '') + '>Square</option>' +
        '</select><small class="f-hint">Circle or rounded-square button.</small></div>' +
        '</div>' +
        '<div class="f-row"><div class="f-label">Close label</div>' +
        '<input class="f-input" type="text" value="' + esc(ui.drawer.closeLabel || '') + '" data-drawer-field="closeLabel" placeholder="Close" aria-label="Drawer close label">' +
        '<small class="f-hint">Used when the close button shows a text label.</small></div>' +
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

    appBarActionsField: function (item, f) {
      var d = S.State.data || {};
      var pages = Array.isArray(d.pages) ? d.pages : [];
      var actionItems = S.getAppBarActionItems ? S.getAppBarActionItems(item.props) : [];
      var id = 'f_' + item.id + '_' + f.key;

      var actionCards = actionItems.map(function (act, i) {
        var target = act.target || 'none';

        var pageOptions = pages.map(function (p) {
          var isSel = (target === p.id) || (target === p.name.toLowerCase());
          var tag = p.hiddenFromNav ? ' (Hidden page)' : '';
          return '<option value="' + esc(p.id) + '"' + (isSel ? ' selected' : '') + '>?? ' + esc(p.name) + tag + '</option>';
        }).join('');

        return '<div class="ab-action-pill" data-act-pill-idx="' + i + '">' +
          '<div class="ab-action-main-row">' +
          '<span class="ab-action-idx">#' + (i + 1) + '</span>' +
          '<button type="button" class="ab-action-ico-btn" data-appbar-act="ico" data-act-idx="' + i + '" title="Click to swap icon">' +
          S.icon(act.icon || 'star') +
          '</button>' +
          '<input type="text" class="f-input ab-action-label-input" data-appbar-act="label" data-act-idx="' + i + '" value="' + esc(act.label || act.icon) + '" placeholder="Action label / tooltip" aria-label="Action ' + (i + 1) + ' label">' +
          '<button type="button" class="mini danger ab-action-del-btn" data-appbar-act="del" data-act-idx="' + i + '" title="Remove action" aria-label="Remove action"><span class="mi">close</span></button>' +
          '</div>' +
          '<div class="ab-action-target-row">' +
          '<label>On click:</label>' +
          '<select class="f-select ab-action-target-select" data-appbar-act="target" data-act-idx="' + i + '" aria-label="Action ' + (i + 1) + ' destination">' +
          '<option value="search_overlay"' + (target === 'search_overlay' ? ' selected' : '') + '>?? Search Overlay Sheet</option>' +
          '<option value="menu"' + (target === 'menu' ? ' selected' : '') + '>? 3-Dot Overflow Menu</option>' +
          '<option value="drawer"' + (target === 'drawer' ? ' selected' : '') + '>? Navigation Drawer</option>' +
          (pages.length ? ('<optgroup label="Navigate to Screen">' + pageOptions + '</optgroup>') : '') +
          '<optgroup label="Create & Link">' +
          '<option value="__create_search__">+ Create Search Screen & Link</option>' +
          '<option value="__create_blank__">+ Create New Screen & Link</option>' +
          '</optgroup>' +
          '<option value="none"' + (target === 'none' ? ' selected' : '') + '>? None (Static icon)</option>' +
          '</select>' +
          '</div>' +
          '</div>';
      }).join('');

      return '<div class="f-row ab-actions-section" data-field-row="' + esc(f.key) + '">' +
        '<div class="f-label"><span>Header Action Buttons</span><span class="val">' + actionItems.length + ' actions</span></div>' +
        '<div class="ab-actions-list">' + (actionCards || '<p style="font-size:11px;color:var(--muted-2);margin:4px 0">No actions added yet.</p>') + '</div>' +
        '<div class="ab-quick-add-tray">' +
        '<span style="font-size:10.5px;color:var(--muted);width:100%">Quick Add:</span>' +
        '<button type="button" class="mini on ab-quick-btn" data-appbar-add-preset="search"><span class="mi">search</span>+ Search</button>' +
        '<button type="button" class="mini ab-quick-btn" data-appbar-add-preset="menu"><span class="mi">more_vert</span>+ 3-Dot More</button>' +
        '<button type="button" class="mini ab-quick-btn" data-appbar-add-preset="notifications"><span class="mi">notifications</span>+ Alerts</button>' +
        '<button type="button" class="mini ab-quick-btn" data-appbar-add-preset="settings"><span class="mi">settings</span>+ Settings</button>' +
        '<button type="button" class="mini ab-quick-btn" data-appbar-add-preset="cart"><span class="mi">shopping_bag</span>+ Cart</button>' +
        '<button type="button" class="mini ab-quick-btn" data-appbar-add-preset="custom"><span class="mi">add</span>+ Custom Icon</button>' +
        '</div>' +
        '<details class="ab-raw-drawer" style="margin-top:10px">' +
        '<summary style="font-size:11px;color:var(--muted-2);cursor:pointer">Advanced / Raw icon list (comma-separated)</summary>' +
        '<input class="f-input" id="' + id + '" data-key="' + esc(f.key) + '" value="' + esc(item.props.actions || '') + '" style="margin-top:6px">' +
        '</details>' +
        '<small class="f-hint">Click an icon to swap it. Pick what happens on tap: open search overlay, 3-dot menu, or navigate to any created screen.</small>' +
        '</div>';
    },

    bottomNavTabsField: function (item, f) {
      var d = S.State.data || {};
      var pages = Array.isArray(d.pages) ? d.pages : [];
      var value = U.getPath(item.props, f.key) || '';
      var id = 'f_' + item.id + '_' + f.key;
      var lines = String(value).split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      var parsed = lines.map(function (line, i) {
        var idx = line.indexOf(':');
        var ico = idx > -1 ? line.slice(0, idx).trim() : 'apps';
        var label = idx > -1 ? line.slice(idx + 1).trim() : line;
        return { icon: ico, label: label, index: i };
      });
      if (!parsed.length) {
        parsed = [{ icon: 'home', label: 'Home', index: 0 }];
      }

      var pageIdx = (S.State && S.State.pageIndex) ? S.State.pageIndex(d.activePageId) : -1;
      var activeIndex = pageIdx > -1 ? pageIdx : (Number(item.props.active) || 0);
      item.props.active = activeIndex;

      var tabCards = parsed.map(function (tab, i) {
        var linkedPage = pages[i];
        var pageName = linkedPage ? linkedPage.name : ('Screen ' + (i + 1));
        var isActive = i === activeIndex;

        return '<div class="bnav-tab-pill bnav-tab-row' + (isActive ? ' is-active' : '') + '" data-tab-index="' + i + '">' +
          '<button type="button" class="bnav-tab-active-radio' + (isActive ? ' is-active' : '') + '" data-bnav-act="set-active" data-tab-idx="' + i + '" title="' + (isActive ? 'Active preview tab (click another to switch)' : 'Click to preview this tab in phone') + '" aria-label="Make tab ' + (i + 1) + ' active">' +
          '<span class="bnav-radio-dot"></span>' +
          '</button>' +
          '<button type="button" class="bnav-tab-ico-btn" data-bnav-act="ico" data-tab-idx="' + i + '" title="Click to swap icon" aria-label="Change icon for ' + esc(tab.label) + '">' +
          S.icon(tab.icon || 'apps') +
          '</button>' +
          '<input type="text" class="f-input bnav-tab-label-input" data-bnav-act="label" data-tab-idx="' + i + '" value="' + esc(tab.label) + '" placeholder="Tab label" aria-label="Tab ' + (i + 1) + ' label">' +
          (linkedPage ? ('<button type="button" class="bnav-tab-link bnav-tab-dest-chip" data-bnav-act="jump-screen" data-tab-idx="' + i + '" title="Links to screen: ' + esc(pageName) + '. Click to edit screen." aria-label="Edit screen ' + esc(pageName) + '"><span class="mi">smartphone</span><span class="btl-name">' + esc(pageName) + '</span></button>') : '') +
          (parsed.length > 1 ? '<button type="button" class="mini danger bnav-tab-del-btn" data-bnav-act="del" data-tab-idx="' + i + '" title="Delete tab" aria-label="Delete tab"><span class="mi">close</span></button>' : '') +
          '</div>';
      }).join('');

      return '<div class="f-row bnav-items-section" data-field-row="' + esc(f.key) + '">' +
        '<div class="f-label"><span>Navigation Tabs</span><span class="val">' + parsed.length + ' tabs</span></div>' +
        '<div class="bnav-tabs-list">' + tabCards + '</div>' +
        '<div class="bnav-actions-bar" style="margin-top:8px">' +
        '<button type="button" class="mini wide on bnav-add-btn" data-bnav-act="add"><span class="mi">add</span>Add Tab</button>' +
        '</div>' +
        '<details class="bnav-raw-drawer" style="margin-top:10px">' +
        '<summary style="font-size:11px;color:var(--muted-2);cursor:pointer">Advanced / Raw format (icon:Label)</summary>' +
        '<textarea class="f-textarea" id="' + id + '" data-key="' + esc(f.key) + '" rows="3" style="margin-top:6px">' + esc(value) + '</textarea>' +
        '</details>' +
        '<small class="f-hint">Click the radio dot to preview that tab in phone. Click icon to switch it. Click screen chip to edit that screen.</small>' +
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
        if (isBottomNav(item.type) && f.key === 'items') {
          return this.bottomNavTabsField(item, f);
        }
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
      if ((item.type === 'appbar' || item.type === 'capsuleheader') && f.key === 'actions') {
        return this.appBarActionsField(item, f);
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

      box.addEventListener('change', function (e) {
        var el = e.target;
        var abActIdx = el.getAttribute('data-act-idx');
        if (el.getAttribute('data-appbar-act') === 'target' && abActIdx != null) {
          var abItem = self.selected();
          if (!abItem) return;
          var aIdx = Number(abActIdx);
          var items = S.getAppBarActionItems(abItem.props);
          if (!items[aIdx]) return;

          var val = el.value;
          if (val === '__create_search__') {
            var searchPage = S.State.addPage('Search');
            var searchBlock = S.makeBlock('searchpage');
            if (searchBlock) searchPage.screen.push(searchBlock);
            items[aIdx].target = searchPage.id;
            abItem.props.actionItems = items;
            abItem.props.actions = items.map(function (it) { return it.icon; }).join(', ');
            S.State.commit('appbar:action:createsearch');
            S.App.refresh('all');
            self.render();
            U.toast('Created dedicated Search screen and linked to action');
            return;
          }
          if (val === '__create_blank__') {
            var newPage = S.State.addPage('New Screen');
            items[aIdx].target = newPage.id;
            abItem.props.actionItems = items;
            abItem.props.actions = items.map(function (it) { return it.icon; }).join(', ');
            S.State.commit('appbar:action:createscreen');
            S.App.refresh('all');
            self.render();
            U.toast('Created screen and linked to action');
            return;
          }
          items[aIdx].target = val;
          abItem.props.actionItems = items;
          abItem.props.actions = items.map(function (it) { return it.icon; }).join(', ');
          S.State.commit('appbar:action:target:' + aIdx);
          S.Render.drawScreen();
          var targetName = val === 'search_overlay' ? 'Search sheet' : (val === 'menu' ? 'Menu' : (val === 'drawer' ? 'Drawer' : (val === 'none' ? 'None' : val)));
          U.toast('Action set to: ' + targetName);
          return;
        }
      });

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
        var abActIdx = el.getAttribute('data-act-idx');
        if (el.getAttribute('data-appbar-act') === 'label' && abActIdx != null) {
          var abItem = self.selected();
          if (!abItem) return;
          var aIdx = Number(abActIdx);
          var items = S.getAppBarActionItems(abItem.props);
          if (items[aIdx]) {
            items[aIdx].label = el.value.trim() || items[aIdx].icon;
            abItem.props.actionItems = items;
            abItem.props.actions = items.map(function (it) { return it.icon; }).join(', ');
            var rawInput = box.querySelector('[data-key="actions"]');
            if (rawInput && rawInput !== el) rawInput.value = abItem.props.actions;
            S.Render.drawScreen();
            S.State.commit('appbar:action:label:' + aIdx);
          }
          return;
        }

        var bnavLabelIdx = el.getAttribute('data-tab-idx');
        if (el.getAttribute('data-bnav-act') === 'label' && bnavLabelIdx != null) {
          var bnavItem = self.selected();
          if (!bnavItem) return;
          var bIdx = Number(bnavLabelIdx);
          var bLines = String(bnavItem.props.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
          var bLine = bLines[bIdx] || '';
          var bcIdx = bLine.indexOf(':');
          var bIco = bcIdx > -1 ? bLine.slice(0, bcIdx).trim() : 'apps';
          bLines[bIdx] = bIco + ':' + (el.value.trim() || 'Tab');
          bnavItem.props.items = bLines.join('\n');
          if (S.State.data.pages && S.State.data.pages[bIdx]) {
            S.State.data.pages[bIdx].name = el.value.trim() || 'Tab';
          }
          var rawTa = box.querySelector('[data-key="items"]');
          if (rawTa && rawTa !== el) rawTa.value = bnavItem.props.items;
          S.Render.drawScreen();
          S.State.commit('bnav:tab:label:' + bIdx);
          return;
        }

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
          searchData.ui.search[searchField] = searchField === 'fieldRadius'
            ? Math.max(0, Math.min(28, Math.round(Number(el.value) || 0)))
            : el.value;
          if (searchField === 'fieldRadius') {
            var radiusVal = box.querySelector('[data-search-val="fieldRadius"]');
            if (radiusVal) radiusVal.textContent = searchData.ui.search[searchField] + 'px';
          }
          S.Render.drawScreen();
          S.State.commit('ui:search:' + searchField);
          return;
        }

        /* Drawer appearance and close-button settings */
        var drawerField = el.getAttribute('data-drawer-field');
        if (drawerField) {
          var drawerData = S.State.data;
          drawerData.ui = drawerData.ui || S.defaultUI();
          drawerData.ui.drawer = drawerData.ui.drawer || S.defaultUI().drawer;
          drawerData.ui.drawer[drawerField] = drawerField === 'width'
            ? Math.max(64, Math.min(96, Math.round(Number(el.value) || 84)))
            : el.value;
          if (drawerField === 'width') {
            var widthVal = box.querySelector('[data-drawer-val="width"]');
            if (widthVal) widthVal.textContent = drawerData.ui.drawer.width + '%';
          }
          S.Render.drawScreen();
          S.State.commit('ui:drawer:' + drawerField);
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

        var abBtn = e.target.closest('[data-appbar-act]');
        if (abBtn) {
          var abAct = abBtn.getAttribute('data-appbar-act');
          var aIdx = Number(abBtn.getAttribute('data-act-idx'));
          var item = self.selected();
          if (!item) return;
          var items = S.getAppBarActionItems(item.props);

          if (abAct === 'ico') {
            var currentIco = items[aIdx] ? items[aIdx].icon : 'star';
            if (S.IconSwitcher && S.IconSwitcher.open) {
              S.IconSwitcher.open({
                cmpId: item.id,
                cmpLabel: 'Top Bar Action ' + (aIdx + 1),
                propKey: 'actionIcon',
                currentIcon: currentIco,
                el: abBtn,
                onSelect: function (newIcon) {
                  var curItems = S.getAppBarActionItems(item.props);
                  if (curItems[aIdx]) {
                    curItems[aIdx].icon = newIcon;
                    if (!curItems[aIdx].label || curItems[aIdx].label === currentIco) curItems[aIdx].label = newIcon;
                  }
                  item.props.actionItems = curItems;
                  item.props.actions = curItems.map(function (it) { return it.icon; }).join(', ');
                  S.Render.drawScreen();
                  self.render();
                  S.State.commit('appbar:action:icon:' + aIdx);
                }
              }, e);
            }
            return;
          }

          if (abAct === 'del') {
            items.splice(aIdx, 1);
            item.props.actionItems = items;
            item.props.actions = items.map(function (it) { return it.icon; }).join(', ');
            S.Render.drawScreen();
            self.render();
            S.State.commit('appbar:action:del:' + aIdx);
            U.toast('Action removed');
            return;
          }
        }

        var abPresetBtn = e.target.closest('[data-appbar-add-preset]');
        if (abPresetBtn) {
          var preset = abPresetBtn.getAttribute('data-appbar-add-preset');
          var item = self.selected();
          if (!item) return;
          var items = S.getAppBarActionItems(item.props);

          var newAct = { id: U.uid(), icon: 'star', label: 'Action', target: 'none' };
          if (preset === 'search') {
            newAct = { id: U.uid(), icon: 'search', label: 'Search', target: 'search_overlay' };
          } else if (preset === 'menu') {
            newAct = { id: U.uid(), icon: 'more_vert', label: 'More options', target: 'menu' };
          } else if (preset === 'notifications') {
            newAct = { id: U.uid(), icon: 'notifications', label: 'Notifications', target: 'none' };
          } else if (preset === 'settings') {
            newAct = { id: U.uid(), icon: 'settings', label: 'Settings', target: 'settings' };
          } else if (preset === 'cart') {
            newAct = { id: U.uid(), icon: 'shopping_bag', label: 'Cart', target: 'none' };
          } else if (preset === 'profile') {
            newAct = { id: U.uid(), icon: 'person', label: 'Profile', target: 'profile' };
          } else if (preset === 'custom') {
            newAct = { id: U.uid(), icon: 'tune', label: 'Filter', target: 'none' };
          }

          items.push(newAct);
          item.props.actionItems = items;
          item.props.actions = items.map(function (it) { return it.icon; }).join(', ');
          S.Render.drawScreen();
          self.render();
          S.State.commit('appbar:action:add:' + preset);
          U.toast('Added ' + newAct.label + ' action to top bar');
          return;
        }

        var bnavBtn = e.target.closest('[data-bnav-act]');
        if (bnavBtn) {
          var act = bnavBtn.getAttribute('data-bnav-act');
          var idx = Number(bnavBtn.getAttribute('data-tab-idx'));
          var item = self.selected();
          if (!item) return;

          if (act === 'set-active' || act === 'jump-screen') {
            item.props.active = idx;
            if (S.State.data.target === 'app' && Array.isArray(S.State.data.pages) && S.State.data.pages[idx]) {
              var targetPage = S.State.data.pages[idx];
              if (S.State.data.activePageId !== targetPage.id) {
                S.State.switchPage(targetPage.id);
              }
              var newNav = (S.State.data.screen || []).filter(function (b) { return isBottomNav(b.type); })[0];
              if (newNav && S.App && S.App.select) {
                S.App.select(newNav.id);
              } else if (S.App && S.App.refresh) {
                S.App.refresh('all');
              }
            } else {
              S.Render.drawScreen();
              self.render();
            }
            S.State.commit('prop:active');
            return;
          }

          if (act === 'ico') {
            var lines = String(item.props.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
            var currentLine = lines[idx] || '';
            var colonIdx = currentLine.indexOf(':');
            var curIcon = colonIdx > -1 ? currentLine.slice(0, colonIdx).trim() : 'apps';
            if (S.IconSwitcher && S.IconSwitcher.open) {
              S.IconSwitcher.open({
                cmpId: item.id,
                cmpLabel: 'Bottom Navigation � Tab ' + (idx + 1),
                propKey: 'tabIcon',
                currentIcon: curIcon,
                el: bnavBtn,
                onSelect: function (newIcon) {
                  var nextLines = String(item.props.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
                  var line = nextLines[idx] || '';
                  var cIdx = line.indexOf(':');
                  var lbl = cIdx > -1 ? line.slice(cIdx + 1).trim() : line;
                  nextLines[idx] = newIcon + ':' + (lbl || ('Tab ' + (idx + 1)));
                  item.props.items = nextLines.join('\n');
                  if (S.State.data.pages && S.State.data.pages[idx]) {
                    S.State.data.pages[idx].icon = newIcon;
                  }
                  S.State.syncPagesFromNav();
                  S.State.syncNavFromPages();
                  S.Render.drawScreen();
                  self.render();
                  S.State.commit('bnav:tab:icon:' + idx);
                }
              }, e);
            } else {
              S.iconTarget = { bnav: item.id, tabIndex: idx };
              S.App.showTab('icons');
              S.IconsPanel.sync();
            }
            return;
          }

          if (act === 'del') {
            var lines = String(item.props.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
            if (lines.length <= 1) {
              U.toast('Must keep at least one tab');
              return;
            }
            lines.splice(idx, 1);
            item.props.items = lines.join('\n');
            if (S.State.data.pages && S.State.data.pages[idx]) {
              S.State.deletePage(S.State.data.pages[idx].id);
            } else {
              S.State.syncPagesFromNav();
              S.State.syncNavFromPages();
              S.Render.drawScreen();
              self.render();
              S.State.commit('bnav:tab:del:' + idx);
            }
            return;
          }

          if (act === 'add') {
            var d = S.State.data;
            if (d.target === 'app') {
              S.State.addPage();
              S.App.refresh('all');
              S.App.select(item.id);
            } else {
              var lines = String(item.props.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
              lines.push('apps:Tab ' + (lines.length + 1));
              item.props.items = lines.join('\n');
              S.Render.drawScreen();
              self.render();
              S.State.commit('bnav:tab:add');
            }
            return;
          }
        }

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

        /* Tab Preview Chip click (tabs block in inspector) */
        var tabPrevBtn = e.target.closest('[data-tab-preview-idx]');
        if (tabPrevBtn) {
          var tIdx = Number(tabPrevBtn.getAttribute('data-tab-preview-idx')) || 0;
          var curTabs = self.selected();
          if (curTabs) {
            curTabs.props = curTabs.props || {};
            curTabs.props.active = tIdx;
            var tabLabels = String(curTabs.props.labels || '').split(',');
            var curLabel = (tabLabels[tIdx] || '').trim();

            // Sync any musiclisting block on screen
            var screenBlocks = S.State.data.screen || [];
            var mlBlock = screenBlocks.filter(function (b) { return b.type === 'musiclisting'; })[0];
            if (mlBlock) {
              var targetMode = null;
              if (/song|track/i.test(curLabel)) targetMode = 'songs';
              else if (/album/i.test(curLabel)) targetMode = 'albums';
              else if (/artist/i.test(curLabel)) targetMode = 'artists';
              else if (/beat|audio|inst/i.test(curLabel)) targetMode = 'beats';
              mlBlock.props = mlBlock.props || {};
              mlBlock.props.viewMode = targetMode || ['songs', 'albums', 'artists', 'beats'][tIdx] || 'songs';
            }
            S.Render.drawScreen();
            self.render();
            S.State.commit('tabs:preview:' + tIdx);
            U.toast('Previewing tab: ' + (curLabel || ('Tab ' + (tIdx + 1))));
          }
          return;
        }

        /* Tabs Preset button click */
        var tabPresetBtn = e.target.closest('[data-tabs-preset]');
        if (tabPresetBtn) {
          var presetVal = tabPresetBtn.getAttribute('data-tabs-preset');
          var curTabs = self.selected();
          if (curTabs) {
            curTabs.props = curTabs.props || {};
            curTabs.props.labels = presetVal;
            curTabs.props.active = 0;
            // Sync musiclisting if preset is music
            if (presetVal.indexOf('Songs') > -1) {
              var mlBlock = (S.State.data.screen || []).filter(function (b) { return b.type === 'musiclisting'; })[0];
              if (mlBlock) {
                mlBlock.props = mlBlock.props || {};
                mlBlock.props.viewMode = 'songs';
              }
            }
            S.Render.drawScreen();
            self.render();
            S.State.commit('tabs:preset');
            U.toast('Applied tabs preset');
          }
          return;
        }

        /* MusicListing Category View Switcher in Inspector */
        var mlCatBtn = e.target.closest('[data-ml-set-view]');
        if (mlCatBtn) {
          var newView = mlCatBtn.getAttribute('data-ml-set-view');
          var curMl = self.selected();
          if (curMl) {
            curMl.props = curMl.props || {};
            curMl.props.viewMode = newView;
            // Sync any tabs block on screen
            var topTabsBlock = (S.State.data.screen || []).filter(function (b) { return b.type === 'tabs' || b.type === 'tabspill'; })[0];
            if (topTabsBlock && topTabsBlock.props) {
              var modeIndices = { songs: 0, albums: 1, artists: 2, beats: 3 };
              if (modeIndices[newView] != null) {
                topTabsBlock.props.active = modeIndices[newView];
              }
            }
            S.Render.drawScreen();
            self.render();
            S.State.commit('ml:viewMode:' + newView);
            U.toast('Listing view set to: ' + newView.toUpperCase());
          }
          return;
        }

        /* Music player style picker */
        var mpStyleBtn = e.target.closest('[data-mp-style]');
        if (mpStyleBtn) {
          var newStyle = mpStyleBtn.getAttribute('data-mp-style');
          var mpItem = self.selected();
          if (mpItem) {
            mpItem.props = mpItem.props || {};
            mpItem.props.style = newStyle;
            mpItem.props.fullPlayerStyle = newStyle;
            S.Render.drawScreen();
            self.render();
            S.State.commit('prop:' + mpItem.id + ':style');
            U.toast('Player style: ' + newStyle);
          }
          return;
        }

        /* Music player modular feature toggle */
        var mpModBtn = e.target.closest('[data-mp-mod-toggle]');
        if (mpModBtn) {
          var modKey = mpModBtn.getAttribute('data-mp-mod-toggle');
          var modItem = self.selected();
          if (modItem) {
            modItem.props = modItem.props || {};
            modItem.props[modKey] = !modItem.props[modKey];
            S.Render.drawScreen();
            self.render();
            S.State.commit('prop:' + modItem.id + ':' + modKey);
            U.toast((modItem.props[modKey] ? 'Enabled ' : 'Disabled ') + modKey);
          }
          return;
        }

        if (btn.getAttribute('data-act') === 'preview-player') {
          var curMp = self.selected();
          var pStyle = curMp ? (curMp.props.fullPlayerStyle || curMp.props.style) : 'vinyl';
          if (S.Interactions && S.Interactions.openPlayerModal) {
            S.Interactions.openPlayerModal(pStyle);
          }
          return;
        }

        if (btn.getAttribute('data-act') === 'create-player-screen') {
          var cMp = self.selected();
          var curStyle = cMp ? (cMp.props.fullPlayerStyle || cMp.props.style || 'vinyl') : 'vinyl';
          var newP = S.State.addPage('Now Playing', { icon: 'msr:play_circle' });
          if (newP) {
            var fullMpBlock = S.makeBlock('musicplayer', {
              style: curStyle,
              title: (cMp && cMp.props.title) || 'Midnight Drive',
              artist: (cMp && cMp.props.artist) || 'Nova Lane',
              album: (cMp && cMp.props.album) || 'Neon Hours',
              showSleepTimer: true,
              showEqualizer: true,
              showQualityBadge: true,
              showSpeedVolume: true
            });
            newP.screen = [
              S.makeBlock('appbar', { title: 'Now Playing', variant: 'center', leading: true }),
              fullMpBlock
            ];
            S.State.commit('page:musicplayer');
            S.App.refresh('all');
            S.App.select(fullMpBlock.id);
            U.toast('Created dedicated Now Playing screen');
          }
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

        var drawerToggle = btn.getAttribute('data-drawer-toggle');
        if (drawerToggle) {
          var dToggleData = S.State.data;
          dToggleData.ui = dToggleData.ui || S.defaultUI();
          dToggleData.ui.drawer = dToggleData.ui.drawer || S.defaultUI().drawer;
          var dNext = dToggleData.ui.drawer[drawerToggle] === false;
          dToggleData.ui.drawer[drawerToggle] = dNext;
          S.Render.drawScreen();
          S.State.commit('ui:drawer:' + drawerToggle);
          self.render();
          return;
        }

        var searchToggle = btn.getAttribute('data-search-toggle');
        if (searchToggle) {
          var sToggleData = S.State.data;
          sToggleData.ui = sToggleData.ui || S.defaultUI();
          sToggleData.ui.search = sToggleData.ui.search || S.defaultUI().search;
          var sNext = sToggleData.ui.search[searchToggle] === false;
          sToggleData.ui.search[searchToggle] = sNext;
          S.Render.drawScreen();
          S.State.commit('ui:search:' + searchToggle);
          self.render();
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
