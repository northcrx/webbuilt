/* Right panel: font catalogue, specimen, compare mode. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  var loaded = {};

  var Fonts = S.Fonts = {
    cat: 'All',
    query: '',

    init: function () {
      var box = document.getElementById('tab-type');
      if (!box) return;

      box.innerHTML =
        '<div class="sect">' +
        '<div class="sect-title">Current pairing</div>' +
        '<div class="f-row" style="margin-bottom:8px">' +
        '<div class="f-label"><span>Interface</span><span class="val" id="type-ui-meta"></span></div>' +
        '<div id="type-ui-name" style="font-size:22px;line-height:1.2;color:#f2efff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>' +
        '</div>' +
        '<div class="f-row">' +
        '<div class="f-label"><span>Headlines</span><span class="val" id="type-display-meta"></span></div>' +
        '<div id="type-display-name" style="font-size:22px;line-height:1.2;color:#cfc7ee;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>' +
        '</div>' +
        '</div>' +

        '<div class="specimen">' +
        '<div class="spec-label">Specimen · interface font</div>' +
        '<div class="spec-text" id="spec-text">Sphinx of black quartz, judge my vow.</div>' +
        '<div class="spec-meta" id="spec-meta"></div>' +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Text settings</div>' +
        '<div class="f-row"><div class="f-label"><span>Base size</span><span class="val" id="type-size-val">15px</span></div>' +
        '<input class="f-range" type="range" id="type-size" min="13" max="20" step="0.5" value="15"></div>' +
        '<div class="f-row"><div class="f-label">Body weight</div>' +
        '<select class="f-select" id="type-weight">' +
        '<option value="300">Light 300</option><option value="400">Regular 400</option>' +
        '<option value="500">Medium 500</option><option value="600">Semibold 600</option>' +
        '</select></div>' +
        '<div class="f-row"><div class="f-label"><span>Letter spacing</span><span class="val" id="type-spacing-val">0px</span></div>' +
        '<input class="f-range" type="range" id="type-spacing" min="-0.6" max="1.2" step="0.1" value="0"></div>' +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Find a font <span class="count" id="type-count"></span></div>' +
        '<div class="font-search-row"><input class="f-input" id="type-search" placeholder="Search 75 fonts…" spellcheck="false"></div>' +
        '<div class="cat-row" id="type-cats"></div>' +
        '<div class="font-search-row" style="margin-bottom:0">' +
        '<input class="f-input" id="type-custom" placeholder="Load any Google Font by name" spellcheck="false">' +
        '<button class="tb-btn" id="type-load">Load</button></div>' +
        '<p class="icon-hint">Tip: “UI” applies a font to everything, “Aa” applies it to headlines only, “+” adds it to the compare row.</p>' +
        '</div>' +

        '<div class="sect">' +
        '<div class="sect-title">Compare fonts <span class="count">side by side</span></div>' +
        '<button class="f-toggle" id="type-compare"><span class="tgl"></span><span>Show 3 fonts side by side</span></button>' +
        '<div class="compare-slots" id="type-compare-slots" style="margin-top:9px"></div>' +
        '<p class="other-hint" style="font-size:10.5px;color:#6c6c82;line-height:1.5;margin:0">In compare mode the phone is cloned three times with the same screen, so only the type changes.</p>' +
        '</div>' +

        '<div class="font-list" id="type-list"></div>';

      this.bind(box);

      this.renderCats();
      this.renderList();
      this.sync();

      this.load(S.State.data.theme.fonts.ui);
      this.load(S.State.data.theme.fonts.display);
      (S.State.data.compare.fonts || []).forEach(function (f) { Fonts.load(f); });
    },

    loadVisible: function () {
      var box = document.getElementById('tab-type');
      if (!box || box.hidden) return;
      var list = document.getElementById('type-list');
      if (!list) return;
      var bounds = box.getBoundingClientRect();
      var limit = bounds.bottom + 220;
      Array.prototype.forEach.call(list.querySelectorAll('.font-preview:not([data-requested])'), function (node) {
        if (node.getBoundingClientRect().top > limit) return;
        node.setAttribute('data-requested', '1');
        Fonts.load(node.getAttribute('data-font')).then(function () {
          node.classList.remove('font-loading');
        });
      });
    },

    load: function (name) {
      if (!name || loaded[name]) return Promise.resolve();
      loaded[name] = true;
      var meta = S.fonts.filter(function (f) { return f.name === name; })[0];
      var weights = meta ? meta.w : [400, 700];
      var fam = name.replace(/\s+/g, '+');
      var url;
      if (!meta || meta.cat === 'Custom' || weights.length < 2) {
        url = 'https://fonts.googleapis.com/css2?family=' + fam + '&display=swap';
      } else {
        url = 'https://fonts.googleapis.com/css2?family=' + fam + ':wght@' + weights.join(';') + '&display=swap';
      }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      if (document.fonts && document.fonts.load) {
        return document.fonts.load('400 16px "' + name + '"').catch(function () {});
      }
      return Promise.resolve();
    },

    apply: function (kind, name) {
      this.load(name);
      S.State.data.theme.fonts[kind] = name;
      S.Render.drawScreen();
      S.State.commit('font:' + kind);
      this.sync();
      U.toast(kind === 'ui' ? 'Interface font: ' + name : 'Headlines font: ' + name);
    },

    toggleCompare: function (force) {
      var c = S.State.data.compare;
      c.on = force == null ? !c.on : !!force;
      if (c.on) {
        if (!c.fonts || c.fonts.length < 3) {
          var pool = [S.State.data.theme.fonts.ui, S.State.data.theme.fonts.display, 'DM Sans'];
          c.fonts = pool.slice(0, 3);
        }
        c.fonts.slice(0, 3).forEach(function (f) { Fonts.load(f); });
      }
      S.Render.drawScreen();
      S.State.commit('compare:on');
      S.Render.chrome();
      if (S.App && S.App.fitStage) S.App.fitStage();
      this.sync();
    },

    setCompareSlot: function (index, name) {
      var c = S.State.data.compare;
      if (!c.fonts) c.fonts = [];
      while (c.fonts.length < 3) c.fonts.push('Inter');
      c.fonts[index] = name || 'Inter';
      this.load(name);
      if (!c.on) c.on = true;
      S.Render.drawScreen();
      S.State.commit('compare:slot');
      S.Render.chrome();
      this.sync();
    },

    addCompare: function (name) {
      var c = S.State.data.compare;
      if (!c.fonts) c.fonts = [];
      if (c.fonts.indexOf(name) > -1) {
        c.fonts = c.fonts.filter(function (f) { return f !== name; });
      } else {
        if (c.fonts.length >= 3) { U.toast('Compare holds 3 fonts — remove one first'); return; }
        c.fonts.push(name);
      }
      this.load(name);
      c.on = true;
      S.Render.drawScreen();
      S.State.commit('compare:list');
      S.Render.chrome();
      this.sync();
    },

    renderCats: function () {
      var el = document.getElementById('type-cats');
      if (!el) return;
      var cats = ['All', 'Sans', 'Serif', 'Mono', 'Display', 'Handwriting', 'Custom'];
      el.innerHTML = cats.map(function (c) {
        return '<button class="cat' + (Fonts.cat === c ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
      }).join('');
    },

    renderList: function () {
      var el = document.getElementById('type-list');
      if (!el) return;
      var q = this.query.toLowerCase();
      var list = S.fonts.filter(function (f) {
        var catOK = Fonts.cat === 'All' || f.cat === Fonts.cat;
        var qOK = !q || f.name.toLowerCase().indexOf(q) > -1 || f.cat.toLowerCase().indexOf(q) > -1;
        return catOK && qOK;
      });

      var count = document.getElementById('type-count');
      if (count) count.textContent = list.length + ' shown';

      el.innerHTML = list.map(function (f) {
        return '<div class="font-row">' +
          '<div class="font-preview font-loading" data-font="' + esc(f.name) + '" style="font-family:' + U.quote(f.name) + '">' + esc(f.name) + '</div>' +
          '<div class="font-meta-row"><span class="font-meta">' + esc(f.cat) + ' · ' + f.w.length + ' wt</span>' +
          '<span class="font-acts">' +
          '<button data-apply="ui" data-font="' + esc(f.name) + '" title="Use for interface">UI</button>' +
          '<button data-apply="display" data-font="' + esc(f.name) + '" title="Use for headlines">Aa</button>' +
          '<button data-compare="1" data-font="' + esc(f.name) + '" title="Add to compare">+</button>' +
          '</span></div></div>';
      }).join('');

      this.sync();
    },

    sync: function () {
      var d = S.State.data;
      var t = d.theme;
      var ui = t.fonts.ui;
      var display = t.fonts.display;

      var uiName = document.getElementById('type-ui-name');
      var displayName = document.getElementById('type-display-name');
      var uiMeta = document.getElementById('type-ui-meta');
      var dMeta = document.getElementById('type-display-meta');

      if (uiName) {
        uiName.textContent = ui;
        uiName.style.fontFamily = U.quote(ui);
        this.load(ui);
      }
      if (displayName) {
        displayName.textContent = display;
        displayName.style.fontFamily = U.quote(display);
        this.load(display);
      }
      if (uiMeta) uiMeta.textContent = catOf(ui);
      if (dMeta) dMeta.textContent = catOf(display);

      var spec = document.getElementById('spec-text');
      if (spec) {
        spec.style.fontFamily = U.quote(ui);
        spec.style.fontSize = (Number(t.type.size) * 1.3) + 'px';
        spec.style.fontWeight = t.type.weight;
        spec.style.letterSpacing = t.type.spacing + 'px';
      }
      var meta = document.getElementById('spec-meta');
      if (meta) {
        meta.innerHTML = '<span>' + esc(ui) + '</span><span>' + (Number(t.type.size) || 15) + 'px</span>' +
          '<span>weight ' + t.type.weight + '</span><span>' + esc(catOf(ui)) + '</span>';
      }

      var size = document.getElementById('type-size');
      if (size) size.value = t.type.size;
      var sizeVal = document.getElementById('type-size-val');
      if (sizeVal) sizeVal.textContent = t.type.size + 'px';

      var weight = document.getElementById('type-weight');
      if (weight) weight.value = String(t.type.weight);

      var spacing = document.getElementById('type-spacing');
      if (spacing) spacing.value = t.type.spacing;
      var spacingVal = document.getElementById('type-spacing-val');
      if (spacingVal) spacingVal.textContent = t.type.spacing + 'px';

      var toggle = document.getElementById('type-compare');
      if (toggle) toggle.classList.toggle('on', !!d.compare.on);

      var slots = document.getElementById('type-compare-slots');
      if (slots) {
        var names = (S.fonts.map(function (f) { return f.name; })).slice().sort();
        slots.innerHTML = [0, 1, 2].map(function (i) {
          var current = (d.compare.fonts && d.compare.fonts[i]) || 'Inter';
          return '<div class="compare-slot"><span class="dot"></span><select class="f-select" data-slot="' + i + '">' +
            names.map(function (n) {
              return '<option value="' + esc(n) + '"' + (n === current ? ' selected' : '') + '>' + esc(n) + '</option>';
            }).join('') + '</select></div>';
        }).join('');
      }

      var list = document.getElementById('type-list');
      if (list) {
        list.querySelectorAll('[data-apply]').forEach(function (btn) {
          var n = btn.getAttribute('data-font');
          var kind = btn.getAttribute('data-apply');
          btn.classList.toggle('on', (kind === 'ui' ? ui : display) === n);
        });
        list.querySelectorAll('[data-compare]').forEach(function (btn) {
          var n = btn.getAttribute('data-font');
          btn.classList.toggle('on', (d.compare.fonts || []).indexOf(n) > -1);
        });
      }

      this.loadVisible();
    },

    bind: function (box) {
      var self = this;

      box.addEventListener('scroll', U.debounce(function () { self.loadVisible(); }, 120), { passive: true });

      box.addEventListener('click', function (e) {
        var applyBtn = e.target.closest('[data-apply]');
        if (applyBtn) {
          self.apply(applyBtn.getAttribute('data-apply'), applyBtn.getAttribute('data-font'));
          return;
        }

        var cmpBtn = e.target.closest('[data-compare]');
        if (cmpBtn) { self.addCompare(cmpBtn.getAttribute('data-font')); return; }

        var catBtn = e.target.closest('[data-cat]');
        if (catBtn) {
          self.cat = catBtn.getAttribute('data-cat');
          self.renderCats();
          self.renderList();
          return;
        }

        if (e.target.closest('#type-compare')) { self.toggleCompare(); return; }

        if (e.target.closest('#type-load')) {
          var input = document.getElementById('type-custom');
          var name = (input.value || '').trim().replace(/\s+/g, ' ');
          if (!/^[A-Za-z][A-Za-z0-9 \-]{1,40}$/.test(name)) {
            U.toast('Enter a valid Google Fonts family name');
            return;
          }
          if (!S.fonts.some(function (f) { return f.name.toLowerCase() === name.toLowerCase(); })) {
            S.fonts.push({ name: name, cat: 'Custom', w: [400, 700] });
          }
          input.value = '';
          self.load(name);
          self.apply('ui', name);
          self.renderList();
        }
      });

      box.addEventListener('input', function (e) {
        if (e.target.id === 'type-search') {
          self.query = e.target.value;
          self.renderList();
          return;
        }
        if (e.target.id === 'type-size') {
          S.State.data.theme.type.size = Number(e.target.value);
          document.getElementById('type-size-val').textContent = e.target.value + 'px';
          self.sync();
          S.Render.drawScreen();
          S.State.commit('type:size');
          return;
        }
        if (e.target.id === 'type-spacing') {
          S.State.data.theme.type.spacing = Number(e.target.value);
          document.getElementById('type-spacing-val').textContent = e.target.value + 'px';
          self.sync();
          S.Render.drawScreen();
          S.State.commit('type:spacing');
        }
      });

      box.addEventListener('change', function (e) {
        if (e.target.id === 'type-weight') {
          S.State.data.theme.type.weight = Number(e.target.value);
          self.sync();
          S.Render.drawScreen();
          S.State.commit('type:weight');
          return;
        }
        if (e.target.hasAttribute('data-slot')) {
          self.setCompareSlot(Number(e.target.getAttribute('data-slot')), e.target.value);
        }
      });
    }
  };

  function catOf(name) {
    var f = S.fonts.filter(function (x) { return x.name === name; })[0];
    return f ? f.cat : 'Google Font';
  }
})();
