const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const testDir = __dirname;
const files = fs.readdirSync(testDir).filter(f => f.startsWith('test_') && f.endsWith('.js'));

console.log('Running ' + files.length + ' test suites from ' + testDir + '...\n');

let allPassed = true;
let totalSuites = files.length;
let passedSuites = 0;

files.forEach(file => {
  console.log('======================================================');
  console.log('SUITE: ' + file);
  console.log('======================================================');
  try {
    const out = cp.execSync('node ' + JSON.stringify(path.join(testDir, file)), {
      encoding: 'utf8',
      cwd: path.resolve(testDir, '..')
    });
    console.log(out);
    passedSuites++;
  } catch (err) {
    console.error('FAILED: ' + file);
    console.error(err.stdout || err.message);
    allPassed = false;
  }
});

console.log('\n======================================================');
console.log('FINAL RESULT: ' + passedSuites + ' / ' + totalSuites + ' test suites passed.');
console.log('======================================================');

if (!allPassed) {
  process.exit(1);
} else {
  console.log('ALL TEST SUITES IN tests/ PASSED 100% PERFECTLY!\n');
}
