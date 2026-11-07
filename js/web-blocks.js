/* Website blocks. Every block is a normal section that can be reordered. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  function rows(value) {
    return String(value || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
  }

  function parts(line, count) {
    var out = String(line || '').split('|');
    while (out.length < count) out.push('');
    return out.map(function (s) { return s.trim(); });
  }

  var WEB = ['web'];

  S.components.webnav = {
    label: 'Website nav',
    group: 'Website',
    icon: 'web_asset',
    targets: WEB,
    defaults: {
      brand: 'Aurora',
      logoIcon: 'auto_awesome',
      logoStyle: 'plain',
      logoColor: '',
      logoSize: 22,
      links: 'Shop, New in, Journal',
      dropdownStyle: 'clean',
      dropdownTheme: 'auto',
      dropdowns: 'Shop: All Products:NEW|shopping_bag:Browse our full catalog | Clothing|checkroom:Seasonal apparel & basics | Accessories|watch:Handcrafted jewelry & timepieces | Footwear|steps:Leather sneakers & loafers\nJournal: Stories|auto_stories:Behind the scenes & craft | Lookbook|photo_camera:Spring 2026 editorial | Interviews|mic:Conversations with creators',
      navWeight: '500',
      navSize: 13,
      cta: 'Bag · 2',
      ctaIcon: 'shopping_bag'
    },
    fields: [
      { key: 'brand', label: 'Brand name', type: 'text' },
      { key: 'logoIcon', label: 'Logo icon', type: 'icon' },
      { key: 'logoStyle', label: 'Logo icon style', type: 'select', options: [
        ['plain', 'Only icon (transparent / no background)'],
        ['badge', 'Rounded badge'],
        ['circle', 'Circle badge'],
        ['outlined', 'Outlined icon']
      ] },
      { key: 'logoColor', label: 'Logo icon color', type: 'color' },
      { key: 'logoSize', label: 'Logo icon size (px)', type: 'number', min: 14, max: 48 },
      { key: 'links', label: 'Links (comma separated or Label [Sub1, Sub2])', type: 'text' },
      { key: 'dropdownStyle', label: 'Dropdown menu design', type: 'select', options: [
        ['clean', 'Modern Clean Card (Theme adaptive)'],
        ['bento', 'Bento Garden Grid (2-Column cards with icons)'],
        ['glass', 'Frosted Glassmorphism'],
        ['minimal', 'Minimalist Floating List'],
        ['mega', 'Rich Mega Menu (Multi-column with categories)']
      ] },
      { key: 'dropdownTheme', label: 'Dropdown color theme', type: 'select', options: [
        ['auto', 'Auto (Match Website Canvas)'],
        ['light', 'Clean Light Surface'],
        ['dark', 'Deep Dark Surface'],
        ['accent', 'Accent Tinted Surface']
      ] },
      { key: 'dropdowns', label: 'Dropdown items (Label: Item:Badge|icon:Subtitle | Item2...)', type: 'textarea' },
      { key: 'navWeight', label: 'Nav font thickness', type: 'select', options: [
        ['300', 'Light (300)'],
        ['400', 'Regular (400)'],
        ['500', 'Medium (500)'],
        ['600', 'Semibold (600)'],
        ['700', 'Bold (700)'],
        ['800', 'Extra bold (800)']
      ] },
      { key: 'navSize', label: 'Nav font size (px)', type: 'number', min: 11, max: 20 },
      { key: 'cta', label: 'Button label', type: 'text' },
      { key: 'ctaIcon', label: 'Button icon', type: 'icon' }
    ],
    html: function (p) {
      var logoStyle = p.logoStyle || 'plain';
      var logoColor = p.logoColor ? 'color: ' + esc(p.logoColor) + ';' : '';
      var logoSize = p.logoSize ? 'font-size: ' + p.logoSize + 'px;' : '';
      var markStyle = (logoColor || logoSize) ? ' style="' + logoColor + logoSize + '"' : '';
      var ddMap = {};
      String(p.dropdowns || '').split('\n').forEach(function (line) {
        var idx = line.indexOf(':');
        if (idx > -1) {
          var name = line.slice(0, idx).trim().toLowerCase();
          var content = line.slice(idx + 1).trim();
          var sub;
          if (content.indexOf(';') > -1) {
            sub = content.split(';').map(function (s) { return s.trim(); }).filter(Boolean);
          } else if (content.indexOf(' | ') > -1 && (content.match(/\|/g) || []).length > (content.match(/\s+\|\s+/g) || []).length) {
            sub = content.split(/\s+\|\s+/).map(function (s) { return s.trim(); }).filter(Boolean);
          } else {
            sub = content.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
          }
          if (name && sub.length) ddMap[name] = sub;
        }
      });
      var navStyle = '';
      if (p.navWeight) navStyle += '--wnav-weight: ' + p.navWeight + '; font-weight: ' + p.navWeight + ';';
      if (p.navSize) navStyle += '--wnav-size: ' + p.navSize + 'px; font-size: ' + p.navSize + 'px;';
      var rawLinks = [];
      var currentLink = '';
      var inBracket = false;
      var linkStr = String(p.links || '');
      for (var ci = 0; ci < linkStr.length; ci++) {
        var ch = linkStr[ci];
        if (ch === '[') inBracket = true;
        else if (ch === ']') inBracket = false;
        if (ch === ',' && !inBracket) {
          if (currentLink.trim()) rawLinks.push(currentLink.trim());
          currentLink = '';
        } else {
          currentLink += ch;
        }
      }
      if (currentLink.trim()) rawLinks.push(currentLink.trim());
      var linksHtml = rawLinks.map(function (s) {
        var trimmed = s.trim();
        if (!trimmed) return '';
        var lower = trimmed.toLowerCase();
        var subItems = ddMap[lower];
        var bracketMatch = trimmed.match(/^([^\[]+)\[(.*)\]$/);
        if (bracketMatch) {
          trimmed = bracketMatch[1].trim();
          subItems = bracketMatch[2].split(',').map(function (it) { return it.trim(); }).filter(Boolean);
        }
        if (subItems && subItems.length) {
          var ddStyle = p.dropdownStyle || 'clean';
          var ddTheme = p.dropdownTheme || 'auto';
          var itemsHtml = subItems.map(function (item) {
            var raw = item.trim();
            var parts;
            if (raw.indexOf('/') > -1) {
              parts = raw.split('/');
            } else {
              parts = raw.split('|');
            }
            var left = (parts[0] || '').trim();
            var right = (parts[1] || '').trim();

            var lParts = left.split(':');
            var itemLabel = lParts[0].trim();
            var badge = lParts[1] ? lParts[1].trim() : '';

            var icon = '';
            var sub = '';
            if (right) {
              var rParts = right.split(':');
              icon = rParts[0].trim();
              sub = rParts[1] ? rParts[1].trim() : '';
            }

            var iconHtml = icon ? '<span class="wnav-dd-icon-box">' + S.icon(icon) + '</span>' : '';
            var badgeHtml = badge ? '<span class="wnav-dd-badge">' + esc(badge) + '</span>' : '';
            var infoHtml = '<div class="wnav-dd-info"><strong>' + esc(itemLabel) + '</strong>' +
              (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>';

            return '<a href="#" class="wnav-dd-link" data-nav-link="' + esc(itemLabel) + '" role="menuitem">' +
              iconHtml + infoHtml + badgeHtml + '</a>';
          }).join('');

          var megaFooter = (ddStyle === 'mega') ? '<div class="wnav-dd-footer"><span class="wnav-dd-footer-tag">New Season 2026</span><span>Free worldwide shipping on orders over $100 &rarr;</span></div>' : '';

          var dropHtml = '<div class="wnav-dropdown wnav-dd-' + esc(ddStyle) + '" data-style="' + esc(ddStyle) + '" data-theme="' + esc(ddTheme) + '" role="menu">' +
            '<div class="wnav-dd-grid">' + itemsHtml + '</div>' +
            megaFooter +
            '</div>';

          return '<div class="wnav-item">' +
            '<button type="button" class="wnav-dd-btn" data-nav-link="' + esc(trimmed) + '" aria-expanded="false">' +
            '<span>' + esc(trimmed) + '</span>' +
            '<span class="mi wnav-dd-arrow">expand_more</span>' +
            '</button>' + dropHtml + '</div>';
        }
        return '<div class="wnav-item"><a href="#" data-nav-link="' + esc(trimmed) + '">' + esc(trimmed) + '</a></div>';
      }).join('');
      return '<header class="wnav"><div class="web-wrap">' +
        '<a class="wnav-brand" href="#"><span class="wnav-mark ' + esc(logoStyle) + '"' + markStyle + '>' + S.icon(p.logoIcon) + '</span>' +
        '<span data-edit="brand">' + esc(p.brand) + '</span></a>' +
        '<nav class="wnav-links"' + (navStyle ? ' style="' + navStyle + '"' : '') + '>' + linksHtml + '</nav>' +
        '<button type="button" class="wnav-icon" data-ui-action="search" aria-label="Search">' + S.icon('search') + '</button>' +
        '<button type="button" class="wnav-icon" data-ui-action="drawer" aria-label="Open navigation">' + S.icon('menu') + '</button>' +
        '<button type="button" class="web-btn wnav-cta">' + (p.ctaIcon ? S.icon(p.ctaIcon) : '') +
        '<span data-edit="cta">' + esc(p.cta) + '</span></button>' +
        '</div></header>';
    }
  };

  S.components.webhero = {
    label: 'Website hero',
    group: 'Website',
    icon: 'view_carousel',
    targets: WEB,
    defaults: {
      kicker: 'New season · 2026',
      title: 'Everyday objects, quietly extraordinary.',
      text: 'Thoughtfully made homeware in honest materials — designed in Lisbon, built to outlive trends.',
      cta: 'Shop the collection',
      cta2: 'Our story',
      layout: 'split',
      icon: 'auto_awesome',
      card1: 'Free shipping over $80',
      card2: '4.9 · 2,400 reviews'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'textarea' },
      { key: 'text', label: 'Paragraph', type: 'textarea' },
      { key: 'cta', label: 'Primary button', type: 'text' },
      { key: 'cta2', label: 'Secondary button', type: 'text' },
      { key: 'layout', label: 'Layout', type: 'select', options: [['split', 'Split with art'], ['center', 'Centered']] },
      { key: 'icon', label: 'Art icon', type: 'icon' },
      { key: 'card1', label: 'Floating card 1', type: 'text' },
      { key: 'card2', label: 'Floating card 2', type: 'text' }
    ],
    html: function (p) {
      var center = p.layout === 'center';
      return '<section class="whero' + (center ? ' center' : '') + '"><div class="web-wrap"><div class="whero-grid">' +
        '<div class="whero-copy">' +
        '<span class="web-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' +
        '<h1 class="web-h1 whero-title" data-edit="title">' + esc(p.title) + '</h1>' +
        '<p class="web-lead" data-edit="text">' + esc(p.text) + '</p>' +
        '<div class="whero-actions">' +
        '<button class="web-btn"><span data-edit="cta">' + esc(p.cta) + '</span>' + S.icon('arrow_forward') + '</button>' +
        '<button class="web-btn ghost"><span data-edit="cta2">' + esc(p.cta2) + '</span></button>' +
        '</div>' +
        '<div class="whero-meta"><span><b>30 days</b> free returns</span><span><b>2-year</b> warranty</span><span><b>Carbon</b> neutral</span></div>' +
        '</div>' +
        '<div class="whero-art">' +
        '<span class="hero-glyph">' + S.icon(p.icon) + '</span>' +
        '<div class="whero-card c1"><span class="wc-ico">' + S.icon('local_shipping') + '</span>' + esc(p.card1) + '</div>' +
        '<div class="whero-card c2"><span class="wc-ico">' + S.icon('star') + '</span>' + esc(p.card2) + '</div>' +
        '</div>' +
        '</div></div></section>';
    }
  };

  S.components.weblogos = {
    label: 'Logo strip',
    group: 'Website',
    icon: 'view_week',
    targets: WEB,
    defaults: {
      label: 'Trusted by teams at',
      names: 'Kinfolk, Monocle, Dwell, Dezeen, Wallpaper'
    },
    fields: [
      { key: 'label', label: 'Small label', type: 'text' },
      { key: 'names', label: 'Brands (comma separated)', type: 'text' }
    ],
    html: function (p) {
      var names = String(p.names || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean)
        .map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('');
      return '<section class="wlogos"><div class="web-wrap">' +
        '<span class="wlogos-label" data-edit="label">' + esc(p.label) + '</span>' +
        '<div class="wlogos-names">' + names + '</div>' +
        '</div></section>';
    }
  };

  S.components.webfeatures = {
    label: 'Feature cards',
    group: 'Website',
    icon: 'grid_view',
    targets: WEB,
    defaults: {
      kicker: 'Why Aurora',
      title: 'Made to be lived with',
      text: 'Small details, considered for years of daily use.',
      items: 'eco|Honest materials|FSC oak, recycled aluminium and natural linen — nothing hidden.\nlocal_shipping|Free returns|Try it at home for 30 days. If it is not right, we collect it.\nschedule|Built to last|A two-year warranty and spare parts for everything we make.'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Intro', type: 'textarea' },
      { key: 'items', label: 'Cards — icon|Title|Text', type: 'textarea' }
    ],
    html: function (p) {
      var cards = rows(p.items).map(function (line) {
        var a = parts(line, 3);
        return '<article class="wfeat-card"><span class="wfeat-ico">' + S.icon(a[0] || 'check') + '</span>' +
          '<h3>' + esc(a[1]) + '</h3><p>' + esc(a[2]) + '</p></article>';
      }).join('');
      return '<section class="wfeat"><div class="web-wrap">' +
        '<div class="web-sec-head"><span class="web-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' +
        '<h2 class="web-h2" data-edit="title">' + esc(p.title) + '</h2>' +
        '<p data-edit="text">' + esc(p.text) + '</p></div>' +
        '<div class="wfeat-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webproducts = {
    label: 'Product grid',
    group: 'Commerce',
    icon: 'shopping_bag',
    targets: WEB,
    defaults: {
      kicker: 'The edit',
      title: 'Best sellers',
      text: 'The pieces our studio keeps coming back to.',
      items: 'light|Arc table lamp|$189|New\nweekend|Linen throw|$74|\ncoffee|Stoneware set|$56|Low stock\nchair|Oak lounge chair|$420|'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Intro', type: 'textarea' },
      { key: 'items', label: 'Products — icon|Name|Price|Badge', type: 'textarea' }
    ],
    html: function (p) {
      var cards = rows(p.items).map(function (line) {
        var a = parts(line, 4);
        return '<article class="wprod-card"><div class="wprod-thumb">' +
          (a[3] ? '<span class="wprod-badge">' + esc(a[3]) + '</span>' : '') +
          S.icon(a[0] || 'inventory_2') +
          '<button class="wprod-add" aria-label="Add to bag">' + S.icon('add') + '</button></div>' +
          '<div class="wprod-info"><div class="wprod-name">' + esc(a[1]) + '</div>' +
          '<div class="wprod-price">' + esc(a[2]) + '</div></div></article>';
      }).join('');
      return '<section class="wprod"><div class="web-wrap">' +
        '<div class="web-sec-head"><span class="web-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' +
        '<h2 class="web-h2" data-edit="title">' + esc(p.title) + '</h2>' +
        '<p data-edit="text">' + esc(p.text) + '</p></div>' +
        '<div class="wprod-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webplaylists = {
    label: 'Album row',
    group: 'Media',
    icon: 'album',
    targets: WEB,
    defaults: {
      kicker: 'Fresh this week',
      title: 'New & noteworthy',
      text: 'Records we cannot stop playing in the studio.',
      items: 'Golden Hour|Nia Sol|12 tracks\nLow Orbit|Kite Club|9 tracks\nPaper Rooms|Milo Fenn|14 tracks\nAfter Rain|Vela|8 tracks'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Intro', type: 'textarea' },
      { key: 'items', label: 'Albums — Title|Artist|Meta', type: 'textarea' }
    ],
    html: function (p) {
      var cards = rows(p.items).map(function (line) {
        var a = parts(line, 3);
        return '<article class="wplay-card"><div class="wplay-cover">' +
          '<span class="cover-glyph">' + S.icon('graphic_eq') + '</span>' +
          '<span class="cover-count">' + esc(a[2]) + '</span>' +
          '<span class="wplay-play">' + S.icon('play_arrow') + '</span></div>' +
          '<div class="wplay-title">' + esc(a[0]) + '</div>' +
          '<div class="wplay-sub">' + esc(a[1]) + '</div></article>';
      }).join('');
      return '<section class="wplay"><div class="web-wrap">' +
        '<div class="web-sec-head"><span class="web-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' +
        '<h2 class="web-h2" data-edit="title">' + esc(p.title) + '</h2>' +
        '<p data-edit="text">' + esc(p.text) + '</p></div>' +
        '<div class="wplay-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webposters = {
    label: 'Poster grid',
    group: 'Media',
    icon: 'movie',
    targets: WEB,
    defaults: {
      kicker: 'Now streaming',
      title: 'Trending this week',
      text: 'Four films everyone is talking about.',
      items: 'Afterlight|2026 · Sci-fi|8.4\nSalt & Static|2025 · Drama|7.9\nThe Long Quiet|2026 · Thriller|8.8\nNeon Orchard|2024 · Animation|8.1'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Intro', type: 'textarea' },
      { key: 'items', label: 'Posters — Title|Meta|Rating', type: 'textarea' }
    ],
    html: function (p) {
      var cards = rows(p.items).map(function (line) {
        var a = parts(line, 3);
        return '<article class="wpost-card"><div class="wpost-art">' +
          '<span class="poster-glyph">' + S.icon('movie') + '</span>' +
          '<span class="wpost-rate">★ ' + esc(a[2]) + '</span>' +
          '<h3>' + esc(a[0]) + '</h3><p>' + esc(a[1]) + '</p></div>' +
          '<div class="wpost-meta"><span>' + esc(a[1]) + '</span>' +
          '<button class="wprod-add" style="position:static;width:26px;height:26px" aria-label="Play">' + S.icon('play_arrow') + '</button></div>' +
          '</article>';
      }).join('');
      return '<section class="wpost"><div class="web-wrap">' +
        '<div class="web-sec-head"><span class="web-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' +
        '<h2 class="web-h2" data-edit="title">' + esc(p.title) + '</h2>' +
        '<p data-edit="text">' + esc(p.text) + '</p></div>' +
        '<div class="wpost-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webtesti = {
    label: 'Testimonial',
    group: 'Website',
    icon: 'format_quote',
    targets: WEB,
    defaults: {
      quote: 'The rare kind of design studio that removes things until only the useful parts are left. Our new site finally feels like us.',
      name: 'Maya Chen',
      role: 'Founder, Northlight'
    },
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' }
    ],
    html: function (p) {
      return '<section class="wtest"><div class="web-wrap"><div class="wtest-inner">' +
        '<span class="wtest-mark">' + S.icon('format_quote') + '</span>' +
        '<blockquote class="wtest-quote" data-edit="quote">' + esc(p.quote) + '</blockquote>' +
        '<div class="wtest-who"><span class="wtest-avatar">' + esc(U.initials(p.name)) + '</span>' +
        '<span><span class="wtest-name" data-edit="name">' + esc(p.name) + '</span>' +
        '<span class="wtest-role" data-edit="role" style="display:block">' + esc(p.role) + '</span></span></div>' +
        '</div></div></section>';
    }
  };

  S.components.webpricing = {
    label: 'Pricing tiers',
    group: 'Commerce',
    icon: 'sell',
    targets: WEB,
    defaults: {
      kicker: 'Pricing',
      title: 'Simple plans, no surprises',
      text: 'Start free. Upgrade when the team grows.',
      cta: 'Choose plan',
      plans: 'Starter|$0|/mo|3 projects;1 GB storage;Community support|0\nTeam|$19|/seat|Unlimited projects;50 GB storage;Priority support|1\nScale|$49|/seat|SSO & audit logs;Unlimited storage;Dedicated manager|0'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Intro', type: 'textarea' },
      { key: 'cta', label: 'Button label', type: 'text' },
      { key: 'plans', label: 'Plans — Name|Price|Period|Feat;Feat|Featured', type: 'textarea' }
    ],
    html: function (p) {
      var cards = rows(p.plans).map(function (line) {
        var a = parts(line, 5);
        var feats = String(a[3] || '').split(';').map(function (f) { return f.trim(); }).filter(Boolean)
          .map(function (f) { return '<li>' + S.icon('check') + '<span>' + esc(f) + '</span></li>'; }).join('');
        return '<article class="wprice-card' + (a[4] === '1' ? ' featured' : '') + '">' +
          (a[4] === '1' ? '<span class="wprice-tag">Most popular</span>' : '') +
          '<div class="wprice-name">' + esc(a[0]) + '</div>' +
          '<div class="wprice-amount">' + esc(a[1]) + '<span>' + esc(a[2]) + '</span></div>' +
          '<ul class="wprice-list">' + feats + '</ul>' +
          '<button class="web-btn ' + (a[4] === '1' ? '' : 'ghost') + '">' + esc(p.cta) + '</button>' +
          '</article>';
      }).join('');
      return '<section class="wprice"><div class="web-wrap">' +
        '<div class="web-sec-head" style="text-align:center;margin-left:auto;margin-right:auto">' +
        '<span class="web-kicker" data-edit="kicker">' + esc(p.kicker) + '</span>' +
        '<h2 class="web-h2" data-edit="title">' + esc(p.title) + '</h2>' +
        '<p data-edit="text">' + esc(p.text) + '</p></div>' +
        '<div class="wprice-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webcta = {
    label: 'CTA band',
    group: 'Website',
    icon: 'campaign',
    targets: WEB,
    defaults: {
      title: 'Join the studio list',
      text: 'One thoughtful email a month — new pieces, process notes, no noise.',
      cta: 'Subscribe',
      cta2: 'Read the journal',
      icon: 'mail'
    },
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'cta', label: 'Primary button', type: 'text' },
      { key: 'cta2', label: 'Secondary button', type: 'text' },
      { key: 'icon', label: 'Background icon', type: 'icon' }
    ],
    html: function (p) {
      return '<section class="wcta"><div class="web-wrap"><div class="wcta-inner">' +
        '<span class="wcta-glyph">' + S.icon(p.icon) + '</span>' +
        '<div><h2 data-edit="title">' + esc(p.title) + '</h2><p data-edit="text">' + esc(p.text) + '</p></div>' +
        '<div class="wcta-actions"><button class="web-btn light"><span data-edit="cta">' + esc(p.cta) + '</span></button>' +
        '<button class="web-btn ghost" style="border-color:rgba(255,255,255,.32);color:#fff"><span data-edit="cta2">' + esc(p.cta2) + '</span></button></div>' +
        '</div></div></section>';
    }
  };

  S.components.webfooter = {
    label: 'Website footer',
    group: 'Website',
    icon: 'dock_to_bottom',
    targets: WEB,
    defaults: {
      brand: 'Aurora',
      blurb: 'Quietly extraordinary objects for everyday rooms. Designed in Lisbon, shipped worldwide.',
      columns: 'Shop|Lighting, Furniture, Textiles\nStudio|About, Journal, Careers\nHelp|Shipping, Returns, Contact',
      legal: '© 2026 Aurora Studio · Privacy · Terms'
    },
    fields: [
      { key: 'brand', label: 'Brand name', type: 'text' },
      { key: 'blurb', label: 'Short paragraph', type: 'textarea' },
      { key: 'columns', label: 'Columns — Heading|Link, Link, Link', type: 'textarea' },
      { key: 'legal', label: 'Legal line', type: 'text' }
    ],
    html: function (p) {
      var cols = rows(p.columns).map(function (line) {
        var i = line.indexOf('|');
        var head = i > -1 ? line.slice(0, i).trim() : line;
        var links = (i > -1 ? line.slice(i + 1) : '').split(',').map(function (s) { return s.trim(); }).filter(Boolean)
          .map(function (l) { return '<a href="#">' + esc(l) + '</a>'; }).join('');
        return '<div class="wfoot-col"><h4>' + esc(head) + '</h4>' + links + '</div>';
      }).join('');
      return '<footer class="wfoot"><div class="web-wrap">' +
        '<div class="wfoot-grid">' +
        '<div><div class="wfoot-brand"><span class="wnav-mark">' + S.icon('auto_awesome') + '</span>' +
        '<span data-edit="brand">' + esc(p.brand) + '</span></div>' +
        '<p class="wfoot-blurb" data-edit="blurb">' + esc(p.blurb) + '</p></div>' +
        cols +
        '</div>' +
        '<div class="wfoot-bottom"><span data-edit="legal">' + esc(p.legal) + '</span>' +
        '<span class="wfoot-social">' + S.icon('public') + S.icon('photo_camera') + S.icon('alternate_email') + '</span></div>' +
        '</div></footer>';
    }
  };

  /* ------------------- NEW WEBSITE BLOCKS ------------------- */
  S.components.webbento = {
    label: 'Bento Grid',
    group: 'Website',
    icon: 'dashboard_customize',
    targets: WEB,
    defaults: {
      kicker: 'Platform Capabilities',
      title: 'Crafted for speed, clarity and delight',
      card1Title: 'Real-Time Sync',
      card1Text: 'Changes reflect instantly across preview, devices, and cloud exports with zero latency.',
      card1Tag: 'Instant 0ms',
      card2Title: 'Adaptive Themes',
      card2Text: 'Dynamic token switching with Material 3 and custom palettes.',
      card3Title: 'Multi-Device Ready',
      card3Text: 'Responsive layouts that fit mobile, tablet, and widescreen viewports perfectly.',
      card4Title: 'Native Code Export',
      card4Text: 'Clean Kotlin Jetpack Compose and semantic HTML ready to ship.',
      card4Metric: '99.8%'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'card1Title', label: 'Card 1 Title (Large)', type: 'text' },
      { key: 'card1Text', label: 'Card 1 Description', type: 'textarea' },
      { key: 'card1Tag', label: 'Card 1 Tag', type: 'text' },
      { key: 'card2Title', label: 'Card 2 Title', type: 'text' },
      { key: 'card2Text', label: 'Card 2 Description', type: 'textarea' },
      { key: 'card3Title', label: 'Card 3 Title', type: 'text' },
      { key: 'card3Text', label: 'Card 3 Description', type: 'textarea' },
      { key: 'card4Title', label: 'Card 4 Title', type: 'text' },
      { key: 'card4Metric', label: 'Card 4 Metric', type: 'text' },
      { key: 'card4Text', label: 'Card 4 Description', type: 'textarea' }
    ],
    html: function (p) {
      return '<section class="wbento"><div class="web-wrap">' +
        '<div class="wbento-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wbento-grid">' +
        '<div class="wb-card wb-lg"><span class="wb-badge">' + esc(p.card1Tag) + '</span><div class="wb-art"><span class="mi">bolt</span></div><h3>' + esc(p.card1Title) + '</h3><p>' + esc(p.card1Text) + '</p></div>' +
        '<div class="wb-card"><div class="wb-icon"><span class="mi">palette</span></div><h3>' + esc(p.card2Title) + '</h3><p>' + esc(p.card2Text) + '</p></div>' +
        '<div class="wb-card"><div class="wb-icon"><span class="mi">devices</span></div><h3>' + esc(p.card3Title) + '</h3><p>' + esc(p.card3Text) + '</p></div>' +
        '<div class="wb-card wb-span2"><div class="wb-stat-head"><span class="wb-big-metric">' + esc(p.card4Metric) + '</span><span class="wb-label">Precision Rating</span></div><h3>' + esc(p.card4Title) + '</h3><p>' + esc(p.card4Text) + '</p></div>' +
        '</div></div></section>';
    }
  };

  S.components.webherosplit = {
    label: 'Hero Split Art',
    group: 'Website',
    icon: 'splitscreen',
    targets: WEB,
    defaults: {
      badge: '✦ v2.4 Launch Edition',
      title: 'Design once. Ship natively everywhere.',
      lead: 'The unified visual UI builder that compiles production-grade Android Jetpack Compose, Web, and Extensions in seconds.',
      btn1: 'Start building free',
      btn2: 'Watch 2-min demo',
      proofText: 'Loved by 40,000+ engineers at Stripe, Airbnb & Vercel'
    },
    fields: [
      { key: 'badge', label: 'Pill badge', type: 'text' },
      { key: 'title', label: 'Headline', type: 'textarea' },
      { key: 'lead', label: 'Subtitle lead', type: 'textarea' },
      { key: 'btn1', label: 'Primary CTA', type: 'text' },
      { key: 'btn2', label: 'Secondary CTA', type: 'text' },
      { key: 'proofText', label: 'Social proof text', type: 'text' }
    ],
    html: function (p) {
      return '<section class="whero-split"><div class="web-wrap"><div class="whs-grid">' +
        '<div class="whs-left">' +
        '<div class="whs-badge"><span class="whs-sparkle">✦</span><span>' + esc(p.badge) + '</span></div>' +
        '<h1 class="web-h1 whs-title">' + esc(p.title) + '</h1>' +
        '<p class="web-lead whs-lead">' + esc(p.lead) + '</p>' +
        '<div class="whs-cta-row"><button class="web-btn primary"><span>' + esc(p.btn1) + '</span><span class="mi">arrow_forward</span></button><button class="web-btn ghost"><span class="mi">play_circle</span><span>' + esc(p.btn2) + '</span></button></div>' +
        '<div class="whs-proof"><div class="whs-avatars"><span class="av a1"></span><span class="av a2"></span><span class="av a3"></span><span class="av a4"></span></div><span>' + esc(p.proofText) + '</span></div>' +
        '</div>' +
        '<div class="whs-right"><div class="whs-mockup-frame"><div class="whs-mock-header"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="whs-mock-title">MainActivity.kt — Compose</span></div><div class="whs-code-preview"><pre><code>@Composable\nfun MainScreen() {\n    Scaffold(\n        topBar = { CustomTopBar() },\n        bottomBar = { CustomBottomBar() }\n    ) { padding ->\n        LazyColumn(Modifier.padding(padding)) {\n            item { HeroBanner() }\n            item { BentoGrid() }\n        }\n    }\n}</code></pre></div><div class="whs-floating-chip"><span class="mi">check_circle</span><span>Jetpack Compose 1.7</span></div></div></div>' +
        '</div></div></section>';
    }
  };

  S.components.webteam = {
    label: 'Team Grid',
    group: 'Website',
    icon: 'group',
    targets: WEB,
    defaults: {
      kicker: 'Leadership & Engineering',
      title: 'Built by designers, crafted for builders',
      members: 'Elena Rostova | Lead Architect | Ex-DeepMind UI systems\nMarcus Vance | Principal Designer | Design tokens & typography\nAria Chen | Android Core Engineer | Compose & vector renderer\nDavid Kim | Developer Experience | Multi-platform toolchains'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'members', label: 'Members (Name | Role | Bio)', type: 'textarea' }
    ],
    html: function (p) {
      var memberCards = rows(p.members).map(function (line, idx) {
        var p = parts(line, 3);
        var initials = p[0].split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
        return '<div class="wt-card"><div class="wt-avatar-wrap"><div class="wt-avatar wt-c' + (idx % 4 + 1) + '">' + esc(initials) + '</div></div>' +
          '<h3 class="wt-name">' + esc(p[0]) + '</h3>' +
          '<span class="wt-role">' + esc(p[1]) + '</span>' +
          '<p class="wt-bio">' + esc(p[2]) + '</p>' +
          '<div class="wt-socials"><a href="#"><span class="mi">alternate_email</span></a><a href="#"><span class="mi">public</span></a></div>' +
          '</div>';
      }).join('');
      return '<section class="wteam"><div class="web-wrap">' +
        '<div class="wteam-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wteam-grid">' + memberCards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webblog = {
    label: 'Blog Cards',
    group: 'Website',
    icon: 'article',
    targets: WEB,
    defaults: {
      kicker: 'Engineering Insights',
      title: 'Latest from our architecture lab',
      posts: 'Architecture | Compiling Visual Tokens to Jetpack Compose Material 3 | 6 min read · Nov 2026\nPerformance | Achieving 60 FPS in Complex Android LazyColumns | 4 min read · Oct 2026\nDesign Systems | VectorDrawable vs Lucide SVG Asset Workflows | 5 min read · Oct 2026'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'posts', label: 'Posts (Category | Title | Meta)', type: 'textarea' }
    ],
    html: function (p) {
      var cards = rows(p.posts).map(function (line, idx) {
        var pt = parts(line, 3);
        return '<article class="wb-article-card">' +
          '<div class="wb-art-thumb wb-bg' + (idx % 3 + 1) + '"><span class="wb-category">' + esc(pt[0]) + '</span></div>' +
          '<div class="wb-article-body">' +
          '<span class="wb-meta">' + esc(pt[2]) + '</span>' +
          '<h3 class="wb-art-title"><a href="#">' + esc(pt[1]) + '</a></h3>' +
          '<span class="wb-read-more">Read article <span class="mi">arrow_forward</span></span>' +
          '</div></article>';
      }).join('');
      return '<section class="wblog"><div class="web-wrap">' +
        '<div class="wblog-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wblog-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webnewsletter = {
    label: 'Newsletter Banner',
    group: 'Website',
    icon: 'mark_email_read',
    targets: WEB,
    defaults: {
      title: 'Stay ahead of modern UI frameworks',
      lead: 'Weekly deep-dives into Android Compose architecture, design compilers, and production UI patterns.',
      placeholder: 'Enter your work email...',
      btn: 'Subscribe',
      note: 'No spam, ever. Unsubscribe with one click anytime.'
    },
    fields: [
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'lead', label: 'Subtitle lead', type: 'textarea' },
      { key: 'placeholder', label: 'Input placeholder', type: 'text' },
      { key: 'btn', label: 'Button text', type: 'text' },
      { key: 'note', label: 'Privacy note', type: 'text' }
    ],
    html: function (p) {
      return '<section class="wnewsletter"><div class="web-wrap"><div class="wn-card">' +
        '<div class="wn-icon"><span class="mi">outgoing_mail</span></div>' +
        '<h2 class="web-h2 wn-title">' + esc(p.title) + '</h2>' +
        '<p class="web-lead wn-lead">' + esc(p.lead) + '</p>' +
        '<form class="wn-form" onsubmit="return false;">' +
        '<input type="email" class="wn-input" placeholder="' + esc(p.placeholder) + '" required>' +
        '<button class="web-btn primary wn-btn"><span>' + esc(p.btn) + '</span><span class="mi">send</span></button>' +
        '</form>' +
        '<small class="wn-note">' + esc(p.note) + '</small>' +
        '</div></div></section>';
    }
  };

  S.components.webpricingtable = {
    label: 'Pricing Comparison',
    group: 'Website',
    icon: 'table_chart',
    targets: WEB,
    defaults: {
      kicker: 'Compare Plans',
      title: 'Transparent pricing for developers & teams',
      col1: 'Hobby | Free | Unlimited local exports, Web HTML/CSS',
      col2: 'Pro | $29/mo | Jetpack Compose, VectorDrawable, Full Studio Project',
      col3: 'Team | $79/mo | Multi-seat design spec sync, Custom Design Tokens'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'col1', label: 'Column 1 (Plan | Price | Features)', type: 'text' },
      { key: 'col2', label: 'Column 2 (Plan | Price | Features)', type: 'text' },
      { key: 'col3', label: 'Column 3 (Plan | Price | Features)', type: 'text' }
    ],
    html: function (p) {
      var c1 = parts(p.col1, 3);
      var c2 = parts(p.col2, 3);
      var c3 = parts(p.col3, 3);
      return '<section class="wpricing-table"><div class="web-wrap">' +
        '<div class="wpt-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wpt-grid">' +
        '<div class="wpt-card"><h3>' + esc(c1[0]) + '</h3><div class="wpt-price">' + esc(c1[1]) + '</div><p>' + esc(c1[2]) + '</p><button class="web-btn ghost w-100">Get Started</button></div>' +
        '<div class="wpt-card popular"><div class="wpt-ribbon">Most Popular</div><h3>' + esc(c2[0]) + '</h3><div class="wpt-price">' + esc(c2[1]) + '</div><p>' + esc(c2[2]) + '</p><button class="web-btn primary w-100">Start 14-day trial</button></div>' +
        '<div class="wpt-card"><h3>' + esc(c3[0]) + '</h3><div class="wpt-price">' + esc(c3[1]) + '</div><p>' + esc(c3[2]) + '</p><button class="web-btn ghost w-100">Contact Sales</button></div>' +
        '</div></div></section>';
    }
  };

  S.components.webcta = {
    label: 'Call to Action',
    group: 'Website',
    icon: 'campaign',
    targets: WEB,
    defaults: {
      kicker: 'Ready to build?',
      title: 'Turn your design ideas into native Android code today.',
      cta1: 'Get Started Free',
      cta2: 'Explore Documentation'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'cta1', label: 'Primary button', type: 'text' },
      { key: 'cta2', label: 'Secondary button', type: 'text' }
    ],
    html: function (p) {
      return '<section class="wcta"><div class="web-wrap"><div class="wcta-box">' +
        '<span class="web-kicker">' + esc(p.kicker) + '</span>' +
        '<h2 class="wcta-title">' + esc(p.title) + '</h2>' +
        '<div class="wcta-actions">' +
        '<button class="web-btn primary large"><span>' + esc(p.cta1) + '</span><span class="mi">rocket_launch</span></button>' +
        '<button class="web-btn ghost large"><span>' + esc(p.cta2) + '</span></button>' +
        '</div></div></div></section>';
    }
  };

  S.components.websteps = {
    label: 'Steps / Timeline',
    group: 'Website',
    icon: 'linear_scale',
    targets: WEB,
    defaults: {
      kicker: 'Workflow',
      title: 'From blank canvas to production APK in 3 steps',
      steps: '01 | Visual Canvas Prototyping | Drag and drop blocks, customize tokens, tweak typography and test live in phone preview.\n02 | Instant Architectural Validation | The compiler validates state flows, icon assets, and Material 3 design tokens.\n03 | One-Click Studio Project Export | Download a ready-to-run Android Studio project with settings.gradle.kts and Compose code.'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'steps', label: 'Steps (Number | Title | Detail)', type: 'textarea' }
    ],
    html: function (p) {
      var stepCards = rows(p.steps).map(function (line) {
        var pt = parts(line, 3);
        return '<div class="ws-step"><div class="ws-num">' + esc(pt[0]) + '</div>' +
          '<h3 class="ws-title">' + esc(pt[1]) + '</h3>' +
          '<p class="ws-detail">' + esc(pt[2]) + '</p></div>';
      }).join('');
      return '<section class="wsteps"><div class="web-wrap">' +
        '<div class="wsteps-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wsteps-grid">' + stepCards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webcountdown = {
    label: 'Countdown Banner',
    group: 'Website',
    icon: 'hourglass_top',
    targets: WEB,
    defaults: {
      kicker: 'Limited Time Event',
      title: 'Spring Architecture Release Launch',
      days: '04',
      hours: '18',
      minutes: '32',
      seconds: '50',
      btn: 'Claim Access'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'days', label: 'Days', type: 'text' },
      { key: 'hours', label: 'Hours', type: 'text' },
      { key: 'minutes', label: 'Minutes', type: 'text' },
      { key: 'seconds', label: 'Seconds', type: 'text' },
      { key: 'btn', label: 'CTA label', type: 'text' }
    ],
    html: function (p) {
      return '<section class="wcountdown"><div class="web-wrap"><div class="wcd-box">' +
        '<div class="wcd-copy"><span class="web-kicker">' + esc(p.kicker) + '</span><h3>' + esc(p.title) + '</h3></div>' +
        '<div class="wcd-timer">' +
        '<div class="wcd-unit"><span class="wcd-val">' + esc(p.days) + '</span><span class="wcd-lbl">Days</span></div>' +
        '<div class="wcd-colon">:</div>' +
        '<div class="wcd-unit"><span class="wcd-val">' + esc(p.hours) + '</span><span class="wcd-lbl">Hours</span></div>' +
        '<div class="wcd-colon">:</div>' +
        '<div class="wcd-unit"><span class="wcd-val">' + esc(p.minutes) + '</span><span class="wcd-lbl">Mins</span></div>' +
        '<div class="wcd-colon">:</div>' +
        '<div class="wcd-unit"><span class="wcd-val">' + esc(p.seconds) + '</span><span class="wcd-lbl">Secs</span></div>' +
        '</div>' +
        '<button class="web-btn primary">' + esc(p.btn) + '</button>' +
        '</div></div></section>';
    }
  };

  S.components.webannouncement = {
    label: 'Top Announcement',
    group: 'Website',
    icon: 'announcement',
    targets: WEB,
    defaults: {
      badge: 'NEW',
      text: 'Droid Lab 2.0 with Jetpack Compose Export & VectorDrawable support is live!',
      link: 'Learn more'
    },
    fields: [
      { key: 'badge', label: 'Badge', type: 'text' },
      { key: 'text', label: 'Message', type: 'text' },
      { key: 'link', label: 'Link label', type: 'text' }
    ],
    html: function (p) {
      return '<div class="wannouncement"><div class="web-wrap"><div class="wa-content">' +
        '<span class="wa-badge">' + esc(p.badge) + '</span>' +
        '<span class="wa-text">' + esc(p.text) + '</span>' +
        '<a href="#" class="wa-link">' + esc(p.link) + ' <span class="mi">arrow_forward</span></a>' +
        '</div></div></div>';
    }
  };

  S.components.webcookienotice = {
    label: 'Cookie Banner',
    group: 'Website',
    icon: 'cookie',
    targets: WEB,
    defaults: {
      title: 'We respect your privacy',
      text: 'We use cookies and telemetry tokens to deliver optimal compiler performance and analytics.',
      acceptBtn: 'Accept all',
      prefBtn: 'Preferences'
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'text', label: 'Notice text', type: 'textarea' },
      { key: 'acceptBtn', label: 'Accept button', type: 'text' },
      { key: 'prefBtn', label: 'Preferences button', type: 'text' }
    ],
    html: function (p) {
      return '<div class="wcookie-notice"><div class="wcn-content">' +
        '<div class="wcn-icon"><span class="mi">cookie</span></div>' +
        '<div class="wcn-text"><strong>' + esc(p.title) + '</strong><p>' + esc(p.text) + '</p></div>' +
        '<div class="wcn-actions"><button class="web-btn primary mini">' + esc(p.acceptBtn) + '</button><button class="web-btn ghost mini">' + esc(p.prefBtn) + '</button></div>' +
        '</div></div>';
    }
  };


  S.components.webcomparison = {
    label: 'Comparison Table',
    group: 'Website',
    icon: 'compare_arrows',
    targets: WEB,
    defaults: {
      kicker: 'Why Droid Lab',
      title: 'Built differently from traditional builders',
      feat1: 'Native Jetpack Compose Export | Yes (100% Kotlin DSL) | No (HTML wrapper only)',
      feat2: 'VectorDrawable Conversion | Automated SVG pipeline | Manual XML conversion',
      feat3: 'Material 3 Design Tokens | Live token compilation | Hardcoded CSS styles',
      feat4: 'Export Complete Project | Instant Gradle project | Fragmented code snippets'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'feat1', label: 'Feature 1 (Name | Us | Others)', type: 'text' },
      { key: 'feat2', label: 'Feature 2 (Name | Us | Others)', type: 'text' },
      { key: 'feat3', label: 'Feature 3 (Name | Us | Others)', type: 'text' },
      { key: 'feat4', label: 'Feature 4 (Name | Us | Others)', type: 'text' }
    ],
    html: function (p) {
      var rowsHtml = [p.feat1, p.feat2, p.feat3, p.feat4].map(function (line) {
        var pt = parts(line, 3);
        return '<div class="wcomp-row"><span class="wcomp-name">' + esc(pt[0]) + '</span><span class="wcomp-us"><span class="mi">check_circle</span>' + esc(pt[1]) + '</span><span class="wcomp-them"><span class="mi">cancel</span>' + esc(pt[2]) + '</span></div>';
      }).join('');
      return '<section class="wcomparison"><div class="web-wrap">' +
        '<div class="wcomp-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wcomp-table"><div class="wcomp-header"><span>Capability</span><span>Droid Lab</span><span>Others</span></div>' + rowsHtml + '</div>' +
        '</div></section>';
    }
  };

  S.components.webpress = {
    label: 'Press & Media',
    group: 'Website',
    icon: 'newspaper',
    targets: WEB,
    defaults: {
      kicker: 'In The News',
      quote: '“Droid Lab is bridging the gap between visual design and native Android Compose development with unmatched elegance.”',
      author: 'TechCrunch · Developer Tools Review',
      press: 'Wired, Forbes, The Verge, GitHub Blog, Android Police'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'quote', label: 'Featured quote', type: 'textarea' },
      { key: 'author', label: 'Quote attribution', type: 'text' },
      { key: 'press', label: 'Press logos (comma separated)', type: 'text' }
    ],
    html: function (p) {
      var logos = String(p.press || '').split(',').map(function (s) {
        return '<span class="wp-logo-pill">' + esc(s.trim()) + '</span>';
      }).join('');
      return '<section class="wpress"><div class="web-wrap">' +
        '<span class="web-kicker">' + esc(p.kicker) + '</span>' +
        '<blockquote class="wp-quote">' + esc(p.quote) + '</blockquote>' +
        '<cite class="wp-author">' + esc(p.author) + '</cite>' +
        '<div class="wp-logos">' + logos + '</div>' +
        '</div></section>';
    }
  };

  S.components.webreviews = {
    label: 'Review Grid',
    group: 'Website',
    icon: 'star',
    targets: WEB,
    defaults: {
      kicker: 'Wall of Love',
      title: 'Loved by developers building for millions',
      r1: 'Sarah Jenkins | Lead Mobile Dev at Finova | Droid Lab reduced our sprint mockup-to-Compose cycle from 3 days to 20 minutes.',
      r2: 'Kenji Sato | Founder & Designer | The VectorDrawable exporter preserves stroke widths perfectly. No more manual SVG fixes.',
      r3: 'Liam O\'Connor | Staff Android Engineer | Exporting a complete Gradle Kotlin DSL project with themes and navigation ready to run is pure magic.'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'r1', label: 'Review 1 (Name | Role | Text)', type: 'textarea' },
      { key: 'r2', label: 'Review 2 (Name | Role | Text)', type: 'textarea' },
      { key: 'r3', label: 'Review 3 (Name | Role | Text)', type: 'textarea' }
    ],
    html: function (p) {
      var cards = [p.r1, p.r2, p.r3].map(function (line) {
        var pt = parts(line, 3);
        return '<div class="wrev-card">' +
          '<div class="wrev-stars"><span class="mi">star</span><span class="mi">star</span><span class="mi">star</span><span class="mi">star</span><span class="mi">star</span></div>' +
          '<p class="wrev-text">' + esc(pt[2]) + '</p>' +
          '<div class="wrev-meta"><strong>' + esc(pt[0]) + '</strong><small>' + esc(pt[1]) + '</small></div>' +
          '</div>';
      }).join('');
      return '<section class="wreviews"><div class="web-wrap">' +
        '<div class="wrev-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wrev-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webgallery = {
    label: 'Portfolio Gallery',
    group: 'Website',
    icon: 'photo_library',
    targets: WEB,
    defaults: {
      kicker: 'Showcase',
      title: 'Designed with Droid Lab',
      items: 'Music Player UI:Streaming Hi-Fi:msr:graphic_eq\nCrypto Wallet:Web3 Multi-Chain:msr:account_balance_wallet\nFitness Tracker:Health Metrics:msr:directions_run\nMinimalist Reader:Typography:msr:menu_book'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'items', label: 'Items (Title:Category:Icon)', type: 'textarea' }
    ],
    html: function (p) {
      var cards = rows(p.items).map(function (line, idx) {
        var pt = line.split(':');
        return '<div class="wgal-card wgal-bg' + (idx % 4 + 1) + '">' +
          '<div class="wgal-icon">' + S.icon(pt[2] || 'image') + '</div>' +
          '<div class="wgal-info"><strong>' + esc(pt[0] || 'Project') + '</strong><small>' + esc(pt[1] || 'Design') + '</small></div>' +
          '</div>';
      }).join('');
      return '<section class="wgallery"><div class="web-wrap">' +
        '<div class="wgal-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wgal-grid">' + cards + '</div>' +
        '</div></section>';
    }
  };

  S.components.webcareers = {
    label: 'Careers List',
    group: 'Website',
    icon: 'work',
    targets: WEB,
    defaults: {
      kicker: 'Join The Team',
      title: 'Shape the future of developer tools',
      jobs: 'Senior Android Compiler Engineer | Remote · Core Team | Full-time\nDesign Systems Lead | Remote · Product | Full-time\nDeveloper Relations Advocate | San Francisco / Remote | Full-time'
    },
    fields: [
      { key: 'kicker', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'jobs', label: 'Jobs (Title | Location | Type)', type: 'textarea' }
    ],
    html: function (p) {
      var jobRows = rows(p.jobs).map(function (line) {
        var pt = parts(line, 3);
        return '<div class="wjob-row">' +
          '<div class="wjob-left"><strong>' + esc(pt[0]) + '</strong><small>' + esc(pt[1]) + ' · ' + esc(pt[2]) + '</small></div>' +
          '<button class="web-btn ghost mini">Apply now <span class="mi">arrow_forward</span></button>' +
          '</div>';
      }).join('');
      return '<section class="wcareers"><div class="web-wrap">' +
        '<div class="wjob-head"><span class="web-kicker">' + esc(p.kicker) + '</span><h2 class="web-h2">' + esc(p.title) + '</h2></div>' +
        '<div class="wjob-list">' + jobRows + '</div>' +
        '</div></section>';
    }
  };

  S.components.webproductcard = {
    label: 'Product Showcase Card',
    group: 'Website',
    icon: 'shopping_cart',
    targets: WEB,
    defaults: {
      tag: 'BESTSELLER',
      title: 'Studio Hi-Fi Wireless Headphones',
      price: '$249',
      oldPrice: '$299',
      rating: '4.9 (420 reviews)',
      colors: '#1e1b2e,#8B6CF6,#7EF0C2'
    },
    fields: [
      { key: 'tag', label: 'Tag badge', type: 'text' },
      { key: 'title', label: 'Product title', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'oldPrice', label: 'Strikethrough price', type: 'text' },
      { key: 'rating', label: 'Rating string', type: 'text' },
      { key: 'colors', label: 'Color swatches (comma separated)', type: 'text' }
    ],
    html: function (p) {
      var swatches = String(p.colors || '').split(',').map(function (c) {
        return '<span class="wp-color-dot" style="background:' + esc(c.trim()) + '"></span>';
      }).join('');
      return '<div class="wprod-card-wrap"><div class="web-wrap"><div class="wprod-card">' +
        '<div class="wprod-visual"><span class="wprod-badge">' + esc(p.tag) + '</span><span class="mi wprod-icon">headphones</span></div>' +
        '<div class="wprod-body">' +
        '<div class="wprod-meta"><span class="wprod-rating"><span class="mi">star</span>' + esc(p.rating) + '</span><div class="wprod-colors">' + swatches + '</div></div>' +
        '<h3 class="wprod-title">' + esc(p.title) + '</h3>' +
        '<div class="wprod-price-row"><span class="wprod-price">' + esc(p.price) + '</span><del class="wprod-old-price">' + esc(p.oldPrice) + '</del><button class="web-btn primary mini"><span class="mi">shopping_bag</span>Add to Cart</button></div>' +
        '</div></div></div></div>';
    }
  };

})();
