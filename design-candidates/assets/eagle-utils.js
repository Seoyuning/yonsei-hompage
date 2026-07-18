/* ═══════════════════════════════════════════════════════════════════
   YSME — eagle-utils.js
   정적(리깅 없는) 독수리 모델의 날개 메시를 런타임에 좌/우로 분리해
   펄럭임 리깅을 만든다. 가장 넓은 메시(스팬 최장)를 날개로 보고,
   삼각형 중심의 스팬축 좌표 부호로 좌/우를 가른 뒤 각각 피벗 그룹에
   담는다 — pivot.rotation[axis] 를 흔들면 위아래 플랩.
   ═══════════════════════════════════════════════════════════════════ */
import * as THREE from './vendor/three.module.min.js';

export function rigWings(obj) {
  var wing = null, best = 0;
  obj.traverse(function (o) {
    if (o.isMesh && o.geometry) {
      o.geometry.computeBoundingBox();
      var bb0 = o.geometry.boundingBox;
      var m = Math.max(bb0.max.x - bb0.min.x, bb0.max.y - bb0.min.y, bb0.max.z - bb0.min.z);
      if (m > best) { best = m; wing = o; }
    }
  });
  if (!wing) return null;

  var bb = wing.geometry.boundingBox;
  var sz = [bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z];
  var spanAx = sz.indexOf(Math.max(sz[0], sz[1], sz[2]));
  var thickAx = sz.indexOf(Math.min(sz[0], sz[1], sz[2]));
  if (thickAx === spanAx) thickAx = (spanAx + 1) % 3;
  var chordAx = 3 - spanAx - thickAx;
  var AXES = ['x', 'y', 'z'];
  var ctr = [(bb.max.x + bb.min.x) / 2, (bb.max.y + bb.min.y) / 2, (bb.max.z + bb.min.z) / 2];

  var g = wing.geometry.index ? wing.geometry.toNonIndexed() : wing.geometry;
  var pos = g.attributes.position;
  var comp = spanAx === 0 ? 'getX' : spanAx === 1 ? 'getY' : 'getZ';
  var triL = [], triR = [];
  for (var i = 0; i < pos.count; i += 3) {
    var c = (pos[comp](i) + pos[comp](i + 1) + pos[comp](i + 2)) / 3;
    (c < ctr[spanAx] ? triL : triR).push(i);
  }
  if (!triL.length || !triR.length) return null;

  function build(tris) {
    var out = new THREE.BufferGeometry();
    Object.keys(g.attributes).forEach(function (name) {
      var src = g.attributes[name];
      var item = src.itemSize;
      var arr = new Float32Array(tris.length * 3 * item);
      var k = 0;
      tris.forEach(function (t0) {
        for (var v = 0; v < 3; v++) {
          for (var j = 0; j < item; j++) arr[k++] = src.array[(t0 + v) * item + j];
        }
      });
      out.setAttribute(name, new THREE.BufferAttribute(arr, item));
    });
    return out;
  }

  var holder = new THREE.Group();
  holder.position.copy(wing.position);
  holder.quaternion.copy(wing.quaternion);
  holder.scale.copy(wing.scale);
  wing.parent.add(holder);
  wing.visible = false;

  function pivotFor(tris) {
    var pv = new THREE.Group();
    pv.position.set(ctr[0], ctr[1], ctr[2]);
    var mesh = new THREE.Mesh(build(tris), wing.material);
    mesh.position.set(-ctr[0], -ctr[1], -ctr[2]);
    mesh.frustumCulled = false;
    pv.add(mesh);
    holder.add(pv);
    return pv;
  }
  return { left: pivotFor(triL), right: pivotFor(triR), axis: AXES[chordAx] };
}
