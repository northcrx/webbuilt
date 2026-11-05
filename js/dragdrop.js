/* Pointer interactions:
   - reorder rows in the Layers panel
   - reorder blocks directly in the preview
   - resize the selected block from its corner handle
   Small functions and captured slot midpoints keep the drop target stable
   while the dragged element is moved around in the DOM. */
(function () {
  var S = window.Studio = window.Studio || {};
  var U = S.util;

  var layerDrag = null;
  var previewDrag = null;
  var resizeDrag = null;
  var suppressClickUntil = 0;
  var suppressLayerClickUntil = 0;

  function suppressClicks(ms) {
    suppressClickUntil = Date.now() + (ms || 260);
  }

  function suppressLayerClicks(ms) {
    suppressLayerClickUntil = Date.now() + (ms || 260);
  }

  function shouldIgnoreClick() {
    return Date.now() < suppressClickUntil;
  }

  function shouldIgnoreLayerClick() {
    return Date.now() < suppressLayerClickUntil;
  }

  function scrollParent(el) {
    var node = el.parentElement;
    while (node) {
      var style = getComputedStyle(node);
      if (/(auto|scroll)/.test(style.overflowY)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function byId(id) {
    return S.State.data.screen.filter(function (item) { return item.id === id; })[0] || null;
  }

  function blockOf(el) {
    var cmp = el && el.closest ? el.closest('.cmp') : null;
    return cmp ? { cmp: cmp, item: byId(cmp.getAttribute('data-id')) } : null;
  }

  /* Direct block children of the list that owns `cmp`. */
  function siblingBlocks(cmp) {
    var list = cmp.parentElement;
    if (!list) return [];
    return Array.prototype.filter.call(list.children, function (el) {
      return el.classList && el.classList.contains('cmp');
    });
  }

  function blockIds(cmp) {
    return siblingBlocks(cmp).map(function (el) { return el.getAttribute('data-id'); });
  }

  /* Slot midpoints in visual (zoomed) coordinates. */
  function slotMidpoints(cmp) {
    return siblingBlocks(cmp).map(function (el) {
      var r = el.getBoundingClientRect();
      return { id: el.getAttribute('data-id'), mid: r.top + r.height / 2 };
    });
  }

  function placeDragged(cmp, clientY, slots, scrollShift) {
    var others = slots.filter(function (slot) {
      return slot.id !== cmp.getAttribute('data-id');
    });
    var index = 0;
    while (index < others.length && clientY > others[index].mid - scrollShift) index++;

    var siblings = siblingBlocks(cmp).filter(function (el) { return el !== cmp; });
    var anchor = siblings[index] || null;

    if (anchor) {
      if (anchor !== cmp.nextElementSibling) cmp.parentElement.insertBefore(cmp, anchor);
    } else if (cmp.parentElement.lastElementChild !== cmp) {
      cmp.parentElement.appendChild(cmp);
    }
  }

  /* ---------------- Layers panel ---------------- */
  function initLayers() {
    var list = document.getElementById('layers');
    if (!list) return;

    list.addEventListener('pointerdown', function (e) {
      var grip = e.target.closest('.grip');
      if (!grip) return;
      var li = grip.closest('.layer');
      if (!li) return;
      if (li.classList.contains('is-locked')) {
        e.preventDefault();
        U.toast('Layer is locked — unlock it to move');
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      layerDrag = {
        li: li,
        startY: e.clientY,
        moved: false,
        pointerId: e.pointerId,
        scrollTop: scrollParent(list) ? scrollParent(list).scrollTop : 0,
        slots: Array.prototype.map.call(list.querySelectorAll('.layer'), function (el) {
          var r = el.getBoundingClientRect();
          return { id: el.dataset.id, mid: r.top + r.height / 2 };
        })
      };
      li.classList.add('is-dragging');
      document.body.classList.add('dragging-layer');
      try { li.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });

    list.addEventListener('pointermove', function (e) {
      if (!layerDrag || e.pointerId !== layerDrag.pointerId) return;
      if (!layerDrag.moved && Math.abs(e.clientY - layerDrag.startY) < 4) return;
      layerDrag.moved = true;

      var panel = scrollParent(list);
      var shift = panel ? panel.scrollTop - layerDrag.scrollTop : 0;

      // Decide the slot from positions captured at drag start, so the live
      // movement of the row cannot shift the drop target under the cursor.
      var others = layerDrag.slots.filter(function (slot) {
        return slot.id !== layerDrag.li.dataset.id;
      });
      var index = 0;
      while (index < others.length && e.clientY > others[index].mid - shift) index++;

      var siblings = Array.prototype.filter.call(list.children, function (el) {
        return el.classList.contains('layer') && el !== layerDrag.li;
      });
      var anchor = siblings[index] || null;
      if (anchor) {
        if (anchor !== layerDrag.li.nextElementSibling) list.insertBefore(layerDrag.li, anchor);
      } else if (list.lastElementChild !== layerDrag.li) {
        list.appendChild(layerDrag.li);
      }

      // Auto-scroll the panel while dragging near its edges.
      if (panel) {
        var pr = panel.getBoundingClientRect();
        if (e.clientY < pr.top + 60) panel.scrollTop -= 8;
        else if (e.clientY > pr.bottom - 60) panel.scrollTop += 8;
      }
      e.preventDefault();
    });

    function endLayerDrag() {
      if (!layerDrag) return;
      var li = layerDrag.li;
      var moved = layerDrag.moved;
      try { li.releasePointerCapture(layerDrag.pointerId); } catch (err) { /* ignore */ }
      li.classList.remove('is-dragging');
      document.body.classList.remove('dragging-layer');
      layerDrag = null;

      if (!moved) return;
      suppressLayerClicks();

      var ids = Array.prototype.map.call(list.children, function (el) { return el.dataset.id; });
      S.State.reorder(ids);
      S.App.refresh('structure');
      U.toast('Layer moved');
    }

    list.addEventListener('pointerup', endLayerDrag);
    list.addEventListener('pointercancel', endLayerDrag);

    list.addEventListener('click', function (e) {
      if (shouldIgnoreLayerClick()) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  /* ---------------- Preview reorder ---------------- */
  function initPreview() {
    var stage = document.getElementById('stage');
    if (!stage) return;

    stage.addEventListener('pointerdown', function (e) {
      if (S.App && S.App.previewMode) return;
      if (S.State.data.compare && S.State.data.compare.on) return;
      if (e.button != null && e.button !== 0) return;

      var editEl = S.App && S.App.inlineEditElement ? S.App.inlineEditElement() : null;
      // Clicking inside the active editable text should place the caret.
      if (editEl && editEl.contains(e.target)) return;

      // The corner handle starts a resize, not a reorder.
      var handle = e.target.closest('.cmp-resize');
      if (handle) {
        if (editEl) { S.App.finishInlineEdit(); return; }
        startResize(e, handle);
        return;
      }
      // Toolbar buttons are click-only; the click handler commits any edit.
      if (e.target.closest('.cmp-chrome')) return;

      // Starting a drag while another text is being edited: save it first,
      // then re-resolve the block under the pointer (the preview was redrawn).
      var cmpTarget = e.target;
      if (editEl && S.App.finishInlineEdit()) {
        cmpTarget = document.elementFromPoint(e.clientX, e.clientY) || e.target;
      }

      var found = blockOf(cmpTarget);
      if (!found) return;

      previewDrag = {
        cmp: found.cmp,
        item: found.item,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
        pointerId: e.pointerId,
        scrollTop: scrollParent(found.cmp) ? scrollParent(found.cmp).scrollTop : 0,
        slots: null
      };
    });

    document.addEventListener('pointermove', function (e) {
      if (resizeDrag) {
        moveResize(e);
        return;
      }
      if (!previewDrag || e.pointerId !== previewDrag.pointerId) return;

      var dx = e.clientX - previewDrag.startX;
      var dy = e.clientY - previewDrag.startY;
      if (!previewDrag.moved && Math.abs(dx) < 6 && Math.abs(dy) < 6) return;

      if (!previewDrag.moved) {
        if (!previewDrag.item || previewDrag.item.locked) {
          previewDrag = null;
          U.toast('Block is locked — unlock it to move');
          return;
        }
        previewDrag.moved = true;
        previewDrag.slots = slotMidpoints(previewDrag.cmp);
        previewDrag.cmp.classList.add('is-dragging');
        document.body.classList.add('dragging-block');
        try { previewDrag.cmp.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        try { window.getSelection().removeAllRanges(); } catch (err) { /* ignore */ }
        if (S.App && S.App.select) S.App.select(previewDrag.item.id);
      }

      var panel = scrollParent(previewDrag.cmp);
      // scrollTop is in unscaled CSS px; pointer coordinates are zoomed.
      var zoom = S.Render.zoom || 1;
      var shift = panel ? (panel.scrollTop - previewDrag.scrollTop) * zoom : 0;

      placeDragged(previewDrag.cmp, e.clientY, previewDrag.slots, shift);

      if (panel) {
        var pr = panel.getBoundingClientRect();
        if (e.clientY < pr.top + 46) panel.scrollTop -= 9;
        else if (e.clientY > pr.bottom - 46) panel.scrollTop += 9;
      }
      e.preventDefault();
    });

    document.addEventListener('pointerup', endPreviewDrag);
    document.addEventListener('pointercancel', endPreviewDrag);

    stage.addEventListener('click', function (e) {
      if (shouldIgnoreClick()) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  function endPreviewDrag(e) {
    if (resizeDrag) {
      endResize(e);
      return;
    }
    if (!previewDrag) return;

    var drag = previewDrag;
    previewDrag = null;
    try { drag.cmp.releasePointerCapture(drag.pointerId); } catch (err) { /* ignore */ }
    drag.cmp.classList.remove('is-dragging');
    document.body.classList.remove('dragging-block');

    if (!drag.moved) return;
    suppressClicks();

    var ids = blockIds(drag.cmp);
    /* The flow only contains scrollable blocks; pinned dock blocks (bottom
       navigation, docked mini player) live outside it. Append them so the
       state reorder still covers every block. */
    S.State.data.screen.forEach(function (item) {
      if (ids.indexOf(item.id) === -1) ids.push(item.id);
    });
    S.State.reorder(ids);
    S.App.refresh('structure');
    if (S.App && S.App.select) S.App.select(drag.item.id);
    U.toast('Block moved');
  }

  /* ---------------- Resize handle ---------------- */
  function startResize(e, handle) {
    var found = blockOf(handle);
    if (!found || !found.item) return;

    e.preventDefault();
    e.stopPropagation();

    if (found.item.locked) {
      U.toast('Block is locked — unlock it to resize');
      return;
    }

    // The handle is only visible on the selected block, so no select() here:
    // re-rendering would remove the element currently under the pointer.
    var cmp = found.cmp;
    resizeDrag = {
      cmp: cmp,
      item: found.item,
      pointerId: e.pointerId,
      zoom: S.Render.zoom || 1,
      startX: e.clientX,
      startY: e.clientY,
      startW: cmp.offsetWidth,
      startH: cmp.offsetHeight,
      moved: false
    };
    cmp.classList.add('is-resizing');
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }

  function moveResize(e) {
    if (!resizeDrag || e.pointerId !== resizeDrag.pointerId) return;
    var zoom = resizeDrag.zoom || 1;
    var dx = (e.clientX - resizeDrag.startX) / zoom;
    var dy = (e.clientY - resizeDrag.startY) / zoom;
    if (!resizeDrag.moved && Math.abs(dx) < 2 && Math.abs(dy) < 2) return;
    resizeDrag.moved = true;

    var w = Math.max(60, Math.round(resizeDrag.startW + dx));
    var h = Math.max(32, Math.round(resizeDrag.startH + dy));

    resizeDrag.item.style = resizeDrag.item.style || {};
    resizeDrag.item.style.width = w;
    resizeDrag.item.style.height = h;
    resizeDrag.cmp.style.width = w + 'px';
    resizeDrag.cmp.style.maxWidth = '100%';
    resizeDrag.cmp.style.height = h + 'px';
    e.preventDefault();
  }

  function endResize(e) {
    if (!resizeDrag) return;
    var drag = resizeDrag;
    resizeDrag = null;
    drag.cmp.classList.remove('is-resizing');
    try { drag.cmp.releasePointerCapture(drag.pointerId); } catch (err) { /* ignore */ }
    if (!drag.moved) return;

    suppressClicks();
    S.State.commit(null);
    S.App.refresh('structure');
    if (S.App && S.App.select) S.App.select(drag.item.id);
    U.toast('Size updated · Ctrl+Z to undo');
  }

  function init() {
    initLayers();
    initPreview();
  }

  S.Drag = {
    init: init,
    shouldIgnoreClick: shouldIgnoreClick
  };
})();
