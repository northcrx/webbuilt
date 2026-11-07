// Automated test suite for:
// 1. Right-click inline rename & S.State.renamePage
// 2. Strict Target Isolation (Android App vs Website vs Extension)
// 3. Website Music Player leak prevention (dock blocks forbidden on web)
// 4. Music Player 8 variations & modular features (Sleep Timer, EQ, Audio Quality, Speed/Volume, etc.)

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

// Load studio modules
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

console.log('\n--- TEST SUITE 1: Page Renaming & Inline Editing ---');
const page1 = S.State.data.pages[0];
const oldName = page1.name;
S.State.renamePage(page1.id, 'Dashboard Screen');
assert('S.State.renamePage updates page name', S.State.data.pages[0].name === 'Dashboard Screen');
assert('S.State.renamePage trimmed input', (S.State.renamePage(page1.id, '  Profile Feed  '), S.State.data.pages[0].name === 'Profile Feed'));
assert('S.App.startRenamePage function exists', typeof S.App.startRenamePage === 'function');
assert('S.prompt modal function exists', typeof S.prompt === 'function');

console.log('\n--- TEST SUITE 2: Target Isolation (App vs Website) ---');
// Currently in App target
S.State.data.target = 'app';
assert('Active target is app', S.State.data.target === 'app');
const appPageCount = S.State.data.pages.length;
const appActivePageId = S.State.data.activePageId;

// Switch to website target
S.App.setTarget('web');
assert('Target switched to web', S.State.data.target === 'web');
assert('Stash saved app workspace', !!S.State.data.stash.app);
assert('Stash contains app pages', Array.isArray(S.State.data.stash.app.pages) && S.State.data.stash.app.pages.length === appPageCount);
assert('Web target has isolated pages with Home page', S.State.data.pages.length >= 1 && S.State.data.pages[0].name === 'Home');
assert('Web target screen has zero bottomnav blocks', !S.State.data.screen.some(b => b.type === 'bottomnav'));
assert('Web target screen has zero miniplayer blocks', !S.State.data.screen.some(b => b.type === 'miniplayer'));

// Switch back to app target
S.App.setTarget('app');
assert('Target switched back to app', S.State.data.target === 'app');
assert('App pages restored from stash', S.State.data.pages.length === appPageCount);
assert('App activePageId restored', S.State.data.activePageId === appActivePageId);

console.log('\n--- TEST SUITE 3: Website Dock Leak Prevention ---');
// Verify isDockBlock in S.Render
const fakeBottomNav = { id: 'test_bn', type: 'bottomnav', props: {} };
const fakeMiniPlayer = { id: 'test_mp', type: 'miniplayer', props: {} };

S.State.data.target = 'web';
assert('In web target, isDockBlock(bottomnav) returns false (no dock rendering)', S.Render.isDockBlock(fakeBottomNav) === false);
assert('In web target, isDockBlock(miniplayer) returns false (no music player in web dock)', S.Render.isDockBlock(fakeMiniPlayer) === false);
assert('In web target, dockMarkup returns empty string', S.Render.dockMarkup() === '');

S.State.data.target = 'app';
assert('In app target, isDockBlock(bottomnav) returns true', S.Render.isDockBlock(fakeBottomNav) === true);
assert('In app target, isDockBlock(miniplayer) returns true', S.Render.isDockBlock(fakeMiniPlayer) === true);

console.log('\n--- TEST SUITE 4: Music Player 8 Variations ---');
const playerBlock = S.makeBlock('musicplayer');
assert('musicplayer block created successfully', !!playerBlock);
assert('musicplayer block defaults to style vinyl', playerBlock.props.style === 'vinyl');
assert('musicplayer has modular flags defined in defaults', 
  playerBlock.props.showSleepTimer !== undefined &&
  playerBlock.props.showEqualizer !== undefined &&
  playerBlock.props.showQualityBadge !== undefined &&
  playerBlock.props.showSpeedVolume !== undefined
);

