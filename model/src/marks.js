// Member marks on the pieces that decide whether the building stands.
//
// Deliberately NOT everything. Posts, girts, blocking, collars, purlin
// verticals and gable studs are all comfortably inside capacity and their
// fixings are routine — marking them buries the ones that matter. Only members
// carrying a critical load path get a mark.
//
//   F  plate pieces      spliced, and they are the wind-girder chords (F16)
//   J  ties              tension ties + girder chords, 2 x M14 each end
//   N  purlins & ridge   the whole roof bears on these
//   S  purlin struts     carry 99% of the roof reaction to the wall
//   G  wind girder       the fix for the lean
//   B  roof-plane braces the only path for the 12.9 kN gable triangle
//   A  gable panel posts hold-downs, the tightest margin in the building

import * as THREE from 'three';
import { derive } from './geometry.js?v=1787386644';

export const MARK_KEY = [
  ['F', 'plate piece — splices, wind-girder chord'],
  ['J', 'tie — 2 × M14 each end'],
  ['N', 'purlin / ridge'],
  ['S', 'purlin strut'],
  ['G', 'wind girder diagonal'],
  ['B', 'roof-plane brace'],
  ['A', 'gable panel post — hold-down'],
];

function mark(text, pos, scale = 0.3) {
  const F = 44, pad = 9;
  const c = document.createElement('canvas');
  const m = c.getContext('2d');
  m.font = `800 ${F}px ui-sans-serif, system-ui, sans-serif`;
  c.width = m.measureText(text).width + pad * 2;
  c.height = F + pad * 1.6;
  const g = c.getContext('2d');
  g.fillStyle = '#fffbe6';
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#8a3a00';
  g.lineWidth = 4;
  g.strokeRect(2, 2, c.width - 4, c.height - 4);
  g.fillStyle = '#8a3a00';
  g.font = `800 ${F}px ui-sans-serif, system-ui, sans-serif`;
  g.textBaseline = 'middle';
  g.fillText(text, pad, c.height / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.position.set(...pos);
  sp.scale.set((c.width / c.height) * scale, scale, 1);
  sp.renderOrder = 1001;
  return sp;
}

export function buildMarks(p) {
  const d = derive(p);
  const L = p.plan.length, W = p.plan.width;
  const g = new THREE.Group();
  g.name = 'memberMarks';
  g.userData.layer = 'memberMarks';

  const tieXs = d.tieStations;
  const bear = d.bearingRun;
  const wy = W / 2 - p.sections.wallThickness / 2;

  // F — plate pieces, both layers, both walls. The splice positions are the
  // whole point, so each piece is numbered layer.piece.
  const runL = L + 2 * p.plateOverhang.gableEnd;
  [p.plateSplices.lowerLayerPieces, p.plateSplices.upperLayerPieces]
    .forEach((pieces, li) => {
      let x = -runL / 2;
      pieces.forEach((len, pi) => {
        const z = d.postTop + p.heights.plateCourse * (li + 0.5);
        for (const s of [-1, 1]) {
          g.add(mark(`F${li + 1}.${pi + 1}`, [x + len / 2, s * (wy + 0.24), z], 0.26));
        }
        x += len;
      });
    });

  // J — ties.
  d.builtTieStations.forEach((x, i) =>
    g.add(mark(`J${i + 1}`, [x, 0, d.tieTop + 0.18])));

  // N — purlins and ridge.
  const backspan = bear / Math.cos(d.pitch);
  const puY = bear - backspan * p.purlins.positionOnRafter * Math.cos(d.pitch);
  const puTop = d.plateTop - p.roof.bearingOnWall + (bear - puY) * Math.tan(d.pitch);
  g.add(mark('N1', [-2.6, -puY, puTop + 0.2]));
  g.add(mark('N2', [-2.6, puY, puTop + 0.2]));
  g.add(mark('N0', [-2.6, 0, d.roofTop + 0.2]));

  // S — purlin struts, at the five frames.
  // Built ties, matching frame.js — a frame cannot land on the stair opening.
  const bt = d.builtTieStations;
  const frames = p.purlins.strutsPerSide;
  const pick = [];
  for (let i = 0; i < frames; i++) {
    const t = bt[0] + ((bt[bt.length - 1] - bt[0]) * i) / (frames - 1);
    let best = bt[0];
    for (const x of bt) if (Math.abs(x - t) < Math.abs(best - t)) best = x;
    if (!pick.includes(best)) pick.push(best);
  }
  pick.forEach((x, i) => {
    for (const [side, s] of [['L', -1], ['R', 1]]) {
      g.add(mark(`S${side}${i + 1}`, [x, s * (bear - 0.75), d.plateTop + 0.8], 0.26));
    }
  });

  // G — wind girder, two-panel X.
  const wgZ = d.tieBottom - 0.14;
  [['G1', -L / 4, -1.5], ['G2', -L / 4, 1.5],
   ['G3', L / 4, -1.5], ['G4', L / 4, 1.5]]
    .forEach(([t, x, y]) => g.add(mark(t, [x, y, wgZ])));

  // B — roof-plane braces.
  [['B1', -L / 2 + 1.3, -1], ['B2', -L / 2 + 1.3, 1],
   ['B3', L / 2 - 1.3, -1], ['B4', L / 2 - 1.3, 1]]
    .forEach(([t, x, s]) => g.add(mark(t, [x, s * bear * 0.72, d.plateTop + 1.75])));

  // A — front gable panel end posts. Tightest margin in the building at 2.1.
  const half = p.opening.width / 2;
  [['A1', -wy], ['A2', -half], ['A3', half], ['A4', wy]]
    .forEach(([t, y]) => g.add(mark(t, [-L / 2 - 0.28, y, 2.4], 0.28)));

  return g;
}
