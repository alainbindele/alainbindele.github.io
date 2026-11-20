/* ═══════════════════════════════════════════════════════════
   MAIN — orchestrazione: boot, scroll, motion, i18n, console
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DESKTOP = () => window.matchMedia('(min-width: 761px)').matches;
let INTRO = false;                                 // true when the boot overlay just ran

// Language is fixed per page: / is Italian, /en/ is English (static, indexable copies).
const LANG = document.documentElement.lang === 'en' ? 'en' : 'it';
// Path prefix to the site root for JS-built URLs ('' on /, '../' on /en/).
const ROOT = document.documentElement.dataset.root || '';

const t = k => (I18N[LANG] && I18N[LANG][k]) || (I18N.it[k] ?? k);

// If the GSAP CDN is unreachable, bail out cleanly: the static content is already
// visible, we only have to make sure the boot overlay does not cover it.
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
  document.documentElement.classList.remove('is-booting');
  const b = document.getElementById('boot');
  if (b) b.remove();
  console.warn('[main] GSAP not available: running without animations.');
  return;
}

gsap.registerPlugin(ScrollTrigger);

// il ripristino automatico dello scroll litiga con pin + smooth scroll
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ═══════════════ 1. BOOT SEQUENCE ═══════════════ */
const BOOT_LINES = [
  ['probing cpu',            'ok'],
  ['jvm 21 · g1gc',          'ok'],
  ['spring context',         'ok'],
  ['aws credentials',        'ok'],
  ['mounting /dev/coffee',   'ok'],
  ['webgl · point cloud',    'ok'],
  ['hexagonal ports',        'ok'],
  ['20 years of commits',    'ok'],
  ['ready',                  'ok']
];

// The overlay is shown only on the first visit of the session (decided by the inline
// script in <head>, which also honours prefers-reduced-motion). It lasts ~1s and any
// click or key press skips it. The page content is in the DOM underneath from the start.
function boot() {
  const el = $('#boot');
  const booting = document.documentElement.classList.contains('is-booting');
  if (!booting || !el) {
    if (el) el.remove();
    document.documentElement.classList.remove('is-booting');
    start(false);
    return;
  }

  try { sessionStorage.setItem('ab-booted', '1'); } catch (_) {}
  document.body.classList.add('is-locked');

  const log = $('#bootLog'), bar = $('#bootBar'), pct = $('#bootPct');
  let i = 0, timer = 0, done = false;

  const finish = fast => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    removeEventListener('pointerdown', skip, true);
    removeEventListener('keydown', skip, true);
    document.body.classList.remove('is-locked');
    start(true);                                   // hero intro plays while the overlay fades
    gsap.to(el, {
      opacity: 0, duration: fast ? .2 : .32, ease: 'power2.inOut',
      onComplete: () => { el.remove(); document.documentElement.classList.remove('is-booting'); }
    });
  };
  const skip = () => finish(true);
  addEventListener('pointerdown', skip, true);
  addEventListener('keydown', skip, true);

  const step = () => {
    if (i < BOOT_LINES.length) {
      const [label, st] = BOOT_LINES[i];
      log.insertAdjacentHTML('beforeend',
        `<div><i>[${String(i).padStart(2, '0')}]</i> ${label} … <b>${st}</b></div>`);
      log.scrollTop = log.scrollHeight;
      i++;
      const p = Math.round((i / BOOT_LINES.length) * 100);
      bar.style.width = p + '%';
      pct.textContent = p;
      timer = setTimeout(step, 50);                // 10 lines ≈ 0.5s
    } else {
      timer = setTimeout(() => finish(false), 90);
    }
  };
  timer = setTimeout(step, 60);
}

/* ═══════════════ 2. SMOOTH SCROLL ═══════════════ */
let lenis = null;
function smoothScroll() {
  if (REDUCED || typeof Lenis === 'undefined') {
    document.documentElement.style.scrollBehavior = 'smooth';
    return;
  }
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -60 });
    closeDrawer();
  }));
}

