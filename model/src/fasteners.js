// Fastener schedule as a model layer. Each connection gets a label at the
// place it happens, so the spec is read off the geometry rather than a list.
//
// Rule used throughout: a screw must reach at least 60 mm into the member it is
// anchoring INTO, after passing through the one it is holding. That is what
// decides length — 6 x 100 is not always enough.

import * as THREE from 'three';
import { derive } from './geometry.js?v=1787033584';
// Connections are labelled with the LAYER NAMES they join, not reference
// letters. The letters were a 30-row lookup table you had to learn; the layer
// name is already in the panel on the left, so "ties -> plates" points at two
// checkboxes you can actually tick.
const Z = (name) => name;

function tag(text, sub, pos, scale = 0.34) {
  const F = 40, S = 30, pad = 10;
  const c = document.createElement('canvas');
  const m = c.getContext('2d');
  m.font = `700 ${F}px ui-sans-serif, system-ui, sans-serif`;
  const w1 = m.measureText(text).width;
  m.font = `500 ${S}px ui-sans-serif, system-ui, sans-serif`;
  const w2 = m.measureText(sub).width;
  c.width = Math.max(w1, w2) + pad * 2;
  c.height = F + S + pad * 2.4;

  const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,0.94)';
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#8a6a45';
  g.lineWidth = 3;
  g.strokeRect(1.5, 1.5, c.width - 3, c.height - 3);
  g.fillStyle = '#8a3a00';
  g.font = `700 ${F}px ui-sans-serif, system-ui, sans-serif`;
  g.fillText(text, pad, pad + F * 0.85);
  g.fillStyle = '#57606a';
  g.font = `500 ${S}px ui-sans-serif, system-ui, sans-serif`;
  g.fillText(sub, pad, pad + F + S * 0.9);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.position.set(...pos);
  sp.scale.set((c.width / c.height) * scale, scale, 1);
  sp.renderOrder = 1000;
  return sp;
}


// One source of truth: the 3D tags and the grouped panel are both built from
// this. `type` is what you buy, so the panel can total it up.
export function schedule(p, d, Z) {
  const L = p.plan.length;
  const bear = d.bearingRun;
  const puY = bear - (bear / Math.cos(d.pitch)) * p.purlins.positionOnRafter * Math.cos(d.pitch);
  const puTop = d.plateTop - p.roof.bearingOnWall + (bear - puY) * Math.tan(d.pitch);
  const xs = d.longWallStations;
  return [
// --- already built ---
    [`${Z('girts')}→${Z('posts')}  girt to post`, '4 × 6×100 · through 50 girt, 50 into post', '6×100',
      [xs[2], -bear, p.heights.girtBottom + 0.05]],
    [`${Z('braces')}→${Z('girts')}  brace to girt`, '4 × 6×100 · skew, catch the post behind', '6×100',
      [xs[1], -bear, p.heights.girtBottom - 0.35]],
    [`${Z('posts')}→${Z('sills')}  post to sill`, '2 × 6×200 · skew both faces', '6×200',
      [xs[3], -bear, d.sillTop + 0.12]],
    [`${Z('sills')}→${Z('piers')}  sill to pier`, 'nothing at present — friction only', 'none',
      [xs[5], -bear, d.pierTop + 0.08]],

    // --- must ---
    [`${Z('ties')}→${Z('plates')}  tie to plate`, '2 × M14 bolt, washers + nut · 14.2 kN', 'M14',
      [xs[4], bear, d.tieBottom + 0.30]],
    [`${Z('blocking')}→${Z('ties')}  blocking to tie`, '2 × 6×100 skew per end · NOT end-grain', '6×100',
      [xs[2], 0, d.tieTop + 0.22]],
    [`${Z('roof')}→${Z('ties')}  rafter to tie`, '4 × 6×100 · direct thrust path', '6×100',
      [xs[6] + 0.1, bear - 0.3, d.plateTop + 0.30]],
    [`${Z('roof')}→${Z('plates')}  rafter to plate`, 'birdsmouth + galv. strap ≥ 2.7 kN', 'strap',
      [xs[1], -bear, d.plateTop + 0.22]],
    [`${Z('roof')}→${Z('purlins')}  rafter to purlin`, 'notch + 2 × 6×100', '6×100',
      [xs[3], puY + 0.25, puTop + 0.30]],
    [`${Z('roof')}→${Z('purlins')}  rafter to ridge`, '4 × 6×200 · through 50 into opposite rafter', '6×200',
      [0, 0.35, d.roofTop + 0.30]],
    [`${Z('purlins')}→${Z('plates')}  strut to plate`, '2 × 6×200 + strap at the foot', '6×200',
      [xs[2], bear - 0.6, d.plateTop + 0.9]],
    [`${Z('must_windGirder')}→${Z('ties')}  girder to tie end`, '7 × 6×200 · through 100 girder into tie', '6×200',
      [xs[1], bear - 1.2, d.tieBottom - 0.35]],
    [`${Z('must_windGirder')}→${Z('ties')}  girder at crossings`, '2 × 6×200 at EVERY tie it crosses', '6×200',
      [xs[4], 0.8, d.tieBottom - 0.35]],
    [`${Z('must_frontGablePanels')}  panel diagonal`, '6 × 6×100 each end', '6×100',
      [-L / 2 - 0.35, -2.2, 1.7]],
    [`${Z('must_frontGablePanels')}→${Z('sills')}  panel hold-down`, '2 × M14 · post head to sill · 6.9 kN', 'M14',
      [-L / 2 - 0.35, 1.55, 1.1]],
    [`${Z('loftDeck')}→${Z('ties')}  deck to tie`, '6×100 at 300 mm, every crossing', '6×100',
      [1.5, -1.8, d.loftFloorTop + 0.25]],

    [`${Z('plateSplices')}  plate splice`, '4 × 6×200 each side, staggered over 600 mm', '6×200',
      [-0.66, -3.0, 3.95]],

    // --- white ---
    [`${Z('reinforce_white')}→${Z('plates')}  gable stud`, '2 × 6×200 skew each end', '6×200',
      [L / 2 + 0.3, 1.1, d.plateTop + 1.5]],
    [`${Z('reinforce_white')}→${Z('roof')}  roof-plane brace`, '5 × 6×200 each end', '6×200',
      [L / 2 - 1.4, -bear + 0.5, d.plateTop + 1.9]],
  
  ];
}

export function buildFasteners(p) {
  const d = derive(p);
  const L = p.plan.length, W = p.plan.width;
  const g = new THREE.Group();
  g.name = 'fasteners';
  g.userData.layer = 'fasteners';

  const bear = d.bearingRun;
  const puY = bear - (bear / Math.cos(d.pitch)) * p.purlins.positionOnRafter * Math.cos(d.pitch);
  const puTop = d.plateTop - p.roof.bearingOnWall + (bear - puY) * Math.tan(d.pitch);
  const xs = d.longWallStations;

  const items = schedule(p, d, Z);

  for (const [t, spec, , pos] of items) g.add(tag(t, spec, pos));
  return g;
}
