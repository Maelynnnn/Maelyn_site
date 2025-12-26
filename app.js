// ===================== DOM =====================
const starsCanvas = document.getElementById("stars");
const sphereCanvas = document.getElementById("sphere");
const titleEl = document.getElementById("title");
const hero = document.querySelector(".hero");
document.getElementById("year").textContent = new Date().getFullYear();

const aboutSection = document.getElementById("about");
const aboutImg = document.getElementById("aboutImg");


// ===================== helpers =====================
function clamp01(x){ return Math.min(1, Math.max(0, x)); }
function lerp(a,b,t){ return a + (b-a)*t; }
function smoothstep(e0,e1,x){
  const t = clamp01((x-e0)/(e1-e0));
  return t*t*(3-2*t);
}
function getProgress(){
  const rect = hero.getBoundingClientRect();
  const total = hero.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  return total > 0 ? (scrolled / total) : 0;
}

// ===================== theme =====================
const THEME = {
  bg:    [7,7,7],
  paper: [239,233,223],
  ink:   [10,10,10]
};

// ===================== thresholds（保持你改过的） =====================
const T = {
  approachStart: 0.02,
  approachEnd:   0.62,

  paperStart:    0.25,
  paperEnd:      0.30,

  titleStart:    0.36,
  titleEnd:      0.40,

  fadeStart:     0.52,
  fadeEnd:       0.78
};

// ===================== 2D STARS =====================
const sctx = starsCanvas.getContext("2d");
let SW=0, SH=0, DPR=1;
let stars = [];

// meteors
let meteors = [];
let nextMeteorAt = 0;

