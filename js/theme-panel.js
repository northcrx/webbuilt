/* Right panel: colours, radius, density, dark mode. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  var PRESETS = [
    { name: 'Violet', primary: '#6750A4' },
    { name: 'Ocean', primary: '#0B6BCB' },
    { name: 'Forest', primary: '#2E7D32' },
    { name: 'Sunset', primary: '#C4501E' },
    { name: 'Rose', primary: '#B3265C' },
    { name: 'Slate', primary: '#4A5568' },
    { name: 'Teal', primary: '#00796B' },
    { name: 'Amber', primary: '#B26A00' }
  ];

  var Theme = S.Theme = {
    presets: PRESETS,

    init: function () {
      var box = document.getElementById('tab-theme');
      if (!box) return;
      box.innerHTML =
        '<div class="sect">' +
        '<div class="sect-title">Accent</div>' +
        '<div class="swatches" id="theme-swatches">' +
        PRESETS.map(function (p) {
          return '<button class="swatch" data-primary="' + p.primary + '" title="' + esc(p.name) + '" style="background:' + p.primary + '"></button>';
        }).join('') + '</div>' +
        '<div class="f-row"><div class="f-label">Custom colour</div>' +
        '<div class="color-row"><input type="color" id="theme-color" value="#6750a4">' +
        '<input class="f-input" id="theme-hex" value="#6750A4" spellcheck="false"></div></div>' +
        '<div id="theme-roles" style="display:flex;gap:6px;margin-top:4px"></div>' +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Shape</div>' +
        '<div class="f-row"><div class="f-label"><span>Corner radius</span><span class="val" id="theme-radius-val">18px</span></div>' +
        '<input class="f-range" type="range" id="theme-radius" min="0" max="32" step="1" value="18"></div>' +
        '<div class="f-row"><div class="f-label">Density</div>' +
        '<div class="seg" id="theme-density">' +
        '<button data-density="compact">Compact</button><button data-density="normal">Normal</button><button data-density="comfy">Comfortable</button>' +
        '</div></div>' +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Appearance</div>' +
        '<button class="f-toggle" id="theme-dark"><span class="tgl"></span><span>Dark mode</span></button>' +
        '<p class="empty" style="margin:10px 0 0">Accent colours are expanded into a full Material palette automatically.</p>' +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Icons</div>' +
        '<div class="f-row"><div class="f-label"><span>Weight</span><span class="val" id="theme-iw-val">400</span></div>' +
        '<input class="f-range" type="range" id="theme-iw" min="100" max="700" step="20" value="400"></div>' +
        '<div class="f-row"><div class="f-label"><span>Fill</span><span class="val" id="theme-if-val">0</span></div>' +
        '<input class="f-range" type="range" id="theme-if" min="0" max="1" step="1" value="0"></div>' +
        '<div class="f-row"><div class="f-label"><span>Lucide stroke</span><span class="val" id="theme-is-val">1.8</span></div>' +
        '<input class="f-range" type="range" id="theme-is" min="1" max="3" step="0.1" value="1.8"></div>' +
        '</div>' +

        '<button class="tb-btn" id="theme-reset" style="width:100%"><span class="mi">restart_alt</span><span>Reset theme</span></button>';

      this.bind(box);
      this.sync();
    },

    bind: function (box) {
      var self = this;

      box.addEventListener('click', function (e) {
        var sw = e.target.closest('.swatch');
        if (sw) { self.apply(sw.getAttribute('data-primary')); return; }

        var den = e.target.closest('[data-density]');
        if (den) {
          S.State.data.theme.density = den.getAttribute('data-density');
          self.sync();
          S.Render.drawScreen();
          S.State.commit('theme:density');
          return;
        }

        if (e.target.closest('#theme-dark')) { self.setDark(!S.State.data.theme.dark); return; }

        if (e.target.closest('#theme-reset')) {
          S.State.data.theme = S.defaultState().theme;
          self.sync();
          S.Render.drawScreen();
          S.State.commit('theme:reset');
          U.toast('Theme reset');
        }
      });

      box.addEventListener('input', function (e) {
        var el = e.target;

        if (el.id === 'theme-color') { self.apply(el.value, true); return; }
        if (el.id === 'theme-hex') {
          var v = el.value.trim();
          if (/^#?[0-9a-fA-F]{6}$/.test(v)) self.apply(v.charAt(0) === '#' ? v : '#' + v, true);
          return;
        }
        if (el.id === 'theme-radius') {
          S.State.data.theme.radius = Number(el.value);
          document.getElementById('theme-radius-val').textContent = el.value + 'px';
          S.Render.drawScreen();
          S.State.commit('theme:radius');
          return;
        }
        if (el.id === 'theme-iw') {
          S.State.data.theme.icons.weight = Number(el.value);
          document.getElementById('theme-iw-val').textContent = el.value;
          S.Render.drawScreen();
          S.State.commit('theme:icon-weight');
          return;
        }
        if (el.id === 'theme-if') {
          S.State.data.theme.icons.fill = Number(el.value);
          document.getElementById('theme-if-val').textContent = el.value;
          S.Render.drawScreen();
          S.State.commit('theme:icon-fill');
          return;
        }
        if (el.id === 'theme-is') {
          S.State.data.theme.icons.stroke = Number(el.value);
          document.getElementById('theme-is-val').textContent = el.value;
          S.Render.drawScreen();
          S.State.commit('theme:icon-stroke');
        }
      });
    },

    apply: function (primary, fromPicker) {
      S.State.data.theme.primary = primary;
      S.Render.drawScreen();
      S.State.commit('theme:primary');
      this.sync();
      if (!fromPicker) U.toast('Accent applied');
    },

    setDark: function (on) {
      S.State.data.theme.dark = !!on;
      S.Render.drawScreen();
      S.State.commit('theme:dark');
      this.sync();
    },

    sync: function () {
      var t = S.State.data.theme;
      var box = document.getElementById('tab-theme');
      if (!box) return;

      box.querySelectorAll('.swatch').forEach(function (sw) {
        sw.classList.toggle('active', sw.getAttribute('data-primary').toLowerCase() === String(t.primary).toLowerCase());
      });

      var color = document.getElementById('theme-color');
      var hex = document.getElementById('theme-hex');
      if (color) color.value = t.primary;
      if (hex && document.activeElement !== hex) hex.value = String(t.primary).toUpperCase();

      var radius = document.getElementById('theme-radius');
      if (radius) radius.value = t.radius;
      var rv = document.getElementById('theme-radius-val');
      if (rv) rv.textContent = t.radius + 'px';

      box.querySelectorAll('[data-density]').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-density') === t.density);
      });

      var dark = document.getElementById('theme-dark');
      if (dark) dark.classList.toggle('on', !!t.dark);

      var iw = document.getElementById('theme-iw');
      var ifill = document.getElementById('theme-if');
      var istroke = document.getElementById('theme-is');
      if (iw) iw.value = t.icons.weight;
      if (ifill) ifill.value = t.icons.fill;
      if (istroke) istroke.value = t.icons.stroke;
      var iwv = document.getElementById('theme-iw-val');
      if (iwv) iwv.textContent = t.icons.weight;
      var ifv = document.getElementById('theme-if-val');
      if (ifv) ifv.textContent = t.icons.fill;
      var isv = document.getElementById('theme-is-val');
      if (isv) isv.textContent = t.icons.stroke;

      var roles = document.getElementById('theme-roles');
      if (roles) {
        var p = t.primary;
        var pc = t.dark ? U.mix(p, '#000000', 0.5) : U.mix(p, '#ffffff', 0.8);
        var ter = t.dark ? U.mix(p, '#ffb4a9', 0.42) : U.mix(p, '#7d5260', 0.42);
        var sur = t.dark ? '#141218' : '#fef7ff';
        var chip = function (label, c) {
          return '<span style="flex:1;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.14)">' +
            '<span style="display:block;height:22px;background:' + c + '"></span>' +
            '<span style="display:block;font-size:8.5px;color:#9a97ad;padding:3px 4px;text-align:center;background:#0b0b10">' + label + '</span></span>';
        };
        roles.innerHTML = chip('primary', p) + chip('container', pc) + chip('tertiary', ter) + chip('surface', sur);
      }
    }
  };
})();
