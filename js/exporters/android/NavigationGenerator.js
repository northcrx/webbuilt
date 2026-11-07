/* Generates Navigation Compose routing, destinations and bottom bar handling. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var android = S.exporters.android = S.exporters.android || {};

  function pascalCase(str, fallback) {
    var clean = String(str || fallback || 'Screen')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join('');
    if (!clean || /^[0-9]/.test(clean)) clean = (fallback || 'Screen') + clean;
    return clean;
  }

  function routeSlug(str, fallback) {
    return String(str || fallback || 'screen')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'screen';
  }

  var NavigationGenerator = android.NavigationGenerator = {
    pascalCase: pascalCase,
    routeSlug: routeSlug,

    generateNavigationKt: function (packageName, pages) {
      pages = (pages && pages.length) ? pages : [{ name: 'Home', icon: 'home' }];

      var destinations = pages.map(function (page, idx) {
        var pName = pascalCase(page.name, 'Screen' + (idx + 1));
        var route = routeSlug(page.name, 'screen_' + (idx + 1));
        var icon = page.icon || 'home';
        return {
          pageName: pName,
          route: route,
          icon: icon,
          title: page.name || pName
        };
      });

      var lines = [
        'package ' + packageName + '.navigation',
        '',
        'import androidx.compose.foundation.layout.padding',
        'import androidx.compose.material3.*',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.runtime.getValue',
        'import androidx.compose.ui.Modifier',
        'import androidx.navigation.NavGraph.Companion.findStartDestination',
        'import androidx.navigation.NavHostController',
        'import androidx.navigation.compose.*',
        'import ' + packageName + '.ui.components.AppIcon',
        ''
      ];

      // Add imports for screens
      destinations.forEach(function (d) {
        lines.push('import ' + packageName + '.ui.screens.' + d.pageName + 'Route');
      });

      lines.push('');
      lines.push('/**',
        ' * Navigation Destinations for Droid Lab Application.',
        ' */',
        'sealed class Screen(val route: String, val title: String, val icon: String) {'
      );

      destinations.forEach(function (d) {
        lines.push('    data object ' + d.pageName + ' : Screen("' + d.route + '", "' + d.title + '", "' + d.icon + '")');
      });

      lines.push('}', '');
      lines.push('val BottomNavScreens = listOf(');
      destinations.forEach(function (d, i) {
        lines.push('    Screen.' + d.pageName + (i === destinations.length - 1 ? '' : ','));
      });
      lines.push(')', '');

      // AppNavHost
      lines.push('@Composable');
      lines.push('fun AppNavHost(');
      lines.push('    navController: NavHostController,');
      lines.push('    modifier: Modifier = Modifier');
      lines.push(') {');
      lines.push('    NavHost(');
      lines.push('        navController = navController,');
      lines.push('        startDestination = Screen.' + destinations[0].pageName + '.route,');
      lines.push('        modifier = modifier');
      lines.push('    ) {');

      destinations.forEach(function (d) {
        lines.push('        composable(Screen.' + d.pageName + '.route) {');
        lines.push('            ' + d.pageName + 'Route()');
        lines.push('        }');
      });

      lines.push('    }');
      lines.push('}');
      lines.push('');

      // Bottom Bar component
      lines.push('@Composable');
      lines.push('fun AppBottomNavigation(');
      lines.push('    navController: NavHostController,');
      lines.push('    modifier: Modifier = Modifier');
      lines.push(') {');
      lines.push('    val navBackStackEntry by navController.currentBackStackEntryAsState()');
      lines.push('    val currentDestination = navBackStackEntry?.destination');
      lines.push('');
      lines.push('    NavigationBar(modifier = modifier) {');
      lines.push('        BottomNavScreens.forEach { screen ->');
      lines.push('            val selected = currentDestination?.route == screen.route');
      lines.push('            NavigationBarItem(');
      lines.push('                icon = { AppIcon(name = screen.icon, contentDescription = screen.title) },');
      lines.push('                label = { Text(screen.title) },');
      lines.push('                selected = selected,');
      lines.push('                onClick = {');
      lines.push('                    if (!selected) {');
      lines.push('                        navController.navigate(screen.route) {');
      lines.push('                            popUpTo(navController.graph.findStartDestination().id) {');
      lines.push('                                saveState = true');
      lines.push('                            }');
      lines.push('                            launchSingleTop = true');
      lines.push('                            restoreState = true');
      lines.push('                        }');
      lines.push('                    }');
      lines.push('                }');
      lines.push('            )');
      lines.push('        }');
      lines.push('    }');
      lines.push('}');

      return lines.join('\n');
    }
  };
})();
