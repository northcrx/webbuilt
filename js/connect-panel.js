/* Studio Connect & Flow Panel: Visual App Navigation & Screen Linking
   Lets users connect any button, card, tab, or settings row to local screens,
   configure Material 3 transitions, and test user flows live in the phone. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  var ConnectPanel = S.ConnectPanel = {
    init: function () {
      var box = document.getElementById('tab-connect');
      if (!box) return;
      this.bind(box);
      this.render();
    },

    render: function () {
      var box = document.getElementById('tab-connect');
      if (!box) return;

      var d = S.State.data;
      var pagesList = (d.target === 'app' && Array.isArray(d.pages)) ? d.pages : [];
      var activePage = pagesList.filter(function (p) { return p.id === d.activePageId; })[0] || { name: 'Active Screen', id: 'page-0' };

      // Scan screen for linkable interactive components
      var linkables = this.findLinkables(d.screen || []);

      var pageOptions = pagesList.map(function (page, idx) {
        var label = page.name || ('Screen ' + (idx + 1));
        return '<option value="' + esc(page.id) + '">' + esc(label) + '</option>';
      }).join('');

      var flowsHtml = '';
      if (!linkables.length) {
        flowsHtml = '<div class="flow-empty">' +
          '<span class="mi">alt_route</span>' +
          '<strong>No interactive components yet</strong>' +
          '<p>Add a button, card, settings list, or bottom nav to connect screens together.</p>' +
          '</div>';
      } else {
        flowsHtml = linkables.map(function (item) {
          var currentTarget = item.target || '';
          var transition = item.transition || 'slide';

          var opts = '<option value=""' + (!currentTarget ? ' selected' : '') + '>None (Unlinked)</option>' +
            pagesList.map(function (page, idx) {
              var on = currentTarget === page.id || currentTarget === page.name.toLowerCase() || (currentTarget === 'settings' && /setting/i.test(page.name));
              return '<option value="' + esc(page.id) + '"' + (on ? ' selected' : '') + '>' + esc(page.name || ('Screen ' + (idx + 1))) + '</option>';
            }).join('') +
            '<option value="__create_settings__">+ Create Settings Screen</option>' +
            '<option value="__create_blank__">+ Create Blank Screen</option>' +
            '<option value="__create_player__">+ Create Media Player Screen</option>';

          return '<div class="flow-card" data-flow-block="' + esc(item.id) + '">' +
            '<div class="flow-card-head">' +
            '<div class="flow-source"><span class="mi">' + esc(item.icon) + '</span><strong>' + esc(item.title) + '</strong></div>' +
            '<span class="tag">' + esc(item.type) + '</span>' +
            '</div>' +
            '<div class="f-row">' +
            '<div class="f-label"><span>Connects to:</span></div>' +
            '<select class="f-select flow-target-select" data-block-id="' + esc(item.id) + '" data-flow-key="' + esc(item.key) + '">' +
            opts +
            '</select>' +
            '</div>' +
            '<div class="f-row">' +
            '<div class="f-label"><span>Transition:</span></div>' +
            '<select class="f-select flow-trans-select" data-block-id="' + esc(item.id) + '">' +
            '<option value="slide"' + (transition === 'slide' ? ' selected' : '') + '>Shared Axis (Slide X)</option>' +
            '<option value="fade"' + (transition === 'fade' ? ' selected' : '') + '>Fade Through</option>' +
            '<option value="zoom"' + (transition === 'zoom' ? ' selected' : '') + '>Container Zoom</option>' +
            '<option value="sheet"' + (transition === 'sheet' ? ' selected' : '') + '>Bottom Sheet (Slide Up)</option>' +
            '</select>' +
            '</div>' +
            '<div class="flow-actions">' +
            '<button type="button" class="tb-btn small flow-test-btn" data-target="' + esc(currentTarget) + '" data-trans="' + esc(transition) + '">' +
            '<span class="mi">play_arrow</span><span>Test in phone</span>' +
            '</button>' +
            '</div>' +
            '</div>';
        }).join('');
      }

      box.innerHTML = '<div class="connect-panel">' +
        '<div class="connect-hero">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span class="mi" style="font-size:22px;color:var(--accent);">alt_route</span>' +
        '<div><strong>Visual App Navigation &amp; Flow</strong>' +
        '<p>Connect buttons, cards and tabs to any screen with Material 3 transitions.</p></div>' +
        '</div>' +
        '</div>' +

        '<div class="flow-current-banner">' +
        '<span class="mi">smartphone</span>' +
        '<div><strong>Viewing Screen: ' + esc(activePage.name) + '</strong>' +
        '<small>' + (linkables.length) + ' interactive controls on this screen</small></div>' +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Interactive Elements on this Screen</div>' +
        flowsHtml +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Quick Screen Actions</div>' +
        '<div class="quick-connect-actions">' +
        '<button type="button" class="tb-btn small" id="btn-quick-add-settings"><span class="mi">settings</span><span>+ Add Settings Screen</span></button>' +
        '<button type="button" class="tb-btn small" id="btn-quick-add-player"><span class="mi">play_circle</span><span>+ Add Media Player Screen</span></button>' +
        '<button type="button" class="tb-btn small" id="btn-quick-add-blank"><span class="mi">note_add</span><span>+ Add Blank Screen</span></button>' +
        '</div>' +
        '</div>' +
        '</div>';
    },

    findLinkables: function (screen) {
      var res = [];
      (screen || []).forEach(function (item) {
        if (!item) return;
        var def = S.components[item.type];
        var p = item.props || {};

        if (item.type === 'button') {
          res.push({
            id: item.id,
            type: 'Button',
            icon: 'smart_button',
            title: p.text || 'Action Button',
            target: p.navTarget || '',
            transition: p.transition || 'slide',
            key: 'navTarget'
          });
        } else if (item.type === 'card') {
          res.push({
            id: item.id,
            type: 'Card',
            icon: 'view_agenda',
            title: p.title || 'Interactive Card',
            target: p.navTarget || '',
            transition: p.transition || 'slide',
            key: 'navTarget'
          });
        } else if (item.type === 'miniplayer') {
          res.push({
            id: item.id,
            type: 'Mini Audio Player',
            icon: 'play_circle',
            title: (p.title || 'Audio Player') + ' (Tap track)',
            target: p.navTarget || 'player',
            transition: 'sheet',
            key: 'navTarget'
          });
        } else if (item.type === 'settingslist') {
          res.push({
            id: item.id,
            type: 'Settings Group',
            icon: 'settings',
            title: p.title || 'Settings Options Card',
            target: p.navTarget || 'settings',
            transition: p.transition || 'slide',
            key: 'navTarget'
          });
        } else if (item.type.indexOf('bottomnav') === 0) {
          res.push({
            id: item.id,
            type: 'Bottom Navigation',
            icon: 'navigation',
            title: 'Tab Navigation Bar',
            target: 'Multi-screen router',
            transition: 'fade',
            key: 'bottomnav'
          });
        } else if (item.type.indexOf('appbar') === 0 || item.type.indexOf('header') !== -1) {
          res.push({
            id: item.id,
            type: 'App Header Bar',
            icon: 'web_asset',
            title: p.title || 'Top Header',
            target: p.navTarget || '',
            transition: 'slide',
            key: 'navTarget'
          });
        }
      });
      return res;
    },

    bind: function (box) {
      var self = this;
      box.addEventListener('change', function (e) {
        var targetSelect = e.target.closest('.flow-target-select');
        var transSelect = e.target.closest('.flow-trans-select');

        if (targetSelect) {
          var bId = targetSelect.getAttribute('data-block-id');
          var key = targetSelect.getAttribute('data-flow-key') || 'navTarget';
          var val = targetSelect.value;

          if (val === '__create_settings__') {
            var sp = S.State.addPage('settings');
            val = sp ? sp.id : 'settings';
          } else if (val === '__create_blank__') {
            var bp = S.State.addPage('blank');
            val = bp ? bp.id : 'blank';
          } else if (val === '__create_player__') {
            var pp = S.State.addPage('player');
            val = pp ? pp.id : 'player';
          }

          var block = S.State.data.screen.filter(function (it) { return it.id === bId; })[0];
          if (block && block.props) {
            block.props[key] = val;
            S.State.commit('connect:' + bId + ':' + val);
            S.Render.drawScreen();
            self.render();
            U.toast('✓ Connected to ' + val);
          }
        }

        if (transSelect) {
          var tbId = transSelect.getAttribute('data-block-id');
          var tVal = transSelect.value;
          var tBlock = S.State.data.screen.filter(function (it) { return it.id === tbId; })[0];
          if (tBlock && tBlock.props) {
            tBlock.props.transition = tVal;
            S.State.commit('trans:' + tbId + ':' + tVal);
            U.toast('✓ Transition set to ' + tVal);
          }
        }
      });

      box.addEventListener('click', function (e) {
        var testBtn = e.target.closest('.flow-test-btn');
        if (testBtn) {
          var target = testBtn.getAttribute('data-target');
          var trans = testBtn.getAttribute('data-trans') || 'slide';
          if (target && S.Interactions && S.Interactions.transitionToPage) {
            S.Interactions.transitionToPage(target, trans);
            U.toast('▶ Playing transition: ' + trans);
          } else {
            U.toast('No destination connected yet');
          }
          return;
        }

        var addSettings = e.target.closest('#btn-quick-add-settings');
        if (addSettings) {
          S.State.addPage('settings');
          S.App.refresh('all');
          self.render();
          U.toast('Settings Screen added & ready to connect');
          return;
        }

        var addPlayer = e.target.closest('#btn-quick-add-player');
        if (addPlayer) {
          S.State.addPage('player');
          S.App.refresh('all');
          self.render();
          U.toast('Fullscreen Media Player added');
          return;
        }

        var addBlank = e.target.closest('#btn-quick-add-blank');
        if (addBlank) {
          S.State.addPage('blank');
          S.App.refresh('all');
          self.render();
          U.toast('New Blank Screen added');
          return;
        }
      });
    }
  };
})();
