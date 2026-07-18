/* ═══════════════════════════════════════════════════════════════════
   YSME — intro-eagle.js  (인트로 후보 B — A는 intro3d.js 씰 조립)
   다관절 IK 로봇팔들이 기계 독수리를 부품 단위로 조립 → 점등·금빛 완성 →
   날갯짓 → 학부명. 어두운 배경 + 강한 후광.

   · 부품: 알파 연결 성분(+거대 성분은 관절 경계에서 해부학 분할).
     작은 성분은 부위별 병합, 총 11개 이하 — 팔이 동시에 ~3대만 움직인다
   · 리빌: 조립 중 부품은 어두운 강판 색 — 전 부품 체결 후 점등(흰색)되고
     곧장 샴페인 골드로 물들며 골드 플레어 → 완성 전에는 위엄을 숨긴다
   · 로봇팔: 화면 앞쪽 깊이에 고정된 베이스에서 비스듬히 뻗는 2링크 IK,
     테이퍼 실린더 링크·구형 관절·클로 핸드, 조명+금속 재질(스탠다드)
   · 마무리: 날갯짓 2회 + 상승 + 날개 살짝 편 정지 포즈
   · 클릭 스킵 · 하드킬 8s · WebGL 실패 시 2D 폴백
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
setTimeout(finish, 8000);

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

new THREE.TextureLoader().load('assets/me-eagle.png', function (tex) {
  try { start(tex); } catch (e) { fallback(); }
}, undefined, fallback);

var S = 640;
var BIG = 30000;     // 이 넓이 이상이면 해부학 분할 대상(= 거대 성분)
var SOLO = 3200;     // 이 넓이 이상이면 단독 부품, 미만은 부위별 병합

function anatomyOf(x, y) {
  if ((x < 400 && y < 288) || (x < 240 && y < 330)) return 'wingL';
  if (x < 315 && y >= 395) return 'tail';
  if (x >= 310 && x < 540 && y >= 470) return 'talons';
  return 'body';
}
function groupOfCentroid(cx, cy) {
  if (cx >= 440 && cy < 340) return 'wingR';
  if (cx < 400 && cy < 300) return 'wingL';
  if (cx < 315 && cy >= 395) return 'tail';
  if (cx >= 310 && cy >= 470) return 'talons';
  return 'body';
}

function extractPieces(img) {
  var c = document.createElement('canvas'); c.width = c.height = S;
  var x = c.getContext('2d');
  x.drawImage(img, 0, 0, S, S);
  var dd = x.getImageData(0, 0, S, S).data;

  var KEYS = ['body', 'wingL', 'wingR', 'tail', 'talons'];
  var region = new Int8Array(S * S); region.fill(-1);
  var A = new Uint8Array(S * S);
  for (var i = 0; i < S * S; i++) A[i] = dd[i * 4 + 3] > 40 ? 1 : 0;

  var label = new Int32Array(S * S); label.fill(-1);
  var q = new Int32Array(S * S), comps = [];
  for (var p = 0; p < S * S; p++) {
    if (!A[p] || label[p] >= 0) continue;
    var id = comps.length, h = 0, tq = 0;
    q[tq++] = p; label[p] = id;
    var area = 0, sx = 0, sy = 0, px0 = [];
    while (h < tq) {
      var cp = q[h++], cx = cp % S, cy = (cp / S) | 0;
      area++; sx += cx; sy += cy; px0.push(cp);
      if (cx > 0 && A[cp - 1] && label[cp - 1] < 0) { label[cp - 1] = id; q[tq++] = cp - 1; }
      if (cx < S - 1 && A[cp + 1] && label[cp + 1] < 0) { label[cp + 1] = id; q[tq++] = cp + 1; }
      if (cp - S >= 0 && A[cp - S] && label[cp - S] < 0) { label[cp - S] = id; q[tq++] = cp - S; }
      if (cp + S < S * S && A[cp + S] && label[cp + S] < 0) { label[cp + S] = id; q[tq++] = cp + S; }
    }
    comps.push({ area: area, cx: sx / area, cy: sy / area, px: px0 });
  }
  comps.forEach(function (cm) {
    var g;
    if (cm.area >= BIG) {
      cm.px.forEach(function (cp) {
        region[cp] = KEYS.indexOf(anatomyOf(cp % S, (cp / S) | 0));
      });
    } else {
      g = KEYS.indexOf(groupOfCentroid(cm.cx, cm.cy));
      cm.px.forEach(function (cp) { region[cp] = g; });
    }
  });

  label.fill(-1);
  var units = [];
  for (var p2 = 0; p2 < S * S; p2++) {
    if (!A[p2] || label[p2] >= 0) continue;
    var rg = region[p2], id2 = units.length, h2 = 0, t2 = 0;
    q[t2++] = p2; label[p2] = id2;
    var area2 = 0, sx2 = 0, sy2 = 0, top = [p2 % S, (p2 / S) | 0];
    var mnx = S, mxx = 0, mny = S, mxy = 0;
    while (h2 < t2) {
      var cp2 = q[h2++], cx2 = cp2 % S, cy2 = (cp2 / S) | 0;
      area2++; sx2 += cx2; sy2 += cy2;
      if (cx2 < mnx) mnx = cx2; if (cx2 > mxx) mxx = cx2;
      if (cy2 < mny) mny = cy2; if (cy2 > mxy) mxy = cy2;
      if (cy2 < top[1] || (cy2 === top[1] && cx2 < top[0])) top = [cx2, cy2];
      var nb = [cp2 - 1, cp2 + 1, cp2 - S, cp2 + S];
      for (var k = 0; k < 4; k++) {
        var np = nb[k];
        if (np < 0 || np >= S * S) continue;
        if (k === 0 && cx2 === 0) continue;
        if (k === 1 && cx2 === S - 1) continue;
        if (A[np] && region[np] === rg && label[np] < 0) { label[np] = id2; q[t2++] = np; }
      }
    }
    units.push({ id: id2, area: area2, cx: sx2 / area2, cy: sy2 / area2, top: top,
      bb: [mnx, mny, mxx, mxy], group: KEYS[rg] });
  }

  function inUnit(id3, x3, y3) {
    return x3 >= 0 && x3 < S && y3 >= 0 && y3 < S && label[y3 * S + x3] === id3;
  }
  var DIR = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  function trace(u) {
    var sxp = u.top[0], syp = u.top[1];
    var pts = [[sxp, syp]];
    var cur = [sxp, syp], prev = [sxp - 1, syp], steps = 0;
    while (steps++ < 24000) {
      var pi = 0;
      for (var k = 0; k < 8; k++) {
        if (cur[0] + DIR[k][0] === prev[0] && cur[1] + DIR[k][1] === prev[1]) { pi = k; break; }
      }
      var moved = false;
      for (var m = 1; m <= 8; m++) {
        var d = DIR[(pi + m) % 8];
        var nx = cur[0] + d[0], ny = cur[1] + d[1];
        if (inUnit(u.id, nx, ny)) {
          var pd = DIR[(pi + m - 1) % 8];
          prev = [cur[0] + pd[0], cur[1] + pd[1]];
          cur = [nx, ny];
          moved = true;
          break;
        }
      }
      if (!moved) break;
      if (cur[0] === sxp && cur[1] === syp) break;
      pts.push([cur[0], cur[1]]);
    }
    return pts;
  }
  function rdp(pts, eps) {
    if (pts.length < 4) return pts;
    var keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
    var stack = [[0, pts.length - 1]];
    while (stack.length) {
      var seg = stack.pop(), a = seg[0], b = seg[1];
      var ax = pts[a][0], ay = pts[a][1], bx = pts[b][0], by = pts[b][1];
      var dx = bx - ax, dy = by - ay, len = Math.sqrt(dx * dx + dy * dy) || 1;
      var maxd = 0, mi = -1;
      for (var i2 = a + 1; i2 < b; i2++) {
        var dist = Math.abs(dy * pts[i2][0] - dx * pts[i2][1] + bx * ay - by * ax) / len;
        if (dist > maxd) { maxd = dist; mi = i2; }
      }
      if (maxd > eps && mi > 0) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
    }
    var out = [];
    for (var j = 0; j < pts.length; j++) if (keep[j]) out.push(pts[j]);
    return out;
  }

  /* 큰 성분은 단독 부품, 작은 성분들은 부위별로 병합해 한 부품으로 */
  var solos = [], merged = {};
  units.forEach(function (u) {
    if (u.area < 90) return;
    var contour = rdp(trace(u), 2.2);
    if (contour.length < 3) return;
    if (u.area >= SOLO) {
      solos.push({ contours: [contour], cx: u.cx, cy: u.cy, bb: u.bb.slice(), area: u.area, group: u.group });
    } else {
      var m = merged[u.group];
      if (!m) {
        m = merged[u.group] = { contours: [], cx: 0, cy: 0, bb: [S, S, 0, 0], area: 0, group: u.group };
      }
      m.contours.push(contour);
      m.cx += u.cx * u.area; m.cy += u.cy * u.area; m.area += u.area;
      m.bb[0] = Math.min(m.bb[0], u.bb[0]); m.bb[1] = Math.min(m.bb[1], u.bb[1]);
      m.bb[2] = Math.max(m.bb[2], u.bb[2]); m.bb[3] = Math.max(m.bb[3], u.bb[3]);
    }
  });
  Object.keys(merged).forEach(function (k) {
    var m = merged[k];
    m.cx /= m.area; m.cy /= m.area;
    solos.push(m);
  });
  solos.sort(function (a, b) { return b.area - a.area; });
  return solos.slice(0, 11);
}

