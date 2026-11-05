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
})();
