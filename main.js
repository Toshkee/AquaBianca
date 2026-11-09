import * as THREE from 'three';
import { initStory } from './story.js';
import { t, num, onLang } from './i18n.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMG = (n) => `assets/web/${n}.jpg`;

/* ------------------------------------------------------------------ */
/*  Shared GLSL                                                        */
/* ------------------------------------------------------------------ */
const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
vec2 cover(vec2 uv, vec2 res, vec2 img){
  vec2 s=res/img; float sc=max(s.x,s.y); vec2 ns=img*sc; vec2 off=(ns-res)*0.5;
  return (uv*res+off)/ns;
}`;

const VERT = /* glsl */`
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }`;

function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  return r;
}
const loader = new THREE.TextureLoader();
const texCache = new Map();
function loadTex(url) {
  if (texCache.has(url)) return texCache.get(url);
  const p = new Promise((res, rej) => loader.load(url, (t) => {
    t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    res(t);
  }, undefined, rej));
  texCache.set(url, p);
  return p;
}
function visibleLoop(el, tick) {
  let on = false, raf = 0;
  const loop = (t) => { tick(t / 1000); raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(loop); }
    else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
  }).observe(el);
}

/* ------------------------------------------------------------------ */
/*  HERO — water surface over aerial photo, ripples follow the cursor  */
/* ------------------------------------------------------------------ */
async function initHero() {
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('heroGL');
  const renderer = makeRenderer(canvas);
  const tex = await loadTex(IMG('f18'));
  const uniforms = {
    uTex: { value: tex },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImg: { value: new THREE.Vector2(tex.image.width, tex.image.height) },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.4) },
    uStrength: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, vertexShader: VERT,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex; uniform vec2 uRes, uImg, uMouse; uniform float uTime, uStrength;
      varying vec2 vUv;
      ${NOISE}
      void main(){
        vec2 uv=vUv;
        float n=snoise(uv*vec2(3.0,2.0)+vec2(uTime*0.05,uTime*0.03));
        uv+=n*0.0016;
        vec2 asp=vec2(uRes.x/uRes.y,1.0);
        vec2 d=(uv-uMouse)*asp; float len=length(d);
        float wave=sin(len*36.0-uTime*4.0)*exp(-len*7.0)*uStrength;
        uv+=normalize(d+1e-5)*wave*0.0045/asp;
        vec2 t=cover(uv,uRes,uImg); t=0.5+(t-0.5)*0.98;
        vec3 col=texture2D(uTex,t).rgb;
        col+=wave*0.015;
        // gentle cool grade toward brand navy
        col=mix(col,col*vec3(0.88,0.95,1.08),0.35);
        gl_FragColor=vec4(col,1.0);
      }`,
  });
  const scene = new THREE.Scene();
  const cam = new THREE.Camera();
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

  const resize = () => {
    const { width, height } = hero.getBoundingClientRect();
    renderer.setSize(width, height, false);
    uniforms.uRes.value.set(width, height);
  };
  resize(); addEventListener('resize', resize);

  const target = new THREE.Vector2(0.5, 0.4);
  let energy = 0, last = null;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
    if (last) energy = Math.min(1, energy + Math.hypot(x - last.x, y - last.y) * 3.5);
    last = { x, y }; target.set(x, y);
  });

  visibleLoop(hero, (t) => {
    uniforms.uTime.value = reduceMotion ? 0 : t;
    uniforms.uMouse.value.lerp(target, 0.08);
    energy *= 0.95;
    uniforms.uStrength.value += (energy - uniforms.uStrength.value) * 0.1;
    renderer.render(scene, cam);
  });
  hero.classList.add('gl-ready');
}

