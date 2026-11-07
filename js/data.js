/* Component library + default screen + font catalogue. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  /* ---------------- font catalogue ---------------- */
  S.fonts = [
    { name: 'Inter', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'Roboto', cat: 'Sans', w: [300, 400, 500, 700] },
    { name: 'Open Sans', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'Lato', cat: 'Sans', w: [300, 400, 700] },
    { name: 'Montserrat', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'Poppins', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'DM Sans', cat: 'Sans', w: [400, 500, 700] },
    { name: 'Manrope', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Work Sans', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'Nunito', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Nunito Sans', cat: 'Sans', w: [400, 600, 700] },
    { name: 'Rubik', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Outfit', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'Sora', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Plus Jakarta Sans', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Figtree', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Karla', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Mulish', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Barlow', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Urbanist', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Space Grotesk', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Public Sans', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'IBM Plex Sans', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'Source Sans 3', cat: 'Sans', w: [400, 600, 700] },
    { name: 'Noto Sans', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Archivo', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Assistant', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Cabin', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Epilogue', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Exo 2', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Fira Sans', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Hanken Grotesk', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Instrument Sans', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Jost', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Lexend', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Libre Franklin', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Onest', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'PT Sans', cat: 'Sans', w: [400, 700] },
    { name: 'Raleway', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Oswald', cat: 'Sans', w: [300, 400, 500, 600, 700] },
    { name: 'Red Hat Display', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Schibsted Grotesk', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Ubuntu', cat: 'Sans', w: [400, 500, 700] },
    { name: 'Varela Round', cat: 'Sans', w: [400] },
    { name: 'Quicksand', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Comfortaa', cat: 'Sans', w: [400, 500, 600, 700] },
    { name: 'Playfair Display', cat: 'Serif', w: [400, 500, 600, 700] },
    { name: 'Merriweather', cat: 'Serif', w: [400, 700] },
    { name: 'Lora', cat: 'Serif', w: [400, 500, 600, 700] },
    { name: 'Libre Baskerville', cat: 'Serif', w: [400, 700] },
    { name: 'Source Serif 4', cat: 'Serif', w: [400, 600, 700] },
    { name: 'Noto Serif', cat: 'Serif', w: [400, 600, 700] },
    { name: 'Crimson Pro', cat: 'Serif', w: [400, 600, 700] },
    { name: 'EB Garamond', cat: 'Serif', w: [400, 500, 600, 700] },
    { name: 'Fraunces', cat: 'Serif', w: [400, 500, 600, 700] },
    { name: 'DM Serif Display', cat: 'Serif', w: [400] },
    { name: 'Instrument Serif', cat: 'Serif', w: [400] },
    { name: 'Bitter', cat: 'Serif', w: [400, 500, 600, 700] },
    { name: 'Roboto Serif', cat: 'Serif', w: [400, 500, 600, 700] },
    { name: 'JetBrains Mono', cat: 'Mono', w: [400, 500, 600, 700] },
    { name: 'Fira Code', cat: 'Mono', w: [400, 500, 600, 700] },
    { name: 'IBM Plex Mono', cat: 'Mono', w: [400, 500, 600, 700] },
    { name: 'Space Mono', cat: 'Mono', w: [400, 700] },
    { name: 'Source Code Pro', cat: 'Mono', w: [400, 500, 600, 700] },
    { name: 'Roboto Mono', cat: 'Mono', w: [400, 500, 600, 700] },
    { name: 'DM Mono', cat: 'Mono', w: [300, 400, 500] },
    { name: 'Bebas Neue', cat: 'Display', w: [400] },
    { name: 'Anton', cat: 'Display', w: [400] },
    { name: 'Archivo Black', cat: 'Display', w: [400] },
    { name: 'Righteous', cat: 'Display', w: [400] },
    { name: 'Orbitron', cat: 'Display', w: [400, 500, 600, 700] },
    { name: 'Caveat', cat: 'Handwriting', w: [400, 500, 600, 700] },
    { name: 'Pacifico', cat: 'Handwriting', w: [400] },
    { name: 'Dancing Script', cat: 'Handwriting', w: [400, 500, 600, 700] },
    { name: 'Kalam', cat: 'Handwriting', w: [400, 700] },
    { name: 'Patrick Hand', cat: 'Handwriting', w: [400] }
  ];

  /* ---------------- components ---------------- */
  function lines(value) {
    return String(value || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
  }

  /* Small parsers shared by the music, download, vault and utility blocks.
     They keep the content fields friendly: plain lines, usually separated
     by vertical bars, so the block content stays editable in the inspector. */
  function parts(line) {
    return String(line || '').split('|').map(function (s) { return s.trim(); });
  }

  function iconLabel(value) {
    var text = String(value || '');
    var idx = text.indexOf(':');
    if (idx < 0) return { icon: 'circle', label: text.trim() };
    return { icon: text.slice(0, idx).trim() || 'circle', label: text.slice(idx + 1).trim() };
  }

  function number(value, fallback, min, max) {
    var n = Number(value);
    if (!isFinite(n)) n = fallback;
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return n;
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  S.getAppBarActionItems = function (p) {
    if (p && Array.isArray(p.actionItems) && p.actionItems.length) {
      return p.actionItems;
    }
    var raw = String((p && p.actions) || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    return raw.map(function (icon, idx) {
      var target = 'none';
      var label = icon;
      if (icon === 'search') { target = 'search_overlay'; label = 'Search'; }
      else if (icon === 'more_vert' || icon === 'more_horiz') { target = 'menu'; label = 'More options'; }
      else if (icon === 'settings' || icon === 'tune') { target = 'settings'; label = 'Settings'; }
      else if (icon === 'notifications') { target = 'notifications'; label = 'Notifications'; }
      else if (icon === 'shopping_bag' || icon === 'shopping_cart') { target = 'cart'; label = 'Cart'; }
      else if (icon === 'person') { target = 'profile'; label = 'Profile'; }
      return { id: 'act_' + idx, icon: icon, label: label, target: target };
    });
  };

  S.components = {

    appbar: {
      label: 'Top app bar',
      group: 'Structure',
      icon: 'web_asset',
      defaults: {
        title: 'Discover',
        subtitle: 'Explore curated music & podcasts',
        variant: 'small',
        greeting: 'Good morning, Alex',
        searchPlaceholder: 'Search tracks, artists, files...',
        badgeText: '3',
        avatarInitials: 'AM',
        leading: true,
        leadingIcon: 'menu',
        actions: 'search, more_vert',
        elevated: true
      },
      fields: [
        { key: 'title', label: 'Title / Brand', type: 'text' },
        { key: 'variant', label: 'Header Style / Variation', type: 'select', options: [
          ['small', '1. Material 3 Small Bar'],
          ['center', '2. Material 3 Centered Title'],
          ['large', '3. Material 3 Large Prominent'],
          ['search', '4. Integrated Search Bar Header'],
          ['search-pill', '5. Floating Search Pill Capsule'],
          ['profile', '6. Greeting & User Avatar Bar'],
          ['store', '7. Store Brand & Cart Badge Header'],
          ['capsule', '8. Floating Island Capsule Header'],
          ['social', '9. Social Feed & Direct Message'],
          ['saas', '10. SaaS Workspace Selector'],
          ['glass', '11. Frosted Glassmorphism Header'],
          ['editorial', '12. Minimalist Editorial Header'],
          ['music', '13. Music Hi-Fi Media Header'],
          ['gradient', '14. Vibrant Accent Gradient Header'],
          ['subtabs', '15. Integrated Header with Sub-Tabs']
        ] },
        { key: 'leading', label: 'Leading / Menu button', type: 'toggle' },
        { key: 'leadingIcon', label: 'Leading icon', type: 'icon' },
        { key: 'actions', label: 'Actions', type: 'text' },
        { key: 'subtitle', label: 'Subtitle / Description', type: 'text' },
        { key: 'elevated', label: 'Tinted / Glass background', type: 'toggle' },
        { key: 'greeting', label: 'Greeting text (Profile style)', type: 'text' },
        { key: 'searchPlaceholder', label: 'Search placeholder', type: 'text' },
        { key: 'badgeText', label: 'Badge count (Cart/Notif)', type: 'text' },
        { key: 'avatarInitials', label: 'Avatar initials', type: 'text' }
      ],
      html: function (p) {
        var isBack = p.leadingIcon === 'arrow_back' || p.leadingIcon === 'chevron_left';
        var leadUi = isBack ? ' data-nav-target="back"' : ' data-ui-action="drawer"';
        var leading = p.leading
          ? '<button class="icon-btn" aria-label="' + (isBack ? 'Go back' : 'Open navigation') + '"' + leadUi + '>' + S.icon(p.leadingIcon || 'menu') + '</button>'
          : '';

        var actionItems = S.getAppBarActionItems(p);
        var actHTML = actionItems.map(function (item, idx) {
          var a = item.icon || 'star';
          if (a === 'avatar') return '<span class="avatar">' + esc(p.avatarInitials || 'AL') + '</span>';

          var target = item.target || 'none';
          var uiAttr = '';
          var navAttr = '';

          if (target === 'search_overlay') {
            uiAttr = ' data-ui-action="search"';
          } else if (target === 'menu') {
            uiAttr = ' data-ui-action="menu"';
          } else if (target === 'drawer') {
            uiAttr = ' data-ui-action="drawer"';
          } else if (target !== 'none' && target !== '') {
            navAttr = ' data-nav-target="' + esc(target) + '" data-transition="slide"';
          }

          return '<button class="icon-btn" aria-label="' + esc(item.label || a) + '"' +
            ' data-appbar-act-idx="' + idx + '"' +
            uiAttr + navAttr + '>' + S.icon(a) + '</button>';
        }).join('');

        var v = p.variant || 'small';
        var elevCls = p.elevated ? ' elevated' : '';

        // 4. Integrated Search Header
        if (v === 'search') {
          return '<header class="app-bar ab-search-header' + elevCls + '">' +
            leading +
            '<div class="ab-search-input-box" data-ui-action="search">' +
            S.icon('search') +
            '<span class="ab-search-ph">' + esc(p.searchPlaceholder || 'Search...') + '</span>' +
            '<button type="button" class="ab-voice-btn" aria-label="Voice search">' + S.icon('mic') + '</button>' +
            '</div>' +
            '<button class="icon-btn" aria-label="Filter" data-ui-action="search">' + S.icon('tune') + '</button>' +
            '</header>';
        }

        // 5. Floating Search Pill Capsule
        if (v === 'search-pill') {
          return '<header class="app-bar ab-search-pill-header">' +
            '<div class="ab-search-pill" data-ui-action="search">' +
            leading +
            '<span class="ab-search-ph">' + esc(p.searchPlaceholder || 'Search here...') + '</span>' +
            '<span class="ab-pill-actions">' + S.icon('mic') + '<span class="avatar mini">' + esc(p.avatarInitials || 'AL') + '</span></span>' +
            '</div></header>';
        }

        // 6. Profile & Greeting Bar
        if (v === 'profile') {
          return '<header class="app-bar ab-profile-header' + elevCls + '">' +
            '<div class="ab-prof-left">' +
            '<div class="ab-avatar-badge">' + esc(p.avatarInitials || 'AL') + '</div>' +
            '<div class="ab-prof-texts"><span class="ab-greeting">' + esc(p.greeting || 'Good morning') + '</span><h2 class="ab-title" data-edit="title">' + esc(p.title) + '</h2></div>' +
            '</div>' +
            '<div class="ab-prof-right">' +
            '<button class="icon-btn" aria-label="Notifications"><span class="notif-wrap">' + S.icon('notifications') + '<span class="badge-dot"></span></span></button>' +
            '<button class="icon-btn" aria-label="Search" data-ui-action="search">' + S.icon('search') + '</button>' +
            '</div></header>';
        }

        // 7. Store & Cart Header
        if (v === 'store') {
          return '<header class="app-bar ab-store-header' + elevCls + '">' +
            leading +
            '<h1 class="ab-title store-brand" data-edit="title">' + esc(p.title) + '</h1>' +
            '<div class="ab-store-actions">' +
            '<button class="icon-btn" aria-label="Search" data-ui-action="search">' + S.icon('search') + '</button>' +
            '<button class="icon-btn" aria-label="Wishlist">' + S.icon('favorite_border') + '</button>' +
            '<button class="icon-btn ab-cart-btn" aria-label="Cart">' + S.icon('shopping_bag') + '<span class="cart-badge">' + esc(p.badgeText || '3') + '</span></button>' +
            '</div></header>';
        }

        // 8. Floating Capsule Island
        if (v === 'capsule') {
          return '<div class="app-bar-wrap-floating"><header class="app-bar ab-capsule-island">' +
            leading +
            '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1>' +
            '<div class="ab-island-actions">' + actHTML + '</div>' +
            '</header></div>';
        }

        // 9. Social Stories & Feed
        if (v === 'social') {
          return '<header class="app-bar ab-social-header' + elevCls + '">' +
            '<button class="icon-btn" aria-label="Camera">' + S.icon('photo_camera') + '</button>' +
            '<h1 class="ab-title social-brand" data-edit="title">' + esc(p.title) + '</h1>' +
            '<div class="ab-social-actions">' +
            '<button class="icon-btn" aria-label="Activity">' + S.icon('favorite_border') + '</button>' +
            '<button class="icon-btn ab-dm-btn" aria-label="Direct message">' + S.icon('send') + '<span class="cart-badge">' + esc(p.badgeText || '2') + '</span></button>' +
            '</div></header>';
        }

        // 10. SaaS Workspace Selector
        if (v === 'saas') {
          return '<header class="app-bar ab-saas-header' + elevCls + '">' +
            '<div class="ab-workspace-picker"><span class="ab-ws-icon">' + S.icon('token') + '</span><strong data-edit="title">' + esc(p.title) + '</strong><span class="mi ab-ws-chev">expand_more</span></div>' +
            '<div class="ab-saas-actions">' +
            '<button class="icon-btn" aria-label="Search" data-ui-action="search">' + S.icon('search') + '</button>' +
            '<span class="avatar mini">' + esc(p.avatarInitials || 'AL') + '</span>' +
            '</div></header>';
        }

        // 11. Frosted Glassmorphism
        if (v === 'glass') {
          return '<header class="app-bar ab-glass-header elevated">' +
            leading +
            '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1>' +
            actHTML + '</header>';
        }

        // 12. Minimalist Editorial
        if (v === 'editorial') {
          return '<header class="app-bar ab-editorial-header">' +
            '<div class="ab-ed-top"><span class="ab-ed-date">Thursday, Nov 5 · Edition 42</span><div class="ab-ed-actions">' + actHTML + '</div></div>' +
            '<h1 class="ab-title ab-ed-title" data-edit="title">' + esc(p.title) + '</h1>' +
            (p.subtitle ? '<p class="ab-ed-sub">' + esc(p.subtitle) + '</p>' : '') +
            '</header>';
        }

        // 13. Music Hi-Fi Media
        if (v === 'music') {
          return '<header class="app-bar ab-music-header' + elevCls + '">' +
            leading +
            '<div class="ab-music-title-box"><h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1><small class="ab-music-sub">' + esc(p.subtitle || 'Hi-Fi Lossless · 24-bit') + '</small></div>' +
            '<div class="ab-music-actions"><button class="icon-btn" aria-label="Cast">' + S.icon('cast') + '</button><button class="icon-btn" aria-label="Equalizer">' + S.icon('graphic_eq') + '</button>' + actHTML + '</div>' +
            '</header>';
        }

        // 14. Vibrant Accent Gradient
        if (v === 'gradient') {
          return '<header class="app-bar ab-gradient-header">' +
            leading +
            '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1>' +
            actHTML + '</header>';
        }

        // 15. Integrated Header with Sub-Tabs
        if (v === 'subtabs') {
          return '<header class="app-bar ab-subtabs-header' + elevCls + '">' +
            '<div class="ab-row">' + leading + '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1>' + actHTML + '</div>' +
            '<div class="ab-integrated-tabs"><span class="ab-subtab active">Featured</span><span class="ab-subtab">Top Charts</span><span class="ab-subtab">Genres</span><span class="ab-subtab">Live</span></div>' +
            '</header>';
        }

        // 3. Large Prominent
        if (v === 'large') {
          return '<header class="app-bar large' + elevCls + '">' +
            '<div class="ab-row">' + leading + '<span style="flex:1"></span>' + actHTML + '</div>' +
            '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1>' +
            (p.subtitle ? '<p class="ab-subtitle">' + esc(p.subtitle) + '</p>' : '') +
            '</header>';
        }

        // Standard Small & Centered
        return '<header class="app-bar ' + (v === 'center' ? 'center ' : '') + elevCls + '">' +
          leading +
          '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1>' +
          actHTML + '</header>';
      }
    },

    /* Distinct Preset Header Blocks */
    searchheader: {
      label: 'Search header',
      group: 'Structure',
      icon: 'search',
      targets: ['app'],
      defaults: {
        title: 'Search',
        variant: 'search',
        searchPlaceholder: 'Search tracks, artists, albums...',
        leading: true,
        leadingIcon: 'menu'
      },
      fields: [
        { key: 'searchPlaceholder', label: 'Search placeholder', type: 'text' },
        { key: 'leading', label: 'Show menu button', type: 'toggle' },
        { key: 'leadingIcon', label: 'Leading icon', type: 'icon' }
      ],
      html: function (p) {
        return S.components.appbar.html(Object.assign({}, p, { variant: 'search' }));
      }
    },

    profilebar: {
      label: 'Profile header bar',
      group: 'Structure',
      icon: 'account_circle',
      targets: ['app'],
      defaults: {
        title: 'Alex Rivera',
        greeting: 'Good morning, Alex',
        avatarInitials: 'AR',
        variant: 'profile',
        elevated: true
      },
      fields: [
        { key: 'greeting', label: 'Greeting', type: 'text' },
        { key: 'title', label: 'User name', type: 'text' },
        { key: 'avatarInitials', label: 'Avatar initials', type: 'text' },
        { key: 'elevated', label: 'Elevated tint', type: 'toggle' }
      ],
      html: function (p) {
        return S.components.appbar.html(Object.assign({}, p, { variant: 'profile' }));
      }
    },

    storeheader: {
      label: 'Store & cart header',
      group: 'Structure',
      icon: 'shopping_bag',
      targets: ['app'],
      defaults: {
        title: 'Aurora Store',
        badgeText: '3',
        variant: 'store',
        leading: true,
        leadingIcon: 'menu',
        elevated: true
      },
      fields: [
        { key: 'title', label: 'Store brand', type: 'text' },
        { key: 'badgeText', label: 'Cart item count', type: 'text' },
        { key: 'leading', label: 'Leading button', type: 'toggle' }
      ],
      html: function (p) {
        return S.components.appbar.html(Object.assign({}, p, { variant: 'store' }));
      }
    },

    capsuleheader: {
      label: 'Floating island bar',
      group: 'Structure',
      icon: 'panorama_fish_eye',
      targets: ['app'],
      defaults: {
        title: 'Studio Hub',
        variant: 'capsule',
        leading: true,
        leadingIcon: 'apps',
        actions: 'search, more_vert'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'actions', label: 'Actions (comma separated)', type: 'text' },
        { key: 'navTarget', label: 'Navigate to screen on click (e.g. Settings or Screen name)', type: 'text' }
      ],
      html: function (p) {
        return S.components.appbar.html(Object.assign({}, p, { variant: 'capsule' }));
      }
    },
    searchbar: {
      label: 'Search bar',
      group: 'Structure',
      icon: 'search',
      defaults: { placeholder: 'Search places, food, stays', avatar: true },
      fields: [
        { key: 'placeholder', label: 'Placeholder', type: 'text' },
        { key: 'avatar', label: 'Show avatar', type: 'toggle' }
      ],
      html: function (p) {
        return '<div class="search-bar">' + S.icon('search') +
          '<span class="sb-text" data-edit="placeholder">' + esc(p.placeholder) + '</span>' +
          (p.avatar ? '<span class="avatar">AL</span>' : '') + '</div>';
      }
    },

    tabs: {
      label: 'Tabs (Underline M3)',
      group: 'Structure',
      icon: 'tab',
      defaults: {
        labels: 'For you, Following, Discover',
        active: 0,
        style: 'primary',
        weight: '600',
        fontSize: 14
      },
      fields: [
        { key: 'labels', label: 'Labels (comma separated: Label or Label (Count))', type: 'text' },
        { key: 'active', label: 'Active tab index', type: 'number', min: 0, max: 8 },
        { key: 'style', label: 'Tab Design Variation', type: 'select', options: [
          ['primary', '1. Material 3 Underline Indicator'],
          ['pill', '2. Filled Pill Capsule'],
          ['pill-outlined', '3. Outlined Capsule Border'],
          ['bubble', '4. Bubble Background'],
          ['segmented', '5. Contained Segmented Toggle'],
          ['badge', '6. Badge Counters (All 18, Unread 4)'],
          ['icon-stacked', '7. Stacked Icon + Text Tabs'],
          ['icon-inline', '8. Inline Icon + Text Tabs'],
          ['minimal-bold', '9. Minimalist Bold Typography'],
          ['boxed', '10. Boxed Card Matrix'],
          ['glass', '11. Frosted Glass Tabs'],
          ['glow', '12. Neon Underline Glow'],
          ['scrollable', '13. Scrollable Chips Rail'],
          ['floating', '14. Floating Island Tabs'],
          ['dot', '15. Status Dot Indicator']
        ] },
        { key: 'weight', label: 'Font thickness', type: 'select', options: [
          ['400', 'Regular (400)'],
          ['500', 'Medium (500)'],
          ['600', 'Semibold (600)'],
          ['700', 'Bold (700)'],
          ['800', 'Extra bold (800)']
        ] },
        { key: 'fontSize', label: 'Font size (px)', type: 'number', min: 11, max: 20 }
      ],
      html: function (p) {
        var active = Number(p.active) || 0;
        var style = p.style || 'primary';
        var styleCls = ' style-' + style;
        var customStyle = '';
        if (p.weight) customStyle += 'font-weight: ' + p.weight + ';';
        if (p.fontSize) customStyle += 'font-size: ' + p.fontSize + 'px;';
        var styleAttr = customStyle ? ' style="' + customStyle + '"' : '';

        var defaultIcons = ['star', 'favorite', 'explore', 'notifications', 'bookmark', 'local_fire_department'];

        var tabsHtml = String(p.labels || '').split(',').map(function (label, i) {
          var trimmed = label.trim();
          var on = i === active;
          var ico = defaultIcons[i % defaultIcons.length];

          // Check if label contains icon or badge count
          var countMatch = trimmed.match(/^([^\(\d]+)(?:\((\d+)\)|\s+(\d+))?$/);
          var textLabel = trimmed;
          var countBadge = '';
          if (countMatch && countMatch[2]) {
            textLabel = countMatch[1].trim();
            countBadge = '<span class="tab-badge-pill">' + esc(countMatch[2]) + '</span>';
          } else if (style === 'badge') {
            countBadge = '<span class="tab-badge-pill">' + (i === 0 ? '24' : i === 1 ? '5' : '1') + '</span>';
          }

          var inner = '';
          if (style === 'icon-stacked') {
            inner = '<span class="tab-ico-stacked">' + S.icon(ico) + '</span><span class="tab-text-lbl">' + esc(textLabel) + '</span>';
          } else if (style === 'icon-inline') {
            inner = '<span class="tab-ico-inline">' + S.icon(ico) + '</span><span class="tab-text-lbl">' + esc(textLabel) + '</span>';
          } else if (style === 'dot') {
            inner = '<span class="tab-text-lbl">' + esc(textLabel) + '</span>' + (on ? '<span class="tab-dot-marker"></span>' : '');
          } else {
            inner = '<span class="tab-text-lbl">' + esc(textLabel) + '</span>' + countBadge;
          }

          return '<button type="button" class="tab' + (on ? ' active' : '') + '" data-tab-index="' + i + '" data-tab-label="' + esc(textLabel) + '">' + inner + '</button>';
        }).join('');

        return '<div class="tabs-row' + styleCls + '"' + styleAttr + '>' + tabsHtml + '</div>';
      }
    },

    /* Distinct Preset Tab Blocks */
    tabspill: {
      label: 'Tabs (Pills & Chips)',
      group: 'Structure',
      icon: 'more_horiz',
      targets: ['app'],
      defaults: {
        labels: 'All, Top Rated, New, Favorites',
        active: 0,
        style: 'pill'
      },
      fields: [
        { key: 'labels', label: 'Labels (comma separated)', type: 'text' },
        { key: 'active', label: 'Active index', type: 'number', min: 0, max: 6 }
      ],
      html: function (p) {
        return S.components.tabs.html(Object.assign({}, p, { style: 'pill' }));
      }
    },

    tabssegmented: {
      label: 'Tabs (Segmented)',
      group: 'Structure',
      icon: 'view_week',
      targets: ['app'],
      defaults: {
        labels: 'Day, Week, Month, Year',
        active: 1,
        style: 'segmented'
      },
      fields: [
        { key: 'labels', label: 'Segments (comma separated)', type: 'text' },
        { key: 'active', label: 'Active segment', type: 'number', min: 0, max: 4 }
      ],
      html: function (p) {
        return S.components.tabs.html(Object.assign({}, p, { style: 'segmented' }));
      }
    },

    tabsbadge: {
      label: 'Tabs (Badge Counters)',
      group: 'Structure',
      icon: 'mark_chat_unread',
      targets: ['app'],
      defaults: {
        labels: 'Primary (18), Social (5), Promotions (2)',
        active: 0,
        style: 'badge'
      },
      fields: [
        { key: 'labels', label: 'Labels with counts: Name (Count)', type: 'text' },
        { key: 'active', label: 'Active tab', type: 'number', min: 0, max: 4 }
      ],
      html: function (p) {
        return S.components.tabs.html(Object.assign({}, p, { style: 'badge' }));
      }
    },

    tabsicon: {
      label: 'Tabs (Icon & Text)',
      group: 'Structure',
      icon: 'tab_unselected',
      targets: ['app'],
      defaults: {
        labels: 'Music, Podcasts, Audiobooks',
        active: 0,
        style: 'icon-inline'
      },
      fields: [
        { key: 'labels', label: 'Labels (comma separated)', type: 'text' },
        { key: 'active', label: 'Active tab', type: 'number', min: 0, max: 4 }
      ],
      html: function (p) {
        return S.components.tabs.html(Object.assign({}, p, { style: 'icon-inline' }));
      }
    },
    hero: {
      label: 'Hero banner',
      group: 'Structure',
      icon: 'image',
      defaults: {
        kicker: 'Editor\'s pick',
        title: 'Kyoto in autumn',
        subtitle: 'Five slow days of temples, tea and maple leaves.',
        icon: 'landscape',
        height: 190
      },
      fields: [
        { key: 'kicker', label: 'Kicker', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { key: 'icon', label: 'Watermark icon', type: 'icon' },
        { key: 'height', label: 'Height', type: 'range', min: 140, max: 300, step: 10, suffix: 'px' }
      ],
      html: function (p) {
        return '<div class="hero" style="min-height:' + (Number(p.height) || 190) + 'px">' +
          S.icon(p.icon, 'hero-icon') +
          '<p class="hero-kicker" data-edit="kicker">' + esc(p.kicker) + '</p>' +
          '<h2 data-edit="title">' + esc(p.title) + '</h2>' +
          '<p data-edit="subtitle">' + esc(p.subtitle) + '</p></div>';
      }
    },

    section: {
      label: 'Section title',
      group: 'Structure',
      icon: 'title',
      defaults: { title: 'Nearby cafés', action: 'See all' },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'action', label: 'Action label', type: 'text' }
      ],
      html: function (p) {
        return '<div class="section-head"><h3 data-edit="title">' + esc(p.title) + '</h3>' +
          (p.action ? '<a data-edit="action">' + esc(p.action) + '</a>' : '') + '</div>';
      }
    },

    card: {
      label: 'Card',
      group: 'Content',
      icon: 'dashboard',
      defaults: {
        variant: 'filled',
        title: 'Slow mornings',
        body: 'A quiet guide to the best coffee corners in the city, picked by locals.',
        media: true,
        mediaIcon: 'coffee',
        actions: 'Share, Save'
      },
      fields: [
        { key: 'variant', label: 'Variant', type: 'select', options: [['filled', 'Filled'], ['elevated', 'Elevated'], ['outlined', 'Outlined']] },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'body', label: 'Body', type: 'textarea' },
        { key: 'media', label: 'Media area', type: 'toggle' },
        { key: 'mediaIcon', label: 'Media icon', type: 'icon' },
        { key: 'actions', label: 'Actions (comma separated)', type: 'text' }
      ],
      html: function (p) {
        var media = p.media
          ? '<div class="card-media">' + S.icon(p.mediaIcon) + '</div>'
          : '';
        var actions = String(p.actions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        var navAttr = p.navTarget ? ' data-nav-target="' + esc(p.navTarget) + '" data-transition="' + esc(p.transition || 'slide') + '"' : '';
        return '<article class="card ' + esc(p.variant || 'filled') + (p.navTarget ? ' is-clickable' : '') + '"' + navAttr + '>' + media +
          '<div class="card-body"><h3 data-edit="title">' + esc(p.title) + '</h3>' +
          '<p data-edit="body">' + esc(p.body) + '</p></div>' +
          (actions.length ? '<div class="card-actions">' + actions.map(function (a) {
            return '<button class="text-btn">' + esc(a) + '</button>';
          }).join('') + '</div>' : '') + '</article>';
      }
    },

    list: {
      label: 'List',
      group: 'Content',
      icon: 'list',
      defaults: {
        items: 'Blue Bottle Coffee | 0.4 mi · Coffee shop\nKyoto Garden | 1.2 mi · Park\nThe Reading Room | 2.1 mi · Bookstore',
        leading: 'avatar',
        leadingIcon: 'place',
        trailing: 'chevron'
      },
      fields: [
        { key: 'items', label: 'Items — one per line: Title | Subtitle', type: 'textarea' },
        { key: 'leading', label: 'Leading', type: 'select', options: [['avatar', 'Avatar initials'], ['icon', 'Icon'], ['none', 'None']] },
        { key: 'leadingIcon', label: 'Leading icon', type: 'icon' },
        { key: 'trailing', label: 'Trailing', type: 'select', options: [['chevron', 'Chevron'], ['switch', 'Switch'], ['badge', 'Badge'], ['none', 'None']] }
      ],
      html: function (p) {
        var rows = String(p.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (line, i) {
          var parts = line.split('|');
          var title = (parts[0] || '').trim();
          var sub = (parts[1] || '').trim();
          var lead = '';
          if (p.leading === 'avatar') lead = '<span class="list-avatar">' + esc(U.initials(title)) + '</span>';
          else if (p.leading === 'icon') lead = '<span class="list-lead">' + S.icon(p.leadingIcon || 'place') + '</span>';

          var trail = '';
          if (p.trailing === 'switch') trail = '<span class="switch' + (i === 0 ? ' on' : '') + '"></span>';
          else if (p.trailing === 'badge') trail = '<span class="badge">' + (i + 1) + '</span>';
          else if (p.trailing === 'chevron') trail = '<span class="mi li-chev">chevron_right</span>';

          return '<li class="list-item">' + lead +
            '<div class="li-text"><div class="li-title">' + esc(title) + '</div>' +
            (sub ? '<div class="li-sub">' + esc(sub) + '</div>' : '') + '</div>' + trail + '</li>';
        }).join('');
        return '<ul class="list">' + rows + '</ul>';
      }
    },

    button: {
      label: 'Button',
      group: 'Content',
      icon: 'smart_button',
      defaults: { label: 'View all places', variant: 'filled', icon: 'arrow_forward', full: false },
      fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'variant', label: 'Variant', type: 'select', options: [['filled', 'Filled'], ['tonal', 'Tonal'], ['outlined', 'Outlined'], ['text', 'Text'], ['elevated', 'Elevated']] },
        { key: 'icon', label: 'Icon', type: 'icon' },
        { key: 'full', label: 'Full width', type: 'toggle' }
      ],
      html: function (p) {
        var navAttr = p.navTarget ? ' data-nav-target="' + esc(p.navTarget) + '" data-transition="' + esc(p.transition || 'slide') + '"' : '';
        return '<div class="btn-row"><button class="btn ' + esc(p.variant || 'filled') + (p.full ? ' full' : '') + '"' + navAttr + '>' +
          (p.icon ? S.icon(p.icon) : '') + '<span>' + esc(p.label) + '</span></button></div>';
      }
    },

    chips: {
      label: 'Chips',
      group: 'Content',
      icon: 'label',
      defaults: { labels: 'All, Beaches, Mountains, City', selected: 0, showIcon: true },
      fields: [
        { key: 'labels', label: 'Labels (comma separated)', type: 'text' },
        { key: 'selected', label: 'Selected chip', type: 'number', min: 0, max: 9 },
        { key: 'showIcon', label: 'Check icon on selected', type: 'toggle' }
      ],
      html: function (p) {
        var selected = Number(p.selected) || 0;
        return '<div class="chips">' + String(p.labels || '').split(',').map(function (label, i) {
          var on = i === selected;
          return '<span class="chip' + (on ? ' on' : '') + '">' +
            (on && p.showIcon ? S.icon('check') : '') + esc(label.trim()) + '</span>';
        }).join('') + '</div>';
      }
    },

    textfield: {
      label: 'Text field',
      group: 'Content',
      icon: 'text_fields',
      defaults: { label: 'Email address', placeholder: 'you@example.com', value: '', variant: 'outlined', icon: 'mail', support: 'We will never share your email.' },
      fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'placeholder', label: 'Placeholder', type: 'text' },
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'variant', label: 'Variant', type: 'select', options: [['outlined', 'Outlined'], ['filled', 'Filled']] },
        { key: 'icon', label: 'Leading icon', type: 'icon' },
        { key: 'support', label: 'Supporting text', type: 'text' }
      ],
      html: function (p) {
        return '<div class="field ' + esc(p.variant || 'outlined') + '">' +
          '<div class="field-label">' + esc(p.label) + '</div>' +
          '<div class="field-box">' + (p.icon ? S.icon(p.icon) : '') +
          '<span class="field-value' + (p.value ? '' : ' ph') + '">' + esc(p.value || p.placeholder) + '</span></div>' +
          (p.support ? '<div class="field-support">' + esc(p.support) + '</div>' : '') + '</div>';
      }
    },

    switchrow: {
      label: 'Switch row',
      group: 'Content',
      icon: 'toggle_on',
      defaults: { title: 'Offline maps', subtitle: 'Download this area for later', on: true },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'on', label: 'On', type: 'toggle' }
      ],
      html: function (p) {
        return '<div class="switch-row"><div class="li-text">' +
          '<div class="li-title">' + esc(p.title) + '</div>' +
          '<div class="li-sub">' + esc(p.subtitle) + '</div></div>' +
          '<span class="switch' + (p.on ? ' on' : '') + '"></span></div>';
      }
    },

    snackbar: {
      label: 'Snackbar',
      group: 'Feedback',
      icon: 'notifications',
      defaults: { message: 'Your trip was saved to drafts.', action: 'Undo' },
      fields: [
        { key: 'message', label: 'Message', type: 'text' },
        { key: 'action', label: 'Action label', type: 'text' }
      ],
      html: function (p) {
        return '<div class="snackbar"><span>' + esc(p.message) + '</span>' +
          '<span class="snack-action">' + esc(p.action) + '</span></div>';
      }
    },

    dialog: {
      label: 'Dialog',
      group: 'Feedback',
      icon: 'chat',
      defaults: {
        title: 'Delete this trip?',
        body: 'The itinerary and all saved places will be removed. This cannot be undone.',
        cancel: 'Cancel',
        confirm: 'Delete'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'body', label: 'Body', type: 'textarea' },
        { key: 'cancel', label: 'Cancel label', type: 'text' },
        { key: 'confirm', label: 'Confirm label', type: 'text' }
      ],
      html: function (p) {
        return '<div class="dialog"><h3 data-edit="title">' + esc(p.title) + '</h3>' +
          '<p data-edit="body">' + esc(p.body) + '</p>' +
          '<div class="dialog-actions"><button class="text-btn">' + esc(p.cancel) + '</button>' +
          '<button class="text-btn">' + esc(p.confirm) + '</button></div></div>';
      }
    },

    sheet: {
      label: 'Bottom sheet',
      group: 'Feedback',
      icon: 'expand_less',
      defaults: {
        title: 'Share this place',
        items: 'link:Copy link\nshare:Share to apps\nbookmark:Save for later'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'items', label: 'Items — one per line: icon:Label', type: 'textarea' }
      ],
      html: function (p) {
        var rows = String(p.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (line) {
          var idx = line.indexOf(':');
          var ico = idx > -1 ? line.slice(0, idx).trim() : 'circle';
          var label = idx > -1 ? line.slice(idx + 1).trim() : line;
          return '<div class="sheet-item">' + S.icon(ico) + '<span>' + esc(label) + '</span></div>';
        }).join('');
        return '<div class="sheet"><div class="sheet-handle"></div>' +
          '<div class="sheet-title">' + esc(p.title) + '</div>' + rows + '</div>';
      }
    },

    progress: {
      label: 'Progress',
      group: 'Feedback',
      icon: 'linear_scale',
      defaults: { label: 'Trip planning', value: 68 },
      fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'value', label: 'Value', type: 'range', min: 0, max: 100, step: 1, suffix: '%' }
      ],
      html: function (p) {
        var value = U.clamp(Number(p.value) || 0, 0, 100);
        return '<div class="progress-wrap"><div class="progress-top"><span>' + esc(p.label) + '</span>' +
          '<span>' + value + '%</span></div><div class="progress"><span style="width:' + value + '%"></span></div></div>';
      }
    },

    fab: {
      label: 'Floating button',
      group: 'Controls',
      icon: 'add',
      defaults: { icon: 'add', label: '' },
      fields: [
        { key: 'icon', label: 'Icon', type: 'icon' },
        { key: 'label', label: 'Label (leave empty for round)', type: 'text' }
      ],
      html: function (p) {
        return '<div class="fab-row"><button class="fab' + (p.label ? '' : ' icon-only') + '">' +
          S.icon(p.icon) + (p.label ? '<span>' + esc(p.label) + '</span>' : '') + '</button></div>';
      }
    },

    bottomnav: {
      label: 'Bottom navigation',
      group: 'Controls',
      icon: 'apps',
      defaults: {
        items: 'explore:Discover\nmap:Explore\nbookmark:Saved\nperson:Profile',
        active: 0,
        style: 'material'
      },
      fields: [
        { key: 'style', label: 'Bottom Bar Design Variation', type: 'select', options: [
          ['material', '1. Material 3 Standard Bar'],
          ['floating', '2. Floating Capsule Dock'],
          ['center-fab', '3. Center Raised Action FAB'],
          ['compact', '4. Compact Icon-Only Bar'],
          ['minimal', '5. Minimal Underline Indicator'],
          ['glass', '6. Apple Frosted Glass Blur'],
          ['dot', '7. Glowing Status Dot Indicator'],
          ['expanding-pill', '8. Expanding Active Pill Tab'],
          ['neon-cyber', '9. Dark Cyber Neon Dock'],
          ['split-island', '10. Split Dual Island Dock'],
          ['badge-counter', '11. Notification Badge Counters'],
          ['gradient-border', '12. Chromatic Gradient Border'],
          ['curved-liquid', '13. Curved Liquid Wave Bar'],
          ['segmented-dock', '14. Connected Segmented Dock'],
          ['pill-outline', '15. Floating Outlined Minimalist']
        ], hint: 'Applied to the navigation bar on your active screens.' },
        { key: 'items', label: 'Items - one per line: icon:Label', type: 'textarea' },
        { key: 'active', label: 'Active item index', type: 'number', min: 0, max: 8 }
      ],
      html: function (p) {
        var active = Number(p.active) || 0;
        var style = p.style || 'material';
        var parsed = String(p.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (line, i) {
          var idx = line.indexOf(':');
          var ico = idx > -1 ? line.slice(0, idx).trim() : 'circle';
          var label = idx > -1 ? line.slice(idx + 1).trim() : line;
          return { icon: ico, label: label, index: i, active: i === active };
        });

        // 3. Center Raised FAB Variant
        if (style === 'center-fab') {
          var half = Math.floor(parsed.length / 2);
          var leftItems = parsed.slice(0, half);
          var rightItems = parsed.slice(half);

          var renderItem = function (item) {
            return '<button type="button" class="nav-item' + (item.active ? ' active' : '') + '" ' +
              'data-page-index="' + item.index + '" data-nav-index="' + item.index + '"' +
              (item.active ? ' aria-current="page"' : '') + '>' +
              '<span class="nav-icon">' + S.icon(item.icon) + '</span><span class="nav-label">' + esc(item.label) + '</span></button>';
          };

          return '<div class="nav-bar nav-center-fab-wrap">' +
            '<div class="ncf-side">' + leftItems.map(renderItem).join('') + '</div>' +
            '<div class="ncf-center-fab-notch">' +
            '<button type="button" class="ncf-fab-btn" aria-label="Quick Action"><span class="mi">add</span></button>' +
            '</div>' +
            '<div class="ncf-side">' + rightItems.map(renderItem).join('') + '</div>' +
            '</div>';
        }

        // 8. Expanding Pill Tab Variant
        if (style === 'expanding-pill') {
          var expRows = parsed.map(function (item) {
            return '<button type="button" class="nav-item exp-pill' + (item.active ? ' active' : '') + '" ' +
              'data-page-index="' + item.index + '" data-nav-index="' + item.index + '"' +
              (item.active ? ' aria-current="page"' : '') + '>' +
              '<span class="nav-icon">' + S.icon(item.icon) + '</span>' +
              (item.active ? '<span class="exp-label">' + esc(item.label) + '</span>' : '') +
              '</button>';
          }).join('');
          return '<div class="nav-bar nav-expanding-pill">' + expRows + '</div>';
        }

        // 11. Badge Counter Variant
        if (style === 'badge-counter') {
          var badgeRows = parsed.map(function (item, idx) {
            var badgeNum = idx === 1 ? '3' : idx === 2 ? '9+' : '';
            var bHtml = badgeNum ? '<span class="nav-badge-count">' + badgeNum + '</span>' : '';
            return '<button type="button" class="nav-item' + (item.active ? ' active' : '') + '" ' +
              'data-page-index="' + item.index + '" data-nav-index="' + item.index + '"' +
              (item.active ? ' aria-current="page"' : '') + '>' +
              '<span class="nav-icon">' + S.icon(item.icon) + bHtml + '</span><span>' + esc(item.label) + '</span></button>';
          }).join('');
          return '<div class="nav-bar nav-badge-counter">' + badgeRows + '</div>';
        }

        // Standard and other variants
        var rows = parsed.map(function (item) {
          var dotHtml = style === 'dot' && item.active ? '<span class="nav-active-dot"></span>' : '';
          return '<button type="button" class="nav-item' + (item.active ? ' active' : '') + '" ' +
            'data-page-index="' + item.index + '" data-nav-index="' + item.index + '"' +
            (item.active ? ' aria-current="page"' : '') + '>' +
            '<span class="nav-icon">' + S.icon(item.icon) + dotHtml + '</span><span class="nav-label">' + esc(item.label) + '</span></button>';
        }).join('');
        return '<div class="nav-bar nav-' + esc(style) + '">' + rows + '</div>';
      }
    },

    /* Distinct Preset Bottom Nav Blocks in Palette */
    bottomnavfloating: {
      label: 'Bottom nav (Floating)',
      group: 'Controls',
      icon: 'call_to_action',
      targets: ['app'],
      defaults: {
        items: 'home:Home\nsearch:Search\nfavorite:Likes\naccount_circle:Profile',
        active: 0,
        style: 'floating'
      },
      fields: [
        { key: 'items', label: 'Items (icon:Label)', type: 'textarea' },
        { key: 'active', label: 'Active tab', type: 'number', min: 0, max: 4 }
      ],
      html: function (p) {
        return S.components.bottomnav.html(Object.assign({}, p, { style: 'floating' }));
      }
    },

    bottomnavfab: {
      label: 'Bottom nav (Center FAB)',
      group: 'Controls',
      icon: 'add_circle',
      targets: ['app'],
      defaults: {
        items: 'home:Home\nsearch:Search\nfavorite:Likes\nperson:Profile',
        active: 0,
        style: 'center-fab'
      },
      fields: [
        { key: 'items', label: 'Items (icon:Label)', type: 'textarea' },
        { key: 'active', label: 'Active tab', type: 'number', min: 0, max: 4 }
      ],
      html: function (p) {
        return S.components.bottomnav.html(Object.assign({}, p, { style: 'center-fab' }));
      }
    },

    bottomnavexpanding: {
      label: 'Bottom nav (Expanding)',
      group: 'Controls',
      icon: 'linear_scale',
      targets: ['app'],
      defaults: {
        items: 'home:Home\nexplore:Explore\nbookmark:Saved\nsettings:Settings',
        active: 0,
        style: 'expanding-pill'
      },
      fields: [
        { key: 'items', label: 'Items (icon:Label)', type: 'textarea' },
        { key: 'active', label: 'Active tab', type: 'number', min: 0, max: 4 }
      ],
      html: function (p) {
        return S.components.bottomnav.html(Object.assign({}, p, { style: 'expanding-pill' }));
      }
    },

    bottomnavglass: {
      label: 'Bottom nav (Frosted Glass)',
      group: 'Controls',
      icon: 'blur_on',
      targets: ['app'],
      defaults: {
        items: 'home:Home\ntrending_up:Trends\nchat:Messages\nperson:Profile',
        active: 0,
        style: 'glass'
      },
      fields: [
        { key: 'items', label: 'Items (icon:Label)', type: 'textarea' },
        { key: 'active', label: 'Active tab', type: 'number', min: 0, max: 4 }
      ],
      html: function (p) {
        return S.components.bottomnav.html(Object.assign({}, p, { style: 'glass' }));
      }
    },
    /* ---------------------------- music ---------------------------- */

    musicplayer: {
      label: 'Now playing',
      group: 'Music',
      icon: 'play_circle',
      targets: ['app'],
      defaults: {
        style: 'vinyl',
        title: 'Midnight Drive',
        artist: 'Nova Lane',
        album: 'Neon Hours',
        coverIcon: 'headphones',
        coverImage: '',
        progress: 42,
        elapsed: '1:48',
        duration: '4:12',
        liked: true,
        playing: true,
        audioRoute: 'Phone Speaker',
        showWaveform: true,
        showLyrics: false,
        showSleepTimer: true,
        sleepTimer: '30m',
        showEqualizer: true,
        eqPreset: 'Bass Boost',
        showQualityBadge: false,
        audioQuality: 'Hi-Res Audio · 24-bit / 96kHz Lossless',
        showSpeedVolume: true,
        playbackSpeed: '1.0x',
        volume: 80,
        showQueue: false,
        showDownloadOptions: true,
        downloadQuality: 'lossless',
        downloadStorage: 'internal',
        downloadLyrics: true,
        downloadArtwork: true,
        downloadDolby: false,
        downloadStatus: 'downloaded',
        lyricsText: 'Neon lights reflecting on the wet pavement\nDriving through the empty city midnight mist\nLost inside the echoes of the stereo\nOnly you and me beneath the starlight',
        likeIcon: 'favorite',
        unlikeIcon: 'favorite_border',
        shuffleIcon: 'shuffle',
        previousIcon: 'skip_previous',
        playIcon: 'play_arrow',
        pauseIcon: 'pause',
        nextIcon: 'skip_next',
        repeatIcon: 'repeat',
        lyricsIcon: 'lyrics',
        queueIcon: 'queue_music'
      },
      fields: [
        { key: 'style', label: 'Player Style', type: 'select', options: [
          ['vinyl', '1. Vinyl Turntable (Rotating LP Disc)'],
          ['classic', '2. Hero Album Card (Modern Apple HIG)'],
          ['cassette', '3. Retro Vintage Cassette Tape (Dual Spools)'],
          ['glass', '4. Frosted Glass Neumorphic (Neon Aura)'],
          ['equalizer', '5. Studio Master Rack (Multiband EQ & VU)'],
          ['lyrics', '6. Waveform & Synced Lyrics Sheet'],
          ['gradient', '7. Atmospheric Mesh Gradient'],
          ['minimal', '8. Minimalist Hi-Fi']
        ] },
        { key: 'showSleepTimer', label: 'Sleep Timer module', type: 'toggle' },
        { key: 'sleepTimer', label: 'Sleep timer countdown', type: 'select', options: [
          ['15m', '15 Minutes'],
          ['30m', '30 Minutes'],
          ['45m', '45 Minutes'],
          ['60m', '60 Minutes'],
          ['track', 'End of track'],
          ['off', 'Off']
        ] },
        { key: 'showEqualizer', label: 'Equalizer & Sound FX module', type: 'toggle' },
        { key: 'eqPreset', label: 'EQ sound profile', type: 'select', options: [
          ['Bass Boost', 'Bass Boost (+6dB Sub)'],
          ['Vocal', 'Vocal Clarity (+4dB Mid)'],
          ['Electronic', 'Electronic & Dance'],
          ['Acoustic', 'Acoustic & Classical'],
          ['Rock', 'Rock & Metal (+5dB Air)'],
          ['Flat', 'Hi-Fi Flat Reference']
        ] },
        { key: 'showQualityBadge', label: 'Hi-Res Quality Badge', type: 'toggle' },
        { key: 'showSpeedVolume', label: 'Speed & Volume Controls', type: 'toggle' },
        { key: 'showQueue', label: 'Show Up Next Queue', type: 'toggle' },
        { key: 'showDownloadOptions', label: 'Download Options & Cards', type: 'toggle' },
        { key: 'downloadQuality', label: 'Download Quality', type: 'select', options: [
          ['lossless', 'Hi-Res Lossless (FLAC 24-bit/96kHz · ~48.2 MB)'],
          ['high', 'High Quality (320 kbps MP3 · ~11.4 MB)'],
          ['standard', 'Standard Quality (256 kbps AAC · ~7.8 MB)'],
          ['saver', 'Data Saver (96 kbps Opus · ~3.1 MB)']
        ] },
        { key: 'downloadStorage', label: 'Storage Location', type: 'select', options: [
          ['internal', 'Internal Phone Storage (45GB Free)'],
          ['sdcard', 'External MicroSD Card (112GB Free)']
        ] },
        { key: 'downloadStatus', label: 'Download Status', type: 'select', options: [
          ['downloaded', 'Downloaded (Offline Ready)'],
          ['downloading', 'Downloading (In Progress)'],
          ['idle', 'Not Downloaded']
        ] },
        { key: 'title', label: 'Track title', type: 'text' },
        { key: 'artist', label: 'Artist', type: 'text' },
        { key: 'album', label: 'Album', type: 'text' },
        { key: 'coverIcon', label: 'Cover icon', type: 'icon' },
        { key: 'coverImage', label: 'Cover image URL', type: 'text' },
        { key: 'progress', label: 'Progress', type: 'range', min: 0, max: 100, step: 1, suffix: '%' },
        { key: 'elapsed', label: 'Elapsed time', type: 'text' },
        { key: 'duration', label: 'Duration', type: 'text' },
        { key: 'audioRoute', label: 'Audio output route', type: 'text' },
        { key: 'liked', label: 'Liked', type: 'toggle' },
        { key: 'playing', label: 'Playing', type: 'toggle' },
        { key: 'showWaveform', label: 'Show audio waveform', type: 'toggle' },
        { key: 'showLyrics', label: 'Show lyrics preview', type: 'toggle' },
        { key: 'lyricsText', label: 'Lyrics text', type: 'textarea' },
        { key: 'likeIcon', label: 'Liked icon', type: 'icon' },
        { key: 'unlikeIcon', label: 'Not liked icon', type: 'icon' },
        { key: 'shuffleIcon', label: 'Shuffle icon', type: 'icon' },
        { key: 'previousIcon', label: 'Previous icon', type: 'icon' },
        { key: 'playIcon', label: 'Play icon', type: 'icon' },
        { key: 'pauseIcon', label: 'Pause icon', type: 'icon' },
        { key: 'nextIcon', label: 'Next icon', type: 'icon' },
        { key: 'repeatIcon', label: 'Repeat icon', type: 'icon' },
        { key: 'lyricsIcon', label: 'Lyrics icon', type: 'icon' },
        { key: 'queueIcon', label: 'Up next icon', type: 'icon' }
      ],
      html: function (p) {
        var progress = number(p.progress, 0, 0, 100);
        var validStyles = ['classic', 'vinyl', 'cassette', 'glass', 'equalizer', 'lyrics', 'gradient', 'minimal'];
        var style = validStyles.indexOf(p.style) > -1 ? p.style : 'vinyl';
        var playing = !!p.playing;
        var liked = !!p.liked;
        var playIcon = playing ? (p.pauseIcon || 'pause') : (p.playIcon || 'play_arrow');
        var audioRoute = p.audioRoute || 'Phone Speaker';

        // 1. Art / Central Experience
        var artHtml = '';
        var coverContent = p.coverImage
          ? '<img src="' + esc(p.coverImage) + '" alt="Album art" class="mp-vinyl-img">'
          : S.icon(p.coverIcon || 'headphones', 'mp-vinyl-icon');

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
            '<strong class="mp-cass-title">' + esc(p.title) + '</strong>' +
            '<span class="mp-cass-artist">' + esc(p.artist) + '</span>' +
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
          artHtml = '<div class="mp-rack-eq">' +
            '<div class="mp-vu-row">' +
            '<div class="mp-vu-meter"><span class="mp-vu-tag">CH-L</span><div class="mp-vu-track"><div class="mp-vu-fill' + (playing ? ' live' : '') + '" style="height:' + (playing ? '84%' : '14%') + '"></div></div><small class="mp-vu-db">+4dB</small></div>' +
            '<div class="mp-vu-meter"><span class="mp-vu-tag">CH-R</span><div class="mp-vu-track"><div class="mp-vu-fill' + (playing ? ' live' : '') + '" style="height:' + (playing ? '78%' : '14%') + '"></div></div><small class="mp-vu-db">+2dB</small></div>' +
            '</div>' +
            '<div class="mp-eq-bands">' +
            '<div class="mp-eq-band"><div class="mp-eq-fader"><span style="height:78%"></span></div><span class="mp-eq-lbl">60Hz</span></div>' +
            '<div class="mp-eq-band"><div class="mp-eq-fader"><span style="height:62%"></span></div><span class="mp-eq-lbl">250Hz</span></div>' +
            '<div class="mp-eq-band"><div class="mp-eq-fader"><span style="height:50%"></span></div><span class="mp-eq-lbl">1kHz</span></div>' +
            '<div class="mp-eq-band"><div class="mp-eq-fader"><span style="height:68%"></span></div><span class="mp-eq-lbl">4kHz</span></div>' +
            '<div class="mp-eq-band"><div class="mp-eq-fader"><span style="height:84%"></span></div><span class="mp-eq-lbl">16kHz</span></div>' +
            '</div>' +
            '</div>';
        } else if (style === 'lyrics') {
          var waveBars = [24, 48, 72, 35, 90, 60, 40, 85, 95, 55, 30, 75, 45, 65, 80, 50];
          var waveHtml = waveBars.map(function (h, i) {
            var delay = (i * 0.08).toFixed(2);
            return '<span class="mp-wave-bar' + (playing ? ' animated' : '') + '" style="height:' + h + '%;animation-delay:-' + delay + 's"></span>';
          }).join('');
          var rawLyrics = (p.lyricsText || 'Neon lights reflecting on the wet pavement\nDriving through the empty city midnight mist\nLost inside the echoes of the stereo\nOnly you and me beneath the starlight').split('\n').filter(Boolean);
          var lyricsHtml = rawLyrics.map(function (line, idx) {
            return '<p class="mp-lyric-line' + (idx === 1 ? ' active' : '') + '">' + esc(line.trim()) + '</p>';
          }).join('');
          artHtml = '<div class="mp-waveform">' + waveHtml + '</div>' +
            '<div class="mp-lyrics-box">' + lyricsHtml + '</div>';
        } else {
          var coverInner = p.coverImage
            ? '<img src="' + esc(p.coverImage) + '" alt="Cover" class="mp-art-img">'
            : S.icon(p.coverIcon || 'headphones', 'mp-glyph');
          artHtml = '<div class="mp-art mp-art-' + style + '">' + coverInner +
            '<button type="button" class="mp-fav' + (liked ? ' on' : '') + '" aria-label="' +
            (liked ? 'Remove from favourites' : 'Add to favourites') + '">' +
            S.icon(liked ? (p.likeIcon || 'favorite') : (p.unlikeIcon || 'favorite_border')) + '</button></div>';
        }

        // 2. Modular Sections
        var modularHtml = '';

        // Modular: Hi-Res Audio Quality Badge
        if (p.showQualityBadge === true) {
          modularHtml += '<div class="mp-mod-badge"><span class="mi">verified</span><span>' + esc(p.audioQuality || 'Hi-Res Audio · 24-bit / 96kHz Lossless FLAC') + '</span></div>';
        }

        // Modular: Sleep Timer Bar
        if (p.showSleepTimer) {
          var curTimer = p.sleepTimer || '30m';
          modularHtml += '<div class="mp-mod-bar mp-mod-sleep-bar">' +
            '<div class="mp-mod-head"><span class="mi">timer</span><span>Sleep Timer: <strong>' + esc(curTimer) + '</strong></span></div>' +
            '<div class="mp-mod-chips">' +
            '<button type="button" class="mp-mod-chip' + (curTimer === '15m' ? ' on' : '') + '" data-mp-timer="15m">15m</button>' +
            '<button type="button" class="mp-mod-chip' + (curTimer === '30m' ? ' on' : '') + '" data-mp-timer="30m">30m</button>' +
            '<button type="button" class="mp-mod-chip' + (curTimer === '45m' ? ' on' : '') + '" data-mp-timer="45m">45m</button>' +
            '<button type="button" class="mp-mod-chip' + (curTimer === 'track' ? ' on' : '') + '" data-mp-timer="track">End of track</button>' +
            '<button type="button" class="mp-mod-chip' + (curTimer === 'off' ? ' on' : '') + '" data-mp-timer="off">Off</button>' +
            '</div></div>';
        }

        // Modular: Equalizer & FX
        if (p.showEqualizer && style !== 'equalizer') {
          var curEq = p.eqPreset || 'Bass Boost';
          modularHtml += '<div class="mp-mod-bar mp-mod-eq-bar">' +
            '<div class="mp-mod-head"><span class="mi">equalizer</span><span>Equalizer FX: <strong>' + esc(curEq) + '</strong></span></div>' +
            '<div class="mp-mod-chips">' +
            '<button type="button" class="mp-mod-chip' + (curEq === 'Bass Boost' ? ' on' : '') + '" data-mp-eq="Bass Boost">Bass Boost</button>' +
            '<button type="button" class="mp-mod-chip' + (curEq === 'Vocal' ? ' on' : '') + '" data-mp-eq="Vocal">Vocal</button>' +
            '<button type="button" class="mp-mod-chip' + (curEq === 'Electronic' ? ' on' : '') + '" data-mp-eq="Electronic">Electronic</button>' +
            '<button type="button" class="mp-mod-chip' + (curEq === 'Acoustic' ? ' on' : '') + '" data-mp-eq="Acoustic">Acoustic</button>' +
            '<button type="button" class="mp-mod-chip' + (curEq === 'Flat' ? ' on' : '') + '" data-mp-eq="Flat">Flat</button>' +
            '</div></div>';
        }

        // Modular: Speed & Volume
        if (p.showSpeedVolume) {
          var curSpeed = p.playbackSpeed || '1.0x';
          var curVol = p.volume || 80;
          modularHtml += '<div class="mp-mod-speed-vol">' +
            '<button type="button" class="mp-mod-chip mp-speed-btn" data-mp-speed="cycle" title="Change speed"><span class="mi">speed</span><span>' + esc(curSpeed) + '</span></button>' +
            '<div class="mp-vol-row"><span class="mi">volume_up</span><div class="mp-vol-track"><span class="mp-vol-fill" style="width:' + curVol + '%"></span></div><span class="mp-vol-num">' + curVol + '%</span></div>' +
            '</div>';
        }

        // Modular: Download Options & Selectable Quality Cards
        if (p.showDownloadOptions) {
          var dlQuality = p.downloadQuality || 'lossless';
          var dlStorage = p.downloadStorage || 'internal';
          var dlStatus = p.downloadStatus || 'downloaded';
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

          modularHtml += '<div class="mp-mod-bar mp-mod-dl-bar">' +
            '<div class="mp-mod-head"><span class="mi">download_for_offline</span><span>Download Options: <strong>' + esc(qLabels[dlQuality] || dlQuality) + '</strong></span>' + statusBadge + '</div>' +
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
            '</div></div>';
        }

        // Modular: Up Next Queue Drawer
        if (p.showQueue) {
          modularHtml += '<div class="mp-queue-preview">' +
            '<div class="mp-qp-head"><span class="mi">queue_music</span><span>Up Next (3 Tracks)</span></div>' +
            '<div class="mp-qp-item is-active"><span class="mp-qp-idx">1</span><div class="mp-qp-meta"><strong>City Lights</strong><small>Nova Lane · 3:24</small></div><span class="mi mp-qp-play">play_arrow</span></div>' +
            '<div class="mp-qp-item"><span class="mp-qp-idx">2</span><div class="mp-qp-meta"><strong>Sunset Boulevard</strong><small>The Midnight · 4:02</small></div><span class="mi mp-qp-play">play_arrow</span></div>' +
            '<div class="mp-qp-item"><span class="mp-qp-idx">3</span><div class="mp-qp-meta"><strong>Golden Horizon</strong><small>Vela · 3:45</small></div><span class="mi mp-qp-play">play_arrow</span></div>' +
            '</div>';
        }

        return '<div class="music-player mp-' + style + '">' +
          '<div class="mp-route-strip"><span class="mi">speaker_group</span><span data-edit="audioRoute">' + esc(audioRoute) + '</span></div>' +
          artHtml +
          '<div class="mp-meta"><span class="mp-kicker">NOW PLAYING · ' + esc(style.toUpperCase()) + '</span>' +
          '<h3 data-edit="title">' + esc(p.title) + '</h3>' +
          '<p><span data-edit="artist">' + esc(p.artist) + '</span> · <span data-edit="album">' +
          esc(p.album) + '</span></p></div>' +
          '<div class="mp-progress"><div class="mp-bar"><span style="width:' + progress + '%"></span></div>' +
          '<div class="mp-times"><span data-edit="elapsed">' + esc(p.elapsed) + '</span>' +
          '<span data-edit="duration">' + esc(p.duration) + '</span></div></div>' +
          '<div class="mp-controls">' +
          '<button type="button" class="mp-btn" aria-label="Shuffle">' + S.icon(p.shuffleIcon || 'shuffle') + '</button>' +
          '<button type="button" class="mp-btn" aria-label="Previous track">' + S.icon(p.previousIcon || 'skip_previous') + '</button>' +
          '<button type="button" class="mp-play" aria-label="' + (playing ? 'Pause' : 'Play') + '">' +
          S.icon(playIcon) + '</button>' +
          '<button type="button" class="mp-btn" aria-label="Next track">' + S.icon(p.nextIcon || 'skip_next') + '</button>' +
          '<button type="button" class="mp-btn" aria-label="Repeat">' + S.icon(p.repeatIcon || 'repeat') + '</button>' +
          '</div>' +
          modularHtml +
          '<div class="mp-foot">' +
          '<button type="button" class="mp-text" data-ui-player-lyrics="1">' + S.icon(p.lyricsIcon || 'lyrics') + '<span>Lyrics</span></button>' +
          '<button type="button" class="mp-text" data-ui-player-queue="1">' + S.icon(p.queueIcon || 'queue_music') + '<span>Up next</span></button>' +
          '</div></div>';
      }
    },

    /* ---------------------------- download options card ---------------------------- */

    downloadcard: {
      label: 'Download options card',
      group: 'Music',
      icon: 'download_for_offline',
      targets: ['app', 'web'],
      defaults: {
        title: 'Midnight Drive · Offline Audio',
        subtitle: 'Nova Lane · 12 Tracks · Neon Hours',
        quality: 'lossless',
        storage: 'internal',
        withLyrics: true,
        withArtwork: true,
        withDolby: false,
        status: 'downloaded',
        storageUsed: '28.4 GB',
        storageFree: '99.6 GB'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'quality', label: 'Selected Audio Quality', type: 'select', options: [
          ['lossless', 'Hi-Res Lossless (FLAC 24-bit/96kHz · ~48.2 MB)'],
          ['high', 'High Quality (320 kbps MP3 · ~11.4 MB)'],
          ['standard', 'Standard Quality (256 kbps AAC · ~7.8 MB)'],
          ['saver', 'Data Saver (96 kbps Opus · ~3.1 MB)']
        ] },
        { key: 'storage', label: 'Storage Destination', type: 'select', options: [
          ['internal', 'Internal Phone Storage (45GB Free)'],
          ['sdcard', 'External MicroSD Card (112GB Free)']
        ] },
        { key: 'withLyrics', label: 'Download Synced Lyrics (.lrc)', type: 'toggle' },
        { key: 'withArtwork', label: 'Embed High-Res Cover Art', type: 'toggle' },
        { key: 'withDolby', label: 'Dolby Atmos Spatial Stems', type: 'toggle' },
        { key: 'status', label: 'Download Status', type: 'select', options: [
          ['downloaded', 'Downloaded (Offline Ready)'],
          ['downloading', 'Downloading (In Progress)'],
          ['idle', 'Not Downloaded']
        ] }
      ],
      html: function (p) {
        var quality = p.quality || 'lossless';
        var storage = p.storage || 'internal';
        var status = p.status || 'downloaded';
        var withLyrics = p.withLyrics !== false;
        var withArtwork = p.withArtwork !== false;
        var withDolby = !!p.withDolby;

        var statusMarkup = status === 'downloaded'
          ? '<span class="dlc-badge is-done"><span class="mi">offline_pin</span> Saved Offline</span>'
          : (status === 'downloading'
            ? '<span class="dlc-badge is-active"><span class="mi">sync</span> Downloading (72%)</span>'
            : '<span class="dlc-badge"><span class="mi">cloud_download</span> Ready</span>');

        return '<div class="download-card">' +
          '<div class="dlc-header">' +
          '<div class="dlc-art"><span class="mi">music_note</span></div>' +
          '<div class="dlc-info">' +
          '<strong class="dlc-title" data-edit="title">' + esc(p.title || 'Album Download') + '</strong>' +
          '<span class="dlc-sub" data-edit="subtitle">' + esc(p.subtitle || 'Nova Lane · 12 Tracks') + '</span>' +
          '</div>' +
          statusMarkup +
          '</div>' +

          '<div class="dlc-storage-bar">' +
          '<div class="dlc-storage-labels"><span>Device Storage: <strong>' + esc(p.storageUsed || '28.4 GB') + '</strong> used</span><span><strong>' + esc(p.storageFree || '99.6 GB') + '</strong> free</span></div>' +
          '<div class="dlc-storage-meter"><span class="dlc-sm-fill" style="width:28%"></span></div>' +
          '</div>' +

          '<div class="dlc-sect-label"><span>SELECT AUDIO QUALITY:</span></div>' +
          '<div class="dlc-options-grid">' +
          '<button type="button" class="dlc-opt-card' + (quality === 'lossless' ? ' is-selected' : '') + '" data-dlc-quality="lossless">' +
          '<div class="dlc-opt-radio"><span class="mi">' + (quality === 'lossless' ? 'radio_button_checked' : 'radio_button_unchecked') + '</span></div>' +
          '<div class="dlc-opt-meta">' +
          '<div class="dlc-opt-top"><strong>Hi-Res Lossless FLAC</strong><span class="dlc-opt-size">~48.2 MB</span></div>' +
          '<small>24-bit / 96kHz Studio Master bit-perfect fidelity</small>' +
          '</div>' +
          '</button>' +

          '<button type="button" class="dlc-opt-card' + (quality === 'high' ? ' is-selected' : '') + '" data-dlc-quality="high">' +
          '<div class="dlc-opt-radio"><span class="mi">' + (quality === 'high' ? 'radio_button_checked' : 'radio_button_unchecked') + '</span></div>' +
          '<div class="dlc-opt-meta">' +
          '<div class="dlc-opt-top"><strong>High Quality MP3</strong><span class="dlc-opt-size">~11.4 MB</span></div>' +
          '<small>320 kbps CBR crisp dynamic range for all devices</small>' +
          '</div>' +
          '</button>' +

          '<button type="button" class="dlc-opt-card' + (quality === 'standard' ? ' is-selected' : '') + '" data-dlc-quality="standard">' +
          '<div class="dlc-opt-radio"><span class="mi">' + (quality === 'standard' ? 'radio_button_checked' : 'radio_button_unchecked') + '</span></div>' +
          '<div class="dlc-opt-meta">' +
          '<div class="dlc-opt-top"><strong>Standard AAC</strong><span class="dlc-opt-size">~7.8 MB</span></div>' +
          '<small>256 kbps optimized for mobile data & Bluetooth</small>' +
          '</div>' +
          '</button>' +

          '<button type="button" class="dlc-opt-card' + (quality === 'saver' ? ' is-selected' : '') + '" data-dlc-quality="saver">' +
          '<div class="dlc-opt-radio"><span class="mi">' + (quality === 'saver' ? 'radio_button_checked' : 'radio_button_unchecked') + '</span></div>' +
          '<div class="dlc-opt-meta">' +
          '<div class="dlc-opt-top"><strong>Data Saver Opus</strong><span class="dlc-opt-size">~3.1 MB</span></div>' +
          '<small>96 kbps lightweight streaming and compact storage</small>' +
          '</div>' +
          '</button>' +
          '</div>' +

          '<div class="dlc-sect-label" style="margin-top:10px"><span>DOWNLOAD EXTRAS & STORAGE:</span></div>' +
          '<div class="dlc-extras-list">' +
          '<div class="dlc-extra-row" data-dlc-toggle="lyrics"><span class="mi dlc-chk">' + (withLyrics ? 'check_box' : 'check_box_outline_blank') + '</span><span>Download Synced Lyrics (.lrc file)</span></div>' +
          '<div class="dlc-extra-row" data-dlc-toggle="artwork"><span class="mi dlc-chk">' + (withArtwork ? 'check_box' : 'check_box_outline_blank') + '</span><span>Download High-Res 3000x3000px Album Art</span></div>' +
          '<div class="dlc-extra-row" data-dlc-toggle="dolby"><span class="mi dlc-chk">' + (withDolby ? 'check_box' : 'check_box_outline_blank') + '</span><span>Dolby Atmos Multi-channel Spatial Stems</span></div>' +
          '</div>' +

          '<div class="dlc-footer">' +
          '<div class="dlc-storage-chips">' +
          '<button type="button" class="dlc-stor-chip' + (storage === 'internal' ? ' is-active' : '') + '" data-dlc-storage="internal"><span class="mi">smartphone</span>Internal Storage</button>' +
          '<button type="button" class="dlc-stor-chip' + (storage === 'sdcard' ? ' is-active' : '') + '" data-dlc-storage="sdcard"><span class="mi">sd_card</span>SD Card</button>' +
          '</div>' +
          '<button type="button" class="dlc-main-btn' + (status === 'downloaded' ? ' is-done' : '') + '" data-dlc-action="download">' +
          '<span class="mi">' + (status === 'downloaded' ? 'offline_pin' : 'download') + '</span>' +
          '<span>' + (status === 'downloaded' ? 'Downloaded (Offline Ready)' : 'Download Selected') + '</span>' +
          '</button>' +
          '</div>' +
          '</div>';
      }
    },

    /* ---------------------------- play music card ---------------------------- */

    playcard: {
      label: 'Play music card',
      group: 'Music',
      icon: 'play_circle_filled',
      targets: ['app', 'web'],
      defaults: {
        layout: 'spotlight',
        title: 'Neon Hours (Deluxe Edition)',
        artist: 'Nova Lane',
        genre: 'Synthwave · Electronic · 2026',
        trackCount: '12 Tracks · 48 Mins',
        badge: 'FEATURED ALBUM',
        playing: false,
        liked: true,
        coverIcon: 'album',
        coverImage: ''
      },
      fields: [
        { key: 'layout', label: 'Card Layout', type: 'select', options: [
          ['spotlight', 'Album Spotlight Hero (Grand Cover)'],
          ['glass', 'Frosted Glass Neumorphic Hero'],
          ['vinyl', 'Vinyl Sleeve Display'],
          ['compact', 'Compact Play Card']
        ] },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'artist', label: 'Artist', type: 'text' },
        { key: 'genre', label: 'Genre & Year', type: 'text' },
        { key: 'trackCount', label: 'Track count & duration', type: 'text' },
        { key: 'badge', label: 'Kicker Badge', type: 'text' },
        { key: 'playing', label: 'Currently Playing', type: 'toggle' },
        { key: 'liked', label: 'Liked / In Library', type: 'toggle' },
        { key: 'coverIcon', label: 'Cover Icon', type: 'icon' },
        { key: 'coverImage', label: 'Cover Image URL', type: 'text' }
      ],
      html: function (p) {
        var layout = p.layout || 'spotlight';
        var playing = !!p.playing;
        var liked = p.liked !== false;
        var coverImg = p.coverImage
          ? '<img src="' + esc(p.coverImage) + '" alt="Cover" class="plc-art-img">'
          : S.icon(p.coverIcon || 'album', 'plc-art-glyph');

        return '<div class="play-card plc-' + layout + '">' +
          '<div class="plc-backdrop"></div>' +
          '<div class="plc-content">' +
          '<div class="plc-art-wrap">' +
          '<div class="plc-art">' + coverImg + '</div>' +
          (layout === 'vinyl' ? '<div class="plc-vinyl-disc' + (playing ? ' spinning' : '') + '"></div>' : '') +
          '</div>' +
          '<div class="plc-meta">' +
          (p.badge ? '<span class="plc-badge" data-edit="badge">' + esc(p.badge) + '</span>' : '') +
          '<h3 class="plc-title" data-edit="title">' + esc(p.title || 'Neon Hours') + '</h3>' +
          '<p class="plc-artist" data-edit="artist">' + esc(p.artist || 'Nova Lane') + '</p>' +
          '<div class="plc-tags">' +
          '<span>' + esc(p.genre || 'Electronic') + '</span>' +
          '<span>·</span>' +
          '<span>' + esc(p.trackCount || '12 Tracks') + '</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="plc-actions">' +
          '<button type="button" class="plc-play-fab' + (playing ? ' is-playing' : '') + '" data-playcard-action="play" aria-label="' + (playing ? 'Pause' : 'Play') + '">' +
          S.icon(playing ? 'pause' : 'play_arrow') +
          '</button>' +
          '<button type="button" class="plc-btn" data-playcard-action="shuffle" title="Shuffle Album">' + S.icon('shuffle') + '<span>Shuffle</span></button>' +
          '<button type="button" class="plc-btn icon-only' + (liked ? ' is-liked' : '') + '" data-playcard-action="like" title="Add to Library">' + S.icon(liked ? 'favorite' : 'favorite_border') + '</button>' +
          '<button type="button" class="plc-btn icon-only" data-playcard-action="download" title="Download Options">' + S.icon('download_for_offline') + '</button>' +
          '<button type="button" class="plc-btn icon-only" data-playcard-action="more" title="More Options">' + S.icon('more_vert') + '</button>' +
          '</div>' +
          '</div>';
      }
    },

    /* ---------------------------- music listing ---------------------------- */

    musiclisting: {
      label: 'Music listing',
      group: 'Music',
      icon: 'format_list_numbered',
      targets: ['app', 'web'],
      defaults: {
        title: 'Top Tracks',
        kicker: 'POPULAR THIS WEEK',
        viewMode: 'songs',
        activeTrack: 0,
        layout: 'numbered',
        showTabs: true,
        items: 'Midnight Drive | Nova Lane | 3:42 | headphones | Hi-Res | 1.8M\nPaper Planes | Kite Club | 2:58 | flight | Lossless | 940K\nLow Orbit | Nia Sol | 4:06 | public | Dolby | 1.2M\nAfter Rain | Vela | 3:21 | water_drop | Hi-Res | 720K\nStatic Bloom | Milo Fenn | 2:44 | graphic_eq | Lossless | 650K\nGolden Hour | Nia Sol | 3:15 | wb_sunny | Hi-Res | 1.5M',
        albumItems: 'Midnight City | Nova Lane | 2024 | 12 tracks | album | Synthwave\nElectric Dreams | Kite Club | 2023 | 9 tracks | library_music | Indie Pop\nDeep Space Vol. 1 | Nia Sol | 2024 | 14 tracks | audiotrack | Ambient Lo-Fi\nNeon Horizons | Milo Fenn | 2023 | 10 tracks | album | Cyberpunk\nSunset Echoes | Vela | 2024 | 11 tracks | music_note | Chillout\nVelvet Moon | The Resonance | 2022 | 8 tracks | queue_music | Neo Soul',
        artistItems: 'Nova Lane | 2.4M monthly listeners | 840K followers | person | true | Midnight Drive\nNia Sol | 1.8M monthly listeners | 620K followers | face | true | Low Orbit\nKite Club | 950K monthly listeners | 310K followers | group | true | Paper Planes\nMilo Fenn | 1.2M monthly listeners | 450K followers | record_voice_over | false | Static Bloom\nVela | 820K monthly listeners | 290K followers | face_3 | true | After Rain\nThe Resonance | 640K monthly listeners | 180K followers | groups | false | Velvet Echo',
        beatItems: 'Cyber Wave 128 | Milo Fenn | 128 BPM | F# Minor | 2:45 | Free DL / $29 Lease | 45,70,30,85,95,60,40,75,90,55,80,35\nMidnight Bounce | Nova Lane | 140 BPM | C Major | 3:10 | Free DL / $39 Lease | 60,80,95,40,70,85,60,90,75,45,65,80\nDreamcatcher Lo-Fi | Nia Sol | 85 BPM | Eb Minor | 2:20 | Free DL / $25 Lease | 30,50,45,70,80,60,50,75,65,40,55,45\nDrill Pressure | Kite Club | 144 BPM | G Minor | 2:50 | $35 Lease / Stems | 80,95,65,90,85,100,70,90,80,60,85,95\nSunset Drift | Vela | 110 BPM | A Major | 3:15 | Free DL / $20 Lease | 50,65,75,60,80,70,85,65,75,55,70,60'
      },
      fields: [
        { key: 'title', label: 'Listing Title', type: 'text' },
        { key: 'kicker', label: 'Kicker Badge', type: 'text' },
        { key: 'viewMode', label: 'Listing Category View', type: 'select', options: [
          ['songs', '1. Songs / Tracks (EQ Waves & Badges)'],
          ['albums', '2. Albums (Vinyl Record Sleeves Grid)'],
          ['artists', '3. Artists (Circular Profiles & Follow)'],
          ['beats', '4. Beats / Audio (Waveforms & BPM Keys)']
        ] },
        { key: 'showTabs', label: 'Show Category View Switcher Tabs', type: 'toggle' },
        { key: 'activeTrack', label: 'Currently Playing Track Index', type: 'number', min: 0, max: 20 },
        { key: 'layout', label: 'Song Listing Style', type: 'select', options: [
          ['numbered', 'Numbered Tracklist with EQ Waves'],
          ['compact', 'Compact Dense List'],
          ['card', 'Rounded Card Rows']
        ] },
        { key: 'items', label: 'Tracks (Title | Artist | Duration | Icon | Badge | Plays)', type: 'textarea' },
        { key: 'albumItems', label: 'Albums (Title | Artist | Year | Tracks | Icon | Genre)', type: 'textarea' },
        { key: 'artistItems', label: 'Artists (Name | Listeners | Followers | Icon | Verified | TopTrack)', type: 'textarea' },
        { key: 'beatItems', label: 'Beats (Title | Producer | BPM | Key | Duration | License | Waveform)', type: 'textarea' }
      ],
      html: function (p) {
        var viewMode = p.viewMode || 'songs';
        var activeIdx = Number(p.activeTrack) || 0;
        var layout = p.layout || 'numbered';

        // Render header
        var toolBtn = '';
        if (viewMode === 'songs') {
          toolBtn = '<button type="button" class="ml-shuffle-all-btn" data-listing-action="shuffle-all"><span class="mi">shuffle</span><span>Shuffle All</span></button>';
        } else if (viewMode === 'albums') {
          toolBtn = '<button type="button" class="ml-shuffle-all-btn" data-listing-action="album-play-all"><span class="mi">play_arrow</span><span>Play Top</span></button>';
        } else if (viewMode === 'artists') {
          toolBtn = '<button type="button" class="ml-shuffle-all-btn" data-listing-action="artist-radio"><span class="mi">radio</span><span>Artist Radio</span></button>';
        } else {
          toolBtn = '<button type="button" class="ml-shuffle-all-btn" data-listing-action="beats-browse"><span class="mi">tune</span><span>BPM Filter</span></button>';
        }

        var headerHtml = '<div class="ml-header">' +
          '<div class="ml-head-left">' +
          (p.kicker ? '<span class="ml-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' : '') +
          '<h3 class="ml-head-title" data-edit="title">' + esc(p.title || (viewMode === 'albums' ? 'Albums' : viewMode === 'artists' ? 'Artists' : viewMode === 'beats' ? 'Audio & Beats' : 'Top Tracks')) + '</h3>' +
          '</div>' +
          '<div class="ml-head-tools">' + toolBtn + '</div>' +
          '</div>';

        // View tabs
        var tabsHtml = '';
        if (p.showTabs !== false) {
          tabsHtml = '<div class="ml-view-tabs" role="tablist">' +
            '<button type="button" class="ml-vtab' + (viewMode === 'songs' ? ' is-active' : '') + '" data-ml-view="songs"><span class="mi">music_note</span><span>Songs</span></button>' +
            '<button type="button" class="ml-vtab' + (viewMode === 'albums' ? ' is-active' : '') + '" data-ml-view="albums"><span class="mi">album</span><span>Albums</span></button>' +
            '<button type="button" class="ml-vtab' + (viewMode === 'artists' ? ' is-active' : '') + '" data-ml-view="artists"><span class="mi">person</span><span>Artists</span></button>' +
            '<button type="button" class="ml-vtab' + (viewMode === 'beats' ? ' is-active' : '') + '" data-ml-view="beats"><span class="mi">graphic_eq</span><span>Beats</span></button>' +
            '</div>';
        }

        // Body content
        var bodyHtml = '';

        if (viewMode === 'albums') {
          var albumList = lines(p.albumItems || p.items || '').map(function (line, idx) {
            var pt = parts(line);
            var title = pt[0] || 'Untitled Album';
            var artist = pt[1] || 'Unknown Artist';
            var year = pt[2] || '2024';
            var tracks = pt[3] || '10 tracks';
            var icon = pt[4] || 'album';
            var genre = pt[5] || 'Music';
            var coverGradients = [
              'linear-gradient(145deg, var(--md-primary) 0%, var(--md-tertiary) 100%)',
              'linear-gradient(145deg, var(--md-tertiary) 0%, var(--md-primary) 100%)',
              'linear-gradient(145deg, color-mix(in srgb, var(--md-primary) 54%, var(--md-surface-container-high)) 0%, var(--md-primary) 100%)',
              'linear-gradient(145deg, color-mix(in srgb, var(--md-tertiary) 58%, var(--md-surface-container-high)) 0%, var(--md-tertiary) 100%)',
              'linear-gradient(145deg, var(--md-primary) 0%, var(--md-primary-container) 100%)',
              'linear-gradient(145deg, var(--md-tertiary) 0%, var(--md-surface-container-high) 100%)'
            ];
            var grad = coverGradients[idx % coverGradients.length];

            return '<div class="ml-album-card" data-listing-album="' + idx + '">' +
              '<div class="ml-album-cover-wrap">' +
              '<div class="ml-album-vinyl"></div>' +
              '<div class="ml-album-art" style="background:' + grad + '">' +
              S.icon(icon) +
              '</div>' +
              '<button type="button" class="ml-album-play-fab" data-listing-album-play="' + idx + '" title="Play ' + esc(title) + '">' +
              '<span class="mi">play_arrow</span>' +
              '</button>' +
              '</div>' +
              '<div class="ml-album-info">' +
              '<strong class="ml-album-title">' + esc(title) + '</strong>' +
              '<span class="ml-album-artist">' + esc(artist) + '</span>' +
              '<div class="ml-album-sub">' +
              '<span class="ml-album-year">' + esc(year) + '</span>' +
              '<span class="ml-album-dot">·</span>' +
              '<span class="ml-album-tracks">' + esc(tracks) + '</span>' +
              (genre ? '<span class="ml-genre-badge">' + esc(genre) + '</span>' : '') +
              '</div>' +
              '</div>' +
              '<div class="ml-album-actions">' +
              '<button type="button" class="ml-act-btn' + (idx % 2 === 0 ? ' is-liked' : '') + '" data-listing-like-album="' + idx + '" title="Save to library">' + S.icon(idx % 2 === 0 ? 'favorite' : 'favorite_border') + '</button>' +
              '<button type="button" class="ml-act-btn is-downloaded" data-listing-dl-album="' + idx + '" title="Download album">' + S.icon('offline_pin') + '</button>' +
              '</div>' +
              '</div>';
          }).join('');

          bodyHtml = '<div class="ml-albums-grid">' + albumList + '</div>';

        } else if (viewMode === 'artists') {
          var artistList = lines(p.artistItems || p.items || '').map(function (line, idx) {
            var pt = parts(line);
            var name = pt[0] || 'Unknown Artist';
            var listeners = pt[1] || '1.2M monthly listeners';
            var followers = pt[2] || '450K followers';
            var icon = pt[3] || 'person';
            var verified = String(pt[4] || 'true').trim() === 'true';
            var topTrack = pt[5] || '';
            var isFollowing = idx % 2 === 0;

            return '<div class="ml-artist-row" data-listing-artist="' + idx + '">' +
              '<div class="ml-artist-avatar-wrap">' +
              '<div class="ml-artist-avatar">' + S.icon(icon) + '</div>' +
              (verified ? '<span class="ml-artist-badge" title="Verified Artist"><span class="mi">verified</span></span>' : '') +
              '</div>' +
              '<div class="ml-artist-info">' +
              '<div class="ml-artist-name-row">' +
              '<strong class="ml-artist-name">' + esc(name) + '</strong>' +
              (verified ? '<span class="ml-verified-chip">Verified</span>' : '') +
              '</div>' +
              '<span class="ml-artist-listeners">' + esc(listeners) + ' · ' + esc(followers) + '</span>' +
              (topTrack ? '<span class="ml-artist-top-track"><span class="mi">audiotrack</span> Popular: "' + esc(topTrack) + '"</span>' : '') +
              '</div>' +
              '<div class="ml-artist-actions">' +
              '<button type="button" class="ml-follow-btn' + (isFollowing ? ' is-following' : '') + '" data-listing-follow="' + idx + '">' +
              '<span class="mi">' + (isFollowing ? 'check' : 'add') + '</span>' +
              '<span>' + (isFollowing ? 'Following' : 'Follow') + '</span>' +
              '</button>' +
              '<button type="button" class="ml-act-btn" data-listing-artist-more="' + idx + '" title="More">' + S.icon('more_vert') + '</button>' +
              '</div>' +
              '</div>';
          }).join('');

          bodyHtml = '<div class="ml-artists-list">' + artistList + '</div>';

        } else if (viewMode === 'beats') {
          var beatList = lines(p.beatItems || p.items || '').map(function (line, idx) {
            var pt = parts(line);
            var title = pt[0] || 'Untitled Beat';
            var producer = pt[1] || 'Producer';
            var bpm = pt[2] || '120 BPM';
            var key = pt[3] || 'C Minor';
            var dur = pt[4] || '3:00';
            var license = pt[5] || 'Free DL / $29 Lease';
            var rawBars = pt[6] || '40,65,85,30,70,95,50,80,60,90,75,40,60,85';
            var barHeights = rawBars.split(',').map(function (h) { return Math.max(15, Math.min(100, Number(h.trim()) || 40)); });

            var waveBars = barHeights.map(function (h, bi) {
              var isPassed = bi < Math.floor(barHeights.length * 0.4);
              return '<span class="ml-beat-wave-bar' + (isPassed ? ' is-passed' : '') + '" style="height:' + h + '%"></span>';
            }).join('');

            return '<div class="ml-beat-card" data-listing-beat="' + idx + '">' +
              '<div class="ml-beat-head">' +
              '<div class="ml-beat-cover">' +
              '<span class="mi">graphic_eq</span>' +
              '<button type="button" class="ml-beat-play-btn" data-listing-beat-play="' + idx + '" title="Preview beat">' +
              '<span class="mi">play_arrow</span>' +
              '</button>' +
              '</div>' +
              '<div class="ml-beat-meta">' +
              '<div class="ml-beat-title-row"><strong class="ml-beat-title">' + esc(title) + '</strong></div>' +
              '<span class="ml-beat-prod">Prod. ' + esc(producer) + '</span>' +
              '<div class="ml-beat-chips">' +
              '<span class="ml-chip ml-chip-bpm"><span class="mi">speed</span>' + esc(bpm) + '</span>' +
              '<span class="ml-chip ml-chip-key"><span class="mi">music_note</span>' + esc(key) + '</span>' +
              '<span class="ml-chip ml-chip-dur"><span class="mi">schedule</span>' + esc(dur) + '</span>' +
              '</div>' +
              '</div>' +
              '<div class="ml-beat-price-col">' +
              '<span class="ml-beat-license">' + esc(license) + '</span>' +
              '<button type="button" class="ml-beat-buy-btn" data-listing-beat-dl="' + idx + '"><span class="mi">shopping_bag</span><span>License</span></button>' +
              '</div>' +
              '</div>' +
              '<div class="ml-beat-waveform">' + waveBars + '</div>' +
              '</div>';
          }).join('');

          bodyHtml = '<div class="ml-beats-list">' + beatList + '</div>';

        } else {
          // Default: songs tracklist
          var trackRows = lines(p.items).map(function (line, idx) {
            var pt = parts(line);
            var title = pt[0] || 'Untitled Track';
            var artist = pt[1] || 'Unknown Artist';
            var dur = pt[2] || '3:30';
            var icon = pt[3] || 'music_note';
            var badge = pt[4] || 'Hi-Res';
            var plays = pt[5] || '';
            var isActive = idx === activeIdx;

            var lead = isActive
              ? '<div class="ml-eq-wave" title="Playing"><i></i><i></i><i></i></div>'
              : '<span class="ml-idx">' + pad2(idx + 1) + '</span>';

            return '<div class="ml-row' + (isActive ? ' is-active' : '') + '" data-listing-track="' + idx + '">' +
              lead +
              '<div class="ml-thumb">' + S.icon(icon) + '<span class="mi ml-hover-play">play_arrow</span></div>' +
              '<div class="ml-meta">' +
              '<div class="ml-title-row"><strong class="ml-title">' + esc(title) + '</strong>' +
              (badge ? '<span class="ml-badge">' + esc(badge) + '</span>' : '') + '</div>' +
              '<span class="ml-artist">' + esc(artist) + (plays ? ' · ' + esc(plays) + ' plays' : '') + '</span>' +
              '</div>' +
              '<span class="ml-dur">' + esc(dur) + '</span>' +
              '<div class="ml-actions">' +
              '<button type="button" class="ml-act-btn' + (idx % 2 === 0 ? ' is-liked' : '') + '" data-listing-like="' + idx + '" title="Like track">' + S.icon(idx % 2 === 0 ? 'favorite' : 'favorite_border') + '</button>' +
              '<button type="button" class="ml-act-btn is-downloaded" data-listing-dl="' + idx + '" title="Offline Download Options">' + S.icon('offline_pin') + '</button>' +
              '<button type="button" class="ml-act-btn" data-listing-more="' + idx + '" title="More Options">' + S.icon('more_vert') + '</button>' +
              '</div>' +
              '</div>';
          }).join('');

          bodyHtml = '<div class="ml-rows">' + trackRows + '</div>';
        }

        return '<div class="music-listing ml-view-' + esc(viewMode) + ' ml-' + layout + '">' +
          headerHtml +
          tabsHtml +
          bodyHtml +
          '</div>';
      }
    },

    /* ---------------------------- shuffle music & radio ---------------------------- */

    shuffleradio: {
      label: 'Shuffle & Radio',
      group: 'Music',
      icon: 'shuffle',
      targets: ['app', 'web'],
      defaults: {
        title: 'Smart Shuffle & Radio',
        subtitle: '148 Songs · 8 hr 24 min',
        activeMode: 'smart',
        playing: true,
        currentTrack: 'Midnight Drive · Nova Lane',
        queuedTracks: 'Paper Planes · Kite Club | Low Orbit · Nia Sol | After Rain · Vela'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'activeMode', label: 'Shuffle Mode', type: 'select', options: [
          ['smart', 'Smart AI Shuffle (Listening Flow)'],
          ['mood', 'Mood & Energy Match (BPM Synced)'],
          ['artist', 'Artist Radio & Deep Cuts'],
          ['random', 'True Pure Random (No Bias)']
        ] },
        { key: 'currentTrack', label: 'Now Playing Track', type: 'text' },
        { key: 'queuedTracks', label: 'Up Next Queue (Track 1 | Track 2 | Track 3)', type: 'text' },
        { key: 'playing', label: 'Playing', type: 'toggle' }
      ],
      html: function (p) {
        var mode = p.activeMode || 'smart';
        var modes = [
          { id: 'smart', label: 'Smart AI', icon: 'auto_awesome' },
          { id: 'mood', label: 'Mood Flow', icon: 'waves' },
          { id: 'artist', label: 'Artist Radio', icon: 'radio' },
          { id: 'random', label: 'True Random', icon: 'shuffle' }
        ];

        var modePills = modes.map(function (m) {
          var on = mode === m.id;
          return '<button type="button" class="sfr-mode-pill' + (on ? ' is-active' : '') + '" data-sfr-mode="' + m.id + '">' +
            '<span class="mi">' + m.icon + '</span><span>' + esc(m.label) + '</span>' +
            '</button>';
        }).join('');

        var qItems = String(p.queuedTracks || '').split('|').map(function (it, idx) {
          return '<div class="sfr-qitem"><span class="sfr-qidx">' + (idx + 1) + '</span><span class="sfr-qtitle">' + esc(it.trim()) + '</span><span class="mi sfr-qicon">play_arrow</span></div>';
        }).join('');

        return '<div class="shuffle-radio-card">' +
          '<div class="sfr-glow"></div>' +
          '<div class="sfr-top">' +
          '<div class="sfr-info">' +
          '<div class="sfr-badge"><span class="mi">shuffle</span><span>DISCOVERY SHUFFLE</span></div>' +
          '<h3 class="sfr-title" data-edit="title">' + esc(p.title || 'Smart Shuffle') + '</h3>' +
          '<span class="sfr-sub" data-edit="subtitle">' + esc(p.subtitle || '148 Songs') + '</span>' +
          '</div>' +
          '<button type="button" class="sfr-fab-shuffle" data-shuffle-act="shuffle" title="Tap to Re-Shuffle">' +
          '<span class="mi">shuffle</span>' +
          '</button>' +
          '</div>' +
          '<div class="sfr-modes-row">' + modePills + '</div>' +
          '<div class="sfr-now">' +
          '<div class="sfr-now-label"><span class="mi">volume_up</span><span>Now Playing in Shuffle:</span></div>' +
          '<strong class="sfr-now-track" data-edit="currentTrack">' + esc(p.currentTrack || 'Midnight Drive · Nova Lane') + '</strong>' +
          '</div>' +
          '<div class="sfr-queue">' +
          '<span class="sfr-queue-head"><span class="mi">queue_music</span> Up Next:</span>' +
          '<div class="sfr-queue-list">' + qItems + '</div>' +
          '</div>' +
          '</div>';
      }
    },

    /* ---------------------------- music recommendations ---------------------------- */

    recommendations: {
      label: 'Music recommendations',
      group: 'Music',
      icon: 'auto_awesome',
      targets: ['app', 'web'],
      defaults: {
        kicker: 'MADE FOR YOU',
        title: 'Recommended Mixes & Tracks',
        reason: 'Because you listened to Nova Lane',
        layout: 'rail',
        items: 'City Lights | Nova Lane | 98% Match | Synthwave | headphones\nSunset Echoes | The Midnight | 95% Match | Retro Electronic | album\nNeon Dreams | Gunship | 93% Match | Cyberpunk | graphic_eq\nVelvet Horizon | Timecop1983 | 91% Match | Chillwave | nightlight\nAstral Drift | Tycho | 89% Match | Ambient | public'
      },
      fields: [
        { key: 'kicker', label: 'Kicker Badge', type: 'text' },
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'reason', label: 'Recommendation Reason / Subtitle', type: 'text' },
        { key: 'layout', label: 'Layout Style', type: 'select', options: [
          ['rail', 'Horizontal Scrolling Rail'],
          ['grid', '2-Column Recommendation Grid']
        ] },
        { key: 'items', label: 'Items (Title | Artist | Match % | Genre | Icon)', type: 'textarea' }
      ],
      html: function (p) {
        var layout = p.layout || 'rail';
        var cards = lines(p.items).map(function (line, idx) {
          var pt = parts(line);
          var title = pt[0] || 'Recommended Track';
          var artist = pt[1] || 'Artist';
          var match = pt[2] || '95% Match';
          var genre = pt[3] || 'Music';
          var icon = pt[4] || 'album';

          return '<div class="rec-card">' +
            '<div class="rec-art">' +
            S.icon(icon, 'rec-art-glyph') +
            '<span class="rec-match-pill">' + esc(match) + '</span>' +
            '<button type="button" class="rec-play-btn" data-recom-play="' + idx + '" title="Play Preview ' + esc(title) + '">' + S.icon('play_arrow') + '</button>' +
            '</div>' +
            '<div class="rec-meta">' +
            '<strong class="rec-title">' + esc(title) + '</strong>' +
            '<span class="rec-artist">' + esc(artist) + '</span>' +
            '<div class="rec-foot">' +
            '<span class="rec-genre">' + esc(genre) + '</span>' +
            '<button type="button" class="rec-add-btn" data-recom-add="' + idx + '" title="Add to Library">' + S.icon('add') + '</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        }).join('');

        return '<div class="music-recommendations rec-' + layout + '">' +
          '<div class="rec-header">' +
          '<div class="rec-head-info">' +
          (p.kicker ? '<span class="rec-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' : '') +
          '<h3 class="rec-title" data-edit="title">' + esc(p.title || 'Recommended Tracks') + '</h3>' +
          (p.reason ? '<p class="rec-reason" data-edit="reason"><span class="mi">sparkles</span>' + esc(p.reason) + '</p>' : '') +
          '</div>' +
          '<div class="rec-head-tools">' +
          '<button type="button" class="rec-arrow" data-rec-arrow="prev" title="Scroll left">' + S.icon('chevron_left') + '</button>' +
          '<button type="button" class="rec-arrow" data-rec-arrow="next" title="Scroll right">' + S.icon('chevron_right') + '</button>' +
          '</div>' +
          '</div>' +
          '<div class="rec-rail" role="list">' + cards + '</div>' +
          '</div>';
      }
    },

    /* ---------------------------- music shuffle cards ---------------------------- */

    shufflecards: {
      label: 'Music Shuffle Cards',
      group: 'Music',
      icon: 'grid_view',
      targets: ['app', 'web'],
      defaults: {
        kicker: 'QUICK MIX',
        title: 'Shuffle & Play',
        subtitle: 'Tap any card to mix & play',
        layout: 'grid2x2',
        showTabs: true,
        activeCategory: 'All',
        categories: 'All | Indian | Chill | Focus | Workout | Pop',
        activeCard: 0,
        playing: true,
        // Default 4 cards exactly matching user screenshot!
        items: 'shuffle | Shuffle Play | Tap to mix & play | circle | #2d3748 | #ffffff | icon:shuffle\n' +
               'note | Midnight Drive | Nova Lane | squircle | #e2e8f0 | #1a202c | icon:music_note\n' +
               'note | Kyoto Garden | Zen Echoes | squircle | #e2e8f0 | #1a202c | icon:music_note\n' +
               'note | The Reading Room | Ambient Works | squircle | #e2e8f0 | #1a202c | icon:music_note',
        // Indian category cards
        indianItems: 'shuffle | Shuffle Indian | Bollywood & Desi Chill | circle | #ff6b35 | #ffffff | icon:shuffle\n' +
                     'note | Kesariya | Arijit Singh · Brahmastra | squircle | #ffe8d6 | #6b2d00 | icon:music_note\n' +
                     'note | Raag Yaman | Sitar Classical Meditations | squircle | #ffe8d6 | #6b2d00 | icon:music_note\n' +
                     'note | Brown Munde | AP Dhillon & Gurinder | squircle | #ffe8d6 | #6b2d00 | icon:music_note',
        // Chill category cards
        chillItems: 'shuffle | Shuffle Chill | Ambient & Lofi Waves | circle | #3b82f6 | #ffffff | icon:shuffle\n' +
                    'note | Kyoto Garden | Zen Echoes | squircle | #dbeafe | #1e3a8a | icon:music_note\n' +
                    'note | The Reading Room | Ambient Works | squircle | #dbeafe | #1e3a8a | icon:music_note\n' +
                    'note | Low Orbit | Space Echoes | squircle | #dbeafe | #1e3a8a | icon:music_note',
        // Focus category cards
        focusItems: 'shuffle | Deep Focus Mix | Binaural Beats 40Hz | circle | #10b981 | #ffffff | icon:shuffle\n' +
                    'note | Alpha Waves | Neuro Harmony | squircle | #d1fae5 | #065f46 | icon:graphic_eq\n' +
                    'note | Coffee Shop Rain | Lofi Study Session | squircle | #d1fae5 | #065f46 | icon:music_note\n' +
                    'note | Forest Flow | Nature Soundscapes | squircle | #d1fae5 | #065f46 | icon:forest'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'layout', label: 'Layout Variation', type: 'select', options: [
          ['grid2x2', '1. 4 Square Rounded Cards (2x2 Grid - Screenshot Style)'],
          ['grid3x2', '2. 6 Rounded Cards (3x2 Grid)'],
          ['carousel', '3. Horizontal Scrolling Cards Rail'],
          ['featured', '4. Featured Hero Shuffle + 2 Stacked'],
          ['compact', '5. Compact Rounded Squircles']
        ] },
        { key: 'showTabs', label: 'Show Category Filter Tabs', type: 'toggle' },
        { key: 'activeCategory', label: 'Active Category (e.g. Indian, Chill)', type: 'text' },
        { key: 'categories', label: 'Category Tabs (Separated by |)', type: 'text' },
        { key: 'activeCard', label: 'Currently Playing Card Index', type: 'number', min: 0, max: 10 },
        { key: 'playing', label: 'Playing State', type: 'toggle' },
        { key: 'items', label: 'Default / All Cards (Type | Title | Artist | Shape | BgColor | TextColor | Icon)', type: 'textarea' },
        { key: 'indianItems', label: 'Indian Category Cards', type: 'textarea' },
        { key: 'chillItems', label: 'Chill Category Cards', type: 'textarea' },
        { key: 'focusItems', label: 'Focus Category Cards', type: 'textarea' }
      ],
      html: function (p, block) {
        var layout = p.layout || 'grid2x2';
        var activeCat = p.activeCategory || 'All';
        var activeCardIdx = Number(p.activeCard) || 0;
        var isPlaying = p.playing !== false;

        // Header
        var headerHtml = '';
        if (p.title || p.kicker || p.subtitle) {
          headerHtml = '<div class="sc-header">' +
            '<div class="sc-head-info">' +
            (p.kicker ? '<span class="sc-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' : '') +
            (p.title ? '<h3 class="sc-title" data-edit="title">' + esc(p.title) + '</h3>' : '') +
            (p.subtitle ? '<p class="sc-subtitle" data-edit="subtitle">' + esc(p.subtitle) + '</p>' : '') +
            '</div>' +
            '</div>';
        }

        // Category filter tabs with small rounded boxes
        var tabsHtml = '';
        if (p.showTabs !== false) {
          var catList = (p.categories || 'All | Indian | Chill | Focus | Workout | Pop')
            .split('|')
            .map(function (c) { return c.trim(); })
            .filter(Boolean);

          var tabBtns = catList.map(function (cat) {
            var isActive = (activeCat.toLowerCase() === cat.toLowerCase());
            return '<button type="button" class="sc-tab' + (isActive ? ' is-active' : '') + '" data-sc-cat="' + esc(cat) + '">' +
              esc(cat) +
              '</button>';
          }).join('');

          tabsHtml = '<div class="sc-tabs" role="tablist" aria-label="Music categories">' + tabBtns + '</div>';
        }

        // Select items based on category
        var rawItems = p.items;
        var catLower = activeCat.toLowerCase();
        if (catLower === 'indian' && p.indianItems) {
          rawItems = p.indianItems;
        } else if (catLower === 'chill' && p.chillItems) {
          rawItems = p.chillItems;
        } else if (catLower === 'focus' && p.focusItems) {
          rawItems = p.focusItems;
        }

        var cardLines = lines(rawItems || p.items);
        if (layout === 'grid2x2') {
          cardLines = cardLines.slice(0, 4);
        } else if (layout === 'grid3x2') {
          cardLines = cardLines.slice(0, 6);
        }

        var cardsHtml = cardLines.map(function (line, idx) {
          var pt = parts(line);
          var type = pt[0] || 'note';
          var title = pt[1] || 'Song Title';
          var artist = pt[2] || 'Artist';
          var shape = pt[3] || (type === 'shuffle' ? 'circle' : 'squircle');
          var bg = pt[4] || (type === 'shuffle' ? '#2d3748' : '#e2e8f0');
          var color = pt[5] || (type === 'shuffle' ? '#ffffff' : '#1a202c');
          var iconSpec = pt[6] || (type === 'shuffle' ? 'shuffle' : 'music_note');
          if (iconSpec.indexOf('icon:') === 0) iconSpec = iconSpec.substring(5);

          var isCardActive = (idx === activeCardIdx);
          var badgeStyle = 'background:' + bg + ';color:' + color + ';';

          var liveWave = (isCardActive && isPlaying)
            ? '<span class="sc-live-eq" title="Playing"><i></i><i></i><i></i></span>'
            : '';

          return '<div class="sc-card' + (isCardActive ? ' is-active' : '') + (isCardActive && isPlaying ? ' is-playing' : '') + '" ' +
            'data-sc-card-idx="' + idx + '" ' +
            'data-sc-title="' + esc(title) + '" ' +
            'data-sc-artist="' + esc(artist) + '" ' +
            'data-sc-type="' + esc(type) + '" ' +
            'role="button" tabindex="0" aria-label="Play ' + esc(title) + ' by ' + esc(artist) + '">' +
            '<div class="sc-badge sc-badge-' + esc(shape) + '" style="' + badgeStyle + '">' +
            S.icon(iconSpec, 'sc-badge-icon') +
            liveWave +
            '</div>' +
            '<div class="sc-text">' +
            '<strong class="sc-card-title" data-edit="card-title">' + esc(title) + '</strong>' +
            '<span class="sc-card-artist" data-edit="card-artist">' + esc(artist) + '</span>' +
            '</div>' +
            '</div>';
        }).join('');

        return '<div class="music-shuffle-cards sc-wrap sc-layout-' + esc(layout) + '">' +
          headerHtml +
          tabsHtml +
          '<div class="shuffle-cards-container sc-' + esc(layout) + '">' +
          cardsHtml +
          '</div>' +
          '</div>';
      }
    },

    tracklist: {
      label: 'Track list',
      group: 'Music',
      icon: 'queue_music',
      targets: ['app'],
      defaults: {
        items: 'Midnight Drive | Nova Lane | 3:42\nPaper Planes | Kite Club | 2:58\nLow Orbit | Nia Sol | 4:06\nAfter Rain | Vela | 3:21\nStatic Bloom | Milo Fenn | 2:44',
        active: 0,
        showCover: false
      },
      fields: [
        { key: 'items', label: 'Tracks — one per line: Title | Artist | Duration', type: 'textarea' },
        { key: 'active', label: 'Playing row', type: 'number', min: 0, max: 20 },
        { key: 'showCover', label: 'Show cover art', type: 'toggle' }
      ],
      html: function (p) {
        var active = Number(p.active) || 0;
        var rows = lines(p.items).map(function (line, i) {
          var row = parts(line);
          var on = i === active;
          var lead = p.showCover
            ? '<span class="track-cover">' + S.icon('music_note') + '</span>'
            : '<span class="track-index">' + pad2(i + 1) + '</span>';
          var tail = on
            ? '<span class="track-eq" aria-label="Playing"><i></i><i></i><i></i></span>'
            : '<span class="track-dur">' + esc(row[2] || '') + '</span>';
          return '<div class="track-row' + (on ? ' active' : '') + '">' + lead +
            '<div class="track-info"><div class="track-title">' + esc(row[0] || 'Untitled track') + '</div>' +
            '<div class="track-artist">' + esc(row[1] || 'Unknown artist') + '</div></div>' +
            tail + '</div>';
        }).join('');
        return '<div class="track-list">' + (rows || '<div class="track-empty">Add a few tracks in the inspector.</div>') + '</div>';
      }
    },

    albumgrid: {
      label: 'Album grid',
      group: 'Music',
      icon: 'grid_view',
      targets: ['app'],
      defaults: {
        items: 'Neon Hours | Nova Lane | headphones\nPaper Cities | Kite Club | album\nGolden Hour | Nia Sol | wb_sunny\nSlow Motion | Vela | graphic_eq',
        columns: '2'
      },
      fields: [
        { key: 'items', label: 'Albums — one per line: Title | Artist | Icon', type: 'textarea' },
        { key: 'columns', label: 'Columns', type: 'select', options: [['2', '2 columns'], ['3', '3 columns']] }
      ],
      html: function (p) {
        var cols = String(p.columns) === '3' ? ' cols-3' : '';
        var cards = lines(p.items).map(function (line) {
          var row = parts(line);
          return '<div class="album-card">' +
            '<div class="album-art">' + S.icon(row[2] || 'album', 'album-glyph') +
            '<button type="button" class="album-play" aria-label="Play ' + esc(row[0] || 'album') + '">' +
            S.icon('play_arrow') + '</button></div>' +
            '<div class="album-name">' + esc(row[0] || 'Untitled') + '</div>' +
            '<div class="album-artist">' + esc(row[1] || '') + '</div></div>';
        }).join('');
        return '<div class="album-grid' + cols + '">' +
          (cards || '<div class="track-empty">No albums yet.</div>') + '</div>';
      }
    },

    listennow: {
      label: 'Music cards',
      group: 'Music',
      icon: 'view_carousel',
      targets: ['app'],
      defaults: {
        kicker: 'Made for you',
        title: 'For you',
        subtitle: 'Fresh picks from your recent listening',
        action: 'See all',
        layout: 'poster',
        items: 'Midnight Drive | Nova Lane | headphones\nPaper Planes | Kite Club | flight\nLow Orbit | Nia Sol | public\nAfter Rain | Vela | water_drop\nStatic Bloom | Milo Fenn | graphic_eq\nGolden Hour | Nia Sol | wb_sunny'
      },
      fields: [
        { key: 'kicker', label: 'Small label', type: 'text', hint: 'Shown above the rail title — for example “Made for you”.' },
        { key: 'title', label: 'Rail title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'action', label: 'Action label', type: 'text' },
        { key: 'layout', label: 'Card layout', type: 'select', options: [
          ['poster', 'Poster cards'],
          ['wide', 'Wide shuffle cards'],
          ['tile', 'Compact tiles']
        ] },
        { key: 'items', label: 'Tracks — one per line: Title | Artist | Icon', type: 'textarea' }
      ],
      html: function (p) {
        var layout = ['poster', 'wide', 'tile'].indexOf(p.layout) > -1 ? p.layout : 'poster';
        var cards = lines(p.items).map(function (line) {
          var row = parts(line);
          return '<article class="ln-card" role="listitem">' +
            '<div class="ln-art">' + S.icon(row[2] || 'music_note', 'ln-glyph') +
            '<button type="button" class="ln-play" aria-label="Play ' + esc(row[0] || 'track') + '">' +
            S.icon('play_arrow') + '</button></div>' +
            '<div class="ln-copy"><div class="ln-name">' + esc(row[0] || 'Untitled track') + '</div>' +
            '<div class="ln-artist">' + esc(row[1] || 'Unknown artist') + '</div></div></article>';
        }).join('');
        var action = p.action
          ? '<span class="ln-action" data-edit="action">' + esc(p.action) + S.icon('chevron_right') + '</span>'
          : '';
        return '<div class="listen-now ln-' + layout + '">' +
          '<div class="ln-head"><div class="ln-head-text">' +
          (p.kicker ? '<span class="ln-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' : '') +
          '<h3 class="ln-title" data-edit="title">' + esc(p.title) + '</h3>' +
          (p.subtitle ? '<p class="ln-sub" data-edit="subtitle">' + esc(p.subtitle) + '</p>' : '') +
          '</div><div class="ln-tools">' + action +
          '<button type="button" class="ln-arrow" data-rail="prev" title="Scroll cards left" aria-label="Scroll ' +
          esc(p.title || 'music') + ' cards left">' + S.icon('chevron_left') + '</button>' +
          '<button type="button" class="ln-arrow" data-rail="next" title="Scroll cards right" aria-label="Scroll ' +
          esc(p.title || 'music') + ' cards right">' + S.icon('chevron_right') + '</button>' +
          '</div></div>' +
          '<div class="ln-rail" role="list" tabindex="0" aria-label="' + esc(p.title || 'Music') + ' cards">' +
          (cards || '<div class="track-empty">Add a few tracks in the inspector.</div>') + '</div></div>';
      }
    },

    miniplayer: {
      label: 'Mini player',
      group: 'Music',
      icon: 'graphic_eq',
      targets: ['app'],
      defaults: {
        layout: 'classic',
        title: 'Midnight Drive',
        artist: 'Nova Lane',
        coverIcon: 'headphones',
        progress: 64,
        playing: true,
        dock: true,
        fullPlayerStyle: 'vinyl',
        playIcon: 'play_arrow',
        pauseIcon: 'pause',
        previousIcon: 'skip_previous',
        nextIcon: 'skip_next',
        moreIcon: 'more_horiz',
        showPrevious: false,
        showNext: true,
        showMore: false
      },
      fields: [
        { key: 'layout', label: 'Layout', type: 'select', options: [
          ['classic', 'Classic bar'],
          ['floating', 'Floating capsule'],
          ['glass', 'Frosted glass'],
          ['artwork', 'Large artwork'],
          ['ring', 'Circular progress']
        ] },
        { key: 'fullPlayerStyle', label: 'Full player style', type: 'select', options: [
          ['vinyl', 'Vinyl Turntable'],
          ['classic', 'Hero Album Card'],
          ['lyrics', 'Waveform & Synced Lyrics'],
          ['gradient', 'Immersive Gradient'],
          ['minimal', 'Minimalist Hi-Fi']
        ] },
        { key: 'title', label: 'Track title', type: 'text' },
        { key: 'artist', label: 'Artist', type: 'text' },
        { key: 'coverIcon', label: 'Artwork icon', type: 'icon' },
        { key: 'progress', label: 'Progress', type: 'range', min: 0, max: 100, step: 1, suffix: '%' },
        { key: 'playing', label: 'Playing', type: 'toggle' },
        { key: 'playIcon', label: 'Play icon', type: 'icon' },
        { key: 'pauseIcon', label: 'Pause icon', type: 'icon' },
        { key: 'previousIcon', label: 'Previous icon', type: 'icon' },
        { key: 'nextIcon', label: 'Next icon', type: 'icon' },
        { key: 'moreIcon', label: 'More icon', type: 'icon' },
        { key: 'showPrevious', label: 'Show previous button', type: 'toggle' },
        { key: 'showNext', label: 'Show next button', type: 'toggle' },
        { key: 'showMore', label: 'Show more button', type: 'toggle' },
        { key: 'dock', label: 'Dock above bottom navigation', type: 'toggle' }
      ],
      html: function (p) {
        var progress = number(p.progress, 0, 0, 100);
        var layout = ['classic', 'floating', 'glass', 'artwork', 'ring'].indexOf(p.layout) > -1 ? p.layout : 'classic';
        var playIcon = p.playing ? (p.pauseIcon || 'pause') : (p.playIcon || 'play_arrow');
        var ringed = layout === 'ring';
        var ring = ringed
          ? '<svg class="mini-progress-ring" viewBox="0 0 44 44" aria-hidden="true">' +
            '<circle class="mini-ring-track" cx="22" cy="22" r="19" pathLength="100"></circle>' +
            '<circle class="mini-ring-fill" cx="22" cy="22" r="19" pathLength="100" ' +
            'stroke-dasharray="100" stroke-dashoffset="' + (100 - progress) + '"></circle></svg>'
          : '';
        var previous = p.showPrevious === true
          ? '<button type="button" class="mini-btn mini-prev" aria-label="Previous track">' +
            S.icon(p.previousIcon || 'skip_previous') + '</button>'
          : '';
        var next = p.showNext !== false
          ? '<button type="button" class="mini-btn mini-next" aria-label="Next track">' +
            S.icon(p.nextIcon || 'skip_next') + '</button>'
          : '';
        var more = p.showMore === true
          ? '<button type="button" class="mini-btn mini-more" aria-label="More options">' +
            S.icon(p.moreIcon || 'more_horiz') + '</button>'
          : '';

        return '<div class="mini-player mini-' + layout + (p.dock !== false ? ' is-docked' : '') +
          '" data-progress="' + progress + '" data-full-style="' + esc(p.fullPlayerStyle || 'vinyl') +
          '" style="--mini-progress:' + progress + '" title="Click to open full-screen player">' +
          (ringed ? '' : '<div class="mini-bar"><span style="width:' + progress + '%"></span></div>') +
          '<div class="mini-art">' + S.icon(p.coverIcon || 'headphones') + '</div>' +
          '<div class="mini-info"><div class="mini-title" data-edit="title">' + esc(p.title) + '</div>' +
          '<div class="mini-artist" data-edit="artist">' + esc(p.artist) + '</div>' +
          (ringed ? '<div class="mini-progress-text"><b>' + progress + '%</b> played</div>' : '') +
          '</div><div class="mini-actions">' + previous +
          '<button type="button" class="mini-btn mini-play' + (ringed ? ' mini-play-ring' : '') +
          '" aria-label="' + (p.playing ? 'Pause' : 'Play') + '">' +
          ring + (ringed ? '<span class="mini-play-face">' + S.icon(playIcon) + '</span>' : S.icon(playIcon)) +
          '</button>' + next + more + '</div></div>';
      }
    },

    /* -------------------------- downloads -------------------------- */

    downloaditem: {
      label: 'Download item',
      group: 'Downloads',
      icon: 'download',
      targets: ['app'],
      defaults: {
        name: 'Interstellar.2014.2160p.mkv',
        meta: '2.4 GB of 6.1 GB · 18.2 MB/s',
        progress: 38,
        icon: 'movie',
        state: 'downloading'
      },
      fields: [
        { key: 'name', label: 'File name', type: 'text' },
        { key: 'meta', label: 'Details', type: 'text' },
        { key: 'progress', label: 'Progress', type: 'range', min: 0, max: 100, step: 1, suffix: '%' },
        { key: 'icon', label: 'File icon', type: 'icon' },
        { key: 'state', label: 'State', type: 'select', options: [['downloading', 'Downloading'], ['paused', 'Paused'], ['queued', 'Queued'], ['complete', 'Complete']] }
      ],
      html: function (p) {
        var state = p.state || 'downloading';
        var progress = state === 'complete' ? 100 : number(p.progress, 0, 0, 100);
        var labels = { downloading: 'Downloading', paused: 'Paused', queued: 'Queued', complete: 'Complete' };
        var act = state === 'complete' ? 'check' : state === 'paused' ? 'play_arrow' : 'pause';
        var actLabel = state === 'complete' ? 'Download complete' : state === 'paused' ? 'Resume download' : 'Pause download';
        return '<div class="dl-item ' + esc(state) + '">' +
          '<div class="dl-ico">' + S.icon(p.icon || 'file') + '</div>' +
          '<div class="dl-main"><div class="dl-top">' +
          '<span class="dl-title" data-edit="name">' + esc(p.name) + '</span>' +
          '<span class="dl-state">' + esc(labels[state] || labels.downloading) + '</span></div>' +
          '<div class="dl-meta" data-edit="meta">' + esc(p.meta) + '</div>' +
          '<div class="dl-bar"><span style="width:' + progress + '%"></span></div></div>' +
          '<button type="button" class="dl-act" aria-label="' + actLabel + '">' + S.icon(act) + '</button>' +
          '</div>';
      }
    },

    downloadqueue: {
      label: 'Download queue',
      group: 'Downloads',
      icon: 'cloud_download',
      targets: ['app'],
      defaults: {
        title: 'Active downloads',
        summary: '3 items · 22.4 MB/s',
        items: 'Season 2 · Episode 4 | 1.2 GB of 2.8 GB | 72 | movie\nProduct launch assets | 840 MB of 1.4 GB | 54 | folder\nPodcast · Deep Work #42 | 186 MB | 100 | headphones\nInterstellar.2014.mkv | 6.1 GB | 8 | movie'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'summary', label: 'Summary line', type: 'text' },
        { key: 'items', label: 'Downloads — one per line: Name | Details | Progress | Icon', type: 'textarea' }
      ],
      html: function (p) {
        var rows = lines(p.items).map(function (line) {
          var row = parts(line);
          var pct = number(row[2], 0, 0, 100);
          var done = pct >= 100;
          return '<div class="dlq-row' + (done ? ' done' : '') + '">' +
            '<div class="dlq-ico">' + S.icon(row[3] || 'file') + '</div>' +
            '<div class="dlq-main"><div class="dlq-name">' + esc(row[0] || 'Untitled file') + '</div>' +
            '<div class="dlq-meta">' + esc(row[1] || '') + '</div>' +
            '<div class="dlq-bar"><span style="width:' + pct + '%"></span></div></div>' +
            '<span class="dlq-pct">' + (done ? S.icon('check') : pct + '%') + '</span></div>';
        }).join('');
        return '<div class="dl-queue">' +
          '<div class="dlq-head"><div><div class="dlq-title" data-edit="title">' + esc(p.title) + '</div>' +
          '<div class="dlq-sub" data-edit="summary">' + esc(p.summary) + '</div></div>' +
          '<button type="button" class="dlq-more" aria-label="Queue options">' + S.icon('more_vert') + '</button></div>' +
          (rows || '<div class="track-empty">Nothing in the queue.</div>') + '</div>';
      }
    },

    storageusage: {
      label: 'Storage usage',
      group: 'Downloads',
      icon: 'storage',
      targets: ['app'],
      defaults: {
        title: 'Device storage',
        used: '48.2 GB',
        total: '64 GB',
        items: 'Videos | 18.4 GB | 30\nPhotos | 12.1 GB | 20\nMusic | 8.3 GB | 14\nOther | 9.4 GB | 11'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'used', label: 'Used amount', type: 'text' },
        { key: 'total', label: 'Total amount', type: 'text' },
        { key: 'items', label: 'Categories — one per line: Label | Size | Percent', type: 'textarea' }
      ],
      html: function (p) {
        var rows = lines(p.items).map(function (line) { return parts(line); });
        var segments = rows.map(function (row) {
          return '<span class="storage-seg" style="width:' + number(row[2], 0, 0, 100) + '%"></span>';
        }).join('');
        var keys = rows.map(function (row) {
          return '<div class="storage-key"><span class="storage-dot"></span><span>' + esc(row[0] || 'Other') +
            '</span><b>' + esc(row[1] || '') + '</b></div>';
        }).join('');
        return '<div class="storage-card">' +
          '<div class="storage-head"><div class="storage-ico">' + S.icon('storage') + '</div>' +
          '<div class="storage-head-text"><div class="storage-title" data-edit="title">' + esc(p.title) + '</div>' +
          '<div class="storage-big"><span data-edit="used">' + esc(p.used) + '</span>' +
          '<small>of <span data-edit="total">' + esc(p.total) + '</span></small></div></div></div>' +
          '<div class="storage-bar">' + segments + '</div>' +
          '<div class="storage-legend">' + keys + '</div></div>';
      }
    },

    filegrid: {
      label: 'File categories',
      group: 'Downloads',
      icon: 'folder',
      targets: ['app'],
      defaults: {
        items: 'movie:Videos | 18.4 GB · 124 files\nphoto_library:Photos | 12.1 GB · 2,048 files\nmusic_note:Music | 8.3 GB · 612 songs\ndescription:Documents | 2.1 GB · 86 files',
        columns: '2'
      },
      fields: [
        { key: 'items', label: 'Categories — one per line: icon:Label | Detail', type: 'textarea' },
        { key: 'columns', label: 'Columns', type: 'select', options: [['2', '2 columns'], ['3', '3 columns']] }
      ],
      html: function (p) {
        var cols = String(p.columns) === '3' ? ' cols-3' : '';
        var tiles = lines(p.items).map(function (line) {
          var chunks = parts(line);
          var il = iconLabel(chunks[0]);
          return '<div class="file-tile"><span class="file-ico">' + S.icon(il.icon || 'folder') + '</span>' +
            '<div class="file-name">' + esc(il.label || 'Folder') + '</div>' +
            '<div class="file-meta">' + esc(chunks[1] || '') + '</div></div>';
        }).join('');
        return '<div class="file-grid' + cols + '">' + (tiles || '<div class="track-empty">No categories yet.</div>') + '</div>';
      }
    },

    /* -------------------------- passwords -------------------------- */

    vaultlist: {
      label: 'Password vault',
      group: 'Passwords',
      icon: 'key',
      targets: ['app'],
      defaults: {
        title: 'Your vault',
        subtitle: '84 logins · Synced just now',
        search: 'Search your vault',
        items: 'GitHub | dev@nova.io | 3 | code\nFigma | design@nova.io | 2 | palette\nStripe | finance@nova.io | 3 | credit_card\nMail | ava@nova.io | 1 | mail'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'search', label: 'Search placeholder', type: 'text' },
        { key: 'items', label: 'Logins — one per line: Site | Username | Strength (0–3) | Icon', type: 'textarea' }
      ],
      html: function (p) {
        var rows = lines(p.items).map(function (line) {
          var row = parts(line);
          var strength = Math.round(number(row[2], 3, 0, 3));
          var bars = [1, 2, 3].map(function (n) {
            return '<span class="' + (n <= strength ? 'on' : '') + '"></span>';
          }).join('');
          return '<div class="vault-row">' +
            '<span class="vault-logo">' + S.icon(row[3] || 'key') + '</span>' +
            '<div class="vault-info"><div class="vault-name">' + esc(row[0] || 'Untitled login') + '</div>' +
            '<div class="vault-user">' + esc(row[1] || '') + '</div></div>' +
            '<span class="vault-strength s' + strength + '" aria-label="Password strength ' + strength + ' of 3">' + bars + '</span>' +
            '<span class="vault-chev">' + S.icon('chevron_right') + '</span></div>';
        }).join('');
        return '<div class="vault-list">' +
          '<div class="vault-head"><div><h3 data-edit="title">' + esc(p.title) + '</h3>' +
          '<p data-edit="subtitle">' + esc(p.subtitle) + '</p></div>' +
          '<button type="button" class="vault-add" aria-label="Add login">' + S.icon('add') + '</button></div>' +
          '<div class="vault-search">' + S.icon('search') + '<span data-edit="search">' + esc(p.search) + '</span>' +
          '<span class="vault-filter">' + S.icon('tune') + '</span></div>' +
          (rows || '<div class="track-empty">Your vault is empty.</div>') + '</div>';
      }
    },

    secretcard: {
      label: 'Password detail',
      group: 'Passwords',
      icon: 'lock',
      targets: ['app'],
      defaults: {
        site: 'GitHub',
        updated: 'Updated 3 months ago',
        username: 'dev@nova.io',
        password: 'n3on-H0urs!forever',
        strength: 4,
        reveal: false,
        icon: 'code'
      },
      fields: [
        { key: 'site', label: 'Service name', type: 'text' },
        { key: 'updated', label: 'Updated line', type: 'text' },
        { key: 'username', label: 'Username', type: 'text' },
        { key: 'password', label: 'Password', type: 'text' },
        { key: 'strength', label: 'Strength', type: 'range', min: 1, max: 4, step: 1 },
        { key: 'reveal', label: 'Show password', type: 'toggle' },
        { key: 'icon', label: 'Service icon', type: 'icon' }
      ],
      html: function (p) {
        var strength = Math.round(number(p.strength, 4, 1, 4));
        var levels = { 1: 'Very weak', 2: 'Weak', 3: 'Strong', 4: 'Excellent' };
        var bars = [1, 2, 3, 4].map(function (n) {
          return '<span class="' + (n <= strength ? 'on' : '') + '"></span>';
        }).join('');
        var shown = p.reveal ? p.password : '••••••••••••';
        return '<div class="secret-card">' +
          '<div class="secret-head"><div class="secret-logo">' + S.icon(p.icon || 'key') + '</div>' +
          '<div class="secret-id"><h3 data-edit="site">' + esc(p.site) + '</h3>' +
          '<p data-edit="updated">' + esc(p.updated) + '</p></div>' +
          '<button type="button" class="secret-more" aria-label="More options">' + S.icon('more_vert') + '</button></div>' +
          '<div class="secret-field"><div class="secret-label">Username</div>' +
          '<div class="secret-value"><span data-edit="username">' + esc(p.username) + '</span>' +
          '<button type="button" class="secret-copy" aria-label="Copy username">' + S.icon('content_copy') + '</button></div></div>' +
          '<div class="secret-field"><div class="secret-label">Password</div>' +
          '<div class="secret-value"><span class="secret-pass"' + (p.reveal ? ' data-edit="password"' : '') + '>' +
          esc(shown) + '</span>' +
          '<button type="button" class="secret-copy" aria-label="' + (p.reveal ? 'Hide password' : 'Show password') + '">' +
          S.icon(p.reveal ? 'visibility_off' : 'visibility') + '</button>' +
          '<button type="button" class="secret-copy" aria-label="Copy password">' + S.icon('content_copy') + '</button></div></div>' +
          '<div class="secret-strength"><span>' + levels[strength] + ' password</span>' +
          '<div class="strength-meter s' + strength + '">' + bars + '</div></div>' +
          '<div class="secret-actions"><button type="button" class="btn tonal">Edit</button>' +
          '<button type="button" class="btn filled">Open site</button></div></div>';
      }
    },

    securityscore: {
      label: 'Security score',
      group: 'Passwords',
      icon: 'shield',
      targets: ['app'],
      defaults: {
        title: 'Vault health',
        subtitle: '2 weak passwords and 1 reused login need attention.',
        score: 86,
        saved: '84',
        weak: '2',
        breaches: '0',
        action: 'Review weak passwords'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Description', type: 'textarea' },
        { key: 'score', label: 'Score', type: 'range', min: 0, max: 100, step: 1 },
        { key: 'saved', label: 'Saved stat', type: 'text' },
        { key: 'weak', label: 'Weak stat', type: 'text' },
        { key: 'breaches', label: 'Breaches stat', type: 'text' },
        { key: 'action', label: 'Action label', type: 'text' }
      ],
      html: function (p) {
        var score = Math.round(number(p.score, 86, 0, 100));
        return '<div class="sec-score">' +
          '<div class="sec-top"><div class="sec-ring" style="--score:' + score + '">' +
          '<b>' + score + '<small>/100</small></b></div>' +
          '<div class="sec-copy"><h3 data-edit="title">' + esc(p.title) + '</h3>' +
          '<p data-edit="subtitle">' + esc(p.subtitle) + '</p></div></div>' +
          '<div class="sec-mini">' +
          '<div><b data-edit="saved">' + esc(p.saved) + '</b><span>Saved</span></div>' +
          '<div><b data-edit="weak">' + esc(p.weak) + '</b><span>Weak</span></div>' +
          '<div><b data-edit="breaches">' + esc(p.breaches) + '</b><span>Breaches</span></div></div>' +
          (p.action ? '<button type="button" class="btn outlined full sec-action">' +
            S.icon('shield') + '<span>' + esc(p.action) + '</span></button>' : '') + '</div>';
      }
    },

    passwordgen: {
      label: 'Password generator',
      group: 'Passwords',
      icon: 'password',
      targets: ['app'],
      defaults: {
        label: 'Generated password',
        password: 'tR7#vL9!qP2@wX5',
        length: 16,
        upper: true,
        digits: true,
        symbols: true
      },
      fields: [
        { key: 'label', label: 'Eyebrow label', type: 'text' },
        { key: 'password', label: 'Password', type: 'text' },
        { key: 'length', label: 'Length', type: 'range', min: 8, max: 32, step: 1 },
        { key: 'upper', label: 'Uppercase', type: 'toggle' },
        { key: 'digits', label: 'Numbers', type: 'toggle' },
        { key: 'symbols', label: 'Symbols', type: 'toggle' }
      ],
      html: function (p) {
        var len = Math.round(number(p.length, 16, 8, 32));
        var width = Math.round(((len - 8) / 24) * 100);
        var chips = [
          ['ABCD', p.upper],
          ['123', p.digits],
          ['!@#', p.symbols]
        ].map(function (pair) {
          return '<span class="pg-chip' + (pair[1] ? ' on' : '') + '">' +
            (pair[1] ? S.icon('check') : '') + pair[0] + '</span>';
        }).join('');
        return '<div class="passgen">' +
          '<div class="pg-head"><span class="pg-kicker" data-edit="label">' + esc(p.label) + '</span>' +
          '<button type="button" class="pg-refresh" aria-label="Generate a new password">' + S.icon('refresh') + '</button></div>' +
          '<div class="pg-output"><code data-edit="password">' + esc(p.password) + '</code>' +
          '<button type="button" class="pg-copy" aria-label="Copy password">' + S.icon('content_copy') + '</button></div>' +
          '<div class="pg-length"><span>Length</span><b>' + len + '</b></div>' +
          '<div class="pg-track"><span style="width:' + width + '%"></span></div>' +
          '<div class="pg-chips">' + chips + '</div>' +
          '<button type="button" class="btn filled full pg-use">' + S.icon('check') + '<span>Use password</span></button></div>';
      }
    },

    /* --------------------------- utility --------------------------- */

    statrow: {
      label: 'Stat tiles',
      group: 'Utility',
      icon: 'analytics',
      targets: ['app'],
      defaults: {
        items: 'Active | 3 | download\nSpeed | 22.4 MB/s | speed\nFree | 15.8 GB | storage',
        columns: '3'
      },
      fields: [
        { key: 'items', label: 'Stats — one per line: Label | Value | Icon', type: 'textarea' },
        { key: 'columns', label: 'Columns', type: 'select', options: [['2', '2 columns'], ['3', '3 columns'], ['4', '4 columns']] }
      ],
      html: function (p) {
        var cols = ['2', '3', '4'].indexOf(String(p.columns)) > -1 ? String(p.columns) : '3';
        var tiles = lines(p.items).map(function (line) {
          var row = parts(line);
          return '<div class="stat-tile"><span class="stat-ico">' + S.icon(row[2] || 'insights') + '</span>' +
            '<div class="stat-val">' + esc(row[1] || '0') + '</div>' +
            '<div class="stat-label">' + esc(row[0] || 'Metric') + '</div></div>';
        }).join('');
        return '<div class="stat-row cols-' + cols + '">' +
          (tiles || '<div class="track-empty">No stats yet.</div>') + '</div>';
      }
    },

    profileheader: {
      label: 'Profile header',
      group: 'Utility',
      icon: 'account_circle',
      targets: ['app'],
      defaults: {
        name: 'Ava Lane',
        handle: '@avalanepro',
        bio: 'Product designer building calm software. Making small things feel considered.',
        initials: 'AL',
        verified: true,
        stats: '248 | Posts\n12.4k | Followers\n386 | Following',
        actions: 'Share, Edit profile'
      },
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'handle', label: 'Handle', type: 'text' },
        { key: 'bio', label: 'Bio', type: 'textarea' },
        { key: 'initials', label: 'Avatar initials', type: 'text' },
        { key: 'verified', label: 'Verified badge', type: 'toggle' },
        { key: 'stats', label: 'Stats — one per line: Value | Label', type: 'textarea' },
        { key: 'actions', label: 'Actions (comma separated)', type: 'text' }
      ],
      html: function (p) {
        var stats = lines(p.stats).map(function (line) {
          var row = parts(line);
          return '<div class="profile-stat"><b>' + esc(row[0] || '0') + '</b><span>' + esc(row[1] || '') + '</span></div>';
        }).join('');
        var actions = String(p.actions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean)
          .map(function (label, i) {
            return '<button type="button" class="btn ' + (i === 0 ? 'outlined' : 'filled') + '">' + esc(label) + '</button>';
          }).join('');
        return '<div class="profile-head">' +
          '<div class="profile-cover"></div>' +
          '<div class="profile-body">' +
          '<div class="profile-avatar"><span>' + esc(p.initials || U.initials(p.name)) + '</span>' +
          (p.verified ? '<i class="profile-verified" aria-label="Verified">' + S.icon('check') + '</i>' : '') + '</div>' +
          (actions ? '<div class="profile-actions">' + actions + '</div>' : '') +
          '<h3 class="profile-name" data-edit="name">' + esc(p.name) + '</h3>' +
          '<div class="profile-handle" data-edit="handle">' + esc(p.handle) + '</div>' +
          '<p class="profile-bio" data-edit="bio">' + esc(p.bio) + '</p>' +
          (stats ? '<div class="profile-stats">' + stats + '</div>' : '') +
          '</div></div>';
      }
    },

    quickactions: {
      label: 'Quick actions',
      group: 'Utility',
      icon: 'apps',
      targets: ['app'],
      defaults: {
        title: 'Quick actions',
        items: 'add:New\nupload:Upload\ndownload:Download\nshare:Share\nfolder:Files\nsettings:Settings',
        columns: '3'
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'items', label: 'Actions — one per line: icon:Label', type: 'textarea' },
        { key: 'columns', label: 'Columns', type: 'select', options: [['2', '2 columns'], ['3', '3 columns'], ['4', '4 columns']] }
      ],
      html: function (p) {
        var cols = ['2', '3', '4'].indexOf(String(p.columns)) > -1 ? String(p.columns) : '3';
        var tiles = lines(p.items).map(function (line) {
          var il = iconLabel(line);
          return '<button type="button" class="quick-tile"><span class="quick-ico">' + S.icon(il.icon) +
            '</span><span>' + esc(il.label) + '</span></button>';
        }).join('');
        return '<div class="quick-sec">' +
          (p.title ? '<div class="quick-title" data-edit="title">' + esc(p.title) + '</div>' : '') +
          '<div class="quick-grid cols-' + cols + '">' + (tiles || '<div class="track-empty">No actions yet.</div>') + '</div></div>';
      }
    },

    settingslist: {
      label: 'Settings group',
      group: 'Utility',
      icon: 'settings',
      targets: ['app'],
      defaults: {
        title: 'App Preferences',
        style: 'card',
        items: 'person:Profile & Account | Alex Rivera · alex@droidlab.app | chevron:Profile\nnotifications:Notifications & Alerts | Push, email and in-app | switch:on\nfingerprint:Biometric Security | Fingerprint or Face ID unlock | switch:off\ndownload:Downloads & Storage | Wi-Fi only · 3 items | chevron:Details\npalette:Appearance & Theme | OLED deep black background | badge:Auto'
      },
      fields: [
        { key: 'title', label: 'Group title', type: 'text' },
        { key: 'style', label: 'Card visual style', type: 'select', options: [
          ['card', '1. Rounded Elevated Card'],
          ['flat', '2. Flat List with Dividers'],
          ['outlined', '3. Crisp Outlined Border'],
          ['glass', '4. Frosted Glassmorphism']
        ] },
        { key: 'items', label: 'Rows — one per line: icon:Label | Subtitle | Trailing (switch:on, badge:Text, or chevron:ScreenName)', type: 'textarea' }
      ],
      html: function (p) {
        var cardStyle = p.style || 'card';
        var rows = lines(p.items).map(function (line) {
          var chunks = parts(line);
          var il = iconLabel(chunks[0]);
          var trail = chunks[2] || 'chevron';
          var trailHTML = '';
          var navTarget = chunks[3] || '';

          if (trail.indexOf('chevron:') === 0) {
            navTarget = trail.slice(8).trim();
            trail = 'chevron';
          } else if (trail === 'chevron' && !navTarget) {
            navTarget = il.label;
          }

          if (trail.indexOf('switch') === 0) {
            trailHTML = '<span class="switch' + (trail.indexOf(':on') > -1 ? ' on' : '') + '"></span>';
          } else if (trail.indexOf('badge:') === 0) {
            trailHTML = '<span class="settings-badge">' + esc(trail.slice(6)) + '</span>';
          } else if (trail !== 'none') {
            trailHTML = '<span class="settings-chev">' + S.icon('chevron_right') + '</span>';
          }

          var navAttr = navTarget ? ' data-nav-target="' + esc(navTarget) + '" data-transition="slide"' : '';
          var isLink = !!navTarget && trail === 'chevron';

          return '<div class="settings-row' + (isLink ? ' is-link' : '') + '"' + navAttr + '><span class="settings-ico">' + S.icon(il.icon) + '</span>' +
            '<div class="settings-text"><div class="settings-name">' + esc(il.label) + '</div>' +
            '<div class="settings-sub">' + esc(chunks[1] || '') + '</div></div>' +
            '<span class="settings-trail">' + trailHTML + '</span></div>';
        }).join('');
        return '<div class="settings-card style-' + esc(cardStyle) + '">' +
          (p.title ? '<div class="settings-title" data-edit="title">' + esc(p.title) + '</div>' : '') +
          (rows || '<div class="track-empty">No settings yet.</div>') + '</div>';
      }
    },

    emptystate: {
      label: 'Empty state',
      group: 'Utility',
      icon: 'inbox',
      targets: ['app'],
      defaults: {
        icon: 'folder_open',
        title: 'Nothing here yet',
        body: 'Downloads you start will show up here. Add a file or paste a link to get going.',
        action: 'Add a download'
      },
      fields: [
        { key: 'icon', label: 'Icon', type: 'icon' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'body', label: 'Description', type: 'textarea' },
        { key: 'action', label: 'Action label', type: 'text' }
      ],
      html: function (p) {
        return '<div class="empty-state">' +
          '<div class="empty-art">' + S.icon(p.icon || 'inbox') + '</div>' +
          '<h3 data-edit="title">' + esc(p.title) + '</h3>' +
          '<p data-edit="body">' + esc(p.body) + '</p>' +
          (p.action ? '<button type="button" class="btn tonal empty-action">' + S.icon('add') +
            '<span data-edit="action">' + esc(p.action) + '</span></button>' : '') + '</div>';
      }
    },

    notice: {
      label: 'Notice banner',
      group: 'Utility',
      icon: 'info',
      targets: ['app'],
      defaults: {
        icon: 'wifi',
        title: 'Waiting for Wi-Fi',
        body: 'Downloads will start automatically when you reconnect.',
        action: 'Change',
        tone: 'info'
      },
      fields: [
        { key: 'tone', label: 'Tone', type: 'select', options: [['info', 'Info'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger']] },
        { key: 'icon', label: 'Icon', type: 'icon' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'body', label: 'Message', type: 'textarea' },
        { key: 'action', label: 'Action label', type: 'text' }
      ],
      html: function (p) {
        var tone = ['info', 'success', 'warning', 'danger'].indexOf(String(p.tone)) > -1 ? String(p.tone) : 'info';
        return '<div class="notice-banner ' + tone + '">' +
          '<span class="notice-ico">' + S.icon(p.icon || 'info') + '</span>' +
          '<div class="notice-body"><div class="notice-title" data-edit="title">' + esc(p.title) + '</div>' +
          '<div class="notice-text" data-edit="body">' + esc(p.body) + '</div></div>' +
          (p.action ? '<button type="button" class="notice-action" data-edit="action">' + esc(p.action) + '</button>' : '') +
          '</div>';
      }
    },

    /* ------------------------ content + folders ------------------------ */

    contentheader: {
      label: 'Content header',
      group: 'Structure',
      icon: 'view_headline',
      targets: ['app'],
      defaults: {
        kicker: 'Your library',
        title: 'Everything you saved',
        subtitle: '128 items · updated today',
        icon: 'auto_stories',
        actions: 'sort, more_vert',
        avatar: false
      },
      fields: [
        { key: 'kicker', label: 'Kicker', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'icon', label: 'Leading icon', type: 'icon' },
        { key: 'actions', label: 'Actions (icon names, comma separated)', type: 'text' },
        { key: 'avatar', label: 'Show avatar', type: 'toggle' }
      ],
      html: function (p) {
        var actions = String(p.actions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        return '<div class="content-head">' +
          (p.icon ? '<span class="ch-mark">' + S.icon(p.icon) + '</span>' : '') +
          '<div class="ch-text">' +
          (p.kicker ? '<span class="ch-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' : '') +
          '<div class="ch-title" data-edit="title">' + esc(p.title) + '</div>' +
          (p.subtitle ? '<div class="ch-sub" data-edit="subtitle">' + esc(p.subtitle) + '</div>' : '') +
          '</div>' +
          '<div class="ch-actions">' + actions.map(function (icon) {
            return '<button type="button" class="ch-act" aria-label="' + esc(icon) + '">' + S.icon(icon) + '</button>';
          }).join('') +
          (p.avatar ? '<span class="avatar">AL</span>' : '') + '</div></div>';
      }
    },

    foldergrid: {
      label: 'Folder grid',
      group: 'Structure',
      icon: 'folder_copy',
      targets: ['app'],
      defaults: {
        title: 'Folders',
        items: 'music_note|Music|128 tracks\nmovie|Movies|42 titles\nphoto_library|Photos|1.2k items\nfolder_zip|Archives|6.4 GB',
        columns: 2,
        addLabel: 'New folder',
        showAdd: true
      },
      fields: [
        { key: 'title', label: 'Section title', type: 'text' },
        { key: 'items', label: 'Folders — one per line: icon|Name|Meta', type: 'textarea' },
        { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 4 },
        { key: 'addLabel', label: 'Add button label', type: 'text' },
        { key: 'showAdd', label: 'Show add button', type: 'toggle' }
      ],
      html: function (p) {
        var cols = number(p.columns, 2, 1, 4);
        var folders = lines(p.items).map(function (line) {
          var bits = parts(line);
          return { icon: bits[0] || 'folder', name: bits[1] || 'Folder', meta: bits[2] || '' };
        });
        return '<div class="folder-block">' +
          (p.title || p.showAdd ? '<div class="folder-head"><div class="folder-title" data-edit="title">' + esc(p.title) + '</div>' +
            (p.showAdd ? '<button type="button" class="folder-add">' + S.icon('create_new_folder') +
              '<span data-edit="addLabel">' + esc(p.addLabel || 'New folder') + '</span></button>' : '') + '</div>' : '') +
          '<div class="folder-grid" style="--cols:' + cols + '">' +
          (folders.length ? folders.map(function (f) {
            return '<button type="button" class="folder-card" data-folder="' + esc(f.name) + '">' +
              '<span class="folder-ico">' + S.icon(f.icon) + '</span>' +
              '<span class="folder-info"><strong>' + esc(f.name) + '</strong>' +
              (f.meta ? '<small>' + esc(f.meta) + '</small>' : '') + '</span>' +
              '<span class="mi folder-go">chevron_right</span></button>';
          }).join('') : '<div class="folder-empty">No folders yet. Add one below.</div>') +
          '</div></div>';
      }
    },

    searchpage: {
      label: 'Search page',
      group: 'Structure',
      icon: 'manage_search',
      targets: ['app'],
      defaults: {
        title: 'Search',
        placeholder: 'Search songs, files and settings',
        chips: 'All, Songs, Files, Settings',
        hint: 'Try “Midnight”, “invoice” or “dark mode”.',
        items: 'music_note|Midnight Drive|Nova Lane · Song\nfolder_zip|Invoices 2026|Folder · 18 files\nsettings|Dark mode|Settings · Appearance\nperson|Nova Lane|Artist · 3 albums'
      },
      fields: [
        { key: 'title', label: 'Page title', type: 'text' },
        { key: 'placeholder', label: 'Search placeholder', type: 'text' },
        { key: 'chips', label: 'Filter chips (comma separated)', type: 'text' },
        { key: 'hint', label: 'Helper text', type: 'text' },
        { key: 'items', label: 'Results — one per line: icon|Title|Meta', type: 'textarea' }
      ],
      html: function (p) {
        var chips = String(p.chips || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        var results = lines(p.items).map(function (line) {
          var bits = parts(line);
          return { icon: bits[0] || 'search', title: bits[1] || 'Result', meta: bits[2] || '' };
        });
        return '<div class="search-page">' +
          '<div class="sp-head"><button type="button" class="sp-back" aria-label="Back">' + S.icon('arrow_back') + '</button>' +
          '<div class="sp-title" data-edit="title">' + esc(p.title) + '</div>' +
          '<button type="button" class="sp-act" aria-label="Search filters">' + S.icon('tune') + '</button></div>' +
          '<div class="sp-bar">' + S.icon('search') +
          '<input type="search" class="sp-input" placeholder="' + esc(p.placeholder) + '" aria-label="' + esc(p.placeholder) + '">' +
          '<button type="button" class="sp-clear" data-sp-clear="1" aria-label="Clear search">' + S.icon('close') + '</button></div>' +
          (chips.length ? '<div class="sp-chips">' + chips.map(function (label, i) {
            return '<button type="button" class="sp-chip' + (i === 0 ? ' active' : '') + '" data-sp-chip="' + esc(label) + '">' +
              esc(label) + '</button>';
          }).join('') + '</div>' : '') +
          '<div class="sp-hint" data-edit="hint">' + S.icon('lightbulb') + '<span>' + esc(p.hint) + '</span></div>' +
          '<div class="sp-results">' + results.map(function (r) {
            return '<button type="button" class="sp-result" data-sp-text="' + esc(r.title + ' ' + r.meta) + '">' +
              '<span class="sp-ico">' + S.icon(r.icon) + '</span>' +
              '<span class="sp-result-text"><strong>' + esc(r.title) + '</strong>' +
              (r.meta ? '<small>' + esc(r.meta) + '</small>' : '') + '</span>' +
              '<span class="mi">chevron_right</span></button>';
          }).join('') + '</div>' +
          '<p class="sp-empty" hidden>No results. Try another word.</p>' +
          '</div>';
      }
    },

    /* ========================================================
       MODERN MOBILE COMPONENTS EXPANSION
       ======================================================== */
    stories: {
      label: 'Stories Carousel',
      group: 'Social',
      icon: 'auto_stories',
      defaults: {
        items: 'Your Story:msr:add:1\nMarcus:msr:account_circle:1\nElena:msr:face:1\nAria:msr:face_3:0\nKobe:msr:mood:0\nChloe:msr:sentiment_satisfied:0'
      },
      fields: [
        { key: 'items', label: 'Stories (Name:Icon:Unread 1/0)', type: 'textarea' }
      ],
      html: function (p) {
        var bubbles = String(p.items || '').split('\n').map(function (line) {
          var pt = line.split(':');
          var name = pt[0] ? pt[0].trim() : 'User';
          var ico = pt[1] ? pt[1].trim() : 'account_circle';
          var unread = pt[2] && pt[2].trim() === '1';
          return '<div class="story-bubble' + (unread ? ' unread' : '') + '">' +
            '<div class="story-ring"><div class="story-avatar">' + S.icon(ico) + '</div></div>' +
            '<span class="story-name">' + esc(name) + '</span>' +
            '</div>';
        }).join('');
        return '<div class="stories-rail"><div class="stories-track">' + bubbles + '</div></div>';
      }
    },

    walletcard: {
      label: 'Wallet Card',
      group: 'FinTech',
      icon: 'credit_card',
      defaults: {
        balance: '$24,850.40',
        label: 'Primary Platinum',
        number: '•••• 8924',
        holder: 'ALEX MORGAN',
        expiry: '09/29',
        theme: 'violet'
      },
      fields: [
        { key: 'balance', label: 'Account balance', type: 'text' },
        { key: 'label', label: 'Card label', type: 'text' },
        { key: 'number', label: 'Card number', type: 'text' },
        { key: 'holder', label: 'Cardholder name', type: 'text' },
        { key: 'expiry', label: 'Expiry date', type: 'text' },
        { key: 'theme', label: 'Card theme', type: 'select', options: [
          ['violet', 'Deep Violet Glow'],
          ['dark', 'Obsidian Carbon'],
          ['emerald', 'Emerald Mint'],
          ['sunset', 'Sunset Gradient']
        ] }
      ],
      html: function (p) {
        var themeCls = p.theme ? ' theme-' + p.theme : ' theme-violet';
        return '<div class="wallet-card' + themeCls + '">' +
          '<div class="wc-top">' +
          '<div class="wc-chip-row"><span class="wc-chip"></span><span class="mi wc-contactless">contactless</span></div>' +
          '<span class="wc-brand">AURORA</span>' +
          '</div>' +
          '<div class="wc-balance-wrap">' +
          '<span class="wc-balance-lbl">' + esc(p.label) + '</span>' +
          '<div class="wc-balance">' + esc(p.balance) + '</div>' +
          '</div>' +
          '<div class="wc-bottom">' +
          '<div class="wc-num">' + esc(p.number) + '</div>' +
          '<div class="wc-meta"><span>' + esc(p.holder) + '</span><span>' + esc(p.expiry) + '</span></div>' +
          '</div></div>';
      }
    },

    quickactions: {
      label: 'Quick Actions Grid',
      group: 'FinTech',
      icon: 'grid_view',
      defaults: {
        actions: 'Send:send\nRequest:call_received\nPay:qr_code_scanner\nInvest:trending_up'
      },
      fields: [
        { key: 'actions', label: 'Actions (Label:Icon)', type: 'textarea' }
      ],
      html: function (p) {
        var btns = String(p.actions || '').split('\n').map(function (line) {
          var pt = line.split(':');
          var label = pt[0] ? pt[0].trim() : 'Action';
          var ico = pt[1] ? pt[1].trim() : 'touch_app';
          return '<button type="button" class="qa-item">' +
            '<span class="qa-icon-wrap">' + S.icon(ico) + '</span>' +
            '<span class="qa-label">' + esc(label) + '</span>' +
            '</button>';
        }).join('');
        return '<div class="quick-actions-grid">' + btns + '</div>';
      }
    },

    statscard: {
      label: 'Metric / Stats Card',
      group: 'Metrics',
      icon: 'insights',
      defaults: {
        title: 'Weekly Listening',
        value: '18.4 hrs',
        trend: '+24.5%',
        trendDir: 'up',
        period: 'vs last week'
      },
      fields: [
        { key: 'title', label: 'Metric title', type: 'text' },
        { key: 'value', label: 'Big value', type: 'text' },
        { key: 'trend', label: 'Trend badge', type: 'text' },
        { key: 'trendDir', label: 'Trend direction', type: 'select', options: [['up', 'Positive (+ / Green)'], ['down', 'Negative (- / Red)']] },
        { key: 'period', label: 'Period note', type: 'text' }
      ],
      html: function (p) {
        var isUp = p.trendDir !== 'down';
        return '<div class="m3-stat-card">' +
          '<div class="msc-head"><span>' + esc(p.title) + '</span><span class="mi msc-icon">monitoring</span></div>' +
          '<div class="msc-main">' +
          '<div class="msc-val">' + esc(p.value) + '</div>' +
          '<div class="msc-sparkline"><svg viewBox="0 0 100 30" class="msc-svg"><path d="M0,22 Q25,26 40,14 T70,16 T100,6" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></div>' +
          '</div>' +
          '<div class="msc-footer">' +
          '<span class="msc-trend ' + (isUp ? 'up' : 'down') + '"><span class="mi">' + (isUp ? 'trending_up' : 'trending_down') + '</span>' + esc(p.trend) + '</span>' +
          '<span class="msc-period">' + esc(p.period) + '</span>' +
          '</div></div>';
      }
    },

    chatthread: {
      label: 'Chat Thread',
      group: 'Social',
      icon: 'chat',
      defaults: {
        messages: 'in:Hey Alex! Did you check the new Compose design system?:10:42 AM\nout:Yes! The VectorDrawable icons and Material 3 tokens look incredible.:10:43 AM\nin:Exporting to Android Studio compiles in under 2 seconds.:10:44 AM'
      },
      fields: [
        { key: 'messages', label: 'Messages (in/out:Text:Time)', type: 'textarea' }
      ],
      html: function (p) {
        var msgs = String(p.messages || '').split('\n').map(function (line) {
          var pt = line.split(':');
          var dir = (pt[0] && pt[0].trim() === 'out') ? 'out' : 'in';
          var text = pt[1] ? pt[1].trim() : 'Message';
          var time = pt[2] ? pt[2].trim() : '12:00';
          return '<div class="chat-msg ' + dir + '">' +
            '<div class="chat-bubble">' + esc(text) +
            '<span class="chat-meta">' + esc(time) + (dir === 'out' ? ' <span class="mi chat-check">done_all</span>' : '') + '</span>' +
            '</div></div>';
        }).join('');
        return '<div class="chat-thread">' + msgs + '</div>';
      }
    },

    profileheader: {
      label: 'Profile Header',
      group: 'Social',
      icon: 'badge',
      defaults: {
        name: 'Alex Rivera',
        handle: '@arivera · Android Architect',
        bio: 'Building modern interfaces with Jetpack Compose, Kotlin Multiplatform, and design compilers. 🚀',
        stats: '1,240:Designs|42.8k:Followers|318:Following',
        avatarText: 'AR'
      },
      fields: [
        { key: 'name', label: 'Full name', type: 'text' },
        { key: 'handle', label: 'Handle / Title', type: 'text' },
        { key: 'bio', label: 'Biography', type: 'textarea' },
        { key: 'stats', label: 'Stats (Count:Label|Count:Label)', type: 'text' },
        { key: 'avatarText', label: 'Avatar initials', type: 'text' }
      ],
      html: function (p) {
        var statPills = String(p.stats || '').split('|').map(function (it) {
          var pt = it.split(':');
          return '<div class="prof-stat"><strong>' + esc(pt[0] || '0') + '</strong><small>' + esc(pt[1] || '') + '</small></div>';
        }).join('');
        return '<div class="prof-header">' +
          '<div class="prof-banner"></div>' +
          '<div class="prof-content">' +
          '<div class="prof-avatar-row">' +
          '<div class="prof-avatar"><span>' + esc(p.avatarText || 'AR') + '</span></div>' +
          '<button type="button" class="prof-edit-btn"><span class="mi">edit</span><span>Edit profile</span></button>' +
          '</div>' +
          '<h2 class="prof-name">' + esc(p.name) + '</h2>' +
          '<span class="prof-handle">' + esc(p.handle) + '</span>' +
          '<p class="prof-bio">' + esc(p.bio) + '</p>' +
          '<div class="prof-stats-bar">' + statPills + '</div>' +
          '</div></div>';
      }
    },

    audiowave: {
      label: 'Waveform Player',
      group: 'Media',
      icon: 'graphic_eq',
      defaults: {
        title: 'Midnight Echoes',
        artist: 'Solaris Wave · Studio Mix',
        current: '02:18',
        total: '04:45'
      },
      fields: [
        { key: 'title', label: 'Track title', type: 'text' },
        { key: 'artist', label: 'Artist name', type: 'text' },
        { key: 'current', label: 'Elapsed time', type: 'text' },
        { key: 'total', label: 'Total duration', type: 'text' }
      ],
      html: function (p) {
        var bars = '';
        var heights = [30, 45, 60, 35, 80, 95, 65, 40, 70, 85, 100, 75, 50, 90, 60, 40, 30, 70, 85, 45, 60, 75, 40, 25];
        for (var i = 0; i < heights.length; i++) {
          var on = i < 12 ? ' is-passed' : '';
          bars += '<span class="wave-bar' + on + '" style="height:' + heights[i] + '%"></span>';
        }
        return '<div class="m3-waveform-card">' +
          '<div class="mwc-head">' +
          '<div class="mwc-info"><strong>' + esc(p.title) + '</strong><small>' + esc(p.artist) + '</small></div>' +
          '<button type="button" class="mwc-play-btn"><span class="mi">play_arrow</span></button>' +
          '</div>' +
          '<div class="mwc-wave-container">' + bars + '</div>' +
          '<div class="mwc-time-row"><span>' + esc(p.current) + '</span><span>' + esc(p.total) + '</span></div>' +
          '</div>';
      }
    },

    notificationlist: {
      label: 'Notification Feed',
      group: 'Social',
      icon: 'notifications_active',
      defaults: {
        items: 'rocket_launch:Project Export Ready:Your Android Studio project compiled successfully.:2m ago:1\nfavorite:Design Spec Liked:Marcus liked your Material 3 theme palette.:1h ago:1\nsync:Tokens Synchronized:Color tokens pushed to Jetpack Compose theme.:5h ago:0'
      },
      fields: [
        { key: 'items', label: 'Notifications (Icon:Title:Body:Time:Unread)', type: 'textarea' }
      ],
      html: function (p) {
        var list = String(p.items || '').split('\n').map(function (line) {
          var pt = line.split(':');
          var ico = pt[0] ? pt[0].trim() : 'notifications';
          var title = pt[1] ? pt[1].trim() : 'Notification';
          var body = pt[2] ? pt[2].trim() : '';
          var time = pt[3] ? pt[3].trim() : '';
          var unread = pt[4] && pt[4].trim() === '1';
          return '<div class="notif-item' + (unread ? ' unread' : '') + '">' +
            '<div class="notif-icon-wrap">' + S.icon(ico) + '</div>' +
            '<div class="notif-text"><strong>' + esc(title) + '</strong><p>' + esc(body) + '</p><small>' + esc(time) + '</small></div>' +
            (unread ? '<span class="notif-dot"></span>' : '') +
            '</div>';
        }).join('');
        return '<div class="notifications-card">' + list + '</div>';
      }
    },

    reviewrating: {
      label: 'Review Summary',
      group: 'Social',
      icon: 'star_half',
      defaults: {
        score: '4.9',
        total: '12,480 ratings',
        breakdown: '5:85|4:10|3:3|2:1|1:1'
      },
      fields: [
        { key: 'score', label: 'Rating score', type: 'text' },
        { key: 'total', label: 'Total ratings', type: 'text' },
        { key: 'breakdown', label: 'Breakdown (Stars:Percent|...)', type: 'text' }
      ],
      html: function (p) {
        var bars = String(p.breakdown || '').split('|').map(function (it) {
          var pt = it.split(':');
          var star = pt[0] || '5';
          var pct = pt[1] || '0';
          return '<div class="rr-row"><span class="rr-star-num">' + esc(star) + '</span><span class="mi rr-star-ico">star</span><div class="rr-bar-bg"><div class="rr-bar-fill" style="width:' + esc(pct) + '%"></div></div></div>';
        }).join('');
        return '<div class="review-rating-card">' +
          '<div class="rr-score-box">' +
          '<div class="rr-big-score">' + esc(p.score) + '</div>' +
          '<div class="rr-stars"><span class="mi">star</span><span class="mi">star</span><span class="mi">star</span><span class="mi">star</span><span class="mi">star</span></div>' +
          '<small class="rr-total">' + esc(p.total) + '</small>' +
          '</div>' +
          '<div class="rr-breakdown">' + bars + '</div>' +
          '</div>';
      }
    },

    cryptorow: {
      label: 'Crypto Ticker',
      group: 'FinTech',
      icon: 'currency_bitcoin',
      defaults: {
        tickers: 'BTC:Bitcoin:$89,420.50:+4.8%:1\nETH:Ethereum:$3,640.20:+2.4%:1\nSOL:Solana:$184.90:-1.2%:0'
      },
      fields: [
        { key: 'tickers', label: 'Tickers (Symbol:Name:Price:24h:Up)', type: 'textarea' }
      ],
      html: function (p) {
        var rowsHtml = String(p.tickers || '').split('\n').map(function (line) {
          var pt = line.split(':');
          var sym = pt[0] ? pt[0].trim() : 'COIN';
          var name = pt[1] ? pt[1].trim() : '';
          var price = pt[2] ? pt[2].trim() : '$0.00';
          var chg = pt[3] ? pt[3].trim() : '0.0%';
          var up = pt[4] && pt[4].trim() === '1';
          return '<div class="crypto-row">' +
            '<div class="cr-sym-badge">' + esc(sym.slice(0, 3)) + '</div>' +
            '<div class="cr-info"><strong>' + esc(name) + '</strong><small>' + esc(sym) + '</small></div>' +
            '<div class="cr-pricing"><div class="cr-price">' + esc(price) + '</div><span class="cr-chg ' + (up ? 'up' : 'down') + '">' + esc(chg) + '</span></div>' +
            '</div>';
        }).join('');
        return '<div class="crypto-card">' + rowsHtml + '</div>';
      }
    },

    countdowncard: {
      label: 'Countdown Timer',
      group: 'Structure',
      icon: 'timer',
      defaults: {
        title: 'Product Launch Drop',
        days: '03',
        hours: '14',
        mins: '28',
        secs: '45'
      },
      fields: [
        { key: 'title', label: 'Event title', type: 'text' },
        { key: 'days', label: 'Days', type: 'text' },
        { key: 'hours', label: 'Hours', type: 'text' },
        { key: 'mins', label: 'Minutes', type: 'text' },
        { key: 'secs', label: 'Seconds', type: 'text' }
      ],
      html: function (p) {
        return '<div class="m3-countdown-card">' +
          '<div class="mcc-head"><span class="mi">local_fire_department</span><strong>' + esc(p.title) + '</strong></div>' +
          '<div class="mcc-boxes">' +
          '<div class="mcc-box"><span class="mcc-val">' + esc(p.days) + '</span><span class="mcc-lbl">DAYS</span></div>' +
          '<div class="mcc-box"><span class="mcc-val">' + esc(p.hours) + '</span><span class="mcc-lbl">HOURS</span></div>' +
          '<div class="mcc-box"><span class="mcc-val">' + esc(p.mins) + '</span><span class="mcc-lbl">MINS</span></div>' +
          '<div class="mcc-box"><span class="mcc-val">' + esc(p.secs) + '</span><span class="mcc-lbl">SECS</span></div>' +
          '</div></div>';
      }
    },

    segmentcontrol: {
      label: 'Segmented Control',
      group: 'Structure',
      icon: 'view_column',
      defaults: {
        options: 'Overview, Analytics, Settings',
        active: 0
      },
      fields: [
        { key: 'options', label: 'Options (comma separated)', type: 'text' },
        { key: 'active', label: 'Active segment', type: 'number', min: 0, max: 5 }
      ],
      html: function (p) {
        var act = Number(p.active) || 0;
        var segs = String(p.options || '').split(',').map(function (s, i) {
          var t = s.trim();
          return '<button type="button" class="seg-btn' + (i === act ? ' is-active' : '') + '">' + esc(t) + '</button>';
        }).join('');
        return '<div class="segmented-control">' + segs + '</div>';
      }
    },

    activityrings: {
      label: 'Health Activity Rings',
      group: 'Metrics',
      icon: 'donut_large',
      defaults: {
        move: '540 / 600 CAL',
        exercise: '32 / 30 MIN',
        stand: '10 / 12 HRS'
      },
      fields: [
        { key: 'move', label: 'Move metric', type: 'text' },
        { key: 'exercise', label: 'Exercise metric', type: 'text' },
        { key: 'stand', label: 'Stand metric', type: 'text' }
      ],
      html: function (p) {
        return '<div class="m3-rings-card">' +
          '<div class="mrc-visual"><svg viewBox="0 0 100 100" class="mrc-svg"><circle cx="50" cy="50" r="40" stroke="rgba(244,63,94,0.2)" stroke-width="7" fill="none"/><circle cx="50" cy="50" r="40" stroke="#f43f5e" stroke-width="7" stroke-dasharray="251" stroke-dashoffset="50" stroke-linecap="round" fill="none"/><circle cx="50" cy="50" r="30" stroke="rgba(16,185,129,0.2)" stroke-width="7" fill="none"/><circle cx="50" cy="50" r="30" stroke="#10b981" stroke-width="7" stroke-dasharray="188" stroke-dashoffset="20" stroke-linecap="round" fill="none"/><circle cx="50" cy="50" r="20" stroke="rgba(6,182,212,0.2)" stroke-width="7" fill="none"/><circle cx="50" cy="50" r="20" stroke="#06b6d4" stroke-width="7" stroke-dasharray="125" stroke-dashoffset="30" stroke-linecap="round" fill="none"/></svg></div>' +
          '<div class="mrc-legend">' +
          '<div class="mrc-leg-row"><span class="mrc-dot c-red"></span><div><small>MOVE</small><strong>' + esc(p.move) + '</strong></div></div>' +
          '<div class="mrc-leg-row"><span class="mrc-dot c-green"></span><div><small>EXERCISE</small><strong>' + esc(p.exercise) + '</strong></div></div>' +
          '<div class="mrc-leg-row"><span class="mrc-dot c-cyan"></span><div><small>STAND</small><strong>' + esc(p.stand) + '</strong></div></div>' +
          '</div></div>';
      }
    },

    feedpost: {
      label: 'Feed Post Card',
      group: 'Social',
      icon: 'dynamic_feed',
      defaults: {
        author: 'Alex Rivera',
        handle: '@arivera · 2h',
        text: 'Just deployed our new Jetpack Compose design system generated directly from Droid Lab. Incredible ergonomics and smooth animations!',
        likes: '342',
        comments: '28'
      },
      fields: [
        { key: 'author', label: 'Author name', type: 'text' },
        { key: 'handle', label: 'Author handle / time', type: 'text' },
        { key: 'text', label: 'Post caption', type: 'textarea' },
        { key: 'likes', label: 'Likes count', type: 'text' },
        { key: 'comments', label: 'Comments count', type: 'text' }
      ],
      html: function (p) {
        return '<div class="feed-post-card">' +
          '<div class="fpc-head"><div class="fpc-avatar">AR</div><div><strong>' + esc(p.author) + '</strong><small>' + esc(p.handle) + '</small></div><span class="mi fpc-more">more_vert</span></div>' +
          '<p class="fpc-text">' + esc(p.text) + '</p>' +
          '<div class="fpc-media-placeholder"><span class="mi">image</span><span>Attached Design Spec</span></div>' +
          '<div class="fpc-actions">' +
          '<button type="button" class="fpc-act"><span class="mi">favorite_border</span><span>' + esc(p.likes) + '</span></button>' +
          '<button type="button" class="fpc-act"><span class="mi">chat_bubble_outline</span><span>' + esc(p.comments) + '</span></button>' +
          '<button type="button" class="fpc-act"><span class="mi">share</span></button>' +
          '<button type="button" class="fpc-act bookmark"><span class="mi">bookmark_border</span></button>' +
          '</div></div>';
      }
    },

    fileuploader: {
      label: 'File Upload Card',
      group: 'Structure',
      icon: 'cloud_upload',
      defaults: {
        title: 'Upload Design Assets',
        subtitle: 'SVG, VectorDrawable, PNG or JSON up to 25MB',
        progress: '78%'
      },
      fields: [
        { key: 'title', label: 'Card title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle note', type: 'text' },
        { key: 'progress', label: 'Progress percent', type: 'text' }
      ],
      html: function (p) {
        return '<div class="file-upload-card">' +
          '<div class="fuc-icon-wrap"><span class="mi">cloud_upload</span></div>' +
          '<strong>' + esc(p.title) + '</strong>' +
          '<small>' + esc(p.subtitle) + '</small>' +
          '<div class="fuc-progress-bg"><div class="fuc-progress-bar" style="width:' + esc(p.progress) + '"></div></div>' +
          '<div class="fuc-tags"><span>SVG</span><span>XML</span><span>JSON</span><span>PNG</span></div>' +
          '</div>';
      }
    },

    stepper: {
      label: 'Progress Stepper',
      group: 'Structure',
      icon: 'format_list_numbered',
      defaults: {
        steps: 'Design:1|Tokens:1|Compile:1|Export:0',
        activeStep: 3
      },
      fields: [
        { key: 'steps', label: 'Steps (Label:Completed 1/0)', type: 'text' },
        { key: 'activeStep', label: 'Active step index', type: 'number', min: 0, max: 5 }
      ],
      html: function (p) {
        var items = String(p.steps || '').split('|').map(function (it, idx) {
          var pt = it.split(':');
          var name = pt[0] ? pt[0].trim() : 'Step';
          var done = pt[1] && pt[1].trim() === '1';
          var current = idx === Number(p.activeStep);
          var cls = done ? ' is-done' : (current ? ' is-current' : '');
          return '<div class="stp-item' + cls + '">' +
            '<div class="stp-circle">' + (done ? '<span class="mi">check</span>' : (idx + 1)) + '</div>' +
            '<span class="stp-label">' + esc(name) + '</span>' +
            '</div>';
        }).join('<div class="stp-line"></div>');
        return '<div class="m3-stepper">' + items + '</div>';
      }
    },

    expandablecard: {
      label: 'Expandable Card',
      group: 'Structure',
      icon: 'expand',
      defaults: {
        title: 'Android Compose Tokens',
        subtitle: 'Material 3 ColorScheme & Typography mapping',
        detail: 'Generates Color.kt, Type.kt, Shape.kt, and Theme.kt synchronized with live CSS design values.'
      },
      fields: [
        { key: 'title', label: 'Card title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'detail', label: 'Expanded content', type: 'textarea' }
      ],
      html: function (p) {
        return '<div class="expandable-card is-open">' +
          '<div class="exc-head"><span class="mi exc-ico">code</span><div><strong>' + esc(p.title) + '</strong><small>' + esc(p.subtitle) + '</small></div><span class="mi exc-chevron">expand_less</span></div>' +
          '<div class="exc-body"><p>' + esc(p.detail) + '</p></div>' +
          '</div>';
      }
    },

    badgegrid: {
      label: 'Achievement Badges',
      group: 'Social',
      icon: 'military_tech',
      defaults: {
        badges: 'star:Pro Builder:Gold Tier|bolt:Fast Export:< 200ms|verified:Verified Dev:Certified|palette:Token Master:50+ Tokens'
      },
      fields: [
        { key: 'badges', label: 'Badges (Icon:Title:Subtitle)', type: 'textarea' }
      ],
      html: function (p) {
        var bHtml = String(p.badges || '').split('|').map(function (it) {
          var pt = it.split(':');
          return '<div class="ach-badge"><span class="mi ach-icon">' + esc(pt[0] || 'star') + '</span><strong>' + esc(pt[1] || 'Badge') + '</strong><small>' + esc(pt[2] || '') + '</small></div>';
        }).join('');
        return '<div class="badge-grid">' + bHtml + '</div>';
      }
    },

    mapcard: {
      label: 'Map Preview Card',
      group: 'Structure',
      icon: 'map',
      defaults: {
        title: 'Aurora Design Headquarters',
        address: '742 Evergreen Terrace, San Francisco, CA',
        distance: '2.4 miles away'
      },
      fields: [
        { key: 'title', label: 'Place name', type: 'text' },
        { key: 'address', label: 'Address string', type: 'text' },
        { key: 'distance', label: 'Distance / Subtitle', type: 'text' }
      ],
      html: function (p) {
        return '<div class="map-preview-card">' +
          '<div class="mpc-map"><div class="mpc-pin"><span class="mi">location_on</span></div><span class="mpc-badge">Live Map</span></div>' +
          '<div class="mpc-content">' +
          '<strong>' + esc(p.title) + '</strong>' +
          '<small>' + esc(p.address) + ' · ' + esc(p.distance) + '</small>' +
          '<button type="button" class="mpc-btn"><span class="mi">directions</span><span>Get Directions</span></button>' +
          '</div></div>';
      }
    }
  };

  /* ---------------- block factory ---------------- */
  /* Every block is { id, type, props, children, style, locked, hidden }.
     `children` is reserved for nested blocks; `style` keeps the per-block
     layout controls separate from the component's content props. */
  S.makeBlock = function (type, overrides) {
    var def = S.components[type];
    if (!def) return null;
    return {
      id: U.uid(),
      type: type,
      props: Object.assign({}, def.defaults, overrides || {}),
      children: [],
      style: {},
      typography: {},
      locked: false,
      hidden: false
    };
  };

  S.appDemoScreen = function () {
    return [
      S.makeBlock('appbar'),
      S.makeBlock('searchbar'),
      S.makeBlock('chips'),
      S.makeBlock('hero'),
      S.makeBlock('section'),
      S.makeBlock('list'),
      S.makeBlock('card'),
      S.makeBlock('button'),
      S.makeBlock('bottomnav')
    ];
  };
})();
