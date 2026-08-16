# Timber schedule

As of 2026-08-15. Ties are **not** installed — the light members in the photos are
temporary and cannot come out until the permanent bracing is in, so they are not stock.

## Sections, and why

| | Section | Reason |
|---|---|---|
| **Rafters** | **50 × 150** | purlins break the span into 2.55 m — factor 5.4 |
| Purlins, ridge | 50 × 250 | rafters bear on them; the depth carries it |
| Purlin struts | 100 × 100 | 9.3 kN at 2.19 m; 50 × 100 gives factor 1.1 |
| Collars | 50 × 100 | 2 kN axial, no transverse load — factor 4.4 |
| Purlin verticals | 50 × 100 | carry 0.06 kN; free from the rips |
| Tie spacers (blocking) | 50 × 100 | tie is too stocky to need restraint — kcrit 1.00 |
| Rafter spacers | 50 × 100 | not bending members; free from the rips |
| Ties | 100 × 250 | 6 m span, loft floor — **all 16 from stock** |
| **Wind girder** | **100 × 100** | bought — no longer eats 100 × 250 |
| Gable studs | 100 × 100 | **bending** governs — wind on the gable over 3.54 m |
| Levelling course | 50 × 150 | **bought**, not ripped — see below |

## Members still to make

Cut list off the model, 2026-08-15. 16 ties @ 576 mm (J15 omitted), 0.50 m verge.

| member | section | length m | off |
|---|---|---|---|
| rafter | 50 × 150 — ripped from 50 × 250 | 6.00 | 38 |
| rafter spacer | 50 × 100 — free from the rip | 0.53 | 72 |
| purlin | 50 × 250 | 6.00 + 4.31 spliced | 2 runs |
| ridge purlin | 50 × 250 | 6.00 + 4.31 spliced | 1 run |
| tie spacer (blocking) | 50 × 100 — free from the rip | 0.48 | 42 |
| gable panel diagonal | 50 × 250 | 3.60 | 2 |
| levelling course | 50 × 150 — **bought** | 6.00 | 6 |
| **TIE** | 100 × 250 | 6.00 | **16** |
| stair trimmer | 50 × 150 — bought | 1.15 | 1 |
| stair tail joist | 50 × 150 — bought | 2.00 | 1 |
| purlin strut | 100 × 100 | 1.94 — bears on the tie | 16 |
| collar | 50 × 100 — free from the rip | 2.37 | 8 |
| gable stud | 100 × 100 | 0.30 / 1.38 / 2.46 / 3.54 | 4 each |
| wind girder | 100 × 100 | 6.00 + 1.33 spliced | 4 diagonals |
| purlin vertical | 50 × 100 — free from the rip | 1.61 / 1.81 / 2.00 | 16 / 2 / 2 |

## Rafters at 50 × 150

Dropped from 250 on 2026-08-15. The rafter was never close to working, because
the purlins break the 5.10 m backspan into two 2.55 m spans:

| | Bending | Capacity | Factor | Deflection | Limit |
|---|---|---|---|---|---|
| 50 × 150 | 3.05 MPa | 16.6 | **5.4** | 1.0 mm | 8.5 mm |
| 50 × 250 | 1.14 MPa | 16.6 | 14.5 | 0.2 mm | 8.5 mm |

The load is small because a 54° roof sheds snow: μ1 = 0.8 × (60−54)/30 = **0.16**,
so 1.5 kPa of ground snow becomes 0.24 kPa on plan. Wind pressure on the windward
pitch (0.52 kPa) is the larger load, and still small.

**Shallower is also better for lateral-torsional buckling** — h/b drops from 5.0 to
3.0, and kcrit goes from 0.827 to **0.992**. No intermediate restraint needed.

**Ridge drops 0.17 m, 8.11 → 7.94 m** (approved max 7.70).

### Rip them, don't buy them

| | cash out | leaves |
|---|---|---|
| **Rip owned 50 × 250 → 50 × 150** | **€232** (10 boards) | 252 m of free 50 × 100 |
| Buy 50 × 150 | €614 | 32 spare 50 × 250 |

