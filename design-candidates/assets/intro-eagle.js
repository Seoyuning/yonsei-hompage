/* ═══════════════════════════════════════════════════════════════════
   YSME — intro-eagle.js  (인트로 후보 B — A는 intro3d.js 씰 조립)
   기계 독수리(ME 로고) 부품을 3D로 압출해 하나씩 조립 → 날갯짓 → 학부명.

   부품 추출 노트: 원화의 왼날개·몸통·머리·꼬리는 흰 윤곽선으로 이어진
   하나의 거대 성분이다(오른날개만 분리돼 있음). 그래서 거대 성분만
   관절 위치(어깨 조인트 y≈288 등)에서 픽셀 단위로 해부학 분할한 뒤
   각 부위를 개별 부품으로 압출한다 — 날개 그룹에는 진짜 날개만 들어간다.

   날갯짓: 실제 새처럼 어깨 관절 중심 면내 스윕(내리칠 때 날개 끝이
   바깥-아래로) + 깊이 틸트. 몸통은 날갯짓에 끌려 움직이지 않는다.
   총 ~4.7s(조립을 천천히 보여달라는 요청 반영) · 클릭 스킵 · 하드킬 6.5s
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
  if ((x < 400 && y < 288) || (x < 240 && y < 330)) return 'wingL';  // 어깨 조인트 위 = 날개
  if (x < 315 && y >= 395) return 'tail';                            // 꼬리 연결부 밖
  if (x >= 310 && x < 540 && y >= 470) return 'talons';              // 발톱 클러스터
  return 'body';
}
/* 독립 성분(거대 성분 제외)의 그룹 판정 — 중심좌표 기준 */
function groupOfCentroid(cx, cy) {
  if (cx >= 440 && cy < 340) return 'wingR';       // 분리돼 있는 오른날개 깃 뭉치
  if (cx < 400 && cy < 300) return 'wingL';        // 왼날개 분리 깃 블레이드들
  if (cx < 315 && cy >= 395) return 'tail';        // 꼬리 분리 깃
  if (cx >= 310 && cy >= 470) return 'talons';
  return 'body';
}

