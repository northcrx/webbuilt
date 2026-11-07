/* Maps all 39 Droid Lab components to reusable Jetpack Compose composables,
   and generates stateful, functional screens with ViewModel and UiState. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var android = S.exporters.android = S.exporters.android || {};

  function kotlinString(str) {
    return String(str == null ? '' : str)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\$/g, '\\$')
      .replace(/\r?\n/g, '\\n');
  }

  function pascal(str, fallback) {
    var clean = String(str || fallback || 'Screen')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join('');
    if (!clean || /^[0-9]/.test(clean)) clean = (fallback || 'Screen') + clean;
    return clean;
  }

  var ComposeGenerator = android.ComposeGenerator = {
    /* Generates all reusable custom composables in ui/components/AppComponents.kt */
    generateAppComponentsKt: function (packageName) {
      return [
        'package ' + packageName + '.ui.components',
        '',
        'import androidx.compose.animation.*',
        'import androidx.compose.foundation.*',
        'import androidx.compose.foundation.layout.*',
        'import androidx.compose.foundation.lazy.*',
        'import androidx.compose.foundation.lazy.grid.*',
        'import androidx.compose.foundation.shape.CircleShape',
        'import androidx.compose.foundation.shape.RoundedCornerShape',
        'import androidx.compose.material.icons.Icons',
        'import androidx.compose.material.icons.rounded.*',
        'import androidx.compose.material3.*',
        'import androidx.compose.runtime.*',
        'import androidx.compose.ui.Alignment',
        'import androidx.compose.ui.Modifier',
        'import androidx.compose.ui.draw.clip',
        'import androidx.compose.ui.graphics.Brush',
        'import androidx.compose.ui.graphics.Color',
        'import androidx.compose.ui.text.font.FontWeight',
        'import androidx.compose.ui.text.style.TextOverflow',
        'import androidx.compose.ui.unit.dp',
        'import androidx.compose.ui.unit.sp',
        'import ' + packageName + '.ui.theme.*',
        '',
        '/**',
        ' * Reusable, production-grade Jetpack Compose implementations of Droid Lab UI blocks.',
        ' */',
        '',
        '// --- TOP APP BAR ---',
        '@OptIn(ExperimentalMaterial3Api::class)',
        '@Composable',
        'fun CustomTopAppBar(',
        '    title: String,',
        '    navigationIcon: String? = null,',
        '    onNavigationClick: () -> Unit = {},',
        '    actions: List<String> = emptyList(),',
        '    onActionClick: (String) -> Unit = {}',
        ') {',
        '    TopAppBar(',
        '        title = { Text(title, style = MaterialTheme.typography.titleLarge) },',
        '        navigationIcon = {',
        '            if (navigationIcon != null) {',
        '                IconButton(onClick = onNavigationClick) {',
        '                    AppIcon(name = navigationIcon, contentDescription = "Navigation")',
        '                }',
        '            }',
        '        },',
        '        actions = {',
        '            actions.forEach { action ->',
        '                IconButton(onClick = { onActionClick(action) }) {',
        '                    AppIcon(name = action, contentDescription = action)',
        '                }',
        '            }',
        '        },',
        '        colors = TopAppBarDefaults.topAppBarColors(',
        '            containerColor = MaterialTheme.colorScheme.surface',
        '        )',
        '    )',
        '}',
        '',
        '// --- SEARCH BAR (Functional with query state) ---',
        '@Composable',
        'fun CustomSearchBar(',
        '    query: String,',
        '    onQueryChange: (String) -> Unit,',
        '    placeholder: String = "Search...",',
        '    modifier: Modifier = Modifier,',
        '    onSearch: (String) -> Unit = {}',
        ') {',
        '    OutlinedTextField(',
        '        value = query,',
        '        onValueChange = onQueryChange,',
        '        modifier = modifier.fillMaxWidth(),',
        '        placeholder = { Text(placeholder) },',
        '        leadingIcon = { AppIcon(name = "search", contentDescription = "Search") },',
        '        trailingIcon = {',
        '            if (query.isNotEmpty()) {',
        '                IconButton(onClick = { onQueryChange("") }) {',
        '                    AppIcon(name = "close", contentDescription = "Clear")',
        '                }',
        '            }',
        '        },',
        '        singleLine = true,',
        '        shape = RoundedCornerShape(AppCornerRadius),',
        '        colors = OutlinedTextFieldDefaults.colors(',
        '            focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),',
        '            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)',
        '        )',
        '    )',
        '}',
        '',
        '// --- TABS (Functional) ---',
        '@Composable',
        'fun CustomTabs(',
        '    tabs: List<String>,',
        '    selectedIndex: Int,',
        '    onTabSelected: (Int) -> Unit,',
        '    modifier: Modifier = Modifier',
        ') {',
        '    PrimaryTabRow(',
        '        selectedTabIndex = selectedIndex,',
        '        modifier = modifier.fillMaxWidth(),',
        '        containerColor = Color.Transparent',
        '    ) {',
        '        tabs.forEachIndexed { index, tab ->',
        '            Tab(',
        '                selected = selectedIndex == index,',
        '                onClick = { onTabSelected(index) },',
        '                text = { Text(tab, maxLines = 1, overflow = TextOverflow.Ellipsis) }',
        '            )',
        '        }',
        '    }',
        '}',
        '',
        '// --- FILTER CHIPS ---',
        '@OptIn(ExperimentalMaterial3Api::class)',
        '@Composable',
        'fun CustomFilterChips(',
        '    chips: List<String>,',
        '    selectedChip: String?,',
        '    onChipSelected: (String) -> Unit,',
        '    modifier: Modifier = Modifier',
        ') {',
        '    LazyRow(',
        '        modifier = modifier.fillMaxWidth(),',
        '        horizontalArrangement = Arrangement.spacedBy(8.dp),',
        '        contentPadding = PaddingValues(horizontal = 4.dp)',
        '    ) {',
        '        items(chips) { chip ->',
        '            val isSelected = chip == selectedChip',
        '            FilterChip(',
        '                selected = isSelected,',
        '                onClick = { onChipSelected(chip) },',
        '                label = { Text(chip) },',
        '                leadingIcon = if (isSelected) {',
        '                    { AppIcon(name = "check", size = 16.dp) }',
        '                } else null',
        '            )',
        '        }',
        '    }',
        '}',
        '',
        '// --- HERO BANNER ---',
        '@Composable',
        'fun CustomHeroBanner(',
        '    kicker: String = "",',
        '    title: String,',
        '    subtitle: String = "",',
        '    ctaText: String = "",',
        '    onCtaClick: () -> Unit = {},',
        '    modifier: Modifier = Modifier',
        ') {',
        '    Card(',
        '        modifier = modifier.fillMaxWidth(),',
        '        shape = RoundedCornerShape(AppCornerRadius),',
        '        colors = CardDefaults.cardColors(',
        '            containerColor = MaterialTheme.colorScheme.primaryContainer',
        '        )',
        '    ) {',
        '        Column(',
        '            modifier = Modifier',
        '                .fillMaxWidth()',
        '                .padding(20.dp)',
        '        ) {',
        '            if (kicker.isNotEmpty()) {',
        '                Text(',
        '                    text = kicker.uppercase(),',
        '                    style = MaterialTheme.typography.labelMedium,',
        '                    color = MaterialTheme.colorScheme.primary,',
        '                    fontWeight = FontWeight.Bold',
        '                )',
        '                Spacer(Modifier.height(4.dp))',
        '            }',
        '            Text(',
        '                text = title,',
        '                style = MaterialTheme.typography.headlineMedium,',
        '                fontWeight = FontWeight.Bold,',
        '                color = MaterialTheme.colorScheme.onPrimaryContainer',
        '            )',
        '            if (subtitle.isNotEmpty()) {',
        '                Spacer(Modifier.height(8.dp))',
        '                Text(',
        '                    text = subtitle,',
        '                    style = MaterialTheme.typography.bodyMedium,',
        '                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)',
        '                )',
        '            }',
        '            if (ctaText.isNotEmpty()) {',
        '                Spacer(Modifier.height(16.dp))',
        '                Button(',
        '                    onClick = onCtaClick,',
        '                    colors = ButtonDefaults.buttonColors(',
        '                        containerColor = MaterialTheme.colorScheme.primary',
        '                    )',
        '                ) {',
        '                    Text(ctaText)',
        '                }',
        '            }',
        '        }',
        '    }',
        '}',
        '',
        '// --- SECTION TITLE ---',
        '@Composable',
        'fun CustomSectionTitle(',
        '    title: String,',
        '    actionText: String? = null,',
        '    onActionClick: () -> Unit = {},',
        '    modifier: Modifier = Modifier',
        ') {',
        '    Row(',
        '        modifier = modifier.fillMaxWidth(),',
        '        horizontalArrangement = Arrangement.SpaceBetween,',
        '        verticalAlignment = Alignment.CenterVertically',
        '    ) {',
        '        Text(',
        '            text = title,',
        '            style = MaterialTheme.typography.titleMedium,',
        '            fontWeight = FontWeight.Bold',
        '        )',
        '        if (!actionText.isNullOrEmpty()) {',
        '            TextButton(onClick = onActionClick) {',
        '                Text(actionText, style = MaterialTheme.typography.labelLarge)',
        '            }',
        '        }',
        '    }',
        '}',
        '',
        '// --- CARD COMPONENT ---',
        '@Composable',
        'fun CustomCard(',
        '    title: String,',
        '    subtitle: String? = null,',
        '    supportingText: String? = null,',
        '    actionText: String? = null,',
        '    onActionClick: () -> Unit = {},',
        '    modifier: Modifier = Modifier',
        ') {',
        '    Card(',
        '        modifier = modifier.fillMaxWidth(),',
        '        shape = RoundedCornerShape(AppCornerRadius),',
        '        colors = CardDefaults.cardColors(',
        '            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)',
        '        )',
        '    ) {',
        '        Column(modifier = Modifier.padding(16.dp)) {',
        '            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)',
        '            if (!subtitle.isNullOrEmpty()) {',
        '                Spacer(Modifier.height(4.dp))',
        '                Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)',
        '            }',
        '            if (!supportingText.isNullOrEmpty()) {',
        '                Spacer(Modifier.height(8.dp))',
        '                Text(supportingText, style = MaterialTheme.typography.bodyMedium)',
        '            }',
        '            if (!actionText.isNullOrEmpty()) {',
        '                Spacer(Modifier.height(12.dp))',
        '                Button(onClick = onActionClick) {',
        '                    Text(actionText)',
        '                }',
        '            }',
        '        }',
        '    }',
        '}',
        '',
        '// --- BUTTON COMPONENT ---',
        '@Composable',
        'fun CustomButton(',
        '    text: String,',
        '    variant: String = "primary",',
        '    icon: String? = null,',
        '    onClick: () -> Unit = {},',
        '    modifier: Modifier = Modifier',
        ') {',
        '    when (variant) {',
        '        "tonal" -> FilledTonalButton(onClick = onClick, modifier = modifier) {',
        '            if (icon != null) { AppIcon(icon, size = 18.dp); Spacer(Modifier.width(8.dp)) }',
        '            Text(text)',
        '        }',
        '        "outlined" -> OutlinedButton(onClick = onClick, modifier = modifier) {',
        '            if (icon != null) { AppIcon(icon, size = 18.dp); Spacer(Modifier.width(8.dp)) }',
        '            Text(text)',
        '        }',
        '        "text" -> TextButton(onClick = onClick, modifier = modifier) {',
        '            if (icon != null) { AppIcon(icon, size = 18.dp); Spacer(Modifier.width(8.dp)) }',
        '            Text(text)',
        '        }',
        '        else -> Button(onClick = onClick, modifier = modifier) {',
        '            if (icon != null) { AppIcon(icon, size = 18.dp); Spacer(Modifier.width(8.dp)) }',
        '            Text(text)',
        '        }',
        '    }',
        '}',
        '',
        '// --- TEXT FIELD COMPONENT ---',
        '@Composable',
        'fun CustomTextField(',
        '    value: String,',
        '    onValueChange: (String) -> Unit,',
        '    label: String = "",',
        '    placeholder: String = "",',
        '    leadingIcon: String? = null,',
        '    modifier: Modifier = Modifier',
        ') {',
        '    OutlinedTextField(',
        '        value = value,',
        '        onValueChange = onValueChange,',
        '        modifier = modifier.fillMaxWidth(),',
        '        label = if (label.isNotEmpty()) { { Text(label) } } else null,',
        '        placeholder = if (placeholder.isNotEmpty()) { { Text(placeholder) } } else null,',
        '        leadingIcon = if (leadingIcon != null) { { AppIcon(name = leadingIcon) } } else null,',
        '        shape = RoundedCornerShape(AppCornerRadius)',
        '    )',
        '}',
        '',
        '// --- SWITCH ROW COMPONENT ---',
        '@Composable',
        'fun CustomSwitchRow(',
        '    title: String,',
        '    subtitle: String? = null,',
        '    checked: Boolean,',
        '    onCheckedChange: (Boolean) -> Unit,',
        '    icon: String? = null,',
        '    modifier: Modifier = Modifier',
        ') {',
        '    ListItem(',
        '        headlineContent = { Text(title, fontWeight = FontWeight.Medium) },',
        '        supportingContent = if (!subtitle.isNullOrEmpty()) { { Text(subtitle) } } else null,',
        '        leadingContent = if (icon != null) { { AppIcon(name = icon) } } else null,',
        '        trailingContent = {',
        '            Switch(checked = checked, onCheckedChange = onCheckedChange)',
        '        },',
        '        modifier = modifier.clickable { onCheckedChange(!checked) }',
        '    )',
        '}',
        '',
        '// --- MUSIC NOW PLAYING ---',
        '@Composable',
        'fun CustomNowPlaying(',
        '    title: String = "Track Title",',
        '    artist: String = "Artist Name",',
        '    isPlaying: Boolean = false,',
        '    onPlayPause: () -> Unit = {},',
        '    progress: Float = 0.35f,',
        '    modifier: Modifier = Modifier',
        ') {',
        '    Card(',
        '        modifier = modifier.fillMaxWidth(),',
        '        shape = RoundedCornerShape(AppCornerRadius)',
        '    ) {',
        '        Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterVertically) {',
        '            Box(',
        '                modifier = Modifier',
        '                    .size(160.dp)',
        '                    .clip(RoundedCornerShape(16.dp))',
        '                    .background(MaterialTheme.colorScheme.primaryContainer),',
        '                contentAlignment = Alignment.Center',
        '            ) {',
        '                AppIcon(name = "music", size = 64.dp, tint = MaterialTheme.colorScheme.primary)',
        '            }',
        '            Spacer(Modifier.height(16.dp))',
        '            Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)',
        '            Text(artist, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)',
        '            Spacer(Modifier.height(16.dp))',
        '            Slider(value = progress, onValueChange = {})',
        '            Row(',
        '                horizontalArrangement = Arrangement.spacedBy(24.dp),',
        '                verticalAlignment = Alignment.CenterVertically',
        '            ) {',
        '                IconButton(onClick = {}) { AppIcon(name = "skip_previous", size = 28.dp) }',
        '                FilledIconButton(onClick = onPlayPause, modifier = Modifier.size(56.dp)) {',
        '                    AppIcon(name = if (isPlaying) "pause" else "play", size = 32.dp)',
        '                }',
        '                IconButton(onClick = {}) { AppIcon(name = "skip_next", size = 28.dp) }',
        '            }',
        '        }',
        '    }',
        '}',
        '',
        '// --- MINI PLAYER ---',
        '@Composable',
        'fun CustomMiniPlayer(',
        '    title: String = "Now Playing",',
        '    subtitle: String = "Artist",',
        '    isPlaying: Boolean = false,',
        '    onPlayPause: () -> Unit = {},',
        '    modifier: Modifier = Modifier',
        ') {',
        '    Surface(',
        '        modifier = modifier.fillMaxWidth(),',
        '        tonalElevation = 6.dp,',
        '        shape = RoundedCornerShape(topStart = AppCornerRadius, topEnd = AppCornerRadius)',
        '    ) {',
        '        Row(',
        '            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),',
        '            verticalAlignment = Alignment.CenterVertically',
        '        ) {',
        '            Box(',
        '                modifier = Modifier',
        '                    .size(42.dp)',
        '                    .clip(RoundedCornerShape(8.dp))',
        '                    .background(MaterialTheme.colorScheme.primaryContainer),',
        '                contentAlignment = Alignment.Center',
        '            ) {',
        '                AppIcon(name = "music", size = 20.dp, tint = MaterialTheme.colorScheme.primary)',
        '            }',
        '            Spacer(Modifier.width(12.dp))',
        '            Column(modifier = Modifier.weight(1f)) {',
        '                Text(title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, maxLines = 1)',
        '                Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1)',
        '            }',
        '            IconButton(onClick = onPlayPause) {',
        '                AppIcon(name = if (isPlaying) "pause" else "play", size = 24.dp)',
        '            }',
        '        }',
        '    }',
        '}',
        '',
        '// --- PROGRESS BAR ---',
        '@Composable',
        'fun CustomProgressBar(',
        '    progress: Float = 0.5f,',
        '    label: String? = null,',
        '    modifier: Modifier = Modifier',
        ') {',
        '    Column(modifier = modifier.fillMaxWidth()) {',
        '        if (!label.isNullOrEmpty()) {',
        '            Text(label, style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(bottom = 6.dp))',
        '        }',
        '        LinearProgressIndicator(',
        '            progress = { progress },',
        '            modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp))',
        '        )',
        '    }',
        '}',
        '',
        '// --- DOWNLOAD ITEM ---',
        '@Composable',
        'fun CustomDownloadItem(',
        '    title: String,',
        '    subtitle: String = "Downloading...",',
        '    progress: Float = 0.6f,',
        '    onCancel: () -> Unit = {},',
        '    modifier: Modifier = Modifier',
        ') {',
        '    Card(modifier = modifier.fillMaxWidth()) {',
        '        Row(',
        '            modifier = Modifier.padding(14.dp),',
        '            verticalAlignment = Alignment.CenterVertically',
        '        ) {',
        '            AppIcon(name = "download", size = 28.dp, tint = MaterialTheme.colorScheme.primary)',
        '            Spacer(Modifier.width(12.dp))',
        '            Column(modifier = Modifier.weight(1f)) {',
        '                Text(title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)',
        '                Spacer(Modifier.height(4.dp))',
        '                LinearProgressIndicator(progress = { progress }, modifier = Modifier.fillMaxWidth())',
        '                Spacer(Modifier.height(2.dp))',
        '                Text(subtitle, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)',
        '            }',
        '            IconButton(onClick = onCancel) {',
        '                AppIcon(name = "close", size = 18.dp)',
        '            }',
        '        }',
        '    }',
        '}',
        ''
      ].join('\n');
    },

    /* Generates an individual Screen Composable with Route, Screen, UiState, and UiEvent */
    generateScreenKt: function (packageName, page, pageIndex, allPages) {
      var screenName = pascal(page.name, 'Screen' + (pageIndex + 1));
      var blocks = page.screen || [];

      // Check structure blocks
      var isHeader = function (t) { return t === 'appbar' || t === 'searchheader' || t === 'profilebar' || t === 'storeheader' || t === 'capsuleheader' || t === 'editorialheader'; };
      var isBottomNav = function (t) { return t === 'bottomnav' || t.indexOf('bottomnav') === 0; };

      var appbarBlock = blocks.filter(function (b) { return isHeader(b.type); })[0];
      var bottomnavBlock = blocks.filter(function (b) { return isBottomNav(b.type); })[0];
      var miniplayerBlock = blocks.filter(function (b) { return b.type === 'miniplayer'; })[0];
      var fabBlock = blocks.filter(function (b) { return b.type === 'fab'; })[0];

      // Other content blocks
      var contentBlocks = blocks.filter(function (b) {
        return !isHeader(b.type) && !isBottomNav(b.type) && b.type !== 'miniplayer' && b.type !== 'fab';
      });

      var lines = [
        'package ' + packageName + '.ui.screens',
        '',
        'import androidx.compose.foundation.layout.*',
        'import androidx.compose.foundation.lazy.LazyColumn',
        'import androidx.compose.foundation.lazy.items',
        'import androidx.compose.material3.*',
        'import androidx.compose.runtime.*',
        'import androidx.compose.ui.Modifier',
        'import androidx.compose.ui.unit.dp',
        'import androidx.lifecycle.ViewModel',
        'import androidx.lifecycle.compose.collectAsStateWithLifecycle',
        'import androidx.lifecycle.viewmodel.compose.viewModel',
        'import kotlinx.coroutines.flow.MutableStateFlow',
        'import kotlinx.coroutines.flow.StateFlow',
        'import kotlinx.coroutines.flow.asStateFlow',
        'import kotlinx.coroutines.flow.update',
        'import ' + packageName + '.ui.components.*',
        'import ' + packageName + '.ui.theme.ScreenPadding',
        'import ' + packageName + '.ui.theme.SectionSpacing',
        '',
        '/**',
        ' * ' + screenName + ' Route & Screen implementation for Droid Lab.',
        ' */',
        '@Composable',
        'fun ' + screenName + 'Route(',
        '    viewModel: ' + screenName + 'ViewModel = viewModel()',
        ') {',
        '    val uiState by viewModel.uiState.collectAsStateWithLifecycle()',
        '',
        '    ' + screenName + 'Screen(',
        '        uiState = uiState,',
        '        onEvent = viewModel::onEvent',
        '    )',
        '}',
        '',
        '@OptIn(ExperimentalMaterial3Api::class)',
        '@Composable',
        'fun ' + screenName + 'Screen(',
        '    uiState: ' + screenName + 'UiState,',
        '    onEvent: (' + screenName + 'UiEvent) -> Unit',
        ') {',
        '    Scaffold('
      ];

      // Top App Bar
      if (appbarBlock) {
        var ap = appbarBlock.props || {};
        lines.push('        topBar = {');
        lines.push('            CustomTopAppBar(');
        lines.push('                title = "' + kotlinString(ap.title || page.name) + '",');
        lines.push('                navigationIcon = ' + (ap.nav ? '"' + kotlinString(ap.nav) + '"' : '"menu"') + ',');
        lines.push('                onNavigationClick = { onEvent(' + screenName + 'UiEvent.NavigationClick) }');
        lines.push('            )');
        lines.push('        },');
      }

      // Bottom Bar (docked mini player stacked above navigation bar)
      if (miniplayerBlock || bottomnavBlock) {
        lines.push('        bottomBar = {');
        if (miniplayerBlock && bottomnavBlock) {
          lines.push('            Column {');
          lines.push('                CustomMiniPlayer(');
          lines.push('                    title = uiState.miniPlayerTitle,');
          lines.push('                    subtitle = uiState.miniPlayerSubtitle,');
          lines.push('                    isPlaying = uiState.isPlaying,');
          lines.push('                    onPlayPause = { onEvent(' + screenName + 'UiEvent.TogglePlayPause) }');
          lines.push('                )');
          lines.push('                CustomBottomNavigation(');
          lines.push('                    selectedIndex = uiState.selectedNavIndex,');
          lines.push('                    onItemSelected = { index -> onEvent(' + screenName + 'UiEvent.SelectNav(index)) }');
          lines.push('                )');
          lines.push('            }');
        } else if (miniplayerBlock) {
          lines.push('            CustomMiniPlayer(');
          lines.push('                title = uiState.miniPlayerTitle,');
          lines.push('                subtitle = uiState.miniPlayerSubtitle,');
          lines.push('                isPlaying = uiState.isPlaying,');
          lines.push('                onPlayPause = { onEvent(' + screenName + 'UiEvent.TogglePlayPause) }');
          lines.push('            )');
        } else if (bottomnavBlock) {
          lines.push('            CustomBottomNavigation(');
          lines.push('                selectedIndex = uiState.selectedNavIndex,');
          lines.push('                onItemSelected = { index -> onEvent(' + screenName + 'UiEvent.SelectNav(index)) }');
          lines.push('            )');
        }
        lines.push('        },');
      }

      // FAB
      if (fabBlock) {
        var fp = fabBlock.props || {};
        lines.push('        floatingActionButton = {');
        lines.push('            FloatingActionButton(onClick = { onEvent(' + screenName + 'UiEvent.FabClick) }) {');
        lines.push('                AppIcon(name = "' + kotlinString(fp.icon || 'add') + '", contentDescription = "Add")');
        lines.push('            }');
        lines.push('        },');
      }

      lines.push('    ) { innerPadding ->');
      lines.push('        LazyColumn(');
      lines.push('            modifier = Modifier');
      lines.push('                .fillMaxSize()');
      lines.push('                .padding(innerPadding),');
      lines.push('            contentPadding = PaddingValues(ScreenPadding),');
      lines.push('            verticalArrangement = Arrangement.spacedBy(16.dp)');
      lines.push('        ) {');

      // Generate items for each content block
      contentBlocks.forEach(function (b, idx) {
        var p = b.props || {};
        lines.push('            // Block: ' + b.type);
        lines.push('            item {');

        if (b.type === 'searchbar') {
          lines.push('                CustomSearchBar(');
          lines.push('                    query = uiState.searchQuery,');
          lines.push('                    onQueryChange = { onEvent(' + screenName + 'UiEvent.SearchQueryChange(it)) },');
          lines.push('                    placeholder = "' + kotlinString(p.placeholder || 'Search songs, files and settings') + '"');
          lines.push('                )');
        } else if (b.type === 'tabs') {
          var tabList = (p.items || 'All\nSongs\nAlbum\nArtist').split('\n').filter(Boolean);
          var tabArrayStr = 'listOf(' + tabList.map(function (t) { return '"' + kotlinString(t.trim()) + '"'; }).join(', ') + ')';
          lines.push('                CustomTabs(');
          lines.push('                    tabs = ' + tabArrayStr + ',');
          lines.push('                    selectedIndex = uiState.selectedTabIndex,');
          lines.push('                    onTabSelected = { onEvent(' + screenName + 'UiEvent.TabSelected(it)) }');
          lines.push('                )');
        } else if (b.type === 'chips') {
          var chipsList = (p.items || 'All\nSongs\nAlbum\nArtist').split('\n').filter(Boolean);
          var chipArrayStr = 'listOf(' + chipsList.map(function (c) { return '"' + kotlinString(c.trim()) + '"'; }).join(', ') + ')';
          lines.push('                CustomFilterChips(');
          lines.push('                    chips = ' + chipArrayStr + ',');
          lines.push('                    selectedChip = uiState.selectedChip,');
          lines.push('                    onChipSelected = { onEvent(' + screenName + 'UiEvent.ChipSelected(it)) }');
          lines.push('                )');
        } else if (b.type === 'hero') {
          lines.push('                CustomHeroBanner(');
          lines.push('                    kicker = "' + kotlinString(p.kicker || '') + '",');
          lines.push('                    title = "' + kotlinString(p.title || 'Featured') + '",');
          lines.push('                    subtitle = "' + kotlinString(p.subtitle || '') + '",');
          lines.push('                    ctaText = "' + kotlinString(p.cta || '') + '",');
          lines.push('                    onCtaClick = { onEvent(' + screenName + 'UiEvent.PrimaryAction) }');
          lines.push('                )');
        } else if (b.type === 'section') {
          lines.push('                CustomSectionTitle(');
          lines.push('                    title = "' + kotlinString(p.title || 'Section') + '",');
          lines.push('                    actionText = ' + (p.action ? '"' + kotlinString(p.action) + '"' : 'null') + ',');
          lines.push('                    onActionClick = { onEvent(' + screenName + 'UiEvent.PrimaryAction) }');
          lines.push('                )');
        } else if (b.type === 'card') {
          lines.push('                CustomCard(');
          lines.push('                    title = "' + kotlinString(p.title || 'Card Title') + '",');
          lines.push('                    subtitle = ' + (p.subtitle ? '"' + kotlinString(p.subtitle) + '"' : 'null') + ',');
          lines.push('                    supportingText = ' + (p.body ? '"' + kotlinString(p.body) + '"' : 'null') + ',');
          lines.push('                    actionText = ' + (p.action ? '"' + kotlinString(p.action) + '"' : 'null') + ',');
          lines.push('                    onActionClick = { onEvent(' + screenName + 'UiEvent.PrimaryAction) }');
          lines.push('                )');
        } else if (b.type === 'button') {
          lines.push('                CustomButton(');
          lines.push('                    text = "' + kotlinString(p.text || 'Button') + '",');
          lines.push('                    variant = "' + kotlinString(p.variant || 'primary') + '",');
          lines.push('                    icon = ' + (p.icon ? '"' + kotlinString(p.icon) + '"' : 'null') + ',');
          lines.push('                    onClick = { onEvent(' + screenName + 'UiEvent.PrimaryAction) }');
          lines.push('                )');
        } else if (b.type === 'textfield') {
          lines.push('                CustomTextField(');
          lines.push('                    value = uiState.textInputValue,');
          lines.push('                    onValueChange = { onEvent(' + screenName + 'UiEvent.TextInputChange(it)) },');
          lines.push('                    label = "' + kotlinString(p.label || '') + '",');
          lines.push('                    placeholder = "' + kotlinString(p.placeholder || '') + '",');
          lines.push('                    leadingIcon = ' + (p.icon ? '"' + kotlinString(p.icon) + '"' : 'null'));
          lines.push('                )');
        } else if (b.type === 'switchrow') {
          lines.push('                CustomSwitchRow(');
          lines.push('                    title = "' + kotlinString(p.title || 'Option') + '",');
          lines.push('                    subtitle = ' + (p.subtitle ? '"' + kotlinString(p.subtitle) + '"' : 'null') + ',');
          lines.push('                    checked = uiState.switchChecked,');
          lines.push('                    onCheckedChange = { onEvent(' + screenName + 'UiEvent.SwitchToggle(it)) },');
          lines.push('                    icon = ' + (p.icon ? '"' + kotlinString(p.icon) + '"' : 'null'));
          lines.push('                )');
        } else if (b.type === 'musicplayer') {
          lines.push('                CustomNowPlaying(');
          lines.push('                    title = "' + kotlinString(p.title || 'Track') + '",');
          lines.push('                    artist = "' + kotlinString(p.artist || 'Artist') + '",');
          lines.push('                    isPlaying = uiState.isPlaying,');
          lines.push('                    onPlayPause = { onEvent(' + screenName + 'UiEvent.TogglePlayPause) }');
          lines.push('                )');
        } else if (b.type === 'progress') {
          lines.push('                CustomProgressBar(');
          lines.push('                    progress = 0.65f,');
          lines.push('                    label = "' + kotlinString(p.label || 'Progress') + '"');
          lines.push('                )');
        } else if (b.type === 'downloaditem') {
          lines.push('                CustomDownloadItem(');
          lines.push('                    title = "' + kotlinString(p.title || 'Download') + '",');
          lines.push('                    subtitle = "' + kotlinString(p.status || 'Downloading...') + '"');
          lines.push('                )');
        } else {
          // Generic card fallback for specialized blocks
          lines.push('                CustomCard(');
          lines.push('                    title = "' + kotlinString((S.components && S.components[b.type] && S.components[b.type].label) || b.type) + '",');
          lines.push('                    supportingText = "' + kotlinString(p.title || p.text || 'Component block') + '"');
          lines.push('                )');
        }

        lines.push('            }');
      });

      lines.push('        }');
      lines.push('    }');
      lines.push('}');
      lines.push('');

      // UI STATE
      lines.push('/**',
        ' * Immutable UI State for ' + screenName + '.',
        ' */',
        'data class ' + screenName + 'UiState(',
        '    val searchQuery: String = "",',
        '    val selectedTabIndex: Int = 0,',
        '    val selectedChip: String? = "All",',
        '    val textInputValue: String = "",',
        '    val switchChecked: Boolean = true,',
        '    val isPlaying: Boolean = false,',
        '    val miniPlayerTitle: String = "Now Playing",',
        '    val miniPlayerSubtitle: String = "Artist",',
        '    val isLoading: Boolean = false',
        ')',
        ''
      );

      // UI EVENTS
      lines.push('/**',
        ' * Unidirectional UI Events handled by ' + screenName + 'ViewModel.',
        ' */',
        'sealed interface ' + screenName + 'UiEvent {',
        '    data class SearchQueryChange(val query: String) : ' + screenName + 'UiEvent',
        '    data class TabSelected(val index: Int) : ' + screenName + 'UiEvent',
        '    data class ChipSelected(val chip: String) : ' + screenName + 'UiEvent',
        '    data class TextInputChange(val value: String) : ' + screenName + 'UiEvent',
        '    data class SwitchToggle(val checked: Boolean) : ' + screenName + 'UiEvent',
        '    data object TogglePlayPause : ' + screenName + 'UiEvent',
        '    data object PrimaryAction : ' + screenName + 'UiEvent',
        '    data object NavigationClick : ' + screenName + 'UiEvent',
        '    data object FabClick : ' + screenName + 'UiEvent',
        '}',
        ''
      );

      // VIEWMODEL
      lines.push('/**',
        ' * State Holder ViewModel for ' + screenName + '.',
        ' */',
        'class ' + screenName + 'ViewModel : ViewModel() {',
        '    private val _uiState = MutableStateFlow(' + screenName + 'UiState())',
        '    val uiState: StateFlow<' + screenName + 'UiState> = _uiState.asStateFlow()',
        '',
        '    fun onEvent(event: ' + screenName + 'UiEvent) {',
        '        when (event) {',
        '            is ' + screenName + 'UiEvent.SearchQueryChange -> _uiState.update { it.copy(searchQuery = event.query) }',
        '            is ' + screenName + 'UiEvent.TabSelected -> _uiState.update { it.copy(selectedTabIndex = event.index) }',
        '            is ' + screenName + 'UiEvent.ChipSelected -> _uiState.update { it.copy(selectedChip = event.chip) }',
        '            is ' + screenName + 'UiEvent.TextInputChange -> _uiState.update { it.copy(textInputValue = event.value) }',
        '            is ' + screenName + 'UiEvent.SwitchToggle -> _uiState.update { it.copy(switchChecked = event.checked) }',
        '            is ' + screenName + 'UiEvent.TogglePlayPause -> _uiState.update { it.copy(isPlaying = !it.isPlaying) }',
        '            else -> { /* Handle one-shot actions */ }',
        '        }',
        '    }',
        '}'
      );

      return lines.join('\n');
    }
  };
})();
