const assert = require('assert');
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
    setAttribute: function (k, v) { this[k] = v; },
    getAttribute: function (k) { return this[k] || ''; },
    removeAttribute: function (k) { delete this[k]; },
    style: {
      setProperty: function (k, v) { this[k] = v; },
      getPropertyValue: function (k) { return this[k] || ''; }
    },
    addEventListener: function () {},
    removeEventListener: function () {},
    classList: {
      add: function () {},
      remove: function () {},
      toggle: function () {},
      contains: function () { return false; }
    },
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
    setAttribute: function (k, v) { this[k] = v; },
    getAttribute: function (k) { return this[k] || ''; },
    style: {
      setProperty: function (k, v) { this[k] = v; },
      getPropertyValue: function (k) { return this[k] || ''; }
    }
  },
  head: {
    appendChild: function () {}
  },
  body: {
    style: {},
    classList: { add: function () {}, remove: function () {}, toggle: function () {} },
    setAttribute: function (k, v) { this[k] = v; },
    getAttribute: function (k) { return this[k] || ''; },
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
require('../js/font-picker.js');
require('../js/theme-panel.js');
require('../js/fonts-panel.js');
require('../js/icons-panel.js');
require('../js/connect-panel.js');
require('../js/block-garden.js');
require('../js/interactions.js');
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

console.log('\n--- TEST SUITE 1: Website Dropdown Menu Design & Theme Matching ---');

test('webnav block defaults include dropdownStyle and dropdownTheme', () => {
  const nav = S.makeBlock('webnav');
  assert(nav, 'webnav should exist');
  assert.strictEqual(nav.props.dropdownStyle, 'clean');
  assert.strictEqual(nav.props.dropdownTheme, 'auto');
});

test('webnav parses rich dropdown items with icons, badges, and subtitles', () => {
  const nav = S.makeBlock('webnav', {
    links: 'Shop, Journal',
    dropdowns: 'Shop: All Products:NEW|shopping_bag:Browse our catalog | Footwear|steps:Handcrafted shoes\nJournal: Stories|auto_stories:Behind the scenes',
    dropdownStyle: 'clean'
  });
  const html = S.components.webnav.html(nav.props, nav);

  assert(html.includes('wnav-dropdown'), 'HTML must include .wnav-dropdown');
  assert(html.includes('wnav-dd-clean'), 'HTML must include dropdownStyle class');
  assert(html.includes('All Products'), 'HTML must include item title');
  assert(html.includes('wnav-dd-badge'), 'HTML must include badge');
  assert(html.includes('NEW'), 'Badge content should be NEW');
  assert(html.includes('wnav-dd-icon-box'), 'HTML must render icon box');
  assert(html.includes('Browse our catalog'), 'HTML must render subtitle');
});

test('webnav renders multiple dropdown designs: bento, glass, minimal, mega', () => {
  const styles = ['bento', 'glass', 'minimal', 'mega'];
  styles.forEach(st => {
    const nav = S.makeBlock('webnav', {
      links: 'Shop',
      dropdowns: 'Shop: Item 1|star:First item | Item 2|diamond:Second item',
      dropdownStyle: st
    });
    const html = S.components.webnav.html(nav.props, nav);
    assert(html.includes(`wnav-dd-${st}`), `HTML should render dropdown style: ${st}`);
    assert(html.includes(`data-style="${st}"`), `data-style attribute should match: ${st}`);
  });
});

test('mockup-css defines theme-adaptive dropdown tokens without hardcoded dark-only colors', () => {
  const css = window.Studio.mockupCSS || window.Studio.mockupCss || '';
  assert(css.includes('.wnav-dropdown'), 'css should define .wnav-dropdown');
  assert(css.includes('var(--w-card'), 'dropdown should use var(--w-card)');
  assert(css.includes('.mock-frame.dark .wnav-dropdown') || css.includes('.browser.dark .wnav-dropdown'), 'dropdown should have explicit dark website override');
  assert(css.includes('.wnav-dropdown.wnav-dd-bento'), 'css should style bento layout');
  assert(css.includes('.wnav-dropdown.wnav-dd-glass'), 'css should style glassmorphism layout');
});

console.log('\n--- TEST SUITE 2: Builder / Editor Design & Font Studio ---');

test('setEditorFont updates CSS variable and body font family', () => {
  S.App.setEditorFont('Space Grotesk', true);
  assert.strictEqual(S.App.editorFont, 'Space Grotesk');
  assert(global.document.documentElement.style['--editor-font'].includes('Space Grotesk'), 'should set --editor-font CSS variable');
  assert.strictEqual(global.localStorage.getItem('droidlab.editorFont'), 'Space Grotesk');
});

test('setBuilderTheme supports 6 designer skins (material, nordic, midnight, cyberpunk, editorial, dark, light)', () => {
  const themes = ['material', 'nordic', 'midnight', 'cyberpunk', 'editorial', 'dark', 'light'];
  themes.forEach(th => {
    S.App.setBuilderTheme(th, true);
    assert.strictEqual(S.App.uiTheme, th);
    assert.strictEqual(global.document.documentElement['data-ui'], th);
    assert.strictEqual(global.localStorage.getItem('droidlab.ui'), th);
  });
});

test('setCanvasPattern updates canvas background pattern', () => {
  const patterns = ['dots', 'grid', 'garden', 'clean'];
  patterns.forEach(pt => {
    S.App.setCanvasPattern(pt, true);
    assert.strictEqual(S.App.canvasPattern, pt);
    assert.strictEqual(global.document.body['data-canvas-pattern'], pt);
    assert.strictEqual(global.localStorage.getItem('droidlab.canvasPattern'), pt);
  });
});

console.log('\n--- TEST SUITE 3: Widget Garden & Custom Block Studio ---');

test('S.BlockGarden object exists with full lifecycle methods', () => {
  assert(S.BlockGarden, 'S.BlockGarden must exist');
  assert.strictEqual(typeof S.BlockGarden.open, 'function');
  assert.strictEqual(typeof S.BlockGarden.close, 'function');
  assert.strictEqual(typeof S.BlockGarden.registerCustomComponent, 'function');
  assert.strictEqual(typeof S.BlockGarden.renderWidgetHtml, 'function');
});

test('S.BlockGarden renders Android M3 Action Card archetype with dropdown', () => {
  const html = S.BlockGarden.renderWidgetHtml({
    archetype: 'android_card',
    title: 'Android M3 Garden Card',
    subtitle: 'Interactive card with options',
    icon: 'smartphone',
    accentColor: '#5b5bd6',
    hasDropdown: true,
    dropdownItems: 'Share | Export | Delete'
  });
  assert(html.includes('cg-android-card') || html.includes('cg-action-card'), 'should render action card class');
  assert(html.includes('Android M3 Garden Card'), 'should render title');
  assert(html.includes('cg-dropdown-wrap'), 'should render custom dropdown inside widget');
  assert(html.includes('Share'), 'should include dropdown options');
});

test('S.BlockGarden renders Android Quick Settings Tiles archetype', () => {
  const html = S.BlockGarden.renderWidgetHtml({
    archetype: 'android_tiles',
    title: 'Control Center Tiles',
    icon: 'grid_view',
    accentColor: '#0f9d77'
  });
  assert(html.includes('cg-android-tiles'), 'should render tiles container');
  assert(html.includes('cg-tile'), 'should render individual tiles');
  assert(html.includes('WiFi') || html.includes('Internet'), 'should render wireless toggle');
});

test('S.BlockGarden renders Interactive Sketch Canvas Garden widget', () => {
  const fakeDrawingData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const html = S.BlockGarden.renderWidgetHtml({
    archetype: 'garden_drawing_pad',
    title: 'Botanical Sketch Pad',
    icon: 'draw',
    drawingData: fakeDrawingData
  });
  assert(html.includes('cg-drawing-widget'), 'should render drawing widget container');
  assert(html.includes('cg-drawing-render'), 'should render drawing container');
  assert(html.includes(fakeDrawingData), 'should embed image data');
});

test('S.BlockGarden dynamically registers custom block in S.components and palette', () => {
  const customId = 'custom_garden_test_123';
  S.BlockGarden.registerCustomComponent({
    id: customId,
    title: 'Custom Hero Garden',
    subtitle: 'Created in Widget Garden',
    icon: 'yard',
    target: 'all',
    cardStyle: 'elevated',
    accentColor: '#5b5bd6',
    hasDropdown: true,
    dropdownItems: 'Action A | Action B'
  });

  assert(S.components[customId], 'custom component should be registered in S.components');
  assert.strictEqual(S.components[customId].label, 'Custom Hero Garden');
  assert.strictEqual(S.components[customId].group, 'Garden Widgets');

  // Verify block can be created via S.makeBlock
  const block = S.makeBlock(customId);
  assert(block, 'S.makeBlock should successfully instantiate custom block');
  assert.strictEqual(block.type, customId);

  // Verify render markup
  const markup = S.Render.blockMarkup(block);
  assert(markup.includes('Custom Hero Garden'), 'blockMarkup should render custom widget HTML');
});

console.log('\n=========================================');
console.log(`RESULTS: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('ALL WEBSITE DROPDOWN & BUILDER GARDEN TESTS PASSED PERFECTLY!\n');
} else {
  process.exit(1);
}
