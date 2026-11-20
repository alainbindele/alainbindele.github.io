#!/usr/bin/env node
/**
 * Generates /en/index.html from /index.html + assets/js/i18n.js.
 *
 *   node scripts/build-en.mjs
 *
 * index.html (Italian) is the only hand-edited page. This script:
 *   1. replaces the text of every element carrying data-i18n="key" with I18N.en[key]
 *   2. replaces aria-label / alt on elements carrying data-i18n-aria / data-i18n-alt
 *   3. swaps the language-specific <head> values (canonical, og:*, twitter:*, JSON-LD…)
 *   4. flips the IT/EN switch and the CV links
 *   5. rewrites relative asset URLs to ../ (the page lives one folder down)
 * Every replacement is asserted: if index.html changes shape the build fails loudly
 * instead of silently shipping Italian text on the English page.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(root, p), 'utf8');

// i18n.js declares `const I18N = {...}` for the browser; evaluate it in a sandbox.
const ctx = {};
vm.runInNewContext(read('assets/js/i18n.js') + '\n;this.I18N = I18N;', ctx);
const EN = ctx.I18N.en;

const escText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = s => escText(s).replace(/"/g, '&quot;');
const en = key => {
  if (!(key in EN)) throw new Error(`Missing English string for key "${key}" in i18n.js`);
  return EN[key];
};

let html = read('index.html');

/* 1. text nodes ------------------------------------------------------------ */
const textRe = /(<([a-z][a-z0-9]*)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g;
let textCount = 0;
html = html.replace(textRe, (_, open, _tag, key, inner, close) => {
  if (/<[a-z]/i.test(inner)) throw new Error(`data-i18n="${key}" must wrap plain text only`);
  textCount++;
  return open + escText(en(key)) + close;
});
const expected = (read('index.html').match(/\sdata-i18n="/g) || []).length;
if (textCount !== expected) throw new Error(`Translated ${textCount}/${expected} data-i18n elements`);

/* 2. attributes -------------------------------------------------------------- */
const attrSwap = (marker, attr) => {
  const re = new RegExp(`<[a-z][a-z0-9]*\\b[^>]*\\s${marker}="([^"]+)"[^>]*>`, 'g');
  html = html.replace(re, (tag, key) => {
    const attrRe = new RegExp(`\\s${attr}="[^"]*"`);
    if (!attrRe.test(tag)) throw new Error(`${marker}="${key}" without ${attr}`);
    return tag.replace(attrRe, ` ${attr}="${escAttr(en(key))}"`);
  });
};
attrSwap('data-i18n-aria', 'aria-label');
attrSwap('data-i18n-alt', 'alt');

/* 3–4. one-off swaps (each must match exactly once) -------------------------- */
const SITE = 'https://alainbindele.github.io';
const SWAPS = [
  ['<html lang="it" data-lang="it">', '<html lang="en" data-lang="en" data-root="../">'],

  ['<meta name="description" content="Alain Bindele — Software Engineer a Roma. 20+ anni tra Java, Spring Boot, AWS e clean architecture; oggi anche LLM, RAG, MCP e data engineering su PostgreSQL." />',
   '<meta name="description" content="Alain Bindele — Software Engineer based in Rome. 20+ years with Java, Spring Boot, AWS and clean architecture; now also LLMs, RAG, MCP and data engineering on PostgreSQL." />'],

  [`<link rel="canonical" href="${SITE}/" />`, `<link rel="canonical" href="${SITE}/en/" />`],
  [`<meta property="og:url" content="${SITE}/" />`, `<meta property="og:url" content="${SITE}/en/" />`],

  ['<meta property="og:description" content="20+ anni tra Java, Spring Boot, AWS e clean architecture." />',
   '<meta property="og:description" content="20+ years with Java, Spring Boot, AWS and clean architecture." />'],
  ['<meta name="twitter:description" content="20+ anni tra Java, Spring Boot, AWS e clean architecture." />',
   '<meta name="twitter:description" content="20+ years with Java, Spring Boot, AWS and clean architecture." />'],
  ['<meta property="og:image:alt" content="Alain Bindele — Software Engineer a Roma. Java, Spring Boot, AWS, Clean Architecture." />',
   '<meta property="og:image:alt" content="Alain Bindele — Software Engineer in Rome. Java, Spring Boot, AWS, Clean Architecture." />'],
  ['<meta name="twitter:image:alt" content="Alain Bindele — Software Engineer a Roma. Java, Spring Boot, AWS, Clean Architecture." />',
   '<meta name="twitter:image:alt" content="Alain Bindele — Software Engineer in Rome. Java, Spring Boot, AWS, Clean Architecture." />'],
  ['<meta property="og:locale" content="it_IT" />\n<meta property="og:locale:alternate" content="en_US" />',
   '<meta property="og:locale" content="en_US" />\n<meta property="og:locale:alternate" content="it_IT" />'],

  ['"description": "Software Engineer con oltre 20 anni di esperienza su Java, Spring Boot, AWS e Clean Architecture.",',
   '"description": "Software Engineer with 20+ years of experience in Java, Spring Boot, AWS and Clean Architecture.",'],
  ['"addressLocality": "Roma",', '"addressLocality": "Rome",'],

  ['<a class="lang" id="langBtn" href="/en/" hreflang="en" lang="en" aria-label="English version of this page" data-lang-target="en">',
   '<a class="lang" id="langBtn" href="/" hreflang="it" lang="it" aria-label="Versione italiana di questa pagina" data-lang-target="it">'],
  ['<span class="lang__it is-on">IT</span><span class="lang__sep">/</span><span class="lang__en">EN</span>',
   '<span class="lang__it">IT</span><span class="lang__sep">/</span><span class="lang__en is-on">EN</span>'],

  ['href="downloads/CV_it.pdf" download="Alain-Bindele-CV-IT.pdf" type="application/pdf" data-cv-lang="it"',
   'href="downloads/CV_en.pdf" download="Alain-Bindele-CV-EN.pdf" type="application/pdf" data-cv-lang="en"'],
  ['href="downloads/CV_en.pdf" download="Alain-Bindele-CV-EN.pdf" type="application/pdf" hreflang="en" data-cv-lang="en"',
   'href="downloads/CV_it.pdf" download="Alain-Bindele-CV-IT.pdf" type="application/pdf" hreflang="it" data-cv-lang="it"']
];
// Apply all swaps against placeholders first so a swap cannot match another swap's output.
const tokens = [];
for (const [from, to] of SWAPS) {
  const n = html.split(from).length - 1;
  if (n !== 1) throw new Error(`Expected exactly one match (found ${n}) for:\n  ${from}`);
  const tok = `\u0000SWAP${tokens.length}\u0000`;
  html = html.replace(from, tok);
  tokens.push([tok, to]);
}
for (const [tok, to] of tokens) html = html.replace(tok, to);

/* 5. relative URLs -> ../ ---------------------------------------------------- */
html = html.replace(/\s(src|href)="(?![a-z][a-z0-9+.-]*:|\/|#|\.\.\/)([^"]*)"/gi,
  (_, attr, url) => ` ${attr}="../${url}"`);

/* banner + write -------------------------------------------------------------- */
html = html.replace('<!DOCTYPE html>\n',
  '<!DOCTYPE html>\n<!-- GENERATED by scripts/build-en.mjs from index.html + assets/js/i18n.js. Do not edit by hand. -->\n');

mkdirSync(join(root, 'en'), { recursive: true });
writeFileSync(join(root, 'en', 'index.html'), html);

const leftovers = html.match(/\b(chi sono|Parliamone|scarica|Vedi i progetti|Disponibile per)\b/g);
if (leftovers) console.warn('warning: Italian words still present:', [...new Set(leftovers)]);
console.log(`wrote en/index.html (${textCount} strings translated)`);
