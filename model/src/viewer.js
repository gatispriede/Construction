import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildFrame } from './frame.js?v=1786948429';
import { derive } from './geometry.js?v=1786948429';
import { buildDims } from './dims.js?v=1786948429';
import { buildFasteners, schedule } from './fasteners.js?v=1786948429';
import { labelOf, inOrder, letterOf } from './layers.js?v=1786948429';
import { buildFloorNotes } from './floornotes.js?v=1786948429';
import { buildMarks } from './marks.js?v=1786948429';

const params = await (await fetch('./params.json')).json();
const findings = await (await fetch('./findings.json')).json();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe3e8);
scene.fog = new THREE.Fog(0xdfe3e8, 40, 120);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 500);
camera.up.set(0, 0, 1);
camera.position.set(14, -14, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 3);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(12, -18, 22);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const c = sun.shadow.camera;
c.left = c.bottom = -20; c.right = c.top = 20; c.far = 80;
scene.add(sun);

// --- Model ----------------------------------------------------------------
const { layers, derived } = buildFrame(params);
layers.dimensions = buildDims(params);
layers.fasteners = buildFasteners(params);
layers.memberMarks = buildMarks(params);
layers.floorNotes = buildFloorNotes(params);
const root = new THREE.Group();
for (const g of Object.values(layers)) root.add(g);
scene.add(root);

// --- Approved-envelope ghost ---------------------------------------------
const ap = params.approved;
const envelope = new THREE.Group();
envelope.name = 'approved';
{
  const mat = new THREE.LineBasicMaterial({ color: 0x1a7f37 });
  const L = ap.plan.length, W = ap.plan.width, e = ap.eavesHeight, r = ap.ridgeHeight;
  const pts = [
    [-L/2,-W/2,0],[L/2,-W/2,0],[L/2,W/2,0],[-L/2,W/2,0],[-L/2,-W/2,0],
    [-L/2,-W/2,e],[L/2,-W/2,e],[L/2,W/2,e],[-L/2,W/2,e],[-L/2,-W/2,e],
  ];
  const g1 = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p)));
  envelope.add(new THREE.Line(g1, mat));
  for (const [x, y] of [[-L/2,-W/2],[L/2,-W/2],[L/2,W/2],[-L/2,W/2]]) {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,y,0), new THREE.Vector3(x,y,e)]);
    envelope.add(new THREE.Line(g, mat));
  }
  for (const x of [-L/2, L/2]) {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x,-W/2,e), new THREE.Vector3(x,0,r), new THREE.Vector3(x,W/2,e),
    ]);
    envelope.add(new THREE.Line(g, mat));
  }
  const g2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-L/2,0,r), new THREE.Vector3(L/2,0,r)]);
  envelope.add(new THREE.Line(g2, mat));
}
scene.add(envelope);
envelope.visible = false;

// --- Finding markers ------------------------------------------------------
const SEV = { critical: 0xd1242f, high: 0xe36209, medium: 0xd4a72c, low: 0x57606a };
const markers = new THREE.Group();
const pickable = [];
for (const f of findings) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 20, 16),
    new THREE.MeshBasicMaterial({ color: SEV[f.severity] })
  );
  m.position.set(...f.at);
  m.userData.finding = f;
  markers.add(m);
  pickable.push(m);
}
scene.add(markers);

// --- Picking --------------------------------------------------------------
const ray = new THREE.Raycaster();
const ptr = new THREE.Vector2();
const panel = document.getElementById('finding');
addEventListener('pointerdown', (e) => {
  ptr.x = (e.clientX / innerWidth) * 2 - 1;
  ptr.y = -(e.clientY / innerHeight) * 2 + 1;
  ray.setFromCamera(ptr, camera);
  const hit = ray.intersectObjects(pickable)[0];
  if (!hit) { panel.classList.remove('on'); return; }
  const f = hit.object.userData.finding;
  panel.innerHTML = `<span class="sev ${f.severity}">${f.severity}</span>
    <h3>${f.id} · ${f.title}</h3><p>${f.one_line}</p>
    <small>Full detail and the fix in docs/findings.md</small>`;
  panel.classList.add('on');
});