Ripping is **€381 cheaper**, and the byproduct is the point: 252 m of 50 × 100
falls out, which covers the purlin verticals (33.4 m), the collars (19.0 m) and the
rafter spacers (42 m) with 194 m to spare. **Nothing in 50 × 100 is bought.**

## Rafter spacers — 80 of them, 2 rows per slope

Short 50 × 100 blocks between rafters, 526 mm long, at **two lines**: on the wall
plate, and over each purlin. **No ridge row** — the rafters are screwed to the ridge
purlin, which already holds them.

They are **not** a buckling measure. kcrit is 0.99 at 50 × 150; the rafter does not
need help. Three other reasons:

1. **Bearing rotation.** EN 1995 wants the rafter held upright where it bears.
2. **Diaphragm.** F19 deleted the roof-plane braces, so the 12.9 kN gable triangle
   now relies on the sheeting acting as a plate. Sheeting cannot do that unless the
   rafters are tied to one another. This is the important one.
3. They hold the 576 mm setout while you work.

2 rows × 18 bays × 2 slopes = **72**, cut from the rip byproduct. **€0.**

## Wind girder at 100 × 100

Changed from 100 × 125 so it no longer consumes 100 × 250. **It only works because
the ties moved to 576 mm.**

The girder is screwed to every tie it crosses. At 576 mm in x that is a restraint
every **917 mm** along the 7.33 m diagonal:

| tie spacing | restraint along girder | λ | kc | capacity | vs 7.1 kN |
|---|---|---|---|---|---|
| 576 mm (now) | 917 mm | 31.8 | 0.939 | **136 kN** | 19.2 |
| 1151 mm (old) | 1834 mm | 63.4 | 0.633 | 92 kN | 13.0 |

That is why the schedule previously insisted on 100 × 125. **Fixing to every crossing
is not optional** — it is what the capacity depends on.

## Your batten stock — use it as battens, not counter-battens

Measured 2026-08-15: 40 × 20 × 100 × 2000 (80 m) + 10 × 20 × 100 × 6000 (60 m) =
**140 m, 0.28 m³**.

**As battens it works.** Over the 576 mm rafter gap: 1.32 MPa against 16.6, and
0.42 mm deflection. Covers **29%** of the 475 m needed.

**As counter-battens it does not.** 20 mm is under the 25 mm minimum, and that
dimension *is* the ventilation cavity (F21). Counter-battens must be bought.

## Tie spacers at 50 × 100, flush with the tie TOP

Dropped from full 250 depth 2026-08-15. **The tie does not need lateral restraint
at all** — 100 × 250 over 6 m has λrel 0.749 and **kcrit 1.00**. It is too stocky
for lateral-torsional buckling.

What the blocking is actually for:

1. Holding the ties upright **before the deck goes on**
2. A nailing edge where OSB sheets butt
3. Load sharing — though the screwed-down OSB does that better

All three happen at the **top** of the tie, so it sits flush with the top face.
At the bottom it does none of them. Free from the rip byproduct; saves 4 boards
of 50 × 250 (€93).

## Stair opening — J15 omitted

Owner decision 2026-08-15: leave out **J15 (x +3.454)**, 3rd from the rear gable.
**1051 mm clear** between J14 and J16 — fine for a 900 mm stair.

**The binding constraint is loft headroom, not the opening.** Full standing height
only exists within ±1.23 m of the centre:

| distance from centre | headroom | |
|---|---|---|
| 0.00 m | 3.89 m | stand |
| 1.00 m | 2.51 m | stand |
| 1.23 m | 2.20 m | stand |
| 1.50 m | 1.82 m | duck |

So the stair has to **emerge near the middle**, which fixes its run. Wall (y = −3.0)
to y = +1.0 is 4.00 m over a 3.68 m rise: **21 risers at 175 mm, 200 mm going,
41.2°**. Steep — a domestic stair wants 220 going — but this is a workshop.

