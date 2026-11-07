/* The phone + Android-style component styles.
   Injected into the editor and reused verbatim by the exporter. */
(function () {
  var S = window.Studio = window.Studio || {};

  S.mockupCSS = String.raw`
/* ============ base ============ */
.phone, .phone *, .phone *::before, .phone *::after { box-sizing: border-box; }
.phone {
  --md-primary: #6750a4;
  --md-on-primary: #ffffff;
  --md-primary-container: #eaddff;
  --md-on-primary-container: #21005d;
  --md-secondary-container: #e8def8;
  --md-on-secondary-container: #1d192b;
  --md-tertiary: #7d5260;
  --md-surface: #fef7ff;
  --md-surface-container-lowest: #ffffff;
  --md-surface-container-low: #f7f2fa;
  --md-surface-container: #f3edf7;
  --md-surface-container-high: #ece6f0;
  --md-on-surface: #1d1b20;
  --md-on-surface-variant: #49454f;
  --md-outline: #79747e;
  --md-outline-variant: #cac4d0;

  --font-ui: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --fs-base: 15px;
  --fw-base: 400;
  --ls-base: 0px;
  --md-radius: 16px;
  --pad-x: 16px;
  --icon-weight: 400;
  --icon-fill: 0;
  --icon-stroke: 1.8;

  width: 390px;
  height: 844px;
  padding: 10px;
  border-radius: 46px;
  background: #101014;
  box-shadow:
    0 30px 70px rgba(0, 0, 0, .55),
    inset 0 0 0 2px #29292f,
    inset 0 0 0 5px #0a0a0d;
  position: relative;
  flex: 0 0 auto;
}

.phone.dark, .browser.dark, .ext-window.dark {
  --md-primary: #d0bcff;
  --md-on-primary: #381e72;
  --md-primary-container: #4f378b;
  --md-on-primary-container: #eaddff;
  --md-secondary-container: #4a4458;
  --md-on-secondary-container: #e8def8;
  --md-tertiary: #efb8c8;
  --md-surface: #141218;
  --md-surface-container-lowest: #0f0d13;
  --md-surface-container-low: #1d1b20;
  --md-surface-container: #211f26;
  --md-surface-container-high: #2b2930;
  --md-on-surface: #e6e0e9;
  --md-on-surface-variant: #cac4d0;
  --md-outline: #938f99;
  --md-outline-variant: #49454f;
}

.camera-hole {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #050507;
  box-shadow: inset 0 0 0 1px #23232b;
  z-index: 8;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 37px;
  overflow: hidden;
  background: var(--md-surface);
  color: var(--md-on-surface);
  font-family: var(--font-ui);
  font-size: var(--fs-base);
  font-weight: var(--fw-base);
  letter-spacing: var(--ls-base);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: background .2s, color .2s;
}
.phone-screen button { border: 0; background: none; font: inherit; letter-spacing: inherit; color: inherit; }

.status-bar {
  height: 34px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 20px 0 24px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .2px;
  color: var(--md-on-surface);
  position: relative;
  z-index: 5;
}
.status-bar .sb-time { font-variant-numeric: tabular-nums; }
.sb-icons { display: inline-flex; align-items: center; gap: 4px; opacity: .85; }
.sb-icons svg { display: block; }

.app-screen {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  padding-bottom: 6px;
}
.app-screen::-webkit-scrollbar { width: 0; height: 0; }

.gesture-bar {
  height: 22px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gesture-bar span {
  width: 118px;
  height: 4px;
  border-radius: 99px;
  background: var(--md-on-surface);
  opacity: .32;
}

.mi {
  font-family: "Material Symbols Rounded";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  /* Material glyphs are one em wide. Reserving that width keeps the long
     ligature name from widening rows when the webfont is still loading or
     unavailable offline. */
  width: 1em;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
  font-variation-settings: "FILL" var(--icon-fill), "wght" var(--icon-weight), "GRAD" 0, "opsz" 24;
  flex: 0 0 auto;
}
.icn {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
  flex: 0 0 auto;
  stroke-width: var(--icon-stroke);
}
.mso { font-family: "Material Symbols Outlined"; }
.mss { font-family: "Material Symbols Sharp"; }
.ph-ico {
  font-size: 24px;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
  flex: 0 0 auto;
  font-style: normal;
  font-weight: normal;
}

/* ============ app bar ============ */
.app-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 8px 8px 12px;
  min-height: 56px;
  background: var(--md-surface);
  color: var(--md-on-surface);
}
.app-bar.elevated { background: var(--md-surface-container); }
.app-bar .ab-title {
  flex: 1;
  margin: 0 0 0 6px;
  font-family: var(--font-display);
  font-size: 1.45em;
  font-weight: 600;
  letter-spacing: -.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-bar.center .ab-title { text-align: center; margin-right: 6px; }
.app-bar.center { padding-left: 4px; padding-right: 4px; }
.app-bar.large { flex-direction: column; align-items: stretch; padding: 8px 12px 18px; }
.app-bar.large .ab-row { display: flex; align-items: center; gap: 4px; }
.app-bar.large .ab-title { margin: 8px 0 0 6px; font-size: 2em; }
.app-bar .avatar { margin-left: 2px; }

.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--md-on-surface);
  flex: 0 0 auto;
  padding: 0;
  transition: background .15s;
}
.icon-btn .mi { font-size: 23px; }
.icon-btn .icn { width: 22px; height: 22px; }
.icon-btn:hover { background: color-mix(in srgb, var(--md-on-surface) 8%, transparent); }

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font-family: var(--font-ui);
  font-size: .78em;
  font-weight: 700;
  flex: 0 0 auto;
}

/* ============ search ============ */
.search-bar {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 4px var(--pad-x) 10px;
  padding: 0 8px 0 14px;
  height: 52px;
  border-radius: 26px;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}
.search-bar .mi { font-size: 22px; color: var(--md-on-surface-variant); }
.search-bar .icn { color: var(--md-on-surface-variant); }
.search-bar .sb-text {
  flex: 1;
  font-size: .95em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-bar .avatar { background: var(--md-primary); color: var(--md-on-primary); }

/* ============ tabs ============ */
.tabs-row {
  display: flex;
  padding: 0 8px;
  border-bottom: 1px solid var(--md-outline-variant);
  background: var(--md-surface);
}
.tabs-row .tab {
  flex: 1;
  text-align: center;
  padding: 13px 6px 11px;
  font-size: .88em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  position: relative;
  letter-spacing: .01em;
}
.tabs-row .tab.active { color: var(--md-primary); }
.tabs-row .tab.active::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--md-primary);
}

/* ============ hero ============ */
.hero {
  margin: 8px var(--pad-x) 14px;
  border-radius: calc(var(--md-radius) + 6px);
  padding: 20px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--md-primary) 0%, var(--md-tertiary) 100%);
  color: #fff;
  isolation: isolate;
}
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(120% 90% at 100% 0%, rgba(255, 255, 255, .32), transparent 62%);
}
.hero .hero-icon {
  position: absolute;
  right: -12px;
  top: -18px;
  font-size: 132px;
  width: 132px;
  height: 132px;
  opacity: .18;
  color: #fff;
  z-index: -1;
}
.hero .hero-kicker {
  margin: 0;
  font-size: .68em;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  opacity: .82;
}
.hero h2 {
  font-family: var(--font-display);
  font-size: 1.7em;
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -.02em;
  margin: .22em 0 .16em;
}
.hero p { margin: 0; font-size: .9em; opacity: .9; line-height: 1.4; }

/* ============ section heading ============ */
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px 8px;
}
.section-head h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15em;
  font-weight: 600;
  letter-spacing: -.01em;
}
.section-head a { font-size: .82em; font-weight: 600; color: var(--md-primary); }

/* ============ card ============ */
.card {
  margin: 0 var(--pad-x) 14px;
  border-radius: var(--md-radius);
  overflow: hidden;
  background: var(--md-surface-container);
  color: var(--md-on-surface);
}
.card.elevated {
  background: var(--md-surface-container-lowest);
  box-shadow: 0 1px 3px rgba(0, 0, 0, .1), 0 6px 18px rgba(0, 0, 0, .06);
}
.card.outlined {
  background: transparent;
  border: 1px solid var(--md-outline-variant);
}
.card-media {
  height: 138px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(130deg, var(--md-primary), var(--md-tertiary));
}
.card-media .mi { font-size: 46px; opacity: .9; }
.card-media .icn { width: 44px; height: 44px; opacity: .9; }
.card-body { padding: 16px 18px 8px; }
.card-body h3 {
  margin: 0 0 5px;
  font-family: var(--font-display);
  font-size: 1.15em;
  font-weight: 600;
  letter-spacing: -.01em;
}
.card-body p {
  margin: 0;
  font-size: .9em;
  line-height: 1.5;
  color: var(--md-on-surface-variant);
}
.card-actions { display: flex; justify-content: flex-end; gap: 4px; padding: 4px 10px 10px; }

.text-btn {
  padding: 9px 14px;
  border-radius: 20px;
  font-size: .85em;
  font-weight: 600;
  color: var(--md-primary);
  letter-spacing: .01em;
}
.text-btn:hover { background: color-mix(in srgb, var(--md-primary) 8%, transparent); }

/* ============ list ============ */
.list { list-style: none; margin: 0 0 10px; padding: 0; }
.list-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 18px;
  min-height: 64px;
}
.list-item + .list-item { border-top: 1px solid var(--md-outline-variant); }
.list-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: .92em;
  flex: 0 0 auto;
}
.list-lead {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  flex: 0 0 auto;
}
.list-lead .mi { font-size: 21px; }
.list-lead .icn { width: 20px; height: 20px; }
.li-text { flex: 1; min-width: 0; }
.li-title {
  font-size: .98em;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.li-sub {
  margin-top: 3px;
  font-size: .82em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.li-chev { color: var(--md-on-surface-variant); font-size: 20px; }
.list-item .badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-size: .7em;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ============ buttons ============ */
.btn-row { display: flex; gap: 10px; flex-wrap: wrap; padding: 4px var(--pad-x) 16px; }
.btn {
  height: 42px;
  padding: 0 22px;
  border-radius: 21px;
  font-family: var(--font-ui);
  font-size: .9em;
  font-weight: 600;
  letter-spacing: .01em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: var(--md-primary);
  border: 1px solid transparent;
  cursor: pointer;
  transition: filter .15s;
}
.btn .mi { font-size: 19px; }
.btn .icn { width: 18px; height: 18px; }
.btn:hover { filter: brightness(.96); }
.btn.filled { background: var(--md-primary); color: var(--md-on-primary); }
.btn.tonal { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.btn.outlined { border-color: var(--md-outline); color: var(--md-primary); }
.btn.elevated {
  background: var(--md-surface-container-lowest);
  color: var(--md-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, .16);
}
.btn.full { width: 100%; }

/* ============ chips ============ */
.chips {
  display: flex;
  gap: 8px;
  padding: 4px var(--pad-x) 14px;
  overflow-x: auto;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar { display: none; }
.chip {
  height: 32px;
  padding: 0 13px;
  border-radius: 9px;
  border: 1px solid var(--md-outline-variant);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: .84em;
  font-weight: 500;
  white-space: nowrap;
  color: var(--md-on-surface-variant);
  flex: 0 0 auto;
}
.chip.on {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  border-color: transparent;
}
.chip .mi { font-size: 17px; }
.chip .icn { width: 15px; height: 15px; }

/* ============ text field ============ */
.field { margin: 4px var(--pad-x) 14px; }
.field-label {
  font-size: .78em;
  font-weight: 600;
  margin: 0 0 6px 4px;
  color: var(--md-on-surface-variant);
}
.field-box {
  min-height: 54px;
  border-radius: 12px;
  border: 1.5px solid var(--md-outline);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  font-size: .95em;
  color: var(--md-on-surface);
}
.field.filled .field-box {
  background: var(--md-surface-container-high);
  border-color: transparent;
}
.field-box .mi { color: var(--md-on-surface-variant); font-size: 21px; }
.field-box .icn { color: var(--md-on-surface-variant); }
.field-value { flex: 1; }
.field-value.ph { color: var(--md-on-surface-variant); }
.field-support {
  font-size: .75em;
  margin: 6px 0 0 4px;
  color: var(--md-on-surface-variant);
}

/* ============ switch row ============ */
.switch-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 13px 18px;
}
.switch-row .li-text { flex: 1; }
.switch {
  width: 50px;
  height: 30px;
  border-radius: 15px;
  border: 2px solid var(--md-outline);
  background: var(--md-surface-container-high);
  position: relative;
  flex: 0 0 auto;
  display: inline-block;
}
.switch::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 6px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--md-outline);
  transform: translateY(-50%);
  transition: left .18s;
}
.switch.on { background: var(--md-primary); border-color: var(--md-primary); }
.switch.on::after { left: auto; right: 5px; width: 21px; height: 21px; background: var(--md-on-primary); }

/* ============ snackbar ============ */
.snackbar {
  margin: 8px var(--pad-x) 16px;
  background: #322f35;
  color: #f5eff7;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: .9em;
  line-height: 1.35;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .22);
}
.snackbar .snack-action { margin-left: auto; font-weight: 600; color: #d0bcff; font-size: .95em; white-space: nowrap; }

/* ============ bottom nav ============ */
.nav-bar {
  display: flex;
  align-items: stretch;
  padding: 10px 6px 12px;
  background: var(--md-surface-container);
  border-top: 1px solid var(--md-outline-variant);
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: .72em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  min-width: 0;
}
.nav-item .nav-icon {
  width: 58px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .15s;
}
.nav-item .mi { font-size: 22px; }
.nav-item .icn { width: 21px; height: 21px; }
.nav-item.active { color: var(--md-on-surface); }
.nav-item.active .nav-icon { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.nav-item span:last-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

/* ============ FAB ============ */
.fab-row { display: flex; justify-content: flex-end; padding: 2px var(--pad-x) 18px; }
.fab {
  height: 56px;
  min-width: 56px;
  padding: 0 18px;
  border-radius: 18px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-ui);
  font-size: .9em;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .18);
}
.fab .mi { font-size: 24px; }
.fab .icn { width: 23px; height: 23px; }
.fab.icon-only { padding: 0; }

/* ============ dialog ============ */
.dialog {
  margin: 10px 24px 18px;
  padding: 24px;
  border-radius: 28px;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  box-shadow: 0 10px 34px rgba(0, 0, 0, .22);
}
.dialog h3 {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-size: 1.45em;
  font-weight: 600;
  letter-spacing: -.01em;
}
.dialog p {
  margin: 0 0 18px;
  font-size: .9em;
  line-height: 1.55;
  color: var(--md-on-surface-variant);
}
.dialog-actions { display: flex; justify-content: flex-end; gap: 6px; }
.dialog-actions .text-btn { color: var(--md-primary); }

/* ============ bottom sheet ============ */
.sheet {
  margin: 6px 0 14px;
  border-radius: 26px 26px 0 0;
  background: var(--md-surface-container-low);
  box-shadow: 0 -6px 26px rgba(0, 0, 0, .1);
  padding: 10px 0 14px;
}
.sheet-handle {
  width: 32px;
  height: 4px;
  border-radius: 99px;
  background: var(--md-outline-variant);
  margin: 0 auto 12px;
}
.sheet-title {
  font-family: var(--font-display);
  font-size: .95em;
  font-weight: 600;
  padding: 0 20px 6px;
  color: var(--md-on-surface);
}
.sheet-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 20px;
  font-size: .92em;
  color: var(--md-on-surface);
}
.sheet-item .mi { color: var(--md-on-surface-variant); font-size: 22px; }
.sheet-item .icn { color: var(--md-on-surface-variant); }

/* ============ progress ============ */
.progress-wrap { margin: 6px var(--pad-x) 18px; }
.progress-top {
  display: flex;
  justify-content: space-between;
  font-size: .8em;
  font-weight: 500;
  color: var(--md-on-surface-variant);
  margin-bottom: 8px;
}
.progress {
  height: 6px;
  border-radius: 99px;
  background: var(--md-surface-container-high);
  overflow: hidden;
}
.progress span { display: block; height: 100%; border-radius: 99px; background: var(--md-primary); }

/* ============ music blocks ============ */
.music-player {
  margin: 8px var(--pad-x) 18px;
  padding: 16px 16px 13px;
  border-radius: calc(var(--md-radius) + 8px);
  background:
    linear-gradient(165deg, color-mix(in srgb, var(--md-primary) 16%, var(--md-surface-container-low)) 0%, var(--md-surface-container-low) 56%),
    var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-primary) 16%, var(--md-outline-variant));
}
.mp-art {
  position: relative;
  width: min(100%, 272px);
  aspect-ratio: 1 / 1;
  margin: 0 auto 17px;
  border-radius: calc(var(--md-radius) + 3px);
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  background: linear-gradient(140deg, var(--md-primary) 0%, var(--md-tertiary) 100%);
  box-shadow: 0 18px 38px color-mix(in srgb, var(--md-primary) 28%, transparent);
}
.mp-art::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(80% 70% at 82% 8%, rgba(255, 255, 255, .34), transparent 60%),
    linear-gradient(330deg, rgba(0, 0, 0, .24), transparent 55%);
}
.mp-art::after {
  content: "";
  position: absolute;
  inset: 20%;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 50%;
  box-shadow: 0 0 0 24px rgba(255, 255, 255, .05), 0 0 0 52px rgba(255, 255, 255, .035);
}
.mp-glyph { font-size: 94px; width: 94px; height: 94px; opacity: .3; }
.mp-fav {
  position: absolute;
  top: 11px;
  right: 11px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(255, 255, 255, .18);
  backdrop-filter: blur(8px);
}
.mp-fav.on { color: #ffd0dd; }
.mp-fav .mi { font-size: 20px; }
.mp-fav .icn { width: 18px; height: 18px; }
.mp-meta { text-align: center; }
.mp-kicker {
  display: block;
  font-size: .64em;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--md-primary);
  margin-bottom: 5px;
}
.mp-meta h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.42em;
  line-height: 1.16;
  letter-spacing: -.02em;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mp-meta p {
  margin: 4px 0 0;
  font-size: .84em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mp-progress { margin: 17px 4px 12px; }
.mp-bar { height: 5px; border-radius: 99px; background: color-mix(in srgb, var(--md-primary) 14%, transparent); overflow: hidden; }
.mp-bar span { display: block; height: 100%; border-radius: inherit; background: var(--md-primary); }
.mp-times {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  font-size: .68em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  font-variant-numeric: tabular-nums;
}
.mp-controls { display: flex; align-items: center; justify-content: center; gap: 13px; }
.mp-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--md-on-surface-variant);
}
.mp-btn:hover { background: color-mix(in srgb, var(--md-on-surface) 7%, transparent); color: var(--md-on-surface); }
.mp-btn .mi { font-size: 23px; }
.mp-btn .icn { width: 20px; height: 20px; }
.mp-play {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--md-primary);
  color: var(--md-on-primary);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--md-primary) 36%, transparent);
}
.mp-play .mi { font-size: 33px; }
.mp-play .icn { width: 27px; height: 27px; }
.mp-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 70%, transparent);
}
.mp-text {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: .72em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}
.mp-text .mi { font-size: 16px; }
.mp-text .icn { width: 14px; height: 14px; }

.track-list {
  margin: 4px var(--pad-x) 16px;
  padding: 5px 0;
  border-radius: var(--md-radius);
  background: var(--md-surface-container-low);
  overflow: hidden;
}
.track-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; }
.track-row.active { background: color-mix(in srgb, var(--md-primary) 9%, transparent); }
.track-index {
  width: 22px;
  text-align: center;
  flex: 0 0 auto;
  font-size: .74em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  font-variant-numeric: tabular-nums;
}
.track-cover {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-on-primary-container);
  background: var(--md-primary-container);
}
.track-cover .mi { font-size: 20px; }
.track-cover .icn { width: 18px; height: 18px; }
.track-info { flex: 1; min-width: 0; }
.track-title {
  font-size: .9em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-row.active .track-title { color: var(--md-primary); }
.track-artist {
  margin-top: 2px;
  font-size: .74em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-dur {
  font-size: .72em;
  color: var(--md-on-surface-variant);
  font-variant-numeric: tabular-nums;
  flex: 0 0 auto;
}
.track-eq { display: flex; align-items: flex-end; gap: 2px; height: 15px; width: 15px; flex: 0 0 auto; }
.track-eq i {
  width: 3px;
  border-radius: 2px;
  background: var(--md-primary);
  animation: track-eq .9s ease-in-out infinite alternate;
}
.track-eq i:nth-child(1) { height: 55%; animation-delay: -.2s; }
.track-eq i:nth-child(2) { height: 100%; animation-delay: -.5s; }
.track-eq i:nth-child(3) { height: 70%; animation-delay: -.8s; }
@keyframes track-eq {
  from { transform: scaleY(.45); }
  to { transform: scaleY(1); }
}
.track-empty { padding: 16px; font-size: .82em; color: var(--md-on-surface-variant); }

.album-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px 13px;
  padding: 4px var(--pad-x) 16px;
}
.album-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 9px; }
.album-card { min-width: 0; }
.album-art {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--md-radius);
  overflow: hidden;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(145deg, var(--md-primary) 0%, var(--md-tertiary) 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, .14);
}
.album-card:nth-child(4n + 2) .album-art { background: linear-gradient(145deg, var(--md-tertiary) 0%, var(--md-primary) 100%); }
.album-card:nth-child(4n + 3) .album-art { background: linear-gradient(145deg, color-mix(in srgb, var(--md-primary) 54%, #12121a) 0%, var(--md-primary) 100%); }
.album-card:nth-child(4n + 4) .album-art { background: linear-gradient(145deg, color-mix(in srgb, var(--md-tertiary) 58%, #12121a) 0%, var(--md-tertiary) 100%); }
.album-art::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(255, 255, 255, .18), transparent 50%, rgba(0, 0, 0, .22));
}
.album-glyph { position: relative; z-index: 1; font-size: 44px; width: 44px; height: 44px; opacity: .82; }
.album-grid.cols-3 .album-glyph { font-size: 32px; width: 32px; height: 32px; }
.album-play {
  position: absolute;
  z-index: 2;
  right: 9px;
  bottom: 9px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, .92);
  color: #17141d;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .22);
}
.album-grid.cols-3 .album-play { width: 27px; height: 27px; right: 7px; bottom: 7px; }
.album-play .mi { font-size: 20px; }
.album-play .icn { width: 15px; height: 15px; }
.album-name {
  margin-top: 8px;
  font-size: .86em;
  font-weight: 650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.album-artist {
  margin-top: 1px;
  font-size: .72em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.album-grid .track-empty { grid-column: 1 / -1; }

/* Horizontal music-card rails. These are normal page content: each card has
   artwork, track name and singer, and the rail scrolls sideways on its own. */
.listen-now { margin: 4px 0 20px; min-width: 0; }
.ln-head {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 2px var(--pad-x) 11px;
}
.ln-head-text { flex: 1; min-width: 0; }
.ln-kicker {
  display: block;
  margin-bottom: 4px;
  font-size: .62em;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--md-primary);
}
.ln-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.16em;
  line-height: 1.15;
  letter-spacing: -.015em;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ln-sub {
  margin: 3px 0 0;
  font-size: .7em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ln-tools { display: flex; align-items: center; gap: 6px; flex: 0 0 auto; }
.ln-action {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 3px 0;
  font-size: .68em;
  font-weight: 700;
  color: var(--md-primary);
  white-space: nowrap;
}
.ln-action .mi { font-size: 15px; width: 15px; }
.ln-action .icn { width: 13px; height: 13px; }
.ln-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--md-on-surface-variant);
  background: var(--md-surface-container-high);
}
.ln-arrow:hover { color: var(--md-on-surface); background: var(--md-surface-container); }
.ln-arrow .mi { font-size: 18px; }
.ln-arrow .icn { width: 15px; height: 15px; }
.ln-rail {
  display: flex;
  gap: 12px;
  padding: 2px var(--pad-x) 7px;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.ln-rail::-webkit-scrollbar { width: 0; height: 0; }
.ln-card {
  flex: 0 0 auto;
  width: 148px;
  min-width: 0;
  scroll-snap-align: start;
}
.ln-art {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: calc(var(--md-radius) + 1px);
  overflow: hidden;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(145deg, var(--md-primary) 0%, var(--md-tertiary) 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, .14);
}
.ln-card:nth-child(4n + 2) .ln-art { background: linear-gradient(145deg, var(--md-tertiary) 0%, var(--md-primary) 100%); }
.ln-card:nth-child(4n + 3) .ln-art { background: linear-gradient(145deg, color-mix(in srgb, var(--md-primary) 54%, #12121a) 0%, var(--md-primary) 100%); }
.ln-card:nth-child(4n + 4) .ln-art { background: linear-gradient(145deg, color-mix(in srgb, var(--md-tertiary) 58%, #12121a) 0%, var(--md-tertiary) 100%); }
.ln-art::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(90% 70% at 80% 4%, rgba(255, 255, 255, .26), transparent 62%),
    linear-gradient(160deg, rgba(255, 255, 255, .18), transparent 50%, rgba(0, 0, 0, .24));
}
.ln-glyph { position: relative; z-index: 1; font-size: 46px; width: 46px; height: 46px; opacity: .84; }
.ln-play {
  position: absolute;
  z-index: 2;
  right: 8px;
  bottom: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, .92);
  color: #17141d;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .22);
}
.ln-play .mi { font-size: 20px; }
.ln-play .icn { width: 15px; height: 15px; }
.ln-copy { min-width: 0; }
.ln-name {
  margin-top: 8px;
  font-size: .84em;
  font-weight: 650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ln-artist {
  margin-top: 1px;
  font-size: .71em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Wide cards pair the artwork with the title beside it, like a shuffle row. */
.listen-now.ln-wide .ln-card {
  width: 236px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px;
  border-radius: var(--md-radius);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 72%, transparent);
}
.listen-now.ln-wide .ln-art {
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
  aspect-ratio: auto;
  border-radius: 13px;
}
.listen-now.ln-wide .ln-glyph { font-size: 27px; width: 27px; height: 27px; }
.listen-now.ln-wide .ln-play { width: 26px; height: 26px; right: 4px; bottom: 4px; }
.listen-now.ln-wide .ln-play .mi { font-size: 16px; }
.listen-now.ln-wide .ln-play .icn { width: 12px; height: 12px; }
.listen-now.ln-wide .ln-copy { flex: 1; }
.listen-now.ln-wide .ln-name { margin-top: 0; }

/* Compact tiles fit more artwork in one glance. */
.listen-now.ln-tile .ln-card { width: 110px; }
.listen-now.ln-tile .ln-art { border-radius: 14px; }
.listen-now.ln-tile .ln-glyph { font-size: 34px; width: 34px; height: 34px; }
.listen-now.ln-tile .ln-name { margin-top: 6px; font-size: .78em; }
.listen-now.ln-tile .ln-artist { font-size: .66em; }
.listen-now.ln-tile .ln-play { width: 27px; height: 27px; right: 6px; bottom: 6px; }
.listen-now.ln-tile .ln-play .mi { font-size: 17px; }

.mini-player {
  position: relative;
  margin: 6px var(--pad-x) 14px;
  padding: 11px 11px 11px 10px;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--md-surface-container-high);
  box-shadow: 0 8px 22px rgba(0, 0, 0, .13);
}
.mini-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: color-mix(in srgb, var(--md-primary) 16%, transparent); }
.mini-bar span { display: block; height: 100%; background: var(--md-primary); }
.mini-art {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(145deg, var(--md-primary), var(--md-tertiary));
}
.mini-art .mi { font-size: 21px; }
.mini-art .icn { width: 18px; height: 18px; }
.mini-info { flex: 1; min-width: 0; }
.mini-title { font-size: .86em; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-artist { margin-top: 1px; font-size: .72em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-actions { display: flex; align-items: center; gap: 1px; flex: 0 0 auto; }
.mini-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-on-surface-variant);
}
.mini-btn:hover { background: color-mix(in srgb, var(--md-on-surface) 7%, transparent); }
.mini-btn .mi { font-size: 23px; }
.mini-btn .icn { width: 18px; height: 18px; }
.mini-play {
  width: 42px;
  height: 42px;
  color: var(--md-on-primary);
  background: var(--md-primary);
  box-shadow: 0 7px 16px color-mix(in srgb, var(--md-primary) 34%, transparent);
}
.mini-play:hover { background: var(--md-primary); filter: brightness(1.03); }
.mini-play .mi { font-size: 25px; }
.mini-play .icn { width: 19px; height: 19px; }

/* Large-artwork layout keeps the clean bar but gives the cover more weight. */
.mini-artwork { padding: 9px 10px 9px 9px; }
.mini-artwork .mini-art { width: 54px; height: 54px; border-radius: 15px; }
.mini-artwork .mini-art .mi { font-size: 26px; }
.mini-artwork .mini-title { font-size: .92em; }
.mini-artwork .mini-play { width: 46px; height: 46px; }
.mini-artwork .mini-actions { gap: 3px; }

/* Circular-progress layout: the ring is driven by the block's progress value,
   so 25% draws exactly a quarter-circle arc around the play button. */
.mini-ring {
  padding: 9px 10px 9px 9px;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--md-primary) 15%, var(--md-surface-container-high)), var(--md-surface-container-high));
  border: 1px solid color-mix(in srgb, var(--md-primary) 15%, var(--md-outline-variant));
}
.mini-ring .mini-art { width: 44px; height: 44px; border-radius: 50%; }
.mini-ring .mini-art .mi { font-size: 22px; }
.mini-ring .mini-actions { gap: 4px; }
.mini-play-ring {
  position: relative;
  width: 50px;
  height: 50px;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}
.mini-play-ring:hover { background: transparent; filter: none; }
.mini-play-face {
  position: relative;
  z-index: 1;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--md-on-primary);
  background: var(--md-primary);
  box-shadow: 0 6px 14px color-mix(in srgb, var(--md-primary) 34%, transparent);
}
.mini-play-face .mi { font-size: 22px; }
.mini-play-face .icn { width: 17px; height: 17px; }
.mini-progress-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  transform: rotate(-90deg);
}
.mini-ring-track { fill: none; stroke: color-mix(in srgb, var(--md-primary) 18%, transparent); stroke-width: 3.2; }
.mini-ring-fill {
  fill: none;
  stroke: var(--md-primary);
  stroke-width: 3.2;
  stroke-linecap: round;
  transition: stroke-dashoffset .35s ease;
}
.mini-progress-text {
  margin-top: 3px;
  font-size: .64em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
}
.mini-progress-text b { color: var(--md-primary); font-weight: 750; }

/* ============ download blocks ============ */
.dl-item {
  margin: 6px var(--pad-x) 14px;
  padding: 13px;
  border-radius: var(--md-radius);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 72%, transparent);
}
.dl-ico {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 13%, transparent);
}
.dl-ico .mi { font-size: 23px; }
.dl-ico .icn { width: 20px; height: 20px; }
.dl-main { flex: 1; min-width: 0; }
.dl-top { display: flex; align-items: center; gap: 8px; }
.dl-title { flex: 1; min-width: 0; font-size: .88em; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dl-state { flex: 0 0 auto; font-size: .64em; font-weight: 700; letter-spacing: .03em; color: var(--md-primary); }
.dl-meta { margin-top: 3px; font-size: .72em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dl-bar { height: 5px; margin-top: 9px; border-radius: 99px; background: color-mix(in srgb, var(--md-primary) 13%, transparent); overflow: hidden; }
.dl-bar span { display: block; height: 100%; border-radius: inherit; background: var(--md-primary); transition: width .3s ease; }
.dl-item.paused .dl-state { color: var(--md-on-surface-variant); }
.dl-item.paused .dl-bar span { background: var(--md-outline); }
.dl-item.queued .dl-state { color: var(--md-on-surface-variant); }
.dl-item.queued .dl-bar span { background: var(--md-outline-variant); }
.dl-item.complete .dl-state { color: #199a5c; }
.dl-item.complete .dl-bar span { background: #2fbf71; }
.dl-act {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-on-surface-variant);
  background: color-mix(in srgb, var(--md-on-surface) 6%, transparent);
}
.dl-act .mi { font-size: 20px; }
.dl-act .icn { width: 16px; height: 16px; }

.dl-queue {
  margin: 6px var(--pad-x) 16px;
  padding: 14px 14px 4px;
  border-radius: calc(var(--md-radius) + 2px);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 72%, transparent);
}
.dlq-head { display: flex; align-items: flex-start; gap: 10px; padding-bottom: 8px; }
.dlq-head > div { flex: 1; min-width: 0; }
.dlq-title { font-family: var(--font-display); font-size: 1.02em; font-weight: 650; letter-spacing: -.01em; }
.dlq-sub { margin-top: 2px; font-size: .72em; color: var(--md-on-surface-variant); }
.dlq-more { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; color: var(--md-on-surface-variant); flex: 0 0 auto; }
.dlq-more .mi { font-size: 20px; }
.dlq-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 68%, transparent); }
.dlq-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 12%, transparent);
}
.dlq-ico .mi { font-size: 19px; }
.dlq-ico .icn { width: 16px; height: 16px; }
.dlq-main { flex: 1; min-width: 0; }
.dlq-name { font-size: .8em; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dlq-meta { margin-top: 1px; font-size: .68em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dlq-bar { height: 4px; margin-top: 7px; border-radius: 99px; background: color-mix(in srgb, var(--md-primary) 12%, transparent); overflow: hidden; }
.dlq-bar span { display: block; height: 100%; border-radius: inherit; background: var(--md-primary); }
.dlq-pct { flex: 0 0 auto; min-width: 30px; text-align: right; font-size: .68em; font-weight: 700; color: var(--md-primary); font-variant-numeric: tabular-nums; }
.dlq-pct .mi { font-size: 18px; color: #199a5c; }
.dlq-pct .icn { width: 15px; height: 15px; color: #199a5c; }
.dlq-row.done .dlq-bar span { background: #2fbf71; }

.storage-card {
  margin: 6px var(--pad-x) 16px;
  padding: 16px;
  border-radius: calc(var(--md-radius) + 2px);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 72%, transparent);
}
.storage-head { display: flex; align-items: center; gap: 12px; }
.storage-ico {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 13%, transparent);
}
.storage-ico .mi { font-size: 22px; }
.storage-head-text { flex: 1; min-width: 0; }
.storage-title { font-size: .74em; font-weight: 600; color: var(--md-on-surface-variant); }
.storage-big { margin-top: 1px; font-family: var(--font-display); font-size: 1.28em; font-weight: 700; letter-spacing: -.02em; line-height: 1.2; }
.storage-big small { font-family: var(--font-ui); font-size: .52em; font-weight: 500; color: var(--md-on-surface-variant); letter-spacing: 0; }
.storage-bar { display: flex; gap: 2px; height: 12px; margin: 15px 0 13px; border-radius: 99px; overflow: hidden; background: var(--md-surface-container-high); }
.storage-seg { display: block; height: 100%; min-width: 2px; flex: 0 0 auto; }
.storage-seg:nth-child(1) { background: var(--md-primary); }
.storage-seg:nth-child(2) { background: var(--md-tertiary); }
.storage-seg:nth-child(3) { background: color-mix(in srgb, var(--md-primary) 55%, var(--md-tertiary)); }
.storage-seg:nth-child(4) { background: var(--md-outline-variant); }
.storage-seg:nth-child(5) { background: color-mix(in srgb, var(--md-primary) 35%, var(--md-outline-variant)); }
.storage-legend { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 14px; }
.storage-key { display: flex; align-items: center; gap: 7px; min-width: 0; font-size: .74em; color: var(--md-on-surface-variant); }
.storage-key > span:nth-child(2) { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.storage-key b { font-weight: 600; color: var(--md-on-surface); font-variant-numeric: tabular-nums; }
.storage-dot { width: 8px; height: 8px; border-radius: 3px; flex: 0 0 auto; }
.storage-key:nth-child(1) .storage-dot { background: var(--md-primary); }
.storage-key:nth-child(2) .storage-dot { background: var(--md-tertiary); }
.storage-key:nth-child(3) .storage-dot { background: color-mix(in srgb, var(--md-primary) 55%, var(--md-tertiary)); }
.storage-key:nth-child(4) .storage-dot { background: var(--md-outline-variant); }
.storage-key:nth-child(5) .storage-dot { background: color-mix(in srgb, var(--md-primary) 35%, var(--md-outline-variant)); }

.file-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 4px var(--pad-x) 16px;
}
.file-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.file-tile {
  padding: 13px;
  border-radius: var(--md-radius);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 68%, transparent);
  min-width: 0;
}
.file-ico {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 13%, transparent);
}
.file-ico .mi { font-size: 20px; }
.file-ico .icn { width: 17px; height: 17px; }
.file-name { margin-top: 9px; font-size: .84em; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-meta { margin-top: 2px; font-size: .7em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-grid .track-empty { grid-column: 1 / -1; }

/* ============ password blocks ============ */
.vault-list {
  margin: 4px var(--pad-x) 16px;
  padding: 16px 0 5px;
  border-radius: calc(var(--md-radius) + 2px);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 72%, transparent);
  overflow: hidden;
}
.vault-head { display: flex; align-items: flex-start; gap: 10px; padding: 0 16px 12px; }
.vault-head > div { flex: 1; min-width: 0; }
.vault-head h3 { margin: 0; font-family: var(--font-display); font-size: 1.24em; font-weight: 700; letter-spacing: -.02em; }
.vault-head p { margin: 2px 0 0; font-size: .74em; color: var(--md-on-surface-variant); }
.vault-add {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-on-primary);
  background: var(--md-primary);
}
.vault-add .mi { font-size: 20px; }
.vault-add .icn { width: 17px; height: 17px; }
.vault-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  margin: 0 14px 8px;
  padding: 0 11px;
  border-radius: 12px;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  font-size: .8em;
}
.vault-search > span:nth-child(2) { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vault-search .mi { font-size: 19px; }
.vault-search .icn { width: 16px; height: 16px; }
.vault-filter { display: grid; place-items: center; }
.vault-row { display: flex; align-items: center; gap: 11px; padding: 9px 16px; }
.vault-row + .vault-row { border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 60%, transparent); }
.vault-logo {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 12%, transparent);
}
.vault-logo .mi { font-size: 20px; }
.vault-logo .icn { width: 17px; height: 17px; }
.vault-info { flex: 1; min-width: 0; }
.vault-name { font-size: .85em; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vault-user { margin-top: 1px; font-size: .71em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vault-strength { display: flex; align-items: flex-end; gap: 2px; height: 12px; flex: 0 0 auto; }
.vault-strength span { width: 3px; border-radius: 2px; background: var(--md-outline-variant); }
.vault-strength span:nth-child(1) { height: 5px; }
.vault-strength span:nth-child(2) { height: 8px; }
.vault-strength span:nth-child(3) { height: 11px; }
.vault-strength.s1 span.on { background: #ef4444; }
.vault-strength.s2 span.on { background: #f59e0b; }
.vault-strength.s3 span.on { background: #22c55e; }
.vault-chev { color: var(--md-on-surface-variant); display: grid; place-items: center; flex: 0 0 auto; }
.vault-chev .mi { font-size: 19px; }
.vault-chev .icn { width: 15px; height: 15px; }

.secret-card {
  margin: 6px var(--pad-x) 16px;
  padding: 17px;
  border-radius: calc(var(--md-radius) + 2px);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-primary) 16%, var(--md-outline-variant));
}
.secret-head { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
.secret-logo {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-on-primary-container);
  background: var(--md-primary-container);
}
.secret-logo .mi { font-size: 24px; }
.secret-logo .icn { width: 21px; height: 21px; }
.secret-id { flex: 1; min-width: 0; }
.secret-id h3 { margin: 0; font-family: var(--font-display); font-size: 1.18em; font-weight: 700; letter-spacing: -.015em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.secret-id p { margin: 2px 0 0; font-size: .72em; color: var(--md-on-surface-variant); }
.secret-more { width: 32px; height: 32px; border-radius: 50%; flex: 0 0 auto; display: grid; place-items: center; color: var(--md-on-surface-variant); }
.secret-more .mi { font-size: 20px; }
.secret-field { padding: 10px 12px; margin-bottom: 9px; border-radius: 12px; background: var(--md-surface-container-high); }
.secret-label { font-size: .62em; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--md-on-surface-variant); }
.secret-value { display: flex; align-items: center; gap: 5px; margin-top: 4px; min-width: 0; }
.secret-value > span:first-child { flex: 1; min-width: 0; font-size: .84em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.secret-copy { width: 28px; height: 28px; border-radius: 8px; flex: 0 0 auto; display: grid; place-items: center; color: var(--md-on-surface-variant); }
.secret-copy:hover { background: color-mix(in srgb, var(--md-on-surface) 7%, transparent); }
.secret-copy .mi { font-size: 18px; }
.secret-copy .icn { width: 15px; height: 15px; }
.secret-pass { font-family: "JetBrains Mono", "Fira Code", monospace; letter-spacing: .06em; }
.secret-strength { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 13px 2px 14px; font-size: .73em; font-weight: 600; color: var(--md-on-surface-variant); }
.strength-meter { display: flex; gap: 3px; flex: 0 0 auto; }
.strength-meter span { width: 18px; height: 4px; border-radius: 2px; background: var(--md-outline-variant); }
.strength-meter.s1 span.on { background: #ef4444; }
.strength-meter.s2 span.on { background: #f59e0b; }
.strength-meter.s3 span.on { background: #84cc16; }
.strength-meter.s4 span.on { background: #22c55e; }
.secret-actions { display: flex; gap: 8px; }
.secret-actions .btn { flex: 1; height: 40px; padding: 0 12px; font-size: .84em; }

.sec-score {
  margin: 6px var(--pad-x) 16px;
  padding: 17px;
  border-radius: calc(var(--md-radius) + 2px);
  background:
    linear-gradient(155deg, color-mix(in srgb, var(--md-primary) 12%, var(--md-surface-container-low)), var(--md-surface-container-low) 62%),
    var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-primary) 15%, var(--md-outline-variant));
}
.sec-top { display: flex; align-items: center; gap: 15px; }
.sec-ring {
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--md-primary) calc(var(--score, 0) * 1%), color-mix(in srgb, var(--md-primary) 14%, transparent) 0);
}
.sec-ring::after { content: ""; position: absolute; inset: 8px; border-radius: 50%; background: var(--md-surface-container); }
.sec-ring b { position: relative; z-index: 1; font-family: var(--font-display); font-size: 1.55em; font-weight: 700; letter-spacing: -.04em; line-height: 1; }
.sec-ring b small { font-family: var(--font-ui); font-size: .42em; font-weight: 600; letter-spacing: 0; color: var(--md-on-surface-variant); }
.sec-copy { flex: 1; min-width: 0; }
.sec-copy h3 { margin: 0; font-family: var(--font-display); font-size: 1.1em; font-weight: 700; letter-spacing: -.015em; }
.sec-copy p { margin: 4px 0 0; font-size: .75em; line-height: 1.42; color: var(--md-on-surface-variant); }
.sec-mini { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 14px; padding-top: 13px; border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 70%, transparent); }
.sec-mini > div { text-align: center; min-width: 0; }
.sec-mini b { display: block; font-family: var(--font-display); font-size: 1.14em; font-weight: 700; letter-spacing: -.02em; }
.sec-mini span { display: block; margin-top: 1px; font-size: .68em; color: var(--md-on-surface-variant); }
.sec-action { margin-top: 13px; height: 38px; font-size: .8em; }

.passgen {
  margin: 6px var(--pad-x) 16px;
  padding: 16px;
  border-radius: calc(var(--md-radius) + 2px);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 72%, transparent);
}
.pg-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.pg-kicker { font-size: .64em; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--md-primary); }
.pg-refresh { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; color: var(--md-on-surface-variant); }
.pg-refresh:hover { background: color-mix(in srgb, var(--md-on-surface) 7%, transparent); }
.pg-refresh .mi { font-size: 19px; }
.pg-refresh .icn { width: 15px; height: 15px; }
.pg-output {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 12px;
  border-radius: 12px;
  background: var(--md-surface-container-high);
  border: 1px solid color-mix(in srgb, var(--md-primary) 20%, transparent);
}
.pg-output code { flex: 1; min-width: 0; font-family: "JetBrains Mono", "Fira Code", monospace; font-size: .86em; letter-spacing: .02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pg-copy { width: 29px; height: 29px; border-radius: 8px; flex: 0 0 auto; display: grid; place-items: center; color: var(--md-primary); }
.pg-copy .mi { font-size: 19px; }
.pg-copy .icn { width: 15px; height: 15px; }
.pg-length { display: flex; align-items: center; justify-content: space-between; margin: 13px 1px 6px; font-size: .73em; color: var(--md-on-surface-variant); }
.pg-length b { font-size: 1.1em; color: var(--md-on-surface); }
.pg-track { height: 5px; border-radius: 99px; background: color-mix(in srgb, var(--md-primary) 13%, transparent); overflow: hidden; }
.pg-track span { display: block; height: 100%; border-radius: inherit; background: var(--md-primary); }
.pg-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 14px; }
.pg-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  border-radius: 99px;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  font-size: .69em;
  font-weight: 650;
  letter-spacing: .02em;
}
.pg-chip.on { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.pg-chip .mi { font-size: 13px; }
.pg-chip .icn { width: 11px; height: 11px; }
.pg-use { height: 40px; font-size: .84em; }

/* ============ utility blocks ============ */
.stat-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 4px var(--pad-x) 16px;
}
.stat-row.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.stat-row.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.stat-row.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.stat-tile {
  min-width: 0;
  padding: 12px 11px;
  border-radius: var(--md-radius);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 68%, transparent);
}
.stat-ico {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 12%, transparent);
  margin-bottom: 9px;
}
.stat-ico .mi { font-size: 17px; }
.stat-ico .icn { width: 15px; height: 15px; }
.stat-val {
  font-family: var(--font-display);
  font-size: 1.16em;
  font-weight: 700;
  letter-spacing: -.02em;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-label {
  margin-top: 2px;
  font-size: .68em;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-row.cols-4 .stat-tile { padding: 10px 9px; }
.stat-row.cols-4 .stat-val { font-size: 1.02em; }
.stat-row .track-empty { grid-column: 1 / -1; }

.profile-head {
  margin: 0 0 16px;
  background: var(--md-surface-container-low);
  overflow: hidden;
}
.profile-cover {
  position: relative;
  height: 104px;
  isolation: isolate;
  background: linear-gradient(120deg, var(--md-primary) 0%, var(--md-tertiary) 100%);
}
.profile-cover::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(90% 120% at 85% -10%, rgba(255, 255, 255, .32), transparent 58%),
    linear-gradient(0deg, rgba(0, 0, 0, .14), transparent 55%);
}
.profile-body { position: relative; padding: 0 18px 16px; }
.profile-avatar {
  position: relative;
  width: 78px;
  height: 78px;
  margin-top: -38px;
  padding: 4px;
  border-radius: 50%;
  background: var(--md-surface-container-low);
  z-index: 1;
}
.profile-avatar > span {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font-family: var(--font-display);
  font-size: 1.48em;
  font-weight: 700;
  letter-spacing: -.02em;
}
.profile-verified {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: 2px solid var(--md-surface-container-low);
}
.profile-verified .mi { font-size: 12px; }
.profile-verified .icn { width: 10px; height: 10px; stroke-width: 3; }
.profile-actions { position: absolute; top: -23px; right: 18px; display: flex; gap: 6px; z-index: 2; }
.profile-actions .btn { height: 34px; padding: 0 13px; font-size: .76em; }
.profile-name { margin: 10px 0 0; font-family: var(--font-display); font-size: 1.38em; font-weight: 700; letter-spacing: -.025em; line-height: 1.16; }
.profile-handle { margin-top: 2px; font-size: .78em; color: var(--md-primary); font-weight: 600; }
.profile-bio { margin: 8px 0 0; font-size: .82em; line-height: 1.45; color: var(--md-on-surface-variant); }
.profile-stats { display: flex; align-items: center; gap: 24px; margin-top: 13px; padding-top: 12px; border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 70%, transparent); }
.profile-stat { min-width: 0; }
.profile-stat b { display: block; font-family: var(--font-display); font-size: 1.02em; font-weight: 700; letter-spacing: -.02em; line-height: 1.1; }
.profile-stat span { display: block; margin-top: 1px; font-size: .68em; color: var(--md-on-surface-variant); }

.quick-sec { padding: 4px var(--pad-x) 16px; }
.quick-title { margin: 0 0 10px; font-family: var(--font-display); font-size: 1.04em; font-weight: 650; letter-spacing: -.01em; }
.quick-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.quick-grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.quick-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.quick-grid.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.quick-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 11px 5px 10px;
  border-radius: 14px;
  min-width: 0;
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 62%, transparent);
}
.quick-tile:hover { background: var(--md-surface-container); }
.quick-ico {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 12%, transparent);
}
.quick-ico .mi { font-size: 20px; }
.quick-ico .icn { width: 17px; height: 17px; }
.quick-tile > span:last-child {
  max-width: 100%;
  font-size: .69em;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quick-grid .track-empty { grid-column: 1 / -1; }

.settings-card {
  margin: 6px var(--pad-x) 16px;
  border-radius: calc(var(--md-radius) + 2px);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 72%, transparent);
  overflow: hidden;
}
.settings-title { padding: 13px 16px 7px; font-family: var(--font-display); font-size: 1.02em; font-weight: 650; letter-spacing: -.01em; }
.settings-row { display: flex; align-items: center; gap: 11px; padding: 10px 16px; }
.settings-row + .settings-row { border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 62%, transparent); }
.settings-ico {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 12%, transparent);
}
.settings-ico .mi { font-size: 20px; }
.settings-ico .icn { width: 17px; height: 17px; }
.settings-text { flex: 1; min-width: 0; }
.settings-name { font-size: .84em; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.settings-sub { margin-top: 1px; font-size: .7em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.settings-trail { display: flex; align-items: center; justify-content: flex-end; flex: 0 0 auto; margin-left: 2px; }
.settings-trail .switch { transform: scale(.84); transform-origin: right center; }
.settings-chev { color: var(--md-on-surface-variant); display: grid; place-items: center; }
.settings-chev .mi { font-size: 20px; }
.settings-chev .icn { width: 16px; height: 16px; }
.settings-badge {
  padding: 3px 8px;
  border-radius: 99px;
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-size: .66em;
  font-weight: 700;
  letter-spacing: .02em;
}

.empty-state {
  margin: 6px var(--pad-x) 16px;
  padding: 34px 26px 30px;
  border-radius: calc(var(--md-radius) + 4px);
  border: 1px dashed color-mix(in srgb, var(--md-outline) 52%, transparent);
  background: color-mix(in srgb, var(--md-surface-container-low) 70%, transparent);
  text-align: center;
}
.empty-art {
  width: 70px;
  height: 70px;
  margin: 0 auto 15px;
  border-radius: 21px;
  display: grid;
  place-items: center;
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 12%, transparent);
}
.empty-art .mi { font-size: 33px; }
.empty-art .icn { width: 30px; height: 30px; }
.empty-state h3 { margin: 0; font-family: var(--font-display); font-size: 1.16em; font-weight: 700; letter-spacing: -.015em; }
.empty-state p { margin: 6px auto 0; max-width: 30ch; font-size: .82em; line-height: 1.5; color: var(--md-on-surface-variant); }
.empty-action { margin-top: 13px; height: 38px; font-size: .82em; }

.notice-banner {
  --notice: var(--md-primary);
  margin: 6px var(--pad-x) 14px;
  padding: 11px 13px;
  border-radius: 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: color-mix(in srgb, var(--notice) 10%, var(--md-surface-container-low));
  border: 1px solid color-mix(in srgb, var(--notice) 24%, transparent);
}
.notice-banner.success { --notice: #16a34a; }
.notice-banner.warning { --notice: #d97706; }
.notice-banner.danger { --notice: #dc2626; }
.notice-ico {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--notice);
  background: color-mix(in srgb, var(--notice) 12%, transparent);
}
.notice-ico .mi { font-size: 19px; }
.notice-ico .icn { width: 16px; height: 16px; }
.notice-body { flex: 1; min-width: 0; }
.notice-title { font-size: .82em; font-weight: 650; }
.notice-text { margin-top: 2px; font-size: .73em; line-height: 1.4; color: var(--md-on-surface-variant); }
.notice-action { flex: 0 0 auto; align-self: center; padding: 4px 0; font-size: .72em; font-weight: 700; color: var(--notice); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .track-eq i { animation: none; }
  .dl-bar span { transition: none; }
  .mini-ring-fill { transition: none; }
  .ln-rail { scroll-behavior: auto; }
}

/* ============ editor-only ============ */
.app-screen.selecting .cmp { position: relative; }
.app-screen.selecting .cmp:hover { outline: 1px dashed rgba(106, 164, 255, .55); outline-offset: -1px; }
.app-screen .cmp.is-selected { outline: 2px solid #6aa4ff; outline-offset: -2px; }
.screen-empty {
  padding: 60px 30px;
  text-align: center;
  color: var(--md-on-surface-variant);
  font-size: .9em;
  line-height: 1.6;
}
.screen-empty strong { display: block; font-size: 1.1em; margin-bottom: 6px; color: var(--md-on-surface); }

/* ============ web + extension base ============ */
.web-page, .web-page *, .web-page *::before, .web-page *::after,
.ext-page, .ext-page *, .ext-page *::before, .ext-page *::after { box-sizing: border-box; }

.browser,
.ext-window {
  --w-bg: #ffffff;
  --w-soft: #f6f5fa;
  --w-card: #ffffff;
  --w-text: #14121a;
  --w-muted: #625e70;
  --w-line: rgba(20, 18, 26, .12);
  --w-accent: #5b5bd6;
  --w-on-accent: #ffffff;
  --w-accent-2: #ff8a5c;
  --w-radius: 18px;
}

.browser,
.ext-window {
  --md-surface: #fef7ff;
  --md-surface-container-lowest: #ffffff;
  --md-surface-container-low: #f7f2fa;
  --md-surface-container: #f3edf7;
  --md-surface-container-high: #ece6f0;
  --md-on-surface: #1d1b20;
  --md-on-surface-variant: #49454f;
  --md-outline: #79747e;
  --md-outline-variant: #cac4d0;
  --fs-base: 14px;
  --fw-base: 400;
  --ls-base: 0px;
  --md-radius: 16px;
  --pad-x: 16px;
  --icon-weight: 400;
  --icon-fill: 0;
  --icon-stroke: 1.8;
}

.web-page {
  width: 100%;
  min-height: 100%;
  background: var(--w-bg);
  color: var(--w-text);
  font-family: var(--font-ui);
  font-size: 15px;
  line-height: 1.55;
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.web-page button { font: inherit; color: inherit; border: 0; background: none; letter-spacing: inherit; }
.web-page a { color: inherit; text-decoration: none; }
.web-page h1, .web-page h2, .web-page h3, .web-page p { margin: 0; }

.web-wrap { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 44px; }
.web-kicker {
  font-size: 10.5px;
  letter-spacing: .19em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--w-accent);
}
.web-h1 {
  font-family: var(--font-display);
  font-size: 52px;
  line-height: 1.04;
  letter-spacing: -.035em;
  font-weight: 700;
}
.web-h2 {
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 1.12;
  letter-spacing: -.03em;
  font-weight: 700;
  margin: 6px 0 0;
}
.web-lead { font-size: 15.5px; color: var(--w-muted); max-width: 48ch; }
.web-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border-radius: 99px;
  background: var(--w-accent);
  color: var(--w-on-accent);
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -.01em;
  white-space: nowrap;
}
.web-btn .mi { font-size: 17px; }
.web-btn .icn { width: 16px; height: 16px; }
.web-btn.ghost {
  background: transparent;
  color: var(--w-text);
  border: 1px solid var(--w-line);
}
.web-btn.light { background: #fff; color: #15131c; }
.web-sec-head { max-width: 620px; margin-bottom: 34px; }
.web-sec-head p { margin-top: 10px; color: var(--w-muted); font-size: 14px; }

/* ---------- website nav ---------- */
.wnav { border-bottom: 1px solid var(--w-line); background: var(--w-bg); }
.wnav .web-wrap { height: 68px; display: flex; align-items: center; gap: 32px; }
.wnav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -.02em;
  flex: 0 0 auto;
}
.wnav-mark {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--w-accent);
  color: var(--w-on-accent);
  display: grid;
  place-items: center;
  transition: all .15s ease;
}
.wnav-mark.plain {
  background: transparent !important;
  color: var(--w-text);
  width: auto !important;
  height: auto !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
}
.wnav-mark.circle { border-radius: 50% !important; }
.wnav-mark.outlined { background: transparent !important; border: 1.5px solid currentColor !important; color: var(--w-text); }
.wnav-mark .mi { font-size: inherit; }
.wnav-mark .icn { width: 1em; height: 1em; }

.wnav-item { position: relative; display: flex; align-items: center; }
.wnav-links a, .wnav-dd-btn {
  font-size: var(--wnav-size, 13px);
  font-weight: var(--wnav-weight, 500);
  color: var(--w-muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  transition: color .15s ease;
}
.wnav-links a:hover, .wnav-dd-btn:hover, .wnav-links a.active { color: var(--w-text); }
.wnav-dd-arrow { font-size: 16px; transition: transform .15s ease; }
.wnav-item:hover .wnav-dd-arrow,
.wnav-item.is-open .wnav-dd-arrow { transform: rotate(180deg); }

.wnav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: -12px;
  min-width: 190px;
  background: var(--w-surface, #1e1b2e);
  border: 1px solid var(--w-line, rgba(255, 255, 255, .12));
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, .45);
  padding: 6px;
  display: none;
  flex-direction: column;
  gap: 2px;
  z-index: 110;
}
.wnav-item:hover .wnav-dropdown,
.wnav-item.is-open .wnav-dropdown {
  display: flex;
  animation: wnavFadeIn .15s ease;
}
@keyframes wnavFadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.wnav-dd-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: var(--wnav-weight, 500);
  color: var(--w-text);
  text-decoration: none;
  transition: background .12s, color .12s;
  cursor: pointer;
}
.wnav-dd-link:hover {
  background: rgba(255, 255, 255, .08);
  color: var(--w-accent, #a78bfa);
}
.wnav-dd-badge {
  font-size: 9.5px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(139, 108, 246, .2);
  color: var(--w-accent, #a78bfa);
  font-weight: 600;
}
.wnav-mark .mi { font-size: 17px; }
.wnav-mark .icn { width: 17px; height: 17px; }
.wnav-links { display: flex; align-items: center; gap: 26px; flex: 1; }
.wnav-links a { font-size: 13px; font-weight: 500; color: var(--w-muted); }
.wnav-links a:first-child { color: var(--w-text); }
.wnav-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: var(--w-muted);
  cursor: pointer;
}
.wnav-icon:hover { background: var(--w-soft); color: var(--w-text); }
.wnav-icon .mi { font-size: 21px; }
.wnav-icon .icn { width: 18px; height: 18px; }
.wnav-cta { height: 38px; padding: 0 16px; font-size: 12px; }

/* ---------- website hero ---------- */
.whero { padding: 74px 0 82px; overflow: hidden; }
.whero-grid { display: grid; grid-template-columns: 1.02fr .98fr; gap: 56px; align-items: center; }
.whero-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 17px; }
.whero-title { font-size: 54px; max-width: 12ch; }
.whero-actions { display: flex; gap: 10px; margin-top: 5px; flex-wrap: wrap; }
.whero-meta { display: flex; align-items: center; gap: 20px; margin-top: 7px; font-size: 11.5px; color: var(--w-muted); }
.whero-meta b { color: var(--w-text); font-weight: 700; }
.whero-art {
  position: relative;
  aspect-ratio: 1.05 / 1;
  border-radius: calc(var(--w-radius) + 10px);
  background: linear-gradient(140deg, var(--w-accent) 0%, var(--w-accent-2) 100%);
  overflow: hidden;
  isolation: isolate;
}
.whero-art::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(90% 80% at 82% 8%, rgba(255, 255, 255, .38), transparent 58%);
  z-index: -1;
}
.whero-art .hero-glyph {
  position: absolute;
  right: -34px;
  bottom: -46px;
  font-size: 236px;
  width: 236px;
  height: 236px;
  color: #fff;
  opacity: .16;
  z-index: -1;
}
.whero-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 13px;
  border-radius: 13px;
  background: rgba(255, 255, 255, .95);
  color: #16131c;
  font-size: 11.5px;
  font-weight: 600;
  box-shadow: 0 18px 40px rgba(0, 0, 0, .18);
  white-space: nowrap;
}
.whero-card .wc-ico {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(20, 18, 26, .07);
}
.whero-card .mi { font-size: 16px; }
.whero-card .icn { width: 14px; height: 14px; }
.whero-card.c1 { left: 22px; top: 26px; }
.whero-card.c2 { right: 20px; bottom: 26px; }
.whero.center { text-align: center; }
.whero.center .whero-grid { grid-template-columns: 1fr; }
.whero.center .whero-copy { align-items: center; }
.whero.center .whero-title { max-width: 18ch; }
.whero.center .whero-art { display: none; }
.whero.center .web-lead { margin: 0 auto; }

/* ---------- website logos ---------- */
.wlogos { border-top: 1px solid var(--w-line); border-bottom: 1px solid var(--w-line); padding: 22px 0; }
.wlogos .web-wrap { display: flex; align-items: center; gap: 34px; flex-wrap: wrap; }
.wlogos-label { font-size: 10px; letter-spacing: .17em; text-transform: uppercase; color: var(--w-muted); }
.wlogos-names {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -.01em;
  opacity: .72;
}

/* ---------- website features ---------- */
.wfeat { padding: 78px 0; }
.wfeat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.wfeat-card {
  border: 1px solid var(--w-line);
  border-radius: var(--w-radius);
  background: var(--w-card);
  padding: 24px;
}
.wfeat-ico {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--w-accent) 14%, transparent);
  color: var(--w-accent);
  display: grid;
  place-items: center;
  margin-bottom: 15px;
}
.wfeat-ico .mi { font-size: 21px; }
.wfeat-ico .icn { width: 19px; height: 19px; }
.wfeat-card h3 { margin: 0 0 6px; font-size: 15px; font-weight: 650; letter-spacing: -.01em; }
.wfeat-card p { color: var(--w-muted); font-size: 12.5px; line-height: 1.55; }

/* ---------- website products ---------- */
.wprod { padding: 76px 0; background: var(--w-soft); }
.wprod-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.wprod-card {
  border: 1px solid var(--w-line);
  border-radius: var(--w-radius);
  background: var(--w-card);
  overflow: hidden;
}
.wprod-thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, color-mix(in srgb, var(--w-accent) 16%, var(--w-card)), var(--w-soft));
}
.wprod-thumb > .mi { font-size: 52px; color: var(--w-accent); opacity: .82; }
.wprod-thumb > .icn { width: 48px; height: 48px; color: var(--w-accent); opacity: .82; }
.wprod-badge {
  position: absolute;
  top: 11px;
  left: 11px;
  padding: 3px 8px;
  border-radius: 99px;
  background: var(--w-accent);
  color: var(--w-on-accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.wprod-add {
  position: absolute;
  right: 11px;
  bottom: 11px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--w-bg);
  color: var(--w-text);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .14);
}
.wprod-add .mi { font-size: 17px; }
.wprod-add .icn { width: 15px; height: 15px; }
.wprod-info { padding: 13px 15px 16px; }
.wprod-name { font-size: 13.5px; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wprod-price { font-size: 13px; font-weight: 700; margin-top: 2px; color: var(--w-accent); }

/* ---------- website music ---------- */
.wplay { padding: 76px 0; }
.wplay-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.wplay-cover {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--w-radius);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 13px;
  color: #fff;
  isolation: isolate;
  background: linear-gradient(145deg, var(--w-accent) 0%, var(--w-accent-2) 100%);
}
.wplay-card:nth-child(2) .wplay-cover { background: linear-gradient(145deg, var(--w-accent-2) 0%, var(--w-accent) 100%); }
.wplay-card:nth-child(3) .wplay-cover { background: linear-gradient(145deg, color-mix(in srgb, var(--w-accent) 55%, #101018) 0%, var(--w-accent) 100%); }
.wplay-card:nth-child(4) .wplay-cover { background: linear-gradient(145deg, color-mix(in srgb, var(--w-accent-2) 55%, #101018) 0%, var(--w-accent-2) 100%); }
.wplay-cover::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(160deg, rgba(255, 255, 255, .22), transparent 46%, rgba(0, 0, 0, .38));
}
.wplay-cover .cover-glyph {
  position: absolute;
  right: -16px;
  top: -18px;
  font-size: 108px;
  width: 108px;
  height: 108px;
  opacity: .18;
  z-index: -1;
}
.wplay-cover .cover-count {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  opacity: .82;
}
.wplay-play {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #fff;
  color: #14121a;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(3px);
  transition: opacity .18s, transform .18s;
}
.wplay-card:hover .wplay-play { opacity: 1; transform: translateY(0); }
.wplay-play .mi { font-size: 18px; }
.wplay-play .icn { width: 16px; height: 16px; }
.wplay-title { font-size: 13.5px; font-weight: 650; margin-top: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wplay-sub { font-size: 11.5px; color: var(--w-muted); margin-top: 1px; }

/* ---------- website posters ---------- */
.wpost { padding: 76px 0; background: var(--w-soft); }
.wpost-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.wpost-art {
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: var(--w-radius);
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  isolation: isolate;
  background: linear-gradient(160deg, var(--w-accent) 0%, var(--w-accent-2) 100%);
}
.wpost-card:nth-child(2) .wpost-art { background: linear-gradient(160deg, var(--w-accent-2) 0%, var(--w-accent) 100%); }
.wpost-card:nth-child(3) .wpost-art { background: linear-gradient(160deg, color-mix(in srgb, var(--w-accent) 50%, #0d0d14) 0%, var(--w-accent-2) 100%); }
.wpost-card:nth-child(4) .wpost-art { background: linear-gradient(160deg, color-mix(in srgb, var(--w-accent-2) 50%, #0d0d14) 0%, var(--w-accent) 100%); }
.wpost-art::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(0, 0, 0, .04) 30%, rgba(0, 0, 0, .62));
}
.wpost-art .poster-glyph {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  font-size: 122px;
  width: 122px;
  height: 122px;
  opacity: .22;
  z-index: -1;
}
.wpost-rate {
  position: absolute;
  top: 11px;
  right: 11px;
  padding: 3px 8px;
  border-radius: 99px;
  background: rgba(0, 0, 0, .48);
  backdrop-filter: blur(6px);
  font-size: 10px;
  font-weight: 700;
}
.wpost-art h3 { margin: 0; font-family: var(--font-display); font-size: 19px; line-height: 1.1; letter-spacing: -.02em; }
.wpost-art p { margin: 3px 0 0; font-size: 10.5px; opacity: .72; }
.wpost-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--w-muted); }

/* ---------- website testimonial ---------- */
.wtest { padding: 78px 0; }
.wtest-inner { max-width: 760px; margin: 0 auto; text-align: center; }
.wtest-quote {
  font-family: var(--font-display);
  font-size: 29px;
  line-height: 1.36;
  letter-spacing: -.025em;
  font-weight: 600;
  margin: 16px 0 26px;
}
.wtest-mark { font-size: 40px; color: var(--w-accent); opacity: .5; }
.wtest-who { display: flex; align-items: center; justify-content: center; gap: 11px; }
.wtest-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--w-accent);
  color: var(--w-on-accent);
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
}
.wtest-name { font-size: 12.5px; font-weight: 650; text-align: left; }
.wtest-role { font-size: 10.5px; color: var(--w-muted); text-align: left; }

/* ---------- website pricing ---------- */
.wprice { padding: 78px 0; background: var(--w-soft); }
.wprice-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }
.wprice-card {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 24px;
  border: 1px solid var(--w-line);
  border-radius: var(--w-radius);
  background: var(--w-card);
}
.wprice-card.featured {
  border-color: var(--w-accent);
  box-shadow: 0 20px 48px color-mix(in srgb, var(--w-accent) 20%, transparent);
  transform: translateY(-6px);
}
.wprice-tag {
  align-self: flex-start;
  padding: 3px 8px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--w-accent) 14%, transparent);
  color: var(--w-accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.wprice-name { font-size: 13px; font-weight: 650; color: var(--w-muted); }
.wprice-amount { font-family: var(--font-display); font-size: 36px; font-weight: 700; letter-spacing: -.035em; line-height: 1; }
.wprice-amount span { font-family: var(--font-ui); font-size: 12px; font-weight: 500; letter-spacing: 0; color: var(--w-muted); }
.wprice-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--w-muted); }
.wprice-list li { display: flex; align-items: center; gap: 7px; }
.wprice-list .mi { font-size: 16px; color: var(--w-accent); }
.wprice-list .icn { width: 14px; height: 14px; color: var(--w-accent); }
.wprice-card .web-btn { margin-top: auto; width: 100%; }
.wprice-card .web-btn.ghost { border-color: var(--w-line); }

/* ---------- website cta ---------- */
.wcta { padding: 26px 0 82px; }
.wcta-inner {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 52px 46px;
  border-radius: calc(var(--w-radius) + 8px);
  background: linear-gradient(135deg, var(--w-accent), var(--w-accent-2));
  color: #fff;
}
.wcta-inner h2 { font-family: var(--font-display); font-size: 34px; line-height: 1.1; letter-spacing: -.03em; margin: 0 0 7px; }
.wcta-inner p { margin: 0; font-size: 13.5px; opacity: .82; max-width: 44ch; }
.wcta-actions { display: flex; gap: 10px; flex: 0 0 auto; }
.wcta-glyph { position: absolute; right: -30px; top: -40px; font-size: 180px; width: 180px; height: 180px; opacity: .12; }

/* ---------- website footer ---------- */
.wfoot { border-top: 1px solid var(--w-line); padding: 52px 0 26px; }
.wfoot-grid { display: grid; grid-template-columns: 1.5fr repeat(3, .62fr); gap: 30px; }
.wfoot-brand { display: flex; align-items: center; gap: 9px; font-family: var(--font-display); font-size: 17px; font-weight: 700; letter-spacing: -.02em; }
.wfoot-blurb { margin-top: 10px; font-size: 12px; line-height: 1.6; color: var(--w-muted); max-width: 30ch; }
.wfoot-col h4 { margin: 2px 0 11px; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--w-muted); }
.wfoot-col a { display: block; font-size: 12px; color: var(--w-text); opacity: .78; margin-bottom: 8px; }
.wfoot-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 34px;
  padding-top: 16px;
  border-top: 1px solid var(--w-line);
  font-size: 10.5px;
  color: var(--w-muted);
}
.wfoot-social { display: flex; gap: 12px; }
.wfoot-social .mi { font-size: 16px; }
.wfoot-social .icn { width: 14px; height: 14px; }

/* ============ browser + extension frames ============ */
.browser {
  width: 1280px;
  height: 820px;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--w-bg);
  color: var(--w-text);
  font-family: var(--font-ui);
  box-shadow: 0 34px 90px rgba(0, 0, 0, .55), 0 0 0 1px rgba(255, 255, 255, .07);
  flex: 0 0 auto;
}
.browser-bar {
  height: 42px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 13px;
  background: var(--w-soft);
  border-bottom: 1px solid var(--w-line);
}
.browser-dots { display: flex; gap: 6px; flex: 0 0 auto; }
.browser-dots span { width: 9px; height: 9px; border-radius: 50%; display: block; }
.browser-dots .r { background: #ff5f57; }
.browser-dots .y { background: #febc2e; }
.browser-dots .g { background: #28c840; }
.browser-url {
  flex: 1;
  max-width: 560px;
  margin: 0 auto;
  height: 26px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--w-text) 6%, transparent);
  color: var(--w-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: .01em;
}
.browser-url .mi { font-size: 13px; }
.browser-url .icn { width: 11px; height: 11px; }
.browser-act { width: 24px; height: 24px; display: grid; place-items: center; color: var(--w-muted); flex: 0 0 auto; }
.browser-act .mi { font-size: 18px; }
.browser-screen { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow: hidden; position: relative; }
.browser-screen > .screen-dock {
  width: 100%;
  flex: 0 0 auto;
  background: var(--w-card, var(--md-surface));
  border-top: 1px solid var(--w-line, var(--md-outline-variant));
  z-index: 20;
}
.browser-screen > .screen-dock .mini-player {
  margin: 8px 16px;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
}
.web-screen {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--w-bg);
  scrollbar-width: thin;
  scrollbar-color: rgba(128, 128, 140, .4) transparent;
}
.web-screen::-webkit-scrollbar { width: 8px; }
.web-screen::-webkit-scrollbar-thumb { background: rgba(128, 128, 140, .35); border-radius: 8px; }

.ext-window {
  width: 380px;
  height: 580px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 14px;
  background: var(--w-bg);
  color: var(--w-text);
  font-family: var(--font-ui);
  font-size: 13px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, .5), 0 0 0 1px rgba(255, 255, 255, .07);
  flex: 0 0 auto;
}
.ext-bar {
  height: 38px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  background: var(--w-soft);
  border-bottom: 1px solid var(--w-line);
}
.ext-bar .ext-pin {
  width: 21px;
  height: 21px;
  border-radius: 6px;
  background: var(--w-accent);
  color: var(--w-on-accent);
  display: grid;
  place-items: center;
}
.ext-bar .ext-pin .mi { font-size: 13px; }
.ext-bar .ext-pin .icn { width: 12px; height: 12px; }
.ext-bar-title { flex: 1; font-size: 11px; color: var(--w-muted); }
.ext-bar .ext-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--w-accent);
  color: var(--w-on-accent);
  display: grid;
  place-items: center;
  font-size: 7.5px;
  font-weight: 700;
}
.ext-screen { flex: 1 1 auto; min-height: 0; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(128, 128, 140, .4) transparent; }
.ext-screen::-webkit-scrollbar { width: 7px; }
.ext-screen::-webkit-scrollbar-thumb { background: rgba(128, 128, 140, .35); border-radius: 8px; }
.ext-page { min-height: 100%; display: flex; flex-direction: column; background: var(--w-bg); color: var(--w-text); font-family: var(--font-ui); }

/* ---------- extension blocks ---------- */
.ext-head { display: flex; align-items: center; gap: 10px; padding: 14px 15px 11px; }
.ext-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--w-accent);
  color: var(--w-on-accent);
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}
.ext-mark .mi { font-size: 19px; }
.ext-mark .icn { width: 17px; height: 17px; }
.ext-head-text { flex: 1; min-width: 0; }
.ext-head-title { font-size: 14px; font-weight: 650; line-height: 1.2; letter-spacing: -.01em; }
.ext-head-sub { font-size: 10px; color: var(--w-muted); margin-top: 2px; }
.ext-head-actions { display: flex; gap: 3px; }
.ext-icon-btn { width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; color: var(--w-muted); }
.ext-icon-btn:hover { background: var(--w-soft); color: var(--w-text); }
.ext-icon-btn .mi { font-size: 18px; }
.ext-icon-btn .icn { width: 15px; height: 15px; }

.ext-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  margin: 1px 15px 10px;
  padding: 0 10px;
  border: 1px solid var(--w-line);
  border-radius: 9px;
  background: var(--w-soft);
  color: var(--w-muted);
  font-size: 11.5px;
}
.ext-search .mi { font-size: 17px; }
.ext-search .icn { width: 14px; height: 14px; }
.ext-search .ext-kbd {
  margin-left: auto;
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid var(--w-line);
  background: var(--w-bg);
  color: var(--w-muted);
}

.ext-list { padding: 0 9px 8px; display: flex; flex-direction: column; gap: 1px; }
.ext-row { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 9px; }
.ext-row:hover { background: var(--w-soft); }
.ext-fav {
  width: 25px;
  height: 25px;
  border-radius: 7px;
  border: 1px solid var(--w-line);
  background: var(--w-soft);
  color: var(--w-accent);
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  flex: 0 0 auto;
}
.ext-row-main { flex: 1; min-width: 0; }
.ext-row-title { font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ext-row-sub { font-size: 9.5px; color: var(--w-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ext-row .ext-x { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; color: var(--w-muted); opacity: 0; }
.ext-row:hover .ext-x { opacity: 1; }
.ext-row .ext-x .mi { font-size: 14px; }
.ext-row .ext-x .icn { width: 11px; height: 11px; }

.ext-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 4px 11px 12px; }
.ext-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 9px 3px 8px;
  border: 1px solid transparent;
  border-radius: 10px;
}
.ext-action:hover { background: var(--w-soft); border-color: var(--w-line); }
.ext-action .ext-ico {
  width: 31px;
  height: 31px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--w-accent) 13%, transparent);
  color: var(--w-accent);
  display: grid;
  place-items: center;
}
.ext-action .ext-ico .mi { font-size: 18px; }
.ext-action .ext-ico .icn { width: 15px; height: 15px; }
.ext-action > span { font-size: 9px; color: var(--w-muted); text-align: center; line-height: 1.2; }

.ext-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; padding: 4px 15px 13px; }
.ext-stat { padding: 9px 10px; border: 1px solid var(--w-line); border-radius: 9px; background: var(--w-soft); }
.ext-stat b { display: block; font-size: 15px; line-height: 1.1; letter-spacing: -.02em; }
.ext-stat span { font-size: 9px; color: var(--w-muted); }

.ext-timer { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 12px 15px 16px; }
.ext-ring {
  position: relative;
  width: 146px;
  height: 146px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--w-accent) var(--pct, 62%), color-mix(in srgb, var(--w-accent) 13%, transparent) 0);
}
.ext-ring::after { content: ""; position: absolute; inset: 9px; border-radius: 50%; background: var(--w-bg); }
.ext-ring-inner { position: relative; z-index: 1; text-align: center; }
.ext-time { font-family: var(--font-display); font-size: 34px; font-weight: 700; letter-spacing: -.035em; font-variant-numeric: tabular-nums; line-height: 1; }
.ext-ring-inner small { display: block; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--w-muted); margin-top: 5px; }
.ext-timer-acts { display: flex; gap: 8px; }
.ext-timer-acts .web-btn { height: 35px; padding: 0 16px; font-size: 11.5px; }

.ext-notes { display: flex; flex-direction: column; gap: 6px; padding: 0 11px 10px; }
.ext-note {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 10px;
  border: 1px solid var(--w-line);
  border-radius: 9px;
  background: var(--w-card);
}
.ext-check {
  width: 15px;
  height: 15px;
  border-radius: 5px;
  border: 1.5px solid var(--w-line);
  display: grid;
  place-items: center;
  color: transparent;
  flex: 0 0 auto;
  margin-top: 1px;
}
.ext-check .mi { font-size: 11px; }
.ext-check .icn { width: 9px; height: 9px; }
.ext-note.done .ext-check { background: var(--w-accent); border-color: var(--w-accent); color: var(--w-on-accent); }
.ext-note.done .ext-note-text { text-decoration: line-through; color: var(--w-muted); }
.ext-note-text { font-size: 11.5px; line-height: 1.4; }

.ext-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 15px;
  border-top: 1px solid var(--w-line);
  background: var(--w-soft);
  font-size: 10px;
  color: var(--w-muted);
}
.ext-foot .ext-link { margin-left: auto; color: var(--w-accent); font-weight: 650; }

.ext-page .cmp { flex: 0 0 auto; }
.ext-page > .cmp-extfooter { margin-top: auto; }

/* ============ web / extension editor-only ============ */
.web-screen.selecting .cmp,
.ext-screen.selecting .cmp { position: relative; }
.web-screen.selecting .cmp:hover,
.ext-screen.selecting .cmp:hover { outline: 1px dashed rgba(106, 164, 255, .55); outline-offset: -1px; }
.web-screen .cmp.is-selected,
.ext-screen .cmp.is-selected { outline: 2px solid #6aa4ff; outline-offset: -2px; }

/* ============ typography ============ */
.cmp[data-typo] {
  font-family: var(--typo-family, inherit);
  font-size: var(--typo-size, inherit);
  font-weight: var(--typo-weight, inherit);
  color: var(--typo-color, inherit);
  text-align: var(--typo-align, inherit);
  line-height: var(--typo-line-height, inherit);
  letter-spacing: var(--typo-letter-spacing, inherit);
}
.cmp[data-typo] :not(.mi):not(.icn):not(.ph-ico) {
  font-family: var(--typo-family, inherit);
  font-weight: var(--typo-weight, inherit);
  color: var(--typo-color, inherit);
  text-align: var(--typo-align, inherit);
  line-height: var(--typo-line-height, inherit);
  letter-spacing: var(--typo-letter-spacing, inherit);
}

/* ============ preview overlays (drawer, menu, search) ============ */
.phone, .browser, .ext-window, .web-page { position: relative; }

.ui-drawer button,
.ui-menu button,
.ui-search button { font: inherit; color: inherit; border: 0; background: none; letter-spacing: inherit; }

.ui-scrim {
  position: absolute;
  top: var(--ui-top, 0);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  background: rgba(8, 6, 14, .52);
  opacity: 0;
  pointer-events: none;
  transition: opacity .22s ease;
}
.ui-scrim.open { opacity: 1; pointer-events: auto; }

.ui-drawer {
  position: absolute;
  top: var(--ui-top, 0);
  bottom: 0;
  left: 0;
  z-index: 41;
  width: min(var(--ui-drawer-w, 84%), 380px);
  display: flex;
  flex-direction: column;
  background: var(--md-surface-container-low, var(--w-card, #ffffff));
  color: var(--md-on-surface, var(--w-text, #1d1b20));
  box-shadow: 0 20px 60px rgba(0, 0, 0, .38);
  border-radius: 0 22px 22px 0;
  transform: translateX(-104%);
  transition: transform .28s cubic-bezier(.2, .8, .2, 1), background .2s ease;
  overflow-y: auto;
  scrollbar-width: none;
}
.ui-drawer::-webkit-scrollbar { width: 0; }
.ui-drawer.open { transform: translateX(0); }
.ui-drawer[data-appearance="tinted"] {
  background: color-mix(in srgb, var(--md-primary, var(--w-accent, #6750a4)) 14%,
    var(--md-surface-container-low, var(--w-card, #ffffff)));
}
.ui-drawer[data-appearance="glass"] {
  background: color-mix(in srgb, var(--md-surface-container-low, var(--w-card, #ffffff)) 76%, transparent);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  backdrop-filter: blur(20px) saturate(150%);
}

.ui-drawer-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 16px 16px 18px;
}
.ui-drawer-top { display: flex; justify-content: flex-end; padding: 14px 12px 0; }
.ui-drawer-close.has-label {
  width: auto;
  min-width: 36px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px 0 8px;
  border-radius: 99px;
}
.ui-drawer-close.has-label .mi { font-size: 19px; }
.ui-close-label { font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.ui-drawer[data-close-shape="square"] .ui-drawer-close {
  border-radius: 10px;
}
.ui-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  background: var(--md-primary, var(--w-accent, #6750a4));
  color: var(--md-on-primary, var(--w-on-accent, #ffffff));
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .02em;
}
.ui-drawer-id { flex: 1; min-width: 0; }
.ui-drawer-id strong { display: block; font-size: 16px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-drawer-id small { display: block; margin-top: 2px; font-size: 11.5px; opacity: .62; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background .16s ease;
}
.ui-icon-btn:hover { background: color-mix(in srgb, currentColor 9%, transparent); }
.ui-icon-btn .mi { font-size: 22px; }
.ui-icon-btn .icn { width: 20px; height: 20px; }

.ui-drawer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--ui-nav-gap, 2px);
  padding: 4px 10px 20px;
}
.ui-drawer.no-head .ui-drawer-nav { padding-top: 14px; }
.ui-drawer-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: var(--ui-item-pad, 12px 14px);
  border-radius: var(--ui-item-radius, 99px);
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background .16s ease;
}
.ui-drawer-item:hover { background: color-mix(in srgb, currentColor 7%, transparent); }
.ui-drawer-item.active {
  background: color-mix(in srgb, var(--md-primary, var(--w-accent, #6750a4)) 15%, transparent);
  color: var(--md-primary, var(--w-accent, #6750a4));
  font-weight: 650;
}
.ui-ico { width: 24px; height: 24px; flex: 0 0 auto; display: grid; place-items: center; }
.ui-ico .mi { font-size: 22px; }
.ui-ico .icn { width: 19px; height: 19px; }
.ui-item-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-menu {
  position: absolute;
  top: 60px;
  right: 10px;
  z-index: 42;
  min-width: 186px;
  max-width: 78%;
  padding: 6px;
  border-radius: 14px;
  background: var(--md-surface-container, var(--w-card, #ffffff));
  color: var(--md-on-surface, var(--w-text, #1d1b20));
  box-shadow: 0 16px 40px rgba(0, 0, 0, .34), 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px) scale(.97);
  transform-origin: top right;
  transition: opacity .16s ease, transform .16s ease;
}
.ui-menu.open { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
.ui-menu-item {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 9px;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
}
.ui-menu-item:hover { background: color-mix(in srgb, currentColor 8%, transparent); }

.ui-search {
  position: absolute;
  top: var(--ui-top, 0);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 43;
  display: flex;
  flex-direction: column;
  background: var(--md-surface, var(--w-bg, #ffffff));
  color: var(--md-on-surface, var(--w-text, #1d1b20));
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
  transition: opacity .2s ease, transform .2s ease;
}
.ui-search[data-reaction="fade"] { transform: none; }
.ui-search[data-reaction="zoom"] { transform: scale(.96); }
.ui-search.open { opacity: 1; pointer-events: auto; transform: none; }
.ui-search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 10px;
  border-bottom: 1px solid var(--md-outline-variant, var(--w-line, rgba(0, 0, 0, .12)));
  flex: 0 0 auto;
}
.ui-search-input {
  flex: 1;
  min-width: 0;
  height: 42px;
  border: 0;
  outline: 0;
  border-radius: var(--ui-search-radius, 21px);
  padding: 0 16px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  color: inherit;
  font-size: 14px;
}
.ui-search-input::placeholder { color: currentColor; opacity: .5; }
.ui-search-input:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--md-primary, var(--w-accent, #6750a4)) 55%, transparent);
  background: color-mix(in srgb, currentColor 9%, transparent);
}
.ui-search-guide[hidden] { display: none; }
.ui-search-guide {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 12px 14px 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--md-primary, var(--w-accent, #6750a4)) 11%, transparent);
  color: var(--md-on-surface, var(--w-text, #1d1b20));
  font-size: 12px;
  line-height: 1.4;
  flex: 0 0 auto;
}
.ui-search-guide .mi {
  font-size: 17px;
  flex: 0 0 auto;
  color: var(--md-primary, var(--w-accent, #6750a4));
}
.ui-search-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 14px 2px;
  flex: 0 0 auto;
}
.ui-chips-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  opacity: .45;
  margin-right: 2px;
}
.ui-chip {
  padding: 6px 12px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background .16s ease;
}
.ui-chip:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
.ui-chip.active {
  background: color-mix(in srgb, var(--md-primary, var(--w-accent, #6750a4)) 22%, transparent);
  color: var(--md-primary, var(--w-accent, #6750a4));
}
.ui-search-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 14px 14px 24px; }
.ui-search-label { font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .5; margin: 8px 4px 10px; }
.ui-search-empty { margin: 0 4px; font-size: 12.5px; opacity: .62; }
.ui-recent { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.ui-recent-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  font-size: 12px;
  cursor: pointer;
}
.ui-recent-pill:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
.ui-recent-pill .mi { font-size: 15px; opacity: .7; }
.ui-search-results { display: block; }
.ui-result {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 8px;
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  transition: background .16s ease;
}
.ui-result:hover { background: color-mix(in srgb, currentColor 7%, transparent); }
.ui-result-text { flex: 1; min-width: 0; }
.ui-result-text strong { display: block; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-result-text small { display: block; font-size: 10.5px; opacity: .55; }
.ui-result > .mi { font-size: 18px; opacity: .42; }
.ui-empty { padding: 14px; font-size: 12px; opacity: .55; }

/* Compact result rows: tighter spacing, smaller icons, no subtitle. */
.ui-search[data-results="compact"] .ui-result { padding: 6px 8px; gap: 8px; border-radius: 8px; }
.ui-search[data-results="compact"] .ui-result .ui-ico { width: 20px; height: 20px; }
.ui-search[data-results="compact"] .ui-result .ui-ico .mi { font-size: 18px; }
.ui-search[data-results="compact"] .ui-result-text small { display: none; }

/* Card results: two-up tiles with a tinted surface. */
.ui-search[data-results="cards"] .ui-search-results {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.ui-search[data-results="cards"] .ui-result {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 6%, transparent);
}
.ui-search[data-results="cards"] .ui-result > .mi { display: none; }
.ui-search[data-results="cards"] .ui-result .ui-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--md-primary, var(--w-accent, #6750a4)) 16%, transparent);
  color: var(--md-primary, var(--w-accent, #6750a4));
}
.ui-search[data-results="cards"] .ui-result-text { width: 100%; }

@media (prefers-reduced-motion: reduce) {
  .ui-scrim, .ui-drawer, .ui-menu, .ui-search, .ui-icon-btn, .ui-result, .ui-chip { transition: none !important; }
  .ui-search[data-reaction="zoom"] { transform: none; }
}

/* ============ pinned dock + multi-screen ============ */
.screen-dock {
  flex: 0 0 auto;
  position: relative;
  z-index: 6;
  background: var(--md-surface);
  padding-top: 2px;
}
.screen-dock .cmp { position: relative; }
.screen-dock .mini-player { margin: 6px var(--pad-x) 8px; }
.screen-dock .nav-bar { border-top: 1px solid var(--md-outline-variant); }
.screen-dock .cmp-miniplayer + .cmp-bottomnav .nav-bar { border-top-color: transparent; }

/* ---------- bottom-navigation design styles ---------- */
/* Floating capsule: detached from the edges with a soft shadow. */
.nav-bar.nav-floating {
  margin: 6px 12px 10px;
  padding: 8px 6px;
  border: 0;
  border-radius: 24px;
  background: var(--md-surface-container-high);
  box-shadow: 0 12px 26px rgba(0, 0, 0, .18), 0 2px 6px rgba(0, 0, 0, .08);
}
.nav-bar.nav-floating .nav-item.active .nav-icon {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}
.screen-dock .nav-bar.nav-floating { border-top: 0; }

/* Compact: icon-led bar with a dot under the active tab. */
.nav-bar.nav-compact { padding: 7px 6px 6px; }
.nav-bar.nav-compact .nav-item { position: relative; padding-bottom: 9px; }
.nav-bar.nav-compact .nav-item > span:last-child { display: none; }
.nav-bar.nav-compact .nav-item .nav-icon { width: 48px; height: 34px; }
.nav-bar.nav-compact .nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--md-primary);
}

/* Minimal: flat and borderless with a short underline on the active tab. */
.nav-bar.nav-minimal {
  padding: 8px 6px 10px;
  background: transparent;
  border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
}
.nav-bar.nav-minimal .nav-item { position: relative; }
.nav-bar.nav-minimal .nav-item .nav-icon { width: auto; height: 30px; background: transparent; }
.nav-bar.nav-minimal .nav-item.active { color: var(--md-primary); }
.nav-bar.nav-minimal .nav-item.active .nav-icon { background: transparent; color: var(--md-primary); }
.nav-bar.nav-minimal .nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 30%;
  right: 30%;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
}

/* Frosted glass: translucent bar that blurs the content behind it. */
.nav-bar.nav-glass {
  background: color-mix(in srgb, var(--md-surface-container) 72%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
}
.nav-bar.nav-glass .nav-item.active .nav-icon {
  background: color-mix(in srgb, var(--md-primary) 22%, transparent);
  color: var(--md-primary);
}
.screen-dock .nav-bar.nav-glass { border-top-color: transparent; }

/* Exported screens live in one scroll stage; only the active page shows. */
.app-screen.export-stage { display: flex; overflow: hidden; padding-bottom: 0; }
.export-stage > .screen-page { display: none; width: 100%; flex: 1 1 auto; min-height: 0; flex-direction: column; }
.export-stage > .screen-page.active { display: flex; }
.screen-page .screen-flow {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 6px;
  scrollbar-width: none;
}
.screen-page .screen-flow::-webkit-scrollbar { width: 0; height: 0; }

/* ============ content header ============ */
.content-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px var(--pad-x) 10px;
}
.ch-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}
.ch-mark .mi { font-size: 23px; }
.ch-mark .icn { width: 20px; height: 20px; }
.ch-text { flex: 1; min-width: 0; }
.ch-kicker {
  display: block;
  font-size: .66em;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--md-primary);
}
.ch-title { font-family: var(--font-display); font-size: 1.24em; font-weight: 700; line-height: 1.16; }
.ch-sub { margin-top: 2px; font-size: .76em; color: var(--md-on-surface-variant); }
.ch-actions { display: flex; align-items: center; gap: 2px; flex: 0 0 auto; }
.ch-act {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--md-on-surface-variant);
}
.ch-act:hover { background: color-mix(in srgb, currentColor 8%, transparent); }
.ch-act .mi { font-size: 21px; }
.ch-act .icn { width: 18px; height: 18px; }

/* ============ folder grid ============ */
.folder-block { margin: 14px var(--pad-x); }
.folder-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 9px; }
.folder-title { font-family: var(--font-display); font-size: 1.02em; font-weight: 700; }
.folder-add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px 5px 7px;
  border-radius: 99px;
  font-size: .72em;
  font-weight: 650;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}
.folder-add .mi { font-size: 17px; }
.folder-add .icn { width: 15px; height: 15px; }
.folder-grid { display: grid; grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr)); gap: 10px; }
.folder-card {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  padding: 12px;
  border-radius: 14px;
  text-align: left;
  background: var(--md-surface-container-low);
  border: 1px solid transparent;
  cursor: pointer;
}
.folder-card:hover { border-color: var(--md-outline-variant); }
.folder-ico {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}
.folder-ico .mi { font-size: 20px; }
.folder-ico .icn { width: 17px; height: 17px; }
.folder-info { flex: 1; min-width: 0; }
.folder-info strong { display: block; font-size: .82em; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.folder-info small { display: block; font-size: .68em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.folder-go { font-size: 17px; opacity: .4; flex: 0 0 auto; }
.folder-empty { grid-column: 1 / -1; padding: 20px; text-align: center; font-size: .8em; color: var(--md-on-surface-variant); }

/* ============ search page block ============ */
.search-page { padding-bottom: 16px; }
.sp-head { display: flex; align-items: center; gap: 4px; padding: 13px var(--pad-x) 7px; }
.sp-back, .sp-act {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--md-on-surface);
}
.sp-back:hover, .sp-act:hover { background: color-mix(in srgb, currentColor 8%, transparent); }
.sp-back .mi, .sp-act .mi { font-size: 22px; }
.sp-title { flex: 1; min-width: 0; font-family: var(--font-display); font-size: 1.12em; font-weight: 700; }
.sp-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px var(--pad-x);
  padding: 10px 13px;
  border-radius: 99px;
  background: var(--md-surface-container-high);
}
.sp-bar > .mi { opacity: .6; font-size: 20px; }
.sp-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: inherit;
}
.sp-input::placeholder { color: var(--md-on-surface-variant); }
.sp-clear { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; color: var(--md-on-surface-variant); }
.sp-clear .mi { font-size: 17px; }
.sp-chips { display: flex; gap: 8px; padding: 12px var(--pad-x) 4px; overflow-x: auto; scrollbar-width: none; }
.sp-chips::-webkit-scrollbar { display: none; }
.sp-chip {
  flex: 0 0 auto;
  padding: 7px 14px;
  border-radius: 99px;
  font-size: .74em;
  font-weight: 650;
  white-space: nowrap;
  background: var(--md-surface-container);
  color: var(--md-on-surface-variant);
}
.sp-chip.active { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.sp-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 12px var(--pad-x);
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font-size: .74em;
  line-height: 1.42;
}
.sp-hint .mi { flex: 0 0 auto; font-size: 16px; }
.sp-results { padding: 4px var(--pad-x); }
.sp-result { display: flex; align-items: center; gap: 11px; width: 100%; padding: 10px 8px; border-radius: 12px; text-align: left; cursor: pointer; }
.sp-result:hover { background: color-mix(in srgb, currentColor 6%, transparent); }
.sp-ico {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  background: var(--md-surface-container);
  color: var(--md-on-surface-variant);
}
.sp-ico .mi { font-size: 20px; }
.sp-result-text { flex: 1; min-width: 0; }
.sp-result-text strong { display: block; font-size: .85em; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-result-text small { display: block; font-size: .69em; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-result > .mi { font-size: 18px; opacity: .4; }
.sp-empty { padding: 24px; text-align: center; font-size: .8em; color: var(--md-on-surface-variant); }

/* ============ richer search overlay ============ */
.ui-drawer.no-head .ui-drawer-nav { padding-top: 18px; }
.ui-search-chips { display: flex; gap: 8px; padding: 12px 16px 2px; overflow-x: auto; scrollbar-width: none; }
.ui-search-chips::-webkit-scrollbar { display: none; }
.ui-chip {
  flex: 0 0 auto;
  padding: 6px 13px;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  background: color-mix(in srgb, currentColor 8%, transparent);
  cursor: pointer;
}
.ui-chip:hover, .ui-chip.active { background: color-mix(in srgb, currentColor 16%, transparent); }

@media (prefers-reduced-motion: reduce) {
  .screen-dock, .folder-card, .sp-chip { transition: none !important; }
  .screen-page .screen-flow { scroll-behavior: auto; }
}

/* ============ exported file ============ */
.export-body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111116;
  font-family: Inter, system-ui, sans-serif;
}
.export-phone {
  width: min(var(--export-w, 390px), 100vw);
  height: min(var(--export-h, 844px), 100vh);
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}
.export-phone .phone-screen { border-radius: 0; }
.export-body .camera-hole { display: none; }
.export-body.export-web {
  display: block;
  background: var(--w-bg);
}
.export-web .web-page { min-height: 100vh; }
.export-body.export-ext { background: #0e0f14; }
.export-ext .ext-window {
  width: min(380px, 100vw);
  height: min(580px, 100vh);
  border-radius: 12px;
}
@media (min-width: 520px) {
  .export-phone { border-radius: 46px; padding: 10px; box-shadow: 0 30px 70px rgba(0,0,0,.55), inset 0 0 0 2px #29292f; }
  .export-phone .phone-screen { border-radius: 37px; }
}

/* ---------- Enhanced Mini Player Layouts ---------- */
.mini-player.mini-floating {
  margin: 6px 12px 10px;
  border-radius: 26px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.08);
}
.mini-player.mini-glass {
  background: color-mix(in srgb, var(--md-surface-container-high) 75%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.mini-player {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.mini-player:hover {
  transform: translateY(-1px);
}

/* ---------- Enhanced Full-Screen Music Player Styles ---------- */
.music-player .mp-route-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: .68em;
  font-weight: 600;
  color: var(--md-primary);
  margin-bottom: 12px;
  letter-spacing: .03em;
  text-transform: uppercase;
}
.music-player .mp-route-strip .mi { font-size: 15px; }

/* Vinyl Turntable Style */
.mp-vinyl-wrapper {
  position: relative;
  width: min(100%, 250px);
  aspect-ratio: 1 / 1;
  margin: 0 auto 18px;
}
.mp-tonearm {
  position: absolute;
  top: -4px;
  right: 14px;
  width: 28px;
  height: 64px;
  border-right: 3px solid #ccc;
  border-top: 3px solid #ccc;
  border-top-right-radius: 12px;
  z-index: 5;
  pointer-events: none;
  transform: rotate(-10deg);
  transform-origin: top right;
  transition: transform 0.5s cubic-bezier(0.3, 1.2, 0.4, 1);
}
.mp-tonearm-head {
  position: absolute;
  bottom: -6px;
  right: -5px;
  width: 8px;
  height: 16px;
  background: var(--md-primary);
  border-radius: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.mp-vinyl-disc {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, #252528 0%, #151517 40%, #0d0d0f 70%, #050507 100%);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), inset 0 0 0 2px rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  overflow: hidden;
}
.mp-vinyl-grooves {
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 0 0 12px rgba(255, 255, 255, 0.03), inset 0 0 0 26px rgba(255, 255, 255, 0.02), inset 0 0 0 42px rgba(255, 255, 255, 0.015);
  pointer-events: none;
}
.mp-vinyl-disc.spinning {
  animation: mp-vinyl-spin 18s linear infinite;
}
@keyframes mp-vinyl-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.mp-vinyl-center {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--md-primary), var(--md-tertiary));
  box-shadow: 0 0 0 5px #0a0a0c, 0 0 0 7px rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
  color: #fff;
  overflow: hidden;
}
.mp-vinyl-img { width: 100%; height: 100%; object-fit: cover; }
.mp-vinyl-icon { font-size: 38px; }

/* Waveform & Lyrics Style */
.mp-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 48px;
  margin: 10px 0 14px;
}
.mp-wave-bar {
  width: 4px;
  border-radius: 99px;
  background: var(--md-primary);
  animation: mp-wave-pulse 1.2s ease-in-out infinite alternate;
}
@keyframes mp-wave-pulse {
  0% { transform: scaleY(0.25); }
  100% { transform: scaleY(1.0); }
}
.mp-lyrics-box {
  margin: 10px 0 14px;
  padding: 14px 16px;
  border-radius: calc(var(--md-radius) + 2px);
  background: color-mix(in srgb, var(--md-primary) 8%, var(--md-surface-container-high));
  border: 1px solid color-mix(in srgb, var(--md-primary) 18%, transparent);
  text-align: center;
}
.mp-lyric-line {
  margin: 4px 0;
  font-size: 0.85em;
  line-height: 1.5;
  opacity: 0.5;
}
.mp-lyric-line.active {
  font-size: 1.02em;
  font-weight: 700;
  color: var(--md-primary);
  opacity: 1;
}

/* Immersive Gradient & Minimal */
.music-player.mp-gradient {
  background: radial-gradient(circle at 50% 10%, color-mix(in srgb, var(--md-primary) 30%, var(--md-surface-container-low)), var(--md-surface-container-low) 72%);
  border-color: color-mix(in srgb, var(--md-primary) 28%, var(--md-outline-variant));
}
.music-player.mp-minimal {
  background: var(--md-surface-container-lowest);
  border: 1px solid var(--md-outline-variant);
  box-shadow: none;
}

/* Phone-screen Full-Screen Player Modal */
.ui-player-modal {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: var(--md-surface);
  color: var(--md-on-surface);
  display: flex;
  flex-direction: column;
  transform: translateY(105%);
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 16px 28px;
  box-sizing: border-box;
}
.ui-player-modal.open {
  transform: translateY(0);
}
.ui-pm-handle-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.ui-pm-close, .ui-pm-inspect {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--md-on-surface-variant);
  border: 0;
  cursor: pointer;
}
.ui-pm-close:hover, .ui-pm-inspect:hover {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
  color: var(--md-on-surface);
}
.ui-pm-close .mi, .ui-pm-inspect .mi { font-size: 24px; }
.ui-pm-route {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: .78em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}
.ui-pm-route .mi { font-size: 16px; color: var(--md-primary); }

/* ---------- Material 3 Page Motion Transitions ---------- */
.app-screen {
  position: relative;
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.app-screen.nav-trans-exit.trans-slide {
  opacity: 0;
  transform: translateX(-35px);
}
.app-screen.nav-trans-enter.trans-slide {
  animation: m3-slide-in-right 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes m3-slide-in-right {
  from { opacity: 0; transform: translateX(35px); }
  to { opacity: 1; transform: translateX(0); }
}

.app-screen.nav-trans-exit.trans-fade {
  opacity: 0;
}
.app-screen.nav-trans-enter.trans-fade {
  animation: m3-fade-in 0.22s ease forwards;
}
@keyframes m3-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.app-screen.nav-trans-exit.trans-zoom {
  opacity: 0;
  transform: scale(0.95);
}
.app-screen.nav-trans-enter.trans-zoom {
  animation: m3-zoom-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes m3-zoom-in {
  from { opacity: 0; transform: scale(1.05); }
  to { opacity: 1; transform: scale(1); }
}

.app-screen.nav-trans-exit.trans-sheet {
  opacity: 0;
  transform: translateY(-20px);
}
.app-screen.nav-trans-enter.trans-sheet {
  animation: m3-sheet-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes m3-sheet-up {
  from { opacity: 0; transform: translateY(45px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Material 3 Tap Ripple Effect */
.m3-ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background: color-mix(in srgb, var(--md-primary) 32%, transparent);
  pointer-events: none;
  animation: m3-ripple-anim 0.4s ease-out forwards;
  z-index: 99;
}
@keyframes m3-ripple-anim {
  to {
    transform: scale(3.5);
    opacity: 0;
  }
}

/* Interactive Navigation Prompt Modal */
.ui-nav-prompt {
  position: absolute;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  padding: 12px;
  box-sizing: border-box;
}
.ui-nav-prompt.open {
  opacity: 1;
  pointer-events: auto;
}
.unp-card {
  width: 100%;
  background: var(--md-surface);
  border: 1px solid var(--md-outline-variant);
  border-radius: 24px;
  padding: 16px 18px 20px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  transform: translateY(20px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--md-on-surface);
}
.ui-nav-prompt.open .unp-card {
  transform: translateY(0);
}
.unp-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.unp-ico {
  font-size: 26px;
  color: var(--md-primary);
}
.unp-title-wrap strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
}
.unp-title-wrap small {
  display: block;
  font-size: 11px;
  color: var(--md-on-surface-variant);
}
.unp-close {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}
.unp-close:hover {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}
.unp-body p {
  font-size: 12px;
  line-height: 1.45;
  color: var(--md-on-surface-variant);
  margin: 0 0 14px;
}
.unp-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.unp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 0;
}
.unp-btn-create {
  background: var(--md-primary);
  color: var(--md-on-primary);
}
.unp-btn-blank {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  border: 1px solid var(--md-outline-variant);
}
.unp-links {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid color-mix(in srgb, var(--md-outline-variant) 60%, transparent);
}
.unp-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--md-on-surface-variant);
  margin-bottom: 6px;
}
.unp-pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.unp-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--md-surface-container);
  color: var(--md-on-surface);
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--md-outline-variant);
  cursor: pointer;
}
.unp-pill.is-active {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border-color: var(--md-primary);
}
.unp-pill:hover {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}



/* ========================================================
   MODERN COMPONENT EXPANSION STYLES (+100 LIBRARIES)
   ======================================================== */

/* ---------- Tabs Component Upgrades ---------- */
.tabs-row .tab {
  flex: 1;
  text-align: center;
  padding: 13px 6px 11px;
  font-size: .88em;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  position: relative;
  letter-spacing: .01em;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color .15s ease, background .15s ease;
}
.tabs-row.style-pill {
  padding: 6px 8px;
  gap: 6px;
  border-bottom: 0;
}
.tabs-row.style-pill .tab {
  border-radius: 99px;
  padding: 7px 14px;
}
.tabs-row.style-pill .tab.active {
  background: var(--md-primary-container, rgba(139, 108, 246, .2));
  color: var(--md-on-primary-container, var(--md-primary));
}
.tabs-row.style-pill .tab.active::after { display: none; }

.tabs-row.style-bubble {
  padding: 6px 8px;
  gap: 8px;
  background: transparent;
  border-bottom: 0;
}
.tabs-row.style-bubble .tab {
  border-radius: 12px;
  padding: 8px 14px;
  background: var(--md-surface-container, rgba(255, 255, 255, .05));
}
.tabs-row.style-bubble .tab.active {
  background: var(--md-primary);
  color: var(--md-on-primary, #fff);
}
.tabs-row.style-bubble .tab.active::after { display: none; }

/* ---------- Website Bento Grid ---------- */
.wbento { padding: 60px 0; }
.wbento-head { text-align: center; margin-bottom: 36px; }
.wbento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.wb-card {
  background: var(--w-surface, #171523);
  border: 1px solid var(--w-line, rgba(255, 255, 255, .1));
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}
.wb-card.wb-lg { grid-column: span 2; }
.wb-card.wb-span2 { grid-column: span 3; }
.wb-card h3 { font-size: 18px; margin: 0; color: var(--w-text); }
.wb-card p { font-size: 13.5px; color: var(--w-muted); margin: 0; line-height: 1.5; }
.wb-badge {
  align-self: flex-start;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(126, 240, 194, 0.15);
  color: #7ef0c2;
  font-weight: 600;
}
.wb-art { font-size: 40px; color: var(--w-accent); margin: 10px 0; }
.wb-icon { width: 42px; height: 42px; border-radius: 10px; background: rgba(139,108,246,0.15); color: #8b6cf6; display: grid; place-items: center; }
.wb-stat-head { display: flex; align-items: baseline; gap: 12px; }
.wb-big-metric { font-size: 36px; font-weight: 800; color: var(--w-accent); }
.wb-label { font-size: 12px; text-transform: uppercase; color: var(--w-muted); letter-spacing: 0.5px; }

/* ---------- Website Hero Split ---------- */
.whero-split { padding: 64px 0 72px; }
.whs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.whs-left { display: flex; flex-direction: column; gap: 18px; }
.whs-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(139, 108, 246, 0.15);
  border: 1px solid rgba(139, 108, 246, 0.3);
  color: var(--w-accent);
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}
.whs-title { font-size: 44px; line-height: 1.15; font-weight: 800; color: var(--w-text); }
.whs-lead { font-size: 16px; color: var(--w-muted); line-height: 1.6; }
.whs-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
.whs-proof { display: flex; align-items: center; gap: 12px; font-size: 12.5px; color: var(--w-muted); margin-top: 10px; }
.whs-avatars { display: flex; }
.whs-avatars .av {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--w-bg);
  margin-left: -8px;
  background: #3b82f6;
}
.whs-avatars .av:first-child { margin-left: 0; }
.whs-avatars .a1 { background: #8b6cf6; }
.whs-avatars .a2 { background: #ec4899; }
.whs-avatars .a3 { background: #10b981; }
.whs-avatars .a4 { background: #f59e0b; }

.whs-mockup-frame {
  background: #0d0c15;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
}
.whs-mock-header {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 6px;
}
.whs-mock-header .dot { width: 9px; height: 9px; border-radius: 50%; }
.whs-mock-header .r { background: #ef4444; }
.whs-mock-header .y { background: #f59e0b; }
.whs-mock-header .g { background: #10b981; }
.whs-mock-title { font-size: 11px; color: var(--w-muted); margin-left: 8px; font-family: monospace; }
.whs-code-preview { padding: 16px; font-size: 12px; color: #a5f3fc; font-family: monospace; line-height: 1.5; overflow-x: auto; }
.whs-floating-chip {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #10b981;
  font-size: 11.5px;
  font-weight: 700;
}

/* ---------- Website Team Grid ---------- */
.wteam { padding: 50px 0; }
.wteam-head { text-align: center; margin-bottom: 32px; }
.wteam-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.wt-card {
  background: var(--w-surface, #171523);
  border: 1px solid var(--w-line, rgba(255, 255, 255, .1));
  border-radius: 14px;
  padding: 22px 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wt-avatar-wrap { margin-bottom: 12px; }
.wt-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}
.wt-c1 { background: linear-gradient(135deg, #8b6cf6, #ec4899); }
.wt-c2 { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
.wt-c3 { background: linear-gradient(135deg, #10b981, #84cc16); }
.wt-c4 { background: linear-gradient(135deg, #f59e0b, #ef4444); }
.wt-name { font-size: 16px; margin: 0 0 4px; color: var(--w-text); }
.wt-role { font-size: 12px; color: var(--w-accent); font-weight: 600; margin-bottom: 8px; }
.wt-bio { font-size: 12px; color: var(--w-muted); line-height: 1.4; margin: 0 0 12px; }
.wt-socials { display: flex; gap: 10px; color: var(--w-muted); font-size: 16px; }

/* ---------- Website Blog ---------- */
.wblog { padding: 50px 0; }
.wblog-head { text-align: center; margin-bottom: 32px; }
.wblog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.wb-article-card {
  background: var(--w-surface, #171523);
  border: 1px solid var(--w-line, rgba(255, 255, 255, .1));
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.wb-art-thumb {
  height: 140px;
  position: relative;
  padding: 12px;
  display: flex;
  align-items: flex-end;
}
.wb-bg1 { background: linear-gradient(135deg, #4f46e5, #7c3aed); }
.wb-bg2 { background: linear-gradient(135deg, #059669, #0d9488); }
.wb-bg3 { background: linear-gradient(135deg, #d97706, #b45309); }
.wb-category { font-size: 10.5px; font-weight: 700; text-transform: uppercase; background: rgba(0,0,0,0.5); color: #fff; padding: 3px 8px; border-radius: 6px; }
.wb-article-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.wb-meta { font-size: 11px; color: var(--w-muted); }
.wb-art-title { font-size: 16px; margin: 0; line-height: 1.4; }
.wb-art-title a { color: var(--w-text); text-decoration: none; }
.wb-read-more { font-size: 12px; font-weight: 600; color: var(--w-accent); display: flex; align-items: center; gap: 4px; margin-top: auto; }

/* ---------- Website Newsletter ---------- */
.wnewsletter { padding: 40px 0; }
.wn-card {
  background: linear-gradient(135deg, rgba(139,108,246,0.12), rgba(6,182,212,0.08));
  border: 1px solid rgba(139,108,246,0.3);
  border-radius: 20px;
  padding: 44px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.wn-icon { font-size: 32px; color: var(--w-accent); }
.wn-title { font-size: 28px; margin: 0; color: var(--w-text); }
.wn-lead { max-width: 50ch; margin: 0; font-size: 14px; color: var(--w-muted); }
.wn-form { display: flex; gap: 10px; max-width: 440px; width: 100%; margin-top: 6px; }
.wn-input {
  flex: 1;
  height: 42px;
  padding: 0 14px;
  background: var(--w-surface, #1e1b2e);
  border: 1px solid var(--w-line, rgba(255,255,255,0.15));
  border-radius: 8px;
  color: var(--w-text);
  font-size: 13px;
}
.wn-btn { height: 42px; padding: 0 20px; }
.wn-note { font-size: 11px; color: var(--w-muted); }

/* ---------- Website Pricing Comparison ---------- */
.wpricing-table { padding: 50px 0; }
.wpt-head { text-align: center; margin-bottom: 32px; }
.wpt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.wpt-card {
  background: var(--w-surface, #171523);
  border: 1px solid var(--w-line, rgba(255, 255, 255, .1));
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
}
.wpt-card.popular {
  border-color: var(--w-accent);
  box-shadow: 0 10px 30px rgba(139,108,246,0.15);
}
.wpt-ribbon {
  position: absolute;
  top: -10px;
  right: 20px;
  background: var(--w-accent);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
}
.wpt-card h3 { font-size: 18px; margin: 0; color: var(--w-text); }
.wpt-price { font-size: 32px; font-weight: 800; color: var(--w-text); }
.wpt-card p { font-size: 13px; color: var(--w-muted); margin: 0; flex: 1; }

/* ---------- Website CTA ---------- */
.wcta { padding: 50px 0; }
.wcta-box {
  background: radial-gradient(circle at 50% 0%, rgba(139,108,246,0.25), transparent 70%), var(--w-surface, #171523);
  border: 1px solid rgba(139,108,246,0.3);
  border-radius: 20px;
  padding: 56px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.wcta-title { font-size: 34px; font-weight: 800; margin: 0; max-width: 24ch; color: var(--w-text); }
.wcta-actions { display: flex; gap: 12px; margin-top: 8px; }

/* ---------- Website Steps ---------- */
.wsteps { padding: 50px 0; }
.wsteps-head { text-align: center; margin-bottom: 32px; }
.wsteps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.ws-step {
  background: var(--w-surface, #171523);
  border: 1px solid var(--w-line, rgba(255, 255, 255, .1));
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ws-num { font-size: 28px; font-weight: 800; color: var(--w-accent); font-family: monospace; }
.ws-title { font-size: 16px; margin: 0; color: var(--w-text); }
.ws-detail { font-size: 13px; color: var(--w-muted); margin: 0; line-height: 1.5; }

/* ---------- Website Countdown ---------- */
.wcountdown { padding: 30px 0; }
.wcd-box {
  background: var(--w-surface, #171523);
  border: 1px solid var(--w-line, rgba(255, 255, 255, .1));
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.wcd-copy h3 { font-size: 18px; margin: 4px 0 0; color: var(--w-text); }
.wcd-timer { display: flex; align-items: center; gap: 8px; }
.wcd-unit { text-align: center; background: rgba(255,255,255,0.05); padding: 8px 14px; border-radius: 8px; }
.wcd-val { font-size: 24px; font-weight: 800; color: var(--w-accent); display: block; font-family: monospace; }
.wcd-lbl { font-size: 9.5px; text-transform: uppercase; color: var(--w-muted); letter-spacing: 0.5px; }
.wcd-colon { font-size: 20px; font-weight: 700; color: var(--w-muted); }

/* ---------- Announcement & Cookie Notice ---------- */
.wannouncement { background: linear-gradient(90deg, #8b6cf6, #3b82f6); color: #fff; padding: 8px 0; }
.wa-content { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 12.5px; font-weight: 500; }
.wa-badge { background: #fff; color: #1e1b2e; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 4px; }
.wa-link { color: #fff; text-decoration: underline; display: inline-flex; align-items: center; gap: 2px; }

.wcookie-notice {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 560px;
  background: var(--w-surface, #1e1b2e);
  border: 1px solid var(--w-line, rgba(255,255,255,0.15));
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  z-index: 999;
}
.wcn-content { display: flex; align-items: center; gap: 14px; }
.wcn-icon { font-size: 28px; color: var(--w-accent); }
.wcn-text strong { display: block; font-size: 13px; color: var(--w-text); }
.wcn-text p { margin: 2px 0 0; font-size: 11.5px; color: var(--w-muted); }
.wcn-actions { display: flex; gap: 8px; margin-left: auto; }

/* ---------- Website Comparison Table ---------- */
.wcomparison { padding: 50px 0; }
.wcomp-head { text-align: center; margin-bottom: 28px; }
.wcomp-table {
  background: var(--w-surface, #171523);
  border: 1px solid var(--w-line, rgba(255,255,255,0.1));
  border-radius: 14px;
  overflow: hidden;
}
.wcomp-header, .wcomp-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding: 14px 20px;
  border-bottom: 1px solid var(--w-line, rgba(255,255,255,0.06));
  font-size: 13px;
  align-items: center;
}
.wcomp-header { font-weight: 700; text-transform: uppercase; font-size: 11px; color: var(--w-muted); background: rgba(255,255,255,0.02); }
.wcomp-us { color: #10b981; display: flex; align-items: center; gap: 6px; font-weight: 600; }
.wcomp-them { color: var(--w-muted); display: flex; align-items: center; gap: 6px; }

/* ---------- Website Press & Reviews & Careers ---------- */
.wpress { padding: 40px 0; text-align: center; }
.wp-quote { font-size: 22px; font-weight: 600; color: var(--w-text); max-width: 38ch; margin: 12px auto; line-height: 1.4; font-style: italic; }
.wp-author { display: block; font-size: 12.5px; color: var(--w-accent); margin-bottom: 24px; font-style: normal; }
.wp-logos { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
.wp-logo-pill { padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.04); font-size: 12px; font-weight: 600; color: var(--w-muted); }

.wreviews { padding: 50px 0; }
.wrev-head { text-align: center; margin-bottom: 30px; }
.wrev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.wrev-card { background: var(--w-surface, #171523); border: 1px solid var(--w-line, rgba(255,255,255,0.1)); border-radius: 14px; padding: 22px; display: flex; flex-direction: column; gap: 10px; }
.wrev-stars { color: #f59e0b; display: flex; gap: 2px; }
.wrev-text { font-size: 13px; color: var(--w-text); line-height: 1.5; margin: 0; flex: 1; }
.wrev-meta strong { display: block; font-size: 12.5px; color: var(--w-text); }
.wrev-meta small { font-size: 11px; color: var(--w-muted); }

.wgallery { padding: 50px 0; }
.wgal-head { text-align: center; margin-bottom: 28px; }
.wgal-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.wgal-card { height: 160px; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1); }
.wgal-bg1 { background: linear-gradient(135deg, #1e1b4b, #312e81); }
.wgal-bg2 { background: linear-gradient(135deg, #064e3b, #047857); }
.wgal-bg3 { background: linear-gradient(135deg, #701a75, #a21caf); }
.wgal-bg4 { background: linear-gradient(135deg, #7c2d12, #c2410c); }
.wgal-icon { font-size: 28px; color: #fff; }
.wgal-info strong { display: block; font-size: 14px; color: #fff; }
.wgal-info small { font-size: 11px; color: rgba(255,255,255,0.7); }

.wcareers { padding: 40px 0; }
.wjob-head { text-align: center; margin-bottom: 24px; }
.wjob-list { display: flex; flex-direction: column; gap: 10px; max-width: 680px; margin: 0 auto; }
.wjob-row { background: var(--w-surface, #171523); border: 1px solid var(--w-line, rgba(255,255,255,0.1)); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
.wjob-left strong { display: block; font-size: 14px; color: var(--w-text); }
.wjob-left small { font-size: 11.5px; color: var(--w-muted); }

.wprod-card-wrap { padding: 20px 0; }
.wprod-card { background: var(--w-surface, #171523); border: 1px solid var(--w-line, rgba(255,255,255,0.1)); border-radius: 16px; display: flex; overflow: hidden; }
.wprod-visual { width: 180px; background: rgba(255,255,255,0.03); display: flex; flex-direction: column; justify-content: space-between; padding: 14px; align-items: center; }
.wprod-badge { align-self: flex-start; font-size: 9.5px; font-weight: 700; background: var(--w-accent); color: #fff; padding: 2px 6px; border-radius: 4px; }
.wprod-icon { font-size: 54px; color: var(--w-accent); margin: auto; }
.wprod-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.wprod-meta { display: flex; justify-content: space-between; align-items: center; }
.wprod-rating { font-size: 11px; color: #f59e0b; display: flex; align-items: center; gap: 2px; }
.wprod-colors { display: flex; gap: 4px; }
.wp-color-dot { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }
.wprod-title { font-size: 17px; margin: 0; color: var(--w-text); }
.wprod-price-row { display: flex; align-items: center; gap: 10px; margin-top: auto; }
.wprod-price { font-size: 18px; font-weight: 800; color: var(--w-text); }
.wprod-old-price { font-size: 13px; color: var(--w-muted); }


/* ---------- Modern Mobile App Styles ---------- */
.stories-rail { padding: 12px 14px; overflow-x: auto; scrollbar-width: none; }
.stories-rail::-webkit-scrollbar { display: none; }
.stories-track { display: flex; gap: 14px; }
.story-bubble { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; flex-shrink: 0; }
.story-ring {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  padding: 2.5px;
  background: var(--md-outline-variant);
  display: grid;
  place-items: center;
}
.story-bubble.unread .story-ring {
  background: linear-gradient(135deg, #8b6cf6, #f43f5e, #f59e0b);
}
.story-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--md-surface);
  border: 2px solid var(--md-surface);
  display: grid;
  place-items: center;
  color: var(--md-on-surface);
}
.story-name { font-size: 10.5px; color: var(--md-on-surface); max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.wallet-card {
  margin: 12px 16px;
  padding: 20px;
  border-radius: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  position: relative;
  overflow: hidden;
}
.wallet-card.theme-violet { background: linear-gradient(135deg, #6d28d9, #4c1d95); border: 1px solid rgba(139,108,246,0.3); }
.wallet-card.theme-dark { background: linear-gradient(135deg, #27272a, #09090b); border: 1px solid rgba(255,255,255,0.15); }
.wallet-card.theme-emerald { background: linear-gradient(135deg, #059669, #064e3b); border: 1px solid rgba(16,185,129,0.3); }
.wallet-card.theme-sunset { background: linear-gradient(135deg, #ea580c, #be185d); border: 1px solid rgba(234,88,12,0.3); }
.wc-top { display: flex; justify-content: space-between; align-items: center; }
.wc-chip-row { display: flex; align-items: center; gap: 8px; }
.wc-chip { width: 32px; height: 24px; border-radius: 5px; background: linear-gradient(135deg, #fcd34d, #b45309); }
.wc-contactless { font-size: 20px; opacity: 0.8; }
.wc-brand { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; opacity: 0.85; }
.wc-balance-lbl { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.6px; opacity: 0.75; display: block; }
.wc-balance { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
.wc-num { font-size: 15px; font-family: monospace; letter-spacing: 2px; opacity: 0.85; margin-bottom: 4px; }
.wc-meta { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; opacity: 0.8; }

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 12px 16px;
}
.qa-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--md-on-surface);
}
.qa-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--md-surface-container, rgba(255,255,255,0.06));
  display: grid;
  place-items: center;
  color: var(--md-primary);
  font-size: 22px;
  border: 1px solid var(--md-outline-variant);
  transition: transform .12s;
}
.qa-item:hover .qa-icon-wrap { transform: scale(1.05); }
.qa-label { font-size: 11.5px; font-weight: 600; }

.m3-stat-card {
  margin: 10px 16px;
  padding: 18px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
}
.msc-head { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--md-on-surface-variant); font-weight: 600; }
.msc-main { display: flex; justify-content: space-between; align-items: flex-end; margin: 10px 0 12px; }
.msc-val { font-size: 32px; font-weight: 800; color: var(--md-on-surface); line-height: 1; }
.msc-sparkline { width: 90px; height: 28px; color: #10b981; }
.msc-footer { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.msc-trend { display: inline-flex; align-items: center; gap: 2px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
.msc-trend.up { background: rgba(16,185,129,0.15); color: #10b981; }
.msc-trend.down { background: rgba(244,63,94,0.15); color: #f43f5e; }
.msc-period { color: var(--md-on-surface-variant); }

.chat-thread { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.chat-msg { display: flex; width: 100%; }
.chat-msg.in { justify-content: flex-start; }
.chat-msg.out { justify-content: flex-end; }
.chat-bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.4;
  position: relative;
}
.chat-msg.in .chat-bubble {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  border-bottom-left-radius: 4px;
}
.chat-msg.out .chat-bubble {
  background: var(--md-primary);
  color: var(--md-on-primary);
  border-bottom-right-radius: 4px;
}
.chat-meta { display: block; font-size: 9.5px; margin-top: 4px; opacity: 0.75; text-align: right; }
.chat-check { font-size: 12px; vertical-align: middle; }

.prof-header { background: var(--md-surface); border-bottom: 1px solid var(--md-outline-variant); }
.prof-banner { height: 90px; background: linear-gradient(135deg, #8b6cf6, #3b82f6); }
.prof-content { padding: 0 16px 16px; position: relative; }
.prof-avatar-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: -36px; margin-bottom: 10px; }
.prof-avatar { width: 72px; height: 72px; border-radius: 50%; border: 3px solid var(--md-surface); background: #6366f1; color: #fff; font-size: 22px; font-weight: 800; display: grid; place-items: center; }
.prof-edit-btn { display: flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 99px; border: 1px solid var(--md-outline); background: transparent; font-size: 11.5px; font-weight: 600; color: var(--md-on-surface); cursor: pointer; }
.prof-name { font-size: 18px; margin: 0; color: var(--md-on-surface); }
.prof-handle { font-size: 12px; color: var(--md-on-surface-variant); display: block; margin-bottom: 8px; }
.prof-bio { font-size: 12.5px; color: var(--md-on-surface); line-height: 1.4; margin: 0 0 12px; }
.prof-stats-bar { display: flex; gap: 18px; }
.prof-stat strong { font-size: 13px; color: var(--md-on-surface); }
.prof-stat small { font-size: 11px; color: var(--md-on-surface-variant); margin-left: 4px; }

.m3-waveform-card {
  margin: 10px 16px;
  padding: 16px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
}
.mwc-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.mwc-info strong { display: block; font-size: 13.5px; color: var(--md-on-surface); }
.mwc-info small { font-size: 11.5px; color: var(--md-on-surface-variant); }
.mwc-play-btn { width: 38px; height: 38px; border-radius: 50%; background: var(--md-primary); color: var(--md-on-primary); border: none; display: grid; place-items: center; cursor: pointer; }
.mwc-wave-container { height: 42px; display: flex; align-items: center; gap: 3px; }
.wave-bar { flex: 1; background: var(--md-outline-variant); border-radius: 3px; }
.wave-bar.is-passed { background: var(--md-primary); }
.mwc-time-row { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--md-on-surface-variant); margin-top: 6px; }

.notifications-card { margin: 10px 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; overflow: hidden; }
.notif-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--md-outline-variant); position: relative; }
.notif-item:last-child { border-bottom: none; }
.notif-item.unread { background: rgba(139,108,246,0.06); }
.notif-icon-wrap { width: 36px; height: 36px; border-radius: 10px; background: var(--md-primary-container); color: var(--md-on-primary-container); display: grid; place-items: center; font-size: 18px; flex-shrink: 0; }
.notif-text strong { display: block; font-size: 12.5px; color: var(--md-on-surface); }
.notif-text p { margin: 2px 0; font-size: 11.5px; color: var(--md-on-surface-variant); line-height: 1.35; }
.notif-text small { font-size: 10px; color: var(--md-outline); }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--md-primary); position: absolute; top: 14px; right: 14px; }

.review-rating-card { margin: 10px 16px; padding: 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; display: flex; gap: 16px; align-items: center; }
.rr-score-box { text-align: center; width: 100px; flex-shrink: 0; }
.rr-big-score { font-size: 38px; font-weight: 800; color: var(--md-on-surface); line-height: 1; }
.rr-stars { color: #f59e0b; font-size: 16px; display: flex; justify-content: center; gap: 1px; margin: 4px 0; }
.rr-total { font-size: 10.5px; color: var(--md-on-surface-variant); }
.rr-breakdown { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.rr-row { display: flex; align-items: center; gap: 6px; font-size: 11px; }
.rr-star-ico { font-size: 12px; color: #f59e0b; }
.rr-bar-bg { flex: 1; height: 6px; background: var(--md-outline-variant); border-radius: 3px; overflow: hidden; }
.rr-bar-fill { height: 100%; background: #f59e0b; border-radius: 3px; }

.crypto-card { margin: 10px 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; overflow: hidden; }
.crypto-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--md-outline-variant); }
.crypto-row:last-child { border-bottom: none; }
.cr-sym-badge { width: 36px; height: 36px; border-radius: 50%; background: rgba(245,158,11,0.15); color: #f59e0b; display: grid; place-items: center; font-size: 11px; font-weight: 800; }
.cr-info strong { display: block; font-size: 13px; color: var(--md-on-surface); }
.cr-info small { font-size: 11px; color: var(--md-on-surface-variant); }
.cr-pricing { margin-left: auto; text-align: right; }
.cr-price { font-size: 13px; font-weight: 700; color: var(--md-on-surface); }
.cr-chg { font-size: 11px; font-weight: 600; }
.cr-chg.up { color: #10b981; }
.cr-chg.down { color: #f43f5e; }

.m3-countdown-card { margin: 10px 16px; padding: 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; }
.mcc-head { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #f59e0b; margin-bottom: 12px; }
.mcc-boxes { display: flex; gap: 8px; }
.mcc-box { flex: 1; background: var(--md-surface); border: 1px solid var(--md-outline-variant); border-radius: 10px; padding: 10px 4px; text-align: center; }
.mcc-val { font-size: 20px; font-weight: 800; color: var(--md-primary); display: block; font-family: monospace; }
.mcc-lbl { font-size: 9px; font-weight: 700; color: var(--md-on-surface-variant); }

.segmented-control { margin: 10px 16px; padding: 4px; background: var(--md-surface-container-high); border-radius: 12px; display: flex; gap: 4px; }
.seg-btn { flex: 1; padding: 7px 10px; border-radius: 8px; border: none; background: transparent; font-size: 12px; font-weight: 600; color: var(--md-on-surface-variant); cursor: pointer; transition: all .15s ease; }
.seg-btn.is-active { background: var(--md-surface); color: var(--md-on-surface); box-shadow: 0 2px 6px rgba(0,0,0,0.15); }

.m3-rings-card { margin: 10px 16px; padding: 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; display: flex; align-items: center; gap: 18px; }
.mrc-visual { width: 90px; height: 90px; flex-shrink: 0; }
.mrc-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.mrc-leg-row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.mrc-dot { width: 10px; height: 10px; border-radius: 50%; }
.mrc-dot.c-red { background: #f43f5e; }
.mrc-dot.c-green { background: #10b981; }
.mrc-dot.c-cyan { background: #06b6d4; }
.mrc-leg-row small { display: block; font-size: 9px; color: var(--md-on-surface-variant); font-weight: 700; }
.mrc-leg-row strong { font-size: 12px; color: var(--md-on-surface); }

.feed-post-card { margin: 10px 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.fpc-head { display: flex; align-items: center; gap: 10px; }
.fpc-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--md-primary); color: var(--md-on-primary); font-size: 13px; font-weight: 700; display: grid; place-items: center; }
.fpc-head strong { display: block; font-size: 13px; color: var(--md-on-surface); }
.fpc-head small { font-size: 11px; color: var(--md-on-surface-variant); }
.fpc-more { margin-left: auto; color: var(--md-on-surface-variant); }
.fpc-text { font-size: 13px; color: var(--md-on-surface); line-height: 1.4; margin: 0; }
.fpc-media-placeholder { height: 120px; border-radius: 12px; background: var(--md-surface); border: 1px dashed var(--md-outline-variant); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: var(--md-on-surface-variant); font-size: 12px; }
.fpc-actions { display: flex; gap: 16px; font-size: 12px; color: var(--md-on-surface-variant); margin-top: 4px; }
.fpc-act { background: none; border: none; color: inherit; display: flex; align-items: center; gap: 4px; cursor: pointer; padding: 0; }
.fpc-act.bookmark { margin-left: auto; }

.file-upload-card { margin: 10px 16px; padding: 22px; background: var(--md-surface-container); border: 2px dashed var(--md-outline-variant); border-radius: 16px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.fuc-icon-wrap { width: 48px; height: 48px; border-radius: 12px; background: var(--md-primary-container); color: var(--md-on-primary-container); font-size: 24px; display: grid; place-items: center; margin-bottom: 4px; }
.file-upload-card strong { font-size: 14px; color: var(--md-on-surface); }
.file-upload-card small { font-size: 11px; color: var(--md-on-surface-variant); }
.fuc-progress-bg { width: 100%; height: 6px; background: var(--md-outline-variant); border-radius: 3px; margin: 8px 0; overflow: hidden; }
.fuc-progress-bar { height: 100%; background: var(--md-primary); border-radius: 3px; }
.fuc-tags { display: flex; gap: 6px; }
.fuc-tags span { font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: var(--md-surface); color: var(--md-on-surface-variant); }

.m3-stepper { margin: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
.stp-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stp-circle { width: 28px; height: 28px; border-radius: 50%; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); border: 2px solid var(--md-outline-variant); font-size: 11px; font-weight: 700; display: grid; place-items: center; }
.stp-item.is-done .stp-circle { background: #10b981; border-color: #10b981; color: #fff; }
.stp-item.is-current .stp-circle { background: var(--md-primary); border-color: var(--md-primary); color: var(--md-on-primary); }
.stp-label { font-size: 10px; font-weight: 600; color: var(--md-on-surface-variant); }
.stp-line { flex: 1; height: 2px; background: var(--md-outline-variant); margin: 0 4px 14px; }

.expandable-card { margin: 10px 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; overflow: hidden; }
.exc-head { display: flex; align-items: center; gap: 10px; padding: 14px; cursor: pointer; }
.exc-ico { font-size: 20px; color: var(--md-primary); }
.exc-head strong { display: block; font-size: 13px; color: var(--md-on-surface); }
.exc-head small { font-size: 11px; color: var(--md-on-surface-variant); }
.exc-chevron { margin-left: auto; color: var(--md-on-surface-variant); }
.exc-body { padding: 0 14px 14px; font-size: 12px; color: var(--md-on-surface-variant); line-height: 1.4; border-top: 1px solid var(--md-outline-variant); margin-top: -2px; padding-top: 10px; }

.badge-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 10px 16px; }
.ach-badge { background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 14px; padding: 14px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.ach-icon { font-size: 26px; color: #f59e0b; }
.ach-badge strong { font-size: 12.5px; color: var(--md-on-surface); }
.ach-badge small { font-size: 10.5px; color: var(--md-on-surface-variant); }

.map-preview-card { margin: 10px 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: 16px; overflow: hidden; }
.mpc-map { height: 110px; background: linear-gradient(135deg, #1e293b, #0f172a); position: relative; display: grid; place-items: center; }
.mpc-pin { width: 36px; height: 36px; border-radius: 50%; background: #ef4444; color: #fff; font-size: 20px; display: grid; place-items: center; box-shadow: 0 4px 12px rgba(239,68,68,0.5); }
.mpc-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; font-size: 9.5px; padding: 2px 6px; border-radius: 4px; }
.mpc-content { padding: 14px; display: flex; flex-direction: column; gap: 6px; }
.mpc-content strong { font-size: 13.5px; color: var(--md-on-surface); }
.mpc-content small { font-size: 11.5px; color: var(--md-on-surface-variant); }
.mpc-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; background: var(--md-primary); color: var(--md-on-primary); border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; width: fit-content; margin-top: 4px; }


/* ---------- Modern Chrome Extension Styles ---------- */
.ext-mini-btn { width: 26px; height: 26px; border-radius: 6px; background: var(--ext-surface-2, rgba(255,255,255,0.06)); border: 1px solid var(--ext-line, rgba(255,255,255,0.1)); color: var(--ext-text, #fff); display: grid; place-items: center; cursor: pointer; font-size: 14px; padding: 0; }
.ext-mini-btn:hover { background: rgba(255,255,255,0.14); }

.ext-tab-card { display: flex; flex-direction: column; gap: 10px; }
.etc-top { display: flex; align-items: center; gap: 10px; }
.etc-fav { font-size: 20px; color: var(--ext-accent, #8b6cf6); }
.etc-info { flex: 1; min-width: 0; }
.etc-info strong { display: block; font-size: 12.5px; color: var(--ext-text, #fff); }
.etc-info small { font-size: 10.5px; color: var(--ext-muted, #94a3b8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.etc-meta { display: flex; gap: 8px; }
.etc-badge { font-size: 10.5px; padding: 2px 7px; border-radius: 5px; background: rgba(255,255,255,0.06); color: var(--ext-muted, #94a3b8); display: inline-flex; align-items: center; gap: 4px; }
.etc-badge.secure { background: rgba(16,185,129,0.15); color: #10b981; }

.ext-picker-card { display: flex; flex-direction: column; gap: 10px; }
.epc-row { display: flex; align-items: center; gap: 10px; }
.epc-preview { width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); }
.epc-values { flex: 1; }
.epc-values strong { display: block; font-size: 13px; color: var(--ext-text, #fff); font-family: monospace; }
.epc-values small { font-size: 10.5px; color: var(--ext-muted, #94a3b8); }
.epc-swatches { display: flex; align-items: center; gap: 6px; font-size: 10.5px; color: var(--ext-muted, #94a3b8); }
.ext-swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; }

.ext-speed-card { display: flex; flex-direction: column; gap: 12px; }
.esp-metrics { display: flex; justify-content: space-between; text-align: center; }
.esp-item small { font-size: 9px; font-weight: 700; color: var(--ext-muted, #94a3b8); display: block; }
.esp-item strong { font-size: 15px; font-weight: 800; color: var(--ext-text, #fff); font-family: monospace; }
.esp-item.down strong { color: #10b981; }
.esp-item.up strong { color: #3b82f6; }

.ext-shield-card .esh-top { display: flex; align-items: center; gap: 10px; }
.esh-icon { font-size: 26px; color: #10b981; }
.esh-top strong { display: block; font-size: 12.5px; color: var(--ext-text, #fff); }
.esh-top small { font-size: 10.5px; color: var(--ext-muted, #94a3b8); }
.ext-toggle { width: 34px; height: 18px; border-radius: 99px; background: rgba(255,255,255,0.2); margin-left: auto; position: relative; }
.ext-toggle.on { background: #10b981; }
.ext-toggle::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .15s; }
.ext-toggle.on::after { transform: translateX(16px); }

.ext-pwd-card { display: flex; flex-direction: column; gap: 8px; }
.epw-box { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: monospace; font-size: 12px; color: #7ef0c2; }
.epw-meta { display: flex; align-items: center; justify-content: space-between; font-size: 10.5px; color: var(--ext-muted, #94a3b8); }
.epw-badge { font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; }
.epw-badge.strong { background: rgba(16,185,129,0.2); color: #10b981; }

.ext-todo-card { display: flex; flex-direction: column; gap: 8px; }
.etd-head { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ext-muted, #94a3b8); border-bottom: 1px solid var(--ext-line, rgba(255,255,255,0.1)); padding-bottom: 6px; }
.etd-list { display: flex; flex-direction: column; gap: 6px; }
.etd-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ext-text, #fff); }
.etd-item.is-done { opacity: 0.55; text-decoration: line-through; }
.etd-check { font-size: 16px; color: var(--ext-accent, #8b6cf6); }

.ext-bookmark-card { display: flex; flex-direction: column; gap: 8px; }
.ebm-head { display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: var(--ext-muted, #94a3b8); border-bottom: 1px solid var(--ext-line, rgba(255,255,255,0.1)); padding-bottom: 6px; }
.ebm-list { display: flex; flex-direction: column; gap: 6px; }
.ebm-item { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 6px; cursor: pointer; }
.ebm-item:hover { background: rgba(255,255,255,0.06); }
.ebm-ico { font-size: 16px; color: var(--ext-accent, #8b6cf6); }
.ebm-info { flex: 1; }
.ebm-info strong { display: block; font-size: 11.5px; color: var(--ext-text, #fff); }
.ebm-info small { font-size: 9.5px; color: var(--ext-muted, #94a3b8); }
.ebm-arrow { font-size: 14px; color: var(--ext-muted, #94a3b8); }

.ext-clip-card { display: flex; flex-direction: column; gap: 8px; }
.ecl-head { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ext-muted, #94a3b8); border-bottom: 1px solid var(--ext-line, rgba(255,255,255,0.1)); padding-bottom: 6px; }
.ecl-list { display: flex; flex-direction: column; gap: 6px; }
.ecl-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; border-radius: 6px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; color: #a5f3fc; }
.ecl-row code { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }

.ext-reader-card { display: flex; flex-direction: column; gap: 8px; }
.erd-toolbar { display: flex; gap: 6px; border-bottom: 1px solid var(--ext-line, rgba(255,255,255,0.1)); padding-bottom: 6px; }
.erd-title { font-size: 13.5px; margin: 0; color: var(--ext-text, #fff); }
.erd-author { font-size: 10px; color: var(--ext-accent, #8b6cf6); }
.erd-body { font-size: 11.5px; color: var(--ext-muted, #94a3b8); line-height: 1.45; margin: 0; }


/* ========================================================
   TOP APP BAR VARIATIONS (15 DISTINCT DESIGNS)
   ======================================================== */
.app-bar {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}
.ab-search-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  overflow: hidden;
}
.ab-search-input-box {
  flex: 1 1 0%;
  min-width: 0;
  box-sizing: border-box;
  height: 38px;
  background: var(--md-surface-container-high, rgba(255,255,255,0.08));
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  color: var(--md-on-surface-variant);
  border: 1px solid var(--md-outline-variant, rgba(255,255,255,0.1));
  cursor: pointer;
  overflow: hidden;
}
.ab-search-ph {
  font-size: 13px;
  flex: 1 1 0%;
  min-width: 0;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ab-voice-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--md-primary);
  display: grid;
  place-items: center;
  padding: 0;
  cursor: pointer;
}
.ab-search-header .icon-btn {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
}

.ab-search-pill-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 8px 12px;
  background: transparent;
  overflow: hidden;
}
.ab-search-pill {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 44px;
  border-radius: 99px;
  background: var(--md-surface-container, #1e1b2e);
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  border: 1px solid var(--md-outline-variant, rgba(255,255,255,0.12));
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 6px;
  overflow: hidden;
}
.ab-search-pill .ab-search-ph {
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ab-pill-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--md-on-surface-variant);
}

.ab-profile-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  gap: 8px;
}
.ab-prof-left {
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}
.ab-avatar-badge {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 13px;
  font-weight: 700;
  display: grid;
  place-items: center;
  border: 2px solid var(--md-surface);
}
.ab-prof-texts {
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ab-greeting {
  font-size: 11px;
  color: var(--md-on-surface-variant);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ab-prof-texts .ab-title {
  font-size: 15px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ab-prof-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}
.notif-wrap { position: relative; display: inline-flex; }
.badge-dot { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; border: 2px solid var(--md-surface); }

.ab-store-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  gap: 6px;
}
.store-brand {
  flex: 1 1 0%;
  min-width: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: var(--md-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ab-store-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}
.ab-store-header .icon-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
}
.ab-cart-btn { position: relative; }
.cart-badge { position: absolute; top: 2px; right: 2px; background: var(--md-primary); color: var(--md-on-primary); font-size: 9.5px; font-weight: 800; padding: 1px 5px; border-radius: 99px; }

.app-bar-wrap-floating {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 8px 12px;
  background: transparent;
  overflow: hidden;
}
.ab-capsule-island {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  border-radius: 99px;
  background: var(--md-surface-container, rgba(30, 27, 46, 0.85));
  backdrop-filter: blur(14px);
  border: 1px solid var(--md-outline-variant, rgba(255,255,255,0.15));
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  padding: 4px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 6px;
}
.ab-capsule-island .ab-title {
  flex: 1 1 0%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ab-island-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}

.ab-social-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  gap: 6px;
}
.social-brand {
  flex: 1 1 0%;
  min-width: 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  font-family: var(--font-display);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ab-social-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}
.ab-dm-btn { position: relative; }

.ab-saas-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  gap: 6px;
}
.ab-workspace-picker {
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--md-surface-container-high);
  cursor: pointer;
  overflow: hidden;
}
.ab-ws-icon { color: var(--md-primary); flex-shrink: 0; }
.ab-workspace-picker strong {
  flex: 1 1 0%;
  min-width: 0;
  font-size: 12.5px;
  color: var(--md-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ab-ws-chev { font-size: 16px; color: var(--md-on-surface-variant); flex-shrink: 0; }
.ab-saas-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ab-glass-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background: rgba(30, 27, 46, 0.7) !important;
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
}

.ab-editorial-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: 1px solid var(--md-outline-variant);
  overflow: hidden;
}
.ab-ed-top { display: flex; justify-content: space-between; align-items: center; }
.ab-ed-date { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--md-on-surface-variant); letter-spacing: 0.6px; }
.ab-ed-actions { display: flex; gap: 4px; }
.ab-ed-title { font-size: 26px; font-weight: 800; font-family: var(--font-display); margin: 4px 0 0; color: var(--md-on-surface); line-height: 1.15; word-break: break-word; }
.ab-ed-sub { font-size: 12.5px; color: var(--md-on-surface-variant); margin: 0; line-height: 1.4; }

.ab-music-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  overflow: hidden;
}
.ab-music-title-box { flex: 1 1 0%; min-width: 0; overflow: hidden; }
.ab-music-title-box .ab-title { font-size: 15px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ab-music-sub { font-size: 10.5px; color: var(--md-primary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ab-music-actions { flex-shrink: 0; display: flex; align-items: center; gap: 2px; }

.ab-gradient-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background: linear-gradient(135deg, #8b6cf6, #3b82f6) !important;
  color: #fff !important;
  overflow: hidden;
}
.ab-gradient-header .icon-btn { color: #fff !important; }
.ab-gradient-header .ab-title { color: #fff !important; }

.ab-subtabs-header {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-bottom: 1px solid var(--md-outline-variant);
  overflow: hidden;
}
.ab-subtabs-header .ab-row { display: flex; align-items: center; padding: 6px 12px; box-sizing: border-box; width: 100%; max-width: 100%; }
.ab-integrated-tabs { display: flex; gap: 16px; padding: 0 14px 8px; overflow-x: auto; scrollbar-width: none; }
.ab-subtab { font-size: 12px; font-weight: 600; color: var(--md-on-surface-variant); cursor: pointer; padding-bottom: 4px; border-bottom: 2px solid transparent; white-space: nowrap; }
.ab-subtab.active { color: var(--md-primary); border-bottom-color: var(--md-primary); }

/* Settings Card Variations & Interactive Navigation */
.settings-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background: var(--md-surface-container, rgba(255,255,255,0.05));
  border-radius: 16px;
  overflow: hidden;
  margin: 8px 0;
  border: 1px solid var(--md-outline-variant, rgba(255,255,255,0.08));
}
.settings-card.style-flat {
  background: transparent;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: 1px solid var(--md-outline-variant);
  border-bottom: 1px solid var(--md-outline-variant);
}
.settings-card.style-outlined {
  background: transparent;
  border: 1.5px solid var(--md-outline-variant);
  border-radius: 16px;
}
.settings-card.style-glass {
  background: rgba(30, 27, 46, 0.65);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
}
.settings-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--md-outline-variant, rgba(255,255,255,0.06));
  transition: background 0.15s ease;
  user-select: none;
}
.settings-row:last-child {
  border-bottom: none;
}
.settings-row[data-nav-target],
.settings-row.is-link {
  cursor: pointer;
}
.settings-row[data-nav-target]:hover,
.settings-row.is-link:hover {
  background: rgba(255, 255, 255, 0.05);
}
.settings-row[data-nav-target]:active,
.settings-row.is-link:active {
  background: rgba(255, 255, 255, 0.1);
}
.card.is-clickable {
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.14s ease;
}
.card.is-clickable:hover {
  transform: translateY(-1px);
}
.card.is-clickable:active {
  transform: translateY(0);
}

/* ========================================================
   TABS COMPONENT VARIATIONS (15 DISTINCT DESIGNS)
   ======================================================== */
.tabs-row.style-pill-outlined { padding: 6px 8px; gap: 6px; border-bottom: 0; }
.tabs-row.style-pill-outlined .tab { border-radius: 99px; border: 1.5px solid var(--md-outline-variant); padding: 6px 12px; }
.tabs-row.style-pill-outlined .tab.active { border-color: var(--md-primary); color: var(--md-primary); background: transparent; }
.tabs-row.style-pill-outlined .tab.active::after { display: none; }

.tabs-row.style-segmented { padding: 4px; margin: 6px 12px; background: var(--md-surface-container-high); border-radius: 12px; border: none; gap: 4px; }
.tabs-row.style-segmented .tab { border-radius: 8px; padding: 7px 10px; border: none; font-size: 12px; }
.tabs-row.style-segmented .tab.active { background: var(--md-surface); color: var(--md-on-surface); box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
.tabs-row.style-segmented .tab.active::after { display: none; }

.tabs-row.style-badge { gap: 8px; }
.tab-badge-pill { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 99px; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); margin-left: 5px; }
.tabs-row .tab.active .tab-badge-pill { background: var(--md-primary); color: var(--md-on-primary); }

.tabs-row.style-icon-stacked .tab { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 4px; }
.tab-ico-stacked { font-size: 18px; }
.tabs-row.style-icon-inline .tab { display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
.tab-ico-inline { font-size: 16px; }

.tabs-row.style-minimal-bold { border-bottom: none; gap: 16px; padding: 6px 16px; }
.tabs-row.style-minimal-bold .tab { flex: initial; padding: 6px 0; font-size: 14px; font-weight: 500; color: var(--md-on-surface-variant); }
.tabs-row.style-minimal-bold .tab.active { font-weight: 800; color: var(--md-on-surface); }
.tabs-row.style-minimal-bold .tab.active::after { display: none; }

.tabs-row.style-boxed { padding: 8px 12px; gap: 8px; border-bottom: none; }
.tabs-row.style-boxed .tab { border-radius: 10px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); padding: 10px 8px; }
.tabs-row.style-boxed .tab.active { background: var(--md-surface); border-color: var(--md-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.tabs-row.style-boxed .tab.active::after { display: none; }

.tabs-row.style-glass { background: rgba(30, 27, 46, 0.6); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(255,255,255,0.1); }
.tabs-row.style-glass .tab.active { color: #a78bfa; }

.tabs-row.style-glow .tab.active::after {
  box-shadow: 0 0 10px var(--md-primary), 0 0 20px var(--md-primary);
}

.tabs-row.style-scrollable { overflow-x: auto; scrollbar-width: none; border-bottom: none; padding: 6px 12px; gap: 8px; }
.tabs-row.style-scrollable::-webkit-scrollbar { display: none; }
.tabs-row.style-scrollable .tab { flex: initial; border-radius: 99px; padding: 6px 14px; background: var(--md-surface-container); white-space: nowrap; }
.tabs-row.style-scrollable .tab.active { background: var(--md-primary); color: var(--md-on-primary); }
.tabs-row.style-scrollable .tab.active::after { display: none; }

.tabs-row.style-floating { margin: 8px 14px; border-radius: 99px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); padding: 4px 8px; }
.tabs-row.style-floating .tab { border-radius: 99px; }
.tabs-row.style-floating .tab.active { background: var(--md-primary); color: var(--md-on-primary); }
.tabs-row.style-floating .tab.active::after { display: none; }

.tabs-row.style-dot .tab { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.tab-dot-marker { width: 4px; height: 4px; border-radius: 50%; background: var(--md-primary); }
.tabs-row.style-dot .tab.active::after { display: none; }


/* ========================================================
   BOTTOM NAVIGATION VARIATIONS (15 DISTINCT DESIGNS)
   ======================================================== */
.nav-center-fab-wrap {
  display: flex;
  align-items: center;
  position: relative;
  background: var(--md-surface-container);
  border-top: 1px solid var(--md-outline-variant);
  height: 60px;
}
.ncf-side { flex: 1; display: flex; align-items: center; }
.ncf-center-fab-notch { width: 68px; display: flex; justify-content: center; position: relative; }
.ncf-fab-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: 4px solid var(--md-surface);
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  display: grid;
  place-items: center;
  position: absolute;
  top: -24px;
  cursor: pointer;
  transition: transform .15s ease;
}
.ncf-fab-btn:hover { transform: scale(1.08); }
.ncf-fab-btn .mi { font-size: 26px; }

.nav-expanding-pill {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 12px;
  background: var(--md-surface-container);
  border-top: 1px solid var(--md-outline-variant);
}
.exp-pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 99px; transition: all .2s ease; border: none; background: transparent; color: var(--md-on-surface-variant); cursor: pointer; }
.exp-pill.active { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.exp-label { font-size: 11.5px; font-weight: 700; }

.nav-badge-counter { position: relative; }
.nav-badge-count { position: absolute; top: 3px; right: 20%; background: #ef4444; color: #fff; font-size: 9px; font-weight: 800; padding: 1px 4px; border-radius: 99px; border: 1.5px solid var(--md-surface); }

.nav-active-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--md-primary); margin-top: 2px; }

.nav-compact .nav-item span:not(.nav-icon) { display: none; }
.nav-compact .nav-icon { font-size: 24px; }

.nav-minimal .nav-item.active { border-bottom: 2px solid var(--md-primary); }

.nav-glass {
  background: rgba(30, 27, 46, 0.75) !important;
  backdrop-filter: blur(18px);
  border-top: 1px solid rgba(255,255,255,0.12);
}

.nav-neon-cyber {
  background: #090810 !important;
  border-top: 1px solid #221c35;
}
.nav-neon-cyber .nav-item.active {
  color: #7ef0c2 !important;
  text-shadow: 0 0 10px rgba(126,240,194,0.6);
}
.nav-neon-cyber .nav-item.active .nav-icon {
  filter: drop-shadow(0 0 6px #7ef0c2);
}

.nav-split-island {
  background: transparent !important;
  border: none !important;
  padding: 8px 14px;
  gap: 10px;
}
.nav-split-island .nav-item {
  border-radius: 14px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
}

.nav-gradient-border {
  margin: 8px 14px;
  border-radius: 99px;
  background: var(--md-surface-container);
  border: 1.5px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.nav-curved-liquid {
  background: var(--md-surface-container);
  border-top: 1px solid var(--md-outline-variant);
  position: relative;
}
.nav-curved-liquid .nav-item.active .nav-icon {
  transform: translateY(-4px);
  color: var(--md-primary);
  transition: transform .2s ease;
}

.nav-segmented-dock {
  margin: 8px 14px;
  padding: 4px;
  border-radius: 14px;
  background: var(--md-surface-container-high);
  gap: 4px;
  border: none;
}
.nav-segmented-dock .nav-item { border-radius: 10px; }
.nav-segmented-dock .nav-item.active { background: var(--md-surface); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }

.nav-pill-outline {
  margin: 8px 14px;
  border-radius: 99px;
  background: transparent;
  border: 1.5px solid var(--md-outline);
}



/* =========================================================
   ADDITIONAL MUSIC PLAYER VARIATIONS & MODULAR FEATURES
   ========================================================= */

/* Cassette Tape Variation */
.mp-cassette-shell {
  position: relative;
  width: min(100%, 260px);
  height: 168px;
  margin: 0 auto 16px;
  background: linear-gradient(180deg, #2a2a2e 0%, #1c1c20 60%, #151518 100%);
  border: 2px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
}
.mp-cass-screw {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #666;
  border: 1px solid #444;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
}
.mp-cass-screw.tl { top: 5px; left: 5px; }
.mp-cass-screw.tr { top: 5px; right: 5px; }
.mp-cass-screw.bl { bottom: 5px; left: 5px; }
.mp-cass-screw.br { bottom: 5px; right: 5px; }

.mp-cass-label {
  width: 90%;
  background: #fdfaf2;
  color: #1f1f23;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d4ceb8;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  margin-top: 2px;
}
.mp-cass-side {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .1em;
  color: #c2410c;
  text-transform: uppercase;
}
.mp-cass-title {
  font-size: 11px;
  font-weight: 700;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mp-cass-artist {
  font-size: 9.5px;
  color: #555;
}

.mp-cass-window {
  width: 82%;
  height: 60px;
  background: rgba(0, 0, 0, 0.65);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
}
.mp-cass-counter {
  font-family: monospace;
  font-size: 10px;
  background: #000;
  color: #fff;
  padding: 2px 5px;
  border-radius: 3px;
  border: 1px solid #333;
}
.mp-cass-spool {
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
}
.mp-tape-roll {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #503120;
  border: 3px solid #361e12;
}
.mp-tape-roll.thin { inset: 5px; }
.mp-hub {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fdfdfd;
  border: 2px solid #aaa;
  z-index: 2;
  box-shadow: inset 0 0 0 3px #1a1a1a;
}
.mp-hub.spinning,
.mp-tape-roll.spinning {
  animation: mp-cass-spin 2s linear infinite;
}
@keyframes mp-cass-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mp-cass-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 5px;
}
.mp-guide {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #888;
  border: 1px solid #444;
}
.mp-head {
  width: 22px;
  height: 6px;
  background: #b45309;
  border-radius: 2px;
}

/* Frosted Glass Neumorphic Variation */
.mp-glass-card {
  position: relative;
  width: min(100%, 250px);
  aspect-ratio: 1 / 1;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
}
.mp-glass-aura {
  position: absolute;
  inset: 15px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--md-primary, #7c4dff) 0%, transparent 70%);
  filter: blur(28px);
  opacity: 0.55;
  pointer-events: none;
}
.mp-glass-ring {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 2px dashed rgba(124, 77, 255, 0.45);
  pointer-events: none;
}
.mp-glass-ring.pulsing {
  animation: mp-ring-pulse 2.8s ease-in-out infinite;
}
@keyframes mp-ring-pulse {
  0%, 100% { transform: scale(0.96) rotate(0deg); opacity: 0.4; }
  50% { transform: scale(1.04) rotate(180deg); opacity: 0.9; }
}
.mp-glass-center {
  width: 170px;
  height: 170px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  overflow: hidden;
}

/* Studio Master Multiband EQ Rack */
.mp-rack-eq {
  width: min(100%, 280px);
  margin: 0 auto 16px;
  padding: 12px 14px;
  background: #111216;
  border: 2px solid #282a32;
  border-radius: 10px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 8px 20px rgba(0,0,0,0.4);
}
.mp-vu-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.mp-vu-meter {
  display: flex;
  align-items: center;
  gap: 6px;
}
.mp-vu-tag { font-size: 9px; font-weight: 700; color: #888; font-family: monospace; }
.mp-vu-track {
  width: 60px;
  height: 10px;
  background: #1c1d22;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #333;
}
.mp-vu-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #f59e0b 70%, #ef4444 95%);
  transition: width 0.15s ease;
}
.mp-vu-fill.live {
  animation: mp-vu-bounce 0.6s ease-in-out infinite alternate;
}
@keyframes mp-vu-bounce {
  0% { width: 45%; }
  50% { width: 88%; }
  100% { width: 65%; }
}
.mp-vu-db { font-size: 9px; color: #10b981; font-family: monospace; }

.mp-eq-bands {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 64px;
}
.mp-eq-band {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}
.mp-eq-fader {
  position: relative;
  width: 6px;
  flex: 1;
  background: #252730;
  border-radius: 3px;
  overflow: hidden;
}
.mp-eq-fader span {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--md-primary, #7c4dff);
  border-radius: 3px;
}
.mp-eq-lbl { font-size: 8.5px; color: #999; font-family: monospace; }

/* Modular Tooling Bars inside Music Player */
.mp-mod-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 6px auto 10px;
  padding: 3px 10px;
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(234, 179, 8, 0.05));
  border: 1px solid rgba(234, 179, 8, 0.35);
  border-radius: 99px;
  font-size: 10px;
  font-weight: 600;
  color: #facc15;
}
.mp-mod-badge .mi { font-size: 13px; }

.mp-mod-bar {
  margin: 8px 0;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  box-sizing: border-box;
}
.mp-mod-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--md-on-surface-variant, #a1a1aa);
  margin-bottom: 6px;
}
.mp-mod-head .mi { font-size: 14px; color: var(--md-primary, #7c4dff); }
.mp-mod-head strong { color: var(--md-on-surface, #f4f4f5); }

.mp-mod-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.mp-mod-chip {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--md-on-surface, #e4e4e7);
  cursor: pointer;
  transition: all 0.15s ease;
}
.mp-mod-chip:hover {
  background: rgba(124, 77, 255, 0.18);
  border-color: var(--md-primary, #7c4dff);
}
.mp-mod-chip.on {
  background: var(--md-primary, #7c4dff);
  border-color: var(--md-primary, #7c4dff);
  color: #fff;
}

.mp-mod-speed-vol {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
.mp-speed-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.mp-vol-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.mp-vol-row .mi { font-size: 16px; color: var(--md-primary); }
.mp-vol-track {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 99px;
  overflow: hidden;
}
.mp-vol-fill {
  display: block;
  height: 100%;
  background: var(--md-primary, #7c4dff);
}
.mp-vol-num { font-size: 10px; color: var(--md-on-surface-variant); font-family: monospace; }

.mp-queue-preview {
  margin: 8px 0;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}
.mp-qp-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  margin-bottom: 6px;
}
.mp-qp-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 11px;
  transition: background 0.12s;
}
.mp-qp-item:hover, .mp-qp-item.is-active {
  background: rgba(124, 77, 255, 0.12);
}
.mp-qp-idx { font-weight: 700; color: var(--md-primary); width: 14px; }
.mp-qp-meta { flex: 1; display: flex; flex-direction: column; }
.mp-qp-meta strong { font-size: 11px; }
.mp-qp-meta small { font-size: 9.5px; color: var(--md-on-surface-variant); }
.mp-qp-play { font-size: 16px; color: var(--md-primary); }
/* ==========================================================================
   PURE MATERIAL DESIGN 3 MUSIC COMPONENTS (Adapts to Active Theme)
   ========================================================================== */

/* 1. DOWNLOAD OPTIONS CARD */
.download-card {
  margin: 10px var(--pad-x, 16px);
  padding: 16px;
  border-radius: var(--md-radius, 16px);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dlc-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dlc-art {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dlc-art .mi { font-size: 24px; }
.dlc-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.dlc-title { font-size: 13.5px; font-weight: 700; color: var(--md-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dlc-sub { font-size: 11px; color: var(--md-on-surface-variant); margin-top: 2px; }
.dlc-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 99px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  flex-shrink: 0;
}
.dlc-badge .mi { font-size: 13px; }

.dlc-storage-meter {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
}
.dlc-storage-info {
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--md-on-surface-variant);
  font-weight: 600;
}
.dlc-storage-bar {
  width: 100%;
  height: 6px;
  border-radius: 99px;
  background: var(--md-outline-variant);
  overflow: hidden;
}
.dlc-sm-fill {
  height: 100%;
  border-radius: 99px;
  background: var(--md-primary);
  transition: width 0.3s ease;
}

.dlc-quality-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dlc-opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  color: var(--md-on-surface);
  cursor: pointer;
  text-align: left;
  transition: all 0.12s ease;
}
.dlc-opt:hover {
  background: var(--md-surface-container-high);
}
.dlc-opt.is-active {
  background: var(--md-primary-container);
  border-color: var(--md-primary);
  color: var(--md-on-primary-container);
}
.dlc-opt-info { flex: 1; min-width: 0; }
.dlc-opt-top { display: flex; align-items: center; justify-content: space-between; }
.dlc-opt-top strong { font-size: 12.5px; }
.dlc-opt-size { font-size: 11px; font-weight: 700; color: var(--md-primary); }
.dlc-opt.is-active .dlc-opt-size { color: var(--md-on-primary-container); }
.dlc-opt small { display: block; font-size: 10px; color: var(--md-on-surface-variant); margin-top: 1px; }

.dlc-storage-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dlc-sec-label { font-size: 11px; font-weight: 700; color: var(--md-on-surface-variant); flex-shrink: 0; }
.dlc-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.dlc-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 99px;
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline-variant);
  color: var(--md-on-surface);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.dlc-chip.on {
  background: var(--md-primary-container);
  border-color: var(--md-primary);
  color: var(--md-on-primary-container);
}
.dlc-chip .mi { font-size: 13px; }

.dlc-extras {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.dlc-chk {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}
.dlc-chk input { accent-color: var(--md-primary); }

.dlc-main-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 99px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: none;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.12s;
}
.dlc-main-btn:hover { opacity: 0.92; }
.dlc-main-btn .mi { font-size: 18px; }

/* 2. PLAY MUSIC CARD (Album Spotlight) */
.play-card {
  margin: 10px var(--pad-x, 16px);
  padding: 16px;
  border-radius: var(--md-radius, 16px);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.plc-spotlight {
  display: flex;
  gap: 14px;
  align-items: center;
}
.plc-art-wrap {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 12px;
  flex-shrink: 0;
  overflow: hidden;
}
.plc-art {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(145deg, var(--md-primary) 0%, var(--md-tertiary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.plc-art .mi { font-size: 40px; }
.plc-vinyl-disc {
  position: absolute;
  top: 4px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, #222 20%, #111 40%, #333 60%, #111 80%);
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
}
.plc-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.plc-kicker { font-size: 10px; font-weight: 700; color: var(--md-primary); letter-spacing: 0.08em; text-transform: uppercase; }
.plc-title { font-size: 14px; font-weight: 700; color: var(--md-on-surface); margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.plc-artist { font-size: 11.5px; color: var(--md-on-surface-variant); margin-top: 1px; }
.plc-tags { font-size: 10px; color: var(--md-on-surface-variant); margin-top: 4px; }
.plc-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.plc-play-fab {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,0.18);
}
.plc-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 99px;
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline-variant);
  color: var(--md-on-surface);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.plc-btn.is-liked { background: var(--md-primary-container); color: var(--md-primary); border-color: var(--md-primary); }
.plc-btn .mi { font-size: 15px; }

/* 3. MUSIC LISTING */
.music-listing {
  margin: 10px var(--pad-x, 16px);
  padding: 16px;
  border-radius: var(--md-radius, 16px);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
}
.ml-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--md-outline-variant);
}
.ml-kicker { font-size: 10px; font-weight: 700; color: var(--md-primary); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 2px; }
.ml-head-title { font-size: 15px; font-weight: 700; color: var(--md-on-surface); margin: 0; }
.ml-shuffle-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 99px;
  background: var(--md-primary-container);
  border: 1px solid var(--md-primary);
  color: var(--md-on-primary-container);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.ml-shuffle-all-btn .mi { font-size: 14px; }

.ml-view-tabs {
  display: flex;
  gap: 6px;
  padding: 4px;
  margin-bottom: 12px;
  background: var(--md-surface-container-high);
  border-radius: 12px;
  border: 1px solid var(--md-outline-variant);
}
.ml-vtab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--md-on-surface-variant);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
}
.ml-vtab.is-active {
  background: var(--md-primary);
  color: var(--md-on-primary);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.ml-vtab .mi { font-size: 14px; }

.ml-rows { display: flex; flex-direction: column; gap: 2px; }
.ml-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s;
}
.ml-row:hover { background: var(--md-surface-container-high); }
.ml-row.is-active { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.ml-idx { width: 20px; font-size: 11px; font-weight: 700; color: var(--md-on-surface-variant); text-align: center; }
.ml-eq-wave { width: 20px; height: 14px; display: flex; align-items: flex-end; justify-content: center; gap: 2px; }
.ml-eq-wave i { display: block; width: 2.5px; background: var(--md-primary); border-radius: 1px; animation: ml-wave 0.8s ease-in-out infinite alternate; }
.ml-eq-wave i:nth-child(2) { animation-delay: -0.4s; height: 100%; }
.ml-eq-wave i:nth-child(3) { animation-delay: -0.2s; height: 60%; }
@keyframes ml-wave { 0% { height: 20%; } 100% { height: 100%; } }

.ml-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--md-surface-container-high);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  color: var(--md-primary);
}
.ml-thumb .mi { font-size: 20px; }
.ml-hover-play { position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: #fff; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.12s; }
.ml-row:hover .ml-hover-play { opacity: 1; }

.ml-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.ml-title-row { display: flex; align-items: center; gap: 6px; }
.ml-title { font-size: 12.5px; font-weight: 650; color: var(--md-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ml-row.is-active .ml-title { color: var(--md-on-primary-container); }
.ml-badge { font-size: 8.5px; font-weight: 700; padding: 1px 4px; border-radius: 4px; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }
.ml-artist { font-size: 10.5px; color: var(--md-on-surface-variant); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ml-row.is-active .ml-artist { color: var(--md-on-primary-container); opacity: 0.8; }
.ml-dur { font-size: 10.5px; color: var(--md-on-surface-variant); font-variant-numeric: tabular-nums; }
.ml-actions { display: flex; align-items: center; gap: 2px; }
.ml-act-btn { background: none; border: none; color: var(--md-on-surface-variant); cursor: pointer; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.ml-act-btn:hover { color: var(--md-on-surface); }
.ml-act-btn.is-liked { color: var(--md-primary); }
.ml-act-btn.is-downloaded { color: var(--md-primary); }
.ml-act-btn .mi { font-size: 16px; }

/* Albums Grid (Material 3 Native) */
.ml-albums-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.ml-album-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 14px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  transition: all 0.12s ease;
}
.ml-album-card:hover { background: var(--md-surface-container-high); }
.ml-album-cover-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ml-album-vinyl {
  position: absolute;
  top: 4px;
  right: -10px;
  width: 85%;
  height: 85%;
  border-radius: 50%;
  background: radial-gradient(circle, #222 20%, #111 40%, #333 60%, #111 80%);
  opacity: 0.7;
  pointer-events: none;
}
.ml-album-art {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.ml-album-art .mi { font-size: 38px; }
.ml-album-play-fab {
  position: absolute;
  z-index: 3;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #17141d;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}
.ml-album-play-fab .mi { font-size: 18px; }
.ml-album-info { margin-top: 8px; display: flex; flex-direction: column; gap: 2px; }
.ml-album-title { font-size: 12.5px; font-weight: 700; color: var(--md-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ml-album-artist { font-size: 11px; color: var(--md-on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ml-album-sub { display: flex; align-items: center; gap: 4px; font-size: 9.5px; color: var(--md-on-surface-variant); margin-top: 2px; }
.ml-genre-badge { margin-left: auto; font-size: 8.5px; font-weight: 700; padding: 1px 5px; border-radius: 4px; background: var(--md-primary-container); color: var(--md-on-primary-container); }
.ml-album-actions { display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--md-outline-variant); }

/* Artists List (Material 3 Native) */
.ml-artists-list { display: flex; flex-direction: column; gap: 6px; }
.ml-artist-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 12px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  transition: all 0.12s ease;
}
.ml-artist-row:hover { background: var(--md-surface-container-high); }
.ml-artist-avatar-wrap { position: relative; flex-shrink: 0; }
.ml-artist-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border: 2px solid var(--md-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ml-artist-avatar .mi { font-size: 22px; }
.ml-artist-badge { display: none; }
.ml-artist-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ml-artist-name-row { display: flex; align-items: center; gap: 6px; }
.ml-artist-name { font-size: 13px; font-weight: 700; color: var(--md-on-surface); }
.ml-verified-chip { font-size: 8.5px; font-weight: 700; padding: 1px 5px; border-radius: 99px; background: var(--md-primary-container); color: var(--md-on-primary-container); }
.ml-artist-listeners { font-size: 10.5px; color: var(--md-on-surface-variant); }
.ml-artist-top-track { font-size: 9.5px; color: var(--md-primary); display: flex; align-items: center; gap: 3px; }
.ml-artist-top-track .mi { font-size: 11px; }
.ml-artist-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.ml-follow-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid var(--md-outline-variant);
  background: transparent;
  color: var(--md-on-surface);
  cursor: pointer;
  transition: all 0.12s ease;
}
.ml-follow-btn:hover { background: var(--md-surface-container-high); }
.ml-follow-btn.is-following { background: var(--md-primary); color: var(--md-on-primary); border-color: var(--md-primary); }
.ml-follow-btn .mi { font-size: 13px; }

/* Beats / Audio List (Material 3 Native) */
.ml-beats-list { display: flex; flex-direction: column; gap: 8px; }
.ml-beat-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  transition: all 0.12s ease;
}
.ml-beat-card:hover { background: var(--md-surface-container-high); }
.ml-beat-head { display: flex; align-items: center; gap: 10px; }
.ml-beat-cover {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border: 1px solid var(--md-outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ml-beat-cover .mi { font-size: 20px; }
.ml-beat-play-btn {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.12s;
}
.ml-beat-card:hover .ml-beat-play-btn, .ml-beat-play-btn.is-playing { opacity: 1; }
.ml-beat-play-btn.is-playing { background: var(--md-primary); }
.ml-beat-play-btn .mi { font-size: 20px; }
.ml-beat-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ml-beat-title { font-size: 12.5px; font-weight: 700; color: var(--md-on-surface); }
.ml-beat-prod { font-size: 10px; color: var(--md-on-surface-variant); }
.ml-beat-chips { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.ml-chip { display: inline-flex; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }
.ml-chip .mi { font-size: 11px; }
.ml-chip-bpm { color: var(--md-primary); }
.ml-chip-key { color: var(--md-on-surface); }
.ml-chip-dur { color: var(--md-on-surface-variant); }
.ml-beat-price-col { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.ml-beat-license { font-size: 9.5px; color: var(--md-on-surface-variant); font-weight: 600; }
.ml-beat-buy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: none;
  font-size: 10.5px;
  font-weight: 700;
  cursor: pointer;
}
.ml-beat-buy-btn .mi { font-size: 12px; }
.ml-beat-waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 18px;
  padding: 2px 4px;
  border-radius: 4px;
  background: var(--md-surface-container-high);
}
.ml-beat-wave-bar { flex: 1; background: var(--md-outline-variant); border-radius: 1px; }
.ml-beat-wave-bar.is-passed { background: var(--md-primary); }

/* 4. SHUFFLE & RADIO CARD */
.shuffle-radio-card {
  position: relative;
  margin: 10px var(--pad-x, 16px);
  padding: 16px;
  border-radius: var(--md-radius, 16px);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sfr-top { display: flex; align-items: flex-start; justify-content: space-between; }
.sfr-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  margin-bottom: 4px;
}
.sfr-badge .mi { font-size: 12px; }
.sfr-title { font-size: 15px; font-weight: 700; color: var(--md-on-surface); margin: 0; }
.sfr-sub { font-size: 11px; color: var(--md-on-surface-variant); margin-top: 2px; }
.sfr-fab-shuffle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--md-primary);
  color: var(--md-on-primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.18);
}
.sfr-fab-shuffle .mi { font-size: 22px; }
.sfr-modes-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
.sfr-mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  color: var(--md-on-surface);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
}
.sfr-mode-btn:hover { background: var(--md-surface-container-high); }
.sfr-mode-btn.is-active { background: var(--md-primary-container); border-color: var(--md-primary); color: var(--md-on-primary-container); }
.sfr-now { padding: 8px 10px; border-radius: 10px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); }
.sfr-now-label { font-size: 10px; color: var(--md-on-surface-variant); font-weight: 600; display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.sfr-now-label .mi { font-size: 13px; }
.sfr-now-track { font-size: 12px; font-weight: 700; color: var(--md-on-surface); }
.sfr-queue { display: flex; flex-direction: column; gap: 4px; }
.sfr-queue-head { font-size: 10.5px; font-weight: 700; color: var(--md-on-surface-variant); display: flex; align-items: center; gap: 4px; }
.sfr-queue-head .mi { font-size: 13px; }
.sfr-queue-list { display: flex; flex-direction: column; gap: 4px; }
.sfr-qitem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  font-size: 11px;
  color: var(--md-on-surface);
}

/* 5. RECOMMENDATIONS (Material 3 Native - Clean Card Grid) */
.music-recommendations {
  margin: 10px var(--pad-x, 16px);
  padding: 16px;
  border-radius: var(--md-radius, 16px);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rec-head-info { display: flex; flex-direction: column; gap: 2px; }
.rec-kicker { font-size: 10px; font-weight: 700; color: var(--md-primary); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px; }
.rec-header .rec-title { font-size: 15px; font-weight: 700; color: var(--md-on-surface); margin: 0; }
.rec-reason { font-size: 11.5px; color: var(--md-on-surface-variant); margin: 2px 0 0; }
.rec-head-tools { display: flex; align-items: center; gap: 4px; }
.rec-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline-variant);
  color: var(--md-on-surface-variant);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.rec-arrow:hover { color: var(--md-on-surface); }
.rec-arrow .mi { font-size: 18px; }

.rec-rail {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scrollbar-width: none;
}
.rec-rail::-webkit-scrollbar { display: none; }

.rec-card {
  width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
}
.rec-grid .rec-rail {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  overflow-x: visible;
}
.rec-grid .rec-card { width: auto; }

.rec-art {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--md-radius, 12px);
  overflow: hidden;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(145deg, var(--md-primary) 0%, var(--md-tertiary) 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.rec-card:nth-child(3n + 2) .rec-art {
  background: linear-gradient(145deg, var(--md-tertiary) 0%, var(--md-primary) 100%);
}
.rec-card:nth-child(3n + 3) .rec-art {
  background: linear-gradient(145deg, color-mix(in srgb, var(--md-primary) 54%, var(--md-surface-container-high)) 0%, var(--md-primary) 100%);
}
.rec-art-glyph { font-size: 38px; opacity: 0.88; }
.rec-match-pill {
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 99px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  color: #fff;
}
.rec-play-btn {
  position: absolute;
  right: 7px;
  bottom: 7px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #17141d;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  transition: transform 0.12s ease;
}
.rec-play-btn:hover { transform: scale(1.1); }
.rec-play-btn .mi { font-size: 18px; }

.rec-meta {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.rec-card .rec-title {
  font-size: 12.5px;
  font-weight: 650;
  color: var(--md-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.rec-artist {
  font-size: 11px;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rec-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
.rec-genre { font-size: 9px; color: var(--md-on-surface-variant); opacity: 0.8; }
.rec-add-btn {
  background: none;
  border: none;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
}
.rec-add-btn:hover { color: var(--md-primary); }
.rec-add-btn .mi { font-size: 15px; }


/* =================================================================
   CLOCK DIAL SLEEP TIMER & STUDIO MASTER GRAPHIC EQUALIZER
   ================================================================= */

/* Clock Dial Sleep Timer */
.mp-clock-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0 14px;
}
.mp-clock-dial {
  position: relative;
  width: 150px;
  height: 150px;
  user-select: none;
}
.mp-clock-svg {
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
  overflow: visible;
}
.mp-clock-bg {
  fill: color-mix(in srgb, var(--md-surface-container-high, #2a2a2e) 85%, transparent);
  stroke: var(--md-outline-variant, rgba(255, 255, 255, 0.12));
  stroke-width: 1;
}
.mp-clock-track {
  fill: none;
  stroke: color-mix(in srgb, var(--md-on-surface, #fff) 10%, transparent);
  stroke-width: 6;
}
.mp-clock-arc {
  fill: none;
  stroke: var(--md-primary, #a87ffb);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--md-primary, #a87ffb) 50%, transparent));
}
.mp-clk-tick {
  stroke: color-mix(in srgb, var(--md-on-surface, #fff) 25%, transparent);
  stroke-width: 1.5;
  stroke-linecap: round;
}
.mp-clk-tick.major {
  stroke: var(--md-primary, #a87ffb);
  stroke-width: 2.2;
}
.mp-clock-hand {
  stroke: var(--md-primary, #a87ffb);
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.mp-clock-pointer {
  fill: var(--md-primary, #a87ffb);
  stroke: var(--md-surface, #1e1e24);
  stroke-width: 2;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));
}
.mp-clock-pivot {
  fill: var(--md-surface-container-highest, #202124);
  stroke: var(--md-outline-variant, rgba(255, 255, 255, 0.15));
  stroke-width: 1.5;
}
.mp-clock-center-readout {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}
.mp-clock-val {
  font-size: 13px;
  font-weight: 800;
  color: var(--md-on-surface, #fff);
  font-family: monospace;
  letter-spacing: -0.02em;
}
.mp-clock-lbl {
  font-size: 7.5px;
  font-weight: 700;
  color: var(--md-primary, #a87ffb);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.mp-clk-node {
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.15));
  background: var(--md-surface-container, #282830);
  color: var(--md-on-surface-variant, #ccc);
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
  z-index: 3;
}
.mp-clk-node:hover {
  background: var(--md-primary-container, #3d2b6b);
  color: var(--md-on-primary-container, #e8ddff);
  border-color: var(--md-primary, #a87ffb);
}
.mp-clk-node.on {
  background: var(--md-primary, #a87ffb);
  color: var(--md-on-primary, #1e0066);
  border-color: var(--md-primary, #a87ffb);
  box-shadow: 0 0 10px color-mix(in srgb, var(--md-primary, #a87ffb) 60%, transparent);
}
.mp-clk-node.node-15 { top: 50%; right: -2px; transform: translateY(-50%); }
.mp-clk-node.node-30 { bottom: -2px; left: 50%; transform: translateX(-50%); }
.mp-clk-node.node-45 { top: 50%; left: -2px; transform: translateY(-50%); }
.mp-clk-node.node-60 { top: -2px; left: 50%; transform: translateX(-50%); }
.mp-timer-sub-tag {
  font-size: 9.5px;
  color: var(--md-on-surface-variant, #aaa);
  margin-left: auto;
}

/* Studio Master Graphic Equalizer Rack */
.mp-mod-eq-rack {
  background: color-mix(in srgb, var(--md-surface-container-high, #222228) 85%, #000 15%);
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.12));
  border-radius: calc(var(--md-radius, 16px) + 2px);
  padding: 12px 14px;
}
.mp-vu-mini-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.mp-vu-mini {
  display: flex;
  align-items: center;
  gap: 4px;
}
.mp-vu-mini-bar {
  width: 32px;
  height: 6px;
  background: color-mix(in srgb, var(--md-on-surface, #fff) 12%, transparent);
  border-radius: 99px;
  overflow: hidden;
}
.mp-vu-mini-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #f59e0b 70%, #ef4444 100%);
  border-radius: 99px;
}
.mp-vu-mini-fill.live {
  animation: mp-vu-pulse 0.7s ease-in-out infinite alternate;
}
@keyframes mp-vu-pulse {
  0% { width: 30%; }
  100% { width: 92%; }
}
.mp-eq-curve-card {
  margin: 10px 0 14px;
  background: color-mix(in srgb, var(--md-surface-container-lowest, #111) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant, #333) 50%, transparent);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.mp-eq-curve-svg {
  width: 100%;
  height: 70px;
  display: block;
}
.mp-eq-grid-line {
  stroke: color-mix(in srgb, var(--md-on-surface, #fff) 8%, transparent);
  stroke-width: 1;
  stroke-dasharray: 2 3;
}
.mp-eq-grid-line.zero {
  stroke: color-mix(in srgb, var(--md-primary, #a87ffb) 30%, transparent);
  stroke-width: 1.2;
  stroke-dasharray: none;
}
.mp-eq-grid-txt {
  font-size: 7px;
  fill: var(--md-on-surface-variant, #888);
  font-family: monospace;
}
.mp-eq-curve-stroke {
  fill: none;
  stroke: var(--md-primary, #a87ffb);
  stroke-width: 2.5;
  stroke-linecap: round;
  filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--md-primary, #a87ffb) 60%, transparent));
}
.mp-eq-curve-pt {
  fill: var(--md-primary, #a87ffb);
  stroke: #fff;
  stroke-width: 1.5;
}
.mp-eq-faders-grid {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  height: 110px;
  margin: 6px 0 12px;
  padding: 0 4px;
}
.mp-eq-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}
.mp-eq-db {
  font-size: 8.5px;
  font-weight: 700;
  color: var(--md-primary, #a87ffb);
  font-family: monospace;
  margin-bottom: 4px;
}
.mp-eq-track {
  position: relative;
  width: 10px;
  flex: 1;
  background: color-mix(in srgb, var(--md-on-surface, #fff) 10%, transparent);
  border-radius: 99px;
  display: flex;
  align-items: flex-end;
}
.mp-eq-zero-line {
  position: absolute;
  top: 50%;
  left: -2px;
  right: -2px;
  height: 1px;
  background: color-mix(in srgb, var(--md-on-surface, #fff) 25%, transparent);
  pointer-events: none;
}
.mp-eq-fill {
  width: 100%;
  background: linear-gradient(0deg, var(--md-primary, #a87ffb), var(--md-tertiary, #ffb4a9));
  border-radius: 99px;
  pointer-events: none;
}
.mp-eq-thumb {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 18px;
  height: 10px;
  border-radius: 4px;
  background: var(--md-primary, #a87ffb);
  border: 1.5px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  pointer-events: none;
  transition: bottom 0.15s ease;
}
.mp-eq-range {
  position: absolute;
  inset: -4px;
  opacity: 0;
  cursor: ns-resize;
  z-index: 5;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  margin: 0;
}
.mp-eq-hz {
  font-size: 9px;
  font-weight: 700;
  color: var(--md-on-surface, #fff);
  margin-top: 6px;
  font-family: monospace;
}
.mp-eq-subtag {
  font-size: 7.5px;
  color: var(--md-on-surface-variant, #aaa);
  text-transform: uppercase;
}


/* ==========================================================================
   Dedicated Music Player Views, Dropdown Menu & Custom Timing Builder
   ========================================================================== */

/* Top Header Menu Wrap & Dropdown Menu */
.ui-pm-menu-wrap {
  position: relative;
  display: inline-flex;
}
.ui-pm-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 236px;
  background: color-mix(in srgb, var(--md-surface-container-high, #2b2930) 96%, #000 4%);
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.14));
  border-radius: 18px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0,0,0,0.3);
  padding: 6px;
  z-index: 80;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: pm-menu-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
  backdrop-filter: blur(16px);
}
.ui-pm-dropdown-menu[hidden] {
  display: none !important;
}
@keyframes pm-menu-pop {
  from { opacity: 0; transform: scale(0.92) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.ui-pm-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 0;
  background: transparent;
  color: var(--md-on-surface, #fff);
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 100%;
  box-sizing: border-box;
}
.ui-pm-menu-item:hover {
  background: color-mix(in srgb, var(--md-primary, #a87ffb) 16%, transparent);
  transform: translateX(2px);
}
.ui-pm-menu-item .mi {
  font-size: 22px;
  color: var(--md-primary, #a87ffb);
  flex-shrink: 0;
}
.ui-pm-mi-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.ui-pm-mi-text strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--md-on-surface, #fff);
}
.ui-pm-mi-text small {
  font-size: 11px;
  color: var(--md-on-surface-variant, #aaa);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-pm-menu-sep {
  height: 1px;
  background: var(--md-outline-variant, rgba(255, 255, 255, 0.1));
  margin: 4px 6px;
}

/* Dedicated Sub-Views inside Player Modal */
.ui-pm-view {
  display: none;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  box-sizing: border-box;
  animation: pm-view-fade 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}
.ui-pm-view.is-active {
  display: flex;
}
@keyframes pm-view-fade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.ui-pm-sub-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.1));
}
.ui-pm-back-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: color-mix(in srgb, var(--md-on-surface, #fff) 8%, transparent);
  color: var(--md-on-surface, #fff);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.18s ease;
  flex-shrink: 0;
}
.ui-pm-back-btn:hover {
  background: color-mix(in srgb, var(--md-primary, #a87ffb) 25%, transparent);
  color: var(--md-primary, #a87ffb);
  transform: translateX(-3px);
}
.ui-pm-back-btn .mi { font-size: 20px; }
.ui-pm-sub-title {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}
.ui-pm-sub-title strong {
  font-size: 16px;
  font-weight: 700;
  color: var(--md-on-surface, #fff);
  letter-spacing: -0.01em;
}
.ui-pm-sub-title small {
  font-size: 11px;
  color: var(--md-on-surface-variant, #aaa);
}
.ui-pm-head-action {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.15));
  background: transparent;
  color: var(--md-on-surface-variant, #aaa);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.ui-pm-head-action:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}
.ui-pm-head-action .mi { font-size: 16px; }

/* Quick Action Bar on Main Player View */
.ui-pm-quick-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 14px 0 6px;
  flex-wrap: wrap;
}
.ui-pm-quick-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--md-surface-container-high, #2b2930) 85%, transparent);
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.14));
  color: var(--md-on-surface, #fff);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.ui-pm-quick-chip:hover {
  background: color-mix(in srgb, var(--md-primary, #a87ffb) 18%, transparent);
  border-color: var(--md-primary, #a87ffb);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--md-primary, #a87ffb) 20%, transparent);
}
.ui-pm-quick-chip .mi {
  font-size: 17px;
  color: var(--md-primary, #a87ffb);
}
.ui-pm-quick-chip strong {
  color: var(--md-primary, #a87ffb);
  font-weight: 600;
}

/* Custom Timing Builder in Dedicated Sleep Timer Page */
.mp-custom-builder {
  background: color-mix(in srgb, var(--md-surface-container-high, #2b2930) 80%, transparent);
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.12));
  border-radius: 18px;
  padding: 16px;
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mp-custom-builder-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mp-custom-builder-head span {
  font-size: 13px;
  font-weight: 600;
  color: var(--md-on-surface, #fff);
}
.mp-custom-hint {
  font-size: 11px;
  color: var(--md-on-surface-variant, #aaa);
}
.mp-custom-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.mp-stepper-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.16));
  background: color-mix(in srgb, var(--md-surface-container-highest, #36343b) 80%, transparent);
  color: var(--md-on-surface, #fff);
  font-size: 15px;
  font-weight: 700;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.mp-stepper-btn:hover {
  background: var(--md-primary, #a87ffb);
  color: #000;
  border-color: var(--md-primary, #a87ffb);
}
.mp-custom-input-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: color-mix(in srgb, var(--md-surface-container-lowest, #141218) 90%, transparent);
  border: 1.5px solid var(--md-primary, #a87ffb);
  border-radius: 14px;
  padding: 6px 14px;
  box-shadow: 0 0 14px color-mix(in srgb, var(--md-primary, #a87ffb) 22%, transparent);
}
.mp-custom-input {
  width: 60px;
  background: transparent;
  border: 0;
  color: var(--md-on-surface, #fff);
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  outline: none;
  font-family: monospace;
}
.mp-custom-input-box span {
  font-size: 14px;
  font-weight: 600;
  color: var(--md-primary, #a87ffb);
  text-transform: uppercase;
}
.mp-timer-add-chips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.mp-timer-add-chip {
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.14));
  background: color-mix(in srgb, var(--md-surface-container-highest, #36343b) 75%, transparent);
  color: var(--md-on-surface, #fff);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.mp-timer-add-chip:hover {
  background: color-mix(in srgb, var(--md-primary, #a87ffb) 25%, transparent);
  border-color: var(--md-primary, #a87ffb);
  transform: translateY(-1px);
}
.mp-timer-toggles {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
.mp-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--md-surface-container-lowest, #141218) 60%, transparent);
  border-radius: 12px;
  cursor: pointer;
}
.mp-toggle-row span {
  font-size: 12px;
  color: var(--md-on-surface, #fff);
  display: flex;
  align-items: center;
  gap: 8px;
}
.mp-toggle-row .mi {
  font-size: 17px;
  color: var(--md-primary, #a87ffb);
}
.mp-timer-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.mp-timer-start-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px;
  border-radius: 14px;
  border: 0;
  background: var(--md-primary, #a87ffb);
  color: #000;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--md-primary, #a87ffb) 35%, transparent);
  transition: all 0.2s ease;
}
.mp-timer-start-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--md-primary, #a87ffb) 50%, transparent);
}
.mp-timer-cancel-btn {
  padding: 13px 18px;
  border-radius: 14px;
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.15));
  background: transparent;
  color: var(--md-on-surface-variant, #aaa);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.mp-timer-cancel-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Dedicated Equalizer Studio Controls */
.mp-eq-fx-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 16px 0;
}
.mp-eq-rotary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: color-mix(in srgb, var(--md-surface-container-high, #2b2930) 80%, transparent);
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
}
.mp-eq-rotary-dial {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--md-surface-container-lowest, #141218) 95%, transparent);
  border: 2px solid var(--md-primary, #a87ffb);
  display: grid;
  place-items: center;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.5), 0 0 10px color-mix(in srgb, var(--md-primary, #a87ffb) 25%, transparent);
  user-select: none;
}
.mp-eq-rotary-val {
  font-size: 13px;
  font-weight: 800;
  color: var(--md-primary, #a87ffb);
  font-family: monospace;
}
.mp-eq-rotary-lbl {
  font-size: 11px;
  font-weight: 600;
  color: var(--md-on-surface, #fff);
  text-align: center;
}
.mp-eq-rotary-sub {
  font-size: 9px;
  color: var(--md-on-surface-variant, #aaa);
}
.mp-eq-master-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
}
.mp-eq-master-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.mp-eq-switch-slider {
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, var(--md-on-surface, #fff) 20%, transparent);
  border-radius: 99px;
  transition: .3s;
}
.mp-eq-switch-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .3s;
}
.mp-eq-master-switch input:checked + .mp-eq-switch-slider {
  background-color: var(--md-primary, #a87ffb);
}
.mp-eq-master-switch input:checked + .mp-eq-switch-slider:before {
  transform: translateX(20px);
}


/* ==========================================================================
   Music Shuffle Cards (4 Square Rounded Cards & Category Tabs)
   ========================================================================== */

.music-shuffle-cards {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* Header */
.sc-header {
  margin-bottom: 12px;
}
.sc-kicker {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--md-primary, #a87ffb);
  display: block;
  margin-bottom: 3px;
}
.sc-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--md-on-surface, #fff);
  margin: 0 0 2px 0;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.sc-subtitle {
  font-size: 12px;
  color: var(--md-on-surface-variant, #aaa);
  margin: 0;
  line-height: 1.25;
}

/* Category Filter Tabs with Small Rounded Boxes */
.sc-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 14px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.sc-tabs::-webkit-scrollbar {
  display: none;
}
.sc-tab {
  padding: 7px 16px;
  border-radius: 12px;
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.12));
  background: color-mix(in srgb, var(--md-surface-container, #24242a) 85%, transparent);
  color: var(--md-on-surface, #fff);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.sc-tab:hover {
  background: color-mix(in srgb, var(--md-primary, #a87ffb) 16%, transparent);
  border-color: var(--md-primary, #a87ffb);
  transform: translateY(-1px);
}
.sc-tab.is-active {
  background: var(--md-primary, #a87ffb);
  color: #000;
  border-color: var(--md-primary, #a87ffb);
  font-weight: 700;
  box-shadow: 0 2px 10px color-mix(in srgb, var(--md-primary, #a87ffb) 40%, transparent);
}

/* Cards Containers & Layout Variations */
.shuffle-cards-container {
  width: 100%;
  box-sizing: border-box;
}

/* 1. Default 4 Square Rounded Cards (2x2 Grid - User Screenshot) */
.shuffle-cards-container.sc-grid2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 2. 6 Rounded Cards (3x2 Grid) */
.shuffle-cards-container.sc-grid3x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 3. Horizontal Scrolling Cards Rail */
.shuffle-cards-container.sc-carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.shuffle-cards-container.sc-carousel::-webkit-scrollbar {
  display: none;
}
.shuffle-cards-container.sc-carousel .sc-card {
  flex: 0 0 150px;
  scroll-snap-align: start;
}

/* 4. Featured Hero Shuffle + 2 Stacked */
.shuffle-cards-container.sc-featured {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 12px;
}
.shuffle-cards-container.sc-featured .sc-card:first-child {
  grid-row: span 2;
  min-height: 100%;
}

/* 5. Compact Rounded Squircles */
.shuffle-cards-container.sc-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.shuffle-cards-container.sc-compact .sc-card {
  min-height: 96px;
  padding: 12px 10px;
  border-radius: 18px;
}

/* Square Rounded Card Base */
.sc-card {
  min-height: 126px;
  border-radius: 24px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  background: color-mix(in srgb, var(--md-surface-container, #222228) 90%, #000 10%);
  border: 1px solid var(--md-outline-variant, rgba(255, 255, 255, 0.08));
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

/* Light & Dark surface adaptation */
[data-ui="light"] .sc-card {
  background: #f1f3f7;
  border-color: rgba(0, 0, 0, 0.07);
}
[data-ui="dark"] .sc-card {
  background: #23242b;
  border-color: rgba(255, 255, 255, 0.08);
}

.sc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
  border-color: color-mix(in srgb, var(--md-primary, #a87ffb) 40%, transparent);
}
.sc-card.is-active {
  border: 1.5px solid var(--md-primary, #a87ffb);
  box-shadow: 0 0 16px color-mix(in srgb, var(--md-primary, #a87ffb) 25%, transparent);
}

/* Icon Badges (Circle for Shuffle, Squircle for Songs) */
.sc-badge {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  position: relative;
  margin-bottom: 12px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.sc-card:hover .sc-badge {
  transform: scale(1.05);
}
.sc-badge-circle {
  border-radius: 50%;
}
.sc-badge-squircle {
  border-radius: 14px;
}
.sc-badge-icon {
  font-size: 22px;
}

/* Playing Animated Equalizer Wave on Active Card */
.sc-live-eq {
  position: absolute;
  bottom: -2px;
  right: -2px;
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 14px;
  padding: 2px 3px;
  background: var(--md-primary, #a87ffb);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.sc-live-eq i {
  display: block;
  width: 2px;
  height: 100%;
  background: #000;
  border-radius: 1px;
  animation: sc-wave-bar 0.7s infinite ease-in-out alternate;
}
.sc-live-eq i:nth-child(1) { animation-delay: 0.1s; height: 50%; }
.sc-live-eq i:nth-child(2) { animation-delay: 0.3s; height: 100%; }
.sc-live-eq i:nth-child(3) { animation-delay: 0.2s; height: 70%; }

@keyframes sc-wave-bar {
  0% { height: 25%; }
  100% { height: 100%; }
}

/* Song Name and Artist at the Bottom of Every Rounded Card */
.sc-text {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
}
.sc-card-title {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--md-on-surface, #fff);
  line-height: 1.25;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}
.sc-card-artist {
  font-size: 12.5px;
  font-weight: 400;
  color: var(--md-on-surface-variant, #aaa);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

`;
})();
