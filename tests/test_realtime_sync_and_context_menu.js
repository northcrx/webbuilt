const path = require('path');
// Automated Test Suite: Real-time Page & Layer Synchronization + Universal Context Menu
const assert = require('assert');
const fs = require('fs');

// Mock browser environment
global.window = global;
global.requestAnimationFrame = function (cb) { return setTimeout(cb, 0); };
global.cancelAnimationFrame = function (id) { clearTimeout(id); };

const elements = {};
function makeEl(id, tag = 'div', classes = '') {
  const el = {
    id: id || '',
    tagName: tag.toUpperCase(),
    className: classes,
    hidden: false,
    disabled: false,
    value: '',
    textContent: '',
    innerHTML: '',
    dataset: {},
    children: [],
    style: {
      setProperty: function () {},
      getPropertyValue: function () { return ''; },
      left: '0px',
      top: '0px'
    },
    classList: {
      _classes: new Set(classes ? classes.split(' ') : []),
      add: function (c) { this._classes.add(c); },
      remove: function (c) { this._classes.delete(c); },
      toggle: function (c, force) {
        if (force !== undefined) {
          if (force) this._classes.add(c); else this._classes.delete(c);
          return force;
        }
        if (this._classes.has(c)) { this._classes.delete(c); return false; }
        this._classes.add(c); return true;
      },
      contains: function (c) { return this._classes.has(c); }
    },
    setAttribute: function (k, v) { this[k] = v; },
    getAttribute: function (k) { return this[k] || null; },
    removeAttribute: function (k) { delete this[k]; },
    addEventListener: function (evt, handler) {
      this._listeners = this._listeners || {};
      this._listeners[evt] = this._listeners[evt] || [];
      this._listeners[evt].push(handler);
    },
    removeEventListener: function () {},
    dispatchEvent: function (event) {
      const handlers = (this._listeners && this._listeners[event.type]) || [];
      handlers.forEach(h => h(event));
    },
    querySelector: function (sel) { return null; },
    querySelectorAll: function (sel) { return []; },
    closest: function (sel) { return null; },
    appendChild: function (child) { this.children.push(child); return child; },
    removeChild: function (child) {
      const idx = this.children.indexOf(child);
      if (idx > -1) this.children.splice(idx, 1);
      return child;
    },
    insertAdjacentHTML: function () {},
    getBoundingClientRect: function () { return { top: 0, left: 0, width: 360, height: 640 }; }
  };
  if (id) elements[id] = el;
  return el;
}

// Pre-populate core IDs
makeEl('left-tabs');
makeEl('left-page-count', 'span');
makeEl('left-layer-count', 'span');
makeEl('pages-list', 'ol');
makeEl('layers', 'ul');
makeEl('layers-empty', 'div');
makeEl('stage', 'div');
makeEl('devices', 'div');
makeEl('device-menu', 'div');
makeEl('palette', 'div');
makeEl('templates', 'div');
makeEl('ctx-menu', 'div');
makeEl('ctx-menu-header', 'div');
makeEl('ctx-menu-body', 'div');
makeEl('ctx-link-modal', 'div');
makeEl('clm-body', 'div');
makeEl('clm-title', 'strong');
makeEl('clm-subtitle', 'small');

global.document = {
  readyState: 'loading',
  documentElement: {
    setAttribute: function () {},
    getAttribute: function () { return ''; }
  },
  head: { appendChild: function () {} },
  body: { appendChild: function () {} },
  getElementById: function (id) {
    if (!elements[id]) elements[id] = makeEl(id);
    return elements[id];
  },
  querySelector: function (sel) {
    if (sel.startsWith('#')) return this.getElementById(sel.slice(1));
    return null;
  },
  querySelectorAll: function (sel) { return []; },
  createElement: function (tag) { return makeEl(null, tag); },
  addEventListener: function () {}
};

global.localStorage = {
  _data: {},
  getItem: function (k) { return this._data[k] || null; },
  setItem: function (k, v) { this._data[k] = String(v); },
  removeItem: function (k) { delete this._data[k]; }
};

console.log('--- STARTING REAL-TIME SYNC & CONTEXT MENU TEST SUITE ---');

// 1. Verify index.html contains ctx-menu and script
const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
assert(indexHtml.includes('id="ctx-menu"'), 'index.html must contain #ctx-menu');
assert(indexHtml.includes('id="ctx-link-modal"'), 'index.html must contain #ctx-link-modal');
assert(indexHtml.includes('src="js/context-menu.js"'), 'index.html must include js/context-menu.js');
console.log('  PASS: index.html contains context menu markup and script');

// 2. Verify css/shell.css contains context menu styles
const shellCss = fs.readFileSync(path.resolve(__dirname, '../css/shell.css'), 'utf8');
assert(shellCss.includes('.ctx-menu'), 'css/shell.css must define .ctx-menu');
assert(shellCss.includes('.ctx-link-modal'), 'css/shell.css must define .ctx-link-modal');
assert(shellCss.includes('.clm-card'), 'css/shell.css must define .clm-card');
console.log('  PASS: css/shell.css contains complete context menu and link modal styling');

// 3. Verify js/context-menu.js syntax and methods
const ctxMenuCode = fs.readFileSync(path.resolve(__dirname, '../js/context-menu.js'), 'utf8');
assert(ctxMenuCode.includes('ContextMenu'), 'js/context-menu.js must define ContextMenu');
assert(ctxMenuCode.includes('bindStage:'), 'js/context-menu.js must bindStage');
assert(ctxMenuCode.includes('bindPages:'), 'js/context-menu.js must bindPages');
assert(ctxMenuCode.includes('bindLayers:'), 'js/context-menu.js must bindLayers');
assert(ctxMenuCode.includes('openLinkPicker:'), 'js/context-menu.js must define openLinkPicker');
assert(ctxMenuCode.includes('openSearchConfig:'), 'js/context-menu.js must define openSearchConfig');
console.log('  PASS: js/context-menu.js defines all required context menu actions');

