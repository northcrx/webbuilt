/* Phase B — make the phone/browser preview feel real:
   hamburger drawer, anchored three-dot menu and the search screen. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  var RECENT_KEY = 'droidlab.ui.recent';
  var current = { type: null, frame: null };
  var swipe = null;

  function readRecent() {
    try {
      var list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      return Array.isArray(list) ? list.slice(0, 6) : [];
    } catch (err) {
      return [];
    }
  }

  function saveRecent(query) {
    query = String(query || '').trim();
    if (!query) return;
    var list = readRecent().filter(function (q) {
      return q.toLowerCase() !== query.toLowerCase();
    });
    list.unshift(query);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6))); } catch (err) { /* private mode */ }
  }

  function closeAll() {
    document.querySelectorAll('.mock-frame .ui-scrim, .mock-frame .ui-drawer, .mock-frame .ui-menu, .mock-frame .ui-search').forEach(function (el) {
      el.classList.remove('open');
      if (el.hasAttribute('aria-hidden')) el.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.mock-frame .ui-menu').forEach(function (el) {
      el.style.top = '';
      el.style.right = '';
    });
    current = { type: null, frame: null };
  }

  function positionMenu(box, frame, action) {
    var fr = frame.getBoundingClientRect();
    var ar = action.getBoundingClientRect();
    var scale = frame.offsetWidth ? fr.width / frame.offsetWidth : 1;
    box.style.top = Math.round((ar.bottom - fr.top) / scale + 6) + 'px';
    box.style.right = Math.round((fr.right - ar.right) / scale) + 'px';
  }

  function open(type, frame, action) {
    closeAll();
    var box = frame.querySelector('.ui-' + type);
    if (!box) return;
    var scrim = frame.querySelector('.ui-scrim');

    if (type === 'menu' && action) positionMenu(box, frame, action);
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    if (scrim) {
      scrim.classList.add('open');
      scrim.setAttribute('aria-hidden', 'false');
    }
    current = { type: type, frame: frame };

    if (type === 'search') {
      var input = box.querySelector('.ui-search-input');
      if (input) {
        input.value = '';
        renderSearch(box);
        setTimeout(function () { input.focus(); }, 40);
      }
    } else {
      var first = box.querySelector('button');
      if (first) setTimeout(function () { try { first.focus(); } catch (err) { /* noop */ } }, 40);
    }
  }

  function navItems() {
    var d = S.State.data;
    var ui = d.ui || S.defaultUI();
    var out = [];
    (ui.drawer.items || []).forEach(function (it) {
      out.push({ list: 'drawer', id: it.id, label: it.label, icon: it.icon, kind: 'Drawer' });
    });
    (ui.menu.items || []).forEach(function (it) {
      out.push({ list: 'menu', id: it.id, label: it.label, icon: it.icon, kind: 'Menu' });
    });
    pages().forEach(function (page, index) {
      out.push({ list: 'page', id: String(index), label: page.name, icon: page.icon || 'msr:web_asset', kind: 'Screen' });
    });
    (d.screen || []).forEach(function (block) {
      var def = S.components[block.type];
      if (!def) return;
      out.push({ list: 'block', id: block.id, label: def.label, icon: def.icon, kind: 'Block' });
    });
    return out;
  }

  function pages() {
    var d = S.State.data;
    return d.target === 'app' && Array.isArray(d.pages) ? d.pages : [];
  }

  function switchToPage(index) {
    if (!pages()[index]) return false;
    var changed = S.State.switchPageIndex(index);
    if (S.App) S.App.select(null);
    return changed;
  }

  function pageForLabel(label) {
    var needle = String(label || '').trim().toLowerCase();
    var list = pages();
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].name || '').trim().toLowerCase() === needle) return i;
    }
    return -1;
  }

  function pageWithSearch() {
    var list = pages();
    for (var i = 0; i < list.length; i++) {
      var found = (list[i].screen || []).some(function (block) {
        return block.type === 'searchpage';
      });
      if (found) return i;
    }
    return -1;
  }

  /* Filter the results inside an embedded search page block. */
  function runSearchPage(box) {
    if (!box) return;
    var input = box.querySelector('.sp-input');
    var q = String((input && input.value) || '').trim().toLowerCase();
    var rows = box.querySelectorAll('.sp-result');
    var shown = 0;
    Array.prototype.forEach.call(rows, function (row) {
      var text = (row.getAttribute('data-sp-text') || row.textContent || '').toLowerCase();
      var hit = !q || text.indexOf(q) > -1;
      row.hidden = !hit;
      if (hit) shown++;
    });
    var empty = box.querySelector('.sp-empty');
    if (empty) empty.hidden = shown > 0;
  }

  function resultRow(it) {
    return '<button type="button" class="ui-result" data-ui-result="1" data-ui-list="' + esc(it.list) + '" ' +
      'data-ui-id="' + esc(it.id || '') + '" data-ui-label="' + esc(it.label) + '">' +
      '<span class="ui-ico">' + S.icon(it.icon) + '</span>' +
      '<span class="ui-result-text"><strong>' + esc(it.label) + '</strong><small>' + esc(it.kind) + '</small></span>' +
      '<span class="mi">chevron_right</span></button>';
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
    var ui = S.State.data.ui || S.defaultUI();

    if (!q) {
      var recent = readRecent();
      var quick = (ui.drawer.items || []).slice(0, 4);
      var html = '<div class="ui-search-label">Recent searches</div>' +
        (recent.length ? '<div class="ui-recent">' + recent.map(pill).join('') + '</div>' :
          '<p class="ui-search-empty">' + esc(ui.search && ui.search.hint || 'Search screens, blocks and menu actions.') + '</p>');
      if (quick.length) {
        html += '<div class="ui-search-label">Quick links</div><div class="ui-recent">' +
          quick.map(function (it) { return pill(it.label); }).join('') + '</div>';
      }
      body.innerHTML = html;
      return;
    }

    var needle = q.toLowerCase();
    var hits = navItems().filter(function (it) {
      return it.label.toLowerCase().indexOf(needle) > -1 || it.kind.toLowerCase().indexOf(needle) > -1;
    });
    body.innerHTML = '<div class="ui-search-label">' + hits.length + ' result' + (hits.length === 1 ? '' : 's') +
      ' for “' + esc(q) + '”</div>' +
      (hits.length ? hits.map(resultRow).join('') :
        '<p class="ui-search-empty">No matches. Try “Home”, “Settings” or “Hero”.</p>');
  }

  function handlerClick(e) {
    var action = e.target.closest('[data-ui-action]');
    if (action) {
      var frame = action.closest('.mock-frame');
      if (!frame) return;
      e.preventDefault();
      e.stopPropagation();
      var type = action.getAttribute('data-ui-action');
      if (type === 'search') {
        var ui = S.State.data.ui || S.defaultUI();
        if (ui.search && ui.search.mode === 'page') {
          var searchPage = pageWithSearch();
          if (searchPage > -1) {
            closeAll();
            switchToPage(searchPage);
            return;
          }
        }
      }
      if (type === 'drawer' || type === 'menu' || type === 'search') open(type, frame, action);
      return;
    }

    if (e.target.closest('[data-ui-close]') || e.target.closest('.ui-scrim')) {
      e.preventDefault();
      e.stopPropagation();
      closeAll();
      return;
    }

    /* Bottom-navigation tabs open the matching screen for editing. */
    var navTab = e.target.closest('.nav-item[data-page-index]');
    if (navTab) {
      e.preventDefault();
      e.stopPropagation();
      var navIndex = Number(navTab.getAttribute('data-page-index'));
      if (S.State.data.target === 'app') switchToPage(navIndex);
      return;
    }

    var chip = e.target.closest('[data-ui-chip]');
    if (chip) {
      e.preventDefault();
      e.stopPropagation();
      var chipBox = chip.closest('.ui-search');
      var chipInput = chipBox && chipBox.querySelector('.ui-search-input');
      if (chipInput) {
        chipInput.value = chip.getAttribute('data-ui-chip');
        Array.prototype.forEach.call(chipBox.querySelectorAll('.ui-chip'), function (c) {
          c.classList.toggle('active', c === chip);
        });
        renderSearch(chipBox);
        chipInput.focus();
      }
      return;
    }

    var spChip = e.target.closest('[data-sp-chip]');
    if (spChip) {
      e.preventDefault();
      e.stopPropagation();
      var spBox = spChip.closest('.search-page');
      Array.prototype.forEach.call(spBox.querySelectorAll('.sp-chip'), function (c) {
        c.classList.toggle('active', c === spChip);
      });
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
      e.stopPropagation();
      var clearBox = spClear.closest('.search-page');
      var clearInput = clearBox && clearBox.querySelector('.sp-input');
      if (clearInput) {
        clearInput.value = '';
        runSearchPage(clearBox);
        clearInput.focus();
      }
      return;
    }

    /* Search page back arrow returns to the previous screen. */
    var spBack = e.target.closest('.sp-back');
    if (spBack) {
      e.preventDefault();
      e.stopPropagation();
      var backList = pages();
      var currentIndex = backList.map(function (p) { return p.id; }).indexOf(S.State.data.activePageId);
      var backTarget = currentIndex > 0 ? currentIndex - 1 : (backList.length > 1 ? 1 : 0);
      if (backList.length) switchToPage(backTarget);
      return;
    }

    var drawerItem = e.target.closest('.ui-drawer-item');
    if (drawerItem) {
      e.preventDefault();
      e.stopPropagation();
      var id = drawerItem.getAttribute('data-ui-id');
      var label = drawerItem.getAttribute('data-ui-label');
      closeAll();
      var d = S.State.data;
      var ui = d.ui || S.defaultUI();
      (ui.drawer.items || []).forEach(function (it) { it.active = it.id === id; });
      S.State.commit('ui:active');
      S.Render.drawScreen();
      S.Inspector.render();
      var drawerTarget = pageForLabel(label);
      if (drawerTarget > -1) switchToPage(drawerTarget);
      U.toast('Opened ' + label);
      return;
    }

    var menuItem = e.target.closest('.ui-menu-item');
    if (menuItem) {
      e.preventDefault();
      e.stopPropagation();
      var menuLabel = menuItem.getAttribute('data-ui-label');
      saveRecent(menuLabel);
      closeAll();
      U.toast(menuLabel);
      return;
    }

    var result = e.target.closest('[data-ui-result]');
    if (result) {
      e.preventDefault();
      e.stopPropagation();
      pickResult(result);
      return;
    }

    var recent = e.target.closest('[data-ui-recent]');
    if (recent) {
      e.preventDefault();
      e.stopPropagation();
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
      e.stopPropagation();
      var searchBox = clear.closest('.ui-search');
      var field = searchBox && searchBox.querySelector('.ui-search-input');
      if (field) {
        field.value = '';
        renderSearch(searchBox);
        field.focus();
      }
    }
  }

  function pickResult(result) {
    var label = result.getAttribute('data-ui-label');
    var list = result.getAttribute('data-ui-list');
    var id = result.getAttribute('data-ui-id');
    saveRecent(label);

    if (list === 'block' && id) {
      closeAll();
      if (S.App) S.App.select(id);
      U.toast('Selected ' + label);
      return;
    }

    if (list === 'page') {
      closeAll();
      switchToPage(Number(id));
      U.toast('Editing ' + label);
      return;
    }

    if (list === 'drawer' && id) {
      closeAll();
      var d = S.State.data;
      var ui = d.ui || S.defaultUI();
      (ui.drawer.items || []).forEach(function (it) { it.active = it.id === id; });
      S.State.commit('ui:active');
      S.Render.drawScreen();
      S.Inspector.render();
      var drawerTarget = pageForLabel(label);
      if (drawerTarget > -1) switchToPage(drawerTarget);
      U.toast('Opened ' + label);
      return;
    }

    closeAll();
    U.toast(label);
  }

  var Interactions = S.Interactions = {

    init: function () {
      var stage = document.getElementById('stage');
      if (!stage || stage.dataset.uiBound) return;
      stage.dataset.uiBound = '1';

      stage.addEventListener('click', handlerClick, true);

      stage.addEventListener('input', function (e) {
        if (e.target.classList.contains('sp-input')) {
          runSearchPage(e.target.closest('.search-page'));
          return;
        }
        if (!e.target.classList.contains('ui-search-input')) return;
        renderSearch(e.target.closest('.ui-search'));
      });

      stage.addEventListener('keydown', function (e) {
        if (!e.target.classList.contains('ui-search-input')) return;
        if (e.key !== 'Enter') return;
        e.preventDefault();
        saveRecent(e.target.value);
      });

      /* Swipe the drawer closed. Vertical movement is left alone for scroll. */
      stage.addEventListener('pointerdown', function (e) {
        var drawer = e.target.closest('.ui-drawer');
        if (!drawer || !drawer.classList.contains('open')) return;
        swipe = { el: drawer, x: e.clientX, y: e.clientY, dx: 0, active: false };
      });

      stage.addEventListener('pointermove', function (e) {
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

      stage.addEventListener('pointerup', endSwipe);
      stage.addEventListener('pointercancel', endSwipe);

      /* Esc closes any overlay before other editor shortcuts react. */
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !current.type) return;
        e.preventDefault();
        e.stopPropagation();
        closeAll();
      }, true);
    },

    afterRender: function () {
      if (current.frame && !document.contains(current.frame)) closeAll();
    },

    closeAll: closeAll
  };
})();
