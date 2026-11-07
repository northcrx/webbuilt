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

// Load modules in proper order
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

console.log('\n--- TEST SUITE: Dedicated Player Views, Dropdown Menu & Custom Timing ---');

test('playerModalMarkup renders clean Now Playing view without crammed sleeper/eq', () => {
  S.State.data.target = 'app';
  const mp = S.makeBlock('miniplayer', {
    title: 'Midnight Drive',
    artist: 'Nova Lane',
    sleepTimer: '30m',
    eqPreset: 'Bass Boost'
  });
  S.State.data.screen = [mp];
  const modalHtml = S.Render.playerModalMarkup();
  
  // Now Playing view exists and is active
  assert(modalHtml.includes('class="ui-pm-view ui-pm-view-nowplaying is-active"'), 'Now Playing view must be present and active by default');
  
  // Inspect the content of nowplaying view
  const npViewContent = modalHtml.split('class="ui-pm-view ui-pm-view-nowplaying is-active"')[1].split('class="ui-pm-view ui-pm-view-equalizer"')[0];
  
  // Sleeper clock and modular faders rack are NOT inside nowplaying view
  assert(!npViewContent.includes('mp-clock-picker'), 'Sleep timer clock dial MUST NOT be crammed inside the Now Playing playback view');
  assert(!npViewContent.includes('mp-mod-eq-rack'), 'Equalizer rack MUST NOT be crammed inside the Now Playing playback view');
  
  // Quick action bar is present
  assert(npViewContent.includes('ui-pm-quick-bar'), 'Now Playing view must feature quick access bar');
  assert(npViewContent.includes('data-pm-goto="equalizer"'), 'Quick bar must have button to jump to Equalizer');
  assert(npViewContent.includes('data-pm-goto="timer"'), 'Quick bar must have button to jump to Sleep Timer');
});

test('playerModalMarkup renders top header dropdown menu with all options', () => {
  const modalHtml = S.Render.playerModalMarkup();
  assert(modalHtml.includes('ui-pm-menu-wrap'), 'Header must contain menu wrapper');
  assert(modalHtml.includes('data-ui-player-menu-btn="1"'), 'Header must have menu trigger button');
  assert(modalHtml.includes('ui-pm-dropdown-menu'), 'Header must have dropdown menu');
  assert(modalHtml.includes('data-pm-goto="equalizer"'), 'Dropdown must have Equalizer option');
  assert(modalHtml.includes('data-pm-goto="timer"'), 'Dropdown must have Sleep Timer option');
  assert(modalHtml.includes('data-pm-goto="speed"'), 'Dropdown must have Speed option');
  assert(modalHtml.includes('data-pm-goto="download"'), 'Dropdown must have Download option');
  assert(modalHtml.includes('data-pm-act="inspect"'), 'Dropdown must have Inspector option');
});

test('Dedicated Equalizer Page has back navigation, VU meters, curve, faders and rotary dials', () => {
  const modalHtml = S.Render.playerModalMarkup();
  assert(modalHtml.includes('class="ui-pm-view ui-pm-view-equalizer"'), 'Modal must contain dedicated Equalizer view');
  
  const eqViewContent = modalHtml.split('class="ui-pm-view ui-pm-view-equalizer"')[1].split('class="ui-pm-view ui-pm-view-timer"')[0];
  assert(eqViewContent.includes('data-pm-back="1"'), 'Equalizer view must have back button');
  assert(eqViewContent.includes('data-mp-eq-power="1"'), 'Equalizer view must have Master EQ toggle');
  assert(eqViewContent.includes('mp-vu-meter'), 'Equalizer view must have stereo VU meters');
  assert(eqViewContent.includes('CH-L') && eqViewContent.includes('CH-R'), 'VU meters must display CH-L and CH-R');
  assert(eqViewContent.includes('mp-eq-curve-svg'), 'Equalizer view must render dynamic frequency curve');
  assert(eqViewContent.includes('mp-eq-faders-grid'), 'Equalizer view must render 5 faders grid');
  assert(eqViewContent.includes('data-mp-rotary="bass"'), 'Dedicated Equalizer must render Bass Boost rotary dial');
  assert(eqViewContent.includes('data-mp-rotary="surround"'), 'Dedicated Equalizer must render 3D Surround Virtualizer rotary dial');
  assert(eqViewContent.includes('data-mp-rotary="clarity"'), 'Dedicated Equalizer must render Vocal Clarity rotary dial');
});

test('Dedicated Sleep Timer Page has custom timing builder with stepper, input, and quick increments', () => {
  const modalHtml = S.Render.playerModalMarkup();
  assert(modalHtml.includes('class="ui-pm-view ui-pm-view-timer"'), 'Modal must contain dedicated Sleep Timer view');
  
  const timerViewContent = modalHtml.split('class="ui-pm-view ui-pm-view-timer"')[1].split('class="ui-pm-view ui-pm-view-speed"')[0];
  assert(timerViewContent.includes('data-pm-back="1"'), 'Sleep timer view must have back button');
  assert(timerViewContent.includes('mp-clock-dial'), 'Sleep timer view must have circular clock dial');
  assert(timerViewContent.includes('mp-custom-builder'), 'Sleep timer view must have custom timing builder');
  assert(timerViewContent.includes('data-mp-custom-timer="1"'), 'Custom builder must have direct numeric input for any minute');
  assert(timerViewContent.includes('data-mp-timer-step="-5"'), 'Custom builder must have -5m stepper');
  assert(timerViewContent.includes('data-mp-timer-step="5"'), 'Custom builder must have +5m stepper');
  assert(timerViewContent.includes('data-mp-timer-add="15"'), 'Custom builder must have +15 min quick add');
  assert(timerViewContent.includes('data-mp-timer-add="30"'), 'Custom builder must have +30 min quick add');
  assert(timerViewContent.includes('data-mp-timer-add="60"'), 'Custom builder must have +1 hour quick add');
  assert(timerViewContent.includes('data-mp-opt="fade"'), 'Custom builder must have gradual volume fade-out toggle');
  assert(timerViewContent.includes('data-mp-timer-start="1"'), 'Custom builder must have Start Sleep Timer button');
});

test('sleepTimerClockMarkup supports custom user minutes (e.g. 42m, 75m)', () => {
  const html42 = S.Render.sleepTimerClockMarkup('42m');
  assert(html42.includes('42:00'), 'Clock dial must format custom 42m as 42:00 digital readout');
  assert(html42.includes('Pauses audio in 42 mins'), 'Sub-tag must indicate 42 mins');
  assert(html42.includes('value="42"'), 'Custom input must reflect 42');

  const html75 = S.Render.sleepTimerClockMarkup('75m');
  assert(html75.includes('75:00'), 'Clock dial must format custom 75m as 75:00 digital readout');
  assert(html75.includes('1h 15m'), 'Label must display 1h 15m');
  assert(html75.includes('value="75"'), 'Custom input must reflect 75');
});

console.log(`\n=========================================`);
console.log(`RESULTS: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('ALL DEDICATED PLAYER VIEWS & CUSTOM TIMER TESTS PASSED PERFECTLY!\n');
} else {
  process.exit(1);
}
