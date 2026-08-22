// Dimension annotations. Kept separate from frame.js so the geometry builder
// stays about timber and this stays about labelling it.

import * as THREE from 'three';
import { derive } from './geometry.js?v=1787385879';

const LINE = new THREE.LineBasicMaterial({ color: 0x1f2328 });

// Text as a canvas sprite — no font loader, no extra dependency.
function label(text, pos, scale = 0.55) {
  const pad = 8, font = 48;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = `600 ${font}px ui-sans-serif, system-ui, sans-serif`;
  c.width = ctx.measureText(text).width + pad * 2;
  c.height = font + pad * 2;
  const g = c.getContext('2d');
  g.font = `600 ${font}px ui-sans-serif, system-ui, sans-serif`;
  g.fillStyle = 'rgba(255,255,255,0.88)';
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#d0d7de';
  g.strokeRect(0.5, 0.5, c.width - 1, c.height - 1);
  g.fillStyle = '#1f2328';
  g.textBaseline = 'middle';
  g.fillText(text, pad, c.height / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.position.set(...pos);
  sp.scale.set((c.width / c.height) * scale, scale, 1);
  sp.renderOrder = 999;
  return sp;
}

function line(group, a, b) {
  const g = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...a), new THREE.Vector3(...b),
  ]);
  group.add(new THREE.Line(g, LINE));
}

// A dimension: witness line between two points plus its label.
function dim(group, a, b, text, offset = [0, 0, 0], scale = 0.55) {
  const A = a.map((v, i) => v + offset[i]);
  const B = b.map((v, i) => v + offset[i]);
  line(group, A, B);
  line(group, a, A);
  line(group, b, B);
  group.add(label(text, A.map((v, i) => (v + B[i]) / 2), scale));
}

export function buildDims(p) {
  const d = derive(p);
  const L = p.plan.length, W = p.plan.width;
  const g = new THREE.Group();
  g.name = 'dimensions';
  g.userData.layer = 'dimensions';

  const bear = d.bearingRun;
  const puY = bear - (bear / Math.cos(d.pitch)) * p.purlins.positionOnRafter * Math.cos(d.pitch);
  const puTop = d.plateTop - p.roof.bearingOnWall
    + (bear - puY) * Math.tan(d.pitch) + p.roof.bearingOnPurlin;

  // --- Overall plan ---
  dim(g, [-L / 2, -W / 2, 0], [L / 2, -W / 2, 0], `${L.toFixed(2)} m`, [0, -1.6, 0], 0.75);
  dim(g, [L / 2, -W / 2, 0], [L / 2, W / 2, 0], `${W.toFixed(2)} m`, [1.6, 0, 0], 0.75);

  // --- Heights, off the front-right corner ---
  const hx = L / 2 + 1.4, hy = -W / 2 - 1.4;
  dim(g, [hx, hy, 0], [hx, hy, d.plateTop], `eaves ${d.plateTop.toFixed(2)} m`, [0, 0, 0], 0.6);
  // roofTop, not ridgeZ: ridgeZ is the setting-out line, 375 mm below the timber.
  dim(g, [hx + 1.2, hy, 0], [hx + 1.2, hy, d.roofTop], `roof top ${d.roofTop.toFixed(2)} m`, [0, 0, 0], 0.6);

  // --- Cross-section detail on the near gable ---
  const sx = -L / 2 - 0.6;
  dim(g, [sx, bear, d.tieTop], [sx, puY, d.tieTop],
      `purlin ${(bear - puY).toFixed(2)} m in`, [0, 0, 0.5], 0.5);
  dim(g, [sx, bear, d.tieTop], [sx, bear - p.purlins.strutBaseInset, d.tieTop],
      `strut foot ${p.purlins.strutBaseInset.toFixed(2)} m`, [0, 0, -0.9], 0.42);
  dim(g, [sx, puY, d.tieTop], [sx, puY, puTop],
      `${(puTop - d.tieTop).toFixed(2)} m`, [0, -0.5, 0], 0.5);
  dim(g, [sx, -puY, puTop], [sx, puY, puTop],
      `collar ${(2 * puY).toFixed(2)} m`, [0, 0, 0.5], 0.5);

  // --- Loft ---
  dim(g, [0, -d.clearHalfWidth, d.loftFloorTop], [0, d.clearHalfWidth, d.loftFloorTop],
      `${(2 * d.clearHalfWidth).toFixed(2)} m at ${p.loft.targetHeadroom} m headroom`, [0, 0, 0.35], 0.45);
  dim(g, [L / 2 - 0.4, puY, d.plateTop], [L / 2 - 0.4, puY, d.loftFloorTop],
      `floor ${d.loftFloorTop.toFixed(2)} m`, [0, 0, 0], 0.42);

  // --- Bay and tie spacing ---
  const xs = d.longWallStations;
  dim(g, [xs[1], W / 2, d.postTop], [xs[2], W / 2, d.postTop],
      `${(xs[2] - xs[1]).toFixed(2)} m`, [0, 0, 0.9], 0.42);

  // --- Entrance ---
  dim(g, [-L / 2, -p.opening.width / 2, d.sillTop], [-L / 2, p.opening.width / 2, d.sillTop],
      `entrance ${p.opening.width.toFixed(2)} m`, [-0.5, 0, -0.5], 0.5);

  // --- Member lengths, so the model doubles as a cutting list ---
  const slope = bear / Math.cos(d.pitch);
  const xs2 = d.longWallStations;
  const jw = p.sections.joist[0];
  const tx0 = -L / 2 + jw / 2;
  const dyG = 2 * (W / 2 - p.sections.post[1]);
  const lenGird = Math.hypot(L / 2, dyG);   // two-panel X: gable corner to mid-wall
  const under = (y) => d.plateTop - p.roof.bearingOnWall
    + (bear - Math.abs(y)) * Math.tan(d.pitch);
  const tallStud = under(0.392) - d.plateTop;

  const cut = [
    [`wind girder ${lenGird.toFixed(2)} m · 100×125 · 4 off`, [0, 0, d.tieBottom - 0.55], 0.5],
    [`purlin strut 2.39 m · 100×100 · 16 off`, [-2.2, -bear + 0.9, d.plateTop + 1.0], 0.44],
    [`tie ${W.toFixed(2)} m · 100×250 · 9 off`, [xs2[5], -1.2, d.tieTop + 0.30], 0.46],
    [`purlin & ridge ${p.roof.ridgeLength.toFixed(2)} m · 50×250 · SPLICE, 6 m stock`,
      [0, -puY, puTop + 0.55], 0.46],
    [`gable studs 0.30–${tallStud.toFixed(2)} m · 100×100 · 16 off`,
      [-L / 2 - 0.55, 1.0, d.plateTop + 1.5], 0.44],
  ];
  const cut2 = [];
  for (const [t, pos, sc] of [...cut, ...cut2]) g.add(label(t, pos, sc));

  // --- Pitch ---
  g.add(label(`${p.roof.pitchDeg}°`, [L / 2 + 0.3, bear / 2, d.plateTop + d.roofRise / 2], 0.55));
  g.add(label(`rafter ${p.roof.rafterTotalLength.toFixed(2)} m`,
              [0, -bear * 0.6, d.plateTop + d.roofRise * 0.45], 0.5));

  return g;
}
