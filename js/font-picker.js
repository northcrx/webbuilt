/* Phase A — per-block typography and the live font picker. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;
  var esc = U.esc;

  /* Curated Google Fonts shown in the picker. Every name exists in S.fonts. */
  var PICKER_FONTS = [
    'Roboto', 'Inter', 'Poppins', 'Montserrat', 'Open Sans',
    'Lato', 'Nunito', 'Playfair Display', 'Merriweather', 'Roboto Mono',
    'Space Grotesk', 'DM Sans', 'Outfit', 'Raleway', 'Oswald',
    'Pacifico', 'Caveat', 'Manrope', 'Sora', 'JetBrains Mono'
  ];

  var ALIGNMENTS = [
    ['left', 'format_align_left', 'Align left'],
    ['center', 'format_align_center', 'Align centre'],
    ['right', 'format_align_right', 'Align right'],
    ['justify', 'format_align_justify', 'Justify']
  ];

  function fontMeta(name) {
    return S.fonts.filter(function (f) { return f.name === name; })[0];
  }

  function safeColor(value) {
    return /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#1d1b20';
  }

  var Typography = S.Typography = {

    fonts: PICKER_FONTS,

    /* ---- markup used by the inspector ---- */
    section: function (item) {
      var d = S.State.data;
      var t = item.typography || {};
      var themeFont = (d.theme.fonts && d.theme.fonts.ui) || 'Inter';
      var family = t.family || '';
      var shown = family || themeFont;
      var weights = [
        ['', 'Inherit'], ['300', 'Light 300'], ['400', 'Regular 400'],
        ['500', 'Medium 500'], ['600', 'Semibold 600'], ['700', 'Bold 700'],
        ['800', 'Extra bold 800']
      ];

      var fontItems = PICKER_FONTS.map(function (name) {
        var meta = fontMeta(name);
        return '<button type="button" class="font-item' + (name === family ? ' active' : '') + '" ' +
          'data-font-pick="' + esc(name) + '" role="option" aria-selected="' + (name === family) + '" ' +
          'style="font-family:' + esc(U.fontStack(name)) + '">' +
          '<span>' + esc(name) + '</span>' +
          '<small>' + esc(meta ? meta.cat : 'Font') + '</small></button>';
      }).join('');

      var alignButtons = ALIGNMENTS.map(function (pair) {
        return '<button type="button" class="typo-align-btn' + (t.align === pair[0] ? ' active' : '') + '" ' +
          'data-typo-align="' + pair[0] + '" title="' + pair[2] + '" aria-label="' + pair[2] +
          '" aria-pressed="' + (t.align === pair[0]) + '"><span class="mi">' + pair[1] + '</span></button>';
      }).join('');

      return '<div class="sect">' +
        '<div class="sect-title">Font</div>' +
        '<div class="f-row font-row">' +
        '<div class="f-label"><span>Font family</span><span class="val">' + (family ? 'Custom' : 'Theme') + '</span></div>' +
        '<button type="button" class="font-trigger" data-font-open="1" aria-haspopup="listbox" aria-expanded="false">' +
        '<span class="font-trigger-name" style="font-family:' + esc(U.fontStack(shown)) + '">' + esc(shown) + '</span>' +
        '<span class="mi">expand_more</span></button>' +
        '<small class="f-hint">Hover a font to preview it on this block. Click to apply.</small>' +
        '<div class="font-pop" hidden>' +
        '<div class="font-search-row"><span class="mi">search</span>' +
        '<input class="f-input" type="search" data-font-search="1" placeholder="Search fonts…" aria-label="Search fonts">' +
        '</div>' +
        '<div class="font-list" role="listbox" aria-label="Font family">' + fontItems + '</div>' +
        '</div>' +
        '</div>' +

        '<div class="typo-grid">' +
        '<div class="typo-cell">' +
        '<div class="f-label"><span>Size</span><span class="val">px</span></div>' +
        '<input class="f-input" type="number" min="0" max="96" step="1" placeholder="Auto" ' +
        'value="' + (t.size || '') + '" data-typo="size" aria-label="Font size in pixels">' +
        '</div>' +
        '<div class="typo-cell">' +
        '<div class="f-label"><span>Weight</span></div>' +
        '<select class="f-select" data-typo="weight" aria-label="Font weight">' +
        weights.map(function (w) {
          return '<option value="' + w[0] + '"' + (String(t.weight || '') === w[0] ? ' selected' : '') + '>' + w[1] + '</option>';
        }).join('') +
        '</select>' +
        '</div>' +
        '</div>' +

        '<div class="f-row">' +
        '<div class="f-label"><span>Text colour</span><span class="val">' + (t.color ? 'Custom' : 'Inherit') + '</span></div>' +
        '<div class="f-color">' +
        '<input type="color" value="' + safeColor(t.color) + '" data-typo="color" aria-label="Text colour">' +
        '<input class="f-input" type="text" value="' + esc(t.color || '') + '" placeholder="Inherit" ' +
        'data-typo="color" aria-label="Text colour CSS value">' +
        '<button type="button" class="mini" data-typo-clear="color" title="Clear text colour" aria-label="Clear text colour"><span class="mi">format_clear</span></button>' +
        '</div>' +
        '<small class="f-hint">A colour for this block only. Empty inherits the theme.</small>' +
        '</div>' +

        '<div class="f-row">' +
        '<div class="f-label"><span>Alignment</span></div>' +
        '<div class="typo-align">' + alignButtons + '</div>' +
        '<small class="f-hint">Align the text inside this block. Click the active button to inherit again.</small>' +
        '</div>' +

        '<div class="typo-grid">' +
        '<div class="typo-cell">' +
        '<div class="f-label"><span>Line height</span><span class="val">×</span></div>' +
        '<input class="f-input" type="number" min="0" max="4" step="0.05" placeholder="Auto" ' +
        'value="' + (t.lineHeight || '') + '" data-typo="lineHeight" aria-label="Line height">' +
        '</div>' +
        '<div class="typo-cell">' +
        '<div class="f-label"><span>Letter spacing</span><span class="val">px</span></div>' +
        '<input class="f-input" type="number" min="-4" max="12" step="0.1" placeholder="Auto" ' +
        'value="' + (t.letterSpacing || '') + '" data-typo="letterSpacing" aria-label="Letter spacing in pixels">' +
        '</div>' +
        '</div>' +

        '<button type="button" class="tb-btn font-all" data-font-apply-all="1" title="Apply this font family to every block on this screen">' +
        '<span class="mi">format_paint</span><span>Apply to all text</span></button>' +
        '</div>';
    },

    /* ---- picker behaviour ---- */
    popFor: function (trigger) {
      var row = trigger.closest('.font-row');
      return row ? row.querySelector('.font-pop') : null;
    },

    openPicker: function (trigger) {
      var pop = this.popFor(trigger);
      if (!pop) return;
      var open = !pop.hidden;
      this.closePicker();
      if (open) return;

      pop.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');

      var search = pop.querySelector('[data-font-search]');
      if (search) search.value = '';
      this.filter(pop, '');

      /* Load the curated families so every row can show its own typeface. */
      var self = this;
      pop.querySelectorAll('[data-font-pick]').forEach(function (btn) {
        S.Fonts.load(btn.getAttribute('data-font-pick'));
      });

      if (search) {
        search.focus();
        try { search.setSelectionRange(0, 0); } catch (err) { /* type=search */ }
      }
      return self;
    },

    closePicker: function () {
      document.querySelectorAll('.font-pop').forEach(function (pop) {
        if (pop.hidden) return;
        pop.hidden = true;
        var row = pop.closest('.font-row');
        var trigger = row && row.querySelector('[data-font-open]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
      this.preview(null);
    },

    filter: function (pop, query) {
      var q = String(query || '').trim().toLowerCase();
      pop.querySelectorAll('[data-font-pick]').forEach(function (btn) {
        var name = btn.getAttribute('data-font-pick');
        btn.hidden = !!q && name.toLowerCase().indexOf(q) === -1;
      });
    },

    preview: function (name) {
      if (!S.Inspector) return;
      var item = S.Inspector.selected();
      if (!item) return;
      /* Locked blocks keep their look until they are unlocked. */
      if (item.locked) name = null;
      if (name) S.Fonts.load(name);

      /* Leaving the picker must restore the saved family, not clear it —
         otherwise a stray mouseover would visually undo the applied font. */
      var restore = (item.typography && item.typography.family) || '';
      var family = name || restore;

      document.querySelectorAll('.mock-frame .cmp[data-id="' + item.id + '"]').forEach(function (el) {
        if (family) {
          el.setAttribute('data-typo', '1');
          el.style.setProperty('--typo-family', U.fontStack(family));
        } else {
          el.style.removeProperty('--typo-family');
          if (!S.Render.hasTypography(item)) el.removeAttribute('data-typo');
        }
      });
    },

    pick: function (button) {
      var item = S.Inspector && S.Inspector.selected();
      if (!item) { U.toast('Select a block first'); return; }
      if (S.Inspector.guardLocked(item)) return;

      var name = button.getAttribute('data-font-pick');
      item.typography = item.typography || {};
      item.typography.family = name;
      S.Fonts.load(name);

      this.closePicker();
      S.Render.drawScreen();
      S.State.commit('typo:' + item.id + ':family');
      S.Inspector.render();
      U.toast('Font: ' + name);
    },

    applyAll: function (item) {
      item = item || (S.Inspector && S.Inspector.selected());
      if (!item) { U.toast('Select a block first'); return; }
      if (S.Inspector && S.Inspector.guardLocked(item)) return;

      var family = (item.typography && item.typography.family) || '';
      if (!family) { U.toast('Pick a font family first, then apply it to all text'); return; }

      var d = S.State.data;
      d.theme.fonts.ui = family;
      d.theme.fonts.display = family;
      d.screen.forEach(function (block) {
        block.typography = block.typography || {};
        block.typography.family = family;
      });

      S.Fonts.load(family);
      if (S.App && S.App.loadThemeFonts) S.App.loadThemeFonts();
      S.State.commit('font:all');
      S.Render.drawScreen();
      S.Inspector.render();
      U.toast('Applied ' + family + ' to all text');
    },

    init: function () {
      if (Typography._bound) return;
      Typography._bound = true;

      document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-font-open]');
        if (trigger) {
          e.preventDefault();
          e.stopPropagation();
          Typography.openPicker(trigger);
          return;
        }

        var pick = e.target.closest('[data-font-pick]');
        if (pick) {
          e.preventDefault();
          e.stopPropagation();
          Typography.pick(pick);
          return;
        }

        var all = e.target.closest('[data-font-apply-all]');
        if (all) {
          e.preventDefault();
          e.stopPropagation();
          Typography.applyAll();
          return;
        }

        if (!e.target.closest('.font-pop')) Typography.closePicker();
      });

      document.addEventListener('input', function (e) {
        var search = e.target.closest('[data-font-search]');
        if (!search) return;
        var pop = search.closest('.font-pop');
        if (pop) Typography.filter(pop, search.value);
      });

      document.addEventListener('mouseover', function (e) {
        var pick = e.target.closest('[data-font-pick]');
        if (pick) {
          Typography.preview(pick.getAttribute('data-font-pick'));
          return;
        }
        if (!e.target.closest('.font-pop')) Typography.preview(null);
      });
    }
  };
})();
