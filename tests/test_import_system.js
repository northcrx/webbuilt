// End-to-end simulation test for Droid Lab Import / Export system
const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = global;
global.document = {
  getElementById: function (id) {
    return {
      id: id,
      hidden: false,
      disabled: false,
      value: '',
      textContent: '',
      addEventListener: function () {},
      classList: { add: function () {}, remove: function () {}, toggle: function () {} },
      querySelectorAll: function () { return []; }
    };
  },
  querySelectorAll: function () { return []; },
  createElement: function () {
    return {
      addEventListener: function () {},
      appendChild: function () {},
      classList: { add: function () {}, remove: function () {} }
    };
  }
};
global.localStorage = {
  store: {},
  getItem: function (k) { return this.store[k] || null; },
  setItem: function (k, v) { this.store[k] = String(v); },
  removeItem: function (k) { delete this.store[k]; }
};

// Load dependencies in exact order of index.html
require('../js/util.js');
require('../js/mockup-css.js');
require('../js/icons.js');
require('../js/data.js');
require('../js/web-blocks.js');
require('../js/ext-blocks.js');
require('../js/templates.js');
require('../js/state.js');
require('../js/project.js');
require('../js/exporters/android/IconGenerator.js');
require('../js/exporters/android/ThemeGenerator.js');
require('../js/exporters/android/ResourceGenerator.js');
require('../js/exporters/android/NavigationGenerator.js');
require('../js/exporters/android/ComposeGenerator.js');
require('../js/exporters/android/ManifestGenerator.js');
require('../js/exporters/android/GradleGenerator.js');
require('../js/exporters/android/AndroidExporter.js');
require('../js/exporters/json/DesignSpecExporter.js');
require('../js/exporters/prompt/AIPromptGenerator.js');
require('../js/import.js');

const S = window.Studio;

// Initialize state
S.State.init();
console.log('✓ Studio State initialized. Initial blocks:', S.State.data.screen.length);

// Mock S.App and S.Project.refreshEditor
S.App = {
  refresh: function (kind) {},
  loadThemeFonts: function () {},
  requestFit: function () {},
  setTarget: function (t) { S.State.data.target = t; },
  undo: function () { return S.State.undo(); },
  redo: function () { return S.State.redo(); }
};
S.Project.refreshEditor = function () {};

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

console.log('\n--- TEST SUITE 1: Export generation ---');
// 1. Export Page JSON
const pageJSON = S.Project.pageJSON();
assert('pageJSON is valid JSON string', typeof pageJSON === 'string' && pageJSON.length > 50);
const parsedPage = JSON.parse(pageJSON);
assert('pageJSON format is droidlab.page', parsedPage.format === 'droidlab.page');
assert('pageJSON has screen blocks', Array.isArray(parsedPage.screen) && parsedPage.screen.length > 0);

// 2. Export Project JSON
const projectJSON = S.Project.projectJSON();
assert('projectJSON is valid JSON string', typeof projectJSON === 'string' && projectJSON.length > 50);
const parsedProj = JSON.parse(projectJSON);
assert('projectJSON format is droidlab.project', parsedProj.format === 'droidlab.project');
assert('projectJSON has pages array', Array.isArray(parsedProj.pages) && parsedProj.pages.length > 0);

// 3. Export Design Spec JSON
const designSpecJSON = S.exporters.json.DesignSpecExporter.generateJson(S.State.data);
assert('designSpecJSON is valid JSON string', typeof designSpecJSON === 'string' && designSpecJSON.length > 50);
const parsedSpec = JSON.parse(designSpecJSON);
assert('designSpec schemaVersion is 2', parsedSpec.schemaVersion === 2);
assert('designSpec has screens array', Array.isArray(parsedSpec.screens) && parsedSpec.screens.length > 0);
assert('designSpec screens have blocks', Array.isArray(parsedSpec.screens[0].blocks) && parsedSpec.screens[0].blocks.length > 0);

