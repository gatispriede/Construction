// Derived geometry. Everything downstream reads from here, never from params directly,
// so a corrected measurement propagates in one place.

export function derive(p) {
  const h = p.heights;
  const sillTop = h.pier + h.sillCourse * h.sillCourses;
  const postTop = sillTop + h.post;
  const builtPlateTop = postTop + h.plateCourse * h.plateCourses;
  // Front wall finishes level with the others - it just gets there with one
  // thicker post run and a single plate course instead of two.
  const frontPlateTop = builtPlateTop;

  // The 5 cm course still to be added is let INTO the existing wall top, not
  // stacked on it, so the finished wall level stays where it is. The ties are
  // notched to the same plane, dropping 5 cm below the existing top.
  const plateTop = builtPlateTop;

  const pitch = (p.roof.pitchDeg * Math.PI) / 180;

  // Rafters bear on the wall plate and run on past it as the eaves overhang.
  // Ridge height is set by the bearing line, not by the eaves tip.
  const bearingRun = p.plan.width / 2;
  const roofRise = bearingRun * Math.tan(pitch);

  // The tail past the wall is measured along the rafter, not horizontally.
  const tailSlopeLength = p.roof.tailSlopeLength;
  const eavesOverhang = tailSlopeLength * Math.cos(pitch);
  const eavesDrop = tailSlopeLength * Math.sin(pitch);

  const roofRun = bearingRun + eavesOverhang;
  const roofWidth = roofRun * 2;
  const rafterSlopeLength = bearingRun / Math.cos(pitch) + tailSlopeLength;

  const joistWidth = p.plan.width + 2 * p.joists.cantilever;


  // Ties are notched at each end and dropped into the wall, so they sit lower
  // than the plate top by the notch depth.
  const tieBottom = plateTop - p.joists.endNotch;
  const tieTop = tieBottom + p.sections.joist[1];

  // Knee braces and the ledger their feet land on. LENGTH and ANGLE are the
  // given; the foot height follows from them, and the ledger follows the foot.
  // Change kneeBraces.length in params and the ledger moves with it — the two
  // must never be able to disagree.
  const kneeAngle = (p.kneeBraces.angleDeg * Math.PI) / 180;
  const kneeRise = p.kneeBraces.length * Math.sin(kneeAngle);
  const kneeRun = p.kneeBraces.length * Math.cos(kneeAngle);
  const braceFootZ = tieBottom - kneeRise;
  const ledgerTop = braceFootZ;

  // Loft: floor sits on the tie beams. Full walking height is only available
  // where the rafter underside clears floor + target headroom.
  const loftFloorTop = tieTop + p.loft.floorThickness;
  const headroomAt = (y) => plateTop + roofRise - Math.abs(y) * Math.tan(pitch) - loftFloorTop;
  const clearHalfWidth = Math.max(0, (plateTop + roofRise - loftFloorTop
    - p.loft.targetHeadroom) / Math.tan(pitch));

  return {
    grade: 0,
    pierTop: h.pier,
    sillTop,
    postTop,
    plateTop,
    frontPlateTop,
    wallHeight: plateTop - h.pier,

    longWallStations: cumulative(p.bays.longWallClearGaps, p.plan.length, p.bays.nominalPostWidth),
    // Full setout. Rafters, purlin struts and the wind girder all key off this,
    // so it keeps the omitted tie's position — only the TIE itself is missing.
    tieStations: tieStations(p),
    // What actually gets built: the stair opening takes one out.
    builtTieStations: tieStations(p).filter(
      (_, i) => !(p.stair ? p.stair.omitTies : []).includes(i + 1)),
    gableStations: stations(p.plan.width, p.bays.gableWallPosts - 1),
    bayWidth: p.plan.width / (p.bays.gableWallPosts - 1),
    loftFloorTop,
    kneeRise,
    kneeRun,
    braceFootZ,
    ledgerTop,
    tieBottom,
    tieTop,
    headroomAt,
    clearHalfWidth,
    builtPlateTop,

    pitch,
    bearingRun,
    roofRun,
    roofRise,
    rafterSlopeLength,
    tailSlopeLength,
    eavesDrop,
    roofWidth,
    ridgeZ: plateTop + roofRise,
    // Top of the actual timber at the ridge, where the rafter top faces meet.
    // The setting-out line (ridgeZ) sits 375 mm below this - reporting that as
    // "ridge height" understated the building.
    roofTop: plateTop - p.roof.bearingOnWall
      + (bearingRun - p.roof.ridgeSection[0] / 2) * Math.tan(pitch)
      + p.sections.rafter[1] / Math.cos(pitch),
    totalHeight: plateTop + roofRise,

    joistWidth,
    joistCount: Math.floor(p.plan.length / p.joists.spacing) + 1,
    eavesOverhang,

    // Structural quantities used by the findings overlay.
    joistClearSpan: p.plan.width,
    joistSpanToDepth: p.plan.width / p.sections.joist[1],
    rafterCount: Math.floor(p.roof.ridgeLength / p.roof.rafterSpacing) + 1,
    perimeter: 2 * (p.plan.length + p.plan.width),
    pierCount: Math.ceil((2 * (p.plan.length + p.plan.width)) / p.piers.spacing),
    gableArea: 0.5 * roofWidth * roofRise,
    windwardGableArea: 0.5 * roofWidth * roofRise + p.plan.width * (plateTop - h.pier),
  };
}

