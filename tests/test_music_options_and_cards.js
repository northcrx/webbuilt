// Automated test suite for new music options, download cards, play cards, music listings, shuffle radio, and recommendations
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
    closest: function () { return null; },
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

console.log('\n--- TEST SUITE 1: Download Options Card Block ---');
const dlc = S.makeBlock('downloadcard');
assert('downloadcard block created successfully', !!dlc);
assert('downloadcard defaults to lossless quality', dlc.props.quality === 'lossless');
assert('downloadcard defaults to internal storage', dlc.props.storage === 'internal');

const dlcHtml = S.Render.blockMarkup(dlc);
assert('downloadcard renders .download-card markup', dlcHtml.includes('download-card'));
assert('downloadcard renders storage meter bar', dlcHtml.includes('dlc-storage-bar') && dlcHtml.includes('dlc-sm-fill'));
assert('downloadcard renders FLAC Lossless quality card', dlcHtml.includes('Hi-Res Lossless FLAC') && dlcHtml.includes('48.2 MB'));
assert('downloadcard renders High Quality MP3 card', dlcHtml.includes('High Quality MP3') && dlcHtml.includes('11.4 MB'));
assert('downloadcard renders Standard AAC card', dlcHtml.includes('Standard AAC') && dlcHtml.includes('7.8 MB'));
assert('downloadcard renders Data Saver Opus card', dlcHtml.includes('Data Saver Opus') && dlcHtml.includes('3.1 MB'));
assert('downloadcard renders storage chips (Internal Storage, SD Card)', dlcHtml.includes('Internal Storage') && dlcHtml.includes('SD Card'));
assert('downloadcard renders extras checkboxes (Lyrics, Artwork, Dolby)', dlcHtml.includes('Synced Lyrics') && dlcHtml.includes('Album Art'));
assert('downloadcard renders main download action button', dlcHtml.includes('dlc-main-btn'));

console.log('\n--- TEST SUITE 2: Play Music Card (Album Spotlight) ---');
const plc = S.makeBlock('playcard');
assert('playcard block created successfully', !!plc);
assert('playcard defaults to spotlight layout', plc.props.layout === 'spotlight');

const plcHtml = S.Render.blockMarkup(plc);
assert('playcard renders .play-card markup', plcHtml.includes('play-card') && plcHtml.includes('plc-spotlight'));
assert('playcard renders title and artist', plcHtml.includes(plc.props.title) && plcHtml.includes(plc.props.artist));
assert('playcard renders floating Play FAB', plcHtml.includes('plc-play-fab') && plcHtml.includes('data-playcard-action="play"'));
assert('playcard renders Shuffle, Library and Download buttons', 
  plcHtml.includes('data-playcard-action="shuffle"') && 
  plcHtml.includes('data-playcard-action="like"') &&
  plcHtml.includes('data-playcard-action="download"'
));

plc.props.layout = 'vinyl';
const plcVinylHtml = S.Render.blockMarkup(plc);
assert('playcard vinyl layout renders spinning vinyl disc', plcVinylHtml.includes('plc-vinyl-disc'));

console.log('\n--- TEST SUITE 3: Music Listing (Interactive Tracklist) ---');
const ml = S.makeBlock('musiclisting');
assert('musiclisting block created successfully', !!ml);
assert('musiclisting defaults to numbered layout', ml.props.layout === 'numbered');

const mlHtml = S.Render.blockMarkup(ml);
assert('musiclisting renders .music-listing markup', mlHtml.includes('music-listing'));
assert('musiclisting renders header with Shuffle All button', mlHtml.includes('ml-shuffle-all-btn') && mlHtml.includes('data-listing-action="shuffle-all"'));
assert('musiclisting renders active track with animated EQ wave', mlHtml.includes('ml-eq-wave'));
assert('musiclisting renders tracks with index numbers and audio badges', mlHtml.includes('ml-idx') && mlHtml.includes('ml-badge'));
assert('musiclisting renders like and offline download icons on each row', mlHtml.includes('data-listing-like') && mlHtml.includes('data-listing-dl'));
assert('musiclisting renders in-listing category tabs (Songs, Albums, Artists, Beats)', 
  mlHtml.includes('ml-view-tabs') &&
  mlHtml.includes('data-ml-view="songs"') &&
  mlHtml.includes('data-ml-view="albums"') &&
  mlHtml.includes('data-ml-view="artists"') &&
  mlHtml.includes('data-ml-view="beats"')
);

// Albums view mode
ml.props.viewMode = 'albums';
const mlAlbumsHtml = S.Render.blockMarkup(ml);
assert('musiclisting renders .ml-albums-grid in albums mode', mlAlbumsHtml.includes('ml-albums-grid'));
assert('musiclisting renders .ml-album-card with vinyl sleeve disc', mlAlbumsHtml.includes('ml-album-card') && mlAlbumsHtml.includes('ml-album-vinyl'));
assert('musiclisting renders album play FAB and genre badges', mlAlbumsHtml.includes('ml-album-play-fab') && mlAlbumsHtml.includes('ml-genre-badge'));
assert('musiclisting renders album save and offline download buttons', mlAlbumsHtml.includes('data-listing-like-album') && mlAlbumsHtml.includes('data-listing-dl-album'));

// Artists view mode
ml.props.viewMode = 'artists';
const mlArtistsHtml = S.Render.blockMarkup(ml);
assert('musiclisting renders .ml-artists-list in artists mode', mlArtistsHtml.includes('ml-artists-list'));
assert('musiclisting renders circular artist avatars and verified badges', mlArtistsHtml.includes('ml-artist-avatar') && mlArtistsHtml.includes('ml-artist-badge') && mlArtistsHtml.includes('ml-verified-chip'));
assert('musiclisting renders Follow/Following interactive buttons', mlArtistsHtml.includes('ml-follow-btn') && mlArtistsHtml.includes('data-listing-follow'));

