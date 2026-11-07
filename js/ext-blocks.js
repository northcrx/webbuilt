/* Chrome extension popup blocks. */
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

  var EXT = ['ext'];

  S.components.extheader = {
    label: 'Extension header',
    group: 'Extension',
    icon: 'web_asset',
    targets: EXT,
    defaults: {
      title: 'Tab clutter',
      subtitle: '24 tabs · 6 windows open',
      icon: 'extension',
      actions: 'push_pin, more_vert'
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'icon', label: 'Logo icon', type: 'icon' },
      { key: 'actions', label: 'Actions (icon names)', type: 'text' }
    ],
    html: function (p) {
      var acts = String(p.actions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean)
        .map(function (a) { return '<button class="ext-icon-btn" aria-label="' + esc(a) + '">' + S.icon(a) + '</button>'; }).join('');
      return '<header class="ext-head">' +
        '<span class="ext-mark">' + S.icon(p.icon) + '</span>' +
        '<div class="ext-head-text"><div class="ext-head-title" data-edit="title">' + esc(p.title) + '</div>' +
        '<div class="ext-head-sub" data-edit="subtitle">' + esc(p.subtitle) + '</div></div>' +
        '<div class="ext-head-actions">' + acts + '</div></header>';
    }
  };

  S.components.extsearch = {
    label: 'Popup search',
    group: 'Extension',
    icon: 'search',
    targets: EXT,
    defaults: { placeholder: 'Search open tabs', kbd: '⌘K', icon: 'search' },
    fields: [
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'kbd', label: 'Shortcut hint', type: 'text' },
      { key: 'icon', label: 'Icon', type: 'icon' }
    ],
    html: function (p) {
      return '<div class="ext-search">' + S.icon(p.icon) +
        '<span data-edit="placeholder" style="flex:1">' + esc(p.placeholder) + '</span>' +
        '<span class="ext-kbd" data-edit="kbd">' + esc(p.kbd) + '</span></div>';
    }
  };

  S.components.tablist = {
    label: 'Tab list',
    group: 'Extension',
    icon: 'tab',
    targets: EXT,
    defaults: {
      items: 'Figma|Design system v2|figma.com\nGitHub|droid-lab · pull requests|github.com\nNotion|Launch checklist|notion.so\nYouTube|Lo-fi radio · live|youtube.com\nLinear|Sprint 24 board|linear.app'
    },
    fields: [
      { key: 'items', label: 'Tabs — Label|Title|Host', type: 'textarea' }
    ],
    html: function (p) {
      var list = rows(p.items).map(function (line) {
        var a = parts(line, 3);
        return '<div class="ext-row"><span class="ext-fav">' + esc((a[0] || '?').charAt(0).toUpperCase()) + '</span>' +
          '<div class="ext-row-main"><div class="ext-row-title">' + esc(a[1] || a[0]) + '</div>' +
          '<div class="ext-row-sub">' + esc(a[2]) + '</div></div>' +
          '<button class="ext-x" aria-label="Close tab">' + S.icon('close') + '</button></div>';
      }).join('');
      return '<div class="ext-list">' + list + '</div>';
    }
  };

  S.components.actionsgrid = {
    label: 'Action grid',
    group: 'Extension',
    icon: 'apps',
    targets: EXT,
    defaults: {
      items: 'tab|Group tabs\nbookmark|Save all\ncontent_copy|Copy links\ndelete_sweep|Close idle\ntimer|Focus mode\nshuffle|Shuffle\ncleaning_services|Clean up\nhistory|Recent'
    },
    fields: [
      { key: 'items', label: 'Actions — icon|Label', type: 'textarea' }
    ],
    html: function (p) {
      var cells = rows(p.items).map(function (line) {
        var a = parts(line, 2);
        return '<button class="ext-action"><span class="ext-ico">' + S.icon(a[0] || 'bolt') + '</span>' +
          '<span>' + esc(a[1]) + '</span></button>';
      }).join('');
      return '<div class="ext-actions">' + cells + '</div>';
    }
  };

  S.components.extstat = {
    label: 'Stats row',
    group: 'Extension',
    icon: 'query_stats',
    targets: EXT,
    defaults: { items: '24|Open tabs\n6|Windows\n1.8 GB|Memory saved' },
    fields: [
      { key: 'items', label: 'Stats — Value|Label', type: 'textarea' }
    ],
    html: function (p) {
      var cells = rows(p.items).map(function (line) {
        var a = parts(line, 2);
        return '<div class="ext-stat"><b>' + esc(a[0]) + '</b><span>' + esc(a[1]) + '</span></div>';
      }).join('');
      return '<div class="ext-stats">' + cells + '</div>';
    }
  };

  S.components.exttimer = {
    label: 'Focus timer',
    group: 'Extension',
    icon: 'timer',
    targets: EXT,
    defaults: {
      time: '24:36',
      label: 'Deep work',
      percent: 62,
      start: 'Pause',
      reset: 'Reset'
    },
    fields: [
      { key: 'time', label: 'Time', type: 'text' },
      { key: 'label', label: 'Caption', type: 'text' },
      { key: 'percent', label: 'Ring progress', type: 'range', min: 0, max: 100, suffix: '%' },
      { key: 'start', label: 'Start / pause label', type: 'text' },
      { key: 'reset', label: 'Reset label', type: 'text' }
    ],
    html: function (p) {
      var pct = U.clamp(Number(p.percent) || 0, 0, 100);
      return '<div class="ext-timer">' +
        '<div class="ext-ring" style="--pct:' + pct + '%"><div class="ext-ring-inner">' +
        '<div class="ext-time" data-edit="time">' + esc(p.time) + '</div>' +
        '<small data-edit="label">' + esc(p.label) + '</small></div></div>' +
        '<div class="ext-timer-acts"><button class="web-btn">' + S.icon('pause') + '<span data-edit="start">' + esc(p.start) + '</span></button>' +
        '<button class="web-btn ghost">' + S.icon('restart_alt') + '<span data-edit="reset">' + esc(p.reset) + '</span></button></div>' +
        '</div>';
    }
  };

  S.components.extnotes = {
    label: 'Quick notes',
    group: 'Extension',
    icon: 'checklist',
    targets: EXT,
    defaults: {
      items: '0|Reply to Maya about the launch\n1|Ship the pricing page copy\n0|Book the studio for Thursday\n1|Clear inbox before standup'
    },
    fields: [
      { key: 'items', label: 'Notes — 1 for done|Text', type: 'textarea' }
    ],
    html: function (p) {
      var list = rows(p.items).map(function (line) {
        var a = parts(line, 2);
        var done = a[0] === '1';
        return '<div class="ext-note' + (done ? ' done' : '') + '"><span class="ext-check">' + S.icon('check') + '</span>' +
          '<span class="ext-note-text">' + esc(a[1]) + '</span></div>';
      }).join('');
      return '<div class="ext-notes">' + list + '</div>';
    }
  };

  S.components.extfooter = {
    label: 'Extension footer',
    group: 'Extension',
    icon: 'dock_to_bottom',
    targets: EXT,
    defaults: { text: 'Synced just now', link: 'Settings' },
    fields: [
      { key: 'text', label: 'Left text', type: 'text' },
      { key: 'link', label: 'Link label', type: 'text' }
    ],
    html: function (p) {
      return '<footer class="ext-foot"><span>' + S.icon('cloud_done') + '</span>' +
        '<span data-edit="text">' + esc(p.text) + '</span>' +
        '<span class="ext-link" data-edit="link">' + esc(p.link) + '</span></footer>';
    }
  };

  /* ------------------- NEW CHROME EXTENSION TOOLS ------------------- */
  S.components.extactivetab = {
    label: 'Tab Inspector',
    group: 'Extension',
    icon: 'tab',
    targets: EXT,
    defaults: {
      domain: 'github.com',
      title: 'DroidLab / Android-Compose-Compiler',
      loadTime: '240 ms',
      status: 'Secure SSL'
    },
    fields: [
      { key: 'domain', label: 'Domain', type: 'text' },
      { key: 'title', label: 'Tab title', type: 'text' },
      { key: 'loadTime', label: 'Load latency', type: 'text' },
      { key: 'status', label: 'Security status', type: 'text' }
    ],
    html: function (p) {
      return '<div class="ext-card ext-tab-card">' +
        '<div class="etc-top"><span class="mi etc-fav">public</span><div class="etc-info"><strong>' + esc(p.domain) + '</strong><small>' + esc(p.title) + '</small></div><button type="button" class="ext-mini-btn" title="Refresh tab"><span class="mi">refresh</span></button></div>' +
        '<div class="etc-meta"><span class="etc-badge"><span class="mi">speed</span>' + esc(p.loadTime) + '</span><span class="etc-badge secure"><span class="mi">lock</span>' + esc(p.status) + '</span></div>' +
        '</div>';
    }
  };

  S.components.extcolorpicker = {
    label: 'Eyedropper / Palette',
    group: 'Extension',
    icon: 'colorize',
    targets: EXT,
    defaults: {
      hex: '#8B6CF6',
      rgb: 'rgb(139, 108, 246)',
      history: '#8B6CF6,#7EF0C2,#FF7262,#FFD166'
    },
    fields: [
      { key: 'hex', label: 'Active HEX', type: 'text' },
      { key: 'rgb', label: 'Active RGB', type: 'text' },
      { key: 'history', label: 'Palette swatches (comma separated)', type: 'text' }
    ],
    html: function (p) {
      var swatches = String(p.history || '').split(',').map(function (c) {
        return '<span class="ext-swatch" style="background:' + esc(c.trim()) + '" title="' + esc(c.trim()) + '"></span>';
      }).join('');
      return '<div class="ext-card ext-picker-card">' +
        '<div class="epc-row"><div class="epc-preview" style="background:' + esc(p.hex) + '"></div><div class="epc-values"><strong>' + esc(p.hex) + '</strong><small>' + esc(p.rgb) + '</small></div><button type="button" class="ext-mini-btn" title="Copy HEX"><span class="mi">content_copy</span></button></div>' +
        '<div class="epc-swatches"><span class="epc-lbl">Recents:</span>' + swatches + '</div>' +
        '</div>';
    }
  };

  S.components.extspeedtest = {
    label: 'Network Speed Test',
    group: 'Extension',
    icon: 'network_check',
    targets: EXT,
    defaults: {
      ping: '14 ms',
      download: '184.2 Mbps',
      upload: '68.5 Mbps'
    },
    fields: [
      { key: 'ping', label: 'Ping / Latency', type: 'text' },
      { key: 'download', label: 'Download speed', type: 'text' },
      { key: 'upload', label: 'Upload speed', type: 'text' }
    ],
    html: function (p) {
      return '<div class="ext-card ext-speed-card">' +
        '<div class="esp-metrics">' +
        '<div class="esp-item"><small>PING</small><strong>' + esc(p.ping) + '</strong></div>' +
        '<div class="esp-item down"><small>DOWNLOAD</small><strong>' + esc(p.download) + '</strong></div>' +
        '<div class="esp-item up"><small>UPLOAD</small><strong>' + esc(p.upload) + '</strong></div>' +
        '</div>' +
        '<button type="button" class="ext-btn w-100"><span class="mi">play_arrow</span><span>Test Again</span></button>' +
        '</div>';
    }
  };

  S.components.extadblockstats = {
    label: 'Shield & Privacy Stats',
    group: 'Extension',
    icon: 'security',
    targets: EXT,
    defaults: {
      trackers: '18 blocked',
      status: 'Shields UP'
    },
    fields: [
      { key: 'trackers', label: 'Trackers blocked', type: 'text' },
      { key: 'status', label: 'Shield status', type: 'text' }
    ],
    html: function (p) {
      return '<div class="ext-card ext-shield-card">' +
        '<div class="esh-top"><span class="mi esh-icon">verified_user</span><div><strong>' + esc(p.status) + '</strong><small>' + esc(p.trackers) + ' on this site</small></div><div class="ext-toggle on"></div></div>' +
        '</div>';
    }
  };

  S.components.extpasswordgen = {
    label: 'Password Generator',
    group: 'Extension',
    icon: 'password',
    targets: EXT,
    defaults: {
      password: 'kR9#vW2$mQ8!pZ4@',
      length: '16 characters'
    },
    fields: [
      { key: 'password', label: 'Generated password', type: 'text' },
      { key: 'length', label: 'Length note', type: 'text' }
    ],
    html: function (p) {
      return '<div class="ext-card ext-pwd-card">' +
        '<div class="epw-box"><code>' + esc(p.password) + '</code><button type="button" class="ext-mini-btn" title="Copy"><span class="mi">content_copy</span></button></div>' +
        '<div class="epw-meta"><span class="epw-badge strong"><span class="mi">shield</span>Very Strong</span><small>' + esc(p.length) + '</small><button type="button" class="ext-mini-btn" title="Regenerate"><span class="mi">refresh</span></button></div>' +
        '</div>';
    }
  };

  S.components.exttodo = {
    label: 'Popup Task Checklist',
    group: 'Extension',
    icon: 'checklist',
    targets: EXT,
    defaults: {
      tasks: 'Review Compose Navigation spec:1\nAdd Phosphor and Tabler vector icons:1\nDeploy Android Studio APK:0'
    },
    fields: [
      { key: 'tasks', label: 'Tasks (Task text:Done 1/0)', type: 'textarea' }
    ],
    html: function (p) {
      var items = String(p.tasks || '').split('\n').map(function (line) {
        var pt = line.split(':');
        var text = pt[0] ? pt[0].trim() : 'Task';
        var done = pt[1] && pt[1].trim() === '1';
        return '<div class="etd-item' + (done ? ' is-done' : '') + '">' +
          '<span class="mi etd-check">' + (done ? 'check_box' : 'check_box_outline_blank') + '</span>' +
          '<span class="etd-text">' + esc(text) + '</span>' +
          '</div>';
      }).join('');
      return '<div class="ext-card ext-todo-card">' +
        '<div class="etd-head"><strong>Quick Tasks</strong><small>2 / 3 Completed</small></div>' +
        '<div class="etd-list">' + items + '</div>' +
        '</div>';
    }
  };


  S.components.extbookmarklist = {
    label: 'Bookmarks Manager',
    group: 'Extension',
    icon: 'bookmarks',
    targets: EXT,
    defaults: {
      bookmarks: 'Jetpack Compose Docs:developer.android.com:star\nLucide Icons Catalog:lucide.dev:favorite\nMaterial 3 Guidelines:m3.material.io:palette'
    },
    fields: [
      { key: 'bookmarks', label: 'Bookmarks (Title:Domain:Icon)', type: 'textarea' }
    ],
    html: function (p) {
      var rowsHtml = String(p.bookmarks || '').split('\n').map(function (line) {
        var pt = line.split(':');
        return '<div class="ebm-item"><span class="mi ebm-ico">' + esc(pt[2] || 'bookmark') + '</span><div class="ebm-info"><strong>' + esc(pt[0]) + '</strong><small>' + esc(pt[1]) + '</small></div><span class="mi ebm-arrow">arrow_forward</span></div>';
      }).join('');
      return '<div class="ext-card ext-bookmark-card">' +
        '<div class="ebm-head"><strong>Quick Bookmarks</strong><button type="button" class="ext-mini-btn"><span class="mi">add</span></button></div>' +
        '<div class="ebm-list">' + rowsHtml + '</div>' +
        '</div>';
    }
  };

  S.components.extclipboard = {
    label: 'Clipboard History',
    group: 'Extension',
    icon: 'assignment',
    targets: EXT,
    defaults: {
      clips: 'Modifier.background(MaterialTheme.colorScheme.surface)\n#8B6CF6 (Accent Violet)\nimport androidx.compose.material3.*'
    },
    fields: [
      { key: 'clips', label: 'Clips (newline separated)', type: 'textarea' }
    ],
    html: function (p) {
      var clipsHtml = String(p.clips || '').split('\n').map(function (c) {
        return '<div class="ecl-row"><code>' + esc(c) + '</code><button type="button" class="ext-mini-btn" title="Copy"><span class="mi">content_copy</span></button></div>';
      }).join('');
      return '<div class="ext-card ext-clip-card">' +
        '<div class="ecl-head"><strong>Clipboard History</strong><small>3 clips saved</small></div>' +
        '<div class="ecl-list">' + clipsHtml + '</div>' +
        '</div>';
    }
  };

  S.components.extreadingmode = {
    label: 'Reader Mode',
    group: 'Extension',
    icon: 'chrome_reader_mode',
    targets: EXT,
    defaults: {
      title: 'Compiling Android Jetpack Compose in Droid Lab',
      author: 'By Elena Rostova · 4 min read',
      body: 'Visual design tooling has historically suffered from impedance mismatch when translating CSS into native declarative layouts...'
    },
    fields: [
      { key: 'title', label: 'Article title', type: 'text' },
      { key: 'author', label: 'Author / read time', type: 'text' },
      { key: 'body', label: 'Sample excerpt', type: 'textarea' }
    ],
    html: function (p) {
      return '<div class="ext-card ext-reader-card">' +
        '<div class="erd-toolbar"><button type="button" class="ext-mini-btn">A-</button><button type="button" class="ext-mini-btn">A+</button><button type="button" class="ext-mini-btn"><span class="mi">dark_mode</span></button></div>' +
        '<h3 class="erd-title">' + esc(p.title) + '</h3>' +
        '<small class="erd-author">' + esc(p.author) + '</small>' +
        '<p class="erd-body">' + esc(p.body) + '</p>' +
        '</div>';
    }
  };

})();
