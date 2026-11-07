/* Generates an Android architecture + resource handoff from the app screens. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;

  /* ---------- small helpers ---------- */

  function unique(list) {
    var out = [];
    list.forEach(function (value) {
      if (value == null) return;
      var text = String(value).trim();
      if (!text || out.indexOf(text) > -1) return;
      out.push(text);
    });
    return out;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slug(value, fallback) {
    return String(value || fallback || 'item').toLowerCase()
      .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 48) || (fallback || 'item');
  }

  function resourceName(value, fallback) {
    return slug(value, fallback).replace(/_+/g, '_');
  }

  function mdCell(value) {
    return String(value == null ? '' : value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  }

  function xml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  function kotlin(value) {
    return String(value == null ? '' : value)
      .replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      .replace(/\$/g, '\\$').replace(/\r?\n/g, '\\n');
  }

  function hex(value, fallback) {
    var text = String(value || fallback || '#6750A4').replace('#', '').trim();
    if (text.length === 3) text = text.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-fA-F]{6,8}$/.test(text)) text = String(fallback || '#6750A4').replace('#', '');
    return text.toUpperCase();
  }

  function color(value, fallback) {
    var text = hex(value, fallback);
    if (text.length === 6) return 'Color(0xFF' + text + ')';
    return 'Color(0x' + text + ')';
  }

  function weightName(weight) {
    return ({
      100: 'thin', 200: 'extralight', 300: 'light', 400: 'regular',
      500: 'medium', 600: 'semibold', 700: 'bold', 800: 'extrabold', 900: 'black'
    })[Number(weight)] || ('w' + weight);
  }

  function fontFile(family, weight) {
    return slug(family, 'font') + '_' + weightName(weight) + '.ttf';
  }

  function googleFontUrl(family) {
    return 'https://fonts.google.com/specimen/' + String(family || '').replace(/\s+/g, '+');
  }

  function pagesOf(d) {
    if (Array.isArray(d.pages) && d.pages.length) return d.pages;
    return [{ id: 'screen-1', name: 'Screen 1', icon: 'msr:apps', screen: d.screen || [] }];
  }

  function flatten(list, out) {
    (list || []).forEach(function (block) {
      out.push(block);
      flatten(block.children, out);
    });
    return out;
  }

  function blockLabel(block) {
    var def = S.components[block.type];
    return (def && def.label) || block.type;
  }

  function propText(props, key) {
    var value = props && props[key];
    return value == null ? '' : String(value).replace(/\s+/g, ' ').trim();
  }

  /* ---------- architecture / component guidance ---------- */

  var COMPONENTS = {
    appbar: ['TopAppBar / LargeTopAppBar / CenterAlignedTopAppBar', 'Place in Scaffold(topBar = ...). Use TopAppBarDefaults for scroll behaviour.'],
    searchbar: ['SearchBar / DockedSearchBar', 'Keep query in ViewModel; debounce 250-300 ms before filtering.'],
    tabs: ['PrimaryTabRow + Tab', 'Hoist the selected index in the ViewModel or rememberSaveable.'],
    hero: ['Card + Box + Brush.linearGradient', 'Use AsyncImage if you replace the watermark icon with real art.'],
    section: ['Row + Text(titleMedium) + TextButton', 'Use Arrangement.SpaceBetween for the action label.'],
    card: ['Card / ElevatedCard / OutlinedCard', 'Map variant -> CardDefaults.cardColors / elevatedCardColors / border.'],
    list: ['LazyColumn + ListItem', 'Use ListItemDefaults and stable keys for long lists.'],
    button: ['Button / FilledTonalButton / OutlinedButton / TextButton / ElevatedButton', 'Map the mockup variant directly; keep one primary action per area.'],
    chips: ['LazyRow + FilterChip', 'Selected chip is UI state; animatedContent or AnimatedVisibility for the check icon.'],
    textfield: ['OutlinedTextField / TextField', 'Add KeyboardOptions/KeyboardActions and supportingText.'],
    switchrow: ['ListItem + Switch', 'Fire an event up; do not mutate UI state in the composable.'],
    snackbar: ['SnackbarHost + SnackbarHostState', 'Call showSnackbar from a LaunchedEffect on a one-shot event.'],
    dialog: ['AlertDialog', 'Drive visibility from state and clear it on confirm/dismiss.'],
    sheet: ['ModalBottomSheet + SheetState', 'Remember the sheet state; hide via coroutine scope.'],
    progress: ['LinearProgressIndicator', 'Use progress = { value } for determinate progress.'],
    fab: ['FloatingActionButton / ExtendedFloatingActionButton', 'Place in Scaffold(floatingActionButton = ...), above the bottom bar.'],
    bottomnav: ['NavigationBar + NavigationBarItem', 'Keep pinned in Scaffold(bottomBar = ...); Navigation Compose owns the back stack.'],
    musicplayer: ['Custom composable + Slider + IconButton', 'Use Media3 ExoPlayer/MediaController; never hold a player in a composable.'],
    tracklist: ['LazyColumn + ListItem', 'Highlight the playing row with MaterialTheme.colorScheme.primaryContainer.'],
    albumgrid: ['LazyVerticalGrid(columns = GridCells.Fixed(n))', 'Use contentPadding and spacedBy for the grid gutter.'],
    listennow: ['LazyRow + Card', 'Horizontal rails use LazyRow; snap with rememberSnapFlingBehavior if wanted.'],
    miniplayer: ['Surface + LinearProgressIndicator + Row', 'Dock in Scaffold bottomBar above NavigationBar (Column { MiniPlayer(); NavigationBar() }).'],
    downloaditem: ['ListItem + LinearProgressIndicator + IconButton', 'Observe download progress from a repository/WorkManager flow.'],
    downloadqueue: ['Column + download rows', 'Use WorkManager for durable downloads; expose WorkInfo as Flow.'],
    storageusage: ['Card + LinearProgressIndicator + legend', 'Calculate sizes off the main thread (Dispatchers.IO).'],
    filegrid: ['LazyVerticalGrid of Cards', 'Each category card can open a filtered file list route.'],
    vaultlist: ['LazyColumn + OutlinedTextField + ListItem', 'Never log secrets; use Keystore-backed encryption.'],
    secretcard: ['Card + masked Text + strength indicator', 'Copy actions should clear the clipboard after a timeout.'],
    securityscore: ['Card + CircularProgressIndicator / Canvas arc', 'Compute the score in a use case, not in the composable.'],
    passwordgen: ['Card + Slider + OutlinedTextField + Button', 'Generate with SecureRandom; keep the password out of saved state.'],
    statrow: ['Row + Card(Modifier.weight(1f))', 'Wrap in FlowRow if the tile count can grow.'],
    profileheader: ['Column + Avatar + Text', 'Use Coil AsyncImage for a real avatar, initials as placeholder.'],
    quickactions: ['LazyVerticalGrid / FlowRow of icon buttons', 'Use a stable key per action; expose click intents.'],
    settingslist: ['ListItem groups + HorizontalDivider', 'Use a Scaffold top bar and preference-style rows.'],
    emptystate: ['Column(horizontalAlignment = CenterHorizontally)', 'Compose a large icon, title, body and optional action.'],
    notice: ['Card with tonal container colour + Row', 'Use colorScheme.secondaryContainer / tertiaryContainer by severity.'],
    contentheader: ['Column + Text headline + supporting text', 'Keep it inside the LazyColumn as a header item.'],
    foldergrid: ['LazyVerticalGrid of folders', 'Pair with a file-list route.'],
    searchpage: ['SearchBar + LazyColumn of results', 'Use a dedicated route when search mode is "page".']
  };

  var ICON_MAP = {
    home: 'Home', explore: 'Explore', search: 'Search', menu: 'Menu', close: 'Close',
    settings: 'Settings', share: 'Share', edit: 'Edit', delete: 'Delete', add: 'Add',
    arrow_forward: 'ArrowForward', arrow_back: 'ArrowBack', chevron_right: 'ChevronRight',
    chevron_left: 'ChevronLeft', more_vert: 'MoreVert', more_horiz: 'MoreHoriz',
    person: 'Person', account_circle: 'AccountCircle', favorite: 'Favorite',
    bookmark: 'Bookmark', star: 'Star', check: 'Check', check_circle: 'CheckCircle',
    info: 'Info', warning: 'Warning', play_arrow: 'PlayArrow', pause: 'Pause',
    skip_next: 'SkipNext', skip_previous: 'SkipPrevious', shuffle: 'Shuffle',
    repeat: 'Repeat', download: 'Download', upload: 'Upload', folder: 'Folder',
    lock: 'Lock', visibility: 'Visibility', visibility_off: 'VisibilityOff',
    notifications: 'Notifications', shopping_cart: 'ShoppingCart', language: 'Language',
    extension: 'Extension', apps: 'Apps', dashboard: 'Dashboard', grid_view: 'GridView',
    view_list: 'ViewList', filter_list: 'FilterList', sort: 'Sort', tune: 'Tune',
    refresh: 'Refresh', sync: 'Sync', cloud_download: 'CloudDownload', history: 'History',
    headphones: 'Headphones', music_note: 'MusicNote', album: 'Album', movie: 'Movie',
    smartphone: 'Smartphone', storefront: 'Storefront', shield: 'Shield', key: 'Key',
    timer: 'Timer', schedule: 'Schedule', mail: 'Mail', send: 'Send', attach_money: 'AttachMoney'
  };

  /* ---------- data collection ---------- */

  function collectIcons(d, pages) {
    var found = [];
    var add = function (value) {
      value = String(value || '').trim();
      if (!value) return;
      /* msr:home / lucide:home / ph:house */
      found.push(value);
    };
    var addList = function (value) {
      String(value || '').split(',').forEach(function (item) { add(item); });
    };

    pages.forEach(function (page) {
      add(page.icon);
      flatten(page.screen, []).forEach(function (block) {
        var def = S.components[block.type];
        if (!def) return;
        (def.fields || []).forEach(function (field) {
          if (field.type === 'icon') add(block.props[field.key]);
        });
        var p = block.props || {};
        if (block.type === 'appbar') addList(p.actions);
        if (block.type === 'bottomnav' || block.type === 'sheet' || block.type === 'quickactions') {
          String(p.items || '').split('\n').forEach(function (line) {
            line = line.trim();
            if (!line) return;
            var first = line.split('|')[0];
            var idx = first.indexOf(':');
            if (idx > -1) add(first.slice(0, idx));
          });
        }
        if (block.type === 'filegrid') {
          String(p.items || '').split('\n').forEach(function (line) {
            var first = line.split('|')[0];
            var idx = first.indexOf(':');
            if (idx > -1) add(first.slice(0, idx));
          });
        }
        if (block.type === 'downloadqueue' || block.type === 'vaultlist') {
          String(p.items || '').split('\n').forEach(function (line) {
            var parts = line.split('|');
            if (parts.length > 3) add(parts[3]);
          });
        }
        if (block.type === 'albumgrid' || block.type === 'listennow') {
          String(p.items || '').split('\n').forEach(function (line) {
            var parts = line.split('|');
            if (parts.length > 2) add(parts[2]);
          });
        }
        if (block.type === 'statrow') {
          String(p.items || '').split('\n').forEach(function (line) {
            var parts = line.split('|');
            if (parts.length > 2) add(parts[2]);
          });
        }
      });
    });

    var ui = d.ui || {};
    ((ui.drawer || {}).items || []).forEach(function (item) { add(item.icon); });
    ((ui.menu || {}).items || []).forEach(function (item) { add(item.icon); });

    var seen = {};
    return found.filter(function (value) {
      var name = S.iconName ? S.iconName(value) : value;
      if (!name || seen[name]) return false;
      seen[name] = true;
      return true;
    });
  }

  function collectFonts(d, pages) {
    var found = [];
    var add = function (name) { if (name && found.indexOf(name) === -1) found.push(name); };
    add((d.theme.fonts || {}).ui);
    add((d.theme.fonts || {}).display);
    pages.forEach(function (page) {
      flatten(page.screen, []).forEach(function (block) {
        if (block.typography && block.typography.family) add(block.typography.family);
      });
    });
    return found;
  }

  function collectStrings(d, pages) {
    var out = [];
    var used = {};
    var add = function (name, value) {
      value = String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
      if (!value || value.length > 120 || /^[\d\s.,:%+-]+$/.test(value)) return;
      if (out.length >= 80) return;
      var key = resourceName(name, 'text');
      if (used[key]) {
        var n = 2;
        while (used[key + '_' + n]) n++;
        key = key + '_' + n;
      }
      used[key] = true;
      out.push({ name: key, value: value });
    };

    pages.forEach(function (page) {
      add('page_' + slug(page.name, 'screen'), page.name);
      flatten(page.screen, []).forEach(function (block) {
        var p = block.props || {};
        ['title', 'label', 'kicker', 'subtitle', 'placeholder', 'action', 'cta', 'message',
          'confirm', 'cancel', 'support', 'text', 'link', 'brand', 'summary'].forEach(function (key) {
          if (p[key] == null) return;
          var value = String(p[key]);
          if (/\n|\|/.test(value)) return;
          add(slug(page.name, 'screen') + '_' + block.type + '_' + key, value);
        });
      });
    });

    var ui = d.ui || {};
    var drawer = ui.drawer || {};
    var menu = ui.menu || {};
    var search = ui.search || {};
    ((drawer.items || [])).forEach(function (item) { add('drawer_' + slug(item.label, 'item'), item.label); });
    ((menu.items || [])).forEach(function (item) { add('menu_' + slug(item.label, 'item'), item.label); });
    add('drawer_title', (drawer.header || {}).title);
    add('drawer_subtitle', (drawer.header || {}).subtitle);
    add('search_placeholder', search.placeholder);
    add('search_chips', search.chips);
    add('search_hint', search.hint);
    add('search_guide', search.guide);
    add('close_drawer', drawer.closeLabel);
    return out;
  }

  /* ---------- colour / font resource generation ---------- */

  function palettes(theme) {
    var p = theme.primary || '#6750A4';
    function build(dark) {
      var core = dark ? {
        primary: U.mix(p, '#ffffff', 0.55),
        onPrimary: U.mix(p, '#000000', 0.65),
        primaryContainer: U.mix(p, '#000000', 0.5),
        onPrimaryContainer: U.mix(p, '#ffffff', 0.86),
        secondaryContainer: U.mix(p, '#000000', 0.62),
        onSecondaryContainer: U.mix(p, '#ffffff', 0.86),
        tertiary: U.mix(p, '#ffb4a9', 0.42)
      } : {
        primary: p,
        onPrimary: U.onColor(p),
        primaryContainer: U.mix(p, '#ffffff', 0.8),
        onPrimaryContainer: U.mix(p, '#000000', 0.72),
        secondaryContainer: U.mix(p, '#ffffff', 0.72),
        onSecondaryContainer: U.mix(p, '#000000', 0.68),
        tertiary: U.mix(p, '#7d5260', 0.42)
      };
      var neutral = dark ? {
        background: '#141218', surface: '#141218', surfaceVariant: '#49454F',
        onBackground: '#E6E0E9', onSurface: '#E6E0E9', onSurfaceVariant: '#CAC4D0',
        outline: '#938F99', surfaceContainer: U.mix('#1D1B20', p, 0.04)
      } : {
        background: '#FFFBFE', surface: '#FFFBFE', surfaceVariant: '#E7E0EC',
        onBackground: '#1C1B1F', onSurface: '#1C1B1F', onSurfaceVariant: '#49454F',
        outline: '#79747E', surfaceContainer: U.mix('#F3EDF7', p, 0.02)
      };
      return Object.assign(core, neutral);
    }
    return { light: build(false), dark: build(true) };
  }

  function colorKt(theme) {
    var pal = palettes(theme);
    var lines = ['package com.example.droidlab.ui.theme', '', 'import androidx.compose.ui.graphics.Color', ''];
    ['light', 'dark'].forEach(function (mode) {
      var prefix = mode === 'light' ? 'Light' : 'Dark';
      lines.push('/* ' + mode + ' palette */');
      Object.keys(pal[mode]).forEach(function (key) {
        lines.push('val ' + prefix + key.charAt(0).toUpperCase() + key.slice(1) + ' = ' + color(pal[mode][key]));
      });
      lines.push('');
    });
    return lines.join('\n');
  }

  function typeKt(theme, fonts, blockTypography) {
    var ui = (theme.fonts || {}).ui || 'Inter';
    var display = (theme.fonts || {}).display || ui;
    var type = theme.type || {};
    var base = Number(type.size) || 15;
    var weight = Number(type.weight) || 400;
    var spacing = Number(type.spacing) || 0;
    var weights = [300, 400, 500, 600, 700];
    var lines = [
      'package com.example.droidlab.ui.theme',
      '',
      'import androidx.compose.material3.Typography',
      'import androidx.compose.ui.text.TextStyle',
      'import androidx.compose.ui.text.font.Font',
      'import androidx.compose.ui.text.font.FontFamily',
      'import androidx.compose.ui.text.font.FontWeight',
      'import androidx.compose.ui.unit.sp',
      ''
    ];

    function family(name, varName, list) {
      lines.push('val ' + varName + ' = FontFamily(');
      list.forEach(function (w, i) {
        lines.push('    Font(R.font.' + slug(name, 'font') + '_' + weightName(w) + ', FontWeight.' +
          weightApi(w) + ')' + (i === list.length - 1 ? '' : ','));
      });
      lines.push(')', '');
    }
    function weightApi(w) {
      return ({ 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Normal', 500: 'Medium',
        600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' })[Number(w)] || 'Normal';
    }

    family(ui, 'UiFont', weights);
    if (display !== ui) family(display, 'DisplayFont', weights);
    else lines.push('val DisplayFont = UiFont', '');

    lines.push('val AppTypography = Typography(');
    lines.push('    displayLarge = TextStyle(fontFamily = DisplayFont, fontWeight = FontWeight.Bold, fontSize = 44.sp, lineHeight = 50.sp),');
    lines.push('    headlineLarge = TextStyle(fontFamily = DisplayFont, fontWeight = FontWeight.SemiBold, fontSize = 30.sp, lineHeight = 36.sp),');
    lines.push('    headlineMedium = TextStyle(fontFamily = DisplayFont, fontWeight = FontWeight.SemiBold, fontSize = 24.sp, lineHeight = 30.sp),');
    lines.push('    titleLarge = TextStyle(fontFamily = DisplayFont, fontWeight = FontWeight.SemiBold, fontSize = 20.sp, lineHeight = 26.sp),');
    lines.push('    titleMedium = TextStyle(fontFamily = UiFont, fontWeight = FontWeight.Medium, fontSize = 16.sp, lineHeight = 22.sp),');
    lines.push('    bodyLarge = TextStyle(fontFamily = UiFont, fontWeight = FontWeight.' + weightApi(weight) +
      ', fontSize = ' + base + '.sp, lineHeight = ' + (base + 6) + '.sp, letterSpacing = ' + spacing + '.sp),');
    lines.push('    bodyMedium = TextStyle(fontFamily = UiFont, fontWeight = FontWeight.' + weightApi(weight) +
      ', fontSize = ' + Math.round((base - 1) * 10) / 10 + '.sp, lineHeight = ' + (base + 4) + '.sp),');
    lines.push('    labelLarge = TextStyle(fontFamily = UiFont, fontWeight = FontWeight.Medium, fontSize = 14.sp, lineHeight = 20.sp),');
    lines.push('    labelMedium = TextStyle(fontFamily = UiFont, fontWeight = FontWeight.Medium, fontSize = 12.sp, lineHeight = 16.sp)');
    lines.push(')', '');

    if (blockTypography.length) {
      lines.push('/* Per-block overrides detected in the mockup */');
      blockTypography.forEach(function (item, index) {
        var style = item.typography || {};
        lines.push('val ' + (style.family ? slug(style.family, 'custom') + '_' : '') + 'BlockStyle' + (index + 1) +
          ' = TextStyle(' +
          'fontFamily = ' + (style.family ? 'FontFamily(Font(R.font.' + slug(style.family, 'font') + '_regular))' : 'UiFont') +
          (style.size ? ', fontSize = ' + style.size + '.sp' : '') +
          (style.weight ? ', fontWeight = FontWeight.' + weightApi(style.weight) : '') +
          (style.lineHeight ? ', lineHeight = ' + style.lineHeight + '.sp' : '') +
          (style.letterSpacing ? ', letterSpacing = ' + style.letterSpacing + '.sp' : '') +
          ')');
      });
      lines.push('');
    }
    return lines.join('\n');
  }

  function themeKt() {
    return [
      'package com.example.droidlab.ui.theme',
      '',
      'import androidx.compose.foundation.shape.RoundedCornerShape',
      'import androidx.compose.material3.MaterialTheme',
      'import androidx.compose.material3.Shapes',
      'import androidx.compose.material3.darkColorScheme',
      'import androidx.compose.material3.lightColorScheme',
      'import androidx.compose.runtime.Composable',
      'import androidx.compose.ui.unit.dp',
      '',
      'private val LightColors = lightColorScheme(',
      '    primary = LightPrimary, onPrimary = LightOnPrimary,',
      '    primaryContainer = LightPrimaryContainer, onPrimaryContainer = LightOnPrimaryContainer,',
      '    secondaryContainer = LightSecondaryContainer, onSecondaryContainer = LightOnSecondaryContainer,',
      '    tertiary = LightTertiary, background = LightBackground, surface = LightSurface,',
      '    surfaceVariant = LightSurfaceVariant, onSurface = LightOnSurface,',
      '    onSurfaceVariant = LightOnSurfaceVariant, outline = LightOutline',
      ')',
      '',
      'private val DarkColors = darkColorScheme(',
      '    primary = DarkPrimary, onPrimary = DarkOnPrimary,',
      '    primaryContainer = DarkPrimaryContainer, onPrimaryContainer = DarkOnPrimaryContainer,',
      '    secondaryContainer = DarkSecondaryContainer, onSecondaryContainer = DarkOnSecondaryContainer,',
      '    tertiary = DarkTertiary, background = DarkBackground, surface = DarkSurface,',
      '    surfaceVariant = DarkSurfaceVariant, onSurface = DarkOnSurface,',
      '    onSurfaceVariant = DarkOnSurfaceVariant, outline = DarkOutline',
      ')',
      '',
      'private val AppShapes = Shapes(',
      '    extraSmall = RoundedCornerShape(8.dp),',
      '    small = RoundedCornerShape(12.dp),',
      '    medium = RoundedCornerShape(AppRadius),',
      '    large = RoundedCornerShape(AppRadius + 4.dp),',
      '    extraLarge = RoundedCornerShape(AppRadius + 12.dp)',
      ')',
      '',
      '@Composable',
      'fun DroidLabTheme(',
      '    darkTheme: Boolean = AppDarkTheme,',
      '    content: @Composable () -> Unit',
      ') {',
      '    MaterialTheme(',
      '        colorScheme = if (darkTheme) DarkColors else LightColors,',
      '        typography = AppTypography,',
      '        shapes = AppShapes,',
      '        content = content',
      '    )',
      '}'
    ].join('\n');
  }

  function dimensKt(d) {
    var theme = d.theme || {};
    var density = theme.density === 'compact' ? 12 : theme.density === 'comfy' ? 20 : 16;
    var device = d.device || {};
    return [
      'package com.example.droidlab.ui.theme',
      '',
      'import androidx.compose.ui.unit.dp',
      '',
      '/* The mockup is drawn at ' + (device.width || 390) + ' x ' + (device.height || 844) + ' px.',
      '   Android design widths are dp, so the layout keeps the same numbers at mdpi. */',
      'val DesignWidth = ' + (Number(device.width) || 390) + '.dp',
      'val DesignHeight = ' + (Number(device.height) || 844) + '.dp',
      'val AppRadius = ' + (Number(theme.radius) || 18) + '.dp',
      'val ScreenPadding = ' + density + '.dp',
      'val SectionGap = ' + Math.round(density * 1.25) + '.dp',
      'val CardGap = ' + Math.round(density * 0.75) + '.dp',
      'val IconSize = 24.dp',
      'val StatusBarReference = 34.dp /* mockup --ui-top; use WindowInsets.statusBars in the app */',
      'val BottomBarHeight = 80.dp'
    ].join('\n');
  }

  function symbolIconKt() {
    return [
      'package com.example.droidlab.ui.components',
      '',
      'import androidx.compose.foundation.layout.size',
      'import androidx.compose.material3.Text',
      'import androidx.compose.runtime.Composable',
      'import androidx.compose.ui.Modifier',
      'import androidx.compose.ui.graphics.Color',
      'import androidx.compose.ui.text.TextStyle',
      'import androidx.compose.ui.text.font.Font',
      'import androidx.compose.ui.text.font.FontFamily',
      'import androidx.compose.ui.text.style.TextAlign',
      'import androidx.compose.ui.unit.dp',
      'import androidx.compose.ui.unit.sp',
      '',
      'val MaterialSymbols = FontFamily(Font(R.font.material_symbols_rounded))',
      '',
      '/* Material Symbols uses ligatures, so the icon name is the text. */',
      '@Composable',
      'fun SymbolIcon(',
      '    name: String,',
      '    contentDescription: String? = null,',
      '    modifier: Modifier = Modifier,',
      '    tint: Color = Color.Unspecified,',
      '    size: Int = 24',
      ') {',
      '    Text(',
      '        text = name,',
      '        modifier = modifier.size(size.dp),',
      '        color = tint,',
      '        fontSize = size.sp,',
      '        fontFamily = MaterialSymbols,',
      '        textAlign = TextAlign.Center,',
      '        style = TextStyle(lineHeight = size.sp)',
      '    )',
      '}'
    ].join('\n');
  }

  function navHostKt(pages) {
    var lines = [
      'package com.example.droidlab.ui.navigation',
      '',
      'import androidx.compose.runtime.Composable',
      'import androidx.navigation.compose.NavHost',
      'import androidx.navigation.compose.composable',
      'import androidx.navigation.compose.rememberNavController',
      '',
      'sealed class Dest(val route: String) {'
    ];
    pages.forEach(function (page, index) {
      lines.push('    data object ' + routeName(page, index) + ' : Dest("' + route(page, index) + '")');
    });
    lines.push('}', '');
    lines.push('@Composable');
    lines.push('fun AppNavHost() {');
    lines.push('    val nav = rememberNavController()');
    lines.push('    NavHost(navController = nav, startDestination = "' + route(pages[0], 0) + '") {');
    pages.forEach(function (page, index) {
      var screen = routeName(page, index) + 'Screen';
      lines.push('        composable(Dest.' + routeName(page, index) + '.route) { ' + screen + '(nav) }');
    });
    lines.push('    }');
    lines.push('}');
    return lines.join('\n');
  }

  function screenKt(page, index, d) {
    var blocks = flatten(page.screen, []);
    var hasAppbar = blocks.some(function (b) { return b.type === 'appbar'; });
    var hasNav = blocks.some(function (b) { return b.type === 'bottomnav'; });
    var hasFab = blocks.some(function (b) { return b.type === 'fab'; });
    var hasMini = blocks.some(function (b) { return b.type === 'miniplayer'; });
    var name = routeName(page, index);
    var lines = [
      'package com.example.droidlab.ui.screens',
      '',
      'import androidx.compose.foundation.layout.*',
      'import androidx.compose.foundation.lazy.LazyColumn',
      'import androidx.compose.material.icons.Icons',
      'import androidx.compose.material.icons.rounded.Menu',
      'import androidx.compose.material3.*',
      'import androidx.compose.runtime.*',
      'import androidx.compose.ui.Modifier',
      'import androidx.compose.ui.unit.dp',
      'import androidx.lifecycle.compose.collectAsStateWithLifecycle',
      'import androidx.lifecycle.viewmodel.compose.viewModel',
      'import com.example.droidlab.ui.theme.DroidLabTheme',
      'import com.example.droidlab.ui.theme.ScreenPadding',
      '',
      '@Composable',
      'fun ' + name + 'Route(viewModel: ' + name + 'ViewModel = viewModel()) {',
      '    val state by viewModel.uiState.collectAsStateWithLifecycle()',
      '    ' + name + 'Screen(',
      '        state = state,',
      '        onEvent = viewModel::onEvent,',
      '        onOpenDrawer = viewModel::openDrawer',
      '    )',
      '}',
      '',
      '@Composable',
      'fun ' + name + 'Screen(',
      '    state: ' + name + 'UiState,',
      '    onEvent: (' + name + 'Event) -> Unit,',
      '    onOpenDrawer: () -> Unit',
      ') {',
      '    Scaffold(',
    ];
    if (hasAppbar) {
      lines.push('        topBar = {');
      lines.push('            TopAppBar(');
      lines.push('                title = { Text("' + kotlin(page.name) + '") },');
      lines.push('                navigationIcon = {');
      lines.push('                    IconButton(onClick = onOpenDrawer) {');
      lines.push('                        Icon(Icons.Rounded.Menu, contentDescription = "Open menu")');
      lines.push('                    }');
      lines.push('                }');
      lines.push('            )');
      lines.push('        },');
    }
    if (hasMini || hasNav) {
      lines.push('        bottomBar = {');
      lines.push('            Column {');
      if (hasMini) lines.push('                MiniPlayer(state, onEvent) /* docked above the navigation bar */');
      if (hasNav) lines.push('                AppBottomBar(state.selectedTab, onEvent)');
      lines.push('            }');
      lines.push('        },');
    }
    if (hasFab) {
      lines.push('        floatingActionButton = {');
      lines.push('            FloatingActionButton(onClick = { onEvent(' + name + 'Event.PrimaryAction) }) {');
      lines.push('                SymbolIcon("add")');
      lines.push('            }');
      lines.push('        },');
    }
    lines.push('    ) { inner ->');
    lines.push('        LazyColumn(');
    lines.push('            modifier = Modifier.fillMaxSize().padding(inner),');
    lines.push('            contentPadding = PaddingValues(ScreenPadding),');
    lines.push('            verticalArrangement = Arrangement.spacedBy(12.dp)');
    lines.push('        ) {');
    blocks.forEach(function (block) {
      if (block.type === 'bottomnav' || block.type === 'miniplayer') return;
      lines.push('            item { /* ' + mdCell(blockLabel(block)) + ' -> ' +
        (COMPONENTS[block.type] ? COMPONENTS[block.type][0] : 'composable') + ' */ }');
    });
    lines.push('        }');
    lines.push('    }');
    lines.push('}');
    lines.push('');
    lines.push('data class ' + name + 'UiState(');
    lines.push('    val selectedTab: Int = 0,');
    lines.push('    val isLoading: Boolean = false');
    lines.push(')');
    lines.push('');
    lines.push('sealed interface ' + name + 'Event {');
    lines.push('    data object PrimaryAction : ' + name + 'Event');
    lines.push('    data class SelectTab(val index: Int) : ' + name + 'Event');
    lines.push('}');
    return lines.join('\n');
  }

  function route(page, index) {
    return slug(page.name, 'screen' + (index + 1)).replace(/_/g, '-');
  }

  function routeName(page, index) {
    var name = String(page.name || 'Screen ' + (index + 1)).replace(/[^a-zA-Z0-9]+/g, ' ').trim()
      .split(/\s+/).map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); }).join('');
    if (!name || /^\d/.test(name)) name = 'Screen' + (index + 1);
    return name + 'Screen';
  }

  /* ---------- guide sections ---------- */

  function architectureSection(d, pages, blocks) {
    var hasMusic = blocks.some(function (b) { return ['musicplayer', 'tracklist', 'albumgrid', 'listennow', 'miniplayer'].indexOf(b.type) > -1; });
    var hasDownloads = blocks.some(function (b) { return ['downloaditem', 'downloadqueue', 'storageusage', 'filegrid'].indexOf(b.type) > -1; });
    var hasVault = blocks.some(function (b) { return ['vaultlist', 'secretcard', 'securityscore', 'passwordgen'].indexOf(b.type) > -1; });
    var hasSearch = blocks.some(function (b) { return b.type === 'searchpage' || b.type === 'searchbar'; }) ||
      ((d.ui || {}).search != null);

    var lines = [
      '## 1. Recommended architecture',
      '',
      'Use **Kotlin + Jetpack Compose + Material 3** with a single-activity, unidirectional-data-flow architecture. The mockup is a static design, so the biggest risk is putting layout state inside composables - keep every decision in a ViewModel instead.',
      '',
      '```text',
      'Compose UI  ->  ViewModel (StateFlow<UiState>)  ->  Use cases  ->  Repositories',
      '     ^                    |                                      |',
      '     |  events            | one-shot events                      +-> Room / DataStore',
      '     +--------------------+                                      +-> Retrofit + kotlinx.serialization' +
        (hasMusic ? '\n                                                                 +-> Media3 / ExoPlayer' : '') +
        (hasDownloads ? '\n                                                                 +-> WorkManager' : '') +
        (hasVault ? '\n                                                                 +-> Keystore / Security Crypto' : ''),
      '```',
      '',
      '| Concern | Recommendation | Why |',
      '| --- | --- | --- |',
      '| UI | Jetpack Compose + Material 3 | The mockup already follows Material components and tokens. |',
      '| State | `ViewModel` + `StateFlow<UiState>` + `collectAsStateWithLifecycle()` | Survives configuration changes and keeps composables stateless. |',
      '| Navigation | Navigation Compose, one route per screen | The pinned bottom navigation maps 1:1 to the mockup screens. |',
      '| DI | Hilt | Clear scoping for repositories, ViewModels and players. |',
      '| Local data | Room (content) + DataStore (preferences, search recents) | Round-trips the page/search state used in the mockup. |',
      '| Network | Retrofit + OkHttp + kotlinx.serialization | Standard, testable API layer. |',
      '| Images | Coil (`AsyncImage`) | The current design uses icon placeholders; swap in URLs without changing layout. |',
      '| Design system | One `DroidLabTheme` + token files | Colours, type, shape and spacing stay in `ui/theme`. |',
      '| Accessibility | `contentDescription`, min 48.dp touch targets, `LocalMotionDurationScale` | Compose animations honour the system animation scale. |',
      '| Testing | JUnit + Turbine + Compose UI tests | Test ViewModels and screen semantics separately. |',
      ''
    ];
    if (hasMusic) lines.push('- **Music blocks detected** - use Media3 `ExoPlayer` behind a `PlayerRepository`; expose `PlayerUiState` (track, position, playing) from a service-bound ViewModel. Never create a player inside a composable.');
    if (hasDownloads) lines.push('- **Download blocks detected** - use `WorkManager` with unique work per download, `setForeground` for long downloads, and expose `WorkInfo.progress` as a Flow.');
    if (hasVault) lines.push('- **Password blocks detected** - use `androidx.security:security-crypto` / Android Keystore, exclude secrets from `SavedStateHandle`, and clear the clipboard after copy.');
    if (hasSearch) lines.push('- **Search is part of the UI** - keep the query in `SavedStateHandle`, debounce with `snapshotFlow { query }.debounce(280)`, and model recents in DataStore.');
    lines.push('', '### Suggested package layout', '', '```text',
      'com.example.droidlab',
      '├── MainActivity.kt',
      '├── DroidLabApplication.kt',
      '├── di/',
      '├── data/',
      '│   ├── local/          Room entities, DAOs, DataStore',
      '│   ├── remote/         Retrofit services, DTOs',
      '│   └── repository/     Repository implementations',
      '├── domain/',
      '│   ├── model/',
      '│   └── usecase/',
      '├── ui/',
      '│   ├── theme/          Color.kt, Type.kt, Theme.kt, Shape.kt, Dimens.kt',
      '│   ├── components/     SymbolIcon, AppTopBar, AppBottomBar, SearchOverlay, MiniPlayer',
      '│   ├── navigation/     AppNavHost.kt, Dest.kt',
      '│   └── screens/        one package per screen',
      '└── util/',
      '```',
      '',
      '### Manifest / activity notes',
      '',
      '```kotlin',
      'class MainActivity : ComponentActivity() {',
      '    override fun onCreate(savedInstanceState: Bundle?) {',
      '        super.onCreate(savedInstanceState)',
      '        enableEdgeToEdge()',
      '        setContent { DroidLabTheme { AppRoot() } }',
      '    }',
      '}',
      '```',
      '',
      '`enableEdgeToEdge()` plus `Scaffold` insets replaces the mockup\'s fixed status-bar offset. Do not hardcode 34 dp - use `WindowInsets.statusBars` / `WindowInsets.navigationBars` so gesture and 3-button navigation both work.',
      ''
    );
    return lines.join('\n');
  }

  function screenMap(pages) {
    var lines = [
      '## 2. Screen map',
      '',
      '| Screen | Route | Compose entry point | Blocks |',
      '| --- | --- | --- | --- |'
    ];
    pages.forEach(function (page, index) {
      var blocks = flatten(page.screen, []);
      var counts = {};
      blocks.forEach(function (block) {
        counts[block.type] = (counts[block.type] || 0) + 1;
      });
      var summary = Object.keys(counts).map(function (type) {
        return counts[type] + '× ' + ((S.components[type] && S.components[type].label) || type);
      }).join(', ');
      lines.push('| ' + mdCell(page.name) + ' | `' + route(page, index) + '` | `' + routeName(page, index) +
        '` | ' + mdCell(summary || 'empty') + ' |');
    });
    lines.push('', 'Use `NavHost` + `composable(route)`, and switch bottom-navigation tabs with `popUpTo(startDestination) { saveState = true }` and `launchSingleTop = true` so each tab keeps its own back stack.', '');
    return lines.join('\n');
  }

  function componentSection(pages) {
    var seen = {};
    var rows = [];
    pages.forEach(function (page) {
      flatten(page.screen, []).forEach(function (block) {
        if (seen[block.type]) return;
        seen[block.type] = true;
        var map = COMPONENTS[block.type] || ['Custom composable', 'Recreate the block as a stateless composable.'];
        rows.push({
          type: block.type,
          label: blockLabel(block),
          compose: map[0],
          note: map[1]
        });
      });
    });
    var lines = [
      '## 3. Component mapping',
      '',
      '| Mockup block | Compose / Material 3 | Implementation note |',
      '| --- | --- | --- |'
    ];
    rows.forEach(function (row) {
      lines.push('| ' + mdCell(row.label) + ' (`' + row.type + '`) | ' + mdCell(row.compose) + ' | ' + mdCell(row.note) + ' |');
    });
    lines.push('', 'Keep each row in the table as a small stateless composable (`AppTopBar`, `HeroCard`, `TrackRow`, ...) that receives data and emits events. Screens should only arrange those components.', '');
    return lines.join('\n');
  }

  function interactionSection(d) {
    var ui = d.ui || {};
    var drawer = ui.drawer || {};
    var search = ui.search || {};
    var navStyle = null;
    (d.pages || []).forEach(function (page) {
      if (navStyle) return;
      (page.screen || []).forEach(function (block) {
        if (!navStyle && block.type === 'bottomnav') navStyle = block.props.style || 'material';
      });
    });
    var lines = [
      '## 4. Interaction and layout notes',
      '',
      '### Drawer',
      '',
      '```kotlin',
      'val drawerState = rememberDrawerState(DrawerValue.Closed)',
      'ModalNavigationDrawer(',
      '    drawerState = drawerState,',
      '    drawerContent = {',
      '        ModalDrawerSheet(Modifier.width(' + (Number(drawer.width) || 86) + '.dp)) {',
      '            DrawerHeader()',
      '            DrawerItems(onClick = { scope.launch { drawerState.close() } })',
      '        }',
      '    }',
      ') { AppNavHost() }',
      '```',
      '',
      '- Width: mockup `' + (Number(drawer.width) || 86) + '%` of the screen; use a fixed `' +
        Math.round((Number(d.width) || 390) * (Number(drawer.width) || 86) / 100) + '.dp` sheet width on phones.',
      '- Appearance: `' + (drawer.appearance || 'surface') + '` → ' +
        (drawer.appearance === 'glass' ? 'translucent `Surface` + `Modifier.blur` (API 31+) with a solid fallback.'
          : drawer.appearance === 'tinted' ? '`containerColor = MaterialTheme.colorScheme.secondaryContainer`.'
            : '`containerColor = MaterialTheme.colorScheme.surface`.'),
      '- Item shape `' + (drawer.itemShape || 'pill') + '`, density `' + (drawer.density || 'cozy') +
        '`, icons ' + (drawer.showIcons === false ? 'hidden' : 'shown') + '. Close control: ' +
        (drawer.closeStyle || 'icon') + '.',
      '',
      '### Search',
      '',
      '- Mode: **' + (search.mode === 'page' ? 'dedicated route' : 'overlay') + '**. ' +
        (search.mode === 'page'
          ? 'Add a `search` route and open it from the top bar / search field.'
          : 'Show a full-screen `Surface`/`Dialog` above the current screen - keep the underlying screen composed.'),
      '- Field radius `' + (Number(search.fieldRadius) || 14) + '.dp`; result style `' +
        (search.resultStyle || 'list') + '` (`list` → ListItem, `compact` → dense ListItem, `cards` → Card list).',
      '- Reaction `' + (search.reaction || 'slide') + '` → `AnimatedVisibility` with ' +
        (search.reaction === 'fade' ? '`fadeIn/fadeOut`' : search.reaction === 'zoom' ? '`scaleIn/scaleOut`' : '`slideInVertically/slideOutVertically`') + '.',
      '- Recents ' + (search.showRecents === false ? 'off' : 'on') + ', quick links ' +
        (search.showQuickLinks === false ? 'off' : 'on') + ', guide ' + (search.showGuide === false ? 'off' : 'on') + '.',
      '- Results should be a `LazyColumn`; announce the empty state with `liveRegion = LiveRegionMode.Polite`.',
      '',
      '### Bottom navigation',
      '',
      '- Mockup design: **' + (navStyle || 'material') + '**. Keep it pinned with `Scaffold(bottomBar = ...)`; it should not scroll with content.',
      '- `material` → `NavigationBar` + `NavigationBarItem`; `floating` → rounded `Surface` + `NavigationBar` with padding; `compact` → icon-only bar; `minimal` → small underline indicator; `glass` → translucent surface + blur fallback.',
      '- Connect selection to the NavController and mirror the selected route, not a local index.',
      '',
      '### Status bar, gesture bar and overlays',
      '',
      '- The preview adds a `' + (d.device.statusBar === false ? 'hidden' : '34 px') + '` status-bar inset. On Android use `Scaffold`/`WindowInsets` instead of the hardcoded value.',
      '- Drawer, search overlay and menus must live inside the inset-aware root, otherwise they cover the status bar.',
      '- Gesture bar: ' + (d.device.gestureBar === false ? 'disabled in the mockup; ' : '') + 'use `navigationBarsPadding()` for actions that sit at the bottom.',
      '- `prefers-reduced-motion` has no direct Android equivalent; respect the system animator duration scale (Compose animations do this automatically) and keep all motion under 300 ms.',
      ''
    ];
    return lines.join('\n');
  }

  function resourcesSection(d, pages, blocks) {
    var theme = d.theme || {};
    var type = theme.type || {};
    var icons = theme.icons || {};
    var device = d.device || {};
    var drawer = (d.ui || {}).drawer || {};
    var search = (d.ui || {}).search || {};
    var pal = palettes(theme);

    var lines = [
      '## 5. Resources used by this UI',
      '',
      '### Design tokens',
      '',
      '| Token | Value |',
      '| --- | --- |',
      '| Primary | `' + (theme.primary || '#6750A4') + '` |',
      '| Theme mode | ' + (theme.dark ? 'Dark' : 'Light') + ' |',
      '| UI font | ' + mdCell((theme.fonts || {}).ui || 'Inter') + ' |',
      '| Display font | ' + mdCell((theme.fonts || {}).display || 'Inter') + ' |',
      '| Base text | ' + (Number(type.size) || 15) + ' sp / weight ' + (Number(type.weight) || 400) + ' / letter spacing ' + (Number(type.spacing) || 0) + ' sp |',
      '| Corner radius | ' + (Number(theme.radius) || 18) + ' dp |',
      '| Density | ' + (theme.density || 'normal') + ' (content padding ' + (theme.density === 'compact' ? 12 : theme.density === 'comfy' ? 20 : 16) + ' dp) |',
      '| Icon style | weight ' + (icons.weight == null ? 400 : icons.weight) + ' / fill ' + (icons.fill == null ? 0 : icons.fill) + ' / stroke ' + (icons.stroke == null ? 1.8 : icons.stroke) + ' |',
      '| Device frame | ' + (Number(device.width) || 390) + ' × ' + (Number(device.height) || 844) + ' dp |',
      '| Status / gesture bar | ' + (device.statusBar === false ? 'hidden' : 'visible') + ' / ' + (device.gestureBar === false ? 'hidden' : 'visible') + ' |',
      '| Screens / blocks | ' + pages.length + ' / ' + blocks.length + ' |',
      '| Drawer | width ' + (Number(drawer.width) || 86) + '%, ' + (drawer.appearance || 'surface') + ', ' + (drawer.itemShape || 'pill') + ' items, ' + (drawer.density || 'cozy') + ' |',
      '| Search | ' + (search.mode === 'page' ? 'page' : 'overlay') + ', ' + (search.resultStyle || 'list') + ' results, ' + (search.reaction || 'slide') + ' |',
      '',
      '### Colors',
      '',
      '| Role | Light | Dark |',
      '| --- | --- | --- |',
      '| Primary | `' + pal.light.primary + '` | `' + pal.dark.primary + '` |',
      '| On primary | `' + pal.light.onPrimary + '` | `' + pal.dark.onPrimary + '` |',
      '| Primary container | `' + pal.light.primaryContainer + '` | `' + pal.dark.primaryContainer + '` |',
      '| Secondary container | `' + pal.light.secondaryContainer + '` | `' + pal.dark.secondaryContainer + '` |',
      '| Tertiary | `' + pal.light.tertiary + '` | `' + pal.dark.tertiary + '` |',
      '| Background | `' + pal.light.background + '` | `' + pal.dark.background + '` |',
      '| Surface | `' + pal.light.surface + '` | `' + pal.dark.surface + '` |',
      '| Outline | `' + pal.light.outline + '` | `' + pal.dark.outline + '` |',
      '',
      '### Fonts',
      '',
      '| Family | Role | Weights to bundle | Source |',
      '| --- | --- | --- | --- |'
    ];

    var fonts = collectFonts(d, pages);
    if (!fonts.length) fonts = ['Inter'];
    fonts.forEach(function (family) {
      var meta = (S.fonts || []).filter(function (f) { return f.name === family; })[0];
      var weights = meta && meta.w ? meta.w : [400, 500, 600, 700];
      var roles = [];
      if (family === (theme.fonts || {}).ui) roles.push('UI');
      if (family === (theme.fonts || {}).display) roles.push('display');
      if (!roles.length) roles.push('per-block override');
      lines.push('| ' + mdCell(family) + ' | ' + roles.join(', ') + ' | ' +
        weights.join(', ') + ' | [' + mdCell(family) + '](' + googleFontUrl(family) + ') |');
    });
    lines.push('', 'Put the **.ttf** files in `app/src/main/res/font/` using the names in `Type.kt` (for example `inter_regular.ttf`, `inter_medium.ttf`, `inter_semibold.ttf`, `inter_bold.ttf`). Google Fonts are OFL-licensed; keep the license file with the app. If you prefer downloadable fonts, use `androidx.compose.ui:ui-text-google-fonts` and the Google Fonts provider, but bundling is more predictable offline.', '');

    /* Icons */
    var iconsUsed = collectIcons(d, pages);
    lines.push('### Icons', '');
    if (!iconsUsed.length) {
      lines.push('No icons detected in the current screens.', '');
    } else {
      lines.push('| Icon | Pack | Compose suggestion |', '| --- | --- | --- |');
      iconsUsed.forEach(function (value) {
        var pack = 'Material Symbols Rounded';
        if (/^ph:/.test(value)) pack = 'Phosphor';
        else if (/^lucide:/.test(value)) pack = 'Lucide';
        else if (/^mso:/.test(value)) pack = 'Material Symbols Outlined';
        else if (/^mss:/.test(value)) pack = 'Material Symbols Sharp';
        var name = S.iconName ? S.iconName(value) : value;
        var compose = ICON_MAP[name] ? '`Icons.Rounded.' + ICON_MAP[name] + '`' : '`SymbolIcon("' + name + '")`';
        lines.push('| `' + mdCell(name) + '` | ' + pack + ' | ' + compose + ' |');
      });
      lines.push('', 'The mockup uses the **Material Symbols Rounded** variable font. Download `MaterialSymbolsRounded[FILL,GRAD,opsz,wght].ttf` from Google Fonts, rename it to `material_symbols_rounded.ttf`, and place it in `res/font/`. The `SymbolIcon` composable below uses the icon name as a ligature. For icons not in Material Symbols, export the Lucide/Phosphor SVG as a vector drawable in `res/drawable/`.', '');
    }

    /* Strings */
    var strings = collectStrings(d, pages);
    lines.push('### Strings', '', '```xml', '<resources>');
    strings.forEach(function (item) {
      lines.push('    <string name="' + item.name + '">' + xml(item.value) + '</string>');
    });
    lines.push('</resources>', '```', '');
    lines.push('The XML above is ready to paste into `app/src/main/res/values/strings.xml`. Names are generated from screen, block and property names; rename them to match your domain language before shipping.', '');

    return lines.join('\n');
  }

  function resourcesCodeSection(d, pages, blocks) {
    var theme = d.theme || {};
    var blockTypography = [];
    pages.forEach(function (page) {
      flatten(page.screen, []).forEach(function (block) {
        if (block.typography && Object.keys(block.typography).length) {
          blockTypography.push({ page: page.name, type: block.type, typography: block.typography });
        }
      });
    });

    var lines = [
      '## 6. Generated resource files',
      '',
      '### `ui/theme/Color.kt`',
      '',
      '```kotlin',
      colorKt(theme),
      '```',
      '',
      '### `ui/theme/Type.kt`',
      '',
      '```kotlin',
      typeKt(theme, collectFonts(d, pages), blockTypography),
      '```',
      '',
      '### `ui/theme/Theme.kt`',
      '',
      '```kotlin',
      themeKt(),
      '```',
      '',
      '### `ui/theme/Dimens.kt`',
      '',
      '```kotlin',
      dimensKt(d),
      '```',
      '',
      '### `ui/components/SymbolIcon.kt`',
      '',
      '```kotlin',
      symbolIconKt(),
      '```',
      '',
      '### `ui/navigation/AppNavHost.kt`',
      '',
      '```kotlin',
      navHostKt(pages),
      '```',
      '',
      '### `ui/screens/' + routeName(pages[0], 0) + '.kt` (starter for the first screen)',
      '',
      '```kotlin',
      screenKt(pages[0], 0, d),
      '```',
      ''
    ];
    return lines.join('\n');
  }

  var Android = S.Android = {
    build: function () {
      var d = S.State.data;
      if (!d) return '# Droid Lab handoff\n\nNo project data.';
      var pages = pagesOf(d);
      var blocks = [];
      pages.forEach(function (page) { flatten(page.screen, blocks); });

      var lines = [
        '# Droid Lab → Android handoff',
        '',
        'Generated from **Droid Lab** for the app screens in this project.',
        '',
        '| | |',
        '| --- | --- |',
        '| Screens | ' + pages.length + ' |',
        '| Blocks | ' + blocks.length + ' |',
        '| Target | Android (Kotlin + Compose) |',
        '| Theme | ' + ((d.theme || {}).dark ? 'Dark' : 'Light') + ' · `' + ((d.theme || {}).primary || '#6750A4') + '` |',
        '| Fonts | ' + mdCell(((d.theme || {}).fonts || {}).ui || 'Inter') + ' / ' + mdCell(((d.theme || {}).fonts || {}).display || 'Inter') + ' |',
        '',
        'This document is a starting point, not a finished app. Use the screen and component maps to build composables, then wire them to real data through ViewModels.',
        '',
        architectureSection(d, pages, blocks),
        screenMap(pages),
        componentSection(pages),
        interactionSection(d),
        resourcesSection(d, pages, blocks),
        resourcesCodeSection(d, pages, blocks),
        '## 7. Suggested build order',
        '',
        '1. Create the Compose project, add Material 3, Navigation Compose and Hilt.',
        '2. Drop in `ui/theme` (colors, type, dimens, shapes) and `SymbolIcon`.',
        '3. Build the navigation shell: `Scaffold` + `NavigationBar` + `AppNavHost` with the routes above.',
        '4. Recreate the shared components from the mapping table, starting with the top app bar, cards and list rows.',
        '5. Build one screen end-to-end, then copy the pattern to the remaining screens.',
        '6. Add Room/DataStore + repositories once the UI is stable; replace mock content with real state.',
        '7. Add instrumentation tests for navigation, drawer, search and the pinned bottom bar.',
        ''
      ];
      return lines.filter(function (line) { return line != null; }).join('\n');
    },

    filename: function () {
      return 'droidlab-android-handoff.md';
    },

    /* Exposed for tests and for a compact summary in the modal. */
    summary: function () {
      var d = S.State.data;
      var pages = pagesOf(d);
      var blocks = [];
      pages.forEach(function (page) { flatten(page.screen, blocks); });
      return {
        screens: pages.length,
        blocks: blocks.length,
        fonts: collectFonts(d, pages),
        icons: collectIcons(d, pages),
        strings: collectStrings(d, pages),
        components: unique(blocks.map(function (block) { return block.type; }))
      };
    }
  };
})();