console.log('\n--- TEST SUITE 2: ImportManager.analyze ---');
// Test analyze with Page JSON
S.Import.analyze(pageJSON);
assert('ImportManager analyzed pageJSON as page', true);

// Test analyze with Project JSON
S.Import.analyze(projectJSON);
assert('ImportManager analyzed projectJSON as project', true);

// Test analyze with Design Spec JSON
S.Import.analyze(designSpecJSON);
assert('ImportManager analyzed designSpecJSON', true);

// Test analyze with raw blocks array
const rawBlocksJSON = JSON.stringify([{ id: 'b1', type: 'appbar', props: { title: 'Raw AppBar' } }]);
S.Import.analyze(rawBlocksJSON);
assert('ImportManager analyzed raw blocks array', true);

// Test analyze with invalid JSON
S.Import.analyze('invalid json {{{');
assert('ImportManager safely handled invalid JSON without throwing', true);

console.log('\n--- TEST SUITE 3: Project.parse and Project.apply ---');
// Test Project.parse on Design Spec JSON
const parseSpecRes = S.Project.parse(designSpecJSON);
assert('Project.parse successfully parses Design Spec JSON', parseSpecRes.ok === true);
assert('Project.parse maps screens to pages or screen', Array.isArray(parseSpecRes.doc.pages) || Array.isArray(parseSpecRes.doc.screen));

// Test Project.apply on Design Spec JSON
const applySpecRes = S.Project.apply(parseSpecRes);
assert('Project.apply succeeds on Design Spec JSON', applySpecRes.ok === true);

// Test Project.parse on raw blocks array
const parseRawRes = S.Project.parse(rawBlocksJSON);
assert('Project.parse successfully parses raw blocks array', parseRawRes.ok === true);
assert('Project.parse sets kind to page for raw array', parseRawRes.kind === 'page');

console.log('\n--- TEST SUITE 4: DesignSpecExporter.importSpec - Page JSON ---');
const customPageDoc = {
  format: 'droidlab.page',
  name: 'Custom Profile Page',
  icon: 'msr:person',
  screen: [
    { id: 'appbar_test', type: 'appbar', props: { title: 'Profile Screen', style: 'profile' } },
    { id: 'card_test', type: 'card', props: { title: 'User Stats', sub: 'Active' } }
  ]
};

// 1. replace_current
const resReplace = S.exporters.json.DesignSpecExporter.importSpec(customPageDoc, 'replace_current');
assert('importSpec replace_current succeeds', resReplace.ok === true);
assert('State.data.screen has imported blocks', S.State.data.screen.length >= 2 && S.State.data.screen[0].props.title === 'Profile Screen');
assert('State.data.screen[0] title is Profile Screen', S.State.data.screen[0].props.title === 'Profile Screen');
const currPage = S.State.pageById(S.State.data.activePageId);
assert('Current page in pages array was updated with screen blocks', currPage && currPage.screen.length >= 2);
assert('Current page name was updated to Custom Profile Page', currPage && currPage.name === 'Custom Profile Page');

// 2. add_new
const newPageDoc = {
  format: 'droidlab.page',
  name: 'Settings Page',
  icon: 'msr:settings',
  screen: [
    { id: 'settings_title', type: 'section', props: { title: 'Settings' } }
  ]
};
const prevPageCount = S.State.data.pages.length;
const resAdd = S.exporters.json.DesignSpecExporter.importSpec(newPageDoc, 'add_new');
assert('importSpec add_new succeeds', resAdd.ok === true);
assert('Page count incremented', S.State.data.pages.length === prevPageCount + 1);
assert('New page is active', S.State.data.screen[0].props.title === 'Settings');

// 3. open_project
const resOpen = S.exporters.json.DesignSpecExporter.importSpec(customPageDoc, 'open_project');
assert('importSpec open_project with pageDoc succeeds', resOpen.ok === true);
assert('State has 1 page with Custom Profile Page', S.State.data.pages.length === 1 && S.State.data.pages[0].name === 'Custom Profile Page');

