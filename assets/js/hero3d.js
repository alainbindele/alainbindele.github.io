/* ═══════════════════════════════════════════════════════════
   HERO 3D — point cloud GPU che si morfa fra forme
   sphere → torus knot → "</>"  → galassia → cubo
   ═══════════════════════════════════════════════════════════ */
import * as THREE from 'three';

const canvas = document.querySelector('#gl');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hud = {
  shape: document.querySelector('#hudShape'),
  fps:   document.querySelector('#hudFps'),
  pts:   document.querySelector('#hudPts')
};

const COUNT = REDUCED ? 2600 : (innerWidth < 760 ? 4500 : 9000);

/* ── generatori di forme ───────────────────────────────── */
function sphere(n) {
  const a = new Float32Array(n * 3), R = 2.35;
  for (let i = 0; i < n; i++) {
    const u = Math.random(), v = Math.random();
    const th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1);
    const r = R * Math.cbrt(.72 + Math.random() * .28);
    a[i * 3]     = r * Math.sin(ph) * Math.cos(th);
    a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    a[i * 3 + 2] = r * Math.cos(ph);
  }
  return a;
}

function torusKnot(n) {
  const a = new Float32Array(n * 3), p = 2, q = 3, R = 1.5, r = .52;
  for (let i = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2;
    const cu = Math.cos(q * t), su = Math.sin(q * t);
    const x = (R + r * cu) * Math.cos(p * t);
    const y = (R + r * cu) * Math.sin(p * t);
    const z = r * su;
    const j = .16;
    a[i * 3]     = x + (Math.random() - .5) * j;
    a[i * 3 + 1] = y + (Math.random() - .5) * j;
    a[i * 3 + 2] = z + (Math.random() - .5) * j;
  }
  return a;
}

function galaxy(n) {
  const a = new Float32Array(n * 3), ARMS = 4;
  for (let i = 0; i < n; i++) {
    const arm = i % ARMS;
    const r = Math.pow(Math.random(), .62) * 3.1;
    const ang = (arm / ARMS) * Math.PI * 2 + r * 1.15 + (Math.random() - .5) * .42;
    const spread = .045 * r;
    a[i * 3]     = Math.cos(ang) * r + (Math.random() - .5) * spread * 4;
    a[i * 3 + 1] = (Math.random() - .5) * spread * 5;
    a[i * 3 + 2] = Math.sin(ang) * r + (Math.random() - .5) * spread * 4;
  }
  return a;
}

function cube(n) {
  const a = new Float32Array(n * 3), S = 1.75, GRID = 11;
  for (let i = 0; i < n; i++) {
    const face = Math.floor(Math.random() * 6);
    const u = (Math.round(Math.random() * GRID) / GRID - .5) * 2 * S;
    const v = (Math.round(Math.random() * GRID) / GRID - .5) * 2 * S;
    let x, y, z;
    if (face === 0) { x =  S; y = u; z = v; }
    else if (face === 1) { x = -S; y = u; z = v; }
    else if (face === 2) { y =  S; x = u; z = v; }
    else if (face === 3) { y = -S; x = u; z = v; }
    else if (face === 4) { z =  S; x = u; y = v; }
    else                 { z = -S; x = u; y = v; }
    a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z;
  }
  return a;
}

/** campiona i pixel opachi di un testo disegnato su canvas 2D */
function fromText(n, text, font) {
  const W = 460, H = 190;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = font;
  g.fillText(text, W / 2, H / 2);

  const data = g.getImageData(0, 0, W, H).data;
  const hits = [];
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (data[(y * W + x) * 4 + 3] > 128) hits.push([x, y]);
    }
  }
  const a = new Float32Array(n * 3);
  if (!hits.length) return sphere(n);
  const SC = 6.4 / W;
  for (let i = 0; i < n; i++) {
    const [x, y] = hits[Math.floor(Math.random() * hits.length)];
    a[i * 3]     = (x - W / 2) * SC + (Math.random() - .5) * .035;
    a[i * 3 + 1] = -(y - H / 2) * SC + (Math.random() - .5) * .035;
    a[i * 3 + 2] = (Math.random() - .5) * .3;
  }
  return a;
}

