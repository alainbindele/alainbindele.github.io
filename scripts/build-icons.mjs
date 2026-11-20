#!/usr/bin/env node
// Renders assets/icons/icon.svg (with the JetBrains Mono web font) to the raster icons:
//   favicon.ico (16/32/48, PNG-in-ICO) at the site root,
//   assets/icons/apple-touch-icon.png (180), icon-192.png, icon-512.png.
// Usage: node scripts/build-icons.mjs   (macOS: uses headless Chrome + sips)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const icons = join(root, 'assets', 'icons');
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = mkdtempSync(join(tmpdir(), 'icons-'));

// Inline the SVG in an HTML page so it can use the web font.
const svg = readFileSync(join(icons, 'icon.svg'), 'utf8');
const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=block" rel="stylesheet">
<style>html,body{margin:0;background:transparent}svg{display:block;width:512px;height:512px}</style>
</head><body>${svg}</body></html>`;
writeFileSync(join(tmp, 'icon.html'), html);

const master = join(tmp, 'master.png');
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--default-background-color=00000000', '--window-size=512,512', '--virtual-time-budget=5000',
  `--screenshot=${master}`, pathToFileURL(join(tmp, 'icon.html')).href
], { stdio: 'ignore' });

const resize = (size, out) => execFileSync('sips', ['-z', String(size), String(size), master, '--out', out], { stdio: 'ignore' });
resize(512, join(icons, 'icon-512.png'));
resize(192, join(icons, 'icon-192.png'));
resize(180, join(icons, 'apple-touch-icon.png'));

// favicon.ico with PNG-encoded entries (supported by every current browser).
const sizes = [16, 32, 48];
const pngs = sizes.map(s => { const p = join(tmp, `ico-${s}.png`); resize(s, p); return readFileSync(p); });
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
writeFileSync(join(root, 'favicon.ico'), Buffer.concat([header, ...dir, ...pngs]));

rmSync(tmp, { recursive: true, force: true });
console.log('wrote favicon.ico and assets/icons/*.png');
