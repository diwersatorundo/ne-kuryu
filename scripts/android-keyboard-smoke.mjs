import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const outputDir = 'artifacts/keyboard';
mkdirSync(outputDir, { recursive: true });

function adb(args, options = {}) {
  return execFileSync('adb', args, {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
}

function dumpWindow() {
  adb(['shell', 'uiautomator', 'dump', '/sdcard/nicotiny-window.xml'], {
    stdio: 'ignore',
  });
  return adb(['shell', 'cat', '/sdcard/nicotiny-window.xml']);
}

function inputFromWindow(xml) {
  const nodes = xml.match(/<node[^>]*class="android\.widget\.EditText"[^>]*>/g) ?? [];
  if (nodes.length === 0) {
    throw new Error('No Android EditText found in onboarding');
  }
  return nodes[0];
}

function boundsOf(node) {
  const match = node.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
  if (!match) {
    throw new Error('EditText bounds not found');
  }
  return match.slice(1).map(Number);
}

function focused(node) {
  return /focused="true"/.test(node);
}

function keyboardShown() {
  const dump = adb(['shell', 'dumpsys', 'input_method']);
  return /\bmInputShown=true\b/.test(dump);
}

function screenshot(name) {
  const image = execFileSync('adb', ['exec-out', 'screencap', '-p']);
  writeFileSync(`${outputDir}/${name}.png`, image);
}

try {
  adb(['wait-for-device']);
  adb(['shell', 'settings', 'put', 'secure', 'show_ime_with_hard_keyboard', '1']);
  adb(['shell', 'logcat', '-c']);
  adb(['shell', 'am', 'start', '-W', '-n', 'com.nekuryu.app/.MainActivity']);
  execFileSync('sleep', ['8']);

  const initialXml = dumpWindow();
  writeFileSync(`${outputDir}/initial-window.xml`, initialXml);
  const input = inputFromWindow(initialXml);
  const [left, top, right, bottom] = boundsOf(input);
  const x = Math.round((left + right) / 2);
  const y = Math.round((top + bottom) / 2);
  console.log(`Tapping EditText at ${x},${y}`);
  adb(['shell', 'input', 'tap', String(x), String(y)]);

  let observedKeyboard = false;
  const samples = [];
  for (let index = 0; index < 10; index += 1) {
    execFileSync('sleep', ['1']);
    const xml = dumpWindow();
    const currentInput = inputFromWindow(xml);
    const currentFocus = focused(currentInput);
    const currentKeyboard = keyboardShown();
    observedKeyboard ||= currentKeyboard;
    samples.push({ second: index + 1, focused: currentFocus, keyboard: currentKeyboard });
    console.log(JSON.stringify(samples[samples.length - 1]));
    writeFileSync(`${outputDir}/window-${index + 1}.xml`, xml);
    if (index === 1 || index === 5 || index === 9) {
      screenshot(`keyboard-${index + 1}`);
    }
    if (!currentFocus) {
      throw new Error(`EditText lost focus at second ${index + 1}`);
    }
  }

  if (!observedKeyboard) {
    throw new Error('Software keyboard was not detected');
  }
} finally {
  writeFileSync(`${outputDir}/logcat.txt`, adb(['shell', 'logcat', '-d']));
}
