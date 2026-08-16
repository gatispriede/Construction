// Dimensioned section through the floor build-up.
//
// Shows the THICKNESS of each layer, not the level it sits at — a level tells
// you nothing when you are ordering 8.4 m3 of hardcore. Each layer gets a
// dimension bar spanning its real depth, with a leader out to a label.
//
// Deliberately ONLY the floor. The sill and slab levels are elsewhere in the
// model and repeating them here just buried the four numbers that matter.
//
// Read it in the `side` view with floorSlab turned on.

import * as THREE from 'three';

const DIM_X = -4.2;     // dimension column sits just outside the front-left corner
const DIM_Y = -3.25;
const LABEL_X = -1.4;   // labels stand off to the right of the bars

// mm, rounded — raw float arithmetic gave -99.99999999999999 for the formation.
const mm = (m) => Math.round(m * 1000);

function line(group, pts, colour, width = 1) {
  const g = new THREE.BufferGeometry().setFromPoints(
    pts.map((p) => new THREE.Vector3(...p)));
  group.add(new THREE.Line(g, new THREE.LineBasicMaterial({
    color: colour, linewidth: width })));
}

// Vertical dimension bar with end ticks, spanning z0..z1 at the true height.
function dimBar(group, z0, z1, colour) {
  const t = 0.16;
  line(group, [[DIM_X, DIM_Y, z0], [DIM_X, DIM_Y, z1]], colour);
  for (const z of [z0, z1]) {
    line(group, [[DIM_X - t, DIM_Y, z], [DIM_X + t, DIM_Y, z]], colour);
  }
}

function label(head, sub, pos, colour) {
  const F = 46, S = 30, pad = 16, gap = 8;
  const c = document.createElement('canvas');
  const m = c.getContext('2d');
  m.font = `800 ${F}px ui-sans-serif, system-ui, sans-serif`;
  const w1 = m.measureText(head).width;
  m.font = `400 ${S}px ui-sans-serif, system-ui, sans-serif`;
  const w2 = m.measureText(sub).width;
  c.width = Math.max(w1, w2) + pad * 2;
  c.height = F + S + gap + pad * 2;

  const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,0.96)';
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = colour;
  g.fillRect(0, 0, 10, c.height);           // colour spine, ties label to its bar
  g.strokeStyle = '#c9d1d9';
  g.lineWidth = 2;
  g.strokeRect(1, 1, c.width - 2, c.height - 2);

  g.fillStyle = '#1f2933';
  g.font = `800 ${F}px ui-sans-serif, system-ui, sans-serif`;
  g.textBaseline = 'top';
  g.fillText(head, pad + 10, pad);
  g.fillStyle = '#57606a';
  g.font = `400 ${S}px ui-sans-serif, system-ui, sans-serif`;
  g.fillText(sub, pad + 10, pad + F + gap);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.position.set(...pos);
  const h = 0.46;
  sp.scale.set((c.width / c.height) * h, h, 1);
  sp.renderOrder = 1002;
  return sp;
}

export function buildFloorNotes(p) {
  const sb = p.slab;
  const g = new THREE.Group();
  g.name = 'floorNotes';
  g.userData.layer = 'floorNotes';

  const slabTop = sb.topLevel;
  const slabBot = slabTop - sb.thickness;
  const blindBot = slabBot - sb.blinding;
  const formation = blindBot - sb.hardcore;

  // Only the floor. Thickness first — that is the number you order against.
  const layers = [
    [slabTop, slabBot, `${mm(sb.thickness)} mm`, 'slab — C25/30, A252 mid-depth', '#3d4852'],
    [slabBot, slabBot, 'DPM', '0.3–0.5 mm, lap 300 + tape', '#0969da'],
    [slabBot, blindBot, `${mm(sb.blinding)} mm`, 'blinding — sand or fines', '#a0904f'],
    [blindBot, formation, `${mm(sb.hardcore)} mm`, 'hardcore — your rock, 150 lifts', '#7a6f60'],
  ];

  // Fan the labels: the real layers are 50–150 mm apart, far too close to
  // carry a readable label each, so every one gets a leader line instead.
  const top = 1.5, step = 0.52;
  layers.forEach(([z0, z1, head, sub, colour], i) => {
    const zMid = (z0 + z1) / 2;
    if (z0 !== z1) dimBar(g, z0, z1, colour);
    else line(g, [[DIM_X - 0.16, DIM_Y, z0], [DIM_X + 0.16, DIM_Y, z0]], colour);
    const zLab = top - i * step;
    line(g, [[DIM_X + 0.16, DIM_Y, zMid], [LABEL_X - 0.9, DIM_Y, zLab]], colour);
    g.add(label(head, sub, [LABEL_X, DIM_Y, zLab], colour));
  });

  // Total build-up, so the DIG reads at a glance.
  const total = slabTop - formation;
  dimBar(g, slabTop, formation, '#d1242f');
  g.add(label(`dig ${-mm(formation)} mm`,
    `${mm(total)} mm build-up, top at +${mm(slabTop)}`,
    [LABEL_X, DIM_Y, top - layers.length * step], '#d1242f'));

  // The two details that are not a layer.
  g.add(label(`edge gap ${mm(sb.perimeterGap)} mm`,
    'XPS — seal top, leave bottom open',
    [LABEL_X, DIM_Y, top - (layers.length + 1) * step], '#8250df'));
  g.add(label(`entrance ${mm(sb.entranceThickness)} mm`,
    `thickened ${sb.entranceRun} m in from the opening`,
    [-p.plan.length / 2 + sb.entranceRun / 2, 0, slabTop + 0.75], '#e36209'));

  return g;
}
