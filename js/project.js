/* Re-importable project / page files + safe file I/O. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var PAGE_FORMAT = 'droidlab.page';
  var PROJECT_FORMAT = 'droidlab.project';
  var FORMAT_VERSION = 1;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slug(value) {
    return String(value || 'page').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'page';
  }

  function iso() {
    try { return new Date().toISOString(); } catch (err) { return ''; }
  }

  function pageName(d) {
    if (d.target === 'app') {
      var page = S.State.pageById(d.activePageId);
      return (page && page.name) || 'Page';
    }
    return (S.targets[d.target] && S.targets[d.target].label) || 'Page';
  }

  function pageIcon(d) {
    if (d.target === 'app') {
      var page = S.State.pageById(d.activePageId);
      return (page && page.icon) || 'msr:apps';
    }
    return (S.targets[d.target] && S.targets[d.target].icon) || 'apps';
  }

  var Project = S.Project = {
    PAGE_FORMAT: PAGE_FORMAT,
    PROJECT_FORMAT: PROJECT_FORMAT,
    FORMAT_VERSION: FORMAT_VERSION,

    /* The active page (app) or canvas page (website / extension). */
    pageDoc: function () {
      var d = S.State.data;
      S.State.syncActivePage();
      var name = pageName(d);
      return {
        format: PAGE_FORMAT,
        formatVersion: FORMAT_VERSION,
        version: d.version || 2,
        app: 'Droid Lab',
        exportedAt: iso(),
        target: d.target || 'app',
        name: name,
        icon: pageIcon(d),
        device: clone(d.device),
        theme: clone(d.theme),
        ui: clone(d.ui),
        screen: clone(d.screen)
      };
    },

    projectDoc: function () {
      var d = S.State.data;
      S.State.syncActivePage();
      var page = d.target === 'app' ? S.State.pageById(d.activePageId) : null;
      return {
        format: PROJECT_FORMAT,
        formatVersion: FORMAT_VERSION,
        version: d.version || 2,
        app: 'Droid Lab',
        exportedAt: iso(),
        name: (page ? page.name + ' project' : 'Droid Lab project'),
        target: d.target || 'app',
        device: clone(d.device),
        theme: clone(d.theme),
        ui: clone(d.ui),
        pages: clone(d.pages || []),
        activePageId: d.activePageId || null,
        screen: clone(d.screen),
        stash: clone(d.stash || {}),
        compare: clone(d.compare || {})
      };
    },

    pageJSON: function () {
      return JSON.stringify(this.pageDoc(), null, 2) + '\n';
    },

    projectJSON: function () {
      return JSON.stringify(this.projectDoc(), null, 2) + '\n';
    },

    pageFilename: function () {
      return 'droidlab-page-' + slug(pageName(S.State.data)) + '.json';
    },

    projectFilename: function () {
      return 'droidlab-project.json';
    },

    download: function (text, filename, mime) {
      var blob = new Blob([text], { type: mime || 'application/json;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    },

    /* Accepts page files, project files, design specs (v2), or raw block arrays. */
    parse: function (text) {
      var doc;
      try { doc = JSON.parse(String(text || '')); }
      catch (err) { return { ok: false, error: 'That file is not valid JSON.' }; }
      if (!doc || typeof doc !== 'object') {
        return { ok: false, error: 'The file does not contain a Droid Lab document.' };
      }

      // If text was a raw block array
      if (Array.isArray(doc)) {
        doc = {
          format: PAGE_FORMAT,
          formatVersion: FORMAT_VERSION,
          target: (S.State && S.State.data && S.State.data.target) || 'app',
          name: 'Imported Screen',
          icon: 'msr:apps',
          screen: doc
        };
      }

      // Support Design Spec Schema v2 (schemaVersion or screens)
      if (doc.schemaVersion || doc.screens || (doc.project && (doc.screens || doc.blocks))) {
        var specTarget = (doc.project && doc.project.target) || doc.target || 'app';
        var screens = doc.screens || [];
        if (!screens.length && doc.blocks) {
          screens = [{ id: 'screen_1', name: (doc.project && doc.project.name) || 'Screen', icon: 'msr:apps', blocks: doc.blocks }];
        }
        var pages = screens.map(function (s, idx) {
          return {
            id: s.id || S.util.uid(),
            name: s.name || ('Screen ' + (idx + 1)),
            icon: s.icon || 'msr:apps',
            screen: s.blocks || s.screen || []
          };
        });

        doc = {
          format: pages.length > 1 ? PROJECT_FORMAT : PAGE_FORMAT,
          formatVersion: FORMAT_VERSION,
          target: specTarget,
          name: (doc.project && doc.project.name) || (pages[0] && pages[0].name) || 'Design Spec',
          device: doc.device || {},
          theme: doc.theme || {},
          ui: doc.ui || {},
          pages: pages,
          activePageId: pages[0] ? pages[0].id : null,
          screen: (pages[0] && pages[0].screen) || []
        };
      }

      var format = String(doc.format || '');
      var kind = '';
      if (format === PROJECT_FORMAT) kind = 'project';
      else if (format === PAGE_FORMAT) kind = 'page';
      else if (Array.isArray(doc.pages) && doc.pages.length) kind = 'project';
      else if (Array.isArray(doc.screen)) kind = 'page';
      else if (Array.isArray(doc.blocks)) {
        doc.screen = doc.blocks;
        kind = 'page';
      }
      else if (doc.page && Array.isArray(doc.page.screen)) {
        kind = 'page';
        doc = Object.assign({}, doc.page, {
          format: PAGE_FORMAT,
          target: doc.target || 'app',
          theme: doc.theme,
          device: doc.device,
          ui: doc.ui
        });
      }

      if (!kind) return { ok: false, error: 'No Droid Lab page or project was found in that file.' };

      var version = Number(doc.formatVersion);
      if (isFinite(version) && version > FORMAT_VERSION) {
        return { ok: false, error: 'That file was created by a newer Droid Lab version.' };
      }

      if (kind === 'project') {
        if (!Array.isArray(doc.pages)) doc.pages = [];
        if (!Array.isArray(doc.screen)) {
          var pages = doc.pages;
          var active = null;
          for (var i = 0; i < pages.length && !active; i++) {
            if (pages[i] && pages[i].id === doc.activePageId) active = pages[i];
          }
          doc.screen = (active || pages[0] || {}).screen || [];
        }
        if (!doc.pages.length && doc.target === 'app') {
          return { ok: false, error: 'That project file has no screens.' };
        }
      } else if (!Array.isArray(doc.screen)) {
        return { ok: false, error: 'That page file has no blocks.' };
      }

      doc.target = S.targets[doc.target] ? doc.target : 'app';
      return { ok: true, kind: kind, doc: doc };
    },

    readFile: function (file, expectedKind) {
      var self = this;
      if (!file) return Promise.reject(new Error('No file selected.'));

      var read = typeof file.text === 'function'
        ? file.text()
        : new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function () { resolve(String(reader.result || '')); };
          reader.onerror = function () { reject(new Error('The file could not be read.')); };
          reader.readAsText(file);
        });

      return read.then(function (text) {
        var parsed = self.parse(text);
        if (!parsed.ok) {
          U.toast(parsed.error);
          return { ok: false, error: parsed.error };
        }
        if (expectedKind && parsed.kind !== expectedKind) {
          var wrong = expectedKind === 'page'
            ? 'That is a project file - use Open project instead.'
            : 'That is a page file - use Import page instead.';
          U.toast(wrong);
          return { ok: false, error: wrong };
        }

        var name = parsed.kind === 'project'
          ? (parsed.doc.name || 'this project')
          : (parsed.doc.name || 'Untitled page');
        var message = parsed.kind === 'project'
          ? 'Open ' + name + '? It replaces the current project. Ctrl+Z restores it.'
          : 'Import page "' + name + '" into this project?';
        if (!window.confirm(message)) return { ok: false, cancelled: true };

        var result = self.apply(parsed);
        if (result.ok) {
          U.toast(result.message, { action: 'Undo', onAction: function () { S.App.undo(); } });
        } else {
          U.toast(result.error);
        }
        return result;
      }).catch(function (err) {
        U.toast(err && err.message ? err.message : 'Import failed.');
        return { ok: false, error: String(err && err.message || err) };
      });
    },

    apply: function (parsed) {
      if (!parsed || !parsed.ok || !parsed.doc) {
        return { ok: false, error: 'Nothing to import.' };
      }
      var doc = parsed.doc;

      if (parsed.kind === 'project') {
        if (!S.State.loadProject(doc)) {
          return { ok: false, error: 'That project could not be opened.' };
        }
        this.refreshEditor();
        return {
          ok: true,
          kind: 'project',
          message: 'Project opened - Ctrl+Z to go back'
        };
      }

      var target = doc.target === 'web' || doc.target === 'ext' ? doc.target : 'app';
      if (doc.target && S.State.data.target !== target && S.App && S.App.setTarget) {
        S.App.setTarget(target);
      }
      if (target === 'app') {
        var page = S.State.importPage(doc);
        if (!page) return { ok: false, error: 'That page could not be imported.' };
        this.refreshEditor();
        return {
          ok: true,
          kind: 'page',
          page: page,
          message: 'Page "' + page.name + '" imported'
        };
      }

      if (S.State.data.target !== target && S.App) S.App.setTarget(target);
      if (!S.State.replaceCanvasScreen(doc)) {
        return { ok: false, error: 'That page could not be imported onto this canvas.' };
      }
      this.refreshEditor();
      return {
        ok: true,
        kind: 'page',
        message: (S.targets[target] ? S.targets[target].label : 'Page') + ' imported'
      };
    },

    refreshEditor: function () {
      if (!S.App) return;
      S.App.refresh('all');
      if (S.App.loadThemeFonts) S.App.loadThemeFonts();
      S.App.autoFit = true;
      if (S.App.requestFit) S.App.requestFit();
      if (S.App.select) S.App.select(null);
    }
  };
})();