/* ── scena ─────────────────────────────────────────────── */
let renderer, scene, camera, points, geo, mat, group;
let shapes = [], names = [], current = 0, running = true;

const state = { morph: 0 };
const mouse = new THREE.Vector2(0, 0);
const mouseT = new THREE.Vector2(0, 0);

const VERT = /* glsl */`
attribute vec3 aPosA;
attribute vec3 aPosB;
attribute float aScale;
attribute float aRnd;
uniform float uMorph;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform vec2  uMouse;      // NDC
uniform float uTanFov;
uniform float uAspect;
varying float vRnd;
varying float vDepth;

void main(){
  float m = smoothstep(0.0, 1.0, uMorph);
  vec3 p = mix(aPosA, aPosB, m);

  // respiro organico
  float t = uTime * 0.32 + aRnd * 6.2831;
  p += vec3(sin(t) * 0.05, cos(t * 1.27) * 0.05, sin(t * 0.71) * 0.05);

  // turbolenza durante il morph
  float turb = sin(m * 3.14159);
  p += normalize(p + 0.001) * turb * (0.28 + aRnd * 0.5);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  // repulsione dal cursore, calcolata alla profondità del punto
  float halfH = uTanFov * max(-mv.z, 0.001);
  vec2 mView = vec2(uMouse.x * halfH * uAspect, uMouse.y * halfH);
  float d = distance(mv.xy, mView);
  float f = smoothstep(1.35, 0.0, d);
  mv.xy += normalize(mv.xy - mView + 0.0001) * f * 0.62;

  vDepth = -mv.z;
  vRnd = aRnd;

  gl_Position = projectionMatrix * mv;
  // costante bassa: a z~6.4 un punto deve stare sui 2-3 px CSS, non 100
  gl_PointSize = uSize * aScale * uPixelRatio * (9.0 / max(-mv.z, 0.001));
}`;

const FRAG = /* glsl */`
precision mediump float;
varying float vRnd;
varying float vDepth;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.06, d);

  vec3 cyan    = vec3(0.00, 0.90, 1.00);
  vec3 violet  = vec3(0.49, 0.36, 1.00);
  vec3 magenta = vec3(1.00, 0.18, 0.53);

  vec3 col = mix(cyan, violet, clamp(vRnd, 0.0, 1.0));
  col = mix(col, magenta, smoothstep(5.0, 9.0, vDepth) * 0.65);
  col += (1.0 - smoothstep(0.0, 0.34, d)) * 0.28;

  // additive: alpha contenuta, altrimenti la nuvola satura in bianco
  gl_FragColor = vec4(col, alpha * 0.72);
}`;

async function init() {
  if (!canvas) return;

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    console.error('[hero3d] WebGL non disponibile:', e);
    document.body.classList.add('no-gl');
    canvas.style.display = 'none';
    return;
  }
  // Se la CDN è stata lenta il fallback CSS può già essere scattato:
  // lo annullo, il canvas vero ha la precedenza.
  window.__heroGL = true;
  document.body.classList.remove('no-gl');

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 100);
  camera.position.z = 6.4;

  group = new THREE.Group();
  scene.add(group);

  // il font monospace serve per la forma "</>"
  try { await document.fonts.ready; } catch (_) {}
  const mono = `700 118px "JetBrains Mono", ui-monospace, monospace`;

  shapes = [sphere(COUNT), torusKnot(COUNT), fromText(COUNT, '</>', mono), galaxy(COUNT), cube(COUNT)];
  names  = ['SPHERE', 'TORUS KNOT', 'SOURCE', 'GALAXY', 'LATTICE'];

  geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3));
  geo.setAttribute('aPosA',    new THREE.BufferAttribute(shapes[0].slice(), 3));
  geo.setAttribute('aPosB',    new THREE.BufferAttribute(shapes[1].slice(), 3));

  const scale = new Float32Array(COUNT), rnd = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    scale[i] = .5 + Math.random() * 1.15;
    rnd[i]   = Math.random();
  }
  geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
  geo.setAttribute('aRnd',   new THREE.BufferAttribute(rnd, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

  mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uMorph:      { value: 0 },
      uTime:       { value: 0 },
      uSize:       { value: innerWidth < 760 ? 1.7 : 2.15 },
      uPixelRatio: { value: Math.min(devicePixelRatio, 2) },
      uMouse:      { value: new THREE.Vector2(0, 0) },
      uTanFov:     { value: Math.tan(THREE.MathUtils.degToRad(48) / 2) },
      uAspect:     { value: innerWidth / innerHeight }
    }
  });

  points = new THREE.Points(geo, mat);
  group.add(points);

  if (hud.pts) hud.pts.textContent = COUNT.toLocaleString('it-IT') + ' pts';
  if (hud.shape) hud.shape.textContent = names[0];

  layout();
  bind();
  if (!REDUCED) scheduleMorph();
  animate();
}

