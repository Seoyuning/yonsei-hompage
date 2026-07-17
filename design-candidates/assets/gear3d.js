/* ═══════════════════════════════════════════════════════════════
   시안 G · 관제 — 히어로 3D 유성기어(Planetary gear train)
   절차적 지오메트리(라이브러리 모델 없음) + 실시간 WebGL 회전.
   - 태양기어(sun) · 유성기어 3개(planet) · 내접 링기어(ring) · 캐리어(carrier)
   - 동일 모듈(module)로 치형 크기 일치, 피치원 접선 → 맞물려 보이게
   - 유성 운동학: 링 고정, 태양 입력. ωc = ωs·Ns/(Ns+Nr), ωp = ωc·(1−Nr/Np)
   - 검정 배경 위 투명 캔버스(별필드·궤도·HUD는 그대로 비침), 코랄 액센트
   - prefers-reduced-motion / WebGL 미지원 → 기존 SVG 폴백 유지
   ═══════════════════════════════════════════════════════════════ */
import * as THREE from './vendor/three.module.min.js';

(function () {
  'use strict';

  var canvas = document.getElementById('gear3d');
  var core = canvas ? canvas.closest('.core') : null;
  if (!canvas || !core) return;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* WebGL 지원 확인 → 없으면 SVG 폴백 유지 */
  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }
  if (!webglOK()) { document.body.classList.add('gl-off'); return; }

  /* ── 색 ── */
  var CORAL = 0xffffff;   /* 흰색 액센트 (팀 결정: 3D는 흰색+밝은 회색) */
  var GLOW = 0x2b4a74;

  /* ── 기어 파라미터 (동일 모듈 m, 3플래닛 등간격 조건 Ns+Nr가 3의 배수) ── */
  var Ns = 15, Np = 15, Nr = Ns + 2 * Np;   // 15 · 15 · 45
  var m = 2 / Ns;                            // 태양 피치반경 = 1
  var THICK = 0.34;                          // 기어 두께(압출)
  var NPLANET = 3;
  var rCarrier = (m * Ns / 2) + (m * Np / 2); // 태양+유성 피치반경 = 2

  /* 회전 속도(태양 기준) */
  var wS = 1.0;
  var wC = wS * Ns / (Ns + Nr);              // 캐리어 = 0.25·wS
  var wP_abs = wC * (1 - Nr / Np);           // 유성 절대 = −0.5·wS
  var wP_rel = wP_abs - wC;                  // 캐리어 프레임 기준 = −0.75·wS

  /* ── 외접 기어 단면(THREE.Shape): 사다리꼴 치형 + 중심 보어 ── */
  function gearShape(teeth, mod, bore) {
    var rP = mod * teeth / 2;
    var rA = rP + mod;          // 이끝(addendum)
    var rD = rP - 1.25 * mod;   // 이뿌리(dedendum)
    var s = new THREE.Shape();
    var step = Math.PI * 2 / teeth;
    var topA = step * 0.34, baseA = step * 0.52, seg = 3;
    for (var i = 0; i < teeth; i++) {
      var c = i * step;
      var P = [
        [rD, c - baseA / 2], [rA, c - topA / 2],
        [rA, c + topA / 2], [rD, c + baseA / 2]
      ];
      for (var j = 0; j < 4; j++) {
        var x = Math.cos(P[j][1]) * P[j][0], y = Math.sin(P[j][1]) * P[j][0];
        (i === 0 && j === 0) ? s.moveTo(x, y) : s.lineTo(x, y);
      }
      var a0 = c + baseA / 2, a1 = (i + 1) * step - baseA / 2;
      for (var k = 1; k <= seg; k++) {
        var a = a0 + (a1 - a0) * k / seg;
        s.lineTo(Math.cos(a) * rD, Math.sin(a) * rD);
      }
    }
    s.closePath();
    if (bore > 0) {
      var h = new THREE.Path();
      h.absarc(0, 0, bore, 0, Math.PI * 2, true);
      s.holes.push(h);
    }
    return s;
  }

  /* ── 내접 링기어 단면: 바깥은 원, 안쪽 구멍이 안으로 향한 치형 ── */
  function ringShape(teeth, mod, outer) {
    var rP = mod * teeth / 2;
    var rTip = rP - mod;        // 안쪽으로 향한 이끝
    var rRoot = rP + 1.25 * mod;
    var s = new THREE.Shape();
    s.absarc(0, 0, outer, 0, Math.PI * 2, false);
    var h = new THREE.Path();
    var step = Math.PI * 2 / teeth;
    var topA = step * 0.34, baseA = step * 0.52, seg = 3;
    for (var i = 0; i < teeth; i++) {
      var c = i * step;
      var P = [
        [rRoot, c - baseA / 2], [rTip, c - topA / 2],
        [rTip, c + topA / 2], [rRoot, c + baseA / 2]
      ];
      for (var j = 0; j < 4; j++) {
        var x = Math.cos(P[j][1]) * P[j][0], y = Math.sin(P[j][1]) * P[j][0];
        (i === 0 && j === 0) ? h.moveTo(x, y) : h.lineTo(x, y);
      }
      var a0 = c + baseA / 2, a1 = (i + 1) * step - baseA / 2;
      for (var k = 1; k <= seg; k++) {
        var a = a0 + (a1 - a0) * k / seg;
        h.lineTo(Math.cos(a) * rRoot, Math.sin(a) * rRoot);
      }
    }
    h.closePath();
    s.holes.push(h);
    return s;
  }

  var extrude = { depth: THICK, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 2, curveSegments: 24 };

  function gearMesh(teeth, mod, bore, mat) {
    var g = new THREE.ExtrudeGeometry(gearShape(teeth, mod, bore), extrude);
    g.center();
    return new THREE.Mesh(g, mat);
  }

  /* ── 재질(관제 톤): 건메탈 바디 + 코랄 태양/액센트 ── */
  var matSteel = new THREE.MeshStandardMaterial({ color: 0xc4cbd6, metalness: 0.72, roughness: 0.36 });
  var matSun = new THREE.MeshStandardMaterial({ color: 0xdfe4ea, metalness: 0.55, roughness: 0.4, emissive: CORAL, emissiveIntensity: 0.12 });
  var matRing = new THREE.MeshStandardMaterial({ color: 0x9ba5b3, metalness: 0.68, roughness: 0.46 });
  var matHub = new THREE.MeshStandardMaterial({ color: CORAL, metalness: 0.5, roughness: 0.3, emissive: CORAL, emissiveIntensity: 0.55 });
  var matArm = new THREE.MeshStandardMaterial({ color: 0x7b8595, metalness: 0.66, roughness: 0.48 });

  /* ── 씬 구성 ── */
  var scene = new THREE.Scene();
  var root = new THREE.Group();          // 전체 기구(틸트 대상)
  scene.add(root);

  // 링(고정)
  var ringOuter = m * Nr / 2 + 1.25 * m + 0.4;
  var ringGeo = new THREE.ExtrudeGeometry(ringShape(Nr, m, ringOuter), { depth: THICK * 1.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 40 });
  ringGeo.center();
  var ringMesh = new THREE.Mesh(ringGeo, matRing);
  ringMesh.position.z = -0.02;
  root.add(ringMesh);
  // 링 안쪽 코랄 계측 링(얇은 토러스)
  var telRing = new THREE.Mesh(new THREE.TorusGeometry(ringOuter + 0.12, 0.02, 8, 120), matHub);
  telRing.position.z = 0.14;
  root.add(telRing);

  // 태양기어
  var sun = gearMesh(Ns, m, 0.22, matSun);
  sun.position.z = 0.06;
  root.add(sun);
  // 태양 허브
  var sunHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, THICK + 0.24, 28), matHub);
  sunHub.rotation.x = Math.PI / 2;
  root.add(sunHub);

  // 캐리어(회전): 팔 3개 + 유성 축
  var carrier = new THREE.Group();
  root.add(carrier);
  var planets = [];
  for (var i = 0; i < NPLANET; i++) {
    var ang = i * Math.PI * 2 / NPLANET;
    var px = Math.cos(ang) * rCarrier, py = Math.sin(ang) * rCarrier;

    // 캐리어 팔(중심→유성)
    var armLen = rCarrier;
    var arm = new THREE.Mesh(new THREE.BoxGeometry(armLen, 0.14, 0.12), matArm);
    arm.position.set(px / 2, py / 2, -0.16);
    arm.rotation.z = ang;
    carrier.add(arm);

    // 유성 피벗(위치 고정, 자전은 mesh가)
    var pivot = new THREE.Group();
    pivot.position.set(px, py, 0.02);
    carrier.add(pivot);

    var planet = gearMesh(Np, m, 0.16, matSteel);
    // 초기 위상: 링과 맞물리도록 캐리어각 기반 오프셋(롤링 기준값) + 미세조정
    planet.rotation.z = -(Nr / Np) * ang + 0.12;
    pivot.add(planet);

    // 유성 축(코랄 점)
    var axle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, THICK + 0.2, 20), matHub);
    axle.rotation.x = Math.PI / 2;
    pivot.add(axle);

    planets.push(planet);
  }

  /* ── 조명 ── */
  scene.add(new THREE.AmbientLight(0x2a3040, 1.1));
  scene.add(new THREE.HemisphereLight(0x8ea0c8, 0x0a0c10, 0.7));
  var key = new THREE.DirectionalLight(0xf4f6ff, 2.1);
  key.position.set(-4, 5, 6);
  scene.add(key);
  var rim = new THREE.DirectionalLight(CORAL, 1.5);
  rim.position.set(5, -3, -4);
  scene.add(rim);
  var fill = new THREE.DirectionalLight(GLOW, 0.9);
  fill.position.set(2, -5, 3);
  scene.add(fill);
  var coreGlow = new THREE.PointLight(CORAL, 1.1, 6, 2);
  coreGlow.position.set(0, 0, 1.4);
  scene.add(coreGlow);

  /* ── 카메라 ── */
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 12.5);
  camera.lookAt(0, 0, 0);
  // 기구를 살짝 기울여 3D 깊이 노출
  root.rotation.x = -0.42;
  root.rotation.y = 0.10;
  var baseRotX = root.rotation.x, baseRotY = root.rotation.y;

  /* ── 렌더러 ── */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);

  /* 환경맵(PMREM) — 금속 반사용. 단색 환경 씬으로 저비용 생성(검게 안 나오게). */
  try {
    var pmrem = new THREE.PMREMGenerator(renderer);
    var envSrc = new THREE.Scene();
    envSrc.background = new THREE.Color(0x3a4150);
    scene.environment = pmrem.fromScene(envSrc).texture;
    pmrem.dispose();
  } catch (e) { /* 환경맵 실패해도 조명으로 렌더 */ }

  function resize() {
    var w = core.clientWidth, h = core.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* 3D 활성 → SVG 폴백 숨김 */
  document.body.classList.add('gl-on');

  /* ── 포인터 시차(감쇠) ── */
  var tgX = 0, tgY = 0, curX = 0, curY = 0;
  if (!reduce) {
    window.addEventListener('pointermove', function (e) {
      tgX = (e.clientX / window.innerWidth - 0.5);
      tgY = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }

  /* ── 스크롤 영향(속도/시점 살짝) ── */
  var scrollF = 0;
  window.addEventListener('scroll', function () {
    var st = window.pageYOffset || document.documentElement.scrollTop || 0;
    scrollF = Math.min(st / Math.max(window.innerHeight, 1), 1.2);
  }, { passive: true });

  /* ── 가시성/탭 정지 ── */
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; })
      .observe(core);
  }

  /* ── 루프 ── */
  var t0 = null, running = true, raf;
  var SPEED = 0.55;  // 전체 회전 스케일(rad/s ≈ wS·SPEED)
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) { t0 = t; return; }
    if (t0 == null) t0 = t;
    var dt = Math.min((t - t0) / 1000, 0.05); t0 = t;
    var sp = SPEED * (1 + scrollF * 0.6);

    sun.rotation.z += wS * sp * dt;
    sunHub.rotation.y += wS * sp * dt;
    carrier.rotation.z += wC * sp * dt;
    for (var i = 0; i < planets.length; i++) planets[i].rotation.z += wP_rel * sp * dt;
    telRing.rotation.z -= 0.04 * dt;

    // 포인터 시차
    curX += (tgX - curX) * 0.05;
    curY += (tgY - curY) * 0.05;
    root.rotation.y = baseRotY + curX * 0.5;
    root.rotation.x = baseRotX + curY * 0.32 - scrollF * 0.12;

    renderer.render(scene, camera);
  }

  // 항상 첫 프레임 즉시 동기 렌더 — 백그라운드 탭에서 rAF가 멈춰도 초기 화면 보장
  resize();
  renderer.render(scene, camera);

  // 디버그 핸들(검증용) — 수동 스텝/렌더
  window.__gear3d = {
    render: function () { renderer.render(scene, camera); },
    step: function (s) {
      sun.rotation.z += wS * s; carrier.rotation.z += wC * s;
      for (var i = 0; i < planets.length; i++) planets[i].rotation.z += wP_rel * s;
      telRing.rotation.z -= 0.1 * s;
      renderer.render(scene, camera);
    },
    scene: scene, camera: camera, renderer: renderer, root: root
  };

  if (!reduce) raf = requestAnimationFrame(frame);

  /* 안전: 페이지 이탈 시 정리 */
  window.addEventListener('pagehide', function () { if (raf) cancelAnimationFrame(raf); });
})();
