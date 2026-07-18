/* ═══════════════════════════════════════════════════════════════════
   YSME — intro3d.js
   첫 방문 인트로: 연세대 씰이 기계 부품처럼 조립되는 모션.
   · 조립 중에는 흰 바탕을 뺀 네이비 스텐실 판(외곽 링 4분할+중앙 코어)만 —
     레터·문양이 뚫린 가공 금속판이 면 안에서 슬라이드/압입되며 스냅 체결
   · 전부 체결되면 흰 백킹 플레이트가 채워지며 공식 씰 완성 → 학부명 → 홈 페이드
   · 세션당 1회(가드는 G-console.html 인라인) · 클릭 스킵 · 4.2s 하드킬 안전망
   · WebGL/텍스처 실패 시 2D 페이드 폴백
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
  if (fb) fb.hidden = false;
  box.classList.add('is-2d');
  setTimeout(function () { box.classList.add('is-on'); }, 40);
  setTimeout(finish, 2300);
}

var gl = null;
try { gl = cv.getContext('webgl2') || cv.getContext('webgl'); } catch (e) {}
if (!gl) { fallback(); return; }

new THREE.TextureLoader().load('assets/yonsei-seal.png', start, undefined, fallback);

/* 씰 이미지를 두 레이어로 분리:
   navy = 흰 영역을 투명하게 뺀 네이비 도장면(조립 중 보이는 가공 판)
   white = 흰 영역만(완성 순간 채워지는 백킹 플레이트) */
function split(img) {
  var S = 640;
  var cn = document.createElement('canvas'); cn.width = cn.height = S;
  var cw = document.createElement('canvas'); cw.width = cw.height = S;
  var xn = cn.getContext('2d'), xw = cw.getContext('2d');
  xn.drawImage(img, 0, 0, S, S);
  var d = xn.getImageData(0, 0, S, S), dd = d.data;
  var w = xw.createImageData(S, S), wd = w.data;
  for (var i = 0; i < dd.length; i += 4) {
    var a = dd[i + 3];
    var lum = 0.299 * dd[i] + 0.587 * dd[i + 1] + 0.114 * dd[i + 2];
    var t = (lum - 120) / 100; t = t < 0 ? 0 : t > 1 ? 1 : t;   // 0=네이비 1=흰색
    wd[i] = wd[i + 1] = wd[i + 2] = 255; wd[i + 3] = a * t;
    dd[i + 3] = a * (1 - t);
  }
  xn.putImageData(d, 0, 0);
  xw.putImageData(w, 0, 0);
  var tn = new THREE.CanvasTexture(cn), tw = new THREE.CanvasTexture(cw);
  tn.colorSpace = THREE.SRGBColorSpace;
  tw.colorSpace = THREE.SRGBColorSpace;
  return { navy: tn, white: tw };
}

function start(tex) {
  if (done) return;
  var layers;
  try { layers = split(tex.image); } catch (e) { fallback(); return; }

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
  root.position.y = 0.35;            // 씰을 화면 중심보다 살짝 위로 (아래는 학부명 자리)
  scene.add(root);

  /* 씰 반지름 1 기준. 조각 UV를 씰 전체 이미지 좌표로 다시 매핑 */
  function sealUV(g) {
    var p = g.attributes.position, u = g.attributes.uv;
    for (var i = 0; i < u.count; i++) u.setXY(i, p.getX(i) / 2 + 0.5, p.getY(i) / 2 + 0.5);
    u.needsUpdate = true;
    return g;
  }
  var mNavy = new THREE.MeshBasicMaterial({ map: layers.navy, transparent: true, side: THREE.DoubleSide });
  var mPlate = new THREE.MeshBasicMaterial({ color: 0x15325e, side: THREE.DoubleSide });

  var parts = [];
  function addPart(geo, from, rotZ) {
    var grp = new THREE.Group();
    var f = new THREE.Mesh(sealUV(geo), mNavy);
    var b = new THREE.Mesh(geo.clone(), mPlate);
    b.position.z = -0.05;            // 판 두께 — 뚫린 문양이 얕게 가공된 것처럼 보이게
    grp.add(f); grp.add(b);
    grp.userData = { from: from, rotZ: rotZ };
    grp.position.copy(from);
    grp.rotation.z = rotZ;
    root.add(grp);
    parts.push(grp);
  }

  /* 외곽 링 4분할 — 화면 면 안에서 방사 방향 바깥으로 물러난 큰 판이
     안쪽으로 압입되듯 슬라이드(멀리서 날아오지 않게 z는 거의 고정) */
  var SEG = Math.PI / 2;
  for (var k = 0; k < 4; k++) {
    var a = Math.PI / 4 + k * SEG + SEG / 2;
    addPart(
      new THREE.RingGeometry(0.615, 1.002, 72, 1, Math.PI / 4 + k * SEG, SEG),
      new THREE.Vector3(Math.cos(a) * 2.35, Math.sin(a) * 2.35, 0.25),
      (k % 2 ? 0.5 : -0.5)
    );
  }
  /* 중앙 코어 — 정면에서 축 방향 압입(프레스 피팅) */
  addPart(new THREE.CircleGeometry(0.62, 80), new THREE.Vector3(0, 0, 4.6), 0.35);

  /* 흰 백킹 플레이트 — 조립 중에는 투명, 전부 체결되면 채워진다 */
  var white = new THREE.Mesh(
    sealUV(new THREE.CircleGeometry(1.002, 96)),
    new THREE.MeshBasicMaterial({ map: layers.white, transparent: true, opacity: 0 })
  );
  white.position.z = -0.012;
  root.add(white);

  var ZERO = new THREE.Vector3(0, 0, 0);
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  /* 기계 체결 느낌: 감속 후 살짝 오버슛하고 스냅 */
  function snap(t) { var c = 0.9; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  var T0 = performance.now();
  var textOn = false, endAt = 2430;

  function frame(now) {
    if (done) return;
    var t = now - T0;

    for (var i = 0; i < parts.length; i++) {
      var g = parts[i], st = i * 185, dur = (i === 4 ? 680 : 640);
      var e = snap(clamp01((t - st) / dur));
      g.position.lerpVectors(g.userData.from, ZERO, e);
      g.rotation.z = g.userData.rotZ * (1 - e);
    }
    var whole = easeOut(clamp01(t / 1450));
    root.rotation.y = -0.26 * (1 - whole);
    cam.position.z = 7.2 - 1.3 * whole;

    /* 완성: 흰 플레이트 충전 + 결합 팝 */
    white.material.opacity = easeOut(clamp01((t - 1480) / 330));
    var pp = clamp01((t - 1480) / 300);
    var s = 1 + 0.05 * Math.sin(Math.PI * pp);
    root.scale.set(s, s, s);

    if (!textOn && t > 1560) { textOn = true; box.classList.add('is-on'); }
    if (t > endAt) { renderer.render(scene, cam); finish(); return; }

    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  renderer.render(scene, cam);       // 첫 프레임 동기 렌더(빈 화면 방지)
  raf = requestAnimationFrame(frame);
}

})();