/* ── morph loop ────────────────────────────────────────── */
function scheduleMorph() {
  setTimeout(() => {
    const next = (current + 1) % shapes.length;
    const A = geo.getAttribute('aPosA'), B = geo.getAttribute('aPosB');
    A.array.set(shapes[current]); A.needsUpdate = true;
    B.array.set(shapes[next]);    B.needsUpdate = true;

    state.morph = 0;
    if (hud.shape) hud.shape.textContent = names[next];

    gsap.to(state, {
      morph: 1, duration: 2.1, ease: 'power2.inOut',
      onUpdate: () => { mat.uniforms.uMorph.value = state.morph; },
      onComplete: () => { current = next; scheduleMorph(); }
    });
  }, 3400);
}

/* ── layout: su desktop la nuvola sta a destra, il testo a sinistra ── */
const BASE = { x: 0, s: 1 };
function layout() {
  if (innerWidth >= 1100)      { BASE.x =  2.25; BASE.s = 1.02; }
  else if (innerWidth >= 761)  { BASE.x =  1.35; BASE.s = .88;  }
  else                         { BASE.x =  0;    BASE.s = .74;  }
  group.position.x = BASE.x;
}

/* ── input / resize / visibilità ───────────────────────── */
function bind() {
  addEventListener('pointermove', e => {
    mouseT.x =  (e.clientX / innerWidth)  * 2 - 1;
    mouseT.y = -(e.clientY / innerHeight) * 2 + 1;
  }, { passive: true });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
    mat.uniforms.uAspect.value = camera.aspect;
    mat.uniforms.uSize.value = innerWidth < 760 ? 1.7 : 2.15;
    layout();
  });

  // niente render quando l'hero è fuori schermo
  const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; }, { threshold: 0 });
  io.observe(document.querySelector('#hero'));

  document.addEventListener('visibilitychange', () => { running = !document.hidden; });
}

/* ── render loop ───────────────────────────────────────── */
const clock = new THREE.Clock();
let frames = 0, fpsT = 0;

function animate() {
  requestAnimationFrame(animate);
  if (!running) { clock.getDelta(); return; }

  const dt = Math.min(clock.getDelta(), .05);
  const el = clock.elapsedTime;

  mouse.x += (mouseT.x - mouse.x) * .07;
  mouse.y += (mouseT.y - mouse.y) * .07;
  mat.uniforms.uMouse.value.set(mouse.x, mouse.y);
  mat.uniforms.uTime.value = el;

  if (!REDUCED) {
    group.rotation.y += dt * .12;
    group.rotation.x = mouse.y * .22;
    group.rotation.z = mouse.x * .06;
    const sc = BASE.s * (1 + Math.sin(el * .5) * .015);
    group.scale.set(sc, sc, sc);
  } else {
    group.scale.setScalar(BASE.s);
  }

  renderer.render(scene, camera);

  frames++;
  if (el - fpsT > 1) {
    if (hud.fps) hud.fps.textContent = frames + ' fps';
    frames = 0; fpsT = el;
  }
}

init();
