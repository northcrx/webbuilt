const path = require('path');
// Automated tests for:
// 1. Mini audio player stuck in bottom dock (app + web modes)
// 2. Page & tab title isolation (no "Keeps" leak across screens)
// 3. Sleep Timer circular clock dial
// 4. Studio Master 5-band Graphic Equalizer

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

// Load modules
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

let passed = 0;
let total = 0;
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

console.log('\n--- TEST SUITE 1: Mini Audio Player Placement & Bottom Docking ---');

test('isDockBlock returns true for miniplayer in mobile app target', () => {
  S.State.data.target = 'app';
  const mp = S.makeBlock('miniplayer');
  assert.strictEqual(S.Render.isDockBlock(mp), true);
});

test('isDockBlock returns true for miniplayer in web target (sticky bottom bar)', () => {
  S.State.data.target = 'web';
  const mp = S.makeBlock('miniplayer');
  assert.strictEqual(S.Render.isDockBlock(mp), true);
});

test('dockMarkup renders miniplayer in web target dock', () => {
  S.State.data.target = 'web';
  const mp = S.makeBlock('miniplayer');
  const dockHtml = S.Render.dockMarkup(false, null, [mp]);
  assert(dockHtml.includes('screen-dock'), 'dockMarkup should produce .screen-dock');
  assert(dockHtml.includes('cmp-miniplayer'), 'dockMarkup should render cmp-miniplayer inside dock');
});

test('dockMarkup sorts miniplayer BEFORE bottomnav in mobile app', () => {
  S.State.data.target = 'app';
  const mp = S.makeBlock('miniplayer');
  const bn = S.makeBlock('bottomnav');
  // Pass in reverse order: bn first, mp second
  const dockHtml = S.Render.dockMarkup(false, null, [bn, mp]);
  const mpIdx = dockHtml.indexOf('cmp-miniplayer');
  const bnIdx = dockHtml.indexOf('cmp-bottomnav');
  assert(mpIdx < bnIdx, 'miniplayer must be ordered before bottomnav in the dock');
});

test('webInner includes screen-dock when miniplayer is on the page', () => {
  S.State.data.target = 'web';
  const mp = S.makeBlock('miniplayer');
  const hero = S.makeBlock('webhero');
  S.State.data.screen = [hero, mp];
  const webHtml = S.Render.webInner(false);
  assert(webHtml.includes('screen-dock'), 'webInner must render screen-dock');
  assert(webHtml.includes('cmp-miniplayer'), 'webInner must dock the miniplayer at bottom');
});

console.log('\n--- TEST SUITE 2: Page & Tab Title Cross-Contamination Fix ---');

test('addPage does NOT leak previous screen appbar title onto new page', () => {
  S.State.data.target = 'app';
  S.State.data.pages = [
    {
      id: 'page_keeps',
      name: 'Keeps',
      icon: 'msr:note',
      screen: [
        S.makeBlock('appbar', { title: 'Keeps' }),
        S.makeBlock('card', { title: 'Keep Note #1' })
      ]
    }
  ];
  S.State.data.activePageId = 'page_keeps';
  S.State.data.screen = S.State.data.pages[0].screen;

  // Now user creates a new screen named "All"
  const newPage = S.State.addPage('All');
  assert.strictEqual(newPage.name, 'All');
  
  // Verify that the appbar on the new page says "All", NOT "Keeps"
  const newAppbar = newPage.screen.find(b => b.type === 'appbar');
  assert(newAppbar, 'New page should have an appbar');
  assert.strictEqual(newAppbar.props.title, 'All', 'New page appbar must have title "All", not cloned "Keeps"');
});

test('S.pagesFromScreen creates clean title matching tab label for all screens', () => {
  const initialScreen = [
    S.makeBlock('appbar', { title: 'Keeps' }),
    S.makeBlock('bottomnav', { items: 'home:Home\nsearch:Search\nlibrary:Library\nnote:Keeps', active: 3 })
  ];
  const result = S.pagesFromScreen(initialScreen);
  assert.strictEqual(result.pages.length, 4);
  
  // Page 0 (Home) must have appbar title "Home", not "Keeps"
  const page0Appbar = result.pages[0].screen.find(b => b.type === 'appbar');
  assert(page0Appbar, 'Page 0 must have appbar');
  assert.strictEqual(page0Appbar.props.title, 'Home', 'Page 0 appbar title must be Home');
});

test('Inspector bottomNavTabsField activeIndex reflects activePageId', () => {
  S.State.data.target = 'app';
  S.State.data.pages = [
    { id: 'p1', name: 'Home', screen: [] },
    { id: 'p2', name: 'Explore', screen: [] },
    { id: 'p3', name: 'Keeps', screen: [] }
  ];
  S.State.data.activePageId = 'p3'; // Active screen is Keeps (idx 2)
  const bn = S.makeBlock('bottomnav', { items: 'home:Home\nexplore:Explore\nnote:Keeps', active: 0 });
  const html = S.Inspector.bottomNavTabsField(bn, { key: 'items' });
  
  // Radio 2 (Keeps) should have is-active
  assert(html.includes('data-tab-idx="2"'), 'Must contain tab 2');
  assert(html.includes('class="bnav-tab-pill bnav-tab-row is-active" data-tab-index="2"'), 'Tab 2 Keeps must be marked active matching activePageId');
});

console.log('\n--- TEST SUITE 3: Sleep Timer Circular Clock Dial ---');

