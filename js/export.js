/* Builds a standalone, self-contained HTML mockup for the active target. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var lastCode = '';

  var MATERIAL_URL = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
  var PHOSPHOR_URL = 'https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css';

  var Export = S.Export = {
    fontLinks: function () {
      var d = S.State.data;
      var names = [];
      [d.theme.fonts.ui, d.theme.fonts.display].forEach(function (n) {
        if (n && names.indexOf(n) === -1) names.push(n);
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
      var target = d.target || 'app';
      var body = d.screen.filter(function (item) { return !item.hidden; })
        .map(function (item) { return S.Render.componentMarkup(item); }).join('\n');
      var usesMaterial = /class="[^"]*\bmi\b/.test(body);
      var usesPhosphor = /\bph ph-/.test(body);
      var materialLink = usesMaterial ? '<link href="' + MATERIAL_URL + '" rel="stylesheet">' : '';
      var phosphorLink = usesPhosphor ? '<link href="' + PHOSPHOR_URL + '" rel="stylesheet">' : '';
      var tokens = S.Render.tokens(d.theme).replace(/"/g, '&quot;');
      var dark = d.theme.dark ? ' dark' : '';
      var meta = S.targets[target];
      var content;

      if (target === 'web') {
        content = '<div class="web-page" style="' + tokens + '">\n' + body + '\n</div>\n';
      } else if (target === 'ext') {
        content = '<div class="ext-window' + dark + '" style="' + tokens + '">\n' +
          S.Render.extInner(false) + '\n</div>\n';
      } else {
        content = '<div class="phone export-phone' + dark + '" style="' + tokens +
          '--export-w:' + d.device.width + 'px;--export-h:' + d.device.height + 'px">\n' +
          '<div class="phone-screen">\n' +
          (d.device.statusBar ? S.Render.statusBar() + '\n' : '') +
          '<div class="app-screen">\n' + body + '\n</div>\n' +
          (d.device.gestureBar ? S.Render.gestureBar() + '\n' : '') +
          '</div>\n</div>\n';
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
        '</body>\n</html>\n';
    },

    open: function () {
      lastCode = this.build();
      var modal = document.getElementById('export-modal');
      var code = document.getElementById('export-code');
      var note = document.getElementById('export-note');
      if (!modal || !code) return;
      var d = S.State.data;
      var meta = S.targets[d.target || 'app'];

      var title = document.getElementById('export-title');
      var sub = document.getElementById('export-sub');
      if (title) title.textContent = 'Export ' + meta.label.toLowerCase();
      if (sub) {
        sub.textContent = d.target === 'web'
          ? 'One standalone HTML page. Drop it on any static host, or open it locally.'
          : d.target === 'ext'
            ? 'One standalone popup page. Open it in a browser to test the extension UI.'
            : 'One standalone HTML file. Open it on your phone to test the fonts for real.';
      }

      code.value = lastCode;
      if (note) {
        note.textContent = (lastCode.length / 1024).toFixed(1) + ' KB · ' +
          d.screen.length + ' blocks · ' + meta.label + ' · ' +
          d.theme.fonts.ui + ' / ' + d.theme.fonts.display;
      }
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
      var done = function () { U.toast('HTML copied'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(code); });
      } else {
        fallbackCopy(code);
      }
    },

    download: function () {
      if (!lastCode) lastCode = this.build();
      var d = S.State.data;
      var meta = S.targets[d.target || 'app'];
      var blob = new Blob([lastCode], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = meta.file;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      U.toast('Downloaded ' + meta.file);
    }
  };

  function fallbackCopy(code) {
    code.focus();
    code.select();
    try {
      document.execCommand('copy');
      U.toast('HTML copied');
    } catch (err) {
      U.toast('Select the text and press Ctrl+C');
    }
  }
})();
