const path = require('path');
const assert = require('assert');

// Mock browser
global.window = global;
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

function makeEl(id) {
  return {
    id: id || '',
    value: '',
    textContent: '',
    innerHTML: '',
    classList: { add() {}, remove() {}, toggle() {} },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener() {},
    setAttribute() {},
    getAttribute() { return ''; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 360, height: 640 }; }
  };
}

global.document = {
  readyState: 'complete',
  getElementById(id) { return makeEl(id); },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  addEventListener() {}
};

// Load modules in exact order
require('../js/util.js');
require('../js/icons.js');
require('../js/data.js');
require('../js/templates.js');
require('../js/state.js');
require('../js/theme-panel.js');
require('../js/inspector.js');

const S = global.window.Studio;

console.log('--- TEST SUITE: Visual Bottom Nav Tabs & Blank Start Defensiveness ---');

// Test 1: startBlank('app') initializes clean state with icons theme
S.State.startBlank('app');
assert.strictEqual(S.State.data.target, 'app', 'Target is app');
assert.strictEqual(S.State.data.pages.length, 1, 'Only 1 blank page');
assert.strictEqual(S.State.data.pages[0].name, 'Screen 1', 'Screen 1 is named properly');
assert.strictEqual(S.State.data.screen.length, 0, 'Canvas screen is completely blank (0 blocks)');
assert.ok(S.State.data.theme.icons, 'theme.icons is defined');
assert.strictEqual(S.State.data.theme.icons.weight, 400, 'icons.weight is 400');
console.log('  PASS: startBlank creates clean blank project with guarded theme.icons');

// Test 2: Theme.sync executes without error even if icons was null
S.State.data.theme.icons = null;
assert.doesNotThrow(() => {
  S.Theme.sync();
}, 'Theme.sync does not throw when icons is null');
console.log('  PASS: Theme.sync defensively handles null icons');

// Restore icons
S.State.data.theme.icons = { weight: 400, fill: 0, stroke: 1.8 };

// Test 3: Inspector bottomNavTabsField generates visual tab cards
const navBlock = S.makeBlock('bottomnav', {
  items: 'home:Home\nsearch:Search\nperson:Profile',
  active: 0
});
const fieldDef = { key: 'items', label: 'Items', type: 'textarea' };
const html = S.Inspector.bottomNavTabsField(navBlock, fieldDef);

assert.ok(html.includes('class="bnav-tab-pill'), 'Generates .bnav-tab-pill');
assert.ok(html.includes('class="bnav-tab-ico-btn"'), 'Generates icon buttons');
assert.ok(html.includes('class="f-input bnav-tab-label-input"'), 'Generates tab label input');
assert.ok(html.includes('data-bnav-act="ico"'), 'Generates ico action data attribute');
assert.ok(html.includes('data-bnav-act="del"'), 'Generates del action data attribute');
assert.ok(html.includes('data-bnav-act="add"'), 'Generates add tab button');
assert.ok(html.includes('class="f-textarea"'), 'Preserves raw textarea in details drawer');
console.log('  PASS: bottomNavTabsField generates rich visual tab pill editor with raw fallback');

// Test 4: Page deletion resets to clean Screen 1 if all pages deleted
const pageId = S.State.data.pages[0].id;
S.State.deletePage(pageId);
assert.strictEqual(S.State.data.pages.length, 1, 'Safe fallback keeps 1 page');
assert.strictEqual(S.State.data.pages[0].name, 'Screen 1', 'Fallback page is Screen 1');
assert.strictEqual(S.State.data.pages[0].screen.length, 0, 'Fallback page is blank');
console.log('  PASS: Page deletion never crashes into 0 pages or broken array');

console.log('=========================================');

// Test 5: Top App Bar Action Items Parser & Visual Action Field
const appbarBlock = S.makeBlock('appbar', {
  actions: 'search, more_vert'
});
const actionItems = S.getAppBarActionItems(appbarBlock.props);
assert.strictEqual(actionItems.length, 2, 'Parsed 2 action items');
assert.strictEqual(actionItems[0].icon, 'search', 'First action is search');
assert.strictEqual(actionItems[0].target, 'search_overlay', 'Search defaults to search_overlay target');
assert.strictEqual(actionItems[1].icon, 'more_vert', 'Second action is more_vert');
assert.strictEqual(actionItems[1].target, 'menu', 'more_vert defaults to menu target');
console.log('  PASS: S.getAppBarActionItems parses actions into structured action items with smart targets');

// Test 6: Custom Destination on Action Button
actionItems[0].target = 'CustomSearchScreen';
appbarBlock.props.actionItems = actionItems;
const renderedHtml = S.components.appbar.html(appbarBlock.props);
assert.ok(renderedHtml.includes('data-nav-target="CustomSearchScreen"'), 'Rendered custom screen nav target');
assert.ok(renderedHtml.includes('data-appbar-act-idx="0"'), 'Rendered data-appbar-act-idx for direct in-canvas editing');
console.log('  PASS: App bar HTML renderer correctly binds custom user destination to action button');

// Test 7: Inspector appBarActionsField generates visual action editor
const abFieldDef = { key: 'actions', label: 'Actions', type: 'text' };
const abHtml = S.Inspector.appBarActionsField(appbarBlock, abFieldDef);
assert.ok(abHtml.includes('class="ab-action-pill"'), 'Generates .ab-action-pill');
assert.ok(abHtml.includes('class="ab-action-ico-btn"'), 'Generates action icon buttons');
assert.ok(abHtml.includes('ab-action-target-select'), 'Generates destination dropdown');
assert.ok(abHtml.includes('value="search_overlay"'), 'Includes Search Overlay option');
assert.ok(abHtml.includes('value="__create_search__"'), 'Includes Create Search Screen option');
assert.ok(abHtml.includes('class="ab-quick-add-tray"'), 'Generates Quick Add presets tray');
console.log('  PASS: Inspector generates complete visual action editor with quick add presets');

console.log('ALL VISUAL BOTTOM NAV, TOP BAR ACTIONS & BLANK START TESTS PASSED PERFECTLY!');