test('sleepTimerClockMarkup renders SVG clock face with tick marks', () => {
  const html = S.Render.sleepTimerClockMarkup('30m');
  assert(html.includes('mp-clock-picker'), 'Must contain .mp-clock-picker');
  assert(html.includes('mp-clock-dial'), 'Must contain .mp-clock-dial');
  assert(html.includes('mp-clock-svg'), 'Must contain SVG clock face');
  assert(html.includes('mp-clk-tick'), 'Must render radial tick marks');
});

test('sleepTimerClockMarkup renders active clock hand and glowing arc', () => {
  const html = S.Render.sleepTimerClockMarkup('15m');
  assert(html.includes('mp-clock-arc is-active'), 'Must render active glowing arc');
  assert(html.includes('mp-clock-hand'), 'Must render clock hand');
  assert(html.includes('mp-clock-pointer'), 'Must render pointer head');
});

test('sleepTimerClockMarkup renders digital countdown readout', () => {
  const html30 = S.Render.sleepTimerClockMarkup('30m');
  assert(html30.includes('30:00'), 'Must render 30:00 digital time');
  assert(html30.includes('mp-clock-center-readout'), 'Must contain center readout');

  const htmlOff = S.Render.sleepTimerClockMarkup('off');
  assert(htmlOff.includes('OFF'), 'Must render OFF digital readout');
});

test('sleepTimerClockMarkup renders 4 cardinal dial nodes and quick chips', () => {
  const html = S.Render.sleepTimerClockMarkup('45m');
  assert(html.includes('node-15'), 'Must render 15m dial node');
  assert(html.includes('node-30'), 'Must render 30m dial node');
  assert(html.includes('node-45 on'), '45m node must have on class');
  assert(html.includes('node-60'), 'Must render 60m dial node');
  assert(html.includes('data-mp-timer="track"'), 'Must render End of Track chip');
  assert(html.includes('data-mp-timer="off"'), 'Must render Off chip');
});

console.log('\n--- TEST SUITE 4: Studio Master 5-Band Graphic Equalizer ---');

test('equalizerRackMarkup renders stereo VU meter with CH-L and CH-R', () => {
  const html = S.Render.equalizerRackMarkup({ eqPreset: 'Bass Boost' }, true);
  assert(html.includes('mp-mod-eq-rack'), 'Must contain .mp-mod-eq-rack');
  assert(html.includes('CH-L'), 'Must render Left VU meter');
  assert(html.includes('CH-R'), 'Must render Right VU meter');
  assert(html.includes('mp-vu-mini-fill live'), 'Must render animated VU fill when playing');
});

test('equalizerRackMarkup renders dynamic SVG frequency response curve', () => {
  const html = S.Render.equalizerRackMarkup({ eqPreset: 'Bass Boost' }, false);
  assert(html.includes('mp-eq-curve-svg'), 'Must render curve SVG');
  assert(html.includes('mp-eq-curve-stroke'), 'Must render curve stroke path');
  assert(html.includes('mp-eq-curve-pt'), 'Must render curve control points');
  assert(html.includes('+12dB') && html.includes('0dB') && html.includes('-12dB'), 'Must render dB reference grid lines');
});

test('equalizerRackMarkup renders 5 vertical faders with exact frequencies and dB readouts', () => {
  const html = S.Render.equalizerRackMarkup({ eqPreset: 'Bass Boost' }, false);
  assert(html.includes('60Hz'), 'Must render 60Hz band');
  assert(html.includes('230Hz'), 'Must render 230Hz band');
  assert(html.includes('910Hz'), 'Must render 910Hz band');
  assert(html.includes('3.6kHz'), 'Must render 3.6kHz band');
  assert(html.includes('14kHz'), 'Must render 14kHz band');
  assert(html.includes('mp-eq-range'), 'Must render interactive range sliders');
  assert(html.includes('mp-eq-thumb'), 'Must render metallic thumb handles');
});

test('equalizerRackMarkup renders full Material 3 preset chips', () => {
  const html = S.Render.equalizerRackMarkup({ eqPreset: 'Vocal' }, false);
  assert(html.includes('data-mp-eq="Flat"'), 'Must render Flat preset');
  assert(html.includes('data-mp-eq="Bass Boost"'), 'Must render Bass Boost preset');
  assert(html.includes('class="mp-mod-chip on" data-mp-eq="Vocal"'), 'Vocal preset must have on class');
  assert(html.includes('data-mp-eq="Electronic"'), 'Must render Electronic preset');
  assert(html.includes('data-mp-eq="Rock"'), 'Must render Rock preset');
  assert(html.includes('data-mp-eq="Studio Master"'), 'Must render Studio Master preset');
});

test('playerModalMarkup renders redesigned clock timer and equalizer when enabled', () => {
  S.State.data.target = 'app';
  const mp = S.makeBlock('miniplayer', {
    showSleepTimer: true,
    showEqualizer: true,
    sleepTimer: '30m',
    eqPreset: 'Bass Boost'
  });
  S.State.data.screen = [mp];
  const modalHtml = S.Render.playerModalMarkup();
  assert(modalHtml.includes('mp-clock-picker'), 'Player modal must contain redesigned clock picker');
  assert(modalHtml.includes('mp-mod-eq-rack'), 'Player modal must contain redesigned equalizer rack');
});

console.log(`\n=========================================`);
console.log(`RESULTS: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('ALL CLOCK DIAL, DOCK PLACEMENT & TITLE ISOLATION TESTS PASSED PERFECTLY!\n');
}
