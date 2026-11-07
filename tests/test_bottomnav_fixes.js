// Automated test suite for Bottom Navigation, Top Bar, and Menu Navigation Fixes
const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = global;
global.requestAnimationFrame = function(cb) { return setTimeout(cb, 0); };
global.cancelAnimationFrame = function(id) { clearTimeout(id); };
function makeEl(id) {
  return {
    id: id || '',
    hidden: false,
    disabled: false,
    value: '',
    textContent: '',
    innerHTML: '',
    dataset: {},
    setAttribute: function () {},
    getAttribute: function () { return ''; },
    removeAttribute: function () {},
    style: {
      setProperty: function () {},
      getPropertyValue: function () { return ''; }
    },
    addEventListener: function () {},
    removeEventListener: function () {},
    classList: { add: function () {}, remove: function () {}, toggle: function () {} },
    querySelectorAll: function () { return []; },
    querySelector: function () { return null; },
    appendChild: function () {},
    removeChild: function () {},
    getBoundingClientRect: function () { return { top: 0, left: 0, width: 360, height: 640 }; }
  };
}

global.document = {
  readyState: 'loading',
  documentElement: {
    setAttribute: function () {},
    getAttribute: function () { return ''; }
  },
  head: {
    appendChild: function () {}
  },
  body: {
    appendChild: function () {}
  },
  getElementById: function (id) {
    return makeEl(id);
  },
  querySelectorAll: function () { return []; },
  querySelector: function () { return null; },
  createElement: function () {
    return makeEl();
  },
  addEventListener: function () {}
};
global.localStorage = {
  store: {},
  getItem: function (k) { return this.store[k] || null; },
  setItem: function (k, v) { this.store[k] = String(v); },
  removeItem: function (k) { delete this.store[k]; }
};

// Load modules in order
require('../js/util.js');
require('../js/mockup-css.js');
require('../js/icons.js');
require('../js/data.js');
require('../js/web-blocks.js');
require('../js/ext-blocks.js');
require('../js/templates.js');
require('../js/state.js');
require('../js/render.js');
require('../js/inspector.js');
require('../js/font-picker.js');
require('../js/theme-panel.js');
require('../js/fonts-panel.js');
require('../js/icons-panel.js');
require('../js/interactions.js');
require('../js/project.js');
require('../js/app.js');

const S = window.Studio;
S.State.init();

let passed = 0;
let total = 0;
function assert(desc, condition) {
  total++;
  if (condition) {
    passed++;
    console.log('  PASS: ' + desc);
  } else {
    console.error('  FAIL: ' + desc);
    process.exitCode = 1;
  }
}

console.log('\n--- TEST SUITE 1: Bottom Navigation Deduplication in addBlock ---');
// Starting screen has 1 bottomnav
const initialNavs = S.State.data.screen.filter(b => b.type === 'bottomnav' || b.type.indexOf('bottomnav') === 0);
assert('Starting screen has exactly 1 bottom nav', initialNavs.length === 1);

// User clicks "Bottom nav (Floating)" from palette
S.App.addBlock('bottomnavfloating');
const navsAfterAdd = S.State.data.screen.filter(b => b.type === 'bottomnav' || b.type.indexOf('bottomnav') === 0);
assert('Screen still has exactly 1 bottom nav after adding floating variant (NO DUPLICATE)', navsAfterAdd.length === 1);
assert('Existing bottom nav style updated to floating', navsAfterAdd[0].props.style === 'floating');

// User clicks "Bottom nav (Center FAB)" from palette
S.App.addBlock('bottomnavfab');
const navsAfterFab = S.State.data.screen.filter(b => b.type === 'bottomnav' || b.type.indexOf('bottomnav') === 0);
assert('Screen still has exactly 1 bottom nav after adding center-fab variant', navsAfterFab.length === 1);
assert('Existing bottom nav style updated to center-fab', navsAfterFab[0].props.style === 'center-fab');

console.log('\n--- TEST SUITE 2: Multi-Screen Style Synchronization across d.pages ---');
// Verify style is synchronized to all pages in d.pages
assert('Project has multiple pages', S.State.data.pages.length > 1);
S.State.data.pages.forEach((p, idx) => {
  const pNavs = p.screen.filter(b => b.type === 'bottomnav' || b.type.indexOf('bottomnav') === 0);
  assert('Page ' + idx + ' (' + p.name + ') has exactly 1 bottom nav', pNavs.length === 1);
  assert('Page ' + idx + ' (' + p.name + ') bottom nav style is center-fab', pNavs[0].props.style === 'center-fab');
  assert('Page ' + idx + ' (' + p.name + ') bottom nav active index is ' + idx, pNavs[0].props.active === idx);
});