/* ------------------------------------------------------------------ */
/*  PRODUCT SHOWCASE — liquid fill transition + carbonation bubbles    */
/* ------------------------------------------------------------------ */
const DESC = {
  izvorska: 'Izvorska voda Aqua Bianca potiče iz netaknute prirode planinskog izvora između Nacionalnog parka Biogradska gora i rijeke Tare koja je pod zaštitom UNESCO-a. Jedinstveni balans minerala čini Aqua Biancu pravim izborom za cijelu porodicu i za svaku priliku.',
  kisjela: 'Gazirana prirodna mineralna voda Aqua Bianca potiče iz netaknute prirode planinskog izvora između Nacionalnog parka Biogradska gora i rijeke Tare. Jedinstveni ukus i balans minerala čini gaziranu Aqua Biancu pravim izborom za svaku priliku.',
};
const KIND = { izvorska: 'Prirodna izvorska voda', kisjela: 'Gazirana prirodna mineralna voda' };
const PRODUCTS = [
  { cat: 'izvorska', vol: '0,25 l', chip: 'Junior', pack: 'PET ambalaža · Junior', img: 'mirna_025_JUNIOR' },
  { cat: 'izvorska', vol: '0,33 l', chip: 'PET', pack: 'PET ambalaža', img: 'mirna_033', key: 'izvorska-pet' },
  { cat: 'izvorska', vol: '0,5 l', chip: 'PET', pack: 'PET ambalaža', img: 'mirna_05' },
  { cat: 'izvorska', vol: '0,5 l', chip: 'Sport', pack: 'PET ambalaža · Sport čep', img: 'mirna_05_sport' },
  { cat: 'izvorska', vol: '1,5 l', chip: 'PET', pack: 'PET ambalaža', img: 'mirna_15' },
  { cat: 'izvorska', vol: '5 l', chip: 'PET', pack: 'PET ambalaža', img: 'mirna_5' },
  { cat: 'izvorska', vol: '10 l', chip: 'Galon', pack: 'Galon · nepovratna ambalaža', img: 'mirna_10_istakac' },
  { cat: 'izvorska', vol: '15/19 l', chip: 'Galon', pack: 'Galon · povratna ambalaža', img: 'mirna_15_19_povratna' },
  { cat: 'izvorska', vol: '0,25 l', chip: 'Staklo', pack: 'Staklena ambalaža', img: 'mirna_025_2025' },
  { cat: 'izvorska', vol: '0,75 l', chip: 'Staklo', pack: 'Staklena ambalaža', img: 'mirna_075_2025', key: 'izvorska-staklo' },
  { cat: 'kisjela', vol: '0,33 l', chip: 'PET', pack: 'PET ambalaža', img: 'kisjela_033', key: 'kisjela-pet' },
  { cat: 'kisjela', vol: '0,25 l', chip: 'Staklo', pack: 'Staklena ambalaža', img: 'Staklo_gazirana_025_2025' },
  { cat: 'kisjela', vol: '0,75 l', chip: 'Staklo', pack: 'Staklena ambalaža', img: 'Staklo_gazirana_075_2025', key: 'kisjela-staklo' },
];

const $ = (id) => document.getElementById(id);
let current = 1;
let stageGL = null; // set when WebGL is ready

function renderInfo(i) {
  const p = PRODUCTS[i];
  document.querySelectorAll('.sc-tabs button').forEach((b) => b.classList.toggle('active', b.dataset.cat === p.cat));
  const list = $('scList');
  list.innerHTML = '';
  PRODUCTS.forEach((q, j) => {
    if (q.cat !== p.cat) return;
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.textContent = `${num(q.vol)} · ${t(q.chip)}`;
    b.className = j === i ? 'active' : '';
    b.onclick = () => select(j);
    li.append(b); list.append(li);
  });
  const swap = [$('scVolume'), $('scPack'), $('scKind'), $('scDesc')];
  swap.forEach((el) => el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.7,.1,1)' }));
  $('scVolume').innerHTML = `${num(p.vol.replace(/\s*l$/, ''))}<span class="u">L</span>`;
  $('scPack').textContent = t(p.pack);
  $('scKind').textContent = t(KIND[p.cat]);
  $('scDesc').textContent = t(DESC[p.cat]);
}

function select(i) {
  i = (i + PRODUCTS.length) % PRODUCTS.length;
  if (i === current) return;
  current = i;
  renderInfo(i);
  if (stageGL) stageGL.show(i); else $('scFallback').src = IMG(PRODUCTS[i].img);
}

