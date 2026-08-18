// Builds the timber frame as named layers. Each layer is a THREE.Group tagged with
// userData.layer so the viewer can toggle it without knowing what's inside.

import * as THREE from 'three';
import { allocator } from './stock.js?v=1787033258';
import { derive, stations, spaced } from './geometry.js?v=1787033258';

const MAT = {
  hewn:     new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 0.9 }),
  sawn:     new THREE.MeshStandardMaterial({ color: 0xc9a86a, roughness: 0.85 }),
  brace:    new THREE.MeshStandardMaterial({ color: 0xa8894f, roughness: 0.85 }),
  brick:    new THREE.MeshStandardMaterial({ color: 0xb5563a, roughness: 1.0 }),
  concrete: new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.95 }),
  // Sub-base — the owner's rock and brick, compacted. Drawn so the DIG is
  // visible: 200 mm below grade is the real constraint on the whole build-up.
  hardcore: new THREE.MeshStandardMaterial({ color: 0x7a6f60, roughness: 1.0 }),
  // Colour now says ONE thing: can you build this today?
  //   BLUE   the material is in the yard
  //   YELLOW you have to buy it first
  // Brown/brick below is fabric that already stands. See stock.js for how the
  // stock is allocated between members of the same section.
  have: new THREE.MeshStandardMaterial({ color: 0x4f8fbf, roughness: 0.6, transparent: true, opacity: 0.55 }),
  need: new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.5, transparent: true, opacity: 0.85 }),
  // Steel, not timber — bolts, straps, splice plates. Always bought.
  steel: new THREE.MeshStandardMaterial({ color: 0xf5f7fa, roughness: 0.35,
                                          emissive: 0x333a42, emissiveIntensity: 0.25 }),
  // Cladding — shown so the finished envelope reads, kept translucent so the
  // frame stays visible behind it.
  cladding: new THREE.MeshStandardMaterial({ color: 0xf7f9fb, roughness: 0.8,
                                             transparent: true, opacity: 0.45,
                                             side: THREE.DoubleSide }),
  ground:   new THREE.MeshStandardMaterial({ color: 0x6f7f52, roughness: 1.0 }),
  // Red = shown for fit only, NOT in the material take-off. The stair sits on a
  // concrete floor that does not exist yet and is not being bought now.
  future:   new THREE.MeshStandardMaterial({ color: 0xd1242f, roughness: 0.6,
                                             transparent: true, opacity: 0.7 }),
};

// Axis-aligned member. c = centre [x,y,z], s = size [x,y,z].
function bar(group, mat, c, s) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(s[0], s[1], s[2]), mat);
  m.position.set(c[0], c[1], c[2]);
  m.castShadow = m.receiveShadow = true;
  group.add(m);
  return m;
}

// Member between two points, with a rectangular section. `trim` shortens both
// ends along the axis so the member stops at its bearing face instead of the
// box overshooting past it.
function strut(group, mat, a, b, w, d, trim = 0) {
  let A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  if (trim) {
    const dir = B.clone().sub(A).normalize().multiplyScalar(trim);
    A = A.clone().add(dir);
    B = B.clone().sub(dir);
  }
  const len = A.distanceTo(B);
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, d), mat);
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  m.castShadow = m.receiveShadow = true;
  group.add(m);
  return m;
}

// Choose `n` entries from `xs`, keeping both ends and spreading the rest as
// evenly as the available positions allow.
function pickEvenly(xs, n) {
  if (!n || n >= xs.length) return xs.slice();
  const lo = xs[0], hi = xs[xs.length - 1];
  const out = [];
  for (let i = 0; i < n; i++) {
    const target = lo + ((hi - lo) * i) / (n - 1);
    let best = xs[0];
    for (const x of xs) if (Math.abs(x - target) < Math.abs(best - target)) best = x;
    if (!out.includes(best)) out.push(best);
  }
  return out;
}

// A rafter with PLUMB cuts at both ends — the triangle cut off the top, which
// is what makes the top corners meet the ridge cleanly. strut() gives ends
// square to the axis, which leaves a corner poking past the ridge.
function rafterMesh(group, mat, x, width, yA, zA, yB, zB, vDepth) {
  const shape = new THREE.Shape();
  shape.moveTo(yA, zA);
  shape.lineTo(yA, zA + vDepth);
  shape.lineTo(yB, zB + vDepth);
  shape.lineTo(yB, zB);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
  // The shape is drawn with its local x = world y and local y = world z, and
  // extrudes along local z. Map local (x,y,z) -> world (z,x,y). A single
  // rotateY does not do this — it sends the profile onto the wrong axis and
  // the rafters disappear.
  geo.applyMatrix4(new THREE.Matrix4().set(
    0, 0, 1, 0,
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 1,
  ));
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x - width / 2, 0, 0);
  m.castShadow = m.receiveShadow = true;
  group.add(m);
  return m;
}

// Purlin position across the width. Needed by the spacer rows, which are built
// with the roof, before the purlin block runs.
function puYFor(p, d) {
  const backspan = d.bearingRun / Math.cos(d.pitch);
  return d.bearingRun - backspan * p.purlins.positionOnRafter * Math.cos(d.pitch);
}

function layer(name) {
  const g = new THREE.Group();
  g.name = name;
  g.userData.layer = name;
  return g;
}