/* ═══════════════ 3. CURSOR + MAGNETIC ═══════════════ */
function cursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const c = $('#cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  gsap.ticker.add(() => {
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    dot.style.transform  = `translate(${mx}px,${my}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
  });

  const hot = 'a, button, .tile, .card, .gauge, .ccard, .term';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hot)) c.classList.add('is-hot');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hot)) c.classList.remove('is-hot');
  });

  if (REDUCED) return;
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * .32,
        y: (e.clientY - r.top - r.height / 2) * .42,
        duration: .5, ease: 'power3.out'
      });
    });
    el.addEventListener('mouseleave', () =>
      gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.35)' }));
  });
}

/* ═══════════════ 4. NAV / PROGRESS / DRAWER ═══════════════ */
function closeDrawer() {
  $('#drawer').classList.remove('is-open');
  $('#burger').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-locked');
}

function chrome() {
  const nav = $('#nav'), bar = $('#progressBar');

  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: self => nav.classList.toggle('is-stuck', self.scroll() > 60)
  });

  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => { bar.style.width = (self.progress * 100).toFixed(2) + '%'; }
  });

  // active section
  const links = $$('.nav__links a');
  links.forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onToggle: self => {
        if (self.isActive) { links.forEach(l => l.classList.remove('is-active')); a.classList.add('is-active'); }
      }
    });
  });

  const burger = $('#burger'), drawer = $('#drawer');
  burger.addEventListener('click', () => {
    const open = drawer.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

/* ═══════════════ 5. TEXT: SPLIT + SCRAMBLE ═══════════════ */
function splitChars(el) {
  if (el.dataset.splitDone) return;
  const words = el.textContent.trim().split(/\s+/);
  const GAP = `<span class="ch">${String.fromCharCode(160)}</span>`;  // nbsp: uno spazio normale collasserebbe
  el.innerHTML = words.map(w =>
    `<span class="wd">${[...w].map(c => `<span class="ch">${c}</span>`).join('')}</span>`
  ).join(GAP);
  el.querySelectorAll('.wd').forEach(w => { w.style.display = 'inline-block'; });
  el.dataset.splitDone = '1';
}

function revealText() {
  $$('[data-split]').forEach(el => {
    splitChars(el);
    if (REDUCED) return;
    gsap.from(el.querySelectorAll('.ch'), {
      yPercent: 118, opacity: 0, duration: .82, ease: 'power4.out', stagger: .026,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01αβγλπΣΩ$&%@';
function scramble(el, text, dur = 900) {
  const from = el.textContent, len = Math.max(from.length, text.length);
  const queue = [];
  for (let i = 0; i < len; i++) {
    queue.push({
      f: from[i] || '', to: text[i] || '',
      s: Math.floor(Math.random() * 26), e: Math.floor(Math.random() * 26) + 26
    });
  }
  let frame = 0, raf;
  const tick = () => {
    let out = '', done = 0;
    queue.forEach(q => {
      if (frame >= q.e) { done++; out += q.to; }
      else if (frame >= q.s) {
        if (!q.c || Math.random() < .3) q.c = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        out += `<span style="color:var(--accent-3)">${q.c}</span>`;
      } else out += q.f;
    });
    el.innerHTML = out;
    if (done === queue.length) return cancelAnimationFrame(raf);
    frame++; raf = requestAnimationFrame(tick);
  };
  tick();
}

function roleRotator() {
  const el = $('#roleScramble');
  const read = () => (el.dataset['words' + (LANG === 'en' ? 'En' : 'It')] || '').split('|');
  let words = read(), i = 0;
  if (REDUCED) { el.textContent = words[0]; return; }
  setInterval(() => {
    words = read();
    i = (i + 1) % words.length;
    scramble(el, words[i]);
  }, 3000);
}

/* ═══════════════ 6. COUNTERS ═══════════════ */
function counters() {
  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count, sfx = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        if (REDUCED) { el.textContent = to + sfx; return; }
        const o = { v: 0 };
        gsap.to(o, {
          v: to, duration: 1.7, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(o.v) + sfx; }
        });
      }
    });
  });

  // Above the fold: the HTML already says 20; count up only behind the boot intro.
  const yc = $('#yearsCount'), o = { v: 0 };
  if (REDUCED || !INTRO) { yc.textContent = 20; }
  else gsap.to(o, { v: 20, duration: 2.2, delay: .6, ease: 'power2.out',
    onUpdate: () => { yc.textContent = Math.round(o.v); } });
}

/* ═══════════════ 7. MARQUEE ═══════════════ */
function marquee() {
  const track = $('#marqueeTrack');
  const html = MARQUEE.map(x => `<span>${x}</span>`).join('');
  track.innerHTML = html + html;                       // duplicato per loop continuo
  if (REDUCED) return;
  const half = track.scrollWidth / 2;
  gsap.to(track, { x: -half, duration: 34, ease: 'none', repeat: -1 });
}

/* ═══════════════ 8. TILT + GLARE ═══════════════ */
function tilt() {
  $$('.tilt').forEach(el => {
    const glare = el.querySelector('.tile__glare');
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      if (glare) { glare.style.setProperty('--mx', px * 100 + '%'); glare.style.setProperty('--my', py * 100 + '%'); }
      if (REDUCED || !DESKTOP()) return;
      gsap.to(el, {
        rotateY: (px - .5) * 9, rotateX: (.5 - py) * 9,
        transformPerspective: 900, duration: .5, ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () =>
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.4)' }));
  });
}

/* ═══════════════ 9. GAUGES ═══════════════ */
function gauges() {
  const wrap = $('#gauges');
  wrap.insertAdjacentHTML('beforebegin',
    `<svg width="0" height="0" aria-hidden="true"><defs>
       <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#7c5cff"/>
       </linearGradient></defs></svg>`);

  wrap.innerHTML = SKILLS.map(s => `
    <article class="gauge">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="bgc" cx="60" cy="60" r="52"/>
        <circle class="fgc" cx="60" cy="60" r="52"/>
      </svg>
      <span class="gauge__num mono" data-to="${s.lvl}">0</span>
      <p class="gauge__name">${s.name}</p>
      <span class="gauge__meta">${s.meta}</span>
    </article>`).join('');

  const C = 2 * Math.PI * 52;
  $$('.gauge', wrap).forEach((g, i) => {
    const ring = g.querySelector('.fgc'), num = g.querySelector('.gauge__num');
    const lvl = +num.dataset.to;
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C;
    ScrollTrigger.create({
      trigger: g, start: 'top 86%', once: true,
      onEnter: () => {
        if (REDUCED) { ring.style.strokeDashoffset = C * (1 - lvl / 100); num.textContent = lvl; return; }
        gsap.delayedCall(i * .09, () => {
          ring.style.strokeDashoffset = C * (1 - lvl / 100);
          const o = { v: 0 };
          gsap.to(o, { v: lvl, duration: 1.5, ease: 'power2.out',
            onUpdate: () => { num.textContent = Math.round(o.v); } });
        });
      }
    });
  });
}

/* ═══════════════ 10. WORK RAIL ═══════════════ */
let railTween = null;
const ext = p => p.url.startsWith('http');
// Screenshot with intrinsic size (prevents layout shift) and a descriptive alt.
const shot = p => {
  const s = SHOTS[p.id];
  if (!s) return '';
  return `<figure class="card__shot"><img src="${ROOT}${s.src}" alt="${t('work.shot')} ${p.title}" width="${s.w}" height="${s.h}" loading="lazy" decoding="async"></figure>`;
};
function renderWork() {
  const rail = $('#workRail');
  rail.innerHTML = PROJECTS.map((p, i) => `
    <article class="card" data-cat="${p.cat}">
      ${shot(p)}
      <span class="card__cat mono">${p.cat}</span>
      <span class="card__idx">${String(i + 1).padStart(2, '0')}</span>
      <h3 class="card__title">${p.title}</h3>
      <p class="card__desc">${LANG === 'en' ? p.en : p.it}</p>
      <div class="card__tech">${p.tech.map(x => `<span>${x}</span>`).join('')}</div>
      <a class="card__go" href="${ext(p) ? p.url : ROOT + p.url}" ${ext(p) ? 'target="_blank" rel="noopener"' : ''}>
        ${t('work.go')}<span class="sr-only"> ${p.title}${ext(p) ? ' ' + t('work.newTab') : ''}</span>
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8"/></svg>
      </a>
    </article>`).join('');
}

function workScroll() {
  const rail = $('#workRail'), pin = $('.work__pin');

  const build = () => {
    if (railTween) { railTween.scrollTrigger?.kill(); railTween.kill(); railTween = null; gsap.set(rail, { x: 0 }); }
    if (!DESKTOP() || REDUCED) return;
    const dist = () => Math.max(0, rail.scrollWidth - innerWidth + 80);
    if (dist() <= 0) return;
    railTween = gsap.to(rail, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#work', pin: pin, start: 'top top',
        end: () => '+=' + dist(), scrub: .8, invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
  };

  build();
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); ScrollTrigger.refresh(); }, 220); });

  $('#filters').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $$('#filters button').forEach(b => b.classList.toggle('is-on', b === btn));
    const cat = btn.dataset.cat;
    $$('.card', rail).forEach(c => {
      c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
    });
    build();
    ScrollTrigger.refresh();
  });
}

/* ═══════════════ 12. TIMELINE ═══════════════ */
function renderPath() {
  const tl = $('#timeline');
  const line = tl.querySelector('.timeline__line');
  tl.innerHTML = '';
  tl.appendChild(line);
  tl.insertAdjacentHTML('beforeend', JOBS.map(j => {
    const role = LANG === 'en' ? (j.roleEn || j.role) : j.role;
    const co   = LANG === 'en' ? (j.coEn   || j.co)   : j.co;
    const loc  = LANG === 'en' ? (j.locEn  || j.loc)  : j.loc;
    const when = LANG === 'en' ? (j.whenEn || j.when) : j.when;
    const pts  = LANG === 'en' ? j.en : j.it;
    return `<article class="job">
      <span class="job__when">${when}</span>
      <h3 class="job__role">${role}</h3>
      <p class="job__co">${co} <em>· ${loc}</em></p>
      <ul>${pts.map(p => `<li>${p}</li>`).join('')}</ul>
    </article>`;
  }).join(''));
}

function pathScroll() {
  const fill = $('.timeline__line i');
  ScrollTrigger.create({
    trigger: '#timeline', start: 'top 72%', end: 'bottom 78%', scrub: .6,
    onUpdate: self => { fill.style.height = (self.progress * 100) + '%'; }
  });
  $$('.job').forEach(j => {
    ScrollTrigger.create({ trigger: j, start: 'top 76%', once: true,
      onEnter: () => j.classList.add('is-in') });
    if (REDUCED) return;
    gsap.from(j, { y: 40, opacity: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: j, start: 'top 86%', once: true } });
  });
  $$('.langs li').forEach(li => {
    li.style.setProperty('--lvl', li.querySelector('i').dataset.lvl + '%');
    ScrollTrigger.create({ trigger: li, start: 'top 92%', once: true,
      onEnter: () => li.classList.add('is-in') });
  });
}

/* ═══════════════ 13. CONSOLE ═══════════════ */
const FS = {
  'about.md':  () => t('about.bio'),
  'stack.txt': () => SKILLS.map(s => `${s.name.padEnd(22)} ${'█'.repeat(Math.round(s.lvl / 7))} ${s.lvl}`).join('\n'),
  'cv.pdf':    () => `<span class="dm">binary file — </span><a href="${ROOT}downloads/CV_${LANG}.pdf" download>scarica / download</a>`,
};

const CMDS = {
  help: () => `<span class="ac">comandi disponibili</span>
  <span class="hl">whoami</span>      chi sta scrivendo questo codice
  <span class="hl">ls</span>          elenca i file
  <span class="hl">cat</span> &lt;file&gt;  leggi un file
  <span class="hl">skills</span>      livelli tecnici
  <span class="hl">projects</span>    progetti in produzione
  <span class="hl">contact</span>     come raggiungermi
  <span class="hl">neofetch</span>    system info
  <span class="hl">date</span>        ora di Roma
  <span class="hl">matrix</span>      ...
  <span class="hl">coffee</span>      ☕
  <span class="hl">clear</span>       pulisci lo schermo`,

  whoami: () => `<span class="ok">alain</span>
Software Engineer · Roma, IT
20+ anni · Java · Spring Boot · AWS · Clean Architecture
<span class="dm">"la chiarezza progettuale vale quanto il codice che la implementa"</span>`,

  ls: () => Object.keys(FS).map(f => `<span class="ac">${f}</span>`).join('   '),

  cat: a => {
    if (!a) return `<span class="er">cat: manca l'operando</span>`;
    return FS[a] ? FS[a]() : `<span class="er">cat: ${a}: file o directory non esistente</span>`;
  },

  skills: () => FS['stack.txt'](),

  projects: () => PROJECTS.map(p =>
    `<span class="ac">${p.title.padEnd(20)}</span><span class="dm">${p.tech.join(', ')}</span>\n  ${LANG === 'en' ? p.en : p.it}`
  ).join('\n'),

  contact: () => `email     <a href="mailto:alain.bindele@gmail.com">alain.bindele@gmail.com</a>
github    <a href="https://github.com/alainbindele" target="_blank" rel="noopener">@alainbindele</a>
linkedin  <a href="https://www.linkedin.com/in/alainbindele/" target="_blank" rel="noopener">/in/alainbindele</a>
cv        <a href="${ROOT}downloads/CV_${LANG}.pdf" download>CV_${LANG}.pdf</a>`,

  neofetch: () => `<span class="ac">       _    ____</span>     <span class="hl">alain@bindele</span>
<span class="ac">      / \\  | __ )</span>    <span class="dm">─────────────</span>
<span class="ac">     / _ \\ |  _ \\</span>    OS      <span class="hl">Rome Linux 41.9°N</span>
<span class="ac">    / ___ \\| |_) |</span>   Uptime  <span class="hl">20+ years</span>
<span class="ac">   /_/   \\_\\____/</span>    Shell   <span class="hl">zsh</span>
                     Lang    <span class="hl">Java · TS · SQL</span>
                     Cloud   <span class="hl">AWS</span>
                     Coffee  <span class="hl">∞</span>`,

  date: () => new Date().toLocaleString(LANG === 'en' ? 'en-GB' : 'it-IT', { timeZone: 'Europe/Rome' }),

  uname: () => 'Rome 6.6.0-clean-arch x86_64 GNU/Coffee',

  coffee: () => `<span class="ac">    ( (
     ) )
  ........
  |      |]
  \\      /
   \`----'</span>
<span class="dm">refill in corso…</span>`,

  matrix: () => {
    if (REDUCED) return '<span class="dm">matrix disabled: prefers-reduced-motion is on.</span>';
    matrixRain(6000);
    return '<span class="ok">wake up, Neo…</span>';
  },

  sudo: a => a
    ? `<span class="er">alain non è nel file sudoers. Questo incidente sarà segnalato.</span>`
    : `<span class="er">usage: sudo &lt;comando&gt;</span>`,

  rm: a => a && a.includes('rf')
    ? `<span class="er">nice try.</span> <span class="dm">i backup li ho, tu no.</span>`
    : `<span class="er">rm: operando mancante</span>`,

  exit: () => `<span class="dm">non si esce da qui. scrolla.</span>`,

  clear: () => '__CLEAR__'
};

