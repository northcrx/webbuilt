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
}
.wnav-mark .mi { font-size: 17px; }
.wnav-mark .icn { width: 17px; height: 17px; }
.wnav-links { display: flex; align-items: center; gap: 26px; flex: 1; }
.wnav-links a { font-size: 13px; font-weight: 500; color: var(--w-muted); }
.wnav-links a:first-child { color: var(--w-text); }
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
.browser-screen { flex: 1 1 auto; min-height: 0; display: flex; overflow: hidden; }
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
`;
})();
