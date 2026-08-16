// Annotated section through the floor build-up.
//
// The slab is the one part of this building where the LEVELS matter more than
// the loads, and a solid grey block in the viewer shows none of that. This
// layer labels each layer with its depth and, more importantly, what it is for
// — because three of the five decisions here look optional and are not.
//
// Read it in the `side` view with floorSlab turned on.

import * as THREE from 'three';
import { derive } from './geometry.js?v=1786881486';

function label(text, sub, pos, colour = '#1f2933') {
  const F = 40, S = 30, pad = 14, gap = 8;
  const c = document.createElement('canvas');
  const m = c.getContext('2d');
  m.font = `700 ${F}px ui-sans-serif, system-ui, sans-serif`;
  const w1 = m.measureText(text).width;
  m.font = `400 ${S}px ui-sans-serif, system-ui, sans-serif`;
  const w2 = m.measureText(sub).width;
  c.width = Math.max(w1, w2) + pad * 2;
  c.height = F + S + gap + pad * 2;

  const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,0.94)';
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = colour;
  g.lineWidth = 3;
  g.strokeRect(1.5, 1.5, c.width - 3, c.height - 3);

  g.fillStyle = colour;
  g.font = `700 ${F}px ui-sans-serif, system-ui, sans-serif`;
  g.textBaseline = 'top';
  g.fillText(text, pad, pad);
  g.fillStyle = '#57606a';
  g.font = `400 ${S}px ui-sans-serif, system-ui, sans-serif`;
  g.fillText(sub, pad, pad + F + gap);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.position.set(...pos);
  const h = 0.62;
  sp.scale.set((c.width / c.height) * h, h, 1);
  sp.renderOrder = 1002;
  return sp;
}

// Thin marker at a level, so the label has something to point at.
function tick(group, z, L, colour) {
  const g = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-L / 2, -3.6, z), new THREE.Vector3(-L / 2 + 3.2, -3.6, z),
  ]);
  group.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: colour })));
}

export function buildFloorNotes(p) {
  const d = derive(p);
  const sb = p.slab;
  const L = p.plan.length;
  const g = new THREE.Group();
  g.name = 'floorNotes';
  g.userData.layer = 'floorNotes';

  const x = -L / 2 + 3.6;          // labels stand off the front-left corner
  const y = -3.6;
  const slabBot = sb.topLevel - sb.thickness;
  const blindBot = slabBot - sb.blinding;
  const formation = blindBot - sb.hardcore;

  // Levels, top down. Depth first, then WHY.
  const rows = [
    [d.sillTop, 'sill top +570', 'post foot — timber starts', '#8a6a45'],
    [p.heights.pier, 'sill underside +200', 'wood starts — vent strip below', '#d1242f'],
    [sb.topLevel, `SLAB TOP +${sb.topLevel * 1000}`, '50 ABOVE sill — stops at inner face', '#1a7f37'],
    [slabBot, `slab ${sb.thickness * 1000}`, 'C25/30, A252 at MID-DEPTH', '#1f2933'],
    [slabBot - 0.001, 'DPM 0.3-0.5 mm', 'lap 300 + TAPE. damp, sulfates, radon', '#0969da'],
    [blindBot, `blinding ${sb.blinding * 1000}`, 'stops the rock puncturing the DPM', '#57606a'],
    [formation, `hardcore ${sb.hardcore * 1000}`, 'CLEAN rock, 150 lifts, compact', '#7a6f60'],
    [formation, `FORMATION ${formation * 1000}`, 'dig 100 — halved by raising the floor', '#d1242f'],
  ];


  let i = 0;
  for (const [z, head, why, colour] of rows) {
    tick(g, z, L, colour);
    // Fan the labels vertically so they do not overlap at these small depths.
    g.add(label(head, why, [x + 2.6, y, 2.15 - i * 0.66], colour));
    i++;
  }

  // Entrance thickening, called out where it actually is.
  g.add(label(`entrance  ${sb.entranceThickness * 1000} mm`,
    `thickened ${sb.entranceRun} m in — free corner + every wheel load`,
    [-L / 2 + sb.entranceRun / 2, 0, sb.topLevel + 0.85], '#e36209'));

  // The perimeter gap is the detail people skip.
  g.add(label(`edge gap ${sb.perimeterGap * 1000}`,
    'XPS. Seal TOP, leave bottom open to drain',
    [x + 2.6, y, 2.15 - i * 0.66], '#8250df'));

  return g;
}
