/* Generates strings.xml, colors.xml, themes.xml and Android resource declarations. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var android = S.exporters.android = S.exporters.android || {};
  var U = S.util || {};

  function xmlEscape(val) {
    return String(val == null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '\\\'');
  }

  function slug(str, fallback) {
    return String(str || fallback || 'item')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 48) || (fallback || 'item');
  }

  var ResourceGenerator = android.ResourceGenerator = {
    generateStringsXml: function (data) {
      var strings = [];
      var seen = {};

      function add(name, value) {
        value = String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
        if (!value || value.length > 150) return;
        var key = slug(name, 'text');
        if (seen[key]) {
          var n = 2;
          while (seen[key + '_' + n]) n++;
          key = key + '_' + n;
        }
        seen[key] = true;
        strings.push({ key: key, value: value });
      }

      add('app_name', 'Droid Lab App');

      var pages = (data.pages && data.pages.length) ? data.pages : [{ name: 'Screen', screen: data.screen || [] }];
      pages.forEach(function (page) {
        var pagePrefix = slug(page.name, 'page');
        add('screen_' + pagePrefix + '_title', page.name);

        function scan(block) {
          if (!block) return;
          var p = block.props || {};
          var bType = block.type || 'block';

          ['title', 'label', 'kicker', 'subtitle', 'placeholder', 'action', 'cta', 'message',
           'confirm', 'cancel', 'support', 'text', 'brand', 'summary'].forEach(function (prop) {
            if (p[prop] != null && typeof p[prop] === 'string' && !/\n/.test(p[prop])) {
              add(pagePrefix + '_' + bType + '_' + prop, p[prop]);
            }
          });

          if (p.items && typeof p.items === 'string') {
            p.items.split('\n').forEach(function (line, idx) {
              var parts = line.split('|');
              var txt = parts[0];
              var colon = txt.indexOf(':');
              if (colon > -1) txt = txt.slice(colon + 1);
              if (txt.trim()) add(pagePrefix + '_' + bType + '_item_' + (idx + 1), txt.trim());
            });
          }

          (block.children || []).forEach(scan);
        }

        (page.screen || []).forEach(scan);
      });

      var lines = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>'
      ];

      strings.forEach(function (s) {
        lines.push('    <string name="' + s.key + '">' + xmlEscape(s.value) + '</string>');
      });

      lines.push('</resources>');
      return lines.join('\n');
    },

    generateColorsXml: function (theme) {
      theme = theme || {};
      var p = theme.primary || '#6750A4';
      var hexPrimary = p.toUpperCase();

      return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '    <color name="primary">' + hexPrimary + '</color>',
        '    <color name="primary_variant">' + hexPrimary + '</color>',
        '    <color name="on_primary">#FFFFFFFF</color>',
        '    <color name="background_light">#FFFBFE</color>',
        '    <color name="background_dark">#141218</color>',
        '    <color name="surface_light">#FFFBFE</color>',
        '    <color name="surface_dark">#141218</color>',
        '</resources>'
      ].join('\n');
    },

    generateThemesXml: function () {
      return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '    <style name="Theme.DroidLab" parent="android:Theme.Material.Light.NoActionBar">',
        '        <item name="android:statusBarColor">@android:color/transparent</item>',
        '        <item name="android:navigationBarColor">@android:color/transparent</item>',
        '        <item name="android:windowLightStatusBar">true</item>',
        '    </style>',
        '</resources>'
      ].join('\n');
    }
  };
})();