function term() {
  const out = $('#termOut'), input = $('#termIn'), body = $('#termBody');
  const hist = []; let hi = -1;

  const write = html => {
    out.insertAdjacentHTML('beforeend', html + '\n');
    body.scrollTop = body.scrollHeight;
  };

  write(`<span class="dm">alain-shell 2.0 — ${new Date().getFullYear()}</span>`);
  write(`<span class="dm">scrivi </span><span class="ac">help</span><span class="dm"> per la lista dei comandi.</span>\n`);

  body.addEventListener('click', () => input.focus());

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp')   { if (hi < hist.length - 1) input.value = hist[++hi]; e.preventDefault(); return; }
    if (e.key === 'ArrowDown') { hi = Math.max(-1, hi - 1); input.value = hi < 0 ? '' : hist[hi]; e.preventDefault(); return; }
    if (e.key !== 'Enter') return;

    const raw = input.value.trim();
    input.value = '';
    write(`<span class="ok">alain@bindele</span>:<span class="ac">~</span>$ ${raw.replace(/</g, '&lt;')}`);
    if (!raw) return;
    hist.unshift(raw); hi = -1;

    const [cmd, ...rest] = raw.split(/\s+/);
    const fn = CMDS[cmd.toLowerCase()];
    if (!fn) {
      write(`<span class="er">zsh: comando non trovato: ${cmd.replace(/</g, '&lt;')}</span> <span class="dm">— prova \`help\`</span>\n`);
      return;
    }
    const res = fn(rest.join(' '));
    if (res === '__CLEAR__') { out.innerHTML = ''; return; }
    write(res + '\n');
  });
}

