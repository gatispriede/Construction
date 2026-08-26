// What you already own, and therefore what the model can colour blue.
//
// Blue   = the material is IN THE YARD.
// Yellow = the material is ON ORDER — placed 2026-08-21, not yet delivered.
//
// The logic did not change when the order went in, only the label: yellow has
// always meant "not covered by owned stock", and everything in that bucket is
// now bought rather than merely needed. Quantities below were RERUN off the
// model geometry on 2026-08-21 rather than carried forward by hand.
//
// Sections do not map one-to-one onto members, so stock has to be ALLOCATED.
// Within a section every board is interchangeable, so "which 22 of the 42
// rafters are the ones you own" is a choice, not a fact. The choice made here
// is CONSTRUCTION SEQUENCE: stock is handed out down the queue below, so blue
// means "you can build this far before the yard runs out" and yellow is
// everything past that point.
//
// The wind girder used to head the 100 x 250 queue, because it is the fix for
// the 50 mm lean and should not wait on a timber order. It moved to bought
// 100 x 100 on 2026-08-15, so it no longer competes with the ties — but it is
// still the first thing to buy.

export const OWNED = {
  // 48 counted 2026-08-21 — but they are NOT interchangeable, and that is now
  // the binding constraint. Only SIX are uncut full-section 50 x 250. The other
  // 42 are already ripped down to 50 x 150, so they can serve rafters but can
  // never be a purlin or a ridge, which need the full 250 depth.
  //
  // SECTION is the issue, not availability. Six uncut boards, and six is exactly
  // what the roof needs: three runs of 11.30 m, two boards each at 5.30 + 6.00.
  // The temporary diagonals hold one more (they are 1 x 50x250 and 2 x 50x150),
  // so there is a spare behind these six once they come down — but nothing in
  // the roof waits on it.
  '50x250': 6,
  // The 42 already ripped. Tracked apart from bought '50x150' so the fascia and
  // stair do not colour blue off timber that is spoken for.
  '50x150_ripped': 42,
  '100x250': 16,
  '100x100': 0,   // struts, gable studs, wind girder, stair newel
  // ZERO. Every 50 x 150 is BOUGHT — levelling course, stair trimmer and tail
  // joist, stair strings, and the eaves fascia. This was wrongly set to 16
  // (the ORDER quantity, not the yard quantity), which coloured all of it blue
  // as though it were already on site.
  '50x150': 0,
  // Not bought — the byproduct of ripping the 6 levelling boards from 50 x 250
  // down to 50 x 150. Tracked in metres because it is cut from a long strip.
  // 228 m from ripping 38 rafters down to 50 x 150. The levelling course is
  // bought as 50 x 150 now, so it no longer contributes byproduct.
  '50x100_m': 228.0,
  // Roof battens moved to 25 x 100 on 2026-08-15, so the owner's 57.6 m of
  // 20 x 100 is STRANDED — you cannot mix 20 and 25 in one roof plane, the step
  // telegraphs through the sheet. It is not wasted, just not in this order: it
  // goes to trim, soffit or internal work. Hence zero owned.
  '25x100_m': 0,
  // Same SECTION, tracked as two separate lines so the roof and the wall
  // can be ordered and counted independently.
  '25x50_roof_m': 0,
  '25x50_wall_m': 0,
};

