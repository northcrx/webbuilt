/* Builds a standalone, self-contained HTML mockup, Android Jetpack Compose project,
   JSON design specification, or AI implementation prompt for the active target. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;
  var lastCode = '';
  var activeTab = 'html';
  var TABS = ['html', 'android', 'page', 'project', 'prompt'];

  var currentAndroidFiles = [];
  var activeAndroidFile = null;

  var MATERIAL_URL = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
  var PHOSPHOR_URL = 'https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css';

  var Export = S.Export = {
    fontLinks: function () {
      var d = S.State.data;
      var names = [];
      var add = function (n) { if (n && names.indexOf(n) === -1) names.push(n); };
      [d.theme.fonts.ui, d.theme.fonts.display].forEach(add);
      /* Every exported page may use its own typography. */
      var pages = (Array.isArray(d.pages) && d.pages.length) ? d.pages : [{ screen: d.screen }];
      pages.forEach(function (page) {
        (page.screen || []).forEach(function (block) {
          if (block.typography && block.typography.family) add(block.typography.family);
        });
      });

      var parts = names.map(function (name) {
        var meta = S.fonts.filter(function (f) { return f.name === name; })[0];
        var fam = name.replace(/\s+/g, '+');
        if (!meta || meta.cat === 'Custom' || meta.w.length < 2) return 'family=' + fam;
        return 'family=' + fam + ':wght@' + meta.w.join(';');
      });

      return parts.length
        ? '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
          '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
          '<link href="https://fonts.googleapis.com/css2?' + parts.join('&') + '&display=swap" rel="stylesheet">'
        : '';
    },

    build: function () {
      var d = S.State.data;
      if (S.State.syncActivePage) S.State.syncActivePage();
      var target = d.target || 'app';
      var pages = target === 'app' ? S.Render.exportPages() : null;
      var body = pages ? pages.html : d.screen.filter(function (item) { return !item.hidden; })
        .map(function (item) { return S.Render.exportBlock(item); }).join('\n');
      var overlay = S.Render.overlayMarkup();
      var usesMaterial = /class="[^"]*\bmi\b/.test(body + overlay);
      var usesPhosphor = /\bph ph-/.test(body + overlay);
      var materialLink = usesMaterial ? '<link href="' + MATERIAL_URL + '" rel="stylesheet">' : '';
      var phosphorLink = usesPhosphor ? '<link href="' + PHOSPHOR_URL + '" rel="stylesheet">' : '';
      var tokens = S.Render.tokens(d.theme).replace(/"/g, '&quot;');
      var dark = d.theme.dark ? ' dark' : '';
      var meta = S.targets[target];
      var content;

      var extBar = '<div class="ext-bar">' +
        '<span class="ext-pin">' + S.icon('extension') + '</span>' +
        '<span class="ext-bar-title">Extensions</span>' +
        '<span class="ext-avatar">AL</span>' +
        '</div>';

      if (target === 'web') {
        content = '<div class="web-page" style="' + tokens + '">\n' + body + '\n' + overlay + '\n</div>\n';
      } else if (target === 'ext') {
        content = '<div class="ext-window' + dark + '" style="' + tokens + '">\n' +
          extBar + '\n<div class="ext-screen"><div class="ext-page">\n' + body + '\n</div></div>\n' +
          overlay + '\n</div>\n';
      } else {
        content = '<div class="phone export-phone' + dark + '" data-search-mode="' +
          esc((d.ui && d.ui.search && d.ui.search.mode) || 'overlay') + '" style="' + tokens +
          '--export-w:' + d.device.width + 'px;--export-h:' + d.device.height + 'px">\n' +
          '<div class="phone-screen"' + (d.device.statusBar ? ' style="--ui-top:34px"' : '') + '>\n' +
          (d.device.statusBar ? S.Render.statusBar() + '\n' : '') +
          '<div class="app-screen export-stage">\n' + body + '\n</div>\n' +
          (d.device.gestureBar ? S.Render.gestureBar() + '\n' : '') +
          overlay + '\n</div>\n</div>\n';
      }

      var bodyClass = 'export-body' + (target === 'web' ? ' export-web' : target === 'ext' ? ' export-ext' : '');

      return '<!doctype html>\n<html lang="en">\n<head>\n' +
        '<meta charset="utf-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<title>Droid Lab — ' + meta.label + '</title>\n' +
        this.fontLinks() + '\n' + materialLink + '\n' + phosphorLink +
        '\n<style>\n' + S.mockupCSS + '\n</style>\n' +
        '</head>\n<body class="' + bodyClass + '">\n' +
        content +
        this.runtime() + '\n' +
        '</body>\n</html>\n';
    },

    runtime: function () {
      return '<script>\n(' + runtime.toString() + ')();\n</script>';
    },

    content: function (tab) {
      if (tab === 'page') {
        return S.Project ? S.Project.pageJSON() : '';
      }
      if (tab === 'project') {
        return (S.exporters && S.exporters.json && S.exporters.json.DesignSpecExporter)
          ? S.exporters.json.DesignSpecExporter.generateJson(S.State.data)
          : (S.Project ? S.Project.projectJSON() : '');
      }
      if (tab === 'prompt') {
        return (S.exporters && S.exporters.prompt && S.exporters.prompt.AIPromptGenerator)
          ? S.exporters.prompt.AIPromptGenerator.generatePrompt(S.State.data)
          : '';
      }
      if (tab === 'android') {
        if (currentAndroidFiles && currentAndroidFiles.length) {
          var found = currentAndroidFiles.filter(function (f) { return f.path === activeAndroidFile; })[0];
          if (found) return found.content;
          return currentAndroidFiles[0].content;
        }
        return S.Android ? S.Android.build() : '';
      }
      return this.build();
    },

    meta: function (tab) {
      var d = S.State.data;
      var target = S.targets[d.target || 'app'];
      var page = S.Project ? S.Project.pageDoc() : null;
      var pageCount = d.target === 'app' && Array.isArray(d.pages) ? d.pages.length : 1;
      var blockCount = d.target === 'app' && Array.isArray(d.pages)
        ? d.pages.reduce(function (n, p) { return n + (p.screen || []).length; }, 0)
        : d.screen.length;

      if (tab === 'page') {
        return {
          title: 'Page file (JSON)',
          sub: 'A re-importable page. Use the Import button in the top bar to open it and edit again.',
          copy: 'Copy JSON',
          download: 'Download .json',
          filename: S.Project ? S.Project.pageFilename() : 'droidlab-page.json',
          mime: 'application/json;charset=utf-8',
          note: (page ? page.name : 'Page') + ' · ' + (page ? page.screen.length : 0) +
            ' blocks · round-trip editable'
        };
      }
      if (tab === 'project') {
        return {
          title: 'Design Specification (JSON)',
          sub: 'Full schema v2 design specification with tokens, component hierarchy, assets and metadata.',
          copy: 'Copy JSON',
          download: 'Download .json',
          filename: 'droidlab-design-spec.json',
          mime: 'application/json;charset=utf-8',
          note: pageCount + (pageCount === 1 ? ' screen' : ' screens') + ' · ' + blockCount +
            ' blocks · Schema v2'
        };
      }
      if (tab === 'prompt') {
        return {
          title: 'AI Implementation Prompt',
          sub: 'Generated prompt containing exact design tokens, component hierarchy and architecture rules.',
          copy: 'Copy Prompt',
          download: 'Download .md',
          filename: 'droidlab-ai-prompt.md',
          mime: 'text/markdown;charset=utf-8',
          note: 'Ready to paste into Claude, ChatGPT, Gemini or Cursor'
        };
      }
      if (tab === 'android') {
        var fileName = activeAndroidFile ? activeAndroidFile.split('/').pop() : 'MainActivity.kt';
        var sum = S.Android ? S.Android.summary() : { screens: pageCount, blocks: blockCount, fonts: [], icons: [] };
        return {
          title: 'Android Studio Project (Jetpack Compose)',
          sub: 'Native Kotlin + Jetpack Compose Material 3 implementation with VectorDrawables and Unidirectional Data Flow.',
          copy: 'Copy File Code',
          download: 'Download ' + fileName,
          filename: fileName,
          mime: 'text/plain;charset=utf-8',
          note: sum.screens + ' screen(s) · ' + sum.blocks + ' blocks · ' +
            (currentAndroidFiles ? currentAndroidFiles.length : 0) + ' files · ZIP project available'
        };
      }
      return {
        title: 'Export ' + target.label.toLowerCase(),
        sub: d.target === 'web'
          ? 'One standalone HTML page. Drop it on any static host, or open it locally.'
          : d.target === 'ext'
            ? 'One standalone popup page. Open it in a browser to test the extension UI.'
            : 'One standalone HTML file. Open it on your phone to test the fonts for real.',
        copy: 'Copy HTML',
        download: 'Download .html',
        filename: target.file,
        mime: 'text/html;charset=utf-8',
        note: (lastCode.length / 1024).toFixed(1) + ' KB · ' + blockCount + ' blocks · ' +
          (pageCount > 1 ? pageCount + ' screens · ' : '') + target.label + ' · ' +
          d.theme.fonts.ui + ' / ' + d.theme.fonts.display
      };
    },

    setButton: function (button, icon, label) {
      if (!button) return;
      var mi = button.querySelector('.mi');
      var text = button.querySelector('span:not(.mi)');
      if (mi) mi.textContent = icon;
      if (text) text.textContent = label;
    },

    updateAndroidState: function () {
      var d = S.State.data;
      var appNameInput = document.getElementById('export-app-name');
      var pkgNameInput = document.getElementById('export-package-name');
      var minSdkSelect = document.getElementById('export-min-sdk');
      var filePicker = document.getElementById('export-file-picker');
      var banner = document.getElementById('export-validation-banner');

      var appName = (appNameInput && appNameInput.value) || 'Droid Lab';
      var packageName = (pkgNameInput && pkgNameInput.value) || 'com.example.droidlab';
      var minSdk = (minSdkSelect && minSdkSelect.value) || '26';

      var exporter = S.exporters && S.exporters.android && S.exporters.android.AndroidExporter;
      if (!exporter) return;

      var validation = exporter.validate(d);
      if (banner) {
        banner.className = 'export-validation-banner' + (validation.warnings.length ? ' has-warnings' : '');
        banner.innerHTML = '<span class="mi">' + (validation.warnings.length ? 'warning' : 'check_circle') + '</span> ' +
          '<strong>' + (validation.warnings.length ? 'Validation Note' : 'Ready for Android Studio') + '</strong> — ' +
          validation.stats.blocks + ' blocks mapped, ' + validation.stats.drawables + ' vector drawables, Material 3 Jetpack Compose.';
      }

      currentAndroidFiles = exporter.generateProject({
        data: d,
        appName: appName,
        packageName: packageName,
        minSdk: Number(minSdk),
        targetSdk: 34
      });

      if (filePicker) {
        var currentSelection = filePicker.value || activeAndroidFile;
        filePicker.innerHTML = '';
        currentAndroidFiles.forEach(function (f) {
          var opt = document.createElement('option');
          opt.value = f.path;
          opt.textContent = f.path;
          filePicker.appendChild(opt);
        });
        if (currentSelection && currentAndroidFiles.some(function (f) { return f.path === currentSelection; })) {
          filePicker.value = currentSelection;
          activeAndroidFile = currentSelection;
        } else if (currentAndroidFiles.length) {
          filePicker.value = currentAndroidFiles[0].path;
          activeAndroidFile = currentAndroidFiles[0].path;
        }
      }

      var code = document.getElementById('export-code');
      if (code) {
        var f = currentAndroidFiles.filter(function (item) { return item.path === activeAndroidFile; })[0];
        code.value = f ? f.content : (currentAndroidFiles[0] ? currentAndroidFiles[0].content : '');
      }

      var meta = this.meta('android');
      var note = document.getElementById('export-note');
      if (note) note.textContent = meta.note;
      this.setButton(document.getElementById('export-copy'), 'content_copy', meta.copy);
      this.setButton(document.getElementById('export-download'), 'download', meta.download);
    },

    selectAndroidFile: function (path) {
      activeAndroidFile = path;
      var code = document.getElementById('export-code');
      if (code && currentAndroidFiles) {
        var f = currentAndroidFiles.filter(function (item) { return item.path === path; })[0];
        if (f) code.value = f.content;
      }
      var meta = this.meta('android');
      var note = document.getElementById('export-note');
      if (note) note.textContent = meta.note;
      this.setButton(document.getElementById('export-copy'), 'content_copy', meta.copy);
      this.setButton(document.getElementById('export-download'), 'download', meta.download);
    },

    exportZip: function () {
      var appNameInput = document.getElementById('export-app-name');
      var pkgNameInput = document.getElementById('export-package-name');
      var minSdkSelect = document.getElementById('export-min-sdk');

      var appName = (appNameInput && appNameInput.value) || 'Droid Lab';
      var packageName = (pkgNameInput && pkgNameInput.value) || 'com.example.droidlab';
      var minSdk = (minSdkSelect && minSdkSelect.value) || '26';

      var exporter = S.exporters && S.exporters.android && S.exporters.android.AndroidExporter;
      if (exporter) {
        exporter.exportZip({
          data: S.State.data,
          appName: appName,
          packageName: packageName,
          minSdk: Number(minSdk),
          targetSdk: 34
        });
      }
    },

    setTab: function (tab) {
      if (TABS.indexOf(tab) === -1) tab = 'html';
      activeTab = tab;

      if (tab === 'html') lastCode = this.build();
      var code = document.getElementById('export-code');
      var note = document.getElementById('export-note');
      var title = document.getElementById('export-title');
      var sub = document.getElementById('export-sub');
      var androidBar = document.getElementById('export-android-bar');
      var validationBanner = document.getElementById('export-validation-banner');
      var zipBtn = document.getElementById('export-zip');

      if (tab === 'android') {
        if (androidBar) androidBar.hidden = false;
        if (validationBanner) validationBanner.hidden = false;
        if (zipBtn) zipBtn.hidden = false;
        this.updateAndroidState();
      } else {
        if (androidBar) androidBar.hidden = true;
        if (validationBanner) validationBanner.hidden = true;
        if (zipBtn) zipBtn.hidden = true;
        if (code) code.value = this.content(tab);
      }

      var meta = this.meta(tab);
      if (title) title.textContent = meta.title;
      if (sub) sub.textContent = meta.sub;
      if (note) note.textContent = meta.note;

      Array.prototype.forEach.call(document.querySelectorAll('#export-modal .mtab'), function (btn) {
        var on = btn.getAttribute('data-mtab') === tab;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        btn.tabIndex = on ? 0 : -1;
      });

      this.setButton(document.getElementById('export-copy'), 'content_copy', meta.copy);
      this.setButton(document.getElementById('export-download'), 'download', meta.download);
    },

    open: function (tab) {
      var modal = document.getElementById('export-modal');
      if (!modal) return;
      this.setTab(tab || 'html');
      modal.hidden = false;
    },

    close: function () {
      var modal = document.getElementById('export-modal');
      if (modal) modal.hidden = true;
    },

    copy: function () {
      var code = document.getElementById('export-code');
      if (!code) return;
      var text = code.value;
      var meta = this.meta(activeTab);
      var label = meta.copy ? meta.copy + 'ed' : 'Copied';
      var done = function () { U.toast(label); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(code, label); });
      } else {
        fallbackCopy(code, label);
      }
    },

    download: function () {
      var text = document.getElementById('export-code');
      var content = text ? text.value : this.content(activeTab);
      if (activeTab === 'html' && !content) { content = this.build(); lastCode = content; }
      var meta = this.meta(activeTab);
      var blob = new Blob([content], { type: meta.mime });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = meta.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      U.toast('Downloaded ' + meta.filename);
    }
  };

