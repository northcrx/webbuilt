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
          ? '<button class="icon-btn" aria-label="Open navigation" data-ui-action="drawer">' + S.icon(p.leadingIcon) + '</button>'
          : '';
        var actHTML = actions.map(function (a) {
          if (a === 'avatar') return '<span class="avatar">AL</span>';
          var ui = a === 'search' ? 'search' : (a === 'more_vert' || a === 'more_horiz' ? 'menu' : '');
          return '<button class="icon-btn" aria-label="' + esc(a) + '"' +
            (ui ? ' data-ui-action="' + ui + '"' : '') + '>' + S.icon(a) + '</button>';
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
        active: 0,
        style: 'material'
      },
      fields: [
        { key: 'style', label: 'Design', type: 'select', options: [
          ['material', 'Material bar'],
          ['floating', 'Floating capsule'],
          ['compact', 'Compact icons'],
          ['minimal', 'Minimal underline'],
          ['glass', 'Frosted glass']
        ], hint: 'Picked here, applied to the bottom navigation on every screen.' },
        { key: 'items', label: 'Items - one per line: icon:Label', type: 'textarea' },
        { key: 'active', label: 'Active item', type: 'number', min: 0, max: 8 }
      ],
      html: function (p) {
        var active = Number(p.active) || 0;
        var variants = { material: 1, floating: 1, compact: 1, minimal: 1, glass: 1 };
        var style = variants[p.style] ? p.style : 'material';
        var rows = String(p.items || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (line, i) {
          var idx = line.indexOf(':');
          var ico = idx > -1 ? line.slice(0, idx).trim() : 'circle';
          var label = idx > -1 ? line.slice(idx + 1).trim() : line;
          var on = i === active;
          return '<button type="button" class="nav-item' + (on ? ' active' : '') + '" ' +
            'data-page-index="' + i + '" data-nav-index="' + i + '"' +
            (on ? ' aria-current="page"' : '') + '>' +
            '<span class="nav-icon">' + S.icon(ico) + '</span><span>' + esc(label) + '</span></button>';
        }).join('');
        return '<div class="nav-bar nav-' + style + '">' + rows + '</div>';
      }
    },

    /* ---------------------------- music ---------------------------- */

    musicplayer: {
      label: 'Now playing',
      group: 'Music',
      icon: 'play_circle',
      targets: ['app'],
      defaults: {
        title: 'Midnight Drive',
        artist: 'Nova Lane',
        album: 'Neon Hours',
        coverIcon: 'headphones',
        progress: 42,
        elapsed: '1:48',
        duration: '4:12',
        liked: true,
        playing: true
      },
      fields: [
        { key: 'title', label: 'Track title', type: 'text' },
        { key: 'artist', label: 'Artist', type: 'text' },
        { key: 'album', label: 'Album', type: 'text' },
        { key: 'coverIcon', label: 'Cover icon', type: 'icon' },
        { key: 'progress', label: 'Progress', type: 'range', min: 0, max: 100, step: 1, suffix: '%' },
        { key: 'elapsed', label: 'Elapsed time', type: 'text' },
        { key: 'duration', label: 'Duration', type: 'text' },
        { key: 'liked', label: 'Liked', type: 'toggle' },
        { key: 'playing', label: 'Playing', type: 'toggle' }
      ],
      html: function (p) {
        var progress = number(p.progress, 0, 0, 100);
        return '<div class="music-player">' +
          '<div class="mp-art">' + S.icon(p.coverIcon || 'headphones', 'mp-glyph') +
          '<button type="button" class="mp-fav' + (p.liked ? ' on' : '') + '" aria-label="' +
          (p.liked ? 'Remove from favourites' : 'Add to favourites') + '">' +
          S.icon(p.liked ? 'favorite' : 'favorite_border') + '</button></div>' +
          '<div class="mp-meta"><span class="mp-kicker">Now playing</span>' +
          '<h3 data-edit="title">' + esc(p.title) + '</h3>' +
          '<p><span data-edit="artist">' + esc(p.artist) + '</span> · <span data-edit="album">' +
          esc(p.album) + '</span></p></div>' +
          '<div class="mp-progress"><div class="mp-bar"><span style="width:' + progress + '%"></span></div>' +
          '<div class="mp-times"><span data-edit="elapsed">' + esc(p.elapsed) + '</span>' +
          '<span data-edit="duration">' + esc(p.duration) + '</span></div></div>' +
          '<div class="mp-controls">' +
          '<button type="button" class="mp-btn" aria-label="Shuffle">' + S.icon('shuffle') + '</button>' +
          '<button type="button" class="mp-btn" aria-label="Previous track">' + S.icon('skip_previous') + '</button>' +
          '<button type="button" class="mp-play" aria-label="' + (p.playing ? 'Pause' : 'Play') + '">' +
          S.icon(p.playing ? 'pause' : 'play_arrow') + '</button>' +
          '<button type="button" class="mp-btn" aria-label="Next track">' + S.icon('skip_next') + '</button>' +
          '<button type="button" class="mp-btn" aria-label="Repeat">' + S.icon('repeat') + '</button>' +
          '</div>' +
          '<div class="mp-foot">' +
          '<button type="button" class="mp-text">' + S.icon('lyrics') + '<span>Lyrics</span></button>' +
          '<button type="button" class="mp-text">' + S.icon('queue_music') + '<span>Up next</span></button>' +
          '</div></div>';
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

    miniplayer: {
      label: 'Mini player',
      group: 'Music',
      icon: 'graphic_eq',
      targets: ['app'],
      defaults: {
        title: 'Midnight Drive',
        artist: 'Nova Lane',
        coverIcon: 'headphones',
        progress: 64,
        playing: true,
        dock: false
      },
      fields: [
        { key: 'title', label: 'Track title', type: 'text' },
        { key: 'artist', label: 'Artist', type: 'text' },
        { key: 'coverIcon', label: 'Cover icon', type: 'icon' },
        { key: 'progress', label: 'Progress', type: 'range', min: 0, max: 100, step: 1, suffix: '%' },
        { key: 'playing', label: 'Playing', type: 'toggle' },
        { key: 'dock', label: 'Dock above bottom navigation', type: 'toggle' }
      ],
      html: function (p) {
        var progress = number(p.progress, 0, 0, 100);
        return '<div class="mini-player' + (p.dock ? ' is-docked' : '') + '" data-progress="' + progress + '">' +
          '<div class="mini-bar"><span style="width:' + progress + '%"></span></div>' +
          '<div class="mini-art">' + S.icon(p.coverIcon || 'headphones') + '</div>' +
          '<div class="mini-info"><div class="mini-title" data-edit="title">' + esc(p.title) + '</div>' +
          '<div class="mini-artist" data-edit="artist">' + esc(p.artist) + '</div></div>' +
          '<button type="button" class="mini-btn" aria-label="' + (p.playing ? 'Pause' : 'Play') + '">' +
          S.icon(p.playing ? 'pause' : 'play_arrow') + '</button>' +
          '<button type="button" class="mini-btn" aria-label="Next track">' + S.icon('skip_next') + '</button>' +
          '</div>';
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
        title: 'Preferences',
        items: 'notifications:Notifications | Push, email and in-app | switch:on\nfingerprint:Biometric unlock | Use your fingerprint to open the vault | switch:off\ndownload:Downloads | Wi-Fi only · 3 items | chevron\npalette:Appearance | Dark mode | badge:On'
      },
      fields: [
        { key: 'title', label: 'Group title', type: 'text' },
        { key: 'items', label: 'Rows — one per line: icon:Label | Subtitle | Trailing', type: 'textarea' }
      ],
      html: function (p) {
        var rows = lines(p.items).map(function (line) {
          var chunks = parts(line);
          var il = iconLabel(chunks[0]);
          var trail = chunks[2] || 'chevron';
          var trailHTML = '';
          if (trail.indexOf('switch') === 0) {
            trailHTML = '<span class="switch' + (trail.indexOf(':on') > -1 ? ' on' : '') + '"></span>';
          } else if (trail.indexOf('badge:') === 0) {
            trailHTML = '<span class="settings-badge">' + esc(trail.slice(6)) + '</span>';
          } else if (trail !== 'none') {
            trailHTML = '<span class="settings-chev">' + S.icon('chevron_right') + '</span>';
          }
          return '<div class="settings-row"><span class="settings-ico">' + S.icon(il.icon) + '</span>' +
            '<div class="settings-text"><div class="settings-name">' + esc(il.label) + '</div>' +
            '<div class="settings-sub">' + esc(chunks[1] || '') + '</div></div>' +
            '<span class="settings-trail">' + trailHTML + '</span></div>';
        }).join('');
        return '<div class="settings-card">' +
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