// Allocation order. Earlier entries get the stock.
const QUEUE = [
  // 100 x 250 — 16 boards, now all available for ties: the wind girder moved to
  // bought 100 x 100 so it no longer takes 3 of them.
  // 13 ties at 700 mm centres = 600 mm CLEAR, as built. Down from 16 at 576.
  // THREE BOARDS SPARE, the first real margin this section has had.
  { group: 'ties',            section: '100x250', boards: 13 },
  // ZERO now. Owner placed a 14th tie at the stair station; cut at y = +1.0 it
  // yields both the tail joist (its own outer 2 m, already notched into the
  // wall) and the 1.50 m trimmer. Both in 100 x 250, flush with the ties.
  { group: 'stairOpening',    section: '100x250', boards: 1  },
  // Stair back in, built entirely from 50 x 150: 2 strings, 40 tread pieces
  // (two per step — a single 150 leaves a 50 mm gap against a 200 going) and
  // the newel. 9 boards, and EUR 14 cheaper than the mixed-section version
  // because 0.90 m treads nest 6 to a board.
  { group: 'stair',           section: '50x150',  boards: 9  },

  // 50 x 250 — 40 boards
  // Long walls only now — the gables get no levelling course. It runs out 1.0 m
  // over each gable with the plate under it, so 2 x 11.30 = 22.6 m, 4 boards.
  // INSTALLED 2026-08-21 — it is fabric now, not stock. Left in the queue at
  // zero so the 50 x 150 arithmetic still reads, but it draws as standing.
  { group: 'levelling',       section: '50x150',  boards: 0  },
  { group: 'fascia',          section: '50x150',  boards: 8  },
  // 5.30 + 6.00 per run — two boards, 0.70 m off. Cut the SHORT piece first and
  // the joint lands at -0.35, 50 mm off the frame at -0.40. Cut the 6.00 first
  // and it lands at +0.35, 650 mm out in a bay. Same boards, same waste.
  { group: 'purlins',         section: '50x250',  boards: 4  },
  // Same cut as the purlins: 5.30 + 6.00, joint at -0.35, 25 mm off the rafter
  // at -0.325. One rule for all three runs.
  { group: 'ridgePurlin',     section: '50x250',  boards: 2  },
  // Dropped to 50 x 150 — the 250 was take-off habit, not a calculation. The
  // back-gable diagonal runs 12.94 kN against 203.54 at 50 x 250, factor 15.7;
  // at 50 x 150 it is still 9.4. Frees 2 of the six uncut boards.
  { group: 'gablePanels',     section: '50x150_ripped', boards: 2  },
  // Rafters last: they are the biggest claim and the latest work, so this is
  // where the yard runs out. At 50 x 150 they still take one board each.
  // 30, down from 38: the rafters follow the tie setout, and 700 mm centres
  // over 9.30 m is 15 lines where 576 mm gave 19.
  { group: 'rafters',         section: '50x150_ripped', boards: 36 },

  // 50 x 100 — 36 m of rip byproduct
  // Blocking moved here from 50 x 250 — it is 50 x 100 now, and free.
  // 11 blocked bays x 3 rows x 0.60 m clear (the stair bay is an opening, not
  // a bay). Was 20.0 m at 16 ties and 476 mm clear.
  { group: 'blocking',        section: '50x100_m', boards: 19.8 },
  // 26 x 600 mm. These are now PRIMARY SUPPORTS, not wind braces - see
  // params.kneeBraces._STRUCTURAL. The timber is still free; the seat cut and
  // the ledger under it are the cost.
  { group: 'kneeBraces',      section: '50x100_m', boards: 15.6 },
  // Queued explicitly now. They were drawn blue unconditionally, which meant
  // 37.3 m of 50 x 100 sat outside the take-off entirely.
  { group: 'rafterSpacers',   section: '50x100_m', boards: 39.0 },
  // The 15 girt-to-corner wall braces are NOT queued: owner is supplying
  // them from separate material, deliberately kept out of this order. They
  // used to draw 22.1 m off the rip byproduct — that is now free for
  // something else. frame.js draws them blue unconditionally.
  // The T: 16 bars at 1.595 + 16 stems at 1.845 + 4 gable posts (2 x 2.000 at
  // the front, 2 x 1.815 at the back). No bolster — two pieces at the head, not
  // three, so the bar runs to the purlin UNDERSIDE and the stem 250 mm past it
  // to the top face. Read straight off the drawn geometry.
  { group: 'purlinVerticals', section: '50x100_m', boards: 62.7 },
  { group: 'collars',         section: '50x100_m', boards: 18.9 },
  // 4 corner dragon ties, 1.131 m. Free off the rip.
  { group: 'cornerBraces',    section: '50x100_m', boards: 4.6 },
  // 7 bays x 2 diagonals x 2 slopes x 2.29 m. Free off the rafter rip — and it
  // was always going to be built, as temporary works if not as a member.
  { group: 'purlinXBraces',   section: '50x100_m', boards: 58.8 },

  // 100 x 100 — none owned, so all of this is yellow
  { group: 'struts',          section: '100x100', boards: 6  },
  { group: 'gableStuds',      section: '100x100', boards: 7  },
  { group: 'windGirder',      section: '100x100', boards: 6  },
  // The brace ledger. 100 x 100 because it SPANS between the posts - a 50 mm
  // board is pulled off the wall by the tension brace at mid-bay. 2 x 9.01 m.
  { group: 'braceLedger',     section: '100x100', boards: 4  },

  // Roof battens, 25 x 100. All bought — see the note on OWNED above.
  { group: 'battens',         section: '25x100_m', boards: 475.0 },

  // 25 x 50 — same section, separate counts. Roof counter-battens make the
  // roof's ventilation cavity; wall battens make the wall's drained cavity and
  // also carry the sheet. Different jobs, different lines.
  // One per rafter line, full slope length. 15 lines now, not 19.
  { group: 'counterBattens',  section: '25x50_roof_m', boards: 212.4 },
  // 182 m plain wall (incl. 8 corner battens and 2 entrance jambs)
  // + 42 m of gable triangle and over-head strip = 225 m.
  { group: 'wallBattens',     section: '25x50_wall_m', boards: 225.0 },
];

// group -> fraction of that group covered by owned stock, 0..1.
export function coverage() {
  const left = { ...OWNED };
  const out = new Map();
  for (const { group, section, boards } of QUEUE) {
    const avail = left[section] ?? 0;
    const covered = Math.min(avail, boards);
    left[section] = avail - covered;
    out.set(group, boards > 0 ? covered / boards : 0);
  }
  return out;
}

// Build a `have(group, i, n)` predicate: is piece i of n covered by stock?
// Pieces are handed out in draw order, which is close enough to cutting order.
export function allocator() {
  const cov = coverage();
  // floor(), not round(): the model must never colour more pieces blue than
  // the yard can actually supply.
  return (group, i, n) => i < Math.floor((cov.get(group) ?? 0) * n);
}

// For the legend and docs: what is short, by section.
export function shortfall() {
  const left = { ...OWNED };
  const short = {};
  for (const { section, boards } of QUEUE) {
    const avail = left[section] ?? 0;
    const covered = Math.min(avail, boards);
    left[section] = avail - covered;
    short[section] = (short[section] ?? 0) + (boards - covered);
  }
  return short;
}
