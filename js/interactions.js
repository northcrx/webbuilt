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

    
  /* Material 3 Motion Transitions & Page Router */
  function transitionToPage(targetIdOrNameOrIndex, transitionType) {
    transitionType = transitionType || 'slide';
    var d = S.State.data;
    var list = pages();
    var targetIndex = -1;

    // Check if target matches index number
    if (typeof targetIdOrNameOrIndex === 'number' && list[targetIdOrNameOrIndex]) {
      targetIndex = targetIdOrNameOrIndex;
    } else {
      var needle = String(targetIdOrNameOrIndex || '').trim().toLowerCase();
      // Match by ID
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === targetIdOrNameOrIndex) { targetIndex = i; break; }
      }
      // Match by Name / Slug
      if (targetIndex < 0) {
        for (var j = 0; j < list.length; j++) {
          var pName = String(list[j].name || '').trim().toLowerCase();
          if (pName === needle || (needle === 'settings' && /setting/i.test(pName))) {
            targetIndex = j;
            break;
          }
        }
      }
    }

    if (targetIndex < 0) {
      openNavPrompt(targetIdOrNameOrIndex);
      return false;
    }

    closeAll();
    var screenEl = document.querySelector('.mock-frame .app-screen');
    if (!screenEl) {
      switchToPage(targetIndex);
      return true;
    }

    screenEl.classList.add('nav-trans-exit', 'trans-' + transitionType);
    setTimeout(function () {
      switchToPage(targetIndex);
      var newScreen = document.querySelector('.mock-frame .app-screen');
      if (newScreen) {
        newScreen.classList.add('nav-trans-enter', 'trans-' + transitionType);
        setTimeout(function () {
          newScreen.classList.remove('nav-trans-enter', 'trans-' + transitionType);
        }, 320);
      }
    }, 120);

    return true;
  }

  function openNavPrompt(targetName) {
    var promptEl = document.querySelector('.mock-frame .ui-nav-prompt');
    if (!promptEl) return;
    var nameSpan = promptEl.querySelector('.unp-target-name');
    if (nameSpan) nameSpan.textContent = targetName || 'Settings';
    closeAll();
    promptEl.classList.add('open');
    promptEl.setAttribute('aria-hidden', 'false');
    current = { type: 'nav-prompt', frame: promptEl.closest('.mock-frame') };
  }

  function closeNavPrompt() {
    var promptEl = document.querySelector('.mock-frame .ui-nav-prompt');
    if (promptEl) {
      promptEl.classList.remove('open');
      promptEl.setAttribute('aria-hidden', 'true');
    }
    if (current.type === 'nav-prompt') {
      current = { type: null, frame: null };
    }
  }

  function createRipple(e, targetEl) {
    if (!targetEl) return;
    var rect = targetEl.getBoundingClientRect();
    var circle = document.createElement('span');
    var diameter = Math.max(rect.width, rect.height);
    var radius = diameter / 2;
    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (e.clientX - rect.left - radius) + 'px';
    circle.style.top = (e.clientY - rect.top - radius) + 'px';
    circle.classList.add('m3-ripple');
    targetEl.style.position = targetEl.style.position || 'relative';
    targetEl.appendChild(circle);
    setTimeout(function () { try { circle.remove(); } catch (err) {} }, 450);
  }

  var currentModalView = 'nowplaying';

  function updateCustomTimerDial(minVal) {
    var modal = document.querySelector('.mock-frame .ui-player-modal');
    if (!modal) return;
    var dial = modal.querySelector('.mp-clock-dial');
    if (!dial) return;
    var cDeg = Math.round((minVal % 60) * 6);
    if (cDeg === 0) cDeg = 360;
    var rad = (cDeg - 90) * Math.PI / 180;
    var cx = 75, cy = 75, r = 52;
    var hx = Math.round(cx + r * Math.cos(rad));
    var hy = Math.round(cy + r * Math.sin(rad));
    var circ = 2 * Math.PI * r;
    var pct = Math.min(1, minVal / 60);
    var arcOffset = (circ * (1 - pct)).toFixed(1);

    var arc = dial.querySelector('.mp-clock-arc');
    if (arc) {
      arc.classList.add('is-active');
      arc.setAttribute('stroke-dashoffset', arcOffset);
    }
    var hand = dial.querySelector('.mp-clock-hand');
    if (hand) {
      hand.setAttribute('x2', hx);
      hand.setAttribute('y2', hy);
    }
    var pointer = dial.querySelector('.mp-clock-pointer');
    if (pointer) {
      pointer.setAttribute('cx', hx);
      pointer.setAttribute('cy', hy);
    }
    var valEl = dial.querySelector('.mp-clock-val');
    var minStr = minVal < 10 ? '0' + minVal : '' + minVal;
    if (valEl) valEl.textContent = minStr + ':00';
    var lblEl = dial.querySelector('.mp-clock-lbl');
    if (lblEl) lblEl.textContent = minVal >= 60 ? (Math.floor(minVal / 60) + 'h ' + (minVal % 60 ? (minVal % 60) + 'm' : '')) : 'MINS';
    var startBtnSpan = modal.querySelector('.mp-timer-start-btn span');
    if (startBtnSpan) startBtnSpan.textContent = 'Start Sleep Timer (' + minVal + 'm)';
    var activeTimerVal = modal.querySelector('.mp-active-timer-val');
    if (activeTimerVal) activeTimerVal.textContent = minVal + 'm';
  }

  function openPlayerModal(explicitStyle, initialView) {
    var modal = document.querySelector('.mock-frame .ui-player-modal');
    if (!modal) return;
    if (explicitStyle) {
      modal.setAttribute('data-style', explicitStyle);
    }
    var viewToUse = initialView || currentModalView || 'nowplaying';
    currentModalView = viewToUse;
    modal.setAttribute('data-active-view', viewToUse);
    modal.querySelectorAll('.ui-pm-view').forEach(function (v) {
      v.classList.toggle('is-active', v.getAttribute('data-view-id') === viewToUse);
    });
    closeAll();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    current = { type: 'player-modal', frame: modal.closest('.mock-frame') };
  }

  function closePlayerModal() {
    var modal = document.querySelector('.mock-frame .ui-player-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    currentModalView = 'nowplaying';
    if (current.type === 'player-modal') {
      current = { type: null, frame: null };
    }
  }

  function closeAll() {
    document.querySelectorAll('.mock-frame .ui-scrim, .mock-frame .ui-drawer, .mock-frame .ui-menu, .mock-frame .ui-search, .mock-frame .ui-player-modal, .mock-frame .ui-nav-prompt').forEach(function (el) {
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
    // If user clicked 'Home' in drawer/menu and no screen is named 'Home', navigate to screen 0
    if ((needle === 'home' || needle === 'discover' || needle === 'main') && list.length > 0) {
      return 0;
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
    var showRecents = box.getAttribute('data-recents') !== '0';
    var showQuick = box.getAttribute('data-quick') !== '0';
    var hint = esc(ui.search && ui.search.hint || 'Search screens, blocks and menu actions.');
    var guide = box.querySelector('.ui-search-guide');
    if (guide) guide.hidden = !!q;

    if (!q) {
      var recent = showRecents ? readRecent() : [];
      var quick = showQuick ? (ui.drawer.items || []).slice(0, 4) : [];
      var html = '';

      if (showRecents) {
        html += '<div class="ui-search-label">Recent searches</div>' +
          (recent.length ? '<div class="ui-recent">' + recent.map(pill).join('') + '</div>' :
            '<p class="ui-search-empty">' + hint + '</p>');
      }
      if (quick.length) {
        html += '<div class="ui-search-label">Quick links</div><div class="ui-recent">' +
          quick.map(function (it) { return pill(it.label); }).join('') + '</div>';
      }
      if (!html) {
        html = '<p class="ui-search-empty">' + hint + '</p>';
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

    /* Navigation prompt modal actions */
    if (e.target.closest('[data-unp-close]')) {
      e.preventDefault();
      e.stopPropagation();
      closeNavPrompt();
      return;
    }

    if (e.target.closest('[data-unp-action="create-settings"]')) {
      e.preventDefault();
      e.stopPropagation();
      closeNavPrompt();
      if (S.createSettingsScreen) {
        var sPage = S.createSettingsScreen();
        var d = S.State.data;
        var sIndex = d.pages.indexOf(sPage);
        transitionToPage(sIndex > -1 ? sIndex : d.pages.length - 1, 'slide');
        U.toast('Created & opened Settings screen');
      }
      return;
    }

    if (e.target.closest('[data-unp-action="create-page"]')) {
      e.preventDefault();
      e.stopPropagation();
      closeNavPrompt();
      var bPage = S.State.addPage();
      var d = S.State.data;
      var bIndex = d.pages.indexOf(bPage);
      transitionToPage(bIndex > -1 ? bIndex : d.pages.length - 1, 'slide');
      U.toast('Created & opened new screen');
      return;
    }

    var unpPill = e.target.closest('[data-unp-pill]');
    if (unpPill) {
      e.preventDefault();
      e.stopPropagation();
      closeNavPrompt();
      var pIndex = Number(unpPill.getAttribute('data-unp-pill'));
      transitionToPage(pIndex, 'slide');
      return;
    }

    /* Screen navigation links with animated transitions */
    var navEl = e.target.closest('[data-nav-target]');
    if (navEl) {
      e.preventDefault();
      e.stopPropagation();
      createRipple(e, navEl);
      var target = navEl.getAttribute('data-nav-target');
      var transType = navEl.getAttribute('data-transition') || 'slide';
      if (target === 'back') {
        var pList = pages();
        var cIdx = pList.map(function (p) { return p.id; }).indexOf(S.State.data.activePageId);
        var prevIdx = cIdx > 0 ? cIdx - 1 : 0;
        transitionToPage(prevIdx, 'slide');
        return;
      }
      transitionToPage(target, transType);
      return;
    }

    /* Drawer item click: transition with animation */
    var drawerItem = e.target.closest('.ui-drawer-item');
    if (drawerItem) {
      e.preventDefault();
      e.stopPropagation();
      var dId = drawerItem.getAttribute('data-ui-id');
      var dLabel = drawerItem.getAttribute('data-ui-label');
      closeAll();
      var d = S.State.data;
      var ui = d.ui || S.defaultUI();
      (ui.drawer.items || []).forEach(function (it) { it.active = it.id === dId; });
      S.State.commit('ui:active');
      S.Render.drawScreen();
      S.Inspector.render();
      var dTarget = pageForLabel(dLabel);
      if (dTarget > -1) {
        transitionToPage(dTarget, 'slide');
      } else if (/setting/i.test(dLabel)) {
        openNavPrompt('Settings');
      } else {
        openNavPrompt(dLabel);
      }
      return;
    }

    // Modular Sleep Timer click in player
    var timerBtn = e.target.closest('[data-mp-timer]');
    if (timerBtn) {
      e.preventDefault();
      e.stopPropagation();
      var tVal = timerBtn.getAttribute('data-mp-timer');
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        mp.props.sleepTimer = tVal;
        S.State.commit('player:timer');
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        if (current.type === 'player-modal') openPlayerModal(null, currentModalView);
        U.toast(tVal === 'off' ? 'Sleep timer turned off' : 'Sleep timer set for ' + tVal);
      }
      return;
    }

    // Modular Equalizer click in player
    var eqBtn = e.target.closest('[data-mp-eq]');
    if (eqBtn) {
      e.preventDefault();
      e.stopPropagation();
      var eqVal = eqBtn.getAttribute('data-mp-eq');
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        mp.props.eqPreset = eqVal;
        var presetCurves = {
          'Flat': [0, 0, 0, 0, 0],
          'Bass Boost': [7, 5, 1, 2, 3],
          'Vocal': [-2, 1, 6, 4, 1],
          'Electronic': [6, 4, 0, 3, 5],
          'Rock': [5, 3, -1, 3, 6],
          'Acoustic': [3, 2, 1, 4, 3],
          'Studio Master': [2, 1, 0, 2, 2]
        };
        if (presetCurves[eqVal]) {
          mp.props.eqBands = presetCurves[eqVal].slice();
        }
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('player:eq');
        U.toast('Equalizer preset: ' + eqVal);
      }
      return;
    }

    // Modular Speed cycle click in player
    var speedBtn = e.target.closest('[data-mp-speed]');
    if (speedBtn) {
      e.preventDefault();
      e.stopPropagation();
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        var speeds = ['1.0x', '1.25x', '1.5x', '2.0x', '0.8x'];
        var cIdx = speeds.indexOf(mp.props.playbackSpeed || '1.0x');
        var nextSp = speeds[(cIdx + 1) % speeds.length];
        mp.props.playbackSpeed = nextSp;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('player:speed');
        U.toast('Playback speed: ' + nextSp);
      }
      return;
    }

    // Direct Disc / Tape Reel spin click to toggle play/pause
    var spinEl = e.target.closest('[data-ui-player-spin]');
    if (spinEl && !e.target.closest('button, input')) {
      e.preventDefault();
      e.stopPropagation();
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        mp.props.playing = !mp.props.playing;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('player:play');
        U.toast(mp.props.playing ? 'Playing' : 'Paused');
      }
      return;
    }

    function getParentBlock(el) {
      var sec = el && el.closest('[data-id]');
      var bId = sec ? sec.getAttribute('data-id') : null;
      return bId ? (S.State.blockById(bId) || (S.App && S.App.blockById && S.App.blockById(bId))) : null;
    }

    // Modular Download Quality click in musicplayer
    var dlqBtn = e.target.closest('[data-mp-dl-quality]');
    if (dlqBtn) {
      e.preventDefault();
      e.stopPropagation();
      var qVal = dlqBtn.getAttribute('data-mp-dl-quality');
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        mp.props.downloadQuality = qVal;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('player:dlquality');
        U.toast('Download format: ' + qVal.toUpperCase());
      }
      return;
    }

    // Modular Download Storage click in musicplayer
    var dlsBtn = e.target.closest('[data-mp-dl-storage]');
    if (dlsBtn) {
      e.preventDefault();
      e.stopPropagation();
      var sVal = dlsBtn.getAttribute('data-mp-dl-storage');
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        mp.props.downloadStorage = sVal;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('player:dlstorage');
        U.toast('Download destination: ' + (sVal === 'internal' ? 'Internal Storage' : 'MicroSD Card'));
      }
      return;
    }

    // Modular Download Action click in musicplayer
    var dlaBtn = e.target.closest('[data-mp-dl-action]');
    if (dlaBtn) {
      e.preventDefault();
      e.stopPropagation();
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        var nextSt = mp.props.downloadStatus === 'downloaded' ? 'idle' : 'downloaded';
        mp.props.downloadStatus = nextSt;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('player:dlaction');
        U.toast(nextSt === 'downloaded' ? 'Downloaded track for offline listening' : 'Removed from offline storage');
      }
      return;
    }

    // DownloadCard quality select
    var dlcQBtn = e.target.closest('[data-dlc-quality]');
    if (dlcQBtn) {
      e.preventDefault();
      e.stopPropagation();
      var dlcBlock = getParentBlock(dlcQBtn);
      if (dlcBlock) {
        var q = dlcQBtn.getAttribute('data-dlc-quality');
        dlcBlock.props.quality = q;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('dlc:quality');
        U.toast('Audio quality set to: ' + q.toUpperCase());
      }
      return;
    }

    // DownloadCard storage select
    var dlcSBtn = e.target.closest('[data-dlc-storage]');
    if (dlcSBtn) {
      e.preventDefault();
      e.stopPropagation();
      var dlcBlock = getParentBlock(dlcSBtn);
      if (dlcBlock) {
        var s = dlcSBtn.getAttribute('data-dlc-storage');
        dlcBlock.props.storage = s;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('dlc:storage');
        U.toast('Storage set to: ' + (s === 'internal' ? 'Internal Storage' : 'MicroSD Card'));
      }
      return;
    }

    // DownloadCard extra toggle
    var dlcTog = e.target.closest('[data-dlc-toggle]');
    if (dlcTog) {
      e.preventDefault();
      e.stopPropagation();
      var dlcBlock = getParentBlock(dlcTog);
      if (dlcBlock) {
        var propMap = { lyrics: 'withLyrics', artwork: 'withArtwork', dolby: 'withDolby' };
        var tKey = propMap[dlcTog.getAttribute('data-dlc-toggle')];
        if (tKey) {
          dlcBlock.props[tKey] = !dlcBlock.props[tKey];
          S.Render.drawScreen();
          if (S.Inspector && S.Inspector.render) S.Inspector.render();
          S.State.commit('dlc:toggle:' + tKey);
          U.toast((dlcBlock.props[tKey] ? 'Included ' : 'Excluded ') + dlcTog.getAttribute('data-dlc-toggle'));
        }
      }
      return;
    }

    // DownloadCard download action
    var dlcAct = e.target.closest('[data-dlc-action]');
    if (dlcAct) {
      e.preventDefault();
      e.stopPropagation();
      var dlcBlock = getParentBlock(dlcAct);
      if (dlcBlock) {
        var nStatus = dlcBlock.props.status === 'downloaded' ? 'idle' : 'downloaded';
        dlcBlock.props.status = nStatus;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('dlc:status');
        U.toast(nStatus === 'downloaded' ? 'Album downloaded offline with lossless audio!' : 'Download cleared');
      }
      return;
    }

    // PlayCard action (play/pause, shuffle, like, download)
    var plcAct = e.target.closest('[data-playcard-action]');
    if (plcAct) {
      e.preventDefault();
      e.stopPropagation();
      var plcBlock = getParentBlock(plcAct);
      if (plcBlock) {
        var act = plcAct.getAttribute('data-playcard-action');
        if (act === 'play') {
          plcBlock.props.playing = !plcBlock.props.playing;
          U.toast(plcBlock.props.playing ? 'Playing ' + (plcBlock.props.title || 'album') : 'Paused');
        } else if (act === 'shuffle') {
          U.toast('Shuffling ' + (plcBlock.props.title || 'album') + ' tracklist');
        } else if (act === 'like') {
          plcBlock.props.liked = !plcBlock.props.liked;
          U.toast(plcBlock.props.liked ? 'Added album to library' : 'Removed from library');
        } else if (act === 'download') {
          U.toast('Opening download options for ' + (plcBlock.props.title || 'album'));
        }
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('plc:action');
      }
      return;
    }

    // MusicListing track click (changes playing track)
    var mlTrk = e.target.closest('[data-listing-track]');
    if (mlTrk && !e.target.closest('.ml-actions')) {
      e.preventDefault();
      e.stopPropagation();
      var mlBlock = getParentBlock(mlTrk);
      if (mlBlock) {
        var idx = Number(mlTrk.getAttribute('data-listing-track')) || 0;
        mlBlock.props.activeTrack = idx;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('ml:activeTrack');
        U.toast('Now Playing Track #' + (idx + 1));
      }
      return;
    }

    // MusicListing like click
    var mlLike = e.target.closest('[data-listing-like]');
    if (mlLike) {
      e.preventDefault();
      e.stopPropagation();
      mlLike.classList.toggle('is-liked');
      U.toast(mlLike.classList.contains('is-liked') ? 'Added to Favourites' : 'Removed from Favourites');
      return;
    }

    // MusicListing download click
    var mlDl = e.target.closest('[data-listing-dl]');
    if (mlDl) {
      e.preventDefault();
      e.stopPropagation();
      U.toast('Track downloaded offline in Lossless FLAC');
      return;
    }

    // MusicListing shuffle all click
    var mlShuf = e.target.closest('[data-listing-action="shuffle-all"]');
    if (mlShuf) {
      e.preventDefault();
      e.stopPropagation();
      var mlBlock = getParentBlock(mlShuf);
      if (mlBlock) {
        var rawLines = String(mlBlock.props.items || '').split('\n').filter(Boolean);
        for (var i = rawLines.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = rawLines[i];
          rawLines[i] = rawLines[j];
          rawLines[j] = temp;
        }
        mlBlock.props.items = rawLines.join('\n');
        mlBlock.props.activeTrack = 0;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('ml:shuffle');
        U.toast('Shuffled playlist tracks');
      }
      return;
    }

    // MusicListing Category View Switcher Tabs ([data-ml-view])
    var mlVtab = e.target.closest('[data-ml-view]');
    if (mlVtab) {
      e.preventDefault();
      e.stopPropagation();
      var targetView = mlVtab.getAttribute('data-ml-view');
      var mlBlock = getParentBlock(mlVtab) || (S.State.data.screen || []).filter(function (b) { return b.type === 'musiclisting'; })[0];
      if (mlBlock) {
        mlBlock.props = mlBlock.props || {};
        mlBlock.props.viewMode = targetView;
        // Sync any tabs block on screen
        var topTabsBlock = (S.State.data.screen || []).filter(function (b) { return b.type === 'tabs' || b.type === 'tabspill'; })[0];
        if (topTabsBlock && topTabsBlock.props) {
          var modeIndices = { songs: 0, albums: 1, artists: 2, beats: 3 };
          if (modeIndices[targetView] != null) {
            topTabsBlock.props.active = modeIndices[targetView];
          }
        }
        S.State.commit('ml:viewMode:' + targetView);
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        U.toast('Switched to ' + targetView.toUpperCase() + ' view');
      }
      return;
    }

    // MusicListing Album Play FAB
    var mlAlbPlay = e.target.closest('[data-listing-album-play]');
    if (mlAlbPlay) {
      e.preventDefault();
      e.stopPropagation();
      var albIdx = Number(mlAlbPlay.getAttribute('data-listing-album-play')) || 0;
      var mlBlock = getParentBlock(mlAlbPlay);
      var albLines = String((mlBlock && mlBlock.props && mlBlock.props.albumItems) || '').split('\n').filter(Boolean);
      var albTitle = 'Album #' + (albIdx + 1);
      if (albLines[albIdx]) {
        albTitle = albLines[albIdx].split('|')[0].trim();
      }
      var mpItem = (S.State.data.screen || []).filter(function (b) { return b.type === 'miniplayer' || b.type === 'musicplayer'; })[0];
      if (mpItem && mpItem.props) {
        mpItem.props.title = albTitle;
        mpItem.props.playing = true;
      }
      S.Render.drawScreen();
      U.toast('Playing album: ' + albTitle);
      return;
    }

    // MusicListing Album Like/Save
    var mlAlbLike = e.target.closest('[data-listing-like-album]');
    if (mlAlbLike) {
      e.preventDefault();
      e.stopPropagation();
      mlAlbLike.classList.toggle('is-liked');
      var isSaved = mlAlbLike.classList.contains('is-liked');
      mlAlbLike.innerHTML = S.icon(isSaved ? 'favorite' : 'favorite_border');
      U.toast(isSaved ? 'Saved album to Library' : 'Removed album from Library');
      return;
    }

    // MusicListing Album Download
    var mlAlbDl = e.target.closest('[data-listing-dl-album]');
    if (mlAlbDl) {
      e.preventDefault();
      e.stopPropagation();
      U.toast('Downloading complete album in Lossless FLAC (48.2 MB)');
      return;
    }

    // MusicListing Artist Follow Toggle
    var mlFollow = e.target.closest('[data-listing-follow]');
    if (mlFollow) {
      e.preventDefault();
      e.stopPropagation();
      createRipple(e, mlFollow);
      mlFollow.classList.toggle('is-following');
      var isFol = mlFollow.classList.contains('is-following');
      mlFollow.innerHTML = '<span class="mi">' + (isFol ? 'check' : 'add') + '</span><span>' + (isFol ? 'Following' : 'Follow') + '</span>';
      U.toast(isFol ? 'Following artist' : 'Unfollowed artist');
      return;
    }

    // MusicListing Beat Play Preview
    var mlBeatPlay = e.target.closest('[data-listing-beat-play]');
    if (mlBeatPlay) {
      e.preventDefault();
      e.stopPropagation();
      var bIdx = Number(mlBeatPlay.getAttribute('data-listing-beat-play')) || 0;
      var mlCard = mlBeatPlay.closest('.ml-beat-card');
      var isCurrentlyPlaying = mlBeatPlay.classList.contains('is-playing');
      
      // Stop all others
      document.querySelectorAll('.ml-beat-play-btn.is-playing').forEach(function (btn) {
        btn.classList.remove('is-playing');
        btn.innerHTML = '<span class="mi">play_arrow</span>';
      });

      if (!isCurrentlyPlaying) {
        mlBeatPlay.classList.add('is-playing');
        mlBeatPlay.innerHTML = '<span class="mi">pause</span>';
        var beatTitle = mlCard ? (mlCard.querySelector('.ml-beat-title') ? mlCard.querySelector('.ml-beat-title').textContent : 'Beat #' + (bIdx + 1)) : 'Beat';
        var mpItem = (S.State.data.screen || []).filter(function (b) { return b.type === 'miniplayer' || b.type === 'musicplayer'; })[0];
        if (mpItem && mpItem.props) {
          mpItem.props.title = beatTitle;
          mpItem.props.playing = true;
          S.Render.drawScreen();
        }
        U.toast('Playing beat preview: ' + beatTitle);
      } else {
        U.toast('Paused beat preview');
      }
      return;
    }

    // MusicListing Beat License / Download
    var mlBeatDl = e.target.closest('[data-listing-beat-dl]');
    if (mlBeatDl) {
      e.preventDefault();
      e.stopPropagation();
      U.toast('License Options: MP3 Lease ($29), WAV ($49), Tracked Stems ($99)');
      return;
    }

    // ShuffleRadio shuffle click
    var sfrAct = e.target.closest('[data-shuffle-act="shuffle"]');
    if (sfrAct) {
      e.preventDefault();
      e.stopPropagation();
      var sfrBlock = getParentBlock(sfrAct);
      if (sfrBlock) {
        var pool = ['Midnight Drive · Nova Lane', 'Paper Planes · Kite Club', 'Low Orbit · Nia Sol', 'After Rain · Vela', 'Static Bloom · Milo Fenn', 'Golden Hour · Nia Sol'];
        var pick = pool[Math.floor(Math.random() * pool.length)];
        sfrBlock.props.currentTrack = pick;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('sfr:shuffle');
        U.toast('Shuffled! Now playing: ' + pick);
      }
      return;
    }

    // Music Shuffle Cards: Card Tap ("Dab it plays")
    var scCard = e.target.closest('[data-sc-card-idx]');
    if (scCard) {
      e.preventDefault();
      e.stopPropagation();
      createRipple(e, scCard);
      var cardIdx = Number(scCard.getAttribute('data-sc-card-idx')) || 0;
      var cardTitle = scCard.getAttribute('data-sc-title') || 'Song';
      var cardArtist = scCard.getAttribute('data-sc-artist') || 'Artist';
      var cardType = scCard.getAttribute('data-sc-type') || 'note';

      var scBlock = getParentBlock(scCard);
      if (scBlock && scBlock.props) {
        scBlock.props.activeCard = cardIdx;
        scBlock.props.playing = true;
      }

      // Also sync now playing with miniplayer or musicplayer if on screen
      var d = S.State.data;
      var mp = (d.screen || []).find(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; });
      if (mp && mp.props) {
        if (cardType !== 'shuffle') {
          mp.props.title = cardTitle;
          mp.props.artist = cardArtist;
        }
        mp.props.playing = true;
      }

      S.State.commit('shufflecard:play');
      S.Render.drawScreen();
      if (S.Inspector && S.Inspector.render) S.Inspector.render();

      if (cardType === 'shuffle') {
        var activeCat = (scBlock && scBlock.props && scBlock.props.activeCategory) || 'All';
        U.toast('Shuffling ' + (activeCat === 'All' ? 'music' : activeCat + ' music') + '...');
      } else {
        U.toast('Now Playing: ' + cardTitle + ' · ' + cardArtist);
      }
      return;
    }

    // Music Shuffle Cards: Category Tab click (Indian, Chill, Focus, etc.)
    var scCatTab = e.target.closest('[data-sc-cat]');
    if (scCatTab) {
      e.preventDefault();
      e.stopPropagation();
      var catName = scCatTab.getAttribute('data-sc-cat');
      var scBlock = getParentBlock(scCatTab);
      if (scBlock && scBlock.props) {
        scBlock.props.activeCategory = catName;
        scBlock.props.activeCard = 0;
        S.State.commit('shufflecard:category');
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        U.toast('Category: ' + catName);
      }
      return;
    }

    // ShuffleRadio mode pill click
    var sfrMode = e.target.closest('[data-sfr-mode]');
    if (sfrMode) {
      e.preventDefault();
      e.stopPropagation();
      var sfrBlock = getParentBlock(sfrMode);
      if (sfrBlock) {
        var mId = sfrMode.getAttribute('data-sfr-mode');
        sfrBlock.props.activeMode = mId;
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        S.State.commit('sfr:mode');
        U.toast('Shuffle Mode: ' + sfrMode.textContent.trim());
      }
      return;
    }

    // Recommendations play preview click
    var recPlay = e.target.closest('[data-recom-play]');
    if (recPlay) {
      e.preventDefault();
      e.stopPropagation();
      var card = recPlay.closest('.rec-card');
      var title = card ? card.querySelector('.rec-title') : null;
      U.toast('Previewing: ' + (title ? title.textContent : 'Recommendation'));
      return;
    }

    // Recommendations add to library click
    var recAdd = e.target.closest('[data-recom-add]');
    if (recAdd) {
      e.preventDefault();
      e.stopPropagation();
      U.toast('Saved recommendation to your library');
      return;
    }

    if (e.target.closest('[data-ui-player-close]')) {
      e.preventDefault();
      e.stopPropagation();
      closePlayerModal();
      return;
    }

    // Audio effects dropdown menu toggle in player header
    var menuBtn = e.target.closest('[data-ui-player-menu-btn]');
    if (menuBtn) {
      e.preventDefault();
      e.stopPropagation();
      var wrap = menuBtn.closest('.ui-pm-menu-wrap');
      var menu = wrap ? wrap.querySelector('.ui-pm-dropdown-menu') : null;
      if (menu) {
        if (menu.hasAttribute('hidden')) {
          menu.removeAttribute('hidden');
        } else {
          menu.setAttribute('hidden', '');
        }
      }
      return;
    }

    // Close menu when clicking outside
    if (!e.target.closest('.ui-pm-menu-wrap')) {
      var openMenu = document.querySelector('.ui-pm-dropdown-menu:not([hidden])');
      if (openMenu) openMenu.setAttribute('hidden', '');
    }

    // Switch dedicated page views (Equalizer, Sleep Timer, Speed, Download)
    var gotoBtn = e.target.closest('[data-pm-goto]');
    if (gotoBtn) {
      e.preventDefault();
      e.stopPropagation();
      var viewTarget = gotoBtn.getAttribute('data-pm-goto');
      currentModalView = viewTarget;
      var modal = document.querySelector('.mock-frame .ui-player-modal');
      if (modal) {
        var menu = modal.querySelector('.ui-pm-dropdown-menu');
        if (menu) menu.setAttribute('hidden', '');
        modal.setAttribute('data-active-view', viewTarget);
        modal.querySelectorAll('.ui-pm-view').forEach(function (v) {
          v.classList.toggle('is-active', v.getAttribute('data-view-id') === viewTarget);
        });
      }
      return;
    }

    // Back button to return to Now Playing view
    var backBtn = e.target.closest('[data-pm-back]');
    if (backBtn) {
      e.preventDefault();
      e.stopPropagation();
      currentModalView = 'nowplaying';
      var modal = document.querySelector('.mock-frame .ui-player-modal');
      if (modal) {
        modal.setAttribute('data-active-view', 'nowplaying');
        modal.querySelectorAll('.ui-pm-view').forEach(function (v) {
          v.classList.toggle('is-active', v.getAttribute('data-view-id') === 'nowplaying');
        });
      }
      return;
    }

    // Custom Timer Stepper (-5m / +5m)
    var stepBtn = e.target.closest('[data-mp-timer-step]');
    if (stepBtn) {
      e.preventDefault();
      e.stopPropagation();
      var stepVal = parseInt(stepBtn.getAttribute('data-mp-timer-step'), 10) || 0;
      var modal = document.querySelector('.mock-frame .ui-player-modal');
      var input = modal ? modal.querySelector('.mp-custom-input') : null;
      var curVal = input ? (parseInt(input.value, 10) || 30) : 30;
      var newVal = Math.max(1, Math.min(360, curVal + stepVal));
      if (input) input.value = newVal;
      updateCustomTimerDial(newVal);
      return;
    }

    // Quick Add Increments (+5m, +15m, +30m, +1h)
    var addBtn = e.target.closest('[data-mp-timer-add]');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      var addVal = parseInt(addBtn.getAttribute('data-mp-timer-add'), 10) || 0;
      var modal = document.querySelector('.mock-frame .ui-player-modal');
      var input = modal ? modal.querySelector('.mp-custom-input') : null;
      var curVal = input ? (parseInt(input.value, 10) || 30) : 30;
      var newVal = Math.max(1, Math.min(360, curVal + addVal));
      if (input) input.value = newVal;
      updateCustomTimerDial(newVal);
      return;
    }

    // Start Sleep Timer CTA
    var startTimerBtn = e.target.closest('[data-mp-timer-start]');
    if (startTimerBtn) {
      e.preventDefault();
      e.stopPropagation();
      var modal = document.querySelector('.mock-frame .ui-player-modal');
      var input = modal ? modal.querySelector('.mp-custom-input') : null;
      var minVal = input ? (parseInt(input.value, 10) || 30) : 30;
      var tStr = minVal + 'm';
      var d = S.State.data;
      var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
      if (mp) {
        mp.props = mp.props || {};
        mp.props.sleepTimer = tStr;
        S.State.commit('player:timer');
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        currentModalView = 'nowplaying';
        openPlayerModal(null, 'nowplaying');
        U.toast('Sleep timer set for ' + minVal + ' mins');
      }
      return;
    }

    // Master Equalizer Power Switch
    var eqPower = e.target.closest('[data-mp-eq-power]');
    if (eqPower) {
      e.stopPropagation();
      var isOn = eqPower.checked !== false;
      var modal = document.querySelector('.mock-frame .ui-player-modal');
      var eqRack = modal ? modal.querySelector('.mp-mod-eq-rack') : null;
      if (eqRack) {
        eqRack.style.opacity = isOn ? '1' : '0.4';
        eqRack.style.pointerEvents = isOn ? '' : 'none';
      }
      U.toast(isOn ? 'Equalizer enabled' : 'Equalizer bypassed (Flat)');
      return;
    }

    // Rotary sound FX adjustment
    var rotary = e.target.closest('[data-mp-rotary]');
    if (rotary) {
      e.preventDefault();
      e.stopPropagation();
      var fxType = rotary.getAttribute('data-mp-rotary');
      var valEl = rotary.querySelector('.mp-eq-rotary-val');
      if (fxType === 'bass') {
        var curVal = parseInt((valEl && valEl.textContent) || '+6', 10);
        var nextVal = curVal >= 12 ? 0 : curVal + 3;
        if (valEl) valEl.textContent = (nextVal > 0 ? '+' : '') + nextVal + 'dB';
        U.toast('Bass Boost: ' + nextVal + 'dB');
      } else if (fxType === 'surround') {
        var curVal = parseInt((valEl && valEl.textContent) || '65', 10);
        var nextVal = curVal >= 100 ? 0 : curVal + 25;
        if (valEl) valEl.textContent = nextVal + '%';
        U.toast('3D Surround: ' + nextVal + '%');
      } else if (fxType === 'clarity') {
        var curVal = parseInt((valEl && valEl.textContent) || '+3', 10);
        var nextVal = curVal >= 9 ? 0 : curVal + 3;
        if (valEl) valEl.textContent = (nextVal > 0 ? '+' : '') + nextVal + 'dB';
        U.toast('Vocal Clarity: ' + nextVal + 'dB');
      }
      return;
    }

    if (e.target.closest('[data-pm-act="inspect"]') || e.target.closest('[data-ui-player-inspect]')) {
      e.preventDefault();
      e.stopPropagation();
      closePlayerModal();
      var d = S.State.data;
      var targetMp = (d.screen || []).filter(function (it) {
        return it.type === 'miniplayer' || it.type === 'musicplayer';
      })[0];
      if (targetMp && S.App) {
        S.App.select(targetMp.id);
        S.App.showTab('inspect');
      }
      return;
    }

    var playBtn = e.target.closest('[data-ui-player-play]');
    if (playBtn) {
      e.preventDefault();
      e.stopPropagation();
      var d = S.State.data;
      var mpBlock = (d.screen || []).filter(function (it) {
        return it.type === 'miniplayer' || it.type === 'musicplayer';
      })[0];
      if (mpBlock) {
        mpBlock.props = mpBlock.props || {};
        mpBlock.props.playing = !mpBlock.props.playing;
        S.State.commit('player:play');
        S.Render.drawScreen();
        openPlayerModal();
      }
      return;
    }

    var favBtn = e.target.closest('[data-ui-player-fav]');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      var isFav = favBtn.classList.toggle('on');
      favBtn.innerHTML = S.icon(isFav ? 'favorite' : 'favorite_border');
      U.toast(isFav ? 'Added to favourites' : 'Removed from favourites');
      return;
    }

    /* Mini player click: select block in inspector + open full-screen player modal */
    var miniPlayer = e.target.closest('.cmp-miniplayer, .mini-player');
    if (miniPlayer) {
      var miniPlayBtn = e.target.closest('.mini-play');
      if (miniPlayBtn) {
        e.preventDefault();
        e.stopPropagation();
        var d = S.State.data;
        var miniItem = (d.screen || []).filter(function (it) { return it.type === 'miniplayer'; })[0];
        if (miniItem) {
          miniItem.props = miniItem.props || {};
          miniItem.props.playing = !miniItem.props.playing;
          S.State.commit('mini:play');
          S.Render.drawScreen();
        }
        return;
      }
      var blockEl = miniPlayer.closest('.cmp');
      var blockId = blockEl ? blockEl.getAttribute('data-id') : null;
      if (blockId && S.App) {
        S.App.select(blockId);
      }
      openPlayerModal();
      return;
    }

    if (e.target.closest('[data-ui-close]') || e.target.closest('.ui-scrim')) {
      e.preventDefault();
      e.stopPropagation();
      closeAll();
      return;
    }

    /* Center Action FAB button on bottom nav */
    var fabBtn = e.target.closest(".ncf-fab-btn");
    if (fabBtn) {
      e.preventDefault();
      e.stopPropagation();
      createRipple(e, fabBtn);
      U.toast("Action button pressed");
      return;
    }

    /* Bottom-navigation tabs open the matching screen for editing. */
    var navTab = e.target.closest(".nav-item[data-page-index]");
    if (navTab) {
      e.preventDefault();
      e.stopPropagation();
      createRipple(e, navTab);
      var navIndex = Number(navTab.getAttribute("data-page-index"));
      var pages = S.State.data.pages || [];
      if (pages[navIndex]) {
        transitionToPage(navIndex, "fade");
      } else {
        var label = navTab.querySelector(".nav-label") || navTab.querySelector("span:not(.nav-icon)");
        var tabTitle = label ? label.textContent.trim() : ("Screen " + (navIndex + 1));
        var newP = S.State.addPage(tabTitle, { tabIndex: navIndex });
        if (newP && S.App) U.toast("Created screen for '" + tabTitle + "'");
      }
      // Also select the bottom navigation block in inspector so user can see and change variation
      if (S.App) {
        setTimeout(function () {
          var currentNav = (S.State.data.screen || []).filter(function (b) {
            return b.type === 'bottomnav' || (b.type && b.type.indexOf('bottomnav') === 0);
          })[0];
          if (currentNav) S.App.select(currentNav.id);
        }, 120);
      }
      return;
    }

    /* Clicking anywhere on bottom nav bar selects it in Inspector */
    var bottomNavCmp = e.target.closest(".cmp-bottomnav, .nav-bar, .screen-dock");
    if (bottomNavCmp && !navTab && !e.target.closest(".ncf-fab-btn") && !e.target.closest(".cmp-miniplayer")) {
      var navItem = (S.State.data.screen || []).filter(function (b) {
        return b.type === 'bottomnav' || (b.type && b.type.indexOf('bottomnav') === 0);
      })[0];
      if (navItem && S.App) {
        S.App.select(navItem.id);
        S.App.showTab('inspect');
      }
    }

    /* Top tabs (.tab inside .tabs-row or [data-tab-index]) */
    var topTab = e.target.closest(".tabs-row .tab, [data-tab-index]");
    if (topTab) {
      e.preventDefault();
      e.stopPropagation();
      createRipple(e, topTab);
      var tabIdx = Number(topTab.getAttribute("data-tab-index")) || 0;
      var tabLabel = (topTab.getAttribute("data-tab-label") || topTab.textContent || "").trim();
      var tabsBlockEl = topTab.closest(".cmp");
      var tabsBlockId = tabsBlockEl && tabsBlockEl.dataset.id;
      var tabsBlock = tabsBlockId && S.State.blockById(tabsBlockId);
      if (tabsBlock && tabsBlock.props) {
        tabsBlock.props.active = tabIdx;
      }

      // Check if current screen contains a musiclisting block to switch view in real time
      var screenBlocks = S.State.data.screen || [];
      var mlBlock = screenBlocks.filter(function (b) { return b.type === 'musiclisting'; })[0];

      var targetMode = null;
      if (/song|track/i.test(tabLabel)) targetMode = 'songs';
      else if (/album/i.test(tabLabel)) targetMode = 'albums';
      else if (/artist/i.test(tabLabel)) targetMode = 'artists';
      else if (/beat|audio|inst/i.test(tabLabel)) targetMode = 'beats';

      if (mlBlock && (targetMode || tabIdx <= 3)) {
        var finalMode = targetMode || ['songs', 'albums', 'artists', 'beats'][tabIdx] || 'songs';
        mlBlock.props = mlBlock.props || {};
        mlBlock.props.viewMode = finalMode;
        if (tabsBlock && tabsBlock.props) tabsBlock.props.active = tabIdx;
        S.State.commit('switch-view:' + finalMode);
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        U.toast("Switched to " + tabLabel + " view");
        return;
      }

      // Check if there is an existing page matching tabLabel
      var pages = S.State.data.pages || [];
      var foundIdx = -1;
      for (var pi = 0; pi < pages.length; pi++) {
        if (pages[pi].name && pages[pi].name.toLowerCase() === tabLabel.toLowerCase()) {
          foundIdx = pi;
          break;
        }
      }
      if (foundIdx > -1) {
        transitionToPage(foundIdx, "slide");
      } else {
        if (tabsBlock && tabsBlock.props) {
          tabsBlock.props.active = tabIdx;
          S.State.commit('prop:' + tabsBlock.id + ':active');
        }
        S.Render.drawScreen();
        if (S.Inspector && S.Inspector.render) S.Inspector.render();
        U.toast("Active tab: " + tabLabel);
      }
      return;
    }

    /* Website navigation dropdown toggle */
    var ddBtn = e.target.closest(".wnav-dd-btn");
    if (ddBtn) {
      e.preventDefault();
      e.stopPropagation();
      var item = ddBtn.closest(".wnav-item");
      if (item) item.classList.toggle("is-open");
      return;
    }

    /* Website navigation links (.wnav-links a, .wnav-dd-link, [data-nav-link]) */
    var navLink = e.target.closest(".wnav-links a, .wnav-dd-link, [data-nav-link]");
    if (navLink) {
      e.preventDefault();
      e.stopPropagation();
      var linkLabel = navLink.getAttribute("data-nav-link") || navLink.textContent.trim();
      if (!linkLabel || linkLabel === "#" || linkLabel === "Login" || linkLabel === "Search") return;
      var pages = S.State.data.pages || [];
      var foundIdx = -1;
      for (var pi = 0; pi < pages.length; pi++) {
        if (pages[pi].name && pages[pi].name.toLowerCase() === linkLabel.toLowerCase()) {
          foundIdx = pi;
          break;
        }
      }
      if (foundIdx > -1) {
        transitionToPage(foundIdx, "fade");
      } else {
        var newP = S.State.addPage(linkLabel, { icon: "msr:web" });
        if (newP && S.App) {
          U.toast("Created '" + linkLabel + "' page");
        }
      }
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
      var mTarget = pageForLabel(menuLabel);
      if (mTarget > -1) {
        transitionToPage(mTarget, 'slide');
      } else if (/setting/i.test(menuLabel)) {
        transitionToPage('settings', 'slide');
      } else {
        U.toast(menuLabel);
      }
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
    openPlayerModal: openPlayerModal,
    transitionToPage: transitionToPage,
    openNavPrompt: openNavPrompt,
    closeNavPrompt: closeNavPrompt,
    closePlayerModal: closePlayerModal,

    init: function () {
      var stage = document.getElementById('stage');
      if (!stage || stage.dataset.uiBound) return;
      stage.dataset.uiBound = '1';

      stage.addEventListener('click', handlerClick, true);

      stage.addEventListener('input', function (e) {
        if (e.target.matches('[data-mp-custom-timer]')) {
          var val = parseInt(e.target.value, 10);
          if (!isNaN(val) && val > 0) {
            updateCustomTimerDial(val);
          }
          return;
        }
        if (e.target.classList.contains('mp-eq-range')) {
          var bIdx = Number(e.target.getAttribute('data-mp-eq-band'));
          var v = Number(e.target.value);
          var d = S.State.data;
          var mp = (d.screen || []).filter(function (it) { return it.type === 'miniplayer' || it.type === 'musicplayer'; })[0];
          if (mp) {
            mp.props = mp.props || {};
            var presetCurves = {
              'Flat': [0, 0, 0, 0, 0],
              'Bass Boost': [7, 5, 1, 2, 3],
              'Vocal': [-2, 1, 6, 4, 1],
              'Electronic': [6, 4, 0, 3, 5],
              'Rock': [5, 3, -1, 3, 6],
              'Acoustic': [3, 2, 1, 4, 3],
              'Studio Master': [2, 1, 0, 2, 2]
            };
            var currentBands = (Array.isArray(mp.props.eqBands) && mp.props.eqBands.length === 5)
              ? mp.props.eqBands.slice()
              : (presetCurves[mp.props.eqPreset || 'Bass Boost'] || [7, 5, 1, 2, 3]).slice();
            currentBands[bIdx] = v;
            mp.props.eqBands = currentBands;
            mp.props.eqPreset = 'Custom';
            S.Render.drawScreen();
            if (S.Inspector && S.Inspector.render) S.Inspector.render();
          }
          return;
        }
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
