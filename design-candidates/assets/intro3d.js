/* ═══════════════════════════════════════════════════════════════════
   YSME — intro3d.js
   첫 방문 인트로: 연세대 씰이 3D 조각(외곽 링 4분할 + 중앙 코어)으로
   흩어진 상태에서 조립되고, 학부명이 뜬 뒤 홈으로 페이드.
   · 세션당 1회(가드는 G-console.html 인라인 스크립트) · 클릭 스킵
   · WebGL/텍스처 실패 시 2D 페이드 폴백 · 4.2s 하드킬 안전망
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

function start(tex) {
  if (done) return;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

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
  var mFront = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  var mBack = new THREE.MeshBasicMaterial({ color: 0x122c55, side: THREE.DoubleSide });

  var parts = [];
  function addPart(geo, from, rotFrom) {
    var grp = new THREE.Group();
    var f = new THREE.Mesh(sealUV(geo), mFront);
    var b = new THREE.Mesh(geo.clone(), mBack);
    b.position.z = -0.035;           // 얇은 코인 뒷면
    grp.add(f); grp.add(b);
    grp.userData = { from: from, rotFrom: rotFrom };
    grp.position.copy(from);
    grp.rotation.set(rotFrom.x, rotFrom.y, rotFrom.z);
    root.add(grp);
    parts.push(grp);
  }

  /* 외곽 링 4분할 — 대각선 네 방향에서 진입 */
  var SEG = Math.PI / 2;
  for (var k = 0; k < 4; k++) {
    var a = Math.PI / 4 + k * SEG + SEG / 2;
    addPart(
      new THREE.RingGeometry(0.615, 1.002, 72, 1, Math.PI / 4 + k * SEG, SEG),
      new THREE.Vector3(Math.cos(a) * 4.8, Math.sin(a) * 4.8, -2.4 - k * 0.6),
      new THREE.Euler(0.9 - k * 0.45, -1.1 + k * 0.55, 0.6 - k * 0.3)
    );
  }
  /* 중앙 코어(방패부) — 마지막에 앞에서 딸깍 결합 */
  addPart(
    new THREE.CircleGeometry(0.62, 80),
    new THREE.Vector3(0, -0.25, 5.0),
    new THREE.Euler(-0.85, 0.4, 0.25)
  );

  var ZERO = new THREE.Vector3(0, 0, 0);
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  var T0 = performance.now();
  var textOn = false, endAt = 2450;

  function frame(now) {
    if (done) return;
    var t = now - T0;

    for (var i = 0; i < parts.length; i++) {
      var g = parts[i], st = i * 200, e = easeOut(clamp01((t - st) / 750));
      g.position.lerpVectors(g.userData.from, ZERO, e);
      var r = g.userData.rotFrom;
      g.rotation.set(r.x * (1 - e), r.y * (1 - e), r.z * (1 - e));
    }
    var whole = easeOut(clamp01(t / 1500));
    root.rotation.y = -0.5 * (1 - whole);
    cam.position.z = 7.2 - 1.3 * whole;

    /* 결합 순간 살짝 팝 */
    var pp = clamp01((t - 1560) / 260);
    var s = 1 + 0.045 * Math.sin(Math.PI * pp);
    root.scale.set(s, s, s);

    if (!textOn && t > 1620) { textOn = true; box.classList.add('is-on'); }
    if (t > endAt) { renderer.render(scene, cam); finish(); return; }

    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  renderer.render(scene, cam);       // 첫 프레임 동기 렌더(빈 화면 방지)
  raf = requestAnimationFrame(frame);
}

})();
