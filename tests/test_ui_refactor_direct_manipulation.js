const path = require('path');
﻿const fs = require("fs");
const assert = (desc, cond) => {
  if (cond) {
    console.log("  PASS: " + desc);
    passed++;
  } else {
    console.error("  FAIL: " + desc);
    failed++;
  }
  total++;
};
let passed = 0, failed = 0, total = 0;

console.log("\n--- TEST SUITE 1: Floating Canvas Selection HUD & Google Sites Gutter Rail ---");
const indexHtml = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
const shellCss = fs.readFileSync(path.resolve(__dirname, "../css/shell.css"), "utf8");
const appJs = fs.readFileSync(path.resolve(__dirname, "../js/app.js"), "utf8");

assert("index.html contains #canvas-hud", indexHtml.includes('id="canvas-hud"'));
assert("#canvas-hud has chud-actions with up, down, lock, hide, duplicate, del",
  indexHtml.includes('data-chud="up"') &&
  indexHtml.includes('data-chud="down"') &&
  indexHtml.includes('data-chud="lock"') &&
  indexHtml.includes('data-chud="hide"') &&
  indexHtml.includes('data-chud="duplicate"') &&
  indexHtml.includes('data-chud="del"'));
assert("index.html contains #canvas-gutter-rail (Google Sites external margin rail)",
  indexHtml.includes('id="canvas-gutter-rail"') && indexHtml.includes('data-cgr="duplicate"'));
assert("shell.css has rule permanently hiding .cmp-chrome inside phone-screen",
  shellCss.includes(".phone-screen .cmp > .cmp-chrome") &&
  shellCss.includes("display: none !important"));
assert("shell.css styles .canvas-gutter-rail in the left gutter outside the phone",
  shellCss.includes(".canvas-gutter-rail") && shellCss.includes("backdrop-filter: blur(16px)"));

console.log("\n--- TEST SUITE 2: Google Sites Floating Speed Dial (+) ---");
assert("index.html contains #speed-dial and #sd-fab",
  indexHtml.includes('id="speed-dial"') && indexHtml.includes('id="sd-fab"'));
assert("#sd-menu has quick screen generation options",
  indexHtml.includes('data-sd-template="blank"') &&
  indexHtml.includes('data-sd-template="settings"') &&
  indexHtml.includes('data-sd-template="player"') &&
  indexHtml.includes('data-sd-template="profile"'));
assert("shell.css styles .speed-dial with floating FAB and bloom animation",
  shellCss.includes(".speed-dial") && shellCss.includes(".sd-fab"));
assert("app.js has bindSpeedDial method",
  appJs.includes("bindSpeedDial:"));

console.log("\n--- TEST SUITE 3: 6 Studio Panel Tabs & S.ConnectPanel ---");
assert("index.html contains 6 studio panel tabs: inspect, connect, screens, theme, type, icons",
  indexHtml.includes('data-tab="inspect"') &&
  indexHtml.includes('data-tab="connect"') &&
  indexHtml.includes('data-tab="theme"') &&
  indexHtml.includes('data-tab="type"') &&
  indexHtml.includes('data-tab="icons"'));
assert("index.html contains #tab-connect tab body",
  indexHtml.includes('id="tab-connect"'));
const connectJs = fs.readFileSync(path.resolve(__dirname, "../js/connect-panel.js"), "utf8");
assert("connect-panel.js defines S.ConnectPanel with render and findLinkables",
  connectJs.includes("S.ConnectPanel") &&
  connectJs.includes("findLinkables:") &&
  connectJs.includes("flow-card"));
assert("app.js showTab handles all 6 tabs and renders ConnectPanel",
  appJs.includes("S.ConnectPanel.render()"));

console.log("\n--- TEST SUITE 4: Canvas Local Link Connector Pill ---");
assert("index.html contains #canvas-link-pill",
  indexHtml.includes('id="canvas-link-pill"') && indexHtml.includes('id="clp-target"'));
assert("app.js has updateCanvasLinkPill and bindLinkPill",
  appJs.includes("updateCanvasLinkPill:") && appJs.includes("bindLinkPill:"));

console.log("\n--- TEST SUITE 5: Direct In-Canvas Icon Switcher Popover ---");
assert("index.html contains #canvas-icon-popover", indexHtml.includes('id="canvas-icon-popover"'));
assert("app.js defines S.IconSwitcher with open, close, applyIcon",
  appJs.includes("S.IconSwitcher") &&
  appJs.includes("applyIcon:") &&
  appJs.includes("renderGrid:"));
assert("app.js stage click detects canvas icon clicks directly",
  appJs.includes("/* 1. Direct Canvas Icon Click Switcher"));

console.log("\n--- TEST SUITE 6: Universal Direct Text Inline Editing ---");
assert("app.js supports universal direct text editing for text tags",
  appJs.includes("/* 2. Universal Direct Text Editing (Even if element lacked explicit data-edit) */"));
assert("app.js shows floating inline edit hint pill",
  appJs.includes("inline-edit-pill") && appJs.includes("Press Enter to save"));

console.log("\n--- TEST SUITE 7: Block Palette Visual Categories ---");
assert("index.html contains #palette-categories buttons",
  indexHtml.includes('id="palette-categories"') &&
  indexHtml.includes('data-pcat="all"') &&
  indexHtml.includes('data-pcat="nav"') &&
  indexHtml.includes('data-pcat="media"'));
const renderJs = fs.readFileSync(path.resolve(__dirname, "../js/render.js"), "utf8");
assert("render.js palette filters by S.App.blockCategory",
  renderJs.includes("S.App.blockCategory") &&
  renderJs.includes("Visual Category Filtering"));

console.log("\n=========================================");
console.log("RESULTS: " + passed + " / " + total + " tests passed.");
if (passed === total) {
  console.log("ALL 6-TAB STUDIO, GOOGLE SITES GUTTER & SPEED DIAL TESTS PASSED PERFECTLY!");
} else {
  console.error("TESTS FAILED!");
  process.exit(1);
}
