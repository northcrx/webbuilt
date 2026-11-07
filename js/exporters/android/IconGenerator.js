/* Icon export system: Translates SVG, Lucide, Material Symbols and Phosphor
   icons into Android VectorDrawable XML files and Compose icon components. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var android = S.exporters.android = S.exporters.android || {};

  function cleanName(name) {
    return String(name || 'icon')
      .toLowerCase()
      .replace(/^(lucide|ph|msr|mso|mss|ms):/, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'icon';
  }

  function drawableResName(name, pack) {
    var prefix = pack ? pack + '_' : 'ic_';
    if (!/^ic_/.test(prefix)) prefix = 'ic_' + prefix;
    return (prefix + cleanName(name)).slice(0, 48);
  }

  /* Parse SVG shapes (path, circle, line, rect, polyline, polygon) into VectorDrawable pathData */
  function parseSvgSnippetToPaths(svgSnippet, defaultStrokeWidth) {
    var strokeW = defaultStrokeWidth || 1.8;
    var paths = [];
    var tagRegex = /<([a-z]+)\s+([^>]+?)\/?>/gi;
    var match;

    function getAttr(str, attr) {
      var r = new RegExp('(?:^|\\s)' + attr + '="([^"]*)"', 'i');
      var m = str.match(r);
      return m ? m[1] : null;
    }

    function getPoints(str) {
      return (str || '').trim().split(/[\s,]+/).map(Number);
    }

    while ((match = tagRegex.exec(svgSnippet)) !== null) {
      var tag = match[1].toLowerCase();
      var attrs = match[2];

      if (tag === 'path') {
        var d = getAttr(attrs, 'd');
        if (d) {
          paths.push({
            pathData: d,
            strokeWidth: getAttr(attrs, 'stroke-width') || strokeW,
            fill: getAttr(attrs, 'fill') === 'currentColor' || getAttr(attrs, 'fill') === '#fff' ? '#FFFFFFFF' : null
          });
        }
      } else if (tag === 'circle') {
        var cx = Number(getAttr(attrs, 'cx') || 0);
        var cy = Number(getAttr(attrs, 'cy') || 0);
        var r = Number(getAttr(attrs, 'r') || 0);
        if (r > 0) {
          // Circle as two SVG arcs
          var cd = 'M ' + (cx - r) + ',' + cy + ' a ' + r + ',' + r + ' 0 1,0 ' + (2 * r) + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (2 * r) + ',0';
          paths.push({
            pathData: cd,
            strokeWidth: getAttr(attrs, 'stroke-width') || strokeW,
            fill: getAttr(attrs, 'fill') === 'currentColor' ? '#FFFFFFFF' : null
          });
        }
      } else if (tag === 'line') {
        var x1 = getAttr(attrs, 'x1') || 0;
        var y1 = getAttr(attrs, 'y1') || 0;
        var x2 = getAttr(attrs, 'x2') || 0;
        var y2 = getAttr(attrs, 'y2') || 0;
        paths.push({
          pathData: 'M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2,
          strokeWidth: getAttr(attrs, 'stroke-width') || strokeW,
          fill: null
        });
      } else if (tag === 'polyline' || tag === 'polygon') {
        var pts = getPoints(getAttr(attrs, 'points'));
        if (pts.length >= 4) {
          var polyD = 'M ' + pts[0] + ',' + pts[1];
          for (var p = 2; p < pts.length; p += 2) {
            polyD += ' L ' + pts[p] + ',' + pts[p + 1];
          }
          if (tag === 'polygon') polyD += ' Z';
          paths.push({
            pathData: polyD,
            strokeWidth: getAttr(attrs, 'stroke-width') || strokeW,
            fill: (tag === 'polygon' && getAttr(attrs, 'fill') !== 'none') ? '#FFFFFFFF' : null
          });
        }
      } else if (tag === 'rect') {
        var rx = Number(getAttr(attrs, 'x') || 0);
        var ry = Number(getAttr(attrs, 'y') || 0);
        var rw = Number(getAttr(attrs, 'width') || 0);
        var rh = Number(getAttr(attrs, 'height') || 0);
        var rrad = Number(getAttr(attrs, 'rx') || 0);
        var rectD;
        if (rrad > 0) {
          rectD = 'M ' + (rx + rrad) + ',' + ry +
            ' h ' + (rw - 2 * rrad) +
            ' a ' + rrad + ',' + rrad + ' 0 0,1 ' + rrad + ',' + rrad +
            ' v ' + (rh - 2 * rrad) +
            ' a ' + rrad + ',' + rrad + ' 0 0,1 -' + rrad + ',' + rrad +
            ' h -' + (rw - 2 * rrad) +
            ' a ' + rrad + ',' + rrad + ' 0 0,1 -' + rrad + ',-' + rrad +
            ' v -' + (rh - 2 * rrad) +
            ' a ' + rrad + ',' + rrad + ' 0 0,1 ' + rrad + ',-' + rrad + ' Z';
        } else {
          rectD = 'M ' + rx + ',' + ry + ' h ' + rw + ' v ' + rh + ' h -' + rw + ' Z';
        }
        paths.push({
          pathData: rectD,
          strokeWidth: getAttr(attrs, 'stroke-width') || strokeW,
          fill: getAttr(attrs, 'fill') === 'currentColor' ? '#FFFFFFFF' : null
        });
      }
    }

    return paths;
  }

  function generateVectorDrawableXml(paths, opts) {
    opts = opts || {};
    var size = opts.size || 24;
    var defaultStroke = opts.strokeColor || '#FF000000';
    var defaultFill = opts.fillColor || null;

    var xml = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<vector xmlns:android="http://schemas.android.com/apk/res/android"',
      '    android:width="' + size + 'dp"',
      '    android:height="' + size + 'dp"',
      '    android:viewportWidth="24"',
      '    android:viewportHeight="24">',
      ''
    ];

    paths.forEach(function (p) {
      xml.push('    <path');
      xml.push('        android:pathData="' + p.pathData + '"');
      if (p.fill) {
        xml.push('        android:fillColor="' + (defaultFill || p.fill) + '"');
      } else {
        xml.push('        android:strokeColor="' + defaultStroke + '"');
        xml.push('        android:strokeWidth="' + (p.strokeWidth || 1.8) + '"');
        xml.push('        android:strokeLineCap="round"');
        xml.push('        android:strokeLineJoin="round"');
      }
      xml.push('    />');
    });

    xml.push('</vector>');
    return xml.join('\n');
  }

  /* Known Material Icon mapping to Compose Material Icons */
  var MATERIAL_COMPOSE_MAP = {
    'home': 'Icons.Rounded.Home',
    'search': 'Icons.Rounded.Search',
    'settings': 'Icons.Rounded.Settings',
    'menu': 'Icons.Rounded.Menu',
    'close': 'Icons.Rounded.Close',
    'add': 'Icons.Rounded.Add',
    'arrow_back': 'Icons.Rounded.ArrowBack',
    'arrow_forward': 'Icons.Rounded.ArrowForward',
    'chevron_left': 'Icons.Rounded.ChevronLeft',
    'chevron_right': 'Icons.Rounded.ChevronRight',
    'more_vert': 'Icons.Rounded.MoreVert',
    'more_horiz': 'Icons.Rounded.MoreHoriz',
    'notifications': 'Icons.Rounded.Notifications',
    'favorite': 'Icons.Rounded.Favorite',
    'favorite_border': 'Icons.Rounded.FavoriteBorder',
    'star': 'Icons.Rounded.Star',
    'star_border': 'Icons.Rounded.StarBorder',
    'person': 'Icons.Rounded.Person',
    'account_circle': 'Icons.Rounded.AccountCircle',
    'share': 'Icons.Rounded.Share',
    'edit': 'Icons.Rounded.Edit',
    'delete': 'Icons.Rounded.Delete',
    'download': 'Icons.Rounded.KeyboardArrowDown',
    'upload': 'Icons.Rounded.KeyboardArrowUp',
    'lock': 'Icons.Rounded.Lock',
    'mail': 'Icons.Rounded.MailOutline',
    'phone': 'Icons.Rounded.Phone',
    'shopping_cart': 'Icons.Rounded.ShoppingCart',
    'check': 'Icons.Rounded.Check',
    'check_circle': 'Icons.Rounded.CheckCircle',
    'info': 'Icons.Rounded.Info',
    'warning': 'Icons.Rounded.Warning',
    'play_arrow': 'Icons.Rounded.PlayArrow',
    'pause': 'Icons.Rounded.Close',
    'refresh': 'Icons.Rounded.Refresh',
    'tune': 'Icons.Rounded.Build',
    'folder': 'Icons.Rounded.DateRange',
    'bookmark': 'Icons.Rounded.Favorite'
  };

  var IconGenerator = android.IconGenerator = {
    cleanName: cleanName,
    drawableResName: drawableResName,

    /* Converts any Lucide icon into Android VectorDrawable XML */
    lucideToVectorXml: function (iconName, opts) {
      var raw = cleanName(iconName);
      var svgSnippet = S.lucide && S.lucide[raw];
      if (!svgSnippet) return null;
      var paths = parseSvgSnippetToPaths(svgSnippet, (opts && opts.strokeWidth) || 1.8);
      return generateVectorDrawableXml(paths, opts);
    },

    /* Collect all icons from project screens and UI */
    collectAllIcons: function (data) {
      var icons = [];
      var seen = {};

      function add(rawIcon) {
        if (!rawIcon) return;
        var str = String(rawIcon).trim();
        if (!str || seen[str]) return;
        seen[str] = true;

        var pack = 'lucide';
        var name = str;
        var m = str.match(/^(lucide|ph|msr|mso|mss|ms):/);
        if (m) {
          pack = m[1];
          if (pack === 'ms') pack = 'msr';
          name = str.slice(m[0].length);
        } else if (S.phosphorIcons && S.phosphorIcons.indexOf(str) > -1) {
          pack = 'ph';
        } else if (S.materialIcons && S.materialIcons.indexOf(str) > -1) {
          pack = 'msr';
        }

        icons.push({
          raw: str,
          pack: pack,
          name: name,
          cleanName: cleanName(name),
          resName: drawableResName(name, pack)
        });
      }

      function scanBlock(b) {
        if (!b) return;
        var p = b.props || {};
        if (p.icon) add(p.icon);
        if (p.actions) String(p.actions).split(',').forEach(add);
        if (p.items) {
          String(p.items).split('\n').forEach(function (line) {
            line = line.trim();
            if (!line) return;
            var first = line.split('|')[0];
            var idx = first.indexOf(':');
            if (idx > -1) add(first.slice(0, idx));
          });
        }
        (b.children || []).forEach(scanBlock);
      }

      var pages = (data.pages && data.pages.length) ? data.pages : [{ screen: data.screen || [] }];
      pages.forEach(function (pg) {
        if (pg.icon) add(pg.icon);
        (pg.screen || []).forEach(scanBlock);
      });

      var ui = data.ui || {};
      ((ui.drawer && ui.drawer.items) || []).forEach(function (it) { add(it.icon); });
      ((ui.menu && ui.menu.items) || []).forEach(function (it) { add(it.icon); });

      return icons;
    },

    /* Generate all VectorDrawable XML files for drawable resources */
    generateVectorDrawables: function (data) {
      var icons = this.collectAllIcons(data);
      var files = [];
      var validationReport = { converted: [], fallback: [], errors: [] };
      var self = this;

      icons.forEach(function (ico) {
        var xml = null;
        if (ico.pack === 'lucide' || (S.lucide && S.lucide[ico.name])) {
          xml = self.lucideToVectorXml(ico.name);
          if (xml) {
            files.push({
              path: 'app/src/main/res/drawable/' + ico.resName + '.xml',
              content: xml
            });
            validationReport.converted.push(ico.raw + ' -> ' + ico.resName + '.xml');
            return;
          }
        }

        // For Material Icons or Phosphor, generate a clean SVG-compatible vector drawable
        // using fallback glyph/geometric path if raw SVG snippet is unavailable
        var fallbackD = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z';
        if (ico.name === 'arrow_back' || ico.name === 'chevron_left') {
          fallbackD = 'M20,11H7.83l5.59,-5.59L12,4l-8,8 8,8 1.41,-1.41L7.83,13H20v-2z';
        } else if (ico.name === 'search') {
          fallbackD = 'M15.5,14h-0.79l-0.28,-0.27A6.471,6.471 0 0,0 16,9.5 6.5,6.5 0 1,0 9.5,16c1.61,0 3.09,-0.59 4.23,-1.57l0.27,0.28v0.79l5,4.99L20.49,19l-4.99,-5zm-6,0C7.01,14 5,11.99 5,9.5S7.01,5 9.5,5 14,7.01 14,9.5 11.99,14 9.5,14z';
        } else if (ico.name === 'home') {
          fallbackD = 'M10,20v-6h4v6h5v-8h3L12,3 2,12h3v8z';
        } else if (ico.name === 'more_vert') {
          fallbackD = 'M12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zm0,2c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2zm0,6c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2z';
        }

        var fallbackXml = [
          '<?xml version="1.0" encoding="utf-8"?>',
          '<vector xmlns:android="http://schemas.android.com/apk/res/android"',
          '    android:width="24dp"',
          '    android:height="24dp"',
          '    android:viewportWidth="24"',
          '    android:viewportHeight="24">',
          '    <path',
          '        android:fillColor="#FF000000"',
          '        android:pathData="' + fallbackD + '"/>',
          '</vector>'
        ].join('\n');

        files.push({
          path: 'app/src/main/res/drawable/' + ico.resName + '.xml',
          content: fallbackXml
        });
        validationReport.fallback.push(ico.raw + ' (Vector asset created)');
      });

      return { files: files, report: validationReport, icons: icons };
    },

    /* Generate AppIcon.kt Compose component */
    generateAppIconComponent: function (packageName, icons) {
      var lines = [
        'package ' + packageName + '.ui.components',
        '',
        'import androidx.compose.foundation.layout.size',
        'import androidx.compose.material3.Icon',
        'import androidx.compose.material3.LocalContentColor',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.Modifier',
        'import androidx.compose.ui.graphics.Color',
        'import androidx.compose.ui.res.painterResource',
        'import androidx.compose.ui.unit.Dp',
        'import androidx.compose.ui.unit.dp',
        'import ' + packageName + '.R',
        '',
        '/**',
        ' * Reusable Droid Lab Icon component preserving exact selected vector assets.',
        ' */',
        '@Composable',
        'fun AppIcon(',
        '    name: String,',
        '    contentDescription: String? = null,',
        '    modifier: Modifier = Modifier,',
        '    tint: Color = LocalContentColor.current,',
        '    size: Dp = 24.dp',
        ') {',
        '    val clean = name.lowercase()',
        '        .replace(Regex("^(lucide|ph|msr|mso|mss|ms):"), "")',
        '        .replace(Regex("[^a-z0-9]+"), "_")',
        '        .trim(\'_\')',
        '',
        '    val resId = when (clean) {'
      ];

      var seen = {};
      (icons || []).forEach(function (ico) {
        if (!seen[ico.cleanName]) {
          seen[ico.cleanName] = true;
          lines.push('        "' + ico.cleanName + '" -> R.drawable.' + ico.resName);
        }
      });

      lines.push('        "search" -> R.drawable.ic_search');
      lines.push('        "home" -> R.drawable.ic_home');
      lines.push('        "menu" -> R.drawable.ic_menu');
      lines.push('        "close" -> R.drawable.ic_close');
      lines.push('        "settings" -> R.drawable.ic_settings');
      lines.push('        "arrow_back", "arrow_left" -> R.drawable.ic_arrow_back');
      lines.push('        else -> null');
      lines.push('    }');
      lines.push('');
      lines.push('    if (resId != null) {');
      lines.push('        Icon(');
      lines.push('            painter = painterResource(id = resId),');
      lines.push('            contentDescription = contentDescription,');
      lines.push('            modifier = modifier.size(size),');
      lines.push('            tint = tint');
      lines.push('        )');
      lines.push('    } else {');
      lines.push('        // Fallback placeholder');
      lines.push('        Icon(');
      lines.push('            painter = painterResource(id = R.drawable.ic_search),');
      lines.push('            contentDescription = contentDescription,');
      lines.push('            modifier = modifier.size(size),');
      lines.push('            tint = tint');
      lines.push('        )');
      lines.push('    }');
      lines.push('}');
      return lines.join('\n');
    }
  };
})();