async function initShowcase() {
  const stage = $('scStage');
  const canvas = $('productGL');
  const renderer = makeRenderer(canvas);
  const first = await loadTex(IMG(PRODUCTS[current].img));

  const uniforms = {
    uTex1: { value: first }, uTex2: { value: first },
    uProgress: { value: 0 }, uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImg: { value: new THREE.Vector2(first.image.width, first.image.height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uHover: { value: 0 },
  };
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms, vertexShader: VERT,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex1, uTex2; uniform float uProgress, uTime, uHover;
      uniform vec2 uRes, uImg, uMouse; varying vec2 vUv;
      ${NOISE}
      void main(){
        vec2 uv=vUv;
        vec2 asp=vec2(uRes.x/uRes.y,1.0);
        vec2 d=(uv-uMouse)*asp; float len=length(d);
        float rip=sin(len*60.0-uTime*6.0)*exp(-len*8.0)*uHover;
        uv+=normalize(d+1e-5)*rip*0.0025/asp;

        float n=snoise(uv*2.2+uTime*0.08)*0.5+0.5;
        float th=mix(n,1.0-vUv.y,0.6);          // liquid rises from the bottom
        float p=uProgress*1.3-0.15;
        float m=smoothstep(th-0.12,th+0.12,p);
        float edge=smoothstep(0.0,0.5,m)*smoothstep(1.0,0.5,m);

        vec2 uv1=uv+vec2(0.0,-m*0.025)+(n-0.5)*edge*0.02;
        vec2 uv2=uv+vec2(0.0,(1.0-m)*0.025)-(n-0.5)*edge*0.02;
        vec3 c1=texture2D(uTex1,cover(uv1,uRes,uImg)).rgb;
        vec3 c2=texture2D(uTex2,cover(uv2,uRes,uImg)).rgb;
        vec3 col=mix(c1,c2,m);
        col+=edge*0.08;                          // foam line
        col+=rip*0.01;
        gl_FragColor=vec4(col,1.0);
      }`,
  }));

  // carbonation bubbles (only for Kisjela voda)
  const N = 220;
  const seeds = new Float32Array(N * 4);
  for (let k = 0; k < N * 4; k++) seeds[k] = Math.random();
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
  const bubbleU = { uTime: { value: 0 }, uAlpha: { value: 0 }, uPR: { value: renderer.getPixelRatio() } };
  const bubbles = new THREE.Points(g, new THREE.ShaderMaterial({
    uniforms: bubbleU, transparent: true, depthTest: false, depthWrite: false,
    vertexShader: /* glsl */`
      uniform float uTime, uPR; attribute vec4 aSeed; varying float vA;
      void main(){
        float speed=0.10+aSeed.y*0.22;
        float y=mod(aSeed.x*2.6+uTime*speed,2.6)-1.3;
        float x=(aSeed.z*2.0-1.0)*0.42+sin(uTime*(1.0+aSeed.w*2.0)+aSeed.x*20.0)*0.012;
        gl_Position=vec4(x,y,0.0,1.0);
        gl_PointSize=(2.5+pow(aSeed.w,3.0)*11.0)*uPR;
        vA=smoothstep(-1.3,-0.8,y)*smoothstep(1.3,0.6,y)*(0.4+aSeed.y*0.6);
      }`,
    fragmentShader: /* glsl */`
      uniform float uAlpha; varying float vA;
      void main(){
        vec2 c=gl_PointCoord-0.5; float r=length(c);
        if(r>0.5) discard;
        float ring=smoothstep(0.5,0.4,r)-smoothstep(0.38,0.18,r)*0.75;
        float hl=smoothstep(0.16,0.0,length(c-vec2(-0.14,-0.14)));
        gl_FragColor=vec4(vec3(1.0),(ring*0.8+hl*0.9)*vA*uAlpha);
      }`,
  }));

  const scene = new THREE.Scene();
  scene.add(plane, bubbles);
  const cam = new THREE.Camera();

  const resize = () => {
    const { width, height } = stage.getBoundingClientRect();
    renderer.setSize(width, height, false);
    uniforms.uRes.value.set(width, height);
  };
  resize(); addEventListener('resize', resize);

  const mouse = new THREE.Vector2(0.5, 0.5);
  let hoverTarget = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    hoverTarget = 1;
  });
  stage.addEventListener('pointerleave', () => (hoverTarget = 0));

  let anim = null; // {start, dur}
  let token = 0;
  stageGL = {
    async show(i) {
      const my = ++token;
      const tex = await loadTex(IMG(PRODUCTS[i].img));
      if (my !== token) return;
      if (anim) uniforms.uTex1.value = uniforms.uTex2.value; // jump if interrupted
      uniforms.uTex2.value = tex;
      uniforms.uProgress.value = 0;
      anim = { start: performance.now(), dur: reduceMotion ? 1 : 1000 };
    },
  };

  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  visibleLoop(stage, (t) => {
    uniforms.uTime.value = t; bubbleU.uTime.value = t;
    uniforms.uMouse.value.lerp(mouse, 0.12);
    uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.06;
    const wantBubbles = PRODUCTS[current].cat === 'kisjela' && !reduceMotion ? 1 : 0;
    bubbleU.uAlpha.value += (wantBubbles - bubbleU.uAlpha.value) * 0.05;
    if (anim) {
      const k = Math.min(1, (performance.now() - anim.start) / anim.dur);
      uniforms.uProgress.value = ease(k);
      if (k >= 1) { uniforms.uTex1.value = uniforms.uTex2.value; uniforms.uProgress.value = 0; anim = null; }
    }
    renderer.render(scene, cam);
  });
  stage.classList.add('gl-ready');

  // warm the cache in the background
  setTimeout(() => PRODUCTS.forEach((p) => loadTex(IMG(p.img))), 1500);
}

function wireShowcase() {
  renderInfo(current);
  onLang(() => renderInfo(current));
  $('scPrev').onclick = () => select(current - 1);
  $('scNext').onclick = () => select(current + 1);
  document.querySelectorAll('.sc-tabs button').forEach((b) => {
    b.onclick = () => select(PRODUCTS.findIndex((p) => p.cat === b.dataset.cat && (b.dataset.cat === 'kisjela' || p.key === 'izvorska-pet')));
  });
  document.querySelectorAll('[data-goto]').forEach((a) => {
    a.addEventListener('click', () => select(PRODUCTS.findIndex((p) => p.key === a.dataset.goto)));
  });
  addEventListener('keydown', (e) => {
    const r = $('asortiman').getBoundingClientRect();
    if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.5) return;
    if (e.key === 'ArrowRight') select(current + 1);
    if (e.key === 'ArrowLeft') select(current - 1);
  });
}

/* ------------------------------------------------------------------ */
wireShowcase();
initStory();
const hasGL = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
if (hasGL) {
  initHero().catch((e) => console.warn('hero GL off', e));
  initShowcase().catch((e) => { console.warn('showcase GL off', e); stageGL = null; });
}