function mulberry32(a){
  return function(){
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rand = mulberry32(7771);

function resizeStars(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  SW = Math.floor(window.innerWidth);
  SH = Math.floor(window.innerHeight);

  starsCanvas.width = Math.floor(SW * DPR);
  starsCanvas.height = Math.floor(SH * DPR);
  starsCanvas.style.width = SW + "px";
  starsCanvas.style.height = SH + "px";
  sctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  rand = mulberry32(7771);
  stars = [];
  const count = Math.floor((SW * SH) / 15000);

  for(let i=0;i<count;i++){
    stars.push({
      x: rand()*SW,
      y: rand()*SH,
      r: 0.6 + rand()*1.4,

      // ⭐ 明显闪烁参数
      base: 0.03 + rand()*0.08,
      amp:  0.20 + rand()*0.35,
      sp:   1.8 + rand()*0.8,  // 慢
      ph:   rand()*Math.PI*2
    });
  }

  const nowSec = performance.now()/1000;
  nextMeteorAt = nowSec + 3.0;
}

// ===================== ☄️ 流星（右 → 左） =====================
function spawnMeteor(timeSec){
  const y0 = rand() * SH * 0.5;

  meteors.push({
    t0: timeSec,
    t1: timeSec + (0.6 + rand()*0.3),

    // 起点在右侧外
    x0: SW * 1.1,
    y0: y0,

    // 终点在左下方
    x1: -SW * 0.1,
    y1: y0 + SH*(0.15 + rand()*0.25),

    w: 0.6 + rand()*0.8,   // 细线
    a: 0.25 + rand()*0.25
  });
}

function drawStars(timeSec, fade){
  sctx.clearRect(0,0,SW,SH);

  // vignette
  const g = sctx.createRadialGradient(
    SW*0.5, SH*0.5, 0,
    SW*0.5, SH*0.5, Math.max(SW,SH)*0.7
  );
  g.addColorStop(0, `rgba(255,255,255,${0.02*fade})`);
  g.addColorStop(1, `rgba(0,0,0,0)`);
  sctx.fillStyle = g;
  sctx.fillRect(0,0,SW,SH);

  // ⭐ stars: 明确的一闪一闪
  for(const st of stars){
    const tw = (Math.sin(timeSec*st.sp + st.ph) + 1) * 0.5; // 0..1
    const a = (st.base + st.amp * tw) * fade;

    sctx.fillStyle = `rgba(${THEME.paper[0]},${THEME.paper[1]},${THEME.paper[2]},${a})`;
    sctx.beginPath();
    sctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    sctx.fill();
  }

  // ☄️ meteors
  meteors = meteors.filter(m => timeSec < m.t1);
  sctx.save();
  sctx.lineCap = "round";

  for(const m of meteors){
    const t = clamp01((timeSec - m.t0) / (m.t1 - m.t0));

    const a = m.a
      * smoothstep(0.0, 0.15, t)
      * (1 - smoothstep(0.65, 1.0, t))
      * fade;

    const x = lerp(m.x0, m.x1, t);
    const y = lerp(m.y0, m.y1, t);

    const tx = lerp(m.x0, m.x1, t - 0.18);
    const ty = lerp(m.y0, m.y1, t - 0.18);

    sctx.strokeStyle = `rgba(${THEME.paper[0]},${THEME.paper[1]},${THEME.paper[2]},${a})`;
    sctx.lineWidth = m.w;

    sctx.beginPath();
    sctx.moveTo(tx, ty);
    sctx.lineTo(x, y);
    sctx.stroke();
  }

  sctx.restore();
}



// ===================== THREE.JS SPHERE（保持不变） =====================
const renderer = new THREE.WebGLRenderer({ canvas: sphereCanvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 50);
camera.position.set(0, 0, 2.35);

scene.add(new THREE.AmbientLight(0xffffff, 0.22));
const key = new THREE.DirectionalLight(0xffffff, 0.95);
key.position.set(2.2, 1.1, 2.2);
scene.add(key);

const rim = new THREE.DirectionalLight(0xffffff, 0.28);
rim.position.set(-2.2, 0.3, 1.8);
scene.add(rim);

const loader = new THREE.TextureLoader();
const earthTex = loader.load("assets/earth.png");
earthTex.colorSpace = THREE.SRGBColorSpace;
earthTex.wrapS = THREE.RepeatWrapping;
earthTex.wrapT = THREE.ClampToEdgeWrapping;

const sphereGeo = new THREE.SphereGeometry(0.35, 160, 160);
const sphereMat = new THREE.MeshStandardMaterial({
  map: earthTex,
  roughness: 0.88,
  metalness: 0.02,
  emissive: new THREE.Color("white"),
  emissiveMap: earthTex,
  emissiveIntensity: 1.15,
  transparent: true,
  opacity: 1
});

const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

const halo = new THREE.Mesh(
  new THREE.SphereGeometry(0.364, 96, 96),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.02 })
);
scene.add(halo);

sphere.rotation.y = -0.55;
halo.rotation.copy(sphere.rotation);

// ===================== resize =====================
function resizeAll(){
  resizeStars();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resizeAll);
resizeAll();

// ===================== UI =====================
function updateBodyBackground(p){
  const t = smoothstep(T.paperStart, T.paperEnd, p);
  document.body.style.backgroundColor =
    `rgb(${lerp(THEME.bg[0],THEME.paper[0],t)},
         ${lerp(THEME.bg[1],THEME.paper[1],t)},
         ${lerp(THEME.bg[2],THEME.paper[2],t)})`;
}

function updateTitle(p){
  const t = smoothstep(T.titleStart, T.titleEnd, p);
  titleEl.style.opacity = t;
  titleEl.style.transform = `translateY(${lerp(6,0,t)}px)`;
}

// ===================== loop =====================
let last = performance.now();
function loop(now){
  const dt = Math.min(0.05, (now-last)/1000);
  last = now;

  const p = getProgress();
  updateBodyBackground(p);
  updateTitle(p);

  const approachT = smoothstep(T.approachStart, T.approachEnd, p);
  const fade = 1 - smoothstep(T.fadeStart, T.fadeEnd, p);

  const timeSec = now/1000;
  if (timeSec >= nextMeteorAt){
    spawnMeteor(timeSec);
    nextMeteorAt = timeSec + 5.0;
  }

  drawStars(timeSec, fade);

  if (aboutSection && aboutImg) {
    const r = aboutSection.getBoundingClientRect();
    const h = aboutSection.offsetHeight;
    const view = window.innerHeight;

    // progress: 0 when section just enters, 1 when it leaves
    const total = Math.max(1, h - view);
    const scrolled = clamp01((-r.top) / total);

    // fade in then fade out
    const fadeIn  = smoothstep(0.05, 0.25, scrolled);
    const op = fadeIn;

    aboutImg.style.opacity = String(op);
  }

  starsCanvas.style.opacity = (p >= T.fadeEnd) ? "0" : "1";

  const spin = lerp(0.12, 0.38, approachT);
  sphere.rotation.y += dt * spin;
  sphere.rotation.x = lerp(0.06, 0.14, approachT);
  halo.rotation.copy(sphere.rotation);

  const scale = lerp(0.50, 6.8, approachT);
  sphere.scale.setScalar(scale);
  halo.scale.setScalar(scale);
  camera.position.z = lerp(2.35, 0.60, approachT);

  sphere.material.opacity = fade;
  halo.material.opacity = 0.02 * fade;
  sphereCanvas.style.opacity = (p >= T.fadeEnd) ? "0" : "1";

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
