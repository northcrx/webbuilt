/* Import system: Allows importing saved Droid Lab pages, projects, or
   design specs, to edit on canvas and re-export anytime. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util || {};

  var pendingDoc = null;
  var pendingKind = null;

  var ImportManager = S.Import = {
    open: function () {
      var modal = document.getElementById('import-modal');
      if (!modal) return;
      this.reset();
      modal.hidden = false;
    },

    close: function () {
      var modal = document.getElementById('import-modal');
      if (modal) modal.hidden = true;
      this.reset();
    },

    reset: function () {
      pendingDoc = null;
      pendingKind = null;
      var paste = document.getElementById('import-json-paste');
      if (paste) paste.value = '';
      var card = document.getElementById('import-preview-card');
      if (card) card.hidden = true;
      var note = document.getElementById('import-note');
      if (note) note.textContent = 'Select a file or paste JSON to import';

      var btnReplace = document.getElementById('btn-import-replace-page');
      var btnAdd = document.getElementById('btn-import-new-page');
      var btnProj = document.getElementById('btn-import-open-project');
      if (btnReplace) btnReplace.disabled = true;
      if (btnAdd) btnAdd.disabled = true;
      if (btnProj) btnProj.disabled = true;
    },

analyze: function (text) {
      if (!text || !text.trim()) {
        this.reset();
        return;
      }

      var parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        var note = document.getElementById('import-note');
        if (note) note.textContent = 'Invalid JSON: ' + err.message;
        var card = document.getElementById('import-preview-card');
        if (card) card.hidden = true;
        var btnReplace = document.getElementById('btn-import-replace-page');
        var btnAdd = document.getElementById('btn-import-new-page');
        var btnProj = document.getElementById('btn-import-open-project');
        if (btnReplace) btnReplace.disabled = true;
        if (btnAdd) btnAdd.disabled = true;
        if (btnProj) btnProj.disabled = true;
        return;
      }

      if (!parsed || typeof parsed !== 'object') {
        var note2 = document.getElementById('import-note');
        if (note2) note2.textContent = 'The JSON must contain an object or block array.';
        return;
      }

      if (Array.isArray(parsed)) {
        parsed = {
          format: 'droidlab.page',
          name: 'Imported Screen',
          icon: 'msr:apps',
          screen: parsed
        };
      }

      pendingDoc = parsed;

      var kind = 'page';
      var name = 'Imported Page';
      var blockCount = 0;
      var screenCount = 1;

      // Check format
      if (parsed.schemaVersion || parsed.screens || (parsed.project && (parsed.screens || parsed.blocks))) {
        var screens = parsed.screens || [];
        if (!screens.length && parsed.blocks) {
          screens = [{ name: 'Screen', blocks: parsed.blocks }];
        }
        screenCount = screens.length || 1;
        name = (parsed.project && parsed.project.name) || (screens[0] && screens[0].name) || 'Design Spec';
        blockCount = screens.reduce(function (acc, s) {
          return acc + (s.blocks ? s.blocks.length : (s.screen ? s.screen.length : 0));
        }, 0);
        kind = screenCount > 1 ? 'project' : 'page';
      } else if (parsed.format === 'droidlab.project' || Array.isArray(parsed.pages)) {
        kind = 'project';
        name = parsed.name || 'Droid Lab Project';
        var pgs = parsed.pages || [];
        screenCount = pgs.length;
        blockCount = pgs.reduce(function (acc, p) { return acc + (p.screen ? p.screen.length : 0); }, 0);
      } else if (parsed.format === 'droidlab.page' || Array.isArray(parsed.screen) || Array.isArray(parsed.blocks) || (parsed.page && Array.isArray(parsed.page.screen))) {
        kind = 'page';
        var sc = parsed.screen || parsed.blocks || (parsed.page && parsed.page.screen) || [];
        name = parsed.name || (parsed.page && parsed.page.name) || 'Droid Lab Page';
        blockCount = sc.length;
      }

      pendingKind = kind;

      // Show card
      var card = document.getElementById('import-preview-card');
      var ipcName = document.getElementById('ipc-name');
      var ipcDetails = document.getElementById('ipc-details');
      var ipcBadge = document.getElementById('ipc-badge');
      var ipcIcon = document.getElementById('ipc-icon');
      var note = document.getElementById('import-note');

      if (ipcName) ipcName.textContent = name;
      if (ipcDetails) {
        ipcDetails.textContent = blockCount + ' block(s)' + (screenCount > 1 ? ' across ' + screenCount + ' screens' : '') + ' · ready to edit';
      }
      if (ipcBadge) ipcBadge.textContent = kind === 'project' ? 'Project file' : 'Page file';
      if (ipcIcon) ipcIcon.textContent = kind === 'project' ? 'folder_open' : 'description';
      if (card) card.hidden = false;
      if (note) note.textContent = 'Ready to import! Choose how you want to load it:';

      var btnReplace = document.getElementById('btn-import-replace-page');
      var btnAdd = document.getElementById('btn-import-new-page');
      var btnProj = document.getElementById('btn-import-open-project');

      if (btnReplace) btnReplace.disabled = false;
      if (btnAdd) btnAdd.disabled = false;
      if (btnProj) btnProj.disabled = false;
    },

    executeImport: function (mode) {
      if (!pendingDoc) return;
      var self = this;

      if (S.exporters && S.exporters.json && S.exporters.json.DesignSpecExporter) {
        var res = S.exporters.json.DesignSpecExporter.importSpec(pendingDoc, mode);
        if (res.ok) {
          self.close();
          U.toast(res.message || 'Import successful', {
            action: 'Undo',
            onAction: function () { if (S.App) S.App.undo(); }
          });
          return;
        } else {
          U.toast(res.error || 'Import failed');
        }
      } else if (S.Project && S.Project.apply) {
        var result = S.Project.apply({ ok: true, kind: pendingKind, doc: pendingDoc });
        if (result.ok) {
          self.close();
          U.toast(result.message || 'Import successful');
        } else {
          U.toast(result.error || 'Import failed');
        }
      }
    },

    init: function () {
      var self = this;
      var modal = document.getElementById('import-modal');
      var closeBtn = document.getElementById('import-close');
      var dropzone = document.getElementById('import-dropzone');
      var filePicker = document.getElementById('import-picker-file');
      var browseBtn = document.getElementById('btn-browse-file');
      var pasteTextarea = document.getElementById('import-json-paste');

      var btnReplace = document.getElementById('btn-import-replace-page');
      var btnAdd = document.getElementById('btn-import-new-page');
      var btnProj = document.getElementById('btn-import-open-project');

      if (closeBtn) closeBtn.addEventListener('click', function () { self.close(); });
      if (modal) {
        modal.addEventListener('click', function (e) {
          if (e.target === modal) self.close();
        });
      }

      if (browseBtn && filePicker) {
        browseBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          filePicker.click();
        });
      }

      if (dropzone && filePicker) {
        dropzone.addEventListener('click', function () {
          filePicker.click();
        });

        dropzone.addEventListener('dragover', function (e) {
          e.preventDefault();
          dropzone.classList.add('drag-active');
        });

        dropzone.addEventListener('dragleave', function () {
          dropzone.classList.remove('drag-active');
        });

        dropzone.addEventListener('drop', function (e) {
          e.preventDefault();
          dropzone.classList.remove('drag-active');
          var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          if (file) self.readFile(file);
        });

        filePicker.addEventListener('change', function () {
          var file = filePicker.files && filePicker.files[0];
          filePicker.value = '';
          if (file) self.readFile(file);
        });
      }

      if (pasteTextarea) {
        pasteTextarea.addEventListener('input', function () {
          self.analyze(pasteTextarea.value);
        });
      }

      if (btnReplace) btnReplace.addEventListener('click', function () { self.executeImport('replace_current'); });
      if (btnAdd) btnAdd.addEventListener('click', function () { self.executeImport('add_new'); });
      if (btnProj) btnProj.addEventListener('click', function () { self.executeImport('open_project'); });
    },

    readFile: function (file) {
      var self = this;
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var text = String(reader.result || '');
        var paste = document.getElementById('import-json-paste');
        if (paste) paste.value = text;
        self.analyze(text);
      };
      reader.onerror = function () {
        U.toast('Could not read the selected file.');
      };
      reader.readAsText(file);
    }
  };
})();