const styles = ['vinyl', 'classic', 'cassette', 'glass', 'equalizer', 'lyrics', 'gradient', 'minimal'];
styles.forEach(st => {
  playerBlock.props.style = st;
  const markup = S.Render.blockMarkup(playerBlock);
  assert(`Music player renders markup for style: ${st}`, typeof markup === 'string' && markup.length > 50);
  assert(`Markup contains mp-${st} class`, markup.includes(`mp-${st}`));
});

// Check Cassette Tape elements
playerBlock.props.style = 'cassette';
const cassetteMarkup = S.Render.blockMarkup(playerBlock);
assert('Cassette style renders mp-cassette-shell', cassetteMarkup.includes('mp-cassette-shell'));
assert('Cassette style renders dual tape hubs/spools', cassetteMarkup.includes('mp-cass-spool left') && cassetteMarkup.includes('mp-cass-spool right'));
assert('Cassette style renders tape window & magnetic ribbon', cassetteMarkup.includes('mp-cass-window') && cassetteMarkup.includes('mp-cass-label'));
assert('Cassette style renders tape counter', cassetteMarkup.includes('mp-cass-counter'));

// Check Frosted Glass Visualizer elements
playerBlock.props.style = 'glass';
const glassMarkup = S.Render.blockMarkup(playerBlock);
assert('Glass style renders mp-glass-card', glassMarkup.includes('mp-glass-card'));
assert('Glass style renders neon visualizer halo/aura', glassMarkup.includes('mp-glass-aura') && glassMarkup.includes('mp-glass-ring'));

// Check Studio Equalizer elements
playerBlock.props.style = 'equalizer';
const eqMarkup = S.Render.blockMarkup(playerBlock);
assert('Equalizer style renders mp-rack-eq', eqMarkup.includes('mp-rack-eq'));
assert('Equalizer style renders VU meters', eqMarkup.includes('mp-vu-meter'));
assert('Equalizer style renders 5-band frequency faders', eqMarkup.includes('mp-eq-bands') && eqMarkup.includes('mp-eq-band'));

console.log('\n--- TEST SUITE 5: Music Player Modular Features ---');
// Reset to classic or vinyl so modular bars are rendered
playerBlock.props.style = 'vinyl';

// Sleep Timer
playerBlock.props.showSleepTimer = true;
playerBlock.props.sleepTimer = '30m';
const timerMarkup = S.Render.blockMarkup(playerBlock);
assert('Sleep Timer section renders when showSleepTimer=true', timerMarkup.includes('mp-mod-sleep-bar'));
assert('Sleep Timer renders preset pills (15m, 30m, 45m)', timerMarkup.includes('data-mp-timer="15m"') && timerMarkup.includes('data-mp-timer="30m"'));

// Equalizer
playerBlock.props.showEqualizer = true;
playerBlock.props.eqPreset = 'Bass Boost';
const equalizerMarkup = S.Render.blockMarkup(playerBlock);
assert('Modular Equalizer section renders when showEqualizer=true', equalizerMarkup.includes('mp-mod-eq-bar'));
assert('EQ preset chips render (Bass Boost, Vocal, Electronic, etc.)', equalizerMarkup.includes('data-mp-eq="Bass Boost"') && equalizerMarkup.includes('data-mp-eq="Electronic"'));

// Hi-Res Audio Quality Badge
playerBlock.props.showQualityBadge = true;
playerBlock.props.audioQuality = 'Hi-Res Audio · 24-bit / 96kHz Lossless';
const qualityMarkup = S.Render.blockMarkup(playerBlock);
assert('Audio Quality badge renders when showQualityBadge=true', qualityMarkup.includes('mp-mod-badge') && qualityMarkup.includes('24-bit / 96kHz Lossless'));

// Speed & Volume Slider
playerBlock.props.showSpeedVolume = true;
playerBlock.props.playbackSpeed = '1.25x';
const speedMarkup = S.Render.blockMarkup(playerBlock);
assert('Speed & Volume section renders when showSpeedVolume=true', speedMarkup.includes('mp-mod-speed-vol'));
assert('Speed selector renders data-mp-speed', speedMarkup.includes('data-mp-speed="cycle"'));

console.log('\n=========================================');
console.log(`RESULTS: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('ALL USER REQUIREMENTS & VERIFICATION TESTS PASSED PERFECTLY!\n');
} else {
  process.exit(1);
}
