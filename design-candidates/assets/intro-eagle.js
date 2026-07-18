/* ═══════════════════════════════════════════════════════════════════
   YSME — intro-eagle.js  (인트로 후보 B — A는 intro3d.js 씰 조립)
   기계 독수리(ME 로고)의 흰 부품들을 런타임에 윤곽 추적해
   두께가 있는 3D 부품으로 압출하고, 하나하나 체결 → 날갯짓 → 학부명.
   · 부품 추출: 알파 연결 성분 → 무어 경계 추적 → RDP 단순화 → ExtrudeGeometry
   · 앞면은 원화 텍스처, 옆면은 금속 톤 — 회전 시 판 두께가 보인다
   · 총 ~3.6s(부품 조립을 온전히 보여주기 위해 3s 초과) · 클릭 스킵 · 하드킬 5.2s
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
setTimeout(finish, 5200);

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

/* ── 이미지에서 부품(흰 연결 성분) 추출 ── */
function extractPieces(img) {
  var c = document.createElement('canvas'); c.width = c.height = S;
  var x = c.getContext('2d');
  x.drawImage(img, 0, 0, S, S);
  var dd = x.getImageData(0, 0, S, S).data;
  var A = new Uint8Array(S * S);
  for (var i = 0; i < S * S; i++) A[i] = dd[i * 4 + 3] > 40 ? 1 : 0;

  /* 연결 성분 라벨링(BFS) */
  var label = new Int32Array(S * S); label.fill(-1);
  var comps = [], q = new Int32Array(S * S);
  for (var p = 0; p < S * S; p++) {
    if (!A[p] || label[p] >= 0) continue;
    var id = comps.length, head = 0, tailq = 0;
    q[tailq++] = p; label[p] = id;
    var area = 0, sx = 0, sy = 0, top = [p % S, (p / S) | 0];
    while (head < tailq) {
      var cp = q[head++], cx = cp % S, cy = (cp / S) | 0;
      area++; sx += cx; sy += cy;
      if (cy < top[1] || (cy === top[1] && cx < top[0])) top = [cx, cy];
      var nb = [cp - 1, cp + 1, cp - S, cp + S];
      for (var k = 0; k < 4; k++) {
        var np = nb[k];
        if (np < 0 || np >= S * S) continue;
        if (k === 0 && cx === 0) continue;
        if (k === 1 && cx === S - 1) continue;
        if (A[np] && label[np] < 0) { label[np] = id; q[tailq++] = np; }
      }
    }
    comps.push({ id: id, area: area, cx: sx / area, cy: sy / area, top: top });
  }

  function inComp(id, x_, y_) {
    return x_ >= 0 && x_ < S && y_ >= 0 && y_ < S && label[y_ * S + x_] === id;
  }
  /* 무어 이웃 경계 추적 */
  var DIR = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  function trace(comp) {
    var sxp = comp.top[0], syp = comp.top[1];
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
        if (inComp(comp.id, nx, ny)) {
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
  /* RDP 단순화 */
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

  var pieces = [];
  comps.sort(function (a, b) { return b.area - a.area; });
  for (var ci = 0; ci < comps.length && pieces.length < 36; ci++) {
    var cm = comps[ci];
    if (cm.area < 90) break;
    var contour = rdp(trace(cm), 2.2);
    if (contour.length >= 3) pieces.push({ contour: contour, cx: cm.cx, cy: cm.cy, area: cm.area });
  }
  return pieces;
}

function start(tex) {
  if (done) return;
  var pieces = extractPieces(tex.image);
  if (pieces.length < 3) { fallback(); return; }

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

  function toWX(px) { return px / 320 - 1; }
  function toWY(py) { return 1 - py / 320; }

  tex.colorSpace = THREE.SRGBColorSpace;
  var capMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  var sideMat = new THREE.MeshBasicMaterial({ color: 0xb7c2d8 });
  var DEPTH = 0.07;

  /* 해부학 그룹(체결 순서·힌지·날갯짓 단위) — 부품 자체는 그림 원형 그대로 */
  var HINGE = { body: [385, 400], wingL: [330, 330], wingR: [430, 290], tail: [330, 400], talons: [400, 480] };
  var ORDER = ['body', 'wingL', 'wingR', 'tail', 'talons'];
  function groupOf(cx, cy) {
    if (cy < 345 && cx < 395) return 'wingL';
    if (cy < 270 && cx >= 395) return 'wingR';
    if (cy >= 345 && cx < 330) return 'tail';
    if (cy >= 480 && cx >= 330) return 'talons';
    return 'body';
  }

  var groups = {};
  ORDER.forEach(function (key) {
    var g = new THREE.Group();
    g.position.set(toWX(HINGE[key][0]), toWY(HINGE[key][1]), 0);
    root.add(g);
    groups[key] = { grp: g, items: [] };
  });

  pieces.forEach(function (pc, idx) {
    var shape = new THREE.Shape();
    shape.moveTo(toWX(pc.contour[0][0]), toWY(pc.contour[0][1]));
    for (var i = 1; i < pc.contour.length; i++) shape.lineTo(toWX(pc.contour[i][0]), toWY(pc.contour[i][1]));
    shape.closePath();
    var geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
    /* 앞뒤 캡 UV를 씰 전체 이미지 좌표로 매핑(옆면은 sideMat) */
    var pos = geo.attributes.position, uv = geo.attributes.uv;
    for (var v = 0; v < uv.count; v++) uv.setXY(v, pos.getX(v) / 2 + 0.5, pos.getY(v) / 2 + 0.5);
    uv.needsUpdate = true;

    var key = groupOf(pc.cx, pc.cy);
    var G = groups[key];
    var hx = toWX(HINGE[key][0]), hy = toWY(HINGE[key][1]);
    var mesh = new THREE.Mesh(geo, [capMat, sideMat]);
    var home = new THREE.Vector3(-hx, -hy, -DEPTH / 2);
    /* 진입 위치: 독수리 중심에서 바깥 방향 + 깊이·지연은 인덱스 기반(결정적) */
    var dx = pc.cx - 320, dy = pc.cy - 318, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var reach = 1.7 + (idx % 3) * 0.4;
    var from = home.clone().add(new THREE.Vector3(dx / L * reach, -dy / L * reach, 0.25 + (idx % 4) * 0.12));
    mesh.position.copy(from);
    mesh.rotation.z = (idx % 2 ? 0.28 : -0.28);
    G.grp.add(mesh);
    G.items.push({ mesh: mesh, from: from, home: home, rotZ: mesh.rotation.z });
  });

  /* 그룹 내 큰 부품(섀시)부터 체결 */
  ORDER.forEach(function (key, ord) {
    groups[key].items.forEach(function (it, j) {
      it.st = ord * 230 + j * 38;
      it.dur = 560;
    });
  });

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function snap(t) { var c = 0.9; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var T0 = performance.now();
  var textOn = false, endAt = 3150;

  function frame(now) {
    if (done) return;
    var t = now - T0;

    ORDER.forEach(function (key) {
      groups[key].items.forEach(function (it) {
        var e = snap(clamp01((t - it.st) / it.dur));
        it.mesh.position.lerpVectors(it.from, it.home, e);
        it.mesh.rotation.z = it.rotZ * (1 - e);
      });
    });
    var whole = easeOut(clamp01(t / 1800));
    root.rotation.y = -0.3 * (1 - whole);
    root.rotation.x = -0.08 * (1 - whole);
    cam.position.z = 7.2 - 1.3 * whole;

    /* 완성 후: 날갯짓(수평축 회전 = 위아래 퍼덕임) 2회 + 상승 */
    var f = clamp01((t - 1900) / 1150);
    var flap = 0;
    if (f > 0) {
      var amp = Math.sin(Math.PI * f);
      flap = Math.sin(f * Math.PI * 4) * 0.42 * amp;
      groups.wingL.grp.rotation.x = flap;
      groups.wingR.grp.rotation.x = flap;
      groups.wingL.grp.rotation.y = flap * 0.22;
      groups.wingR.grp.rotation.y = -flap * 0.22;
      groups.tail.grp.rotation.x = -flap * 0.28;   // 꼬리는 반대로 젓기
    }
    var rise = easeIO(clamp01((t - 2000) / 1000));
    root.position.y = 0.35 + 0.24 * rise - 0.045 * flap;   // 날갯짓 반동
    var s = 1 + 0.05 * rise;
    root.scale.set(s, s, s);

    if (!textOn && t > 2350) { textOn = true; box.classList.add('is-on'); }
    if (t > endAt) { renderer.render(scene, cam); finish(); return; }

    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  renderer.render(scene, cam);       // 첫 프레임 동기 렌더(빈 화면 방지)
  raf = requestAnimationFrame(frame);
}

})();
