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
      links: 'Shop, New in, Journal',
      cta: 'Bag · 2',
      ctaIcon: 'shopping_bag'
    },
    fields: [
      { key: 'brand', label: 'Brand name', type: 'text' },
      { key: 'logoIcon', label: 'Logo icon', type: 'icon' },
      { key: 'links', label: 'Links (comma separated)', type: 'text' },
      { key: 'cta', label: 'Button label', type: 'text' },
      { key: 'ctaIcon', label: 'Button icon', type: 'icon' }
    ],
    html: function (p) {
      var links = String(p.links || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean)
        .map(function (l) { return '<a href="#">' + esc(l) + '</a>'; }).join('');
      return '<header class="wnav"><div class="web-wrap">' +
        '<a class="wnav-brand" href="#"><span class="wnav-mark">' + S.icon(p.logoIcon) + '</span>' +
        '<span data-edit="brand">' + esc(p.brand) + '</span></a>' +
        '<nav class="wnav-links">' + links + '</nav>' +
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
})();
