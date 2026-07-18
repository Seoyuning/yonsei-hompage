/* ═══════════════════════════════════════════════════════════════════
   YSME — intro-eagle.js  (인트로 후보 B — A는 intro3d.js 씰 조립)
   기계 독수리(ME 로고)가 부품 5개(몸통+머리 / 왼날개 / 오른날개 / 꼬리 / 발톱)로
   나뉘어 하나씩 체결되고, 완성되면 날갯짓하며 떠오른 뒤 학부명이 뜬다.
   · 부품 분해는 런타임에 영역 클립으로 생성(me-eagle.png 하나만 사용)
   · 세션당 1회 · 클릭 스킵 · 4.2s 하드킬 · WebGL 실패 시 2D 폴백
   ═══════════════════════════════════════════════════════════════════ */
import * as THREE from './vendor/three.module.min.js';

(function () {
'use strict';

var box = document.getElementById('intro');
if (!box) return;
var cv = document.getElementById('introCv');

var done = false, raf = 0, renderer = null;

function finish() {
  if (done) return;
  done = true;
  box.classList.add('is-out');
  document.documentElement.classList.remove('intro-lock');
  setTimeout(function () {
    if (raf) cancelAnimationFrame(raf);
    try { if (renderer) renderer.dispose(); } catch (e) {}
    if (box.parentNode) box.parentNode.removeChild(box);
  }, 520);
}
box.addEventListener('click', finish);
/* 백그라운드 탭(rAF 정지)·예외 등 어떤 경우에도 인트로가 화면을 잡아두지 않게 */
setTimeout(finish, 4200);

function fallback() {
  var fb = document.getElementById('introFb');
  if (fb) { fb.src = 'assets/me-eagle.png'; fb.hidden = false; }
  box.classList.add('is-2d');
  setTimeout(function () { box.classList.add('is-on'); }, 40);
  setTimeout(finish, 2300);
}

var gl = null;
try { gl = cv.getContext('webgl2') || cv.getContext('webgl'); } catch (e) {}
if (!gl) { fallback(); return; }

new THREE.TextureLoader().load('assets/me-eagle.png', start, undefined, fallback);

/* 부품 영역(640 정사각 이미지 좌표, 직사각형 합집합으로 정확히 분할):
   경계 직선은 부품 사이 검은 틈을 지나므로 재조립 시 이음새가 없다 */
var REGIONS = {
  wingL:  [[0, 0, 395, 345]],
  wingR:  [[395, 0, 245, 270]],
  tail:   [[0, 345, 330, 295]],
  talons: [[330, 480, 310, 160]],
  body:   [[395, 270, 245, 210], [330, 345, 65, 135]]
};

function partTexture(img, rects) {
  var S = 640, c = document.createElement('canvas');
  c.width = c.height = S;
  var x = c.getContext('2d');
  x.beginPath();
  for (var i = 0; i < rects.length; i++) x.rect(rects[i][0], rects[i][1], rects[i][2], rects[i][3]);
  x.clip();
  x.drawImage(img, 0, 0, S, S);
  var t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function start(tex) {
  if (done) return;
  var img = tex.image;

  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  cam.position.set(0, 0, 7.2);

  function size() {
    var w = box.clientWidth || innerWidth, h = box.clientHeight || innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }
  size();
  addEventListener('resize', size);

  var root = new THREE.Group();
  root.position.y = 0.35;
  scene.add(root);

  /* 이미지 640px → 월드 2×2 쿼드. 힌지(회전축)를 그룹 원점에 두고
     메시를 -힌지만큼 밀어 조립 후 날갯짓 회전이 관절에서 일어나게 한다 */
  function toWorld(px, py) { return { x: px / 320 - 1, y: 1 - py / 320 }; }

  var parts = {};
  function addPart(key, hingePx, from, rotZ) {
    var hinge = toWorld(hingePx[0], hingePx[1]);
    var grp = new THREE.Group();
    var m = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ map: partTexture(img, REGIONS[key]), transparent: true, side: THREE.DoubleSide })
    );
    m.position.set(-hinge.x, -hinge.y, 0);
    grp.add(m);
    grp.userData = {
      home: new THREE.Vector3(hinge.x, hinge.y, 0),
      from: new THREE.Vector3(hinge.x + from[0], hinge.y + from[1], from[2]),
      rotZ: rotZ
    };
    grp.position.copy(grp.userData.from);
    grp.rotation.z = rotZ;
    root.add(grp);
    parts[key] = grp;
    return grp;
  }

  /* 조립 순서: 몸통(섀시) → 왼날개 → 오른날개 → 꼬리 → 발톱 */
  var ORDER = ['body', 'wingL', 'wingR', 'tail', 'talons'];
  addPart('body',   [385, 400], [0, 0, 4.2], 0.3);       // 정면 축 방향 압입
  addPart('wingL',  [330, 330], [-2.3, 0.8, 0.25], -0.45);
  addPart('wingR',  [430, 290], [2.3, 0.9, 0.25], 0.45);
  addPart('tail',   [330, 400], [-2.1, -1.1, 0.25], 0.4);
  addPart('talons', [400, 480], [0.4, -2.3, 0.25], -0.35);

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  /* 기계 체결: 감속 후 살짝 오버슛하고 스냅 */
  function snap(t) { var c = 0.9; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var T0 = performance.now();
  var textOn = false, endAt = 2480;

  function frame(now) {
    if (done) return;
    var t = now - T0;

    for (var i = 0; i < ORDER.length; i++) {
      var g = parts[ORDER[i]], st = i * 180;
      var e = snap(clamp01((t - st) / 520));
      g.position.lerpVectors(g.userData.from, g.userData.home, e);
      g.rotation.z = g.userData.rotZ * (1 - e);
    }
    var whole = easeOut(clamp01(t / 1350));
    root.rotation.y = -0.22 * (1 - whole);
    cam.position.z = 7.2 - 1.3 * whole;

    /* 완성 후: 날갯짓 2회 + 상승(비행) */
    var f = clamp01((t - 1300) / 850);
    if (f > 0) {
      var amp = Math.sin(Math.PI * f);                    // 서서히 커졌다 잦아드는 진폭
      var flap = Math.sin(f * Math.PI * 4) * 0.5 * amp;   // 2사이클
      parts.wingL.rotation.y = flap;
      parts.wingR.rotation.y = -flap;
      parts.tail.rotation.x = flap * 0.18;                // 꼬리는 살짝 따라 젓기
    }
    var rise = easeIO(clamp01((t - 1450) / 850));
    root.position.y = 0.35 + 0.24 * rise;
    var s = 1 + 0.05 * rise;                              // 떠오르며 살짝 다가온다
    root.scale.set(s, s, s);

    if (!textOn && t > 1700) { textOn = true; box.classList.add('is-on'); }
    if (t > endAt) { renderer.render(scene, cam); finish(); return; }

    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  renderer.render(scene, cam);       // 첫 프레임 동기 렌더(빈 화면 방지)
  raf = requestAnimationFrame(frame);
}

})();
