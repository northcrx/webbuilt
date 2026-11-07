const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Users\\nisha\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe';
const PORT = 9499;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Spawning Chrome on port', PORT);
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1440,900',
    `--user-data-dir=${path.resolve('.chrome-cdp-profile-musicblocks2')}`,
    'about:blank'
  ]);

  await sleep(1500);

  try {
    const verRes = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    const verData = await verRes.json();
    console.log('Chrome connected:', verData.Browser);

    const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?file:///${path.resolve(__dirname, '../index.html').replace(/\\/g, '/')}`, { method: 'PUT' });
    const tabData = await newTabRes.json();

    const ws = new WebSocket(tabData.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await sleep(1200);

    // Dismiss starter modal
    await send('Runtime.evaluate', {
      expression: `(function() {
        if (Studio.App.closeStarterModal) Studio.App.closeStarterModal();
        var starterModal = document.getElementById('starter-target-modal');
        if (starterModal) starterModal.hidden = true;
      })()`
    });
    await sleep(200);

    // SCREENSHOT 1: Download Options Card
    await send('Runtime.evaluate', {
      expression: `(function() {
        Studio.App.addBlock('downloadcard');
        Studio.App.showTab('inspect');
      })()`
    });
    await sleep(800);
    const shotDlc = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, '../screenshots/36_download_options_card.png', Buffer.from(shotDlc.data, 'base64'));
    console.log('Captured screenshots/36_download_options_card.png');

    // Clear and add Play Music Card + Music Listing
    await send('Runtime.evaluate', {
      expression: `(function() {
        var page = Studio.State.data.pages[0];
        if (page) {
          page.screen = [];
          Studio.State.data.screen = page.screen;
        }
        Studio.App.addBlock('playcard');
        Studio.App.addBlock('musiclisting');
        Studio.App.showTab('inspect');
      })()`
    });
    await sleep(800);
    const shotPlayList = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, '../screenshots/37_playcard_and_musiclisting.png', Buffer.from(shotPlayList.data, 'base64'));
    console.log('Captured screenshots/37_playcard_and_musiclisting.png');

    // Clear and add Shuffle & Radio + Recommendations
    await send('Runtime.evaluate', {
      expression: `(function() {
        var page = Studio.State.data.pages[0];
        if (page) {
          page.screen = [];
          Studio.State.data.screen = page.screen;
        }
        Studio.App.addBlock('shuffleradio');
        Studio.App.addBlock('recommendations');
        Studio.App.showTab('inspect');
      })()`
    });
    await sleep(800);
    const shotShufRec = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, '../screenshots/38_shuffleradio_and_recommendations.png', Buffer.from(shotShufRec.data, 'base64'));
    console.log('Captured screenshots/38_shuffleradio_and_recommendations.png');

    ws.close();
  } catch (err) {
    console.error('Error during CDP operations:', err);
  } finally {
    chrome.kill();
    console.log('Done.');
  }
}

run();
