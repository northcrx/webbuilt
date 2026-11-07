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
      mode = mode || 'replace_current';
      var parsed;
      try {
        parsed = typeof jsonStr === 'object' ? jsonStr : JSON.parse(String(jsonStr || ''));
      } catch (err) {
        return { ok: false, error: 'Invalid JSON format: ' + err.message };
      }

      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'Empty or invalid JSON design specification.' };
      }

      var d = S.State && S.State.data;
      if (!d) return { ok: false, error: 'Editor state not initialized.' };

      // Raw array of blocks
      if (Array.isArray(parsed)) {
        parsed = {
          format: 'droidlab.page',
          name: 'Imported Screen',
          icon: 'msr:apps',
          screen: parsed
        };
      }

      // Case 1: Standard Schema v2 DesignSpec
      if (parsed.schemaVersion || parsed.screens || (parsed.project && (parsed.screens || parsed.blocks))) {
        var screens = parsed.screens || [];
        if (!screens.length && parsed.blocks) {
          screens = [{ id: 'screen_1', name: (parsed.project && parsed.project.name) || 'Screen', icon: 'msr:apps', blocks: parsed.blocks }];
        }
        if (!screens.length) {
          return { ok: false, error: 'Design specification contains no screens.' };
        }

        var specTarget = (parsed.project && parsed.project.target) || parsed.target || 'app';

        if (mode === 'replace_current') {
          var activeBlocks = screens[0].blocks || screens[0].screen || [];
          var pageName = screens[0].name || (parsed.project && parsed.project.name) || 'Screen';
          var pageIcon = screens[0].icon || 'msr:apps';

          if (specTarget !== d.target && S.App && S.App.setTarget) {
            S.App.setTarget(specTarget);
          }

          var replaced = S.State.replaceCurrentPage({
            screen: activeBlocks,
            name: pageName,
            icon: pageIcon,
            theme: parsed.theme,
            device: parsed.device,
            target: specTarget
          });

          if (!replaced) return { ok: false, error: 'Could not replace current page.' };
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          else if (S.App) { S.App.refresh('all'); if (S.App.requestFit) S.App.requestFit(); }
          return { ok: true, message: 'Current page replaced with "' + pageName + '". Edit and re-export anytime.' };

        } else if (mode === 'add_new') {
          if (specTarget !== d.target && S.App && S.App.setTarget) {
            S.App.setTarget(specTarget);
          }

          if (screens.length > 1) {
            screens.forEach(function (s, idx) {
              S.State.importPage({
                name: s.name || ('Screen ' + (idx + 1)),
                icon: s.icon || 'msr:apps',
                screen: s.blocks || s.screen || []
              });
            });
            if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
            return { ok: true, message: screens.length + ' screens added to project.' };
          } else {
            var s0 = screens[0];
            var pName = s0.name || 'Imported Screen';
            var page = S.State.importPage({
              name: pName,
              icon: s0.icon || 'msr:apps',
              screen: s0.blocks || s0.screen || []
            });
            if (!page) return { ok: false, error: 'Could not add screen.' };
            if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
            return { ok: true, message: 'Screen "' + pName + '" added.' };
          }

        } else {
          // Open project
          var pages = screens.map(function (s, idx) {
            return {
              id: s.id || S.util.uid(),
              name: s.name || ('Screen ' + (idx + 1)),
              icon: s.icon || 'msr:apps',
              screen: clone(s.blocks || s.screen || [])
            };
          });

          var projDoc = {
            format: 'droidlab.project',
            formatVersion: 1,
            target: specTarget,
            name: (parsed.project && parsed.project.name) || 'Design Spec Project',
            device: clone(parsed.device || {}),
            theme: clone(parsed.theme || {}),
            pages: pages,
            activePageId: pages[0] ? pages[0].id : null,
            screen: pages[0] ? pages[0].screen : []
          };

          if (!S.State.loadProject(projDoc)) {
            return { ok: false, error: 'Could not load project.' };
          }
          if (specTarget !== S.State.data.target && S.App && S.App.setTarget) {
            S.App.setTarget(specTarget);
          }
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          return { ok: true, message: 'Full project imported with ' + pages.length + ' screen(s).' };
        }
      }

      // Case 2: DroidLab Page JSON
      if (parsed.format === 'droidlab.page' || (Array.isArray(parsed.screen) && !parsed.pages) || (parsed.page && Array.isArray(parsed.page.screen))) {
        var pageTarget = parsed.target || (parsed.page && parsed.page.target) || 'app';
        var pageBlocks = parsed.screen || (parsed.page && parsed.page.screen) || [];
        var pName2 = parsed.name || (parsed.page && parsed.page.name) || 'Page';
        var pIcon2 = parsed.icon || (parsed.page && parsed.page.icon) || 'msr:apps';

        if (mode === 'replace_current') {
          if (pageTarget !== d.target && S.App && S.App.setTarget) {
            S.App.setTarget(pageTarget);
          }
          var rep = S.State.replaceCurrentPage({
            screen: pageBlocks,
            name: pName2,
            icon: pIcon2,
            theme: parsed.theme,
            device: parsed.device,
            target: pageTarget
          });
          if (!rep) return { ok: false, error: 'Could not replace current page.' };
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          return { ok: true, message: 'Current page replaced with "' + pName2 + '". Edit and re-export anytime.' };
        } else if (mode === 'add_new') {
          if (pageTarget !== d.target && S.App && S.App.setTarget) {
            S.App.setTarget(pageTarget);
          }
          var addedPage = S.State.importPage({
            name: pName2,
            icon: pIcon2,
            screen: pageBlocks
          });
          if (!addedPage) return { ok: false, error: 'Could not add page.' };
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          return { ok: true, message: 'Page "' + pName2 + '" added.' };
        } else {
          var singleProj = {
            format: 'droidlab.project',
            formatVersion: 1,
            target: pageTarget,
            name: pName2 + ' project',
            device: clone(parsed.device || {}),
            theme: clone(parsed.theme || {}),
            pages: [{ id: S.util.uid(), name: pName2, icon: pIcon2, screen: clone(pageBlocks) }],
            screen: clone(pageBlocks)
          };
          if (!S.State.loadProject(singleProj)) return { ok: false, error: 'Could not load project.' };
          if (pageTarget !== S.State.data.target && S.App && S.App.setTarget) {
            S.App.setTarget(pageTarget);
          }
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          return { ok: true, message: 'Project opened with page "' + pName2 + '".' };
        }
      }

      // Case 3: DroidLab Project JSON
      if (parsed.format === 'droidlab.project' || Array.isArray(parsed.pages)) {
        var projTarget = parsed.target || 'app';
        if (mode === 'replace_current') {
          var firstPage = (parsed.pages && parsed.pages[0]) || { screen: parsed.screen || [] };
          if (projTarget !== d.target && S.App && S.App.setTarget) {
            S.App.setTarget(projTarget);
          }
          var repP = S.State.replaceCurrentPage({
            screen: firstPage.screen || [],
            name: firstPage.name || 'Screen',
            icon: firstPage.icon || 'msr:apps',
            theme: parsed.theme,
            device: parsed.device,
            target: projTarget
          });
          if (!repP) return { ok: false, error: 'Could not replace current page.' };
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          return { ok: true, message: 'Current page replaced with "' + (firstPage.name || 'Screen') + '".' };
        } else if (mode === 'add_new') {
          if (projTarget !== d.target && S.App && S.App.setTarget) {
            S.App.setTarget(projTarget);
          }
          (parsed.pages || []).forEach(function (p) {
            S.State.importPage({ name: p.name, icon: p.icon, screen: p.screen });
          });
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          return { ok: true, message: (parsed.pages ? parsed.pages.length : 1) + ' screen(s) added.' };
        } else {
          if (!S.State.loadProject(parsed)) return { ok: false, error: 'Could not load project.' };
          if (projTarget !== S.State.data.target && S.App && S.App.setTarget) {
            S.App.setTarget(projTarget);
          }
          if (S.Project && S.Project.refreshEditor) S.Project.refreshEditor();
          return { ok: true, message: 'Project opened with ' + (parsed.pages ? parsed.pages.length : 1) + ' screen(s).' };
        }
      }

      return { ok: false, error: 'Unrecognized Droid Lab document format.' };
    }
  };
})();