// Z is up. X runs along the 9 m length, Y across the 6 m width.
export function buildFrame(p) {
  const d = derive(p);
  const L = p.plan.length, W = p.plan.width;
  const layers = {};
  // Blue if the yard covers it, yellow if it has to be bought.
  const own = allocator();
  const M = (group, i, n) => (own(group, i, n) ? MAT.have : MAT.need);

  // 9.31 x 6.00 are OUTER dimensions, so every wall member is set in by half
  // its own thickness — its outer face lands on the boundary, not its centre.
  const wy = (t) => W / 2 - t / 2;   // long-wall members
  const wx = (t) => L / 2 - t / 2;   // gable-wall members

  // --- Ground -------------------------------------------------------------
  const ground = layer('ground');
  const g = new THREE.Mesh(new THREE.PlaneGeometry(L + 14, W + 14), MAT.ground);
  g.receiveShadow = true;
  ground.add(g);
  layers.ground = ground;

  // --- Bored concrete piles ----------------------------------------------
  // 300 mm dia x 1.2 m, reinforced. Corrected 2026-08-15 — the model had these
  // as 250 mm dry-laid brick sitting on grade, read off photographs, which was
  // the premise for F1 and F2. Drawn full depth so the frost line reads.
  const piers = layer('piers');
  const pr = p.piers.diameter / 2;
  const sillW = p.sections.wallThickness;
  const pile = (x, y) => {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(pr, pr, p.piers.depth + p.heights.pier, 16),
      MAT.concrete);
    m.rotation.x = Math.PI / 2;
    m.position.set(x, y, p.heights.pier - (p.piers.depth + p.heights.pier) / 2);
    m.castShadow = m.receiveShadow = true;
    piers.add(m);
  };
  for (const x of spaced(L, p.piers.spacing)) {
    for (const y of [-wy(sillW), wy(sillW)]) pile(x, y);
  }
  const openY = p.opening.width / 2;
  // Gable piers only between the corners — the corners are already piered by
  // the long-wall run above, and doubling them up read as a clash.
  for (const y of spaced(W, p.piers.spacing).slice(1, -1)) {
    // Rear gable is fully piered; the front has none across the entrance.
    pile(wx(sillW), y);
    if (Math.abs(y) >= openY) pile(-wx(sillW), y);
  }
  layers.piers = piers;

  // --- Sill: two hewn courses round the perimeter -------------------------
  const sills = layer('sills');
  const sw = p.sections.wallThickness;
  const sh = p.heights.sillCourse;   // one source of truth for course height
  const openHalf = p.opening.width / 2;
  const sillSeg = W / 2 - openHalf;
  for (let c = 0; c < p.heights.sillCourses; c++) {
    const z = p.heights.pier + sh * c + sh / 2;
    for (const y of [-wy(sw), wy(sw)]) bar(sills, MAT.hewn, [0, y, z], [L, sw, sh]);
    bar(sills, MAT.hewn, [wx(sw), 0, z], [sw, W, sh]);
    // Front wall: no sill across the entrance — there is a threshold gap.
    for (const s of [-1, 1]) {
      bar(sills, MAT.hewn, [-wx(sw), s * (openHalf + sillSeg / 2), z], [sw, sillSeg, sh]);
    }
  }
  layers.sills = sills;

  // --- Posts --------------------------------------------------------------
  const posts = layer('posts');
  const [qw, qd] = p.sections.post;
  const zPost = d.sillTop + p.heights.post / 2;
  const xs = d.longWallStations;
  const ys = d.gableStations;
  for (const x of xs) for (const y of [-wy(qd), wy(qd)]) bar(posts, MAT.hewn, [x, y, zPost], [qw, qd, p.heights.post]);

  // Front gable wall (x = -L/2) carries the entrance. Posts falling inside the
  // opening are omitted; jambs land on its edges.
  // Gable-wall posts run higher than the long-wall posts, up to the underside
  // of the raised gable plate.
  const op = p.opening;
  const half = op.width / 2;
  // The front wall finishes level with the others but with only one plate
  // course, so its posts run taller by the thickness of the missing course.
  const missing = p.heights.plateCourse * (p.heights.plateCourses - p.heights.frontPlateCourses);
  const gableH = p.heights.post + missing;
  const zGablePost = d.sillTop + gableH / 2;
  // Rear gable: evenly spaced, and the same height as the long walls.
  for (const y of ys.slice(1, -1)) bar(posts, MAT.hewn, [wx(qw), y, zPost], [qw, qd, p.heights.post]);

  // Front gable: the entrance splits the wall into two panels. Posts are spread
  // evenly within each panel rather than inherited from the full-width spacing,
  // which left an awkward short bay beside each jamb.
  // Panel runs from the jamb to the corner post — and STOPS SHORT of it. The
  // corner is already placed by the long-wall loop; running to W/2 put a
  // second post 100 mm inside it.
  const panel = wy(qd) - half;
  const perPanel = Math.max(1, Math.ceil(panel / d.bayWidth));
  for (const s of [-1, 1]) {
    for (let i = 0; i < perPanel; i++) {
      const y = s * (half + (panel * i) / perPanel);
      bar(posts, MAT.hewn, [-wx(qw), y, zGablePost], [qw, qd, gableH]);
    }
  }
  layers.posts = posts;

  // No separate header over the entrance: the single front-wall plate course
  // spans the opening and acts as the lintel. See F8 for the check.

  // --- Mid-height girt ----------------------------------------------------
  const girts = layer('girts');
  const [gw, gd] = p.sections.girt;
  const zGirt = p.heights.girtBottom + gd / 2;
  for (const y of [-wy(gw), wy(gw)]) bar(girts, MAT.hewn, [0, y, zGirt], [L, gw, gd]);
  bar(girts, MAT.hewn, [wx(gw), 0, zGirt], [gw, W, gd]);
  // Front wall girt is interrupted by the entrance.
  const gSeg = (W / 2 - p.opening.width / 2);
  for (const s of [-1, 1]) {
    bar(girts, MAT.hewn, [-wx(gw), s * (p.opening.width / 2 + gSeg / 2), zGirt], [gw, gSeg, gd]);
  }
  layers.girts = girts;

  // --- Top plates. Long walls run past the gable ends by plateOverhang. ----
  const plates = layer('plates');
  const tw = p.sections.wallThickness;
  const th = p.heights.plateCourse;
  // Per course. As built the lower course projects 0.50 m past each gable and
  // the upper 1.00 m — the upper was run long specifically to carry a 1.0 m
  // verge. The verge is coming in to 0.50 m, so the upper gets CUT BACK to
  // match; left long it would stick out past the roof edge and rot.
  const over = p.plateOverhang.gableEnd;
  for (let c = 0; c < p.heights.plateCourses; c++) {
    const z = d.postTop + th * c + th / 2;
    for (const y of [-wy(tw), wy(tw)]) bar(plates, MAT.hewn, [0, y, z], [L + 2 * over, tw, th]);
  }
  // Both gables sit at the same level as the long walls. The front carries one
  // course, the back two.
  // Front plate sits on the taller posts so its top lands level with the rest.
  // Gable members run the full width and lap over the long-wall members at the
  // corners — stopping them short left a notch at every corner.
  for (const [x, courses] of [[-L / 2, p.heights.frontPlateCourses], [L / 2, p.heights.plateCourses]]) {
    const base = d.postTop + th * (p.heights.plateCourses - courses);
    for (let c = 0; c < courses; c++) {
      bar(plates, MAT.hewn, [x * (1 - tw / L), 0, base + th * c + th / 2], [tw, W, th]);
    }
  }

  // Planned 5 cm course, let into the top of the existing wall rather than
  // stacked on it, and stopping at the wall — it does not run out over the
  // gable the way the plate below it does.
  const ptc = p.heights.plannedTopCourse;
  if (ptc > 0) {
    const z = d.plateTop - ptc / 2;
    let lv = 0;
    for (const y of [-wy(tw), wy(tw)]) bar(plates, M('levelling', lv++, 4), [0, y, z], [L, tw, ptc]);
    bar(plates, M('levelling', lv++, 4), [wx(tw), 0, z], [tw, W, ptc]);
    bar(plates, M('levelling', lv++, 4), [-wx(tw), 0, z], [tw, W, ptc]);
  }
  layers.plates = plates;
  // --- Plate splices ------------------------------------------------------
  // LAP joints, not butt joints — corrected 2026-08-15 from what the owner
  // actually built. This is the difference between a wall top that carries
  // nothing along its length and one that works as the wind-girder chord: a
  // butt joint carries zero tension, a lap carries it in bolt shear. The two
  // courses are also bolted to each other with M14 through both, which is what
  // F16 asked for. Drawn as the lap overlap plus its bolts.
  const spl = layer('plateSplices');
  const ps = p.plateSplices;
  const runL = L + 2 * over;
  const jointsOf = (pieces) => {
    const out = []; let x = -runL / 2;
    for (const pc of pieces.slice(0, -1)) { x += pc; out.push(x); }
    return out;
  };
  const marks = [
    [jointsOf(ps.lowerLayerPieces), d.postTop + th / 2],
    [jointsOf(ps.upperLayerPieces), d.postTop + th * 1.5],
  ];
  const lap = ps.lapLength;
  for (const [js, z] of marks) {
    for (const jx of js) {
      for (const y of [-wy(tw), wy(tw)]) {
        // The overlap itself, shown proud so it reads against the plate.
        bar(spl, MAT.have, [jx, y, z], [lap, tw + 0.02, th * 0.55]);
        // M14 either side of the joint centre.
        for (const o of [-ps.boltFromJoint, ps.boltFromJoint]) {
          bar(spl, MAT.steel, [jx + o, y, z], [0.022, tw + 0.06, 0.022]);
        }
      }
    }
  }
  layers.plateSplices = spl;


  // --- Braces --------------------------------------------------------------
  // Counts per wall are as built: 4 on each long wall, 4 on the back gable,
  // 3 on the front because it is unfinished. Braces run corner-to-corner
  // within an end bay, from the sill up to the plate.
  const braces = layer('braces');
  const [bw, bd] = p.sections.brace;
  const nb = p.braces;

  // Place `count` braces in the end bays of a wall, alternating direction so
  // each end gets a pair crossing where the count allows.
  function braceWall(stations, count, place) {
    const last = stations.length - 2;
    const bays = [0, last];
    let made = 0;
    for (const bay of bays) {
      for (const dir of [1, -1]) {
        if (made >= count) return;
        const a = stations[bay], b = stations[bay + 1];
        const [lo, hi] = dir > 0 ? [a, b] : [b, a];
        place(lo, hi);
        made++;
      }
    }
  }

  // Built braces run from the foot of a post up to the girt. A matching upper
  // set, girt to top corner, is planned but not yet cut.
  const zGirtBot = p.heights.girtBottom;
  const zGirtTop = p.heights.girtBottom + gd;

  // The upper set comes from the owner's OWN separate material, kept out of
  // the timber order on purpose so the two do not get mixed at the yard.
  // Drawn blue unconditionally: the material exists, it is just not on this
  // order and not drawn from the rip byproduct either.
  //
  // The SECTION is still passed through to strut(). It used to inherit the
  // 100 x 140 of the built lower braces, so the model drew a section nobody
  // owned and nobody was buying.
  const [ubw, ubd] = p.braces.upperSection;
  function pair(place) {
    return (lo, hi) => {
      place(MAT.brace, lo, hi, d.sillTop, zGirtBot, bw, bd);
      if (nb.upperPlanned) {
        place(MAT.have, lo, hi, zGirtTop, d.postTop, ubw, ubd);
      }
    };
  }

  for (const y of [-wy(qd), wy(qd)]) {
    braceWall(xs, nb.longWall, pair((mat, lo, hi, z0, z1, w, dd) =>
      strut(braces, mat, [lo, y, z0], [hi, y, z1], w, dd)));
  }
  braceWall(ys, nb.backGable, pair((mat, lo, hi, z0, z1, w, dd) =>
    strut(braces, mat, [wx(qw), lo, z0], [wx(qw), hi, z1], w, dd)));
  braceWall(ys, nb.frontGable, pair((mat, lo, hi, z0, z1, w, dd) =>
    strut(braces, mat, [-wx(qw), lo, z0], [-wx(qw), hi, z1], w, dd)));
  layers.braces = braces;

  // --- Tie beams across the width, cantilevering 0.5 m each side ----------
  const joists = layer('ties');
  const [jw, jd] = p.sections.joist;
  const zJ = d.tieBottom + jd / 2;
  // Set out at 576 mm, NOT one per post — see tieStations() for why. Every
  // other tie now lands mid-bay and is carried by the plate rather than by a
  // post directly beneath it.
  const tieXs = d.tieStations;          // setout — rafters, struts, girder
  const builtTies = d.builtTieStations;  // one short: the stair opening
  builtTies.forEach((x, i) => {
    bar(joists, M('ties', i, builtTies.length), [x, 0, zJ],
        [jw, W + 2 * p.joists.cantilever, jd]);
  });
  layers.ties = joists;

  // --- Blocking between the ties ------------------------------------------
  // Three evenly spaced rows, screwed through from both sides. Stops the ties
  // rolling and lets them share load rather than each acting alone.
  const blocking = layer('blocking');
  const bl = p.blocking;
  // Staggered: blocks either side of a tie are offset in y, so screws driven
  // through the tie from opposite faces land in solid timber instead of
  // meeting each other end-on. Thinner than the tie — 50 mm, not 100.
  // 50 x 100 sitting flush with the TOP of the tie — that is where the deck
  // edge lands and where the ties need holding upright before it goes on. The
  // tie itself is far too stocky to need restraining (kcrit 1.00).
  const zBlk = d.tieTop - bl.depth / 2;
  for (let i = 1; i < builtTies.length; i++) {
    const mid = (builtTies[i - 1] + builtTies[i]) / 2;
    const len = builtTies[i] - builtTies[i - 1] - jw;
    // Skip the stair bay — that gap is the opening, not a bay to block.
    if (len > 1.5 * (tieXs[1] - tieXs[0])) continue;
    const off = (i % 2 ? 1 : -1) * bl.stagger;
    for (const y of stations(W, bl.rows + 1).slice(1, -1)) {
      bar(blocking, MAT.have, [mid, y + off, zBlk], [len, bl.thickness, bl.depth]);
    }
  }
  layers.blocking = blocking;

  // --- Floor slab ---------------------------------------------------------
  // Ground-bearing, structurally SEPARATE from the frame. The levels are the
  // whole design: the sill underside sits at 200 mm, so the slab top finishes
  // at 150 and leaves a continuous 50 mm slot under the wall, open to outside
  // between the piles. That slot IS the "5 cm layer between floor and wall" —
  // an air gap, not a material. Fill it and you close the ventilated underside.
  const slab = layer('floorSlab');
  {
    const sb = p.slab;
    // Stops at the wall INNER face — that is what keeps the 150 mm strip
    // under the sill open to outside and preserves the drying path, even
    // though the slab top is now 50 mm ABOVE where the timber starts.
    const inset = p.sections.wallThickness + sb.perimeterGap;
    const sx = L - 2 * inset, sy = W - 2 * inset;
    // Slab body, top at sb.topLevel.
    bar(slab, MAT.concrete, [0, 0, sb.topLevel - sb.thickness / 2], [sx, sy, sb.thickness]);
    // Entrance thickening: a free corner AND every wheel load in the building.
    const et = sb.entranceThickness;
    bar(slab, MAT.concrete,
        [-L / 2 + inset + sb.entranceRun / 2, 0, sb.topLevel - et / 2],
        [sb.entranceRun, p.opening.width, et]);
    // Sub-base: blinding over compacted hardcore, drawn as one mass so the
    // 200 mm dig below grade reads.
    const base = sb.hardcore + sb.blinding;
    const slabBot = sb.topLevel - sb.thickness;
    bar(slab, MAT.hardcore, [0, 0, slabBot - base / 2], [sx, sy, base]);
  }
  layers.floorSlab = slab;

  // --- Stair opening ------------------------------------------------------
  // J15 is left out so a stair can come up to the loft. What closes the rest
  // of that bay is a TRIMMER between J14 and J16, and a TAIL JOIST from the
  // trimmer back to the wall.
  //
  // The opening only needs to be 2.0 m long, not the whole 4.0 m stair run:
  // the loft floor does not threaten your head until you are 1.88 m up, which
  // is the top half of the climb. Below that you are walking under a floor
  // that is 3.88 m up.
  const stairs = layer('stairOpening');
  if (p.stair) {
    const st = p.stair;
    // Centre of the run of omitted ties.
    const om = st.omitTies;
    const sx = (d.tieStations[om[0] - 1] + d.tieStations[om[om.length - 1] - 1]) / 2;
    const yTrim = st.openingFromY + st.openingLength;
    const [tmw, tmd] = st.trimmerSection;
    // Trimmer spans between the two ties that survive, top flush with them.
    // Spans the FULL opening — from J14 to J16, i.e. two tie spacings, because
    // the tie between them is the one taken out. One spacing would leave it
    // hanging in mid-air over the opening.
    // Reaches from the last surviving tie on one side to the first on the
    // other, so it spans however many were taken out.
    const openSpan = (om.length + 1) * (d.tieStations[1] - d.tieStations[0]);
    bar(stairs, M('stairOpening', 0, 2), [sx, yTrim, d.tieTop - tmd / 2],
        [openSpan, tmw, tmd]);
    // Tail joist closes the bay from the trimmer out to the far wall.
    const [tjw, tjd] = st.tailJoistSection;
    const tailLen = W / 2 - yTrim;
    // One tail joist per omitted tie station, so the deck beyond the opening
    // still spans 576 mm and not the full 1.63 m hole.
    for (const j of om) {
      bar(stairs, M('stairOpening', 1, 2),
          [d.tieStations[j - 1], yTrim + tailLen / 2, d.tieBottom + tjd / 2],
          [tjw, tailLen, tjd]);
    }
  }
  layers.stairOpening = stairs;

  // --- Stair (red: fit study only, not in the take-off) --------------------
  // Bears on a concrete floor that is not poured yet — that comes after the
  // roof is on. Drawn to check it clears the opening and the rafters, nothing
  // more. stock.js does not know about it and the schedule does not count it.
  const stair = layer('stairs');
  if (p.stair && p.stair.flight) {
    const st = p.stair, fl = st.flight;
    const om = st.omitTies;
    const sx = (d.tieStations[om[0] - 1] + d.tieStations[om[om.length - 1] - 1]) / 2;
    const floorZ = fl.floorLevel;
    const rise = (d.loftFloorTop - floorZ) / fl.risers;
    const y0 = fl.startY;
    for (let i = 1; i < fl.risers; i++) {
      bar(stair, MAT.future,
          [sx, y0 + (i - 0.5) * fl.going, floorZ + i * rise],
          [fl.width, fl.going, fl.treadThickness]);
    }
    // Strings each side, foot to landing.
    for (const o of [-1, 1]) {
      strut(stair, MAT.future,
            [sx + o * (fl.width / 2 + 0.025), y0, floorZ],
            [sx + o * (fl.width / 2 + 0.025), y0 + (fl.risers - 1) * fl.going,
             d.loftFloorTop], 0.05, 0.25);
    }
  }
  layers.stairs = stair;

  // --- Knee braces, wall top to tie ---------------------------------------
  // 45 deg, from the lowest top-wall course up to the tie underside. Short —
  // 453 mm — so this is a corner gusset, not a long brace, and buckling is
  // irrelevant. What it does is triangulate a joint that is currently a hinge.
  //
  // The wind girder fixes LONGITUDINAL racking. Across the width, posts + ties
  // + sills are a rectangle with pinned corners, i.e. a mechanism, resisted
  // only by the two gable walls and eventually the loft deck. In between,
  // nothing. These make every tie a portal frame.
  const knees = layer('kneeBraces');
  {
    const [kw, kd] = p.kneeBraces.section;
    const rise = d.tieBottom - d.postTop;      // 320 mm
    const yIn = W / 2 - p.sections.wallThickness;
    for (const x of builtTies) {
      for (const sgn of [-1, 1]) {
        strut(knees, MAT.have,
          [x, sgn * yIn, d.postTop],
          [x, sgn * (yIn - rise), d.tieBottom], kw, kd);
      }
    }
  }
  layers.kneeBraces = knees;

  // --- Loft deck ----------------------------------------------------------
  // Not just a floor. Screwed down over the ties it is the horizontal
  // diaphragm that stops the long walls spreading — the permanent replacement
  // for the temporary cross, and it costs no interior space.
  const deck = layer('loftDeck');
  bar(deck, MAT.need, [0, 0, d.loftFloorTop - p.loft.floorThickness / 2],
      [L, W, p.loft.floorThickness]);
  layers.loftDeck = deck;

  // --- Proposed roof ------------------------------------------------------
  const roof = layer('roof');
  const [rw, rd] = p.sections.rafter;
  const ridgeZ = d.ridgeZ;
  // The rafter SITS ON the plate rather than passing through it: only the
  // seat cut engages. Lifting the centreline by half the rafter depth (less the
  // 50 mm notch), measured vertically, puts the underside on the plate top with
  // just the notch buried.
  // Underside of the rafter sits `bearingOnWall` below the plate top — that is
  // the seat cut. The centreline is half a rafter depth above the underside,
  // measured vertically, which is rd/2 / cos(pitch).
  // Work from the rafter UNDERSIDE, which is the face that actually bears.
  // vDepth is the 250 mm section measured vertically, because the cuts at both
  // ends are plumb.
  const vDepth = rd / Math.cos(d.pitch);
  const underAt = (y) => d.plateTop - p.roof.bearingOnWall
    + (d.bearingRun - y) * Math.tan(d.pitch);
  // Rafters stop half a ridge-purlin short of the centreline, leaving a 50 mm
  // gap for the purlin to sit IN rather than on. Their top corners and the
  // purlin's top face finish level.
  const apexY = p.roof.ridgeSection[0] / 2;
  // Rafters are set out FROM the ties, not on a uniform pitch. At 1.151 m tie
  // spacing that meant two rafters per bay; now the ties are at 576 mm it is
  // ONE rafter beside every tie — the tie spacing has become the rafter
  // spacing. Rafter count barely changes, but now every rafter has a tie
  // against it instead of every second one.
  // Beside the tie, not on it: offset by half a tie plus half a rafter so the
  // two faces touch. That lets the rafter be screwed straight to the side of
  // the tie, giving the thrust a direct path instead of going via the plate.
  const beside = jw / 2 + rw / 2;
  const rafterXs = tieXs.map((x, i) =>
    x + (i === tieXs.length - 1 ? -beside : beside));
  // Carry the same rhythm out over the gable overhangs.
  const vergeStep = tieXs[1] - tieXs[0];
  for (let x = tieXs[0] - vergeStep; x > -p.roof.ridgeLength / 2; x -= vergeStep) rafterXs.push(x);
  for (let x = tieXs[tieXs.length - 1] + vergeStep; x < p.roof.ridgeLength / 2; x += vergeStep) rafterXs.push(x);
  rafterXs.push(-p.roof.ridgeLength / 2 + rw, p.roof.ridgeLength / 2 - rw);

  const uEave = underAt(d.roofRun), uApex = underAt(apexY);
  rafterXs.forEach((x, i) => {
    const m = M('rafters', i, rafterXs.length);
    rafterMesh(roof, m, x, rw, -d.roofRun, uEave, -apexY, uApex, vDepth);
    rafterMesh(roof, m, x, rw, d.roofRun, uEave, apexY, uApex, vDepth);
  });
  // Ridge purlin 50 x 250, sitting in the 50 mm gap with its top face level
  // with the rafter top corners.
  const [gw2, gd2] = p.roof.ridgeSection;
  const topApex = uApex + vDepth;   // rafter top corners = purlin top face
  bar(roof, M('ridgePurlin', 0, 1), [0, 0, topApex - gd2 / 2], [p.roof.ridgeLength, gw2, gd2]);
  layers.roof = roof;

  // --- Rafter spacers -----------------------------------------------------
  // Short blocks between rafters at the two bearing lines. NOT a buckling
  // measure — a 50 x 150 rafter has kcrit 0.99 and needs no help. They are here
  // because the rafters have to be held upright where they bear, and because
  // F19 deleted the roof-plane braces: the sheeting can only work as a
  // diaphragm if the rafters are tied to one another. Cut from rafter offcuts.
  const spacers = layer('rafterSpacers');
  const [spw, spd] = p.rafterSpacers.section;
  const sorted = [...rafterXs].sort((a, b) => a - b);
  // Two rows per slope: at the wall plate, and over the purlin.
  const rowYs = [d.bearingRun - 0.20, puYFor(p, d)];
  for (let i = 1; i < sorted.length; i++) {
    const gapLen = sorted[i] - sorted[i - 1] - rw;
    if (gapLen <= 0.05) continue;
    const cx = (sorted[i] + sorted[i - 1]) / 2;
    for (const s of [-1, 1]) {
      for (const ry of rowYs) {
        const z = underAt(ry) + vDepth / 2;
        bar(spacers, MAT.have, [cx, s * ry, z], [gapLen, spw, spd]);
      }
    }
  }
  layers.rafterSpacers = spacers;

  // --- Battens and counter-battens ----------------------------------------
  // Build-up, bottom to top: rafter -> membrane -> COUNTER-batten up the slope
  // over each rafter -> BATTEN across at 300 mm -> metal sheet. The
  // counter-batten depth IS the ventilation cavity (F21), which is why it stays
  // 25 mm while the battens drop to 20 mm to match the owner's stock.
  const bat = layer('battens');
  {
    const b = p.roof.battens;
    const [bt, bw] = b.section;                 // 20 x 100
    const [ct, cw] = b.counterBattenSection;    // 25 x 100
    const cp = Math.cos(d.pitch), sp2 = Math.sin(d.pitch);
    const topAt = (y) => underAt(y) + vDepth;
    // Offset perpendicular to the roof plane: +t moves out along the normal,
    // which is (sin, cos) in (y, z) on the +y slope.
    const off = (y, t) => [y + t * sp2, topAt(y) + t * cp];

    // Counter-battens: one per rafter, eave to ridge.
    for (const x of rafterXs) {
      for (const sgn of [-1, 1]) {
        const [ya, za] = off(d.roofRun, ct / 2);
        const [yb, zb] = off(apexY, ct / 2);
        strut(bat, MAT.need, [x, sgn * ya, za], [x, sgn * yb, zb], cw, ct);
      }
    }
    // Battens: across the slope at b.spacing, measured ALONG the slope.
    // Divide the slope EVENLY rather than stepping at exactly 300 from the
    // eave: a fixed step leaves 260 mm bare at the ridge, which is where the
    // sheet needs a fixing most. ceil() keeps the spacing at or under 300.
    const slope = (d.roofRun - apexY) / cp;
    const nRun = Math.ceil(slope / b.spacing);
    const step = slope / nRun;
    // Count runs across BOTH slopes, so the blue ones are a true count of what
    // the yard covers rather than the same fraction repeated on each side.
    const totalRuns = (nRun + 1) * 2;
    let run = 0;
    for (let i = 0; i <= nRun; i++) {
      const y = d.roofRun - i * step * cp;
      const [yy, zz] = off(y, ct + bt / 2);
      for (const sgn of [-1, 1]) {
        bar(bat, M('battens', run++, totalRuns),
            [0, sgn * yy, zz], [p.roof.ridgeLength, bw, bt]);
      }
    }
  }
  layers.battens = bat;

  // --- Wall battens -------------------------------------------------------
  // VERTICAL, at 600 mm, for horizontal metal sheet. One layer: the vertical
  // batten drains the cavity AND carries the sheet. Its 25 mm depth IS the
  // drained cavity — on a roof gravity drains it, on a wall only a vertical
  // member does, so a horizontal batten laid on the membrane would be a shelf
  // holding water against the frame.
  const wallBat = layer('wallBattens');
  {
    const wb = p.wallBattens;
    const [wt, ww] = wb.section;
    const z0 = p.heights.pier, z1 = d.plateTop;
    const hgt = z1 - z0;
    const oh = p.opening.width / 2;
    let i = 0, n = 0;
    // count first so the allocator gets a stable total
    for (const _ of [0, 1]) n += Math.floor(L / wb.spacing) + 1;
    for (const _ of [0, 1]) n += Math.floor(W / wb.spacing) + 1;
    const put = (x, y, sx, sy) =>
      bar(wallBat, M('wallBattens', i++, n), [x, y, z0 + hgt / 2], [sx, sy, hgt]);
    for (const y of [-wy(wt), wy(wt)]) {
      for (const x of spaced(L, wb.spacing)) put(x, y + Math.sign(y) * wt, ww, wt);
    }
    for (const [sgn, front] of [[-1, true], [1, false]]) {
      for (const y of spaced(W, wb.spacing)) {
        if (front && Math.abs(y) < oh) continue;   // the 3 m entrance
        put(sgn * (wx(wt) + wt), y, wt, ww);
      }
    }
    // JAMB battens at the entrance reveal. Without these the sheet edge stops
    // at y = ±1.50 while the nearest grid batten is at ±1.80 — 300 mm of edge
    // screwed into air. The reveal is exactly where a sheet edge needs timber.
    const headZ = d.sillTop + p.opening.height;
    for (const y of [-oh, oh]) {
      put(-(wx(wt) + wt), y, wt, ww);
    }
    // And the strip of wall ABOVE the head still has to be clad. It is only
    // 270 mm tall, but at 3.0 m clear between jambs the sheet would span the
    // whole opening with nothing behind it.
    const above = d.plateTop - headZ;
    if (above > 0.10) {
      for (const y of spaced(W, wb.spacing)) {
        if (Math.abs(y) >= oh) continue;
        bar(wallBat, M('wallBattens', i++, n + 40),
            [-(wx(wt) + wt), y, headZ + above / 2], [wt, ww, above]);
      }
    }
    // Gable triangles above the eaves. These sit ON THE STUDS, which are now
    // at 600 mm to match the wall grid — so the sheet lands on the same spacing
    // top to bottom. No extra centre batten: at 600 mm a stud already lands at
    // the centre, and adding one there double-counted 8.2 m.
    const gys = spaced(2 * d.roofRun, p.advice.gableStudSpacing)
      .filter((y) => Math.abs(y) <= d.bearingRun);
    for (const sgn of [-1, 1]) {
      for (const y of gys) {
        const top = underAt(Math.abs(y));
        const hg = top - d.plateTop;
        if (hg < 0.15) continue;
        bar(wallBat, M('wallBattens', i++, n + gys.length * 2),
            [sgn * (wx(wt) + wt), y, d.plateTop + hg / 2], [wt, ww, hg]);
      }
    }
  }
  layers.wallBattens = wallBat;

  // --- Eaves fascia -------------------------------------------------------
  // Two 50 x 150 high, because ONE board cannot cover the rafter end: the
  // rafter is 150 deep perpendicular to the slope but it is cut PLUMB, so the
  // face it presents is 150/cos(54) = 255 mm vertical. A 250 board misses by
  // 5 mm. 150 + 150 gives 300, covering the end plus the 26 mm of batten
  // build-up, with 18 mm left to line the top edge up with the sheet.
  const fascia = layer('fascia');
  {
    const [ft, fh] = p.eaves.fasciaSection;
    const yF = d.roofRun + ft / 2;
    const z0 = underAt(d.roofRun);
    for (const sgn of [-1, 1]) {
      for (let i = 0; i < p.eaves.fasciaPieces; i++) {
        bar(fascia, M('fascia', i, p.eaves.fasciaPieces),
            [0, sgn * yF, z0 + fh / 2 + i * fh],
            [p.roof.ridgeLength, ft, fh]);
      }
    }
  }
  layers.fascia = fascia;

  // --- Purlins, cross beams and queen posts -------------------------------
  // Each rafter gets two supports: the wall plate and a purlin part-way up.
  const pu = p.purlins;
  const purlins = layer('purlins');
  const [uw, ud] = pu.section;
  const backspan = d.bearingRun / Math.cos(d.pitch);
  const alongSlope = backspan * pu.positionOnRafter;
  const puY = d.bearingRun - alongSlope * Math.cos(d.pitch);

  // The purlin has to follow the rafter, not the plate. Rafter underside runs
  // from (plateTop - seat) at the wall up the slope; the purlin top meets it,
  // less the 50 mm the rafter is notched over the purlin.
  const rafterUnderside = (y) =>
    d.plateTop - p.roof.bearingOnWall + (d.bearingRun - y) * Math.tan(d.pitch);
  const puTop = rafterUnderside(puY) + p.roof.bearingOnPurlin;
  const puZ = puTop - ud / 2;

  [-1, 1].forEach((s, i) => {
    bar(purlins, M('purlins', i, 2), [0, s * puY, puZ], [p.roof.ridgeLength, uw, ud]);
  });
  // No new cross beams. A strut runs from each purlin down to the wall plate,
  // so the purlin load goes straight into the wall instead of bending the tie
  // beam. A vertical post onto the tie would add 15 mm of sag to a beam that is
  // already at its limit under the loft floor.
  const [nw, nd] = pu.queenPostSection;
  const tieTop = d.tieTop;
  // Struts start on TOP of the tie beam, over the outer wall, and land under
  // the purlin — trimmed so neither end overshoots its bearing face. Not every
  // tie gets one: pu.strutsPerSide of them, spread as evenly as the tie
  // positions allow.
  // BUILT ties, not the setout. The purlin vertical stands ON the tie top, so a
  // frame landing at the stair opening would stand on nothing. With 17 setout
  // stations frame 7 snapped to J15 — exactly the tie taken out for the stair.
  const strutXs = pickEvenly(builtTies, pu.strutsPerSide);
  const postH = puZ - ud / 2 - tieTop;
  const braceFootY = d.bearingRun - pu.strutBaseInset;
  // The strut can land on the tie, or drop 250 mm further and bear straight on
  // the wall plate beside it. Bearing on the plate takes the roof load off the
  // tie completely, and costs only the extra length.
  const onPlate = pu.strutBearsOn === 'plate';
  const footZ = onPlate ? d.plateTop : tieTop;
  const footDX = onPlate ? jw / 2 + 0.06 : 0;
  let vi = 0, ci = 0;
  const nVert = strutXs.length * 2 + 4;
  for (const x of strutXs) {
    // 1. Vertical post under each purlin, standing on the tie.
    for (const s of [-1, 1]) {
      bar(purlins, M('purlinVerticals', vi++, nVert), [x, s * puY, tieTop + postH / 2], [nw, nd, postH]);
    }
    // 2. Collar tying the two purlin lines together, so the pair cannot sway
    //    or spread independently under wind or one-sided snow.
    // Collar sits well above the purlins, at walking height in the loft: its
    // underside is collarAboveTie above the tie tops. At that level it ties
    // the RAFTERS, not the purlins, so its span is set by the roof slope.
    const colBot = tieTop + pu.collarAboveTie;
    const colY = d.bearingRun
      - (colBot - (d.plateTop - p.roof.bearingOnWall)) / Math.tan(d.pitch);
    bar(purlins, M('collars', ci++, strutXs.length), [x, 0, colBot + pu.collarSection[1] / 2],
        [pu.collarSection[0], 2 * colY, pu.collarSection[1]]);
    // 3. Diagonal brace from the post head out to the wall. Without this the
    //    post dumps the whole roof reaction into the middle of the tie.
    //    This is the member carrying 99% of the roof reaction, so it gets
    //    strutSection (100 x 100), NOT the 50 x 100 the verticals use — they
    //    carry 0.06 kN. Building this at 50 x 100 buckles it at 2.4 kN.
    const [sw2, sd2] = pu.strutSection;
    for (const s of [-1, 1]) {
      strut(purlins, MAT.need,
        [x + footDX, s * braceFootY, footZ],
        [x + footDX, s * puY, puZ - ud / 2], sw2, sd2, sd2 / 2);
    }
  }

  // Gable-end bearing. Without this the purlin cantilevers 4 m past the last
  // frame to the verge, which no sensible section survives. Studs run up off
  // the gable plate to catch the purlin at each end.
  if (pu.bearOnGables) {
    for (const [x, courses] of [[-L / 2, p.heights.frontPlateCourses],
                                [L / 2, p.heights.plateCourses]]) {
      const base = d.postTop + p.heights.plateCourse * courses;
      const gPostH = puZ - ud / 2 - base;
      for (const s of [-1, 1]) {
        bar(purlins, M('purlinVerticals', vi++, nVert), [x, s * puY, base + gPostH / 2], [nw, nd, gPostH]);
      }
    }
  }

  layers.purlins = purlins;

  // --- MUST: named separately so each recommendation can be seen alone ----
  const adv = p.advice;
  const mTie   = layer('must_tieBolts');
  const mRaft  = layer('must_rafterStraps');
  const mGable = layer('must_frontGablePanels');
  const mGird  = layer('must_windGirder');

  // Foundation work is deliberately NOT drawn here. Underpinning a standing
  // frame to 1.2 m is not realistic, and the shallow alternatives are a
  // groundworks sequence rather than a shape worth modelling. See
  // docs/findings.md F1/F2 for the options and the numbers.

  // Tie-to-wall connection at every tie end: a strap plate over the tie face
  // with 2 x M14 through into the plate. 7.05 kN demand, 14.2 kN capacity.
  // Drawn as a visible plate because the bolts alone are 14 mm and invisible.
  for (const x of builtTies) {
    for (const s of [-1, 1]) {
      bar(mTie, MAT.steel, [x, s * (d.bearingRun - 0.11), d.tieBottom + jd / 2],
          [jw + 0.10, 0.02, jd + 0.16]);
      for (const o of [-adv.boltSpacing / 2, adv.boltSpacing / 2]) {
        bar(mTie, MAT.steel, [x + o, s * d.bearingRun * 0.93, d.tieBottom + jd / 2],
            [0.03, 0.03, jd + 0.14]);
      }
    }
  }

  // A strap at every rafter foot. Without it the 50 mm seat relies on friction,
  // which is half what the thrust needs.
  for (const x of spaced(p.roof.ridgeLength, p.roof.rafterSpacing)) {
    if (Math.abs(x) > L / 2) continue;
    for (const s of [-1, 1]) {
      bar(mRaft, MAT.steel, [x, s * d.bearingRun, d.plateTop - adv.strapDrop / 2],
          [rw + 0.02, 0.012, adv.strapDrop]);
    }
  }
  // Front-gable shear panels. The 3 m door leaves two 1.5 m panels at a 2.3:1
  // aspect ratio. They only work as shear walls if their end posts are tied
  // DOWN — otherwise the panel rotates and the long walls lean. 6.9 kN each.
  const panelYs = [
    [-W / 2 + qd / 2, -half], [half, W / 2 - qd / 2],
  ];
  let gi = 0;
  for (const [y0, y1] of panelYs) {
    // Diagonal in the plane of the wall, sill to plate — no interior intrusion.
    strut(mGable, M('gablePanels', gi++, 2), [-wx(qw), y0, d.sillTop],
          [-wx(qw), y1, d.postTop], ...p.advice.gablePanelSection);
    // Hold-down strap at each end post, post head down to the sill.
    for (const y of [y0, y1]) {
      bar(mGable, MAT.steel, [-wx(qw) + qw / 2 + 0.015, y, (d.sillTop + d.postTop) / 2],
          [0.02, 0.08, d.postTop - d.sillTop]);
    }
  }
  // WIND GIRDER — the missing link. The two wall plates plus the ties become a
  // truss in plan, carrying the wall-top load ALONG the building to the gables.
  // Sits in the tie plane at ceiling level, so it takes no interior space and
  // does not need the loft floor built.
  // Run them UNDER the ties rather than let in between them: one long diagonal
  // screwed across the underside of every tie it crosses, instead of eight
  // short pieces cut to fit. Same truss, far less cutting.
  // Two-panel X: diagonals run from each gable corner to the MIDDLE of the
  // opposite wall, crossing in each half. 7.36 m each, so they exceed the 6 m
  // stock and are laminated from two 50x250 layers with staggered joints —
  // never a butt joint in a solid section, because that carries no tension.
  const wgZ = d.tieBottom - adv.girderSection[1] / 2;
  const wgY = W / 2 - qd;
  const panels = [[tieXs[0], 0], [0, tieXs[tieXs.length - 1]]];
  let wi = 0;
  for (const [xa, xb] of panels) {
    for (const s of [-1, 1]) {
      strut(mGird, M('windGirder', wi++, 4), [xa, s * wgY, wgZ], [xb, -s * wgY, wgZ],
            adv.girderSection[0], adv.girderSection[1]);
    }
  }
  layers.must_tieBolts = mTie;
  layers.must_rafterStraps = mRaft;
  layers.must_frontGablePanels = mGable;
  layers.must_windGirder = mGird;

  // --- WHITE: required by the all-directions wind check --------------------
  // The gable triangle above the eaves carries 12.9 kN and has no other load
  // path: the gable is unframed, the rafters resist nothing sideways, and the
  // ridge purlin buckles as a strut at 1.5 kN over 11.31 m.
  const reinStud = layer('reinforce_gableStuds');
  // 100 x 100, not the 100 x 125 girder section. Buckling governs and it is the
  // WEAK axis that matters, so the extra 25 mm on the strong axis buys nothing.
  // It matters commercially: 100 x 125 has to be ripped from 100 x 250, and
  // since the tie run at 576 mm consumes every 100 x 250 on site there is no
  // longer any spare to rip. 100 x 100 is a stock section already on the order.
  const [rgw, rgd] = adv.gableStudSection;

  // 1. Gable studs, collecting the triangle load down to the wall plate.
  for (const sx of [-1, 1]) {
    const gx = sx * (L / 2 - rgw / 2);
    // Studs bear on the END TIE, not on the wall plate. The tie sits at
    // x = ±4.605 and the gable wall at ±4.655 — 50 mm apart, parallel for the
    // tie's whole length — so the stud lands on solid timber instead of on a
    // plate face already shared with the levelling course and the rafter seat.
    //
    // The end tie is NOT free-spanning: its full 100 mm width sits over the
    // gable wall (tie 4.555-4.655, wall 4.505-4.655), notched 50 mm into the
    // plate for the whole 6 m. So the studs' reaction goes straight down into
    // the gable wall, exactly as when they bore on the plate. Still fix the tie
    // down along its length — the studs push horizontally at its top and it has
    // to be held against sliding, which is a fixing question, not a span one.
    for (const y of spaced(2 * d.roofRun, adv.gableStudSpacing)) {
      if (Math.abs(y) > d.bearingRun) continue;
      const h2 = underAt(Math.abs(y)) - d.tieTop;
      if (h2 < 0.15) continue;
      bar(reinStud, MAT.need, [gx, y, d.tieTop + h2 / 2], [rgw, rgd, h2]);
    }
  }
  layers.reinforce_gableStuds = reinStud;

  // --- Cladding (white) ----------------------------------------------------
  // 22 mm decorative boarding per the permit. 134.5 m2 of wall plus gable.
  const clad = layer('cladding_white');
  const ct = p.cladding.thickness;
  const zMid = (d.sillTop + d.postTop) / 2, zH = d.postTop - d.sillTop;
  for (const sy of [-1, 1]) {
    bar(clad, MAT.cladding, [0, sy * (W / 2 + ct / 2), zMid], [L, ct, zH]);
  }
  // Rear gable solid; front gable split by the entrance.
  bar(clad, MAT.cladding, [wx(-ct), 0, zMid], [ct, W, zH]);
  const cSeg = W / 2 - half;
  for (const sy of [-1, 1]) {
    bar(clad, MAT.cladding, [-wx(-ct), sy * (half + cSeg / 2), zMid], [ct, cSeg, zH]);
  }
  // Gable triangles, following the rafter line.
  for (const sx of [-1, 1]) {
    const shape = new THREE.Shape();
    shape.moveTo(-d.bearingRun, d.plateTop);
    shape.lineTo(d.bearingRun, d.plateTop);
    for (let i = 10; i >= -10; i--) {
      const y = (d.bearingRun * i) / 10;
      shape.lineTo(y, underAt(Math.abs(y)));
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: ct, bevelEnabled: false });
    geo.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
    const m = new THREE.Mesh(geo, MAT.cladding);
    m.position.set(sx * (L / 2 + (sx > 0 ? 0 : -ct)), 0, 0);
    clad.add(m);
  }
  layers.cladding_white = clad;

  return { layers, derived: d };
}

export { MAT };