**The opening only needs to be 2.0 m long, not 4.0.** The loft floor does not
threaten your head until you are 1.88 m up, which is the top 49% of the climb.
Below that you walk under a floor that is 3.88 m away. A **trimmer** (50 × 150
between J14 and J16) and a **tail joist** (100 × 250, 1.9 m back to the wall) close
the rest of the bay — both off one board.

Structure is trivial: tail joist delivers 1.09 kN to the trimmer, which runs at
1.7 MPa against 14.8. The rafter at J15 loses its tie, so its 0.98 kN thrust goes
into the plate instead — 0.41 MPa about the vertical axis.

## Rafter seat — birdsmouth + M14 to every second tie

Owner decision 2026-08-15, and it closes F3.

| | |
|---|---|
| Thrust per rafter | 0.98 kN — **20.6 kN per long wall** |
| M14 into every 2nd tie | 10 bolts × 7.1 kN = **71 kN**, factor 3.4 |
| Unbolted rafters | birdsmouth → plate → 1151 mm to the next bolt: 0.41 MPa |

The bolt does something a strap cannot: it takes the thrust **straight into the tie
as tension**, bypassing the plate. That is the correct load path — the tie is the
member designed for it.

⚠ **On a 50 × 150 rafter the 50 mm birdsmouth is EXACTLY the 1/3-depth limit.** At
250 deep the limit was 83 mm and 50 was comfortable; at 150 there is no margin. Do
not cut deeper. Seat length 90–100 mm, not 50.

**Keep straps on the unbolted rafters** — uplift (F6) is a different load case and
the birdsmouth does nothing for it.

## Stock against requirement

| section | need | have | **buy** |
|---|---|---|---|
| 50 × 250 × 6 m | 46 | 50 (40 free + 10 in temporary bracing) | **0** — 4 spare |
| 50 × 150 × 6 m | 39.1 m | 0 | **7** |
| 100 × 250 × 6 m | 16 ties | 16 | **0** |
| 100 × 100 × 6 m | 16 | 0 | **16** |
| 50 × 100 | 113 m | 228 m from the rafter rip | **0** |
| 25 × 100 battens | 433 m | 140 m @ 20 mm | **293 m** |
| 25 × 100 counter-battens | 228 m | 0 | **228 m** |

The 10 boards holding the temporary diagonals cannot be released until the wind
girder and gable panels are in — which is why rafters sit at the tail of the
allocation queue in `model/src/stock.js`, and why the last rafters show yellow.

## Buy — order this

Board counts have **10% already included** in every line, on top of nesting waste
that is already inside the raw counts.

| Section | Length | Boards | m³ | € |
|---|---|---|---|---|
| 50 × 150 | 6.0 m | **18** | 0.810 | 251 |
| 100 × 100 | 6.0 m | **21** | 1.260 | 391 |
| 25 × 100 roof battens | 6.0 m | **84** | 1.260 | 391 |
| 25 × 50 roof counter-battens | 6.0 m | **46** | 0.345 | 107 |
| 25 × 50 wall battens | 6.0 m | **65** | 0.488 | 151 |
| | | **234** | **4.163** | **€1,290** |

**Ask for 3.5 m or 7 m on the wall battens.** They are 3.44 m each, so a 6 m board
throws away 2.56 m of every one — 43% waste. At 3.5 m it is 2%, and that line drops
from €151 to about €84. Nothing else benefits from a different length.

### Nothing to buy in

| Section | Need | Have |
|---|---|---|
| 100 × 250 | 16 ties | exactly 16 |
| 50 × 250 | 49 boards | 50 |
| 50 × 100 | 147 m | 228 m from the rafter rip |

### One rip, 38 passes

**50 × 250 is the only section that gets ripped** — 38 boards down to 50 × 150 for
the rafters, throwing off 228 m of 50 × 100 that covers blocking, knee braces,
upper wall braces, purlin verticals, collars and all 72 rafter spacers. Without it
those six would cost €228. Everything else is cross-cut to length only.

### Excluded