/* Serialised into the exported file. Must not depend on Studio. */
  function runtime() {
    var RECENT = 'droidlab.ui.recent';

    function all(sel, root) {
      return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    }
    function esc(v) {
      return String(v == null ? '' : v).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    }
    function readRecent() {
      try {
        var list = JSON.parse(localStorage.getItem(RECENT) || '[]');
        return Array.isArray(list) ? list.slice(0, 6) : [];
      } catch (err) { return []; }
    }
    function saveRecent(query) {
      query = String(query || '').trim();
      if (!query) return;
      var list = readRecent().filter(function (q) { return q.toLowerCase() !== query.toLowerCase(); });
      list.unshift(query);
      try { localStorage.setItem(RECENT, JSON.stringify(list.slice(0, 6))); } catch (err) { /* private mode */ }
    }
    function closeAll() {
      all('.ui-scrim,.ui-drawer,.ui-menu,.ui-search').forEach(function (el) {
        el.classList.remove('open');
        if (el.hasAttribute('aria-hidden')) el.setAttribute('aria-hidden', 'true');
      });
      all('.ui-menu').forEach(function (el) { el.style.top = ''; el.style.right = ''; });
    }
    function pages() {
      return all('.export-stage .screen-page');
    }
    function showPage(index) {
      var list = pages();
      if (!list.length) return;
      index = Math.max(0, Math.min(list.length - 1, Number(index) || 0));
      list.forEach(function (page, i) {
        page.classList.toggle('active', i === index);
      });
      all('.nav-item[data-page-index]').forEach(function (btn) {
        var on = Number(btn.getAttribute('data-page-index')) === index;
        btn.classList.toggle('active', on);
        if (on) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
      });
    }
    function pageWithSearch() {
      var list = pages();
      for (var i = 0; i < list.length; i++) {
        if (list[i].querySelector('.search-page')) return i;
      }
      return -1;
    }
    function pageForLabel(label) {
      var needle = String(label || '').trim().toLowerCase();
      var list = pages();
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].getAttribute('data-page-label') || '').trim().toLowerCase() === needle) return i;
      }
      return -1;
    }
    function searchMode() {
      var phone = document.querySelector('.phone');
      return phone && phone.getAttribute('data-search-mode') === 'page' ? 'page' : 'overlay';
    }
    function runSearchPage(box) {
      if (!box) return;
      var input = box.querySelector('.sp-input');
      var q = String((input && input.value) || '').trim().toLowerCase();
      var rows = all('.sp-result', box);
      var shown = 0;
      rows.forEach(function (row) {
        var text = (row.getAttribute('data-sp-text') || row.textContent || '').toLowerCase();
        var hit = !q || text.indexOf(q) > -1;
        row.hidden = !hit;
        if (hit) shown++;
      });
      var empty = box.querySelector('.sp-empty');
      if (empty) empty.hidden = shown > 0;
    }
    function frameOf(el) {
      return el.closest('.phone,.browser,.ext-window,.web-page');
    }
    /* Scroll a horizontal music-card rail by roughly one screenful. */
    function scrollRail(button) {
      if (!button) return;
      var host = button.closest('.listen-now') || button.closest('.cmp');
      var rail = host && host.querySelector('.ln-rail');
      if (!rail) return;
      var direction = button.getAttribute('data-rail') === 'prev' ? -1 : 1;
      var step = Math.max(120, Math.round(rail.clientWidth * 0.8)) * direction;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (rail.scrollBy) {
        rail.scrollBy({ left: step, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        rail.scrollLeft += step;
      }
    }
    function open(type, action) {
      closeAll();
      if (type === 'search' && searchMode() === 'page') {
        var searchTarget = pageWithSearch();
        if (searchTarget > -1) {
          showPage(searchTarget);
          return;
        }
      }
      var frame = frameOf(action);
      if (!frame) return;
      var box = frame.querySelector('.ui-' + type);
      if (!box) return;
      var scrim = frame.querySelector('.ui-scrim');
      if (type === 'menu') {
        var fr = frame.getBoundingClientRect();
        var ar = action.getBoundingClientRect();
        var scale = frame.offsetWidth ? fr.width / frame.offsetWidth : 1;
        box.style.top = Math.round((ar.bottom - fr.top) / scale + 6) + 'px';
        box.style.right = Math.round((fr.right - ar.right) / scale) + 'px';
      }
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
      if (scrim) {
        scrim.classList.add('open');
        scrim.setAttribute('aria-hidden', 'false');
      }
      if (type === 'search') {
        var input = box.querySelector('.ui-search-input');
        if (input) {
          input.value = '';
          renderSearch(box);
          setTimeout(function () { input.focus(); }, 60);
        }
      }
    }
    function searchIndex() {
      var out = all('.ui-drawer-item,.ui-menu-item').map(function (b) {
        var ico = b.querySelector('.ui-ico');
        return {
          label: b.getAttribute('data-ui-label') || '',
          icon: ico ? ico.innerHTML : '',
          list: b.classList.contains('ui-drawer-item') ? 'drawer' : 'menu',
          kind: b.classList.contains('ui-drawer-item') ? 'Drawer' : 'Menu',
          id: b.getAttribute('data-ui-id') || ''
        };
      });
      pages().forEach(function (page, i) {
        out.push({
          label: page.getAttribute('data-page-label') || ('Screen ' + (i + 1)),
          icon: '<span class="mi">web_asset</span>',
          list: 'page',
          kind: 'Screen',
          id: String(i)
        });
      });
      return out;
    }
    function pill(label) {
      return '<button type="button" class="ui-recent-pill" data-ui-recent="' + esc(label) + '">' +
        '<span class="mi">history</span>' + esc(label) + '</button>';
    }
    function renderSearch(box) {
      if (!box) return;
      var input = box.querySelector('.ui-search-input');
      var body = box.querySelector('.ui-search-results');
      if (!body) return;
      var q = String((input && input.value) || '').trim();
      var showRecents = box.getAttribute('data-recents') !== '0';
      var showQuick = box.getAttribute('data-quick') !== '0';
      var guide = box.querySelector('.ui-search-guide');
      if (guide) guide.hidden = !!q;
      if (!q) {
        var recent = showRecents ? readRecent() : [];
        var quick = showQuick ? all('.ui-drawer-item').slice(0, 4) : [];
        var empty = '<p class="ui-search-empty">' +
          esc(box.getAttribute('data-search-hint') || 'Search pages, screens and menu actions.') + '</p>';
        var html = '';
        if (showRecents) {
          html += '<div class="ui-search-label">Recent searches</div>' +
            (recent.length ? '<div class="ui-recent">' + recent.map(pill).join('') + '</div>' : empty);
        }
        if (quick.length) {
          html += '<div class="ui-search-label">Quick links</div><div class="ui-recent">' +
            quick.map(function (b) { return pill(b.getAttribute('data-ui-label') || ''); }).join('') + '</div>';
        }
        body.innerHTML = html || empty;
        return;
      }
      var needle = q.toLowerCase();
      var hits = searchIndex().filter(function (it) {
        return it.label.toLowerCase().indexOf(needle) > -1;
      });
      body.innerHTML = '<div class="ui-search-label">' + hits.length + ' result' +
        (hits.length === 1 ? '' : 's') + ' for “' + esc(q) + '”</div>' +
        (hits.length ? hits.map(function (it) {
          return '<button type="button" class="ui-result" data-ui-result="1" data-ui-list="' + esc(it.list) + '" ' +
            'data-ui-id="' + esc(it.id) + '" data-ui-label="' + esc(it.label) + '">' +
            '<span class="ui-ico">' + it.icon + '</span>' +
            '<span class="ui-result-text"><strong>' + esc(it.label) + '</strong>' +
            '<small>' + esc(it.kind || (it.list === 'drawer' ? 'Drawer' : 'Menu')) + '</small></span>' +
            '<span class="mi">chevron_right</span></button>';
        }).join('') :
          '<p class="ui-search-empty">No matches. Try another word.</p>');
    }

    document.addEventListener('click', function (e) {
      var railBtn = e.target.closest('[data-rail]');
      if (railBtn) {
        e.preventDefault();
        scrollRail(railBtn);
        return;
      }
      var action = e.target.closest('[data-ui-action]');
      if (action) {
        e.preventDefault();
        open(action.getAttribute('data-ui-action'), action);
        return;
      }
      if (e.target.closest('[data-ui-close]') || e.target.closest('.ui-scrim')) {
        e.preventDefault();
        closeAll();
        return;
      }
      var navTab = e.target.closest('.nav-item[data-page-index]');
      if (navTab) {
        e.preventDefault();
        showPage(navTab.getAttribute('data-page-index'));
        return;
      }
      var chip = e.target.closest('[data-ui-chip]');
      if (chip) {
        e.preventDefault();
        var chipBox = chip.closest('.ui-search');
        var chipInput = chipBox && chipBox.querySelector('.ui-search-input');
        if (chipInput) {
          chipInput.value = chip.getAttribute('data-ui-chip');
          all('.ui-chip', chipBox).forEach(function (c) { c.classList.toggle('active', c === chip); });
          renderSearch(chipBox);
          chipInput.focus();
        }
        return;
      }
      var spChip = e.target.closest('[data-sp-chip]');
      if (spChip) {
        e.preventDefault();
        var spBox = spChip.closest('.search-page');
        all('.sp-chip', spBox).forEach(function (c) { c.classList.toggle('active', c === spChip); });
        var spInput = spBox && spBox.querySelector('.sp-input');
        if (spInput) {
          spInput.value = spChip.getAttribute('data-sp-chip');
          if (spInput.value === 'All') spInput.value = '';
          runSearchPage(spBox);
          spInput.focus();
        }
        return;
      }
      var spClear = e.target.closest('[data-sp-clear]');
      if (spClear) {
        e.preventDefault();
        var clearBox = spClear.closest('.search-page');
        var clearInput = clearBox && clearBox.querySelector('.sp-input');
        if (clearInput) {
          clearInput.value = '';
          runSearchPage(clearBox);
          clearInput.focus();
        }
        return;
      }
      var spBack = e.target.closest('.sp-back');
      if (spBack) {
        e.preventDefault();
        var backPage = spBack.closest('.screen-page');
        var backList = pages();
        var backIndex = backList.indexOf(backPage);
        showPage(backIndex > 0 ? backIndex - 1 : (backList.length > 1 ? 1 : 0));
        return;
      }
      var drawerItem = e.target.closest('.ui-drawer-item');
      if (drawerItem) {
        e.preventDefault();
        var id = drawerItem.getAttribute('data-ui-id');
        var drawerLabel = drawerItem.getAttribute('data-ui-label');
        all('.ui-drawer-item').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-ui-id') === id);
        });
        saveRecent(drawerLabel);
        closeAll();
        var drawerPage = pageForLabel(drawerLabel);
        if (drawerPage > -1) showPage(drawerPage);
        return;
      }
      var menuItem = e.target.closest('.ui-menu-item');
      if (menuItem) {
        e.preventDefault();
        saveRecent(menuItem.getAttribute('data-ui-label'));
        closeAll();
        return;
      }
      var result = e.target.closest('[data-ui-result]');
      if (result) {
        e.preventDefault();
        var rid = result.getAttribute('data-ui-id');
        var rlist = result.getAttribute('data-ui-list');
        if (rlist === 'drawer') {
          all('.ui-drawer-item').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-ui-id') === rid);
          });
        }
        saveRecent(result.getAttribute('data-ui-label'));
        closeAll();
        if (rlist === 'page') showPage(rid);
        return;
      }
      var recent = e.target.closest('[data-ui-recent]');
      if (recent) {
        e.preventDefault();
        var box = recent.closest('.ui-search');
        var input = box && box.querySelector('.ui-search-input');
        if (input) {
          input.value = recent.getAttribute('data-ui-recent');
          renderSearch(box);
          input.focus();
        }
        return;
      }
      var clear = e.target.closest('[data-ui-search-clear]');
      if (clear) {
        e.preventDefault();
        var sbox = clear.closest('.ui-search');
        var field = sbox && sbox.querySelector('.ui-search-input');
        if (field) {
          field.value = '';
          renderSearch(sbox);
          field.focus();
        }
      }
    });

    document.addEventListener('input', function (e) {
      if (e.target.classList.contains('sp-input')) {
        runSearchPage(e.target.closest('.search-page'));
        return;
      }
      if (!e.target.classList.contains('ui-search-input')) return;
      renderSearch(e.target.closest('.ui-search'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
      if (e.key === 'Enter' && e.target.classList.contains('ui-search-input')) {
        saveRecent(e.target.value);
      }
    });

    var swipe = null;
    document.addEventListener('pointerdown', function (e) {
      var drawer = e.target.closest('.ui-drawer');
      if (!drawer || !drawer.classList.contains('open')) return;
      swipe = { el: drawer, x: e.clientX, y: e.clientY, dx: 0, active: false };
    });
    document.addEventListener('pointermove', function (e) {
      if (!swipe) return;
      var dx = e.clientX - swipe.x;
      var dy = e.clientY - swipe.y;
      if (!swipe.active) {
        if (Math.abs(dx) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) { swipe = null; return; }
        swipe.active = true;
      }
      if (dx > 0) dx = 0;
      swipe.dx = dx;
      swipe.el.style.transition = 'none';
      swipe.el.style.transform = 'translateX(' + dx + 'px)';
    });
    function endSwipe() {
      if (!swipe) return;
      var el = swipe.el;
      var closed = swipe.dx < -70;
      el.style.transition = '';
      el.style.transform = '';
      swipe = null;
      if (closed) closeAll();
    }
    document.addEventListener('pointerup', endSwipe);
    document.addEventListener('pointercancel', endSwipe);
  }

  function fallbackCopy(code, label) {
    code.focus();
    code.select();
    try {
      document.execCommand('copy');
      U.toast(label || 'Copied');
    } catch (err) {
      U.toast('Select the text and press Ctrl+C');
    }
  }
})();
