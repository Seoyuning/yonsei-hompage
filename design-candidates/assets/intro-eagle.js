/* ═══════════════════════════════════════════════════════════════════
   YSME — intro-eagle.js  (인트로 후보 B — A는 intro3d.js 씰 조립)
   기계 독수리(ME 로고)를 로봇 그리퍼들이 부품 단위로 물어 와 조립 →
   날갯짓 → 학부명. 어두운 배경 + 독수리 뒤 강한 후광.

   · 부품: 알파 연결 성분(+거대 성분은 관절 경계에서 해부학 분할) →
     무어 경계 추적 → RDP → ExtrudeGeometry(두께 0.13)
   · 조립: 부품마다 그리퍼(샤프트+집게 2)가 가장 가까운 화면 가장자리에서
     물고 진입 → 슬롯 앞 정렬 → 축 방향 압입 → 집게 벌리고 급속 후퇴.
     순서는 몸통 섀시 → 부위 교차(라운드로빈) — 위에서부터 쓸리지 않게
   · 날갯짓: 어깨 관절 면내 스윕+깊이 틸트, 몸통은 상승만
   · 총 ~5.2s · 클릭 스킵 · 하드킬 7s · WebGL 실패 시 2D 폴백
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
setTimeout(finish, 7000);

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
var BIG = 30000;   // 이 넓이 이상이면 해부학 분할 대상(= 거대 성분)

/* 거대 성분 픽셀의 부위 판정 — 관절·연결부를 지나는 경계 */
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
  var pieces = [];
  for (var p2 = 0; p2 < S * S; p2++) {
    if (!A[p2] || label[p2] >= 0) continue;
    var rg = region[p2], id2 = pieces.length, h2 = 0, t2 = 0;
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
    pieces.push({ id: id2, area: area2, cx: sx2 / area2, cy: sy2 / area2, top: top,
      bb: [mnx, mny, mxx, mxy], group: KEYS[rg] });
  }

  function inPiece(id3, x3, y3) {
    return x3 >= 0 && x3 < S && y3 >= 0 && y3 < S && label[y3 * S + x3] === id3;
  }
  var DIR = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  function trace(pc) {
    var sxp = pc.top[0], syp = pc.top[1];
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
        if (inPiece(pc.id, nx, ny)) {
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

  var out2 = [];
  pieces.sort(function (a, b) { return b.area - a.area; });
  for (var ci = 0; ci < pieces.length && out2.length < 40; ci++) {
    var cm2 = pieces[ci];
    if (cm2.area < 90) break;
    var contour = rdp(trace(cm2), 2.2);
    if (contour.length >= 3) out2.push({ contour: contour, cx: cm2.cx, cy: cm2.cy, bb: cm2.bb, group: cm2.group });
  }
  return out2;
}

function start(tex) {
  if (done) return;
  var pieces = extractPieces(tex.image);
  if (pieces.length < 3) { fallback(); return; }

  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  cam.position.set(0, 0, 7.5);

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

  function toWX(px) { return px / 320 - 1; }
  function toWY(py) { return 1 - py / 320; }

  tex.colorSpace = THREE.SRGBColorSpace;
  var capMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  var sideMat = new THREE.MeshBasicMaterial({ color: 0x8fa0bd });
  var armMat = new THREE.MeshBasicMaterial({ color: 0x3d4d6e });
  var padMat = new THREE.MeshBasicMaterial({ color: 0x5a6d92 });
  var DEPTH = 0.13;

  var HINGE = { body: [385, 400], wingL: [315, 292], wingR: [455, 315], tail: [300, 420], talons: [395, 472] };
  var ORDER = ['body', 'wingL', 'wingR', 'tail', 'talons'];

  var groups = {};
  ORDER.forEach(function (key) {
    var g = new THREE.Group();
    g.position.set(toWX(HINGE[key][0]), toWY(HINGE[key][1]), 0);
    root.add(g);
    groups[key] = { grp: g, items: [] };
  });

  /* 부품마다 진입 방향 = 가장 가까운 화면 가장자리(좌/우/상/하) */
  function edgeDir(cx, cy) {
    var dl = cx, dr = S - cx, dt = cy, db = S - cy;
    var m = Math.min(dl, dr, dt, db);
    if (m === dl) return new THREE.Vector3(-1, 0, 0);
    if (m === dr) return new THREE.Vector3(1, 0, 0);
    if (m === dt) return new THREE.Vector3(0, 1, 0);
    return new THREE.Vector3(0, -1, 0);
  }

  pieces.forEach(function (pc) {
    var shape = new THREE.Shape();
    shape.moveTo(toWX(pc.contour[0][0]), toWY(pc.contour[0][1]));
    for (var i = 1; i < pc.contour.length; i++) shape.lineTo(toWX(pc.contour[i][0]), toWY(pc.contour[i][1]));
    shape.closePath();
    var geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
    var pos = geo.attributes.position, uv = geo.attributes.uv;
    for (var v = 0; v < uv.count; v++) uv.setXY(v, pos.getX(v) / 2 + 0.5, pos.getY(v) / 2 + 0.5);
    uv.needsUpdate = true;

    var G = groups[pc.group];
    var hx = toWX(HINGE[pc.group][0]), hy = toWY(HINGE[pc.group][1]);
    var mesh = new THREE.Mesh(geo, [capMat, sideMat]);
    var home = new THREE.Vector3(-hx, -hy, -DEPTH / 2);
    var dir = edgeDir(pc.cx, pc.cy);
    var staging = home.clone().add(dir.clone().multiplyScalar(3.4)).add(new THREE.Vector3(0, 0, 0.55));
    var hover = home.clone().add(new THREE.Vector3(0, 0, 0.55));
    mesh.position.copy(staging);
    G.grp.add(mesh);

    /* ── 그리퍼: 샤프트(가장자리로 뻗는 팔) + 부품을 무는 집게 패드 2 ──
       부품과 같은 그룹에 넣고 매 프레임 부품 위치를 따라간다 */
    var cAbs = new THREE.Vector3(toWX(pc.cx), toWY(pc.cy), DEPTH / 2 + 0.02);
    var perp = dir.x !== 0 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    var half = dir.x !== 0
      ? (pc.bb[3] - pc.bb[1]) / 2 / 320   // 좌우 진입 → 상하로 문다
      : (pc.bb[2] - pc.bb[0]) / 2 / 320;  // 상하 진입 → 좌우로 문다
    half = Math.min(half, 0.55) + 0.07;

    var grip = new THREE.Group();
    var shaft = new THREE.Mesh(
      dir.x !== 0 ? new THREE.BoxGeometry(3.6, 0.05, 0.05) : new THREE.BoxGeometry(0.05, 3.6, 0.05),
      armMat
    );
    shaft.position.copy(cAbs).add(dir.clone().multiplyScalar(1.9));
    grip.add(shaft);
    var pads = [];
    [1, -1].forEach(function (sgn) {
      var pad = new THREE.Mesh(
        dir.x !== 0 ? new THREE.BoxGeometry(0.24, 0.06, 0.2) : new THREE.BoxGeometry(0.06, 0.24, 0.2),
        padMat
      );
      pad.position.copy(cAbs).add(perp.clone().multiplyScalar(sgn * half));
      grip.add(pad);
      pads.push({ mesh: pad, base: pad.position.clone(), sgn: sgn });
    });
    grip.position.copy(staging).sub(home);   // 부품과 함께 스테이징에서 시작
    G.grp.add(grip);

    G.items.push({
      mesh: mesh, grip: grip, pads: pads, perp: perp, dir: dir,
      staging: staging, hover: hover, home: home
    });
  });

  /* 체결 순서: 몸통 섀시(최대 부품) 먼저 → 이후 부위 교차 라운드로빈.
     위→아래로 쓸리지 않고 여러 로봇이 분담하는 그림이 된다 */
  var seq = [];
  var chassis = groups.body.items[0];
  if (chassis) seq.push(chassis);
  var RR = ['wingR', 'tail', 'wingL', 'talons', 'body'];
  var ptr = { body: chassis ? 1 : 0, wingL: 0, wingR: 0, tail: 0, talons: 0 };
  var remain = true;
  while (remain) {
    remain = false;
    RR.forEach(function (key) {
      var it = groups[key].items[ptr[key]];
      if (it) { seq.push(it); ptr[key]++; remain = true; }
    });
  }
  seq.forEach(function (it, i) { it.st = i * 130; it.dur = 1000; });

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function snap(t) { var c = 0.9; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIn(t) { return t * t * t; }
  function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var T0 = performance.now();
  var textOn = false, endAt = 4700;

  function frame(now) {
    if (done) return;
    var t = now - T0;

    seq.forEach(function (it) {
      var e = clamp01((t - it.st) / it.dur);
      var pp;
      if (e < 0.4) {                       // 운반: 그리퍼가 물고 진입
        pp = new THREE.Vector3().lerpVectors(it.staging, it.hover, easeIO(e / 0.4));
      } else if (e < 0.5) {                // 정렬: 슬롯 앞 정지
        pp = it.hover.clone();
      } else if (e < 0.62) {               // 압입: 축 방향 스냅
        pp = new THREE.Vector3().lerpVectors(it.hover, it.home, snap((e - 0.5) / 0.12));
      } else {
        pp = it.home.clone();
      }
      it.mesh.position.copy(pp);

      /* 그리퍼: 압입까지 동행 → 집게 벌림 → 급속 후퇴 → 숨김 */
      if (e >= 1) { it.grip.visible = false; }
      else {
        var open = e < 0.62 ? 0 : Math.min(1, (e - 0.62) / 0.1) * 0.16;
        it.pads.forEach(function (pd) {
          pd.mesh.position.copy(pd.base).add(it.perp.clone().multiplyScalar(pd.sgn * open));
        });
        var back = e < 0.72 ? 0 : easeIn((e - 0.72) / 0.28) * 4.5;
        it.grip.position.copy(pp).sub(it.home).add(it.dir.clone().multiplyScalar(back));
      }
    });

    var whole = easeOut(clamp01(t / 2700));
    root.rotation.y = -0.5 * (1 - whole);
    root.rotation.x = -0.13 * (1 - whole);
    cam.position.z = 7.5 - 1.6 * whole;

    /* 날갯짓: 어깨 관절 면내 스윕 + 깊이 틸트, 몸통은 상승만 */
    var f = clamp01((t - 2900) / 1500);
    if (f > 0) {
      var amp = Math.sin(Math.PI * f);
      var phi = Math.sin(f * Math.PI * 4) * amp;
      groups.wingL.grp.rotation.z = 0.34 * phi;
      groups.wingR.grp.rotation.z = -0.34 * phi;
      groups.wingL.grp.rotation.x = 0.42 * phi;
      groups.wingR.grp.rotation.x = 0.42 * phi;
      groups.wingL.grp.rotation.y = 0.16 * phi;
      groups.wingR.grp.rotation.y = -0.16 * phi;
      groups.tail.grp.rotation.x = -0.18 * phi;
    }
    var rise = easeIO(clamp01((t - 3000) / 1200));
    root.position.y = 0.35 + 0.26 * rise;
    var s = 1 + 0.05 * rise;
    root.scale.set(s, s, s);

    /* 후광: 어두운 배경 위에서 강하게 — 체결마다 맥동, 완성 순간 플레어 */
    if (halo) {
      var pulse = 0;
      seq.forEach(function (it) {
        var dt = t - (it.st + it.dur * 0.62);   // 압입 완료 시점 기준
        if (dt > 0 && dt < 520) pulse += Math.exp(-dt / 150);
      });
      var flare = f > 0 ? Math.sin(Math.PI * clamp01(f * 1.6)) : 0;
      var op = 0.55 + Math.min(0.35, pulse * 0.26) + 0.4 * flare;
      var sc = 1 + 0.06 * Math.min(1.4, pulse) + 0.14 * flare;
      halo.style.opacity = Math.min(1, op).toFixed(3);
      halo.style.transform = 'translate(-50%,-50%) scale(' + sc.toFixed(3) + ')';
    }

    if (!textOn && t > 3400) { textOn = true; box.classList.add('is-on'); }
    if (t > endAt) { renderer.render(scene, cam); finish(); return; }

    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  renderer.render(scene, cam);       // 첫 프레임 동기 렌더(빈 화면 방지)
  raf = requestAnimationFrame(frame);
}

})();
