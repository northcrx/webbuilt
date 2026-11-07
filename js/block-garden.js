/* Droid Lab - Widget Garden & Custom Block Studio
   Allows users to visually build, draw, design, and plant custom blocks
   with multiple designs, icons, dropdown menus, and Android-related widgets. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util || { esc: function (s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); } };
  var esc = U.esc;

  var CUSTOM_BLOCKS_KEY = 'droidlab.customBlocks.v1';

  var BlockGarden = S.BlockGarden = {
    modalEl: null,
    canvasEl: null,
    ctx: null,
    isDrawing: false,
    penColor: '#5b5bd6',
    penWidth: 3,
    drawingPaths: [],
    currentPath: [],

    // Current state of the block being created
    draft: {
      id: '',
      title: 'Garden Feature Card',
      subtitle: 'Interactive custom widget with dropdown menu',
      archetype: 'android_card', // 'android_card' | 'android_tiles' | 'android_dial' | 'web_dropdown_card' | 'garden_drawing_pad'
      icon: 'yard',
      target: 'all', // 'all' | 'app' | 'web'
      cardStyle: 'elevated', // 'elevated' | 'outlined' | 'glass' | 'gradient'
      accentColor: '#5b5bd6',
      hasDropdown: true,
      dropdownItems: 'Option 1: Quick Action | Option 2: Settings | Option 3: Export Data',
      chips: 'Design, Android M3, Garden',
      drawingData: null
    },

    init: function () {
      this.loadSavedBlocks();
      this.bindTriggers();
    },

    loadSavedBlocks: function () {
      var saved = [];
      try {
        saved = JSON.parse(localStorage.getItem(CUSTOM_BLOCKS_KEY) || '[]');
      } catch (e) {
        saved = [];
      }
      var self = this;
      if (Array.isArray(saved)) {
        saved.forEach(function (def) {
          self.registerCustomComponent(def);
        });
      }
    },

    saveSavedBlocks: function (list) {
      try {
        localStorage.setItem(CUSTOM_BLOCKS_KEY, JSON.stringify(list));
      } catch (e) {}
    },

    getSavedBlocksList: function () {
      try {
        return JSON.parse(localStorage.getItem(CUSTOM_BLOCKS_KEY) || '[]');
      } catch (e) {
        return [];
      }
    },

    bindTriggers: function () {
      var self = this;
      document.addEventListener('click', function (e) {
        var gardenBtn = e.target.closest('#btn-open-garden, [data-action="open-garden"], [data-sd-action="garden"]');
        if (gardenBtn) {
          e.preventDefault();
          self.open();
        }
      });
    },

    open: function (archetype) {
      if (archetype) this.draft.archetype = archetype;
      this.draft.id = 'custom_garden_' + Date.now();
      this.drawingPaths = [];
      this.currentPath = [];
      this.draft.drawingData = null;

      this.ensureModal();
      this.render();
      if (this.modalEl) {
        this.modalEl.removeAttribute('hidden');
        this.modalEl.classList.add('is-open');
        this.modalEl.setAttribute('aria-hidden', 'false');
      }
      var self = this;
      setTimeout(function () {
        self.initDrawingCanvas();
      }, 50);
    },

    close: function () {
      if (this.modalEl) {
        this.modalEl.setAttribute('hidden', '');
        this.modalEl.classList.remove('is-open');
        this.modalEl.setAttribute('aria-hidden', 'true');
      }
    },

    ensureModal: function () {
      if (this.modalEl) return;
      var div = document.createElement('div');
      div.id = 'block-garden-modal';
      div.className = 'block-garden-modal';
      div.setAttribute('role', 'dialog');
      div.setAttribute('aria-modal', 'true');
      div.setAttribute('aria-label', 'Widget Garden Studio');
      div.setAttribute('hidden', '');
      document.body.appendChild(div);
      this.modalEl = div;
      this.bindModalEvents();
    },

    bindModalEvents: function () {
      var self = this;
      if (!this.modalEl) return;

      this.modalEl.addEventListener('click', function (e) {
        if (e.target.closest('[data-bg-close]')) {
          e.preventDefault();
          self.close();
          return;
        }

        // Archetype selector
        var archBtn = e.target.closest('[data-bg-arch]');
        if (archBtn) {
          self.draft.archetype = archBtn.getAttribute('data-bg-arch');
          if (self.draft.archetype === 'android_tiles') {
            self.draft.title = 'Quick Settings Grid';
            self.draft.subtitle = 'Android 15 Control Center Tiles';
            self.draft.icon = 'settings';
          } else if (self.draft.archetype === 'android_dial') {
            self.draft.title = 'Android Speed Dial FAB';
            self.draft.subtitle = 'Floating action dial with sub-actions';
            self.draft.icon = 'add_circle';
          } else if (self.draft.archetype === 'web_dropdown_card') {
            self.draft.title = 'Mega Menu Dropdown Garden';
            self.draft.subtitle = 'Curated links, icons & category badges';
            self.draft.icon = 'menu_open';
          } else if (self.draft.archetype === 'garden_drawing_pad') {
            self.draft.title = 'Visual Sketch Pad';
            self.draft.subtitle = 'Interactive doodle & canvas garden';
            self.draft.icon = 'draw';
          } else {
            self.draft.title = 'Garden Feature Card';
            self.draft.subtitle = 'Interactive custom widget with dropdown menu';
            self.draft.icon = 'yard';
          }
          self.render();
          self.initDrawingCanvas();
          return;
        }

        // Card style selector
        var styleBtn = e.target.closest('[data-bg-style]');
        if (styleBtn) {
          self.draft.cardStyle = styleBtn.getAttribute('data-bg-style');
          self.render();
          self.initDrawingCanvas();
          return;
        }

        // Color selector
        var colBtn = e.target.closest('[data-bg-color]');
        if (colBtn) {
          self.draft.accentColor = colBtn.getAttribute('data-bg-color');
          self.penColor = self.draft.accentColor;
          self.render();
          self.initDrawingCanvas();
          return;
        }

        // Pen color selector in drawing tool
        var penColBtn = e.target.closest('[data-pen-color]');
        if (penColBtn) {
          self.penColor = penColBtn.getAttribute('data-pen-color');
          self.modalEl.querySelectorAll('[data-pen-color]').forEach(function (b) { b.classList.remove('active'); });
          penColBtn.classList.add('active');
          return;
        }

        // Clear drawing
        if (e.target.closest('#bg-clear-canvas')) {
          self.drawingPaths = [];
          self.currentPath = [];
          self.draft.drawingData = null;
          self.redrawCanvas();
          self.updateLivePreview();
          return;
        }

        // Save & plant custom block
        if (e.target.closest('#bg-save-btn')) {
          e.preventDefault();
          self.saveAndPlantBlock();
        }
      });

      this.modalEl.addEventListener('input', function (e) {
        var tInput = e.target.closest('#bg-input-title');
        if (tInput) {
          self.draft.title = tInput.value;
          self.updateLivePreview();
        }
        var sInput = e.target.closest('#bg-input-sub');
        if (sInput) {
          self.draft.subtitle = sInput.value;
          self.updateLivePreview();
        }
        var ddInput = e.target.closest('#bg-input-dropdown');
        if (ddInput) {
          self.draft.dropdownItems = ddInput.value;
          self.updateLivePreview();
        }
        var icoInput = e.target.closest('#bg-input-icon');
        if (icoInput) {
          self.draft.icon = icoInput.value;
          self.updateLivePreview();
        }
      });
    },

    render: function () {
      if (!this.modalEl) return;
      var d = this.draft;

      var archetypes = [
        { id: 'android_card', label: 'Android Action Card', icon: 'smartphone', desc: 'Material 3 card with icon, chips & dropdown' },
        { id: 'android_tiles', label: 'Quick Settings Tiles', icon: 'grid_view', desc: 'Android 14/15 quick toggle tiles' },
        { id: 'android_dial', label: 'Floating Action Dial', icon: 'add_circle', desc: 'Speed dial FAB with blooming icons' },
        { id: 'web_dropdown_card', label: 'Dropdown Mega Card', icon: 'menu_open', desc: 'Rich dropdown garden with category icons' },
        { id: 'garden_drawing_pad', label: 'Drawing & Canvas Pad', icon: 'draw', desc: 'Interactive canvas sketch with live pen' }
      ];

      var archHtml = archetypes.map(function (a) {
        var on = a.id === d.archetype;
        return '<button type="button" class="bg-arch-card' + (on ? ' is-active' : '') + '" data-bg-arch="' + a.id + '">' +
          '<span class="mi bg-arch-ico">' + a.icon + '</span>' +
          '<div class="bg-arch-meta"><strong>' + esc(a.label) + '</strong><small>' + esc(a.desc) + '</small></div>' +
          '</button>';
      }).join('');

      var styles = [
        { id: 'elevated', label: 'Elevated Card' },
        { id: 'outlined', label: 'Clean Outlined' },
        { id: 'glass', label: 'Frosted Glass' },
        { id: 'gradient', label: 'Vibrant Gradient' }
      ];

      var styleHtml = styles.map(function (st) {
        var on = st.id === d.cardStyle;
        return '<button type="button" class="bg-style-pill' + (on ? ' is-active' : '') + '" data-bg-style="' + st.id + '">' +
          esc(st.label) + '</button>';
      }).join('');

      var colors = ['#5b5bd6', '#0f9d77', '#c2410c', '#e11d48', '#8b5cf6', '#0284c7', '#d97706'];
      var colorHtml = colors.map(function (c) {
        var on = c === d.accentColor;
        return '<button type="button" class="bg-col-dot' + (on ? ' is-active' : '') + '" data-bg-color="' + c + '" style="background:' + c + '" title="' + c + '"></button>';
      }).join('');

      var penColors = ['#5b5bd6', '#0f9d77', '#e11d48', '#d97706', '#ffffff', '#111827'];
      var penColorHtml = penColors.map(function (c) {
        var on = c === self.penColor;
        return '<button type="button" class="bg-pen-dot' + (on ? ' active' : '') + '" data-pen-color="' + c + '" style="background:' + c + '"></button>';
      }).join('');

      this.modalEl.innerHTML =
        '<div class="bg-modal-scrim" data-bg-close="1"></div>' +
        '<div class="bg-modal-dialog">' +
        '<div class="bg-modal-header">' +
        '<div class="bg-title-wrap">' +
        '<span class="mi bg-header-ico">yard</span>' +
        '<div><strong>Widget Garden &amp; Custom Block Studio</strong>' +
        '<small>Design custom Android &amp; Website widgets with dropdowns, icons &amp; sketch drawing</small></div>' +
        '</div>' +
        '<button type="button" class="bg-modal-close" data-bg-close="1" title="Close"><span class="mi">close</span></button>' +
        '</div>' +

        '<div class="bg-modal-body">' +
        // Left Column: Designer Form & Garden Drawing Tool
        '<div class="bg-col-designer">' +
        '<div class="bg-section-title">1. Select Widget Archetype</div>' +
        '<div class="bg-arch-grid">' + archHtml + '</div>' +

        '<div class="bg-section-title" style="margin-top:16px;">2. Customize Design &amp; Typography</div>' +
        '<div class="bg-field-group">' +
        '<label class="bg-label">Widget Title</label>' +
        '<input type="text" class="bg-input" id="bg-input-title" value="' + esc(d.title) + '">' +
        '</div>' +
        '<div class="bg-field-group">' +
        '<label class="bg-label">Subtitle / Description</label>' +
        '<input type="text" class="bg-input" id="bg-input-sub" value="' + esc(d.subtitle) + '">' +
        '</div>' +
        '<div class="bg-row-2">' +
        '<div class="bg-field-group">' +
        '<label class="bg-label">Leading Icon</label>' +
        '<input type="text" class="bg-input" id="bg-input-icon" value="' + esc(d.icon) + '">' +
        '</div>' +
        '<div class="bg-field-group">' +
        '<label class="bg-label">Card Style</label>' +
        '<div class="bg-style-row">' + styleHtml + '</div>' +
        '</div>' +
        '</div>' +

        '<div class="bg-field-group">' +
        '<label class="bg-label">Accent Color</label>' +
        '<div class="bg-color-row">' + colorHtml + '</div>' +
        '</div>' +

        '<div class="bg-field-group">' +
        '<label class="bg-label">Dropdown Menu Items (Separated by |)</label>' +
        '<input type="text" class="bg-input" id="bg-input-dropdown" value="' + esc(d.dropdownItems) + '">' +
        '</div>' +

        // Interactive Garden Canvas Drawing Pad
        '<div class="bg-section-title" style="margin-top:16px;">3. Garden Sketch &amp; Drawing Pad</div>' +
        '<div class="bg-drawing-container">' +
        '<div class="bg-canvas-tools">' +
        '<span>Draw diagram / doodle:</span>' +
        '<div class="bg-pen-colors">' + penColorHtml + '</div>' +
        '<button type="button" class="bg-btn-clear" id="bg-clear-canvas"><span class="mi">delete</span>Clear</button>' +
        '</div>' +
        '<div class="bg-canvas-box">' +
        '<canvas id="bg-drawing-canvas" width="380" height="150"></canvas>' +
        '</div>' +
        '</div>' +
        '</div>' +

        // Right Column: Live Interactive Preview
        '<div class="bg-col-preview">' +
        '<div class="bg-section-title">Live Widget Preview</div>' +
        '<div class="bg-preview-stage" id="bg-preview-stage"></div>' +
        '<div class="bg-plant-action">' +
        '<button type="button" class="bg-plant-btn" id="bg-save-btn">' +
        '<span class="mi">local_florist</span><span>Plant Widget in Blocks Palette</span>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

      this.updateLivePreview();
    },

    initDrawingCanvas: function () {
      var canvas = document.getElementById('bg-drawing-canvas');
      if (!canvas) return;
      this.canvasEl = canvas;
      this.ctx = canvas.getContext('2d');
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.redrawCanvas();

      var self = this;
      canvas.onpointerdown = function (e) {
        self.isDrawing = true;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        self.currentPath = [{ x: x, y: y, color: self.penColor, width: self.penWidth }];
        self.drawingPaths.push(self.currentPath);
        self.redrawCanvas();
      };

      canvas.onpointermove = function (e) {
        if (!self.isDrawing) return;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        self.currentPath.push({ x: x, y: y, color: self.penColor, width: self.penWidth });
        self.redrawCanvas();
      };

      canvas.onpointerup = canvas.onpointercancel = function () {
        if (self.isDrawing) {
          self.isDrawing = false;
          try {
            self.draft.drawingData = canvas.toDataURL('image/png');
          } catch (e) {}
          self.updateLivePreview();
        }
      };
    },

    redrawCanvas: function () {
      if (!this.ctx || !this.canvasEl) return;
      var ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      ctx.fillStyle = '#16151f';
      ctx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);

      // Grid dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (var x = 15; x < this.canvasEl.width; x += 15) {
        for (var y = 15; y < this.canvasEl.height; y += 15) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      var self = this;
      this.drawingPaths.forEach(function (path) {
        if (path.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = path[0].color || self.penColor;
        ctx.lineWidth = path[0].width || 3;
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      });
    },

    renderWidgetHtml: function (props) {
      props = props || this.draft;
      var arch = props.archetype || 'android_card';
      var cardStyle = props.cardStyle || 'elevated';
      var color = props.accentColor || '#5b5bd6';
      var title = props.title || 'Custom Widget';
      var sub = props.subtitle || '';
      var icon = props.icon || 'yard';
      var ddList = String(props.dropdownItems || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);

      var ddHtml = '';
      if (props.hasDropdown && ddList.length) {
        ddHtml = '<div class="cg-dropdown-wrap">' +
          '<button type="button" class="cg-dropdown-toggle">' +
          '<span>Options</span><span class="mi">expand_more</span>' +
          '</button>' +
          '<div class="cg-dropdown-menu">' +
          ddList.map(function (it) {
            return '<button type="button" class="cg-dd-item"><span class="mi">arrow_right</span><span>' + esc(it) + '</span></button>';
          }).join('') +
          '</div>' +
          '</div>';
      }

      var drawImg = props.drawingData ? '<div class="cg-drawing-render"><img src="' + esc(props.drawingData) + '" alt="Garden Sketch"></div>' : '';

      if (arch === 'android_tiles') {
        var tiles = [
          { icon: 'wifi', title: 'Internet', sub: '5G Home' },
          { icon: 'bluetooth', title: 'Bluetooth', sub: 'AirPods Pro' },
          { icon: 'flashlight_on', title: 'Flashlight', sub: 'High' },
          { icon: 'do_not_disturb_on', title: 'Focus Mode', sub: 'Work' }
        ];
        return '<div class="cg-widget cg-android-tiles cg-style-' + cardStyle + '" style="--cg-accent:' + color + '">' +
          '<div class="cg-head"><span class="mi">' + esc(icon) + '</span><strong>' + esc(title) + '</strong>' + ddHtml + '</div>' +
          '<div class="cg-tiles-grid">' +
          tiles.map(function (t, i) {
            var active = i < 2;
            return '<div class="cg-tile' + (active ? ' is-active' : '') + '">' +
              '<div class="cg-tile-ico"><span class="mi">' + t.icon + '</span></div>' +
              '<div class="cg-tile-info"><strong>' + t.title + '</strong><small>' + t.sub + '</small></div>' +
              '</div>';
          }).join('') +
          '</div>' +
          drawImg +
          '</div>';
      }

      if (arch === 'android_dial') {
        return '<div class="cg-widget cg-android-dial cg-style-' + cardStyle + '" style="--cg-accent:' + color + '">' +
          '<div class="cg-head"><span class="mi">' + esc(icon) + '</span><div><strong>' + esc(title) + '</strong><small>' + esc(sub) + '</small></div></div>' +
          '<div class="cg-dial-bloom">' +
          '<button type="button" class="cg-dial-chip"><span class="mi">camera_alt</span>Photo</button>' +
          '<button type="button" class="cg-dial-chip"><span class="mi">mic</span>Audio</button>' +
          '<button type="button" class="cg-dial-chip"><span class="mi">palette</span>Style</button>' +
          '<button type="button" class="cg-dial-fab"><span class="mi">add</span></button>' +
          '</div>' +
          drawImg +
          '</div>';
      }

      if (arch === 'web_dropdown_card') {
        return '<div class="cg-widget cg-web-dropdown cg-style-' + cardStyle + '" style="--cg-accent:' + color + '">' +
          '<div class="cg-head"><span class="mi">' + esc(icon) + '</span><strong>' + esc(title) + '</strong>' +
          '<span class="cg-badge">Mega Menu</span></div>' +
          '<small class="cg-sub">' + esc(sub) + '</small>' +
          '<div class="cg-web-links">' +
          ddList.map(function (it, idx) {
            var icos = ['auto_stories', 'shopping_bag', 'tune', 'diamond'];
            return '<div class="cg-link-row"><span class="mi">' + (icos[idx % icos.length]) + '</span><div><strong>' + esc(it) + '</strong><small>Curated collection</small></div></div>';
          }).join('') +
          '</div>' +
          drawImg +
          '</div>';
      }

      if (arch === 'garden_drawing_pad') {
        return '<div class="cg-widget cg-drawing-widget cg-style-' + cardStyle + '" style="--cg-accent:' + color + '">' +
          '<div class="cg-head"><span class="mi">' + esc(icon) + '</span><div><strong>' + esc(title) + '</strong><small>' + esc(sub) + '</small></div>' + ddHtml + '</div>' +
          (drawImg || '<div class="cg-empty-sketch"><span class="mi">gesture</span><span>Draw in the sketch pad on the left to display here</span></div>') +
          '</div>';
      }

      // Default: Android Action Card
      return '<div class="cg-widget cg-action-card cg-style-' + cardStyle + '" style="--cg-accent:' + color + '">' +
        '<div class="cg-head"><div class="cg-icon-box"><span class="mi">' + esc(icon) + '</span></div>' +
        '<div class="cg-info"><strong>' + esc(title) + '</strong><small>' + esc(sub) + '</small></div>' +
        ddHtml +
        '</div>' +
        drawImg +
        '<div class="cg-actions-row">' +
        '<button type="button" class="cg-btn primary"><span class="mi">check</span><span>Apply Action</span></button>' +
        '<button type="button" class="cg-btn tonal"><span class="mi">bookmark</span><span>Save</span></button>' +
        '</div>' +
        '</div>';
    },

    updateLivePreview: function () {
      var stage = document.getElementById('bg-preview-stage');
      if (!stage) return;
      stage.innerHTML = this.renderWidgetHtml(this.draft);
    },

    registerCustomComponent: function (def) {
      if (!def || !def.id) return;
      var typeKey = def.id;
      var self = this;

      S.components[typeKey] = {
        label: def.title || 'Custom Widget',
        group: 'Garden Widgets',
        icon: def.icon || 'yard',
        targets: def.target === 'all' ? ['app', 'web', 'ext'] : [def.target],
        defaults: {
          title: def.title,
          subtitle: def.subtitle,
          archetype: def.archetype,
          cardStyle: def.cardStyle,
          accentColor: def.accentColor,
          hasDropdown: def.hasDropdown,
          dropdownItems: def.dropdownItems,
          drawingData: def.drawingData
        },
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'cardStyle', label: 'Card Style', type: 'select', options: [
            ['elevated', 'Elevated'],
            ['outlined', 'Outlined'],
            ['glass', 'Frosted Glass'],
            ['gradient', 'Gradient']
          ] },
          { key: 'accentColor', label: 'Accent Color', type: 'color' },
          { key: 'dropdownItems', label: 'Dropdown Options (| separated)', type: 'text' }
        ],
        html: function (p) {
          return self.renderWidgetHtml(p);
        }
      };
    },

    saveAndPlantBlock: function () {
      var d = this.draft;
      if (!d.title) d.title = 'Custom Garden Widget';
      var blockId = 'custom_garden_' + Date.now();
      var customDef = {
        id: blockId,
        title: d.title,
        subtitle: d.subtitle,
        archetype: d.archetype,
        icon: d.icon,
        target: d.target,
        cardStyle: d.cardStyle,
        accentColor: d.accentColor,
        hasDropdown: d.hasDropdown,
        dropdownItems: d.dropdownItems,
        drawingData: d.drawingData
      };

      // 1. Register component
      this.registerCustomComponent(customDef);

      // 2. Persist to storage
      var list = this.getSavedBlocksList();
      list.unshift(customDef);
      this.saveSavedBlocks(list);

      // 3. Refresh palette
      if (S.Render && S.Render.palette) S.Render.palette();

      // 4. Also add to active screen
      if (S.State && S.State.data && S.makeBlock) {
        var newBlock = S.makeBlock(blockId);
        if (newBlock) {
          S.State.data.screen = S.State.data.screen || [];
          S.State.data.screen.push(newBlock);
          S.State.data.selectedId = newBlock.id;
          S.State.commit('garden:add:' + blockId);
          if (S.App) S.App.refresh('all');
        }
      }

      this.close();
      if (S.util && S.util.toast) {
        S.util.toast('Planted "' + d.title + '" in your Blocks Palette!');
      }
    }
  };

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { BlockGarden.init(); });
  } else {
    BlockGarden.init();
  }
})();