/* ═══════════════ 14. MATRIX RAIN + KONAMI ═══════════════ */
let rainStop = null;
function matrixRain(ms = 0) {
  if (REDUCED) return;                             // no full-screen motion for reduced-motion users
  const cv = $('#matrix'), ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = Math.floor(cv.width / 15);
  const drops = Array(cols).fill(1);
  const chars = 'アカサタナハマヤラワ0123456789{}[]<>/\\|=+*ABJVSPRING';
  gsap.to(cv, { opacity: 1, duration: .4 });

  const id = setInterval(() => {
    ctx.fillStyle = 'rgba(5,6,10,.07)';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#00e5ff';
    ctx.font = '14px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 15, y * 15);
      if (y * 15 > cv.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
  }, 42);

  rainStop = () => {
    clearInterval(id);
    gsap.to(cv, { opacity: 0, duration: .5, onComplete: () => ctx.clearRect(0, 0, cv.width, cv.height) });
    $('#egg').classList.remove('is-on');
    rainStop = null;
  };
  if (ms) setTimeout(() => rainStop && rainStop(), ms);
}

function konami() {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let p = 0;
  addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    if (e.key === 'Escape' && rainStop) { rainStop(); return; }
    p = (e.key.toLowerCase() === SEQ[p].toLowerCase() || e.key === SEQ[p]) ? p + 1 : 0;
    if (p === SEQ.length) { p = 0; matrixRain(); $('#egg').classList.add('is-on'); }
  });
}

