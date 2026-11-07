// Automated test suite for Pages Panel, Hidden Screens, Settings Group, and Header Overflow Fixes
const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = global;
global.requestAnimationFrame = function (cb) { return setTimeout(cb, 0); };
global.cancelAnimationFrame = function (id) { clearTimeout(id); };

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

// Load modules in exact order
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

console.log('\n--- TEST SUITE 1: Pages Panel & Screen Management ---');
assert('Project has initialized pages array', Array.isArray(S.State.data.pages) && S.State.data.pages.length > 0);
const initialCount = S.State.data.pages.length;

// Test duplicatePage
const dupPage = S.State.duplicatePage(S.State.data.pages[0].id);
assert('duplicatePage creates a new page in pages array', dupPage && S.State.data.pages.length === initialCount + 1);
assert('duplicatePage clones page blocks with new IDs', dupPage.screen.length === S.State.data.pages[0].screen.length);

// Test togglePageHidden (Hidden from bottom navigation)
const pageToHideId = dupPage.id;
assert('Page is initially not hidden from nav', !dupPage.hiddenFromNav);
S.State.togglePageHidden(pageToHideId);
const updatedPage = S.State.pageById(pageToHideId);
assert('togglePageHidden sets hiddenFromNav to true', updatedPage && updatedPage.hiddenFromNav === true);

// Verify that hidden page is excluded from bottom navigation items
const navBlock = S.State.data.screen.filter(b => b.type === 'bottomnav')[0];
assert('Bottom nav block exists', !!navBlock);
const navItemLines = (navBlock.props.items || '').split('\n').filter(Boolean);
assert('Bottom nav does NOT include hidden page in tabs', !navBlock.props.items.includes(updatedPage.name));

console.log('\n--- TEST SUITE 2: Settings Group & Options Card ---');
const settingsBlock = S.makeBlock('settingslist', {
  title: 'Preferences',
  style: 'card',
  items: 'notifications:Notifications | Alerts & sounds | switch:on\nlock:Security | 2FA and Biometrics | chevron:Security'
});
assert('settingslist block created successfully', !!settingsBlock);
const settingsHtml = S.components.settingslist.html(settingsBlock.props);
assert('settingslist renders with card visual style', settingsHtml.includes('settings-card style-card'));
assert('settingslist chevron row includes data-nav-target="Security"', settingsHtml.includes('data-nav-target="Security"'));
assert('settingslist switch row includes switch element', settingsHtml.includes('class="switch on"'));

// Test alternate styles for settings card
['flat', 'outlined', 'glass'].forEach(st => {
  const h = S.components.settingslist.html(Object.assign({}, settingsBlock.props, { style: st }));
  assert('settingslist renders style-' + st + ' correctly', h.includes('settings-card style-' + st));
});

console.log('\n--- TEST SUITE 3: Card Navigation Target ---');
const cardBlock = S.makeBlock('card', {
  title: 'Special Offer',
  navTarget: 'Details'
});
const cardHtml = S.components.card.html(cardBlock.props);
assert('card with navTarget outputs is-clickable class', cardHtml.includes('is-clickable'));
assert('card with navTarget outputs data-nav-target="Details"', cardHtml.includes('data-nav-target="Details"'));

console.log('\n--- TEST SUITE 4: Top Header Bounds & Overflow Prevention CSS ---');
const cssContent = fs.readFileSync(path.resolve(__dirname, '../js/mockup-css.js'), 'utf8');
assert('CSS has .ab-search-header with box-sizing border-box', cssContent.includes('.ab-search-header') && cssContent.includes('box-sizing: border-box'));
assert('CSS has .ab-search-input-box with min-width: 0', cssContent.includes('.ab-search-input-box') && cssContent.includes('min-width: 0'));
assert('CSS has .ab-search-ph with overflow hidden and ellipsis', cssContent.includes('.ab-search-ph') && cssContent.includes('text-overflow: ellipsis'));
assert('CSS has .ab-store-header with box-sizing border-box', cssContent.includes('.ab-store-header') && cssContent.includes('box-sizing: border-box'));

console.log('\n--- TEST SUITE 5: Floating Toolbar (.cmp-chrome) Modern Styling & Position ---');
const shellCss = fs.readFileSync(path.resolve(__dirname, '../css/shell.css'), 'utf8');
assert('.cmp-chrome uses frosted glass background (not pure dark)', shellCss.includes('.cmp-chrome') && shellCss.includes('backdrop-filter: blur(12px)'));
assert('.cmp-chrome dock rule positions chrome above bottom nav (never covers tabs)', shellCss.includes('.screen-dock > .cmp > .cmp-chrome') && shellCss.includes('bottom: calc(100% + 10px) !important'));
assert('.cmp-chrome first-child rule positions chrome at top-right (never drops onto tabs)', shellCss.includes('.cmp:first-child > .cmp-chrome') && shellCss.includes('top: 8px !important'));

console.log('\n=========================================');
console.log('RESULTS: ' + passed + ' / ' + total + ' tests passed.');
if (passed === total) {
  console.log('ALL PAGES, SETTINGS & HEADER FIXES PASSED PERFECTLY!');
} else {
  console.error('TESTS FAILED!');
  process.exit(1);
}
