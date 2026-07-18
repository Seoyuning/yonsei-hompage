/* ═══════════════════════════════════════════════════════════════════
   YSME — hero-eagle.js
   홈 히어로 3D: 유성기어 자리에 기계 독수리(Rukh3D 'Robot Bird Eagle',
   CC-BY-4.0)가 계속 날갯짓하며 떠 있는다. 기어 버전은 gear3d.js 로 보존.
   · 재질: 기어와 같은 백은 금속(마스코트 로고의 흰 몸체 톤)
   · 마우스 시차 반응 · prefers-reduced-motion 정지 프레임
   · WebGL 실패/타임아웃 시 기존 SVG 폴백(gl-off) 그대로 동작
   ═══════════════════════════════════════════════════════════════════ */
import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { rigWings } from './eagle-utils.js';

(function () {
'use strict';

var cv = document.getElementById('gear3d');
if (!cv) return;
var doc = document.documentElement;
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

var fb = document.querySelector('.core-fallback');
function glOff() {
  doc.classList.remove('gl-on'); doc.classList.add('gl-off');
  if (fb) fb.style.display = '';
}
/* 로드 지연·실패 안전망 — 2.5s 내 첫 렌더 없으면 SVG 폴백 */
var booted = false;
setTimeout(function () { if (!booted) glOff(); }, 2500);

var renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
} catch (e) { glOff(); return; }

var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(35, 1, 0.1, 60);

scene.add(new THREE.AmbientLight(0xc4d2e8, 0.9));
var keyL = new THREE.DirectionalLight(0xffffff, 1.9);
keyL.position.set(2.5, 3.5, 5);
scene.add(keyL);
var rimL = new THREE.DirectionalLight(0x86aeff, 0.8);
rimL.position.set(-3, -1.5, 2);
scene.add(rimL);

function size() {
  var host = cv.parentElement || cv;
  var w = host.clientWidth || innerWidth, h = host.clientHeight || innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  cam.aspect = w / h;
  cam.position.z = Math.max(9, 10.5 * (540 / Math.max(h, 1)) * 0.9 + 4);
  cam.updateProjectionMatrix();
}
size();
addEventListener('resize', size);

/* 마우스 시차 */
var mx = 0, my = 0;
addEventListener('pointermove', function (e) {
  mx = (e.clientX / innerWidth) * 2 - 1;
  my = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });

var root = null, mixer = null, prev = 0;
/* 기본: Neil Laguardia 'Mechanical Eagle'(텍스처 PBR·정적 → 활공 모션).
   경로를 eagle-model/ 로 바꾸면 리깅(날갯짓) 버전 — 자동 감지 */
var MODEL_URL = 'assets/eagle-model2/scene.gltf';
new GLTFLoader().load(MODEL_URL, function (g) {
  try {
    var obj = g.scene;
    obj.traverse(function (o) {
      if ((o.isMesh || o.isSkinnedMesh) && o.material) {
        o.frustumCulled = false;
        if (o.material.emissive) o.material.emissiveIntensity = 1.5;
      }
    });
    var wings = rigWings(obj);           // 정적 모델용 날개 분리 리깅
    if (g.animations && g.animations.length) {
      mixer = new THREE.AnimationMixer(obj);
      var act = mixer.clipAction(g.animations[0]);
      act.timeScale = 0.5;               // 유유히 계속 날갯짓
      act.play();
      act.time = g.animations[0].duration * 0.25;
      mixer.update(0);
    }
    obj.updateMatrixWorld(true);
    var bb = new THREE.Box3();
    var hasBones = false;
    obj.traverse(function (o) {
      if (o.isBone) { hasBones = true; bb.expandByPoint(o.getWorldPosition(new THREE.Vector3())); }
    });
    if (!hasBones) bb.setFromObject(obj);
    var s = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3());
    var sc = 4.8 / Math.max(s.x, s.y, s.z, 0.01);
    obj.position.sub(c);
    root = new THREE.Group();
    root.add(obj);
    root.scale.setScalar(sc);
    root.rotation.y = Math.PI - 0.12;    // 정면(부리·눈이 보이는 쪽) 3/4
    root.rotation.x = 0.1;
    root.userData.wings = wings;
    scene.add(root);

    renderer.render(scene, cam);          // 첫 프레임 동기 렌더
    booted = true;
    doc.classList.remove('gl-off');
    doc.classList.add('gl-on');
    if (fb) fb.style.display = 'none';
    if (!reduced) {
      prev = performance.now();
      requestAnimationFrame(loop);
    }
  } catch (e) { glOff(); }
}, undefined, glOff);

function loop(now) {
  var dt = Math.min(0.05, (now - prev) / 1000);
  prev = now;
  if (mixer) mixer.update(dt);
  if (root) {
    /* 비행: 날갯짓 + 좌우 뱅킹 + 느린 요잉 + 상승기류 부유 (+ 마우스 시차) */
    root.rotation.y += ((Math.PI - 0.12 + mx * 0.24 + Math.sin(now / 3900) * 0.06) - root.rotation.y) * 0.06;
    root.rotation.x += ((0.1 + my * 0.1) - root.rotation.x) * 0.06;
    root.rotation.z = Math.sin(now / 2600) * 0.07;
    root.position.y = Math.sin(now / 1700) * 0.14;
    var wg = root.userData.wings;
    if (wg) {
      var fl = Math.sin(now / 420) * 0.26;
      wg.left.rotation[wg.axis] = fl;
      wg.right.rotation[wg.axis] = -fl;
    }
  }
  renderer.render(scene, cam);
  requestAnimationFrame(loop);
}

})();