// Tie positions. Deliberately NOT tied to the posts any more.
//
// One tie per post put them 1.151 m apart, which is fine for a ceiling and
// fails badly for a loft floor — 45.6 mm final deflection against a 24 mm
// limit. Spacing is the only lever that works, because the section is already
// the deepest stock on site.
//
// The count is rounded UP so the spacing never EXCEEDS maxSpacing: 0.60 exactly
// divides into 16 ties at 614 mm, which lands 0.3 mm over the limit. 17 ties at
// 576 mm clears it and lets 18 mm OSB span the deck.
//
// End ties sit flush with the outer face of the gable walls, so the run is
// measured between tie CENTRELINES, half a tie in from each end.
// NOTE: this is the SETOUT, not the built list. One tie is omitted for the
// stair opening — see builtTieStations. Keeping them separate matters: the
// rafter beside the omitted tie still exists, and the wind girder is still
// screwed to the plate at that station.
export function tieStations(p) {
  const jw = p.sections.joist[0];
  const run = p.plan.length - jw;
  return stations(run, Math.ceil(run / p.joists.maxSpacing));
}

// `gaps` are CLEAR openings between posts, measured on site. The first and last
// posts ARE the corner posts, sitting flush with the wall ends. Posts are
// hand-hewn and vary 150-250 mm, so the measured gaps will not close exactly on
// the wall length — the residual is spread evenly across the gaps and reported
// separately rather than hidden.
export function cumulative(gaps, span, postWidth = 0.20) {
  const nPosts = gaps.length + 1;
  const first = -span / 2 + postWidth / 2;
  const last = span / 2 - postWidth / 2;
  const measured = gaps.reduce((a, b) => a + b, 0) + (nPosts - 1) * postWidth;
  const slack = (last - first - measured) / gaps.length;

  const out = [first];
  for (const g of gaps) out.push(out[out.length - 1] + postWidth + g + slack);
  out[out.length - 1] = last;
  return out;
}

// How far the measured gaps fall short of (or overrun) the wall, in metres.
export function gapResidual(gaps, span, postWidth = 0.20) {
  const nPosts = gaps.length + 1;
  const measured = gaps.reduce((a, b) => a + b, 0) + nPosts * postWidth;
  return span - measured;
}

// Evenly spaced positions across a span, inclusive of both ends.
export function stations(span, count) {
  const out = [];
  for (let i = 0; i <= count; i++) out.push(-span / 2 + (span * i) / count);
  return out;
}

// Positions at a target spacing, centred, inclusive of both ends.
export function spaced(span, spacing) {
  const n = Math.max(1, Math.round(span / spacing));
  return stations(span, n);
}
