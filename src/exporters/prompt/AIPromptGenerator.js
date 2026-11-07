/* Generates AI-Ready Implementation Prompts based on actual editor state.
   Instructs AI coding agents to reproduce the design accurately in Android Studio. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var prompt = S.exporters.prompt = S.exporters.prompt || {};

  var AIPromptGenerator = prompt.AIPromptGenerator = {
    generatePrompt: function (data) {
      data = data || (S.State && S.State.data) || {};
      if (S.State && S.State.syncActivePage) S.State.syncActivePage();

      var pages = (data.pages && data.pages.length) ? data.pages : [{
        name: 'Screen',
        icon: 'home',
        screen: data.screen || []
      }];

      var theme = data.theme || {};
      var device = data.device || {};
      var fonts = theme.fonts || {};
      var type = theme.type || {};
      var uiFont = fonts.ui || 'Inter';
      var displayFont = fonts.display || uiFont;
      var primaryColor = theme.primary || '#6750A4';
      var isDark = !!theme.dark;
      var radius = Number(theme.radius) || 18;
      var density = theme.density === 'compact' ? 12 : theme.density === 'comfy' ? 20 : 16;
      var screenWidth = Number(device.width) || 390;
      var screenHeight = Number(device.height) || 844;

      // Extract all icons
      var icons = [];
      if (S.exporters && S.exporters.android && S.exporters.android.IconGenerator) {
        icons = S.exporters.android.IconGenerator.collectAllIcons(data);
      }

      var lines = [
        '# Android Implementation Specification & Design Prompt',
        '',
        '> **System Goal**: Implement this exact Android application interface using native **Kotlin + Jetpack Compose + Material 3** in Android Studio.',
        '',
        '---',
        '',
        '## 1. Application Overview & Technology Stack',
        '- **App Target**: Android (Mobile phone form factor)',
        '- **Language**: Kotlin (JDK 17)',
        '- **UI Framework**: Jetpack Compose (BOM 2024.08.00) with Material 3',
        '- **Navigation**: Jetpack Navigation Compose',
        '- **Architecture**: MVVM with Unidirectional Data Flow (`UiState`, `UiEvent`, `StateFlow`)',
        '- **Design Reference Size**: ' + screenWidth + 'dp × ' + screenHeight + 'dp',
        '- **Theme Mode**: ' + (isDark ? 'Dark Theme (default)' : 'Light Theme (default)') + '',
        '',
        '## 2. Design Tokens & Styling (Exact Values)',
        'Do not substitute these values with default Material 3 purple colors. Use these exact design tokens:',
        '',
        '| Token | Android Value | Description |',
        '| --- | --- | --- |',
        '| **Primary Accent** | `' + primaryColor + '` | Main brand and action color |',
        '| **Theme Background** | `' + (isDark ? '#141218' : '#FFFBFE') + '` | Window and screen surface |',
        '| **Corner Radius** | `' + radius + '.dp` | Cards, buttons, dialogs, sheets |',
        '| **Screen Padding** | `' + density + '.dp` | Standard screen horizontal gutter |',
        '| **Section Spacing** | `' + Math.round(density * 1.25) + '.dp` | Vertical spacing between sections |',
        '| **UI Font Family** | `' + uiFont + '` | Body, labels, and form fields |',
        '| **Display Font Family** | `' + displayFont + '` | Headers and hero titles |',
        '| **Base Font Size** | `' + (Number(type.size) || 15) + '.sp` | Standard body font size |',
        '| **Base Font Weight** | `' + (Number(type.weight) || 400) + '` | Standard text weight |',
        '| **Letter Spacing** | `' + (Number(type.spacing) || 0) + '.sp` | Text tracking |',
        '',
        '## 3. Screen Structure & Component Hierarchy',
        'The application contains **' + pages.length + ' screen(s)**:',
        ''
      ];

      pages.forEach(function (page, pIdx) {
        lines.push('### Screen ' + (pIdx + 1) + ': ' + page.name + ' (`' + page.name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '`)');
        lines.push('- **Screen Icon**: `' + (page.icon || 'home') + '`');
        lines.push('- **Component Hierarchy**:');

        var blocks = page.screen || [];
        if (!blocks.length) {
          lines.push('  *(Screen is empty)*');
        } else {
          blocks.forEach(function (b, bIdx) {
            var p = b.props || {};
            lines.push('  ' + (bIdx + 1) + '. **' + b.type.toUpperCase() + '** (`' + ((S.components && S.components[b.type] && S.components[b.type].label) || b.type) + '`):');
            Object.keys(p).forEach(function (k) {
              if (p[k] != null && String(p[k]).trim()) {
                var val = String(p[k]).replace(/\n/g, ' \\ ');
                if (val.length > 80) val = val.slice(0, 77) + '...';
                lines.push('     - *' + k + '*: `' + val + '`');
              }
            });
          });
        }
        lines.push('');
      });

      lines.push('## 4. Icons & Asset Requirements');
      if (!icons.length) {
        lines.push('- Standard system icons.');
      } else {
        lines.push('The UI requires the following vector icons. Do **not** replace them with generic or random icons; generate VectorDrawable XML files in `res/drawable/`:');
        lines.push('');
        lines.push('| Raw Icon Name | Pack | Vector Drawable Resource |');
        lines.push('| --- | --- | --- |');
        icons.forEach(function (ico) {
          lines.push('| `' + ico.raw + '` | ' + ico.pack + ' | `@drawable/' + ico.resName + '` |');
        });
      }
      lines.push('');

      lines.push('## 5. Functional & Interactive Requirements');
      lines.push('1. **Search Bar**: Must be interactive. Connect query string to `UiState.searchQuery`. Include clear button when text is present.');
      lines.push('2. **Tabs & Filter Chips**: Must support user selection. Hoist selected index / chip in ViewModel.');
      lines.push('3. **Switch Rows**: Must toggle on and off via `onCheckedChange` callback.');
      lines.push('4. **Text Fields**: Must accept user typing and trigger state updates.');
      lines.push('5. **Bottom Navigation**: Pinned in Scaffold bottom bar. Retain tab backstack with `popUpTo(startDestination) { saveState = true }` and `restoreState = true`.');
      lines.push('6. **Music Player / Media**: Provide playback state toggle (`isPlaying`) and slider progress.');
      lines.push('');

      lines.push('## 6. Implementation Rules & Restrictions');
      lines.push('- **Strict Visual Parity**: Recreate the exact proportions, paddings, corner radii, and color contrast.');
      lines.push('- **Minimal & Clean**: Do not introduce unrequested animations, extra floating buttons, or unstyled UI.');
      lines.push('- **No Magic Numbers**: Reference dimension tokens from `ui.theme.Dimens` and `ui.theme.Color`.');
      lines.push('- **Unidirectional Data Flow**: Composable screens must remain stateless. Pass `uiState` and `onEvent` lambdas.');
      lines.push('- **Packaging**: Organize files cleanly into `ui/theme/`, `ui/components/`, `ui/screens/`, `navigation/`, and `res/`.');
      lines.push('');

      return lines.join('\n');
    }
  };
})();
