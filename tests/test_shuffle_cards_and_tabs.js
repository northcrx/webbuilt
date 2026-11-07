const path = require('path');
const assert = require('assert');

// Setup mock environment
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
    classList: { add: function () {}, remove: function () {}, toggle: function () {}, contains: function () { return false; } },
    querySelectorAll: function () { return []; },
    querySelector: function () { return null; },
    appendChild: function () {},
    removeChild: function () {},
    focus: function () {},
    select: function () {},
    getBoundingClientRect: function () { return { top: 0, left: 0, width: 360, height: 640 }; }
  };
}

global.document = {
  readyState: 'loading',
  documentElement: {
    setAttribute: function () {},
    getAttribute: function () { return ''; }
  },
  head: { appendChild: function () {} },
  body: { appendChild: function () {} },
  getElementById: function (id) { return makeEl(id); },
  querySelectorAll: function () { return []; },
  querySelector: function () { return null; },
  createElement: function () { return makeEl(); },
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
require('../js/context-menu.js');
require('../js/connect-panel.js');
require('../js/app.js');

const S = window.Studio;
S.State.init();

let total = 0;
let passed = 0;

function test(desc, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log('  PASS: ' + desc);
  } catch (err) {
    console.error('  FAIL: ' + desc, err.message);
    process.exitCode = 1;
  }
}

console.log('\n--- TEST SUITE 1: 4 Square Rounded Cards (Screenshot Style) ---');

test('shufflecards block created successfully with correct defaults', () => {
  const blk = S.makeBlock('shufflecards');
  assert(blk, 'shufflecards block must be created');
  assert.strictEqual(blk.type, 'shufflecards');
  assert.strictEqual(blk.props.layout, 'grid2x2');
  assert.strictEqual(blk.props.activeCategory, 'All');
  assert.strictEqual(blk.props.showTabs, true);
});

test('grid2x2 renders 4 square rounded corners cards exactly matching screenshot', () => {
  const blk = S.makeBlock('shufflecards', { layout: 'grid2x2' });
  const html = S.Render.blockMarkup(blk);

  assert(html.includes('music-shuffle-cards'), 'Must render .music-shuffle-cards wrapper');
  assert(html.includes('sc-grid2x2'), 'Must render 2x2 grid container');
  
  // Card 1: Shuffle Play
  assert(html.includes('Shuffle Play'), 'Card 1 must be Shuffle Play');
  assert(html.includes('Tap to mix &amp; play') || html.includes('Tap to mix & play'), 'Card 1 subtitle must be Tap to mix & play');
  assert(html.includes('sc-badge-circle'), 'Card 1 must have circular badge');

  // Card 2: Midnight Drive
  assert(html.includes('Midnight Drive'), 'Card 2 must be Midnight Drive');
  assert(html.includes('Nova Lane'), 'Card 2 artist must be Nova Lane');
  assert(html.includes('sc-badge-squircle'), 'Card 2 must have squircle badge');

  // Card 3: Kyoto Garden
  assert(html.includes('Kyoto Garden'), 'Card 3 must be Kyoto Garden');
  assert(html.includes('Zen Echoes'), 'Card 3 artist must be Zen Echoes');

  // Card 4: The Reading Room
  assert(html.includes('The Reading Room'), 'Card 4 must be The Reading Room');
  assert(html.includes('Ambient Works'), 'Card 4 artist must be Ambient Works');
});

test('Every card has song name and artist written at bottom', () => {
  const blk = S.makeBlock('shufflecards');
  const html = S.Render.blockMarkup(blk);

  assert(html.includes('class="sc-text"'), 'Every card must have .sc-text bottom container');
  assert(html.includes('class="sc-card-title"'), 'Every card must display .sc-card-title at bottom');
  assert(html.includes('class="sc-card-artist"'), 'Every card must display .sc-card-artist at bottom');
});

console.log('\n--- TEST SUITE 2: Music Listening Category Tabs & Indian Music ---');

test('Category tabs render as small rounded boxes with active indicator', () => {
  const blk = S.makeBlock('shufflecards', {
    categories: 'All | Indian | Chill | Focus | Workout | Pop',
    activeCategory: 'All'
  });
  const html = S.Render.blockMarkup(blk);

  assert(html.includes('class="sc-tabs"'), 'Must render .sc-tabs row');
  assert(html.includes('data-sc-cat="All"'), 'Must render All tab');
  assert(html.includes('data-sc-cat="Indian"'), 'Must render Indian tab');
  assert(html.includes('data-sc-cat="Chill"'), 'Must render Chill tab');
  assert(html.includes('data-sc-cat="Focus"'), 'Must render Focus tab');
  assert(html.includes('class="sc-tab is-active" data-sc-cat="All"'), 'All tab must be active');
});

test('Selecting Indian category switches cards to Indian songs', () => {
  const blk = S.makeBlock('shufflecards', {
    activeCategory: 'Indian'
  });
  const html = S.Render.blockMarkup(blk);

  assert(html.includes('class="sc-tab is-active" data-sc-cat="Indian"'), 'Indian tab must be marked active');
  assert(html.includes('Shuffle Indian'), 'Must display Shuffle Indian card');
  assert(html.includes('Kesariya'), 'Must display Kesariya song card');
  assert(html.includes('Arijit Singh'), 'Must display Arijit Singh artist');
  assert(html.includes('Raag Yaman'), 'Must display Raag Yaman card');
  assert(html.includes('Brown Munde'), 'Must display Brown Munde card');
});

console.log('\n--- TEST SUITE 3: Layout Variations & Tap to Play ---');

test('Layout variation: grid3x2 renders 6 cards', () => {
  const blk = S.makeBlock('shufflecards', {
    layout: 'grid3x2',
    items: 'note | S1 | A1\nnote | S2 | A2\nnote | S3 | A3\nnote | S4 | A4\nnote | S5 | A5\nnote | S6 | A6'
  });
  const html = S.Render.blockMarkup(blk);
  assert(html.includes('sc-grid3x2'), 'Must render .sc-grid3x2 layout');
  assert(html.includes('S6'), 'Must render 6th card');
});

test('Layout variation: carousel renders horizontal scrolling rail', () => {
  const blk = S.makeBlock('shufflecards', { layout: 'carousel' });
  const html = S.Render.blockMarkup(blk);
  assert(html.includes('sc-carousel'), 'Must render .sc-carousel rail');
});

test('Layout variation: featured renders hero card', () => {
  const blk = S.makeBlock('shufflecards', { layout: 'featured' });
  const html = S.Render.blockMarkup(blk);
  assert(html.includes('sc-featured'), 'Must render .sc-featured layout');
});

test('Layout variation: compact renders dense squircles', () => {
  const blk = S.makeBlock('shufflecards', { layout: 'compact' });
  const html = S.Render.blockMarkup(blk);
  assert(html.includes('sc-compact'), 'Must render .sc-compact layout');
});

test('Active card displays animated playing equalizer wave and data-sc-card-idx for tap-to-play', () => {
  const blk = S.makeBlock('shufflecards', {
    activeCard: 1,
    playing: true
  });
  const html = S.Render.blockMarkup(blk);

  assert(html.includes('data-sc-card-idx="1"'), 'Cards must have data-sc-card-idx for click handlers');
  assert(html.includes('sc-card is-active is-playing'), 'Active card 1 must have is-active is-playing');
  assert(html.includes('sc-live-eq'), 'Active playing card must render animated live equalizer wave');
});

console.log(`\n=========================================`);
console.log(`RESULTS: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('ALL SHUFFLE CARDS & TABS TESTS PASSED PERFECTLY!\n');
} else {
  process.exit(1);
}