function extractPieces(img) {
  var c = document.createElement('canvas'); c.width = c.height = S;
  var x = c.getContext('2d');
  x.drawImage(img, 0, 0, S, S);
  var dd = x.getImageData(0, 0, S, S).data;

  /* 1차 라벨링(전체) → 거대 성분만 부위별로 지역 재부여 → 2차 라벨링 */
  var region = new Int8Array(S * S); region.fill(-1);   // 0 body 1 wingL 2 wingR 3 tail 4 talons
  var KEYS = ['body', 'wingL', 'wingR', 'tail', 'talons'];
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

  /* 2차: 같은 부위 안에서만 연결 → 부위 경계(관절)에서 부품이 나뉜다 */
  label.fill(-1);
  var pieces = [];
  for (var p2 = 0; p2 < S * S; p2++) {
    if (!A[p2] || label[p2] >= 0) continue;
    var rg = region[p2], id2 = pieces.length, h2 = 0, t2 = 0;
    q[t2++] = p2; label[p2] = id2;
    var area2 = 0, sx2 = 0, sy2 = 0, top = [p2 % S, (p2 / S) | 0];
    while (h2 < t2) {
      var cp2 = q[h2++], cx2 = cp2 % S, cy2 = (cp2 / S) | 0;
      area2++; sx2 += cx2; sy2 += cy2;
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
    pieces.push({ id: id2, area: area2, cx: sx2 / area2, cy: sy2 / area2, top: top, group: KEYS[rg] });
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
    if (contour.length >= 3) out2.push({ contour: contour, cx: cm2.cx, cy: cm2.cy, group: cm2.group });
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
  var DEPTH = 0.13;

  /* 관절(힌지): 날갯짓·체결의 회전 중심 */
  var HINGE = { body: [385, 400], wingL: [315, 292], wingR: [455, 315], tail: [300, 420], talons: [395, 472] };
  var ORDER = ['body', 'wingL', 'wingR', 'tail', 'talons'];

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
    var pos = geo.attributes.position, uv = geo.attributes.uv;
    for (var v = 0; v < uv.count; v++) uv.setXY(v, pos.getX(v) / 2 + 0.5, pos.getY(v) / 2 + 0.5);
    uv.needsUpdate = true;

    var G = groups[pc.group];
    var hx = toWX(HINGE[pc.group][0]), hy = toWY(HINGE[pc.group][1]);
    var mesh = new THREE.Mesh(geo, [capMat, sideMat]);
    var home = new THREE.Vector3(-hx, -hy, -DEPTH / 2);
    /* 픽앤플레이스 경로: 화면 아래 스테이징 → 제자리 앞 호버 → 축 방향 압입.
       기계가 물어다 놓는 부품이므로 평평하게 운반(텀블 없음), 미세 기울기만 */
    var staging = home.clone().add(new THREE.Vector3((idx % 2 ? 0.3 : -0.3), -2.7, 0.6));
    var hover = home.clone().add(new THREE.Vector3(0, 0, 0.62));
    mesh.position.copy(staging);
    var sway = (idx % 2 ? 0.09 : -0.09);
    mesh.rotation.set(0, 0, sway);
    G.grp.add(mesh);
    G.items.push({ mesh: mesh, staging: staging, hover: hover, home: home, sway: sway });
  });

  /* 부위 순서대로 전역 일련 체결 — 앞 부품이 압입되는 동안 다음 부품이 이미
     상승 중이라 여러 대의 기계가 동시에 나르는 느낌이 난다 */
  var gi = 0;
  ORDER.forEach(function (key) {
    groups[key].items.forEach(function (it) {
      it.st = gi * 120;
      it.dur = 880;
      gi++;
    });
  });

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function snap(t) { var c = 0.9; t -= 1; return 1 + (c + 1) * t * t * t + c * t * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var T0 = performance.now();
  var textOn = false, endAt = 4700;

  function frame(now) {
    if (done) return;
    var t = now - T0;

    ORDER.forEach(function (key) {
      groups[key].items.forEach(function (it) {
        var e = clamp01((t - it.st) / it.dur);
        if (e < 0.46) {                     // 운반: 아래에서 제자리 앞까지 상승
          it.mesh.position.lerpVectors(it.staging, it.hover, easeIO(e / 0.46));
        } else if (e < 0.56) {              // 정렬: 슬롯 위에서 잠깐 멈춤
          it.mesh.position.copy(it.hover);
        } else {                            // 압입: 축 방향 스냅 체결
          it.mesh.position.lerpVectors(it.hover, it.home, snap((e - 0.56) / 0.44));
        }
        it.mesh.rotation.z = it.sway * (1 - clamp01(e / 0.5));   // 운반 기울기 → 정렬 시 0
      });
    });
    /* 조립 동안 큰 각도에서 정면으로 돌아오며 판 두께(3D)가 보인다 */
    var whole = easeOut(clamp01(t / 2600));
    root.rotation.y = -0.55 * (1 - whole);
    root.rotation.x = -0.15 * (1 - whole);
    cam.position.z = 7.5 - 1.6 * whole;

    /* ── 날갯짓(어깨 관절 기준, 몸통은 안 끌려간다) ──
       내리칠 때: 면내 스윕으로 날개 끝이 바깥-아래로 + 앞으로 깊이 틸트 */
    var f = clamp01((t - 2850) / 1500);
    if (f > 0) {
      var amp = Math.sin(Math.PI * f);
      var phi = Math.sin(f * Math.PI * 4) * amp;      // 2회 퍼덕임
      groups.wingL.grp.rotation.z = 0.34 * phi;
      groups.wingR.grp.rotation.z = -0.34 * phi;
      groups.wingL.grp.rotation.x = 0.42 * phi;
      groups.wingR.grp.rotation.x = 0.42 * phi;
      groups.wingL.grp.rotation.y = 0.16 * phi;
      groups.wingR.grp.rotation.y = -0.16 * phi;
      groups.tail.grp.rotation.x = -0.18 * phi;       // 꼬리만 살짝 반대 젓기
    }
    var rise = easeIO(clamp01((t - 2950) / 1200));
    root.position.y = 0.35 + 0.26 * rise;
    var s = 1 + 0.05 * rise;
    root.scale.set(s, s, s);

    /* 후광: 부품이 체결될 때마다 맥동, 완성(날갯짓 시작) 순간 크게 플레어 */
    if (halo) {
      var pulse = 0;
      ORDER.forEach(function (key) {
        groups[key].items.forEach(function (it) {
          var dt = t - (it.st + it.dur);
          if (dt > 0 && dt < 520) pulse += Math.exp(-dt / 150);
        });
      });
      var flare = f > 0 ? Math.sin(Math.PI * clamp01(f * 1.6)) : 0;
      var op = 0.38 + Math.min(0.3, pulse * 0.22) + 0.34 * flare;
      var sc = 1 + 0.05 * Math.min(1.4, pulse) + 0.12 * flare;
      halo.style.opacity = op.toFixed(3);
      halo.style.transform = 'translate(-50%,-50%) scale(' + sc.toFixed(3) + ')';
    }

    if (!textOn && t > 3350) { textOn = true; box.classList.add('is-on'); }
    if (t > endAt) { renderer.render(scene, cam); finish(); return; }

    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  renderer.render(scene, cam);       // 첫 프레임 동기 렌더(빈 화면 방지)
  raf = requestAnimationFrame(frame);
}

})();