/* ═══════════════ 15. CLOCK / UPTIME ═══════════════ */
function clocks() {
  const c1 = $('#clock'), c2 = $('#clock2'), up = $('#uptime');
  $('#year').textContent = new Date().getFullYear();
  const t0 = Date.now();
  const pad = n => String(n).padStart(2, '0');

  setInterval(() => {
    const now = new Date();
    const rome = new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
    c1.textContent = rome;
    c2.textContent = rome.slice(0, 5);
    const s = Math.floor((Date.now() - t0) / 1000);
    up.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
  }, 1000);
}

/* ═══════════════ 16. LANGUAGE LINK ═══════════════ */
// The IT/EN switch is a plain link to the other static page; on click we append the
// section currently in view so the reader lands in the same place.
function langLink() {
  const a = $('#langBtn');
  if (!a) return;
  a.addEventListener('click', () => {
    // last nav section whose top is above the middle of the viewport (none while on the hero)
    let hash = '';
    $$('.nav__links a').forEach(l => {
      const sec = $(l.getAttribute('href'));
      if (sec && sec.getBoundingClientRect().top < innerHeight * .5) hash = l.getAttribute('href');
    });
    a.setAttribute('href', a.getAttribute('href').split('#')[0] + hash);
  });
}

// Honour an incoming #hash (e.g. from the language link) once layout and pins exist.
function jumpToHash() {
  const id = location.hash && location.hash.slice(1);
  const target = id && document.getElementById(id);
  if (!target) return;
  const go = () => {
    if (lenis) {
      lenis.resize();                              // its cached page height may be stale and clamp the jump
      lenis.scrollTo(target, { offset: -60, immediate: true, force: true });
    }
    else target.scrollIntoView();
  };
  go();

  // Web fonts and images can still change section heights after the first jump:
  // re-align once they have settled, unless the reader has already started scrolling.
  let moved = false;
  const stop = () => { moved = true; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(e => addEventListener(e, stop, { once: true, passive: true }));
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise(r => addEventListener('load', r, { once: true }));
  Promise.all([document.fonts ? document.fonts.ready : null, loaded]).then(() => {
    if (moved) return;
    ScrollTrigger.refresh();
    go();
  });
}

/* ═══════════════ BOOTSTRAP ═══════════════ */
function start(intro) {
  INTRO = !!intro;
  renderWork();
  renderPath();

  smoothScroll();
  cursor();
  chrome();
  revealText();
  roleRotator();
  counters();
  marquee();
  tilt();
  gauges();
  workScroll();
  pathScroll();
  term();
  konami();
  clocks();
  langLink();

  // generic scroll reveals (below the fold, never hide above-the-fold content)
  if (!REDUCED) {
    $$('.tile, .gauge, .ccard').forEach(el => {
      gsap.from(el, {
        y: 34, opacity: 0, duration: .75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }
  // Hero intro only right after the boot overlay: on repeat visits the H1, role and lead
  // stay exactly as painted by the HTML (no hide-then-reveal, better LCP).
  if (!REDUCED && intro) {
    // il titolo si anima intero: niente split, o si rompe il background-clip:text
    gsap.from('.hero__title', {
      yPercent: 18, opacity: 0, duration: 1.15, ease: 'power4.out', delay: .1
    });
    gsap.from('.hero__eyebrow, .hero__role, .hero__lead, .hero__cta, .hero__chips', {
      y: 24, opacity: 0, duration: .9, ease: 'power3.out', stagger: .1, delay: .35
    });
  }

  // il point cloud è un ES module: su file:// il browser lo blocca per CORS.
  // se dopo 2.5s non ha dato segno di vita, mostro un fallback CSS e spiego perché.
  setTimeout(() => {
    if (window.__heroGL) return;
    document.body.classList.add('no-gl');
    if (location.protocol === 'file:') {
      console.warn('[hero3d] Aperto da file:// — gli ES module sono bloccati. Servi la cartella via HTTP, es. `python -m http.server 4321`, e apri http://localhost:4321');
    } else {
      console.warn('[hero3d] Point cloud non inizializzato: WebGL disattivato o three.js non raggiungibile dalla CDN.');
    }
  }, 6000);

  ScrollTrigger.refresh();
  jumpToHash();
  console.log(
    '%c  _    ____\n / \\  | __ )   alain bindele\n/ _ \\ |  _ \\   software engineer\n\\___/ |____/   ciao, curioso.',
    'color:#00e5ff;font-family:monospace'
  );
  console.log('%cprova a scrivere `help` nella console della pagina, o il codice Konami.', 'color:#8d95ab');
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', boot)
  : boot();

})();