// Beats / Audio view mode
ml.props.viewMode = 'beats';
const mlBeatsHtml = S.Render.blockMarkup(ml);
assert('musiclisting renders .ml-beats-list in beats mode', mlBeatsHtml.includes('ml-beats-list'));
assert('musiclisting renders .ml-beat-card with waveform visualizer', mlBeatsHtml.includes('ml-beat-card') && mlBeatsHtml.includes('ml-beat-waveform') && mlBeatsHtml.includes('ml-beat-wave-bar'));
assert('musiclisting renders BPM chips, Musical Key chips and Licensing buttons', mlBeatsHtml.includes('ml-chip-bpm') && mlBeatsHtml.includes('ml-chip-key') && mlBeatsHtml.includes('ml-beat-buy-btn'));

console.log('\n--- TEST SUITE 3B: Interactive Tabs Preview & Category Inspector ---');
const tabsBlock = S.makeBlock('tabs');
tabsBlock.props.labels = 'Songs, Albums, Artists, Beats';
const tabsPrevHtml = S.Inspector.tabsPreviewSection(tabsBlock);
assert('tabsPreviewSection renders clickable tab preview chips for all tabs', 
  tabsPrevHtml.includes('tab-preview-chip') && 
  tabsPrevHtml.includes('data-tab-preview-idx="0"') && 
  tabsPrevHtml.includes('data-tab-preview-idx="3"')
);
assert('tabsPreviewSection renders Quick Presets for music and library', 
  tabsPrevHtml.includes('data-tabs-preset') && 
  tabsPrevHtml.includes('Songs, Albums, Artists, Beats')
);

const mlInspectorHtml = S.Inspector.musicListingOptionsSection(ml);
assert('musicListingOptionsSection renders 4 category pills (Songs, Albums, Artists, Beats)', 
  mlInspectorHtml.includes('data-ml-set-view="songs"') &&
  mlInspectorHtml.includes('data-ml-set-view="albums"') &&
  mlInspectorHtml.includes('data-ml-set-view="artists"') &&
  mlInspectorHtml.includes('data-ml-set-view="beats"')
);

console.log('\n--- TEST SUITE 4: Shuffle & Radio Card ---');
const sfr = S.makeBlock('shuffleradio');
assert('shuffleradio block created successfully', !!sfr);
assert('shuffleradio defaults to smart shuffle mode', sfr.props.activeMode === 'smart');

const sfrHtml = S.Render.blockMarkup(sfr);
assert('shuffleradio renders .shuffle-radio-card markup', sfrHtml.includes('shuffle-radio-card'));
assert('shuffleradio renders shuffle pulsating FAB', sfrHtml.includes('sfr-fab-shuffle') && sfrHtml.includes('data-shuffle-act="shuffle"'));
assert('shuffleradio renders all 4 shuffle modes (Smart AI, Mood Flow, Artist Radio, True Random)', 
  sfrHtml.includes('data-sfr-mode="smart"') &&
  sfrHtml.includes('data-sfr-mode="mood"') &&
  sfrHtml.includes('data-sfr-mode="artist"') &&
  sfrHtml.includes('data-sfr-mode="random"'
));
assert('shuffleradio renders Now Playing in Shuffle display', sfrHtml.includes('sfr-now-track'));
assert('shuffleradio renders Up Next Queue preview list', sfrHtml.includes('sfr-queue-list') && sfrHtml.includes('sfr-qitem'));

console.log('\n--- TEST SUITE 5: Music Recommendations (For You Rail) ---');
const rec = S.makeBlock('recommendations');
assert('recommendations block created successfully', !!rec);

const recHtml = S.Render.blockMarkup(rec);
assert('recommendations renders .music-recommendations markup', recHtml.includes('music-recommendations'));
assert('recommendations renders affinity match percentage badges (e.g. 98% Match)', recHtml.includes('rec-match-pill') && recHtml.includes('98% Match'));
assert('recommendations renders recommendation reason text', recHtml.includes('rec-reason') && recHtml.includes('Because you listened to'));
assert('recommendations renders horizontal scrolling rail', recHtml.includes('rec-rail'));
assert('recommendations cards render preview play button and add button', recHtml.includes('rec-play-btn') && recHtml.includes('rec-add-btn'));

console.log('\n--- TEST SUITE 6: Modular Download Options in Music Player ---');
const mp = S.makeBlock('musicplayer');
mp.props.showDownloadOptions = true;
mp.props.downloadQuality = 'lossless';
mp.props.downloadStatus = 'downloaded';

const mpHtml = S.Render.blockMarkup(mp);
assert('musicplayer renders modular download bar when showDownloadOptions=true', mpHtml.includes('mp-mod-dl-bar'));
assert('musicplayer renders download status badge (Saved Offline)', mpHtml.includes('mp-dl-status-badge') && mpHtml.includes('Saved Offline'));
assert('musicplayer renders 4 quality option cards inside player', 
  mpHtml.includes('data-mp-dl-quality="lossless"') &&
  mpHtml.includes('data-mp-dl-quality="high"') &&
  mpHtml.includes('data-mp-dl-quality="standard"') &&
  mpHtml.includes('data-mp-dl-quality="saver"'
));
assert('musicplayer renders storage location selectors and download action button', 
  mpHtml.includes('data-mp-dl-storage="internal"') &&
  mpHtml.includes('data-mp-dl-storage="sdcard"') &&
  mpHtml.includes('data-mp-dl-action="toggle"'
));

console.log('\n=========================================');
console.log(`RESULTS: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('ALL MUSIC OPTIONS & CARDS TESTS PASSED PERFECTLY!\n');
} else {
  process.exit(1);
}
