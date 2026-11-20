#!/usr/bin/env node
// Renders scripts/og-cover.html to img/og-cover.png (1200x630) with headless Chrome.
// Usage: node scripts/build-og.mjs   (override the browser with CHROME=/path/to/chrome)
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const chrome = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--virtual-time-budget=5000',          // give web fonts time to load
  `--screenshot=${join(root, 'img', 'og-cover.png')}`,
  pathToFileURL(join(root, 'scripts', 'og-cover.html')).href
], { stdio: 'inherit' });

console.log('wrote img/og-cover.png');