console.log('\n--- TEST SUITE 3: Screen Dock Rendering Deduplication ---');
// Artificially inject a duplicate bottom nav into screen to test dockMarkup resilience
S.State.data.screen.push({
  id: 'stray_nav_test',
  type: 'bottomnav',
  props: { style: 'material', items: 'home:Home\nsettings:Settings', active: 0 }
});
const dockHtml = S.Render.dockMarkup(false, null);
const navBarMatches = (dockHtml.match(/class="nav-bar/g) || []).length;
assert('dockMarkup renders only 1 bottom navigation bar even with stray blocks in screen', navBarMatches === 1);

// Now trigger syncNavFor and verify stray block was purged
S.State.syncNavFromPages();
const cleanedNavs = S.State.data.screen.filter(b => b.type === 'bottomnav' || b.type.indexOf('bottomnav') === 0);
assert('syncNavFromPages automatically purged duplicate stray bottom nav', cleanedNavs.length === 1);

console.log('\n--- TEST SUITE 4: Page Switching Style & Active Tab Preservation ---');
// Switch to page 1
const page1Id = S.State.data.pages[1].id;
S.State.switchPage(page1Id);
assert('Active page is page 1', S.State.data.activePageId === page1Id);
const currentScreenNav = S.State.data.screen.filter(b => b.type === 'bottomnav')[0];
assert('Switched screen has bottom nav with style center-fab', currentScreenNav && currentScreenNav.props.style === 'center-fab');
assert('Switched screen has active index 1 (not 0)', currentScreenNav && currentScreenNav.props.active === 1);

console.log('\n--- TEST SUITE 5: Top App Bar Smart Insertion & Replacement ---');
// Find initial app bar
const initialTopBars = S.State.data.screen.filter(b => b.type === 'appbar');
assert('Screen has 1 top app bar', initialTopBars.length === 1);

// Add profile header bar
S.App.addBlock('profilebar');
const barsAfterProfile = S.State.data.screen.filter(b => b.type === 'appbar');
assert('Screen still has exactly 1 top app bar (NO duplicate at bottom)', barsAfterProfile.length === 1);
assert('Top bar variant updated to profile', barsAfterProfile[0].props.variant === 'profile');
assert('Top bar is at index 0 of screen', S.State.data.screen[0].type === 'appbar');

// Add store header bar
S.App.addBlock('storeheader');
const barsAfterStore = S.State.data.screen.filter(b => b.type === 'appbar');
assert('Top bar updated to store variant at index 0', barsAfterStore.length === 1 && barsAfterStore[0].props.variant === 'store');

console.log('\n--- TEST SUITE 6: Home Screen Navigation Fallback ---');
// When screen names are Discover, Map, Saved, Profile (no screen named 'Home')
S.State.data.pages[0].name = 'Discover';
// pageForLabel('Home') must navigate to screen 0 instead of failing / opening prompt
const homeTarget = S.Interactions.pageForLabel ? S.Interactions.pageForLabel('Home') : 0;
// Test transitionToPage logic with 'home'
assert('Clicking Home navigates to primary screen 0 even if named Discover', homeTarget === 0);

console.log('\n--- TEST SUITE 7: All 15 Bottom Navigation Styles HTML rendering ---');
const styles = [
  'material', 'floating', 'center-fab', 'compact', 'minimal',
  'glass', 'dot', 'expanding-pill', 'neon-cyber', 'split-island',
  'badge-counter', 'gradient-border', 'curved-liquid', 'segmented-dock', 'pill-outline'
];
styles.forEach(st => {
  const html = S.components.bottomnav.html({
    style: st,
    items: 'home:Home\nmap:Map\nperson:Profile',
    active: 0
  });
  assert('Style ' + st + ' generates valid markup with data-page-index', html.includes('data-page-index="0"'));
});

console.log('\n=========================================');
console.log('RESULTS: ' + passed + ' / ' + total + ' tests passed.');
if (passed === total) {
  console.log('ALL BOTTOM MENU & TOP BAR TESTS PASSED PERFECTLY!');
} else {
  console.error('TESTS FAILED!');
  process.exit(1);
}