// 4. Verify js/app.js refresh calls S.Render.pages()
const appCode = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');
assert(appCode.includes('S.Render.pages();'), 'js/app.js refresh must call S.Render.pages()');
assert(appCode.includes('S.ContextMenu.init();'), 'js/app.js must initialize S.ContextMenu');
console.log('  PASS: js/app.js refresh calls S.Render.pages() and initializes S.ContextMenu');

// 5. Load Studio modules for functional testing
require('../js/util.js');
require('../js/icons.js');
require('../js/data.js');
require('../js/state.js');
require('../js/mockup-css.js');
require('../js/templates.js');
require('../js/render.js');

const S = global.window.Studio;

// Initialize blank state
S.State.startBlank('app');
assert.strictEqual(S.State.data.pages.length, 1, 'Initially 1 blank page');
assert.strictEqual(S.State.data.pages[0].screen.length, 0, 'Initial screen has 0 blocks');

// Render all
S.Render.all();
const pageBadge = elements['left-page-count'];
const layerBadge = elements['left-layer-count'];
assert.strictEqual(pageBadge.textContent, 1, 'left-page-count is 1');
assert.strictEqual(layerBadge.textContent, 0, 'left-layer-count is 0');
console.log('  PASS: Initial blank state has 1 page, 0 blocks, badges synced');

// Add Block to Screen 1
const headerBlock = S.makeBlock('appbar', { title: 'Screen 1 Header' });
S.State.data.screen.push(headerBlock);
S.State.syncActivePage();
S.Render.layers();
S.Render.pages();
assert.strictEqual(layerBadge.textContent, 1, 'left-layer-count updated to 1');
assert.strictEqual(S.State.data.pages[0].screen.length, 1, 'Page 0 screen has 1 block');
console.log('  PASS: Adding block updates layer count badge and active page screen');

// Add Page 2
const page2 = S.State.addPage('Explore Screen', { blank: true, screen: [] });
assert.strictEqual(S.State.data.pages.length, 2, 'Now 2 pages exist');
assert.strictEqual(S.State.data.activePageId, page2.id, 'Active page is now Page 2');
assert.strictEqual(S.State.data.screen.length, 0, 'Page 2 screen is blank');

S.Render.all();
assert.strictEqual(pageBadge.textContent, 2, 'left-page-count badge updated to 2 in real time');
assert.strictEqual(layerBadge.textContent, 0, 'left-layer-count badge updated to 0 for Page 2');
console.log('  PASS: Adding Page 2 switches active screen to blank and updates badges in real time');

// Add Block to Page 2
const cardBlock = S.makeBlock('card', { title: 'Explore Item', body: 'Discover new places' });
S.State.data.screen.push(cardBlock);
S.State.syncActivePage();
S.Render.all();
assert.strictEqual(layerBadge.textContent, 1, 'Page 2 layer count is 1');
assert.strictEqual(S.State.data.pages[1].screen.length, 1, 'Page 2 has 1 block');
assert.strictEqual(S.State.data.pages[0].screen.length, 1, 'Page 1 still has 1 block (intact)');
console.log('  PASS: Page 2 block added without modifying Page 1');

// Switch back to Screen 1
const p1Id = S.State.data.pages[0].id;
S.State.switchPage(p1Id);
assert.strictEqual(S.State.data.activePageId, p1Id, 'Active page is Screen 1');
assert.strictEqual(S.State.data.screen[0].props.title, 'Screen 1 Header', 'Screen 1 blocks restored on switch');
S.Render.all();
assert.strictEqual(layerBadge.textContent, 1, 'Layers panel shows Screen 1 layers');
console.log('  PASS: Switching to Screen 1 instantly displays Screen 1 layout & layers');

// Delete a block from Screen 1
S.State.data.screen.splice(0, 1);
S.State.syncActivePage();
S.Render.all();
assert.strictEqual(S.State.data.screen.length, 0, 'Screen 1 now has 0 blocks');
assert.strictEqual(layerBadge.textContent, 0, 'Layers count updated to 0');
assert.strictEqual(S.State.data.pages.length, 2, 'Page 1 is NOT deleted when layers are deleted');
assert.strictEqual(S.State.data.pages[1].screen.length, 1, 'Page 2 still has its block intact');
console.log('  PASS: Deleting all layers from page does NOT delete page; other pages retain layouts');

// Delete Screen 1
S.State.deletePage(p1Id);
assert.strictEqual(S.State.data.pages.length, 1, 'Now 1 page remains after deleting Screen 1');
assert.strictEqual(S.State.data.activePageId, page2.id, 'Active page automatically switched to remaining Page 2');
assert.strictEqual(S.State.data.screen.length, 1, 'Active screen now has Page 2 blocks');
S.Render.all();
assert.strictEqual(pageBadge.textContent, 1, 'Pages badge updated to 1 in real time');
assert.strictEqual(layerBadge.textContent, 1, 'Layers badge updated to Page 2 count');
console.log('  PASS: Deleting page automatically updates active page, screen, layers, and badge');

console.log('=========================================');
console.log('ALL REAL-TIME SYNC & CONTEXT MENU TESTS PASSED PERFECTLY!');
