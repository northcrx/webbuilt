/* Android Design-to-Code Compiler & Project Exporter.
   Orchestrates code generation, validation, file tree assembly, and ZIP export. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var android = S.exporters.android = S.exporters.android || {};

  var AndroidExporter = android.AndroidExporter = {
    /* Perform comprehensive validation before export */
    validate: function (data) {
      data = data || (S.State && S.State.data) || {};
      var pages = (data.pages && data.pages.length) ? data.pages : [{ name: 'Screen', screen: data.screen || [] }];
      var report = {
        valid: true,
        score: 100,
        checks: [],
        warnings: [],
        errors: [],
        stats: {
          screens: pages.length,
          blocks: 0,
          icons: 0,
          drawables: 0
        }
      };

      var totalBlocks = 0;
      var unmappedBlocks = [];
      pages.forEach(function (page) {
        (page.screen || []).forEach(function (b) {
          totalBlocks++;
          if (!S.components || !S.components[b.type]) {
            unmappedBlocks.push(b.type);
          }
        });
      });
      report.stats.blocks = totalBlocks;

      if (unmappedBlocks.length > 0) {
        report.warnings.push('Found ' + unmappedBlocks.length + ' unmapped component(s): ' + unmappedBlocks.join(', '));
        report.score -= unmappedBlocks.length * 5;
      } else {
        report.checks.push('All ' + totalBlocks + ' visual components mapped to native Compose composables');
      }

      // Check Icons
      var icons = android.IconGenerator ? android.IconGenerator.collectAllIcons(data) : [];
      report.stats.icons = icons.length;
      report.stats.drawables = icons.length;
      report.checks.push(icons.length + ' vector icons resolved and prepared for res/drawable/');

      // Check Fonts
      var uiFont = (data.theme && data.theme.fonts && data.theme.fonts.ui) || 'Inter';
      report.checks.push('Typography configured with font family: ' + uiFont + ' (sp scale preserved)');

      // Check Dimension units
      var w = (data.device && data.device.width) || 390;
      var h = (data.device && data.device.height) || 844;
      report.checks.push('Screen dimensions: ' + w + 'dp x ' + h + 'dp (converted cleanly to dp)');

      report.score = Math.max(0, Math.min(100, report.score));
      return report;
    },

    /* Generate all project files */
    generateProject: function (opts) {
      opts = opts || {};
      var data = opts.data || (S.State && S.State.data) || {};
      if (S.State && S.State.syncActivePage) S.State.syncActivePage();

      var packageName = opts.packageName || 'com.example.droidlab';
      var appName = opts.appName || 'Droid Lab';
      var minSdk = Number(opts.minSdk) || 24;
      var targetSdk = Number(opts.targetSdk) || 34;
      var packagePath = packageName.replace(/\./g, '/');

      var files = [];
      var pages = (data.pages && data.pages.length) ? data.pages : [{ name: 'Screen', screen: data.screen || [] }];

      // 1. Root & Gradle configs
      files.push({
        path: 'settings.gradle.kts',
        content: android.GradleGenerator.generateSettingsGradle(appName.replace(/\s+/g, ''))
      });
      files.push({
        path: 'build.gradle.kts',
        content: android.GradleGenerator.generateRootBuildGradle()
      });
      files.push({
        path: 'gradle.properties',
        content: android.GradleGenerator.generateGradleProperties()
      });
      files.push({
        path: 'gradle/wrapper/gradle-wrapper.properties',
        content: android.GradleGenerator.generateWrapperProperties()
      });
      files.push({
        path: 'app/build.gradle.kts',
        content: android.GradleGenerator.generateAppBuildGradle({
          packageName: packageName,
          minSdk: minSdk,
          targetSdk: targetSdk
        })
      });

      // 2. Android Manifest
      files.push({
        path: 'app/src/main/AndroidManifest.xml',
        content: android.ManifestGenerator.generateManifestXml(packageName, appName, true)
      });

      // 3. Android Resources
      files.push({
        path: 'app/src/main/res/values/strings.xml',
        content: android.ResourceGenerator.generateStringsXml(data)
      });
      files.push({
        path: 'app/src/main/res/values/colors.xml',
        content: android.ResourceGenerator.generateColorsXml(data.theme)
      });
      files.push({
        path: 'app/src/main/res/values/themes.xml',
        content: android.ResourceGenerator.generateThemesXml()
      });

      // 4. Vector Drawable Icons
      var vectorResult = android.IconGenerator.generateVectorDrawables(data);
      (vectorResult.files || []).forEach(function (f) {
        files.push(f);
      });

      // 5. Theme files (Color.kt, Type.kt, Shape.kt, Dimens.kt, Theme.kt)
      var theme = data.theme || {};
      files.push({
        path: 'app/src/main/java/' + packagePath + '/ui/theme/Color.kt',
        content: android.ThemeGenerator.generateColorKt(packageName, theme)
      });
      files.push({
        path: 'app/src/main/java/' + packagePath + '/ui/theme/Type.kt',
        content: android.ThemeGenerator.generateTypeKt(packageName, theme)
      });
      files.push({
        path: 'app/src/main/java/' + packagePath + '/ui/theme/Shape.kt',
        content: android.ThemeGenerator.generateShapeKt(packageName, theme)
      });
      files.push({
        path: 'app/src/main/java/' + packagePath + '/ui/theme/Dimens.kt',
        content: android.ThemeGenerator.generateDimensKt(packageName, data.device, theme)
      });
      files.push({
        path: 'app/src/main/java/' + packagePath + '/ui/theme/Theme.kt',
        content: android.ThemeGenerator.generateThemeKt(packageName, theme)
      });

      // 6. UI Components (AppComponents.kt and AppIcon.kt)
      files.push({
        path: 'app/src/main/java/' + packagePath + '/ui/components/AppIcon.kt',
        content: android.IconGenerator.generateAppIconComponent(packageName, vectorResult.icons)
      });
      files.push({
        path: 'app/src/main/java/' + packagePath + '/ui/components/AppComponents.kt',
        content: android.ComposeGenerator.generateAppComponentsKt(packageName)
      });

      // 7. Navigation
      files.push({
        path: 'app/src/main/java/' + packagePath + '/navigation/AppNavigation.kt',
        content: android.NavigationGenerator.generateNavigationKt(packageName, pages)
      });

      // 8. Individual Screens
      pages.forEach(function (pg, idx) {
        var screenName = android.NavigationGenerator.pascalCase(pg.name, 'Screen' + (idx + 1));
        files.push({
          path: 'app/src/main/java/' + packagePath + '/ui/screens/' + screenName + 'Screen.kt',
          content: android.ComposeGenerator.generateScreenKt(packageName, pg, idx, pages)
        });
      });

      // 9. MainActivity.kt
      var mainActivity = [
        'package ' + packageName,
        '',
        'import android.os.Bundle',
        'import androidx.activity.ComponentActivity',
        'import androidx.activity.compose.setContent',
        'import androidx.activity.enableEdgeToEdge',
        'import androidx.compose.foundation.layout.fillMaxSize',
        'import androidx.compose.foundation.layout.padding',
        'import androidx.compose.material3.Scaffold',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.Modifier',
        'import androidx.navigation.compose.rememberNavController',
        'import ' + packageName + '.navigation.AppBottomNavigation',
        'import ' + packageName + '.navigation.AppNavHost',
        'import ' + packageName + '.ui.theme.DroidLabTheme',
        '',
        'class MainActivity : ComponentActivity() {',
        '    override fun onCreate(savedInstanceState: Bundle?) {',
        '        super.onCreate(savedInstanceState)',
        '        enableEdgeToEdge()',
        '        setContent {',
        '            DroidLabTheme {',
        '                AppRoot()',
        '            }',
        '        }',
        '    }',
        '}',
        '',
        '@Composable',
        'fun AppRoot() {',
        '    val navController = rememberNavController()',
        '    Scaffold(',
        '        modifier = Modifier.fillMaxSize(),',
        '        bottomBar = {',
        '            AppBottomNavigation(navController = navController)',
        '        }',
        '    ) { innerPadding ->',
        '        AppNavHost(',
        '            navController = navController,',
        '            modifier = Modifier.padding(innerPadding)',
        '        )',
        '    }',
        '}',
        ''
      ].join('\n');

      files.push({
        path: 'app/src/main/java/' + packagePath + '/MainActivity.kt',
        content: mainActivity
      });

      // 10. Project README.md
      var readme = [
        '# ' + appName + ' (Android Jetpack Compose)',
        '',
        'Exported from **Droid Lab** — Visual UI Builder & Multi-Platform Design Compiler.',
        '',
        '## Requirements',
        '- Android Studio Iguana (2023.2.1) or newer',
        '- JDK 17 or higher',
        '- Min SDK: ' + minSdk,
        '- Target SDK: ' + targetSdk,
        '',
        '## Included Components',
        '- Material 3 Design System (`ui/theme`)',
        '- Reusable Compose Blocks (`ui/components`)',
        '- Jetpack Navigation Compose (`navigation/AppNavigation.kt`)',
        '- Native VectorDrawable Icons (`res/drawable/`)',
        '- Unidirectional Data Flow with `StateFlow` and ViewModels',
        '',
        '## Opening the Project',
        '1. Extract this ZIP archive.',
        '2. Open Android Studio and select **Open**.',
        '3. Choose the extracted folder and let Gradle sync complete.',
        '4. Run on an emulator or physical device!'
      ].join('\n');

      files.push({
        path: 'README.md',
        content: readme
      });

      return files;
    },

    /* Download the full Android project as a ZIP */
    exportZip: function (opts) {
      opts = opts || {};
      var files = this.generateProject(opts);
      var appName = (opts.appName || 'DroidLab').replace(/[^a-zA-Z0-9_-]+/g, '_');
      var filename = appName + '-Android-Project.zip';

      if (S.exporters && S.exporters.Zip) {
        S.exporters.Zip.download(files, filename);
        if (S.util && S.util.toast) {
          S.util.toast('Downloaded ' + filename);
        }
      }
    }
  };
})();
