/* Shared helpers. Loaded before everything else. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util = {};

  var uidCounter = 0;
  U.uid = function () {
    uidCounter += 1;
    return 'b' + Date.now().toString(36).slice(-5) +
      uidCounter.toString(36) + Math.random().toString(36).slice(2, 5);
  };

  U.esc = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };

  U.getPath = function (obj, path) {
    return String(path).split('.').reduce(function (o, key) {
      return o == null ? undefined : o[key];
    }, obj);
  };

  U.setPath = function (obj, path, value) {
    var parts = String(path).split('.');
    var target = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (target[parts[i]] == null) target[parts[i]] = {};
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = value;
  };

  U.clamp = function (n, min, max) {
    return Math.min(max, Math.max(min, n));
  };

  U.fontStack = function (name) {
    var safe = String(name || 'Inter').replace(/["\\]/g, '');
    return '"' + safe + '", Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  };

  U.quote = function (name) {
    return '"' + String(name || '').replace(/["\\]/g, '') + '"';
  };

  U.initials = function (name) {
    var words = String(name || '?').trim().split(/\s+/).slice(0, 2);
    return words.map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  };

  U.debounce = function (fn, wait) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  };

  /* ---------- colour maths ---------- */
  U.hexToRgb = function (hex) {
    var m = String(hex || '').replace('#', '');
    if (m.length === 3) m = m.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(m.slice(0, 6), 16);
    if (isNaN(n)) return { r: 103, g: 80, b: 164 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };

  U.rgbToHex = function (r, g, b) {
    var h = function (n) {
      var s = Math.round(U.clamp(n, 0, 255)).toString(16);
      return s.length === 1 ? '0' + s : s;
    };
    return '#' + h(r) + h(g) + h(b);
  };

  U.mix = function (hexA, hexB, t) {
    var a = U.hexToRgb(hexA);
    var b = U.hexToRgb(hexB);
    return U.rgbToHex(
      a.r + (b.r - a.r) * t,
      a.g + (b.g - a.g) * t,
      a.b + (b.b - a.b) * t
    );
  };

  U.lum = function (hex) {
    var c = U.hexToRgb(hex);
    var f = function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };

  U.onColor = function (hex) {
    return U.lum(hex) > 0.5 ? '#1c1b20' : '#ffffff';
  };

  /* ---------- toast ---------- */
  var toastTimer = null;
  var toastAction = null;

  /* toast('Saved') or toast('Block deleted', { action: 'Undo', onAction: fn }) */
  U.toast = function (message, opts) {
    var el = document.getElementById('toast');
    if (!el) return;
    opts = opts || {};
    clearTimeout(toastTimer);
    toastAction = typeof opts.onAction === 'function' ? opts.onAction : null;

    el.innerHTML = '';
    var text = document.createElement('span');
    text.className = 'toast-text';
    text.textContent = message;
    el.appendChild(text);

    el.classList.toggle('has-action', !!toastAction);
    if (toastAction) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toast-act';
      btn.textContent = opts.action || 'Undo';
      btn.addEventListener('click', function () {
        var fn = toastAction;
        toastAction = null;
        clearTimeout(toastTimer);
        el.classList.remove('show', 'has-action');
        if (fn) fn();
      });
      el.appendChild(btn);
    }

    el.classList.add('show');
    toastTimer = setTimeout(function () {
      el.classList.remove('show', 'has-action');
      toastAction = null;
    }, opts.duration || 3200);
  };
})();
