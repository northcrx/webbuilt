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

  S.components = {

    appbar: {
      label: 'Top app bar',
      group: 'Structure',
      icon: 'web_asset',
      defaults: {
        title: 'Discover',
        variant: 'small',
        leading: true,
        leadingIcon: 'menu',
        actions: 'search, more_vert',
        elevated: true
      },
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'variant', label: 'Variant', type: 'select', options: [['small', 'Small'], ['center', 'Centered'], ['large', 'Large']] },
        { key: 'leading', label: 'Menu button', type: 'toggle' },
        { key: 'leadingIcon', label: 'Menu icon', type: 'icon' },
        { key: 'actions', label: 'Actions (icon names, comma separated)', type: 'text' },
        { key: 'elevated', label: 'Tinted background', type: 'toggle' }
      ],
      html: function (p) {
        var actions = String(p.actions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        var leading = p.leading
          ? '<button class="icon-btn" aria-label="Menu">' + S.icon(p.leadingIcon) + '</button>'
          : '';
        var actHTML = actions.map(function (a) {
          if (a === 'avatar') return '<span class="avatar">AL</span>';
          return '<button class="icon-btn" aria-label="' + esc(a) + '">' + S.icon(a) + '</button>';
        }).join('');

        if (p.variant === 'large') {
          return '<header class="app-bar large' + (p.elevated ? ' elevated' : '') + '">' +
            '<div class="ab-row">' + leading + '<span style="flex:1"></span>' + actHTML + '</div>' +
            '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1></header>';
        }
        return '<header class="app-bar ' + (p.variant === 'center' ? 'center ' : '') + (p.elevated ? 'elevated' : '') + '">' +
          leading +
          '<h1 class="ab-title" data-edit="title">' + esc(p.title) + '</h1>' +
          actHTML + '</header>';
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
      label: 'Tabs',
      group: 'Structure',
      icon: 'tab',
      defaults: { labels: 'For you, Following, Popular', active: 0 },
      fields: [
        { key: 'labels', label: 'Labels (comma separated)', type: 'text' },
        { key: 'active', label: 'Active tab', type: 'number', min: 0, max: 8 }
      ],
      html: function (p) {
        var active = Number(p.active) || 0;
        return '<div class="tabs-row">' + String(p.labels || '').split(',').map(function (label, i) {
          return '<div class="tab' + (i === active ? ' active' : '') + '">' + esc(label.trim()) + '</div>';
        }).join('') + '</div>';
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
        return '<article class="card ' + esc(p.variant || 'filled') + '">' + media +
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
        return '<div class="btn-row"><button class="btn ' + esc(p.variant || 'filled') + (p.full ? ' full' : '') + '">' +
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
        items: 'explore:Discover\nmap:Map\nbookmark:Saved\nperson:Profile',
        active: 0
      },
      fields: [
        { key: 'items', label: 'Items — one per line: icon:Label', type: 'textarea' },
        { key: 'active', label: 'Active item', type: 'number', min: 0, max: 8 }
      ],
      html: function (p) {
        var active = Number(p.active) || 0;
        var rows = String(p.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (line, i) {
          var idx = line.indexOf(':');
          var ico = idx > -1 ? line.slice(0, idx).trim() : 'circle';
          var label = idx > -1 ? line.slice(idx + 1).trim() : line;
          return '<div class="nav-item' + (i === active ? ' active' : '') + '">' +
            '<span class="nav-icon">' + S.icon(ico) + '</span><span>' + esc(label) + '</span></div>';
        }).join('');
        return '<div class="nav-bar">' + rows + '</div>';
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