Metal sheeting, breather membrane, 18 mm OSB loft deck, brackets and connector
screws, concrete. Stair treads come free from the 4 spare 50 × 250.

## Roof battens at 25 × 100, not 20

Changed 2026-08-15. Costs **€119**, of which only €68 is the thicker section — the
other €51 is the owner's 57.6 m of 20 × 100 becoming unusable, because 20 and 25
cannot be mixed in one roof plane without the step telegraphing through the sheet.

What it buys: sheet screws bite 25 mm instead of 20 (at ~200 mm rib spacing most
fixings fall *between* counter-battens, so the batten is all they get), and the
whole job goes to **one thickness** — 25 × 100 roof battens, 25 × 50 counter-battens,
25 × 50 wall battens. The 20 mm stock is not wasted, just not in this order.

## Why 8 purlin frames, not 5

Not for capacity — 5 was enough. With 5, the struts landed on 5 of the 9 posts and
loaded those piers to 197 kPa against 75 kPa for a plain post. With 8 it is 151 kPa
and 9.4 kN. Still over what the ground carries, but the settlement is even instead
of lumpy, which is what a timber frame tolerates. Costs €130.

## Covering notes

**Deck: 18 mm OSB, not 40 mm boards.** The 40 mm figure was driven by the 1.06 m
clear span between ties at the old 1.15 m spacing. At 576 mm the deck spans half as
far and 18 mm OSB carries it — which is why the tie spacing had to be settled before
the deck was ordered. Cheaper, lighter, and a better diaphragm than loose boards.

## Why the ties went from 9 to 17

The ties were set out one per post, at 1.151 m. That is fine for a ceiling and fails
for a loft floor:

| | Instant | Final, with creep | Limit |
|---|---|---|---|
| 9 ties @ 1.151 m | 27.3 mm | **45.6 mm** — L/132 | 24 mm |
| 17 ties @ 0.576 m | 13.7 mm | **22.8 mm** — L/263 | 24 mm |

The beam is not the problem. 100 × 250 over 6 m runs at 10.0 MPa against a 14.8
capacity — a factor of 1.5 on strength. It fails on **deflection**, because
span-to-depth is 24:1 where a floor wants 16–18:1, and kdef 0.80 roughly doubles the
day-one sag. Deflection grows with span to the fourth power, so nothing about the
section fixes it; only spacing does, and halving the spacing halves the load each tie
carries.

600 mm was the target. It does not divide evenly — 16 ties gives 614 mm and lands
24.3 mm, 0.3 mm over. The count is rounded **up** so spacing never exceeds 600.

**Battens at 300 mm.** Suits tile-profile metal, and the grid ties all 42 rafters
together every 300 mm up the slope — lateral restraint that partly covers what the
deleted roof-plane braces would have done (F19). The battens are nowhere near
working: 1.32 MPa at 20 mm over the 576 mm rafter gap, against 16.6.

**Counter-battens are not optional** if the workshop is heated or used wet — they
create the ventilated cavity that stops condensation dripping off the underside of
the sheeting. See F21.

## Notes

- **All lengths assume 6 m stock.** At 4 m the 100 × 100 count goes to 30, at 3 m to 33,
  and the 5.52 m girder pieces no longer fit at all — every one would need an extra
  splice. Confirm 100 × 100 comes in 6 m before ordering.
- The 17 ties now take all 16 owned 100 × 250 plus 1 bought — the wind girder moving
  to 100 × 100 freed the 3 boards it used to rip.
- Wind girder: 100 × 100, each 7.33 m diagonal spliced 6.00 + 1.33 so the joint lands
  on a tie crossing. 4 diagonals.
- Both rips throw off 50 × 100: the levelling course 36 m, the rafters 252 m. Total
  288 m against a 94.5 m demand (verticals, collars, spacers). 194 m spare.
- Rafters need the straightest stock. Sort before cutting.
- Nest the short items longest-first. The board counts above assume it: 0.6% waste on
  50 × 250 and 11.8% on 100 × 100. Cutting ad hoc costs 3–4 more boards.