// --- UI -------------------------------------------------------------------
const ui = document.getElementById('layers');
const OFF_BY_DEFAULT = new Set([
  'loftDeck', 'floorSlab', 'floorNotes', 'cladding_white', 'fasteners', 'dimensions', 'memberMarks',
]);
for (const name of inOrder(Object.keys(layers))) {
  const id = 'L_' + name;
  const on = !OFF_BY_DEFAULT.has(name);
  layers[name].visible = on;
  ui.insertAdjacentHTML('beforeend',
    `<label><input type="checkbox" id="${id}"${on ? ' checked' : ''}>` +
    `<span class="key">${letterOf(name)}</span>${name}</label>`);
  document.getElementById(id).onchange = (e) => { layers[name].visible = e.target.checked; };
}
document.getElementById('approved').onchange = (e) => { envelope.visible = e.target.checked; };
document.getElementById('markers').onchange = (e) => { markers.visible = e.target.checked; };

// --- Screw schedule, grouped by what you buy -------------------------------
{
  const rows = schedule(params, derived, letterOf);
  const byType = new Map();
  for (const [conn, spec, type] of rows) {
    if (!byType.has(type)) byType.set(type, []);
    byType.get(type).push([conn, spec]);
  }
  const ORDER = ['6×100', '6×200', 'M14', 'strap', 'none'];
  const TITLE = {
    '6×100': '6 × 100 screws', '6×200': '6 × 200 screws',
    'M14': 'M14 bolts, washers + nut', 'strap': 'galvanised straps',
    'none': 'nothing specified yet',
  };
  let html = '<h3>Screw schedule — by fastener</h3>';
  for (const t of ORDER) {
    const list = byType.get(t);
    if (!list) continue;
    html += `<h4>${TITLE[t]} · ${list.length} connection${list.length > 1 ? 's' : ''}</h4><ul>`;
    for (const [conn, spec] of list) {
      html += `<li><span class="m">${conn}</span><span class="s">${spec}</span></li>`;
    }
    html += '</ul>';
  }
  const panel = document.getElementById('screws-panel');
  panel.innerHTML = html;
  document.getElementById('screws').onchange = (e) => {
    panel.classList.toggle('on', e.target.checked);
  };
}

// Frame the model rather than guessing distances — the ridge height moves
// with the rafter-foot option, so a hard-coded camera goes wrong.
const box = new THREE.Box3().setFromObject(root);
const centre = box.getCenter(new THREE.Vector3());
const radius = box.getBoundingSphere(new THREE.Sphere()).radius;
const dist = (radius / Math.sin((camera.fov * Math.PI) / 360)) * 0.95;

function look(dir, target = centre) {
  const d = new THREE.Vector3(...dir).normalize().multiplyScalar(dist);
  camera.position.copy(target).add(d);
  controls.target.copy(target);
}

// The entrance gable is at x = -L/2, so that is the front elevation.
const VIEWS = {
  iso:   [-0.9, -1, 0.55],
  front: [-1, 0, 0.08],
  side:  [0, -1, 0.08],
  plan:  [0, 0.001, 1],
};
for (const [k, dir] of Object.entries(VIEWS)) {
  document.getElementById('v_' + k).onclick = () => look(dir);
}
look(VIEWS.iso);

document.getElementById('readout').innerHTML = `
  as-built ${params.plan.length} × ${params.plan.width} m ·
  eaves ${derived.plateTop.toFixed(2)} m ·
  roof top ${derived.roofTop.toFixed(2)} m
  <b class="${derived.roofTop > ap.ridgeHeight ? 'bad' : 'ok'}">
    (approved max ${ap.ridgeHeight} m)</b>`;

// --- Loop -----------------------------------------------------------------
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
(function tick() {
  requestAnimationFrame(tick);
  controls.update();
  renderer.render(scene, camera);
})();
