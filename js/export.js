/* Builds a standalone, self-contained HTML mockup for the active target. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;
  var lastCode = '';

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
          '<div class="phone-screen">\n' +
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

    /* Same drawer / menu / search behaviour, minified into the exported page. */
    runtime: function () {
      return '<script>\n(' + runtime.toString() + ')();\n</script>';
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
        var pageCount = d.target === 'app' && Array.isArray(d.pages) ? d.pages.length : 1;
        var blockCount = d.target === 'app' && Array.isArray(d.pages)
          ? d.pages.reduce(function (n, page) { return n + (page.screen || []).length; }, 0)
          : d.screen.length;
        note.textContent = (lastCode.length / 1024).toFixed(1) + ' KB · ' +
          blockCount + ' blocks · ' + (pageCount > 1 ? pageCount + ' screens · ' : '') +
          meta.label + ' · ' + d.theme.fonts.ui + ' / ' + d.theme.fonts.display;
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
      if (!q) {
        var recent = readRecent();
        body.innerHTML = '<div class="ui-search-label">Recent searches</div>' +
          (recent.length ?
            '<div class="ui-recent">' + recent.map(pill).join('') + '</div>' :
            '<p class="ui-search-empty">' +
            esc(box.getAttribute('data-search-hint') || 'Search pages, screens and menu actions.') + '</p>');
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