function start(tex) {
  if (done) return;
  var pieces = extractPieces(tex.image);
  if (pieces.length < 3) { fallback(); return; }

  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  cam.position.set(0, 0, 7.5);

  /* 조명 — 로봇팔·부품 옆면 금속 셰이딩용(독수리 도장면은 Basic) */
  scene.add(new THREE.AmbientLight(0xbfd0e8, 0.85));
  var keyL = new THREE.DirectionalLight(0xffffff, 1.6);
  keyL.position.set(2.5, 3.5, 5);
  scene.add(keyL);
  var rimL = new THREE.DirectionalLight(0x7fa8ff, 0.7);
  rimL.position.set(-3, -1, 2);
  scene.add(rimL);

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
  var halo = box.querySelector('.intro-halo');
  var halo2 = box.querySelector('.intro-halo2');

  function toWX(px) { return px / 320 - 1; }
  function toWY(py) { return 1 - py / 320; }

  tex.colorSpace = THREE.SRGBColorSpace;
  /* 조립 중 어두운 강판 → 완성 때 점등(흰)·금빛. 색은 프레임에서 구동 */
  var DARKC = new THREE.Color(0.42, 0.47, 0.58);
  var WHITE = new THREE.Color(1, 1, 1);
  var GOLD = new THREE.Color(1.0, 0.85, 0.58);
  var capMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  capMat.color.copy(DARKC);
  var sideMat = new THREE.MeshStandardMaterial({ color: 0x6b7a96, metalness: 0.55, roughness: 0.45 });
  var armMat = new THREE.MeshStandardMaterial({ color: 0x2c3a58, metalness: 0.7, roughness: 0.38 });
  var jointMat = new THREE.MeshStandardMaterial({ color: 0x8fa0bd, metalness: 0.8, roughness: 0.3 });
  var darkMat = new THREE.MeshStandardMaterial({ color: 0x161f31, metalness: 0.5, roughness: 0.6 });
  var warnMat = new THREE.MeshStandardMaterial({ color: 0xe2593c, metalness: 0.4, roughness: 0.5 });
  var DEPTH = 0.13;

  var HINGE = { body: [385, 400], wingL: [315, 292], wingR: [455, 315], tail: [300, 420], talons: [395, 472] };
  var ORDER = ['body', 'wingL', 'wingR', 'tail', 'talons'];

  var groups = {};
  ORDER.forEach(function (key2) {
    var g = new THREE.Group();
    g.position.set(toWX(HINGE[key2][0]), toWY(HINGE[key2][1]), 0);
    root.add(g);
    groups[key2] = { grp: g, items: [] };
  });

  function edgeDir(cx, cy) {
    var dl = cx, dr = S - cx, dt = cy, db = S - cy;
    var m = Math.min(dl, dr, dt, db);
    if (m === dl) return new THREE.Vector3(-1, 0, 0);
    if (m === dr) return new THREE.Vector3(1, 0, 0);
    if (m === dt) return new THREE.Vector3(0, 1, 0);
    return new THREE.Vector3(0, -1, 0);
  }

  var X_AXIS = new THREE.Vector3(1, 0, 0);

  pieces.forEach(function (pc) {
    var shapes = pc.contours.map(function (contour) {
      var shape = new THREE.Shape();
      shape.moveTo(toWX(contour[0][0]), toWY(contour[0][1]));
      for (var i = 1; i < contour.length; i++) shape.lineTo(toWX(contour[i][0]), toWY(contour[i][1]));
      shape.closePath();
      return shape;
    });
    var geo = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: false });
    var pos = geo.attributes.position, uv = geo.attributes.uv;
    for (var v = 0; v < uv.count; v++) uv.setXY(v, pos.getX(v) / 2 + 0.5, pos.getY(v) / 2 + 0.5);
    uv.needsUpdate = true;

    var G = groups[pc.group];
    var hx = toWX(HINGE[pc.group][0]), hy = toWY(HINGE[pc.group][1]);
    var mesh = new THREE.Mesh(geo, [capMat, sideMat]);
    var home = new THREE.Vector3(-hx, -hy, -DEPTH / 2);
    var dir = edgeDir(pc.cx, pc.cy);
    var staging = home.clone().add(dir.clone().multiplyScalar(3.4)).add(new THREE.Vector3(0, 0, 0.5));
    var hover = home.clone().add(new THREE.Vector3(0, 0, 0.5));
    mesh.position.copy(staging);
    G.grp.add(mesh);

    /* ── 로봇팔: 화면 앞쪽 깊이의 베이스에서 비스듬히 뻗는 2링크 IK ── */
    var cAbs = new THREE.Vector3(toWX(pc.cx), toWY(pc.cy), DEPTH / 2 + 0.04);
    var perp = dir.x !== 0 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    var halfA = Math.min((dir.x !== 0 ? (pc.bb[2] - pc.bb[0]) : (pc.bb[3] - pc.bb[1])) / 2 / 320, 0.6);
    var halfP = Math.min((dir.x !== 0 ? (pc.bb[3] - pc.bb[1]) : (pc.bb[2] - pc.bb[0])) / 2 / 320, 0.55);
    var L1 = 1.9, L2 = 1.75;
    var Bfix = cAbs.clone().add(home).add(dir.clone().multiplyScalar(3.15));
    Bfix.z = 0.55;                                // 베이스가 화면 앞쪽 — 팔이 깊이로 뻗는다
    var bend = (G.items.length % 2 ? 1 : -1);

    var grip = new THREE.Group();
    function linkArm(rA, rB) {                    // +X 단위 길이 테이퍼 실린더 링크
      var g2 = new THREE.Group();
      var geo2 = new THREE.CylinderGeometry(rA, rB, 1, 14);
      geo2.rotateZ(-Math.PI / 2); geo2.translate(0.5, 0, 0);
      g2.add(new THREE.Mesh(geo2, armMat));
      var cnd = new THREE.CylinderGeometry(0.016, 0.016, 0.82, 8);
      cnd.rotateZ(-Math.PI / 2); cnd.translate(0.5, 0, 0);
      var cm = new THREE.Mesh(cnd, darkMat);
      cm.position.set(0, rB * 0.95, 0.02);
      g2.add(cm);
      return g2;
    }
    var mount = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.24), armMat);
    mount.position.copy(Bfix).add(dir.clone().multiplyScalar(0.24));
    grip.add(mount);
    var shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), jointMat);
    shoulder.position.copy(Bfix); grip.add(shoulder);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 10, 24), warnMat);
    ring.position.copy(Bfix); grip.add(ring);
    var upper = linkArm(0.055, 0.075); grip.add(upper);
    var fore = linkArm(0.038, 0.052); grip.add(fore);
    var elbow = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), jointMat); grip.add(elbow);
    var wrist = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 10), jointMat); grip.add(wrist);
    /* 클로 핸드 — 정준(+X = 부품 방향) 후 진입 방향으로 회전 */
    var hand = new THREE.Group();
    var palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.24, 0.15), armMat);
    palm.position.x = 0.02; hand.add(palm);
    var fingers = [];
    var lenP = Math.min(halfP * 0.8 + 0.24, 0.68), lenD = Math.min(halfP * 0.5 + 0.18, 0.48);
    [1, -1].forEach(function (sgn) {
      var fing = new THREE.Group();
      fing.position.set(0.06, sgn * 0.11, 0);
      var prox = new THREE.Mesh(new THREE.BoxGeometry(lenP, 0.042, 0.1), armMat);
      prox.position.x = lenP / 2; fing.add(prox);
      var dist = new THREE.Group();
      dist.position.x = lenP; dist.rotation.z = -sgn * 0.95;
      var dm = new THREE.Mesh(new THREE.BoxGeometry(lenD, 0.038, 0.085), jointMat);
      dm.position.x = lenD / 2; dist.add(dm);
      fing.add(dist);
      fing.rotation.z = sgn * 0.52;
      hand.add(fing);
      fingers.push({ grp: fing, sgn: sgn, base: sgn * 0.52 });
    });
    hand.rotation.z = Math.atan2(-dir.y, -dir.x);
    grip.add(hand);
    G.grp.add(grip);

    G.items.push({
      mesh: mesh, grip: grip, dir: dir, perp: perp, cAbs: cAbs,
      Bfix: Bfix, L1: L1, L2: L2, bend: bend,
      upper: upper, fore: fore, elbow: elbow, wrist: wrist,
      hand: hand, fingers: fingers, halfA: halfA,
      staging: staging, hover: hover, home: home
    });
  });

  /* 체결 순서: 몸통 섀시 먼저 → 부위 교차 라운드로빈. 동시 운반 ~3대 */
  var seq = [];
  var chassis = groups.body.items[0];
  if (chassis) seq.push(chassis);
  var RR = ['wingR', 'tail', 'wingL', 'talons', 'body'];
  var ptr = { body: chassis ? 1 : 0, wingL: 0, wingR: 0, tail: 0, talons: 0 };
  var remain = true;
  while (remain) {
    remain = false;
    RR.forEach(function (key2) {
      var it = groups[key2].items[ptr[key2]];
      if (it) { seq.push(it); ptr[key2]++; remain = true; }
    });
  }
  seq.forEach(function (it, i) { it.st = i * 250; it.dur = 820; });
  var asmEnd = (seq.length - 1) * 250 + 820;

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function snap(t) { var c = 0.9; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIn(t) { return t * t * t; }
  function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var T0 = performance.now();
  var F0 = asmEnd + 250;                 // 완성(점등·금빛·날갯짓) 시점
  var textOn = false, endAt = F0 + 1900;

  function frame(now) {
    if (done) return;
    var t = now - T0;

    seq.forEach(function (it) {
      var e = clamp01((t - it.st) / it.dur);
      var pp;
      if (e < 0.4) {
        pp = new THREE.Vector3().lerpVectors(it.staging, it.hover, easeIO(e / 0.4));
      } else if (e < 0.5) {
        pp = it.hover.clone();
      } else if (e < 0.62) {
        pp = new THREE.Vector3().lerpVectors(it.hover, it.home, snap((e - 0.5) / 0.12));
      } else {
        pp = it.home.clone();
      }
      it.mesh.position.copy(pp);

      /* 로봇팔: IK 추적 → 손가락 벌림 → 팔 접힘 후퇴 → 숨김 */
      if (e >= 1) { it.grip.visible = false; }
      else {
        var open2 = e < 0.62 ? 0 : Math.min(1, (e - 0.62) / 0.1);
        it.fingers.forEach(function (fg) {
          fg.grp.rotation.z = fg.base + fg.sgn * open2 * 0.45;
        });
        var back = e < 0.7 ? 0 : easeIn((e - 0.7) / 0.3);
        var pcNow = it.cAbs.clone().add(pp);
        var T = pcNow.add(it.dir.clone().multiplyScalar(it.halfA + 0.24 + back * 2.6));
        var BT = T.clone().sub(it.Bfix);
        var d = BT.length();
        d = Math.max(Math.abs(it.L1 - it.L2) + 0.1, Math.min(it.L1 + it.L2 - 0.06, d));
        var ah = BT.normalize();
        var Tc = it.Bfix.clone().add(ah.clone().multiplyScalar(d));
        var nh = new THREE.Vector3(-ah.y * it.bend, ah.x * it.bend, 0);
        if (nh.lengthSq() < 0.001) nh.set(it.bend, 0, 0);
        nh.normalize();
        var a1 = (it.L1 * it.L1 - it.L2 * it.L2 + d * d) / (2 * d);
        var hh = Math.sqrt(Math.max(0.01, it.L1 * it.L1 - a1 * a1));
        var E = it.Bfix.clone().add(ah.clone().multiplyScalar(a1)).add(nh.clone().multiplyScalar(hh));
        E.z += 0.16;                               // 팔꿈치가 카메라 쪽으로 아치
        var place = function (link, from, to) {
          var vv = to.clone().sub(from), len = vv.length() || 0.001;
          link.position.copy(from);
          link.quaternion.setFromUnitVectors(X_AXIS, vv.multiplyScalar(1 / len));
          link.scale.x = len;
        };
        place(it.upper, it.Bfix, E);
        place(it.fore, E, Tc);
        it.elbow.position.copy(E);
        it.wrist.position.copy(Tc);
        it.hand.position.copy(Tc);
      }
    });

    var whole = easeOut(clamp01(t / (asmEnd + 200)));
    root.rotation.y = -0.5 * (1 - whole);
    root.rotation.x = -0.13 * (1 - whole);
    cam.position.z = 7.5 - 1.6 * whole;

    /* 완성 리빌: 어두운 강판 → 점등(흰) → 샴페인 골드 */
    var goldT = easeIO(clamp01((t - F0) / 650));
    if (goldT < 0.45) capMat.color.copy(DARKC).lerp(WHITE, goldT / 0.45);
    else capMat.color.copy(WHITE).lerp(GOLD, (goldT - 0.45) / 0.55 * 0.8);

    var f = clamp01((t - F0) / 1500);
    if (f > 0) {
      var amp = Math.sin(Math.PI * Math.min(f, 0.999));
      var phi = Math.sin(f * Math.PI * 4) * amp;
      groups.wingL.grp.rotation.z = 0.34 * phi;
      groups.wingR.grp.rotation.z = -0.34 * phi;
      groups.wingL.grp.rotation.x = 0.42 * phi;
      groups.wingR.grp.rotation.x = 0.42 * phi;
      groups.tail.grp.rotation.x = -0.18 * phi;
    }
    var pose = easeIO(clamp01((t - (F0 + 1450)) / 380));   // 날개 살짝 편 정지 포즈
    if (pose > 0) {
      groups.wingL.grp.rotation.z = 0.1 * pose;
      groups.wingR.grp.rotation.z = -0.1 * pose;
      groups.wingL.grp.rotation.x = -0.08 * pose;
      groups.wingR.grp.rotation.x = -0.08 * pose;
    }
    var rise = easeIO(clamp01((t - (F0 + 100)) / 1200));
    root.position.y = 0.35 + 0.26 * rise;
    var s2 = 1 + 0.06 * rise;
    root.scale.set(s2, s2, s2);

    /* 후광: 체결 맥동(블루) + 완성 플레어(골드 레이어 크로스페이드) */
    var flare = f > 0 ? Math.sin(Math.PI * clamp01(f * 1.4)) : 0;
    if (halo) {
      var pulse = 0;
      seq.forEach(function (it) {
        var dt = t - (it.st + it.dur * 0.62);
        if (dt > 0 && dt < 520) pulse += Math.exp(-dt / 150);
      });
      var op = 0.5 + Math.min(0.32, pulse * 0.26) + 0.2 * flare;
      var sc = 1 + 0.06 * Math.min(1.4, pulse) + 0.12 * flare;
      halo.style.opacity = Math.min(1, op).toFixed(3);
      halo.style.transform = 'translate(-50%,-50%) scale(' + sc.toFixed(3) + ')';
    }
    if (halo2) {
      halo2.style.opacity = (0.9 * flare + 0.35 * goldT * (1 - flare)).toFixed(3);
      halo2.style.transform = 'translate(-50%,-50%) scale(' + (1 + 0.16 * flare).toFixed(3) + ')';
    }

    if (!textOn && t > F0 + 450) { textOn = true; box.classList.add('is-on'); }
    if (t > endAt) { renderer.render(scene, cam); finish(); return; }

    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  renderer.render(scene, cam);       // 첫 프레임 동기 렌더(빈 화면 방지)
  raf = requestAnimationFrame(frame);
}

})();
