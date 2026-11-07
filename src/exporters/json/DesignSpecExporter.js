/* JSON Design Specification Exporter & Importer.
   Implements a versioned schema that serves as the single source of truth for the design. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};
  var json = S.exporters.json = S.exporters.json || {};

  var SCHEMA_VERSION = 2;

  function clone(val) {
    return JSON.parse(JSON.stringify(val));
  }

  function iso() {
    try { return new Date().toISOString(); } catch (e) { return ''; }
  }

  var DesignSpecExporter = json.DesignSpecExporter = {
    SCHEMA_VERSION: SCHEMA_VERSION,

    /* Generates structured design specification JSON object */
    buildSpec: function (data) {
      data = data || (S.State && S.State.data) || {};
      if (S.State && S.State.syncActivePage) S.State.syncActivePage();

      var pages = (data.pages && data.pages.length) ? data.pages : [{
        id: 'screen_1',
        name: 'Screen',
        icon: 'home',
        screen: data.screen || []
      }];

      var theme = data.theme || {};
      var device = data.device || {};

      // Collect all component types used
      var componentSet = {};
      pages.forEach(function (pg) {
        (pg.screen || []).forEach(function (b) {
          componentSet[b.type] = true;
        });
      });

      // Collect icons
      var icons = [];
      if (S.exporters && S.exporters.android && S.exporters.android.IconGenerator) {
        icons = S.exporters.android.IconGenerator.collectAllIcons(data);
      }

      var spec = {
        schemaVersion: SCHEMA_VERSION,
        project: {
          name: (pages[0] && pages[0].name) ? pages[0].name + ' App' : 'Droid Lab Project',
          target: data.target || 'app',
          framework: 'jetpack-compose',
          exportedAt: iso(),
          generator: 'Droid Lab Design Compiler'
        },
        device: {
          preset: device.preset || 'phone',
          width: Number(device.width) || 390,
          height: Number(device.height) || 844,
          statusBar: device.statusBar !== false,
          gestureBar: device.gestureBar !== false
        },
        theme: {
          mode: theme.dark ? 'dark' : 'light',
          primary: theme.primary || '#6750A4',
          radius: Number(theme.radius) || 18,
          density: theme.density || 'normal',
          fonts: {
            ui: (theme.fonts && theme.fonts.ui) || 'Inter',
            display: (theme.fonts && theme.fonts.display) || 'Inter'
          },
          type: clone(theme.type || {})
        },
        screens: pages.map(function (pg) {
          return {
            id: pg.id,
            name: pg.name,
            icon: pg.icon || 'home',
            blocks: clone(pg.screen || [])
          };
        }),
        components: Object.keys(componentSet).map(function (type) {
          var def = S.components && S.components[type];
          return {
            type: type,
            label: def ? def.label : type,
            category: def ? def.cat : 'general'
          };
        }),
        assets: {
          icons: icons.map(function (ico) {
            return { raw: ico.raw, pack: ico.pack, name: ico.name, drawable: ico.resName };
          }),
          fonts: [
            (theme.fonts && theme.fonts.ui) || 'Inter',
            (theme.fonts && theme.fonts.display) || 'Inter'
          ].filter(Boolean)
        }
      };

      return spec;
    },

    /* Generate formatted JSON text */
    generateJson: function (data) {
      return JSON.stringify(this.buildSpec(data), null, 2) + '\n';
    },

    /* Import and restore state */
    importSpec: function (jsonStr, mode) {
      // mode: 'replace_current' | 'add_new' | 'open_project'
      mode = mode || 'replace_current';
      var parsed;
      try {
        parsed = typeof jsonStr === 'object' ? jsonStr : JSON.parse(String(jsonStr || ''));
      } catch (err) {
        return { ok: false, error: 'Invalid JSON format.' };
      }

      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'Empty or invalid JSON design specification.' };
      }

      // Check format
      var d = S.State.data;
      if (!d) return { ok: false, error: 'Editor state not initialized.' };

      // Case 1: Standard Schema v2 DesignSpec
      if (parsed.schemaVersion || parsed.project) {
        var screens = parsed.screens || [];
        if (!screens.length) {
          return { ok: false, error: 'Design specification contains no screens.' };
        }

        if (mode === 'replace_current') {
          // Replace current page blocks
          var activeScreen = screens[0].blocks || [];
          d.screen = clone(activeScreen);
          if (screens[0].name) {
            var currPage = S.State.pageById(d.activePageId);
            if (currPage) currPage.name = screens[0].name;
          }
          if (parsed.theme) {
            if (parsed.theme.primary) d.theme.primary = parsed.theme.primary;
            if (parsed.theme.mode != null) d.theme.dark = parsed.theme.mode === 'dark';
            if (parsed.theme.radius != null) d.theme.radius = parsed.theme.radius;
            if (parsed.theme.fonts) d.theme.fonts = Object.assign({}, d.theme.fonts, parsed.theme.fonts);
          }
          if (parsed.device) {
            if (parsed.device.width) d.device.width = parsed.device.width;
            if (parsed.device.height) d.device.height = parsed.device.height;
          }
          S.State.commit('page:import:replace');
          if (S.App) S.App.refresh('all');
          return { ok: true, message: 'Current page replaced and updated from design spec.' };
        } else if (mode === 'add_new') {
          var newScreen = screens[0].blocks || [];
          var pName = screens[0].name || 'Imported Screen';
          var newPg = {
            id: S.util.uid(),
            name: pName,
            icon: screens[0].icon || 'home',
            screen: clone(newScreen)
          };
          if (!Array.isArray(d.pages)) d.pages = [];
          d.pages.push(newPg);
          d.activePageId = newPg.id;
          d.screen = newPg.screen;
          S.State.syncNavFromPages();
          S.State.commit('page:import:add');
          if (S.App) S.App.refresh('all');
          return { ok: true, message: 'Screen "' + pName + '" added.' };
        } else {
          // Open project
          d.pages = screens.map(function (s) {
            return {
              id: s.id || S.util.uid(),
              name: s.name || 'Screen',
              icon: s.icon || 'home',
              screen: clone(s.blocks || [])
            };
          });
          d.activePageId = d.pages[0].id;
          d.screen = d.pages[0].screen;
          if (parsed.theme) {
            if (parsed.theme.primary) d.theme.primary = parsed.theme.primary;
            if (parsed.theme.mode != null) d.theme.dark = parsed.theme.mode === 'dark';
            if (parsed.theme.radius != null) d.theme.radius = parsed.theme.radius;
            if (parsed.theme.fonts) d.theme.fonts = Object.assign({}, d.theme.fonts, parsed.theme.fonts);
          }
          if (parsed.device) {
            if (parsed.device.width) d.device.width = parsed.device.width;
            if (parsed.device.height) d.device.height = parsed.device.height;
          }
          S.State.syncNavFromPages();
          S.State.commit('project:import');
          if (S.App) S.App.refresh('all');
          return { ok: true, message: 'Full project imported with ' + d.pages.length + ' screens.' };
        }
      }

      // Case 2: DroidLab Page JSON (`format: 'droidlab.page'`)
      if (parsed.format === 'droidlab.page' || (Array.isArray(parsed.screen) && !parsed.pages)) {
        if (mode === 'replace_current') {
          d.screen = clone(parsed.screen || []);
          if (parsed.name) {
            var page = S.State.pageById(d.activePageId);
            if (page) page.name = parsed.name;
          }
          if (parsed.theme) d.theme = Object.assign({}, d.theme, parsed.theme);
          if (parsed.device) d.device = Object.assign({}, d.device, parsed.device);
          S.State.commit('page:replace');
          if (S.App) S.App.refresh('all');
          return { ok: true, message: 'Current page replaced. You can now edit and export again.' };
        } else {
          if (S.Project && S.Project.apply) {
            return S.Project.apply({ ok: true, kind: 'page', doc: parsed });
          }
        }
      }

      // Case 3: DroidLab Project JSON (`format: 'droidlab.project'`)
      if (parsed.format === 'droidlab.project' || Array.isArray(parsed.pages)) {
        if (S.Project && S.Project.apply) {
          return S.Project.apply({ ok: true, kind: 'project', doc: parsed });
        }
      }

      return { ok: false, error: 'Unrecognized Droid Lab document format.' };
    }
  };
})();
