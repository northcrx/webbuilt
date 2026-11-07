/* Visual Universal Context Menu (Right-Click) across Canvas, Pages, and Layers */
(function () {
  var S = window.Studio = window.Studio || {};

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var ContextMenu = S.ContextMenu = {
    el: null,
    menuHeader: null,
    menuBody: null,
    linkModal: null,

    init: function () {
      this.el = document.getElementById('ctx-menu');
      this.menuHeader = document.getElementById('ctx-menu-header');
      this.menuBody = document.getElementById('ctx-menu-body');
      this.linkModal = document.getElementById('ctx-link-modal');

      var self = this;

      // Close context menu on outside click or Esc
      document.addEventListener('pointerdown', function (e) {
        if (self.el && !self.el.hidden && !self.el.contains(e.target)) {
          self.close();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          if (self.el && !self.el.hidden) self.close();
          if (self.linkModal && !self.linkModal.hidden) self.closeLinkPicker();
        }
      });

      var clmClose = document.getElementById('clm-close');
      if (clmClose) {
        clmClose.addEventListener('click', function () { self.closeLinkPicker(); });
      }
      if (this.linkModal) {
        this.linkModal.addEventListener('pointerdown', function (e) {
          if (e.target === self.linkModal) self.closeLinkPicker();
        });
      }

      this.bindStage();
      this.bindPages();
      this.bindLayers();
    },

    open: function (x, y, title, subtitle, items) {
      if (!this.el) return;
      var self = this;

      if (this.menuHeader) {
        this.menuHeader.innerHTML =
          '<div class="ctx-title-row">' +
          '<strong class="ctx-title">' + esc(title || 'Actions') + '</strong>' +
          (subtitle ? '<small class="ctx-sub">' + esc(subtitle) + '</small>' : '') +
          '</div>';
      }

      var html = items.map(function (item, idx) {
        if (item.divider) return '<div class="ctx-divider"></div>';
        var cls = 'ctx-item' + (item.danger ? ' danger' : '') + (item.active ? ' active' : '');
        var iconHtml = item.icon ? '<span class="mi ctx-ico">' + esc(item.icon) + '</span>' : '';
        var shortcutHtml = item.shortcut ? '<span class="ctx-kbd">' + esc(item.shortcut) + '</span>' : '';
        var arrowHtml = item.submenu ? '<span class="mi ctx-arrow">chevron_right</span>' : '';
        return '<button type="button" class="' + cls + '" data-ctx-idx="' + idx + '">' +
          iconHtml +
          '<span class="ctx-label">' + esc(item.label) + '</span>' +
          shortcutHtml +
          arrowHtml +
          '</button>';
      }).join('');

      this.menuBody.innerHTML = html;

      this.el.hidden = false;
      var menuW = this.el.offsetWidth || 230;
      var menuH = this.el.offsetHeight || 260;
      var posX = Math.min(x, window.innerWidth - menuW - 12);
      var posY = Math.min(y, window.innerHeight - menuH - 12);
      if (posX < 8) posX = 8;
      if (posY < 8) posY = 8;

      this.el.style.left = posX + 'px';
      this.el.style.top = posY + 'px';

      this.menuBody.onclick = function (e) {
        var btn = e.target.closest('[data-ctx-idx]');
        if (!btn) return;
        var idx = parseInt(btn.getAttribute('data-ctx-idx'), 10);
        var it = items[idx];
        if (it && typeof it.action === 'function') {
          self.close();
          it.action();
        }
      };
    },

    close: function () {
      if (this.el) this.el.hidden = true;
    },

    /* =========================================================
       1. CANVAS (STAGE) RIGHT CLICK
       ========================================================= */
    bindStage: function () {
      var self = this;
      var stage = document.getElementById('stage');
      if (!stage) return;

      stage.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var cmp = e.target.closest('.cmp');
        var d = S.State.data;

        if (!cmp) {
          // Right-clicked on canvas background or phone empty area
          var activePage = S.State.pageById(d.activePageId);
          var pageName = activePage ? activePage.name : 'Active Screen';
          self.open(e.clientX, e.clientY, 'Screen: ' + pageName, (d.screen ? d.screen.length : 0) + ' blocks', [
            {
              label: 'Add New Screen...',
              icon: 'add',
              action: function () {
                var p = S.State.addPage();
                if (S.App) S.App.refresh('all');
                U.toast('New screen created: ' + (p ? p.name : 'Screen'));
              }
            },
            {
              label: 'Add Blank Screen',
              icon: 'note_add',
              action: function () {
                var p = S.State.addPage(null, { blank: true, screen: [] });
                if (S.App) S.App.refresh('all');
                U.toast('Blank screen added');
              }
            },
            {
              label: 'Clear Screen Blocks',
              icon: 'cleaning_services',
              action: function () {
                if (S.App) S.App.clearScreen();
              }
            },
            { divider: true },
            {
              label: 'Undo',
              icon: 'undo',
              shortcut: 'Ctrl+Z',
              action: function () { if (S.App) S.App.undo(); }
            },
            {
              label: 'Redo',
              icon: 'redo',
              shortcut: 'Ctrl+Y',
              action: function () { if (S.App) S.App.redo(); }
            }
          ]);
          return;
        }

        // Inside a block
        var blockId = cmp.getAttribute('data-id');
        if (S.App) S.App.select(blockId);
        var block = S.App ? S.App.blockById(blockId) : null;
        if (!block) return;
        var def = S.components[block.type] || { label: block.type, icon: 'widgets' };

        var items = [];

        // A. Direct Icon Detection
        var iconEl = e.target.closest('.mi, .icn, svg, [data-icon]');
        var isActionPill = e.target.closest('.ab-action-pill, .ab-action');
        var isBottomTab = e.target.closest('.bnav-tab, .dock-tab, [data-page-index]');

        if (iconEl || isActionPill || isBottomTab || block.props.icon || block.props.leadingIcon || block.type === 'appbar' || block.type === 'bottomnav') {
          items.push({
            label: 'Change Icon...',
            icon: 'palette',
            action: function () {
              if (isActionPill && block.type === 'appbar') {
                var aIdx = parseInt(isActionPill.getAttribute('data-action-index') || '0', 10);
                var itemsList = S.getAppBarActionItems ? S.getAppBarActionItems(block.props) : [];
                var cur = (itemsList[aIdx] && itemsList[aIdx].icon) || 'star';
                if (S.IconSwitcher) {
                  S.IconSwitcher.open({
                    cmpId: blockId,
                    cmpLabel: 'Action ' + (aIdx + 1),
                    propKey: 'actionIcon',
                    currentIcon: cur,
                    el: isActionPill,
                    onSelect: function (newIcon) {
                      if (itemsList[aIdx]) itemsList[aIdx].icon = newIcon;
                      block.props.actionItems = itemsList;
                      block.props.actions = itemsList.map(function (it) { return it.icon; }).join(', ');
                      S.State.commit('appbar:action:icon:' + aIdx);
                      S.App.refresh('all');
                      U.toast('Action icon changed to ' + newIcon);
                    }
                  }, e);
                }
              } else if (isBottomTab && block.type === 'bottomnav') {
                var tIdx = parseInt(isBottomTab.getAttribute('data-page-index') || '0', 10);
                var tabPages = (d.pages || []).filter(function (p) { return !p.hiddenFromNav; });
                var targetPage = tabPages[tIdx] || d.pages[tIdx];
                if (targetPage && S.IconSwitcher) {
                  S.IconSwitcher.open({
                    cmpId: blockId,
                    cmpLabel: 'Tab: ' + targetPage.name,
                    propKey: 'icon',
                    currentIcon: targetPage.icon || 'apps',
                    el: isBottomTab,
                    onSelect: function (newIcon) {
                      S.State.setPageIcon(targetPage.id, newIcon);
                      S.App.refresh('all');
                      U.toast('Tab icon changed to ' + newIcon);
                    }
                  }, e);
                }
              } else if (S.IconSwitcher) {
                var pKey = block.props.leadingIcon !== undefined ? 'leadingIcon' : 'icon';
                var curI = block.props[pKey] || def.icon || 'star';
                S.IconSwitcher.open({
                  cmpId: blockId,
                  cmpLabel: def.label,
                  propKey: pKey,
                  currentIcon: curI,
                  el: iconEl || cmp
                }, e);
              }
            }
          });
        }

        // B. Search Bar Configuration
        var isSearch = e.target.closest('input[type="search"], .ab-search-wrap, .search-field, .search-box') ||
                       block.type === 'searchheader' ||
                       (block.type === 'appbar' && block.props && block.props.variant === 'search');

        if (isSearch) {
          items.push({
            label: 'Configure Search...',
            icon: 'search',
            action: function () {
              self.openSearchConfig(blockId);
            }
          });
          items.push({
            label: 'Change Search Placeholder...',
            icon: 'edit',
            action: function () {
              var oldPh = block.props.placeholder || 'Search...';
              var next = prompt('Enter search placeholder text:', oldPh);
              if (next !== null) {
                block.props.placeholder = next;
                S.State.commit('prop:' + blockId + ':placeholder');
                S.App.refresh('structure');
                U.toast('Search placeholder updated');
              }
            }
          });
        }

        // C. Universal Link / Destination Connector
        items.push({
          label: block.props && block.props.navTarget ? 'Change Link (' + block.props.navTarget + ')...' : 'Link / Connect to Screen...',
          icon: 'link',
          action: function () {
            self.openLinkPicker(blockId);
          }
        });

        // D. Text Direct Editing
        var isTextEl = e.target.closest('h1, h2, h3, h4, h5, h6, p, span, small, strong, b, label');
        if (isTextEl && !isTextEl.closest('.mi, .icn, svg')) {
          items.push({
            label: 'Edit Text Directly',
            icon: 'text_fields',
            action: function () {
              isTextEl.click();
            }
          });
        }

        items.push({ divider: true });

        // E. Block Management
        items.push({
          label: 'Duplicate Block',
          icon: 'content_copy',
          shortcut: 'Ctrl+D',
          action: function () { if (S.App) S.App.duplicateSelected(blockId); }
        });

        items.push({
          label: 'Move Up',
          icon: 'arrow_upward',
          action: function () { if (S.App) S.App.moveSelected(-1, blockId); }
        });

        items.push({
          label: 'Move Down',
          icon: 'arrow_downward',
          action: function () { if (S.App) S.App.moveSelected(1, blockId); }
        });

        items.push({
          label: block.locked ? 'Unlock Block' : 'Lock Block',
          icon: block.locked ? 'lock_open' : 'lock',
          action: function () { if (S.App) S.App.toggleLock(blockId); }
        });

        items.push({
          label: block.hidden ? 'Show Block' : 'Hide Block',
          icon: block.hidden ? 'visibility' : 'visibility_off',
          action: function () { if (S.App) S.App.toggleHidden(blockId); }
        });

        items.push({ divider: true });

        items.push({
          label: 'Delete Block',
          icon: 'delete',
          danger: true,
          shortcut: 'Del',
          action: function () { if (S.App) S.App.deleteSelected(blockId); }
        });

        self.open(e.clientX, e.clientY, def.label, block.type, items);
      });
    },

    /* =========================================================
       2. PAGES PANEL RIGHT CLICK
       ========================================================= */
    bindPages: function () {
      var self = this;
      var list = document.getElementById('pages-list');
      if (!list) return;

      list.addEventListener('contextmenu', function (e) {
        var row = e.target.closest('.page-row');
        if (!row) return;
        e.preventDefault();
        e.stopPropagation();

        var pageId = row.getAttribute('data-page-id');
        var page = S.State.pageById(pageId);
        if (!page) return;

        var d = S.State.data;
        var isActive = pageId === d.activePageId;

        self.open(e.clientX, e.clientY, page.name, (isActive ? 'Active Screen · ' : '') + (page.screen ? page.screen.length : 0) + ' blocks', [
          {
            label: 'Switch to this Screen',
            icon: 'visibility',
            action: function () {
              S.State.switchPage(pageId);
              if (S.App) S.App.refresh('all');
              U.toast('Switched to “' + page.name + '”');
            }
          },
          {
            label: 'Rename Screen...',
            icon: 'edit',
            action: function () {
              if (S.App && S.App.startRenamePage) {
                S.App.startRenamePage(pageId);
              } else if (S.prompt) {
                S.prompt('Rename Screen', page.name, function (next) {
                  if (next && next.trim()) {
                    S.State.renamePage(pageId, next.trim());
                    if (S.App) S.App.refresh('all');
                    U.toast('Renamed to ' + next.trim());
                  }
                });
              } else {
                var next = prompt('Enter new screen name:', page.name);
                if (next && next.trim()) {
                  S.State.renamePage(pageId, next.trim());
                  if (S.App) S.App.refresh('all');
                  U.toast('Renamed to ' + next.trim());
                }
              }
            }
          },
          {
            label: 'Change Screen Icon...',
            icon: 'palette',
            action: function () {
              if (S.IconSwitcher) {
                S.IconSwitcher.open({
                  cmpId: pageId,
                  cmpLabel: page.name,
                  propKey: 'icon',
                  currentIcon: page.icon || 'apps',
                  el: row.querySelector('.page-ico'),
                  onSelect: function (newIcon) {
                    S.State.setPageIcon(pageId, newIcon);
                    if (S.App) S.App.refresh('all');
                    U.toast('Screen icon changed to ' + newIcon);
                  }
                }, e);
              }
            }
          },
          {
            label: 'Duplicate Screen',
            icon: 'content_copy',
            action: function () {
              var dup = S.State.duplicatePage(pageId);
              if (S.App) S.App.refresh('all');
              if (dup) U.toast('Duplicated: ' + dup.name);
            }
          },
          {
            label: page.hiddenFromNav ? 'Include in Bottom Nav' : 'Hide from Bottom Nav',
            icon: page.hiddenFromNav ? 'visibility' : 'visibility_off',
            action: function () {
              S.State.togglePageHidden(pageId);
              if (S.App) S.App.refresh('all');
              U.toast(page.hiddenFromNav ? 'Screen hidden from nav' : 'Screen added to nav');
            }
          },
          {
            label: 'Combine / Merge with Screen...',
            icon: 'merge',
            action: function () {
              var srcP = S.State.pageById(pageId);
              var otherPages = (S.State.data.pages || []).filter(function (p) { return p.id !== pageId; });
              if (!otherPages.length) {
                U.toast('Create at least 2 screens to combine');
                return;
              }
              var names = otherPages.map(function (p, i) { return (i + 1) + ': ' + p.name; }).join('\n');
              var choice = prompt('Select screen number to combine with “' + (srcP ? srcP.name : 'this screen') + '”:\n\n' + names, '1');
              if (choice) {
                var cIdx = parseInt(choice, 10) - 1;
                var tgtP = otherPages[cIdx];
                if (tgtP) {
                  S.State.combinePages(pageId, tgtP.id, { removeSource: false });
                  if (S.App) S.App.refresh('all');
                  U.toast('Combined “' + srcP.name + '” into “' + tgtP.name + '”');
                }
              }
            }
          },
          { divider: true },
          {
            label: 'Delete Screen',
            icon: 'delete',
            danger: true,
            action: function () {
              var name = page.name;
              S.State.deletePage(pageId);
              if (S.App) S.App.refresh('all');
              U.toast('Deleted screen “' + name + '”');
            }
          }
        ]);
      });
    },

    /* =========================================================
       3. LAYERS PANEL RIGHT CLICK
       ========================================================= */
    bindLayers: function () {
      var self = this;
      var list = document.getElementById('layers');
      if (!list) return;

      list.addEventListener('contextmenu', function (e) {
        var li = e.target.closest('.layer');
        if (!li) return;
        e.preventDefault();
        e.stopPropagation();

        var blockId = li.getAttribute('data-id');
        if (S.App) S.App.select(blockId);
        var block = S.App ? S.App.blockById(blockId) : null;
        if (!block) return;
        var def = S.components[block.type] || { label: block.type, icon: 'widgets' };

        self.open(e.clientX, e.clientY, def.label, 'Layer · ' + block.type, [
          {
            label: 'Select on Canvas',
            icon: 'ads_click',
            action: function () {
              if (S.App) S.App.select(blockId);
            }
          },
          {
            label: 'Change Icon...',
            icon: 'palette',
            action: function () {
              if (S.IconSwitcher) {
                var pKey = block.props.leadingIcon !== undefined ? 'leadingIcon' : 'icon';
                var curI = block.props[pKey] || def.icon || 'star';
                S.IconSwitcher.open({
                  cmpId: blockId,
                  cmpLabel: def.label,
                  propKey: pKey,
                  currentIcon: curI,
                  el: li
                }, e);
              }
            }
          },
          {
            label: 'Link / Connect to Screen...',
            icon: 'link',
            action: function () {
              self.openLinkPicker(blockId);
            }
          },
          { divider: true },
          {
            label: 'Duplicate Layer',
            icon: 'content_copy',
            action: function () { if (S.App) S.App.duplicateSelected(blockId); }
          },
          {
            label: 'Move Up',
            icon: 'arrow_upward',
            action: function () { if (S.App) S.App.moveSelected(-1, blockId); }
          },
          {
            label: 'Move Down',
            icon: 'arrow_downward',
            action: function () { if (S.App) S.App.moveSelected(1, blockId); }
          },
          {
            label: block.locked ? 'Unlock Layer' : 'Lock Layer',
            icon: block.locked ? 'lock_open' : 'lock',
            action: function () { if (S.App) S.App.toggleLock(blockId); }
          },
          {
            label: block.hidden ? 'Show Layer' : 'Hide Layer',
            icon: block.hidden ? 'visibility' : 'visibility_off',
            action: function () { if (S.App) S.App.toggleHidden(blockId); }
          },
          { divider: true },
          {
            label: 'Delete Layer',
            icon: 'delete',
            danger: true,
            action: function () { if (S.App) S.App.deleteSelected(blockId); }
          }
        ]);
      });
    },

    /* =========================================================
       4. UNIVERSAL LINK / DESTINATION PICKER MODAL
       ========================================================= */
    openLinkPicker: function (blockId) {
      var modal = this.linkModal || document.getElementById('ctx-link-modal');
      var body = document.getElementById('clm-body');
      var title = document.getElementById('clm-title');
      var sub = document.getElementById('clm-subtitle');
      if (!modal || !body) return;

      var block = S.App ? S.App.blockById(blockId) : null;
      var def = block ? S.components[block.type] : null;
      var label = def ? def.label : 'Block';
      var currentTarget = (block && block.props && block.props.navTarget) || '';

      if (title) title.textContent = 'Link “' + label + '” to Destination';
      if (sub) sub.textContent = currentTarget ? 'Current destination: ' + currentTarget : 'Choose a screen or action to link';

      var d = S.State.data;
      var pages = (d && Array.isArray(d.pages)) ? d.pages : [];

      var html = '<div class="clm-section-title">Existing Screens</div><div class="clm-grid">';

      pages.forEach(function (page) {
        var isCurrent = page.id === d.activePageId;
        var isLinked = currentTarget === page.id || currentTarget === page.name;
        html += '<button type="button" class="clm-opt' + (isLinked ? ' active' : '') + '" data-target-id="' + esc(page.id) + '">' +
          '<span class="mi clm-opt-ico">' + esc(page.icon ? (S.iconName ? S.iconName(page.icon) : page.icon) : 'smartphone') + '</span>' +
          '<div class="clm-opt-meta"><strong>' + esc(page.name) + '</strong>' +
          '<small>' + (isCurrent ? 'Current screen · ' : '') + (page.screen ? page.screen.length : 0) + ' blocks</small></div>' +
          (isLinked ? '<span class="mi clm-check">check_circle</span>' : '') +
          '</button>';
      });

      html += '</div>';

      html += '<div class="clm-section-title">Special Destinations &amp; Overlays</div><div class="clm-grid">';

      var specials = [
        { id: 'search_overlay', name: 'Search Overlay Modal', sub: 'Interactive search sheet', icon: 'search' },
        { id: 'menu', name: '3-Dot More Menu', sub: 'Popup actions menu', icon: 'more_vert' },
        { id: 'drawer', name: 'Navigation Drawer', sub: 'Left slide-out panel', icon: 'menu' },
        { id: '__create_search__', name: '+ Create Search Screen & Link', sub: 'Dedicated search page', icon: 'manage_search' },
        { id: '__create_settings__', name: '+ Create Settings Screen & Link', sub: 'Settings & preferences', icon: 'settings' },
        { id: '__create_blank__', name: '+ Create New Blank Screen & Link', sub: 'Fresh empty canvas', icon: 'note_add' }
      ];

      specials.forEach(function (sp) {
        var isLinked = currentTarget === sp.id;
        html += '<button type="button" class="clm-opt' + (isLinked ? ' active' : '') + '" data-target-id="' + esc(sp.id) + '">' +
          '<span class="mi clm-opt-ico">' + esc(sp.icon) + '</span>' +
          '<div class="clm-opt-meta"><strong>' + esc(sp.name) + '</strong><small>' + esc(sp.sub) + '</small></div>' +
          (isLinked ? '<span class="mi clm-check">check_circle</span>' : '') +
          '</button>';
      });

      html += '</div>';

      html += '<div class="clm-section-title">External URL / Web Link</div>';
      html += '<div class="clm-url-row">' +
        '<span class="mi">public</span>' +
        '<input type="url" id="clm-url-input" placeholder="https://example.com" value="' + (currentTarget.indexOf('http') === 0 ? esc(currentTarget) : '') + '">' +
        '<button type="button" class="tb-btn primary small" id="clm-url-apply">Set URL</button>' +
        '</div>';

      if (currentTarget) {
        html += '<div class="clm-footer-actions">' +
          '<button type="button" class="tb-btn danger small" id="clm-unlink"><span class="mi">link_off</span><span>Remove Link</span></button>' +
          '</div>';
      }

      body.innerHTML = html;
      modal.hidden = false;

      var self = this;
      body.onclick = function (e) {
        var btn = e.target.closest('[data-target-id]');
        if (btn) {
          var tId = btn.getAttribute('data-target-id');
          if (tId === '__create_search__') {
            var searchPage = S.State.addPage('Search', { icon: 'msr:search' });
            if (searchPage && S.makeBlock) {
              searchPage.screen = [
                S.makeBlock('appbar', { title: 'Search', leading: true, leadingIcon: 'arrow_back' }),
                S.makeBlock('searchbar', { placeholder: 'Search anything...' }),
                S.makeBlock('card', { title: 'Recent Searches', body: 'No recent searches yet.' })
              ].filter(Boolean);
            }
            tId = searchPage ? searchPage.id : 'search';
          } else if (tId === '__create_settings__') {
            if (S.createSettingsScreen) {
              var sp = S.createSettingsScreen('Settings');
              tId = sp ? sp.id : 'settings';
            } else {
              var sp2 = S.State.addPage('Settings', { icon: 'msr:settings' });
              tId = sp2 ? sp2.id : 'settings';
            }
          } else if (tId === '__create_blank__') {
            var bp = S.State.addPage(null, { blank: true, screen: [] });
            tId = bp ? bp.id : 'screen';
          }

          if (block && block.props) {
            block.props.navTarget = tId;
            S.State.commit('prop:' + blockId + ':navTarget');
            if (S.App) S.App.refresh('structure');
            U.toast('Linked to ' + tId);
          }
          self.closeLinkPicker();
          return;
        }

        if (e.target.closest('#clm-unlink')) {
          if (block && block.props) {
            delete block.props.navTarget;
            S.State.commit('prop:' + blockId + ':navTarget');
            if (S.App) S.App.refresh('structure');
            U.toast('Link removed');
          }
          self.closeLinkPicker();
          return;
        }
      };

      var urlBtn = document.getElementById('clm-url-apply');
      var urlInput = document.getElementById('clm-url-input');
      if (urlBtn && urlInput) {
        urlBtn.onclick = function () {
          var val = urlInput.value.trim();
          if (val) {
            if (!/^https?:\/\//i.test(val)) val = 'https://' + val;
            if (block && block.props) {
              block.props.navTarget = val;
              S.State.commit('prop:' + blockId + ':navTarget');
              if (S.App) S.App.refresh('structure');
              U.toast('Linked to ' + val);
            }
            self.closeLinkPicker();
          }
        };
      }
    },

    closeLinkPicker: function () {
      var modal = this.linkModal || document.getElementById('ctx-link-modal');
      if (modal) modal.hidden = true;
    },

    /* =========================================================
       5. SEARCH CONFIGURATION MODAL
       ========================================================= */
    openSearchConfig: function (blockId) {
      var block = S.App ? S.App.blockById(blockId) : null;
      if (!block) return;

      var currentMode = (S.State.data.ui && S.State.data.ui.search && S.State.data.ui.search.mode) || 'overlay';
      var choices = [
        '1) Open Search Overlay (Animated search sheet over canvas)',
        '2) Link to Dedicated Search Page (Screen)',
        '3) Customize Search Placeholder text'
      ];

      var ans = prompt(
        'Configure Search Behavior:\n\n' +
        '1: Open Search Overlay Modal\n' +
        '2: Link to Dedicated Search Screen\n' +
        '3: Change Placeholder Text\n\n' +
        'Enter 1, 2, or 3:',
        '1'
      );

      if (ans === '1') {
        if (!S.State.data.ui) S.State.data.ui = {};
        if (!S.State.data.ui.search) S.State.data.ui.search = {};
        S.State.data.ui.search.mode = 'overlay';
        if (block.props) block.props.navTarget = 'search_overlay';
        S.State.commit('search:mode:overlay');
        if (S.App) S.App.refresh('structure');
        U.toast('Search set to interactive overlay modal');
      } else if (ans === '2') {
        this.openLinkPicker(blockId);
      } else if (ans === '3') {
        var ph = prompt('Enter placeholder text:', block.props.placeholder || 'Search...');
        if (ph !== null) {
          block.props.placeholder = ph;
          S.State.commit('prop:' + blockId + ':placeholder');
          if (S.App) S.App.refresh('structure');
          U.toast('Placeholder updated');
        }
      }
    }
  };
})();