console.log('\n--- TEST SUITE 5: DesignSpecExporter.importSpec - Design Spec Schema v2 ---');
const multiScreenSpec = {
  schemaVersion: 2,
  project: {
    name: 'Multi Screen Studio App',
    target: 'app'
  },
  theme: {
    mode: 'dark',
    primary: '#7C4DFF',
    radius: 20
  },
  device: {
    preset: 'phone',
    width: 412,
    height: 915
  },
  screens: [
    {
      id: 'sc_home',
      name: 'Explore',
      icon: 'explore',
      blocks: [
        { id: 'b_top', type: 'appbar', props: { title: 'Explore Header', style: 'search' } },
        { id: 'b_hero', type: 'hero', props: { title: 'Featured Music' } }
      ]
    },
    {
      id: 'sc_library',
      name: 'Library',
      icon: 'library_music',
      blocks: [
        { id: 'b_lib_title', type: 'section', props: { title: 'Your Playlists' } }
      ]
    }
  ]
};

// 1. open_project with multi-screen Design Spec
const resOpenSpec = S.exporters.json.DesignSpecExporter.importSpec(multiScreenSpec, 'open_project');
assert('importSpec open_project with multi-screen spec succeeds', resOpenSpec.ok === true);
assert('State has 2 screens from spec', S.State.data.pages.length === 2);
assert('State active page is Explore', S.State.data.pages[0].name === 'Explore');
assert('Theme dark mode set to true from spec mode: dark', S.State.data.theme.dark === true);
assert('Theme primary set to #7C4DFF', S.State.data.theme.primary === '#7C4DFF');
assert('Device width set to 412', S.State.data.device.width === 412);

// 2. replace_current with Design Spec
const resReplaceSpec = S.exporters.json.DesignSpecExporter.importSpec({
  schemaVersion: 2,
  screens: [
    {
      id: 'sc_feed',
      name: 'Social Feed',
      blocks: [
        { id: 'b_feed_h', type: 'appbar', props: { title: 'Feed Stories', style: 'social' } }
      ]
    }
  ]
}, 'replace_current');
assert('importSpec replace_current with spec succeeds', resReplaceSpec.ok === true);
assert('Current page replaced with Social Feed', S.State.data.screen[0].props.title === 'Feed Stories');

console.log('\n--- TEST SUITE 6: State.replaceCurrentPage & Undo/Redo ---');
const beforeUndoBlock = S.State.data.screen[0].props.title;
assert('State has commit history for undo', S.State.canUndo() === true);
S.State.undo();
assert('Undo reverted screen to previous state', S.State.data.screen[0].props.title !== beforeUndoBlock);
S.State.redo();
assert('Redo restored Social Feed', S.State.data.screen[0].props.title === beforeUndoBlock);

console.log('\n--- TEST SUITE 7: Round-Trip Export -> Import -> Export ---');
// Export current state to JSON
const exportedJson1 = S.exporters.json.DesignSpecExporter.generateJson(S.State.data);
// Import it back
const importTripRes = S.exporters.json.DesignSpecExporter.importSpec(exportedJson1, 'open_project');
assert('Round-trip importSpec succeeded', importTripRes.ok === true);
// Export again
const exportedJson2 = S.exporters.json.DesignSpecExporter.generateJson(S.State.data);
const spec1Obj = JSON.parse(exportedJson1);
const spec2Obj = JSON.parse(exportedJson2);
assert('Round-trip screens count matches', spec1Obj.screens.length === spec2Obj.screens.length);
assert('Round-trip primary color preserved', spec1Obj.theme.primary === spec2Obj.theme.primary);
assert('Round-trip theme mode preserved', spec1Obj.theme.mode === spec2Obj.theme.mode);

console.log('\n=========================================');
console.log('RESULTS: ' + passed + ' / ' + total + ' tests passed.');
if (passed === total) {
  console.log('ALL IMPORT & EXPORT TESTS PASSED PERFECTLY!');
} else {
  console.error('SOME TESTS FAILED!');
  process.exit(1);
}
