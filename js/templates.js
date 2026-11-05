/* Targets, starter templates and the default project state. */
(function () {
  var S = window.Studio = window.Studio || {};

  function b(type, overrides) {
    return S.makeBlock(type, overrides || {});
  }

  function screen(list) {
    return list.filter(Boolean);
  }

  S.targets = {
    app: {
      id: 'app',
      label: 'Android app',
      short: 'App',
      icon: 'smartphone',
      stageLabel: 'Phone preview',
      devices: [
        { id: 'phone-360', label: 'Compact phone', width: 360, height: 800, icon: 'smartphone' },
        { id: 'phone-390', label: 'Phone', width: 390, height: 844, icon: 'smartphone' },
        { id: 'phone-412', label: 'Large phone', width: 412, height: 915, icon: 'smartphone' },
        { id: 'tablet', label: 'Tablet', width: 800, height: 1280, icon: 'tablet_mac' },
        { id: 'foldable', label: 'Foldable', width: 717, height: 1024, icon: 'devices_fold' }
      ],
      device: { width: 390, height: 844, statusBar: true, gestureBar: true, preset: 'phone-390' },
      file: 'droidlab-app.html',
      url: 'droidlab.app'
    },
    web: {
      id: 'web',
      label: 'Website',
      short: 'Website',
      icon: 'language',
      stageLabel: 'Website preview',
      devices: [
        { id: 'mobile', label: 'Mobile', width: 390, height: 844, icon: 'smartphone' },
        { id: 'tablet', label: 'Tablet', width: 820, height: 1180, icon: 'tablet_mac' },
        { id: 'desktop', label: 'Desktop', width: 1280, height: 820, icon: 'desktop_windows' }
      ],
      device: { width: 1280, height: 820, statusBar: false, gestureBar: false, preset: 'desktop' },
      file: 'droidlab-website.html',
      url: 'aurora.studio'
    },
    ext: {
      id: 'ext',
      label: 'Chrome extension',
      short: 'Extension',
      icon: 'extension',
      stageLabel: 'Extension preview',
      devices: [
        { id: 'popup', label: 'Popup', width: 380, height: 580, icon: 'extension' },
        { id: 'sidepanel', label: 'Side panel', width: 400, height: 900, icon: 'view_sidebar' },
        { id: 'options', label: 'Options page', width: 800, height: 600, icon: 'settings' }
      ],
      device: { width: 380, height: 580, statusBar: false, gestureBar: false, preset: 'popup' },
      file: 'droidlab-extension.html',
      url: 'chrome-extension://popup.html'
    }
  };

  /* Device presets for the active canvas. */
  S.targetDevices = function (target) {
    return (S.targets[target] || S.targets.app).devices || [];
  };

  /* Resolve the preset that matches a saved device. Width/height win over a
     stale preset id, so a hand-resized canvas is not mistaken for a preset. */
  S.matchDevice = function (target, device) {
    if (!device) return null;
    var list = S.targetDevices(target);
    var width = Number(device.width);
    var height = Number(device.height);
    var exact = list.filter(function (p) {
      return p.width === width && p.height === height;
    })[0];
    if (exact) return exact;
    if (device.preset) {
      var named = list.filter(function (p) { return p.id === device.preset; })[0];
      if (named && named.width === width && named.height === height) return named;
    }
    return null;
  };

  S.baseTheme = function () {
    return {
      primary: '#6750A4',
      radius: 18,
      density: 'normal',
      dark: false,
      fonts: { ui: 'Inter', display: 'Plus Jakarta Sans' },
      type: { size: 15, weight: 400, spacing: 0 },
      icons: { weight: 400, fill: 0, stroke: 1.8 }
    };
  };

  S.templates = {
    app: [
      {
        id: 'discover',
        label: 'Discover',
        icon: 'explore',
        theme: {},
        build: function () { return S.appDemoScreen(); }
      },
      {
        id: 'market',
        label: 'Market',
        icon: 'storefront',
        theme: {
          primary: '#B45309',
          radius: 20,
          dark: false,
          fonts: { ui: 'Figtree', display: 'Fraunces' }
        },
        build: function () {
          return screen([
            b('appbar', { title: 'Market', variant: 'large', leadingIcon: 'menu', actions: 'shopping_cart, more_vert', elevated: false }),
            b('searchbar', { placeholder: 'Search produce, pantry, home', avatar: false }),
            b('chips', { labels: 'All, Fresh, Pantry, Home', selected: 0 }),
            b('hero', { kicker: 'Seasonal box', title: 'Autumn harvest', subtitle: 'Twelve farm-direct staples, delivered Thursday.', icon: 'eco', height: 190 }),
            b('section', { title: "Today's picks", action: 'See all' }),
            b('card', { variant: 'elevated', title: 'Stone fruit crate', body: 'Peaches, plums and figs from the coast — picked this morning.', media: true, mediaIcon: 'nutrition', actions: 'Add to bag, Details' }),
            b('list', {
              items: 'Sourdough loaf | $6.50 · Baked at 6am\nCold-pressed olive oil | $18.00 · 500 ml\nFarm eggs | $5.20 · Half dozen',
              leading: 'icon', leadingIcon: 'shopping_basket', trailing: 'badge'
            }),
            b('button', { label: 'Checkout · $29.70', variant: 'filled', icon: 'arrow_forward', full: true }),
            b('bottomnav', { items: 'storefront:Shop\nsearch:Discover\nreceipt_long:Orders\nperson:Account', active: 0 })
          ]);
        }
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: 'account_circle',
        theme: {
          primary: '#0F766E',
          radius: 16,
          dark: false,
          fonts: { ui: 'DM Sans', display: 'DM Sans' }
        },
        build: function () {
          return screen([
            b('appbar', { title: 'Profile', variant: 'center', leading: false, actions: 'settings', elevated: false }),
            b('hero', { kicker: 'Studio member', title: 'Alex Rivera', subtitle: 'Product designer · Lisbon', icon: 'person', height: 160 }),
            b('section', { title: 'Your activity', action: '' }),
            b('progress', { label: 'Profile completeness', value: 78 }),
            b('list', {
              items: 'Saved places | 24 collections\nTrip drafts | 3 in progress\nDownloads | 1.2 GB offline',
              leading: 'avatar', trailing: 'chevron'
            }),
            b('switchrow', { title: 'Offline maps', subtitle: 'Keep Lisbon available offline', on: true }),
            b('switchrow', { title: 'Weekly digest', subtitle: 'A Sunday email with new places', on: false }),
            b('button', { label: 'Edit profile', variant: 'outlined', icon: 'edit', full: true })
          ]);
        }
      },
      {
        id: 'music',
        label: 'Music',
        icon: 'headphones',
        theme: {
          primary: '#7C3AED',
          radius: 22,
          dark: true,
          fonts: { ui: 'Outfit', display: 'Outfit' }
        },
        build: function () {
          return screen([
            b('appbar', { title: 'Listen', variant: 'large', actions: 'search, more_vert', elevated: false }),
            b('chips', { labels: 'Made for you, New, Charts, Offline', selected: 0 }),
            b('hero', { kicker: 'Album of the week', title: 'Golden Hour', subtitle: 'Nia Sol · 12 tracks of warm, slow soul.', icon: 'album', height: 200 }),
            b('section', { title: 'Recently played', action: 'History' }),
            b('list', {
              items: 'Golden Hour | Nia Sol · 12 tracks\nLow Orbit | Kite Club · 9 tracks\nPaper Rooms | Milo Fenn · 14 tracks',
              leading: 'icon', leadingIcon: 'play_circle', trailing: 'none'
            }),
            b('card', { variant: 'filled', title: 'Late night radio', body: 'Two hours of low light and slow tempo, refreshed every Friday.', media: false, actions: 'Play, Save' }),
            b('bottomnav', { items: 'home:Home\nsearch:Search\nlibrary_music:Library\nperson:You', active: 0 })
          ]);
        }
      }
    ],

    web: [
      {
        id: 'shop',
        label: 'Shop',
        icon: 'shopping_bag',
        theme: {
          primary: '#5B5BD6',
          radius: 18,
          density: 'normal',
          dark: false,
          fonts: { ui: 'Inter', display: 'Plus Jakarta Sans' }
        },
        build: function () {
          return screen([
            b('webnav', { brand: 'Aurora', logoIcon: 'auto_awesome', links: 'Shop, New in, Journal', cta: 'Bag · 2', ctaIcon: 'shopping_bag' }),
            b('webhero', {
              kicker: 'New season · 2026',
              title: 'Everyday objects, quietly extraordinary.',
              text: 'Thoughtfully made homeware in honest materials — designed in Lisbon, built to outlive trends.',
              cta: 'Shop the collection', cta2: 'Our story', layout: 'split', icon: 'chair',
              card1: 'Free shipping over $80', card2: '4.9 · 2,400 reviews'
            }),
            b('weblogos', { label: 'Trusted by teams at', names: 'Kinfolk, Monocle, Dwell, Dezeen, Wallpaper' }),
            b('webproducts', {
              kicker: 'The edit', title: 'Best sellers', text: 'The pieces our studio keeps coming back to.',
              items: 'light|Arc table lamp|$189|New\nweekend|Linen throw|$74|\ncoffee|Stoneware set|$56|Low stock\nchair|Oak lounge chair|$420|'
            }),
            b('webfeatures', {
              kicker: 'Why Aurora', title: 'Made to be lived with', text: 'Small details, considered for years of daily use.',
              items: 'eco|Honest materials|FSC oak, recycled aluminium and natural linen — nothing hidden.\nlocal_shipping|Free returns|Try it at home for 30 days. If it is not right, we collect it.\nschedule|Built to last|A two-year warranty and spare parts for everything we make.'
            }),
            b('webtesti', {
              quote: 'The rare kind of design studio that removes things until only the useful parts are left. Our new site finally feels like us.',
              name: 'Maya Chen', role: 'Founder, Northlight'
            }),
            b('webcta', {
              title: 'Join the studio list',
              text: 'One thoughtful email a month — new pieces, process notes, no noise.',
              cta: 'Subscribe', cta2: 'Read the journal', icon: 'mail'
            }),
            b('webfooter', {
              brand: 'Aurora',
              blurb: 'Quietly extraordinary objects for everyday rooms. Designed in Lisbon, shipped worldwide.',
              columns: 'Shop|Lighting, Furniture, Textiles\nStudio|About, Journal, Careers\nHelp|Shipping, Returns, Contact',
              legal: '© 2026 Aurora Studio · Privacy · Terms'
            })
          ]);
        }
      },
      {
        id: 'music',
        label: 'Music',
        icon: 'headphones',
        theme: {
          primary: '#B7F45A',
          radius: 16,
          dark: true,
          fonts: { ui: 'Space Grotesk', display: 'Space Grotesk' }
        },
        build: function () {
          return screen([
            b('webnav', { brand: 'STUDIO', logoIcon: 'graphic_eq', links: 'Listen, Artists, Radio', cta: 'Sign in', ctaIcon: 'login' }),
            b('webhero', {
              kicker: 'Live from the basement',
              title: 'Sound, without the noise.',
              text: 'Lossless records, tiny desk sessions and artist radio — one quiet place to listen properly.',
              cta: 'Start listening', cta2: 'Browse artists', layout: 'split', icon: 'headphones',
              card1: 'Lossless · 24-bit', card2: '12,400 artists'
            }),
            b('webplaylists', {
              kicker: 'Fresh this week', title: 'New & noteworthy', text: 'Records we cannot stop playing in the studio.',
              items: 'Golden Hour|Nia Sol|12 tracks\nLow Orbit|Kite Club|9 tracks\nPaper Rooms|Milo Fenn|14 tracks\nAfter Rain|Vela|8 tracks'
            }),
            b('webfeatures', {
              kicker: 'The listening room', title: 'Built for deep listening', text: 'No autoplay tricks. No compression. Just the record.',
              items: 'speaker|Lossless audio|24-bit masters, streamed without compromise.\ndownload|Offline library|Keep 10,000 tracks on your device.\nradio|Artist radio|Endless, human-curated stations.'
            }),
            b('webcta', {
              title: 'Go premium, stay quiet',
              text: 'Two months free, then $8 a month. Cancel whenever.',
              cta: 'Start free trial', cta2: 'Compare plans', icon: 'album'
            }),
            b('webfooter', {
              brand: 'STUDIO',
              blurb: 'A small listening room for people who care how records sound.',
              columns: 'Listen|New releases, Charts, Radio\nArtists|Apply, Studio sessions, Press\nCompany|About, Careers, Contact',
              legal: '© 2026 Studio Audio · Privacy · Terms'
            })
          ]);
        }
      },
      {
        id: 'movies',
        label: 'Movies',
        icon: 'movie',
        theme: {
          primary: '#FF5C7A',
          radius: 14,
          dark: true,
          fonts: { ui: 'Manrope', display: 'Bebas Neue' }
        },
        build: function () {
          return screen([
            b('webnav', { brand: 'NOCTURNE', logoIcon: 'movie', links: 'Films, Series, Journal', cta: 'Watch free', ctaIcon: 'play_arrow' }),
            b('webhero', {
              kicker: 'Now streaming · exclusive',
              title: 'Stories that keep the lights on.',
              text: 'A small streaming house for strange, beautiful films. New premieres every Friday.',
              cta: 'Watch the trailer', cta2: 'Browse films', layout: 'split', icon: 'movie',
              card1: '4K · Dolby Vision', card2: '8.8 · Critics pick'
            }),
            b('webposters', {
              kicker: 'Now streaming', title: 'Trending this week', text: 'Four films everyone is talking about.',
              items: 'Afterlight|2026 · Sci-fi|8.4\nSalt & Static|2025 · Drama|7.9\nThe Long Quiet|2026 · Thriller|8.8\nNeon Orchard|2024 · Animation|8.1'
            }),
            b('webposters', {
              kicker: 'Fresh premieres', title: 'New this Friday', text: 'Handpicked by the Nocturne programming team.',
              items: 'Hollow Coast|2026 · Mystery|7.6\nPaper Moons|2026 · Romance|8.2\nStatic Bloom|2025 · Horror|7.4\nThe Archivist|2026 · Documentary|9.0'
            }),
            b('webtesti', {
              quote: 'Nocturne is what happens when programmers, not algorithms, choose the films. It feels like a repertory cinema in your living room.',
              name: 'Jonas Reed', role: 'Film critic, The Frame'
            }),
            b('webcta', {
              title: 'Your first film is on us',
              text: 'No card, no countdown. Pick something strange and press play.',
              cta: 'Start watching', cta2: 'See the lineup', icon: 'theaters'
            }),
            b('webfooter', {
              brand: 'NOCTURNE',
              blurb: 'A streaming house for strange, beautiful films. Curated in Copenhagen.',
              columns: 'Watch|Films, Series, Shorts\nStudio|About, Programmers, Press\nHelp|Devices, Subtitles, Contact',
              legal: '© 2026 Nocturne Film · Privacy · Terms'
            })
          ]);
        }
      },
      {
        id: 'studio',
        label: 'SaaS',
        icon: 'space_dashboard',
        theme: {
          primary: '#111111',
          radius: 16,
          density: 'comfy',
          dark: false,
          fonts: { ui: 'Inter', display: 'Inter' }
        },
        build: function () {
          return screen([
            b('webnav', { brand: 'Plain', logoIcon: 'crop_square', links: 'Product, Pricing, Docs', cta: 'Get started', ctaIcon: 'arrow_forward' }),
            b('webhero', {
              kicker: 'Simple by design',
              title: 'The calm workspace for small teams.',
              text: 'Projects, notes and decisions in one quiet place. No feeds, no badges, no busywork.',
              cta: 'Start free', cta2: 'Book a demo', layout: 'center', icon: 'space_dashboard',
              card1: '', card2: ''
            }),
            b('weblogos', { label: 'Used by teams at', names: 'Loom, Vercel, Linear, Raycast, Cron' }),
            b('webfeatures', {
              kicker: 'The product', title: "Everything you need. Nothing you don't.", text: 'Four surfaces, one shared source of truth.',
              items: 'space_dashboard|Projects|A single board for work in flight, with no status meetings.\ndescription|Docs|Notes that stay next to the work they describe.\nhow_to_reg|Decisions|A lightweight log of what changed and why.\nbolt|Fast|Keyboard-first, instant navigation, zero loading spinners.'
            }),
            b('webpricing', {
              kicker: 'Pricing', title: 'Simple plans, no surprises', text: 'Start free. Upgrade when the team grows.',
              cta: 'Choose plan',
              plans: 'Starter|$0|/mo|3 projects;1 GB storage;Community support|0\nTeam|$19|/seat|Unlimited projects;50 GB storage;Priority support|1\nScale|$49|/seat|SSO & audit logs;Unlimited storage;Dedicated manager|0'
            }),
            b('webtesti', {
              quote: 'We replaced four tools with Plain in a week. The team actually opens it, which is the only metric that matters.',
              name: 'Priya Nair', role: 'COO, Northwind'
            }),
            b('webfooter', {
              brand: 'Plain',
              blurb: 'The calm workspace for small teams. Built remotely, shipped quietly.',
              columns: 'Product|Projects, Docs, Pricing\nCompany|About, Journal, Careers\nSupport|Docs, Contact, Status',
              legal: '© 2026 Plain Software · Privacy · Terms'
            })
          ]);
        }
      }
    ],

    ext: [
      {
        id: 'tabs',
        label: 'Tab manager',
        icon: 'tab',
        theme: {
          primary: '#4F46E5',
          radius: 16,
          dark: false,
          fonts: { ui: 'Inter', display: 'Inter' }
        },
        build: function () {
          return screen([
            b('extheader', { title: 'Tab clutter', subtitle: '24 tabs · 6 windows open', icon: 'extension', actions: 'push_pin, more_vert' }),
            b('extsearch', { placeholder: 'Search open tabs', kbd: '⌘K', icon: 'search' }),
            b('tablist', {
              items: 'Figma|Design system v2|figma.com\nGitHub|droid-lab · pull requests|github.com\nNotion|Launch checklist|notion.so\nYouTube|Lo-fi radio · live|youtube.com\nLinear|Sprint 24 board|linear.app'
            }),
            b('actionsgrid', {
              items: 'tab|Group tabs\nbookmark|Save all\ncontent_copy|Copy links\ndelete_sweep|Close idle\ntimer|Focus mode\nshuffle|Shuffle\ncleaning_services|Clean up\nhistory|Recent'
            }),
            b('extfooter', { text: 'Synced just now', link: 'Settings' })
          ]);
        }
      },
      {
        id: 'focus',
        label: 'Focus timer',
        icon: 'timer',
        theme: {
          primary: '#0F9D77',
          radius: 18,
          dark: true,
          fonts: { ui: 'DM Sans', display: 'DM Sans' }
        },
        build: function () {
          return screen([
            b('extheader', { title: 'Focus', subtitle: 'Session 2 of 4 · 25 minutes', icon: 'timer', actions: 'settings' }),
            b('exttimer', { time: '24:36', label: 'Deep work', percent: 62, start: 'Pause', reset: 'Reset' }),
            b('extstat', { items: '4|Sessions today\n96m|Focused\n12|Distractions blocked' }),
            b('extfooter', { text: 'Do not disturb is on', link: 'Preferences' })
          ]);
        }
      },
      {
        id: 'notes',
        label: 'Notes',
        icon: 'checklist',
        theme: {
          primary: '#C2410C',
          radius: 14,
          dark: false,
          fonts: { ui: 'Figtree', display: 'Figtree' }
        },
        build: function () {
          return screen([
            b('extheader', { title: 'Quick notes', subtitle: 'Today · 4 items', icon: 'checklist', actions: 'add, more_vert' }),
            b('extnotes', {
              items: '0|Reply to Maya about the launch\n1|Ship the pricing page copy\n0|Book the studio for Thursday\n1|Clear inbox before standup'
            }),
            b('actionsgrid', { items: 'add|New note\ncleaning_services|Clear done\nsort|Sort\ncloud_sync|Sync' }),
            b('extfooter', { text: 'Saved to Notion', link: 'Open app' })
          ]);
        }
      }
    ]
  };

  S.buildTemplate = function (target, id) {
    var list = S.templates[target] || [];
    var tpl = list.filter(function (t) { return t.id === id; })[0] || list[0];
    var t = S.targets[target];
    if (!tpl) return { screen: [], device: Object.assign({}, t.device), theme: S.baseTheme(), template: null };
    var theme = S.baseTheme();
    var patch = tpl.theme || {};
    Object.keys(patch).forEach(function (k) {
      if (k === 'fonts' || k === 'type' || k === 'icons') {
        theme[k] = Object.assign({}, theme[k], patch[k]);
      } else {
        theme[k] = patch[k];
      }
    });
    return {
      screen: tpl.build(),
      device: Object.assign({}, t.device, tpl.device || {}),
      theme: theme,
      template: tpl
    };
  };

  S.newTarget = function (target) {
    var built = S.buildTemplate(target, null);
    return {
      screen: built.screen,
      device: built.device,
      selectedId: null,
      theme: built.theme
    };
  };

  S.defaultState = function () {
    var built = S.buildTemplate('app', 'discover');
    return {
      version: 2,
      target: 'app',
      device: built.device,
      screen: built.screen,
      selectedId: null,
      stash: {},
      theme: built.theme,
      compare: { on: false, fonts: ['Inter', 'Plus Jakarta Sans', 'DM Sans'] }
    };
  };
})();
