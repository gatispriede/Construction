# Timber schedule

As of 2026-08-21. Ties are **not** installed — the light members in the photos are
temporary and cannot come out until the permanent bracing is in, so they are not stock.

**Re-set out at 700 mm centres — 600 mm CLEAR — 2026-08-21, AS BUILT.** The wall was
re-measured along the tie run at **9.30 m** front outer edge to back outer edge, and
the owner has set the ties out at 700 mm centres so the **600 × 1000 mm insulation
packs drop into every bay uncut**. Counts below reflect it: **13 ties, 30 rafters**.

> **This spacing only passes because the knee braces are now structural props.**
> On a plain 6 m span the loft floor runs 27.3 mm against a 24 mm limit. Propped by
> the braces it runs 13.2 mm. **The brace bearing seat is therefore mandatory** — see
> *Knee braces are now primary supports* below. Do not deck the loft until it is in.

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
| Ties | 100 × 250 | 6 m span, loft floor — **13 from stock, 2 spare** (the 14th becomes the stair trimmer) |
| **Wind girder** | **100 × 100** | bought — no longer eats 100 × 250 |
| Gable studs | 100 × 100 | **bending** governs — wind on the gable over 3.54 m |
| **Knee braces** | 50 × 100 | **props now, not wind braces** — 11.6 kN worst case, factor 4.9 |
| **Brace ledger** | **100 × 100** | stiffness, not strength: a 50 mm ledger sags 3.5 mm under the prop |
| **Purlin X-brace** | 50 × 100 | **tension-only** — 38.8 kN in tension, but only 9.3 in compression |
| Levelling course | 50 × 150 | **bought**, not ripped — see below |

## Members still to make

Cut list off the model, 2026-08-21. 13 ties @ 700 mm centres, 0.50 m verge. 14 setout
stations; the one at 8,450 mm from the front face carries a rafter and a tail joist
but no tie — that is the stair opening.

| member | section | length m | off |
|---|---|---|---|
| rafter | 50 × 150 — ripped from 50 × 250 | 6.00 | 30 |
| rafter spacer | 50 × 100 — free from the rip | 0.65 | 56 |
| purlin | 50 × 250 | **4.75 + 5.55** spliced on the frame at −0.40 | 2 runs |
| ridge purlin | 50 × 250 | 6.00 + 4.30 spliced | 1 run |
| tie spacer (blocking) | 50 × 100 — free from the rip | 0.60 | 33 |
| gable panel diagonal | 50 × 250 | 3.60 | 2 |
| levelling course | 50 × 150 — **bought** | 6.00 | 6 |
| **TIE** | 100 × 250 | 6.00 | **13** |
| stair trimmer | **100 × 250 — from the 14th tie** | 1.50 | 1 |
| stair tail joist | **100 × 250 — the 14th tie's own outer 2 m, in place** | 2.00 | 1 |
| purlin strut | 100 × 100 | 1.94 — bears on the tie | 16 |
| collar | 50 × 100 — free from the rip | 2.37 | 8 |
| gable stud | 100 × 100 | 0.30 / 1.38 / 2.46 / 3.54 | 4 each |
| wind girder | 100 × 100 | 6.00 + 1.33 spliced | 4 diagonals |
| purlin vertical | 50 × 100 — free from the rip | 1.61 / 1.81 / 2.00 | 16 / 2 / 2 |
| **knee brace** | 50 × 100 — free from the rip | 0.60, 45° both ends, **seat cut** | **26** |
| **brace ledger** | **100 × 100 — bought** | 5.82 + 3.18 spliced over a post | **2 runs** |
| **purlin X-brace** | **50 × 100 — free from the rip** | 2.29, 45°-ish both ends, **tension-only** | **28** |

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

## Rafter spacers — 56 of them, 2 rows per slope

Short 50 × 100 blocks between rafters, 550 mm long in the 600 mm bays, at **two lines**: on the wall
plate, and over each purlin. **No ridge row** — the rafters are screwed to the ridge
purlin, which already holds them.

They are **not** a buckling measure. kcrit is 0.99 at 50 × 150; the rafter does not
need help. Three other reasons:

1. **Bearing rotation.** EN 1995 wants the rafter held upright where it bears.
2. **Diaphragm.** F19 deleted the roof-plane braces, so the 12.9 kN gable triangle
   now relies on the sheeting acting as a plate. Sheeting cannot do that unless the
   rafters are tied to one another. This is the important one.
3. They hold the 700 mm setout while you work.

2 rows × 14 bays × 2 slopes = **56**, cut from the rip byproduct. **€0.**

## Wind girder at 100 × 100

Changed from 100 × 125 so it no longer consumes 100 × 250. **It only works because
the ties are close.**

The girder is screwed to every tie it crosses. At 700 mm in x that is a restraint
every **1114 mm** along the 7.33 m diagonal:

| tie spacing | restraint along girder | λ | kc | capacity | vs 7.1 kN |
|---|---|---|---|---|---|
| **700 mm (now)** | 1114 mm | 38.6 | ~0.90 | **~130 kN** | 18.3 |
| 576 mm (was) | 917 mm | 31.8 | 0.939 | 136 kN | 19.2 |
| 1151 mm (old) | 1834 mm | 63.4 | 0.633 | 92 kN | 13.0 |

That is why the schedule previously insisted on 100 × 125. **Fixing to every crossing
is not optional** — it is what the capacity depends on.

## Your batten stock — use it as battens, not counter-battens

Measured 2026-08-15: 40 × 20 × 100 × 2000 (80 m) + 10 × 20 × 100 × 6000 (60 m) =
**140 m, 0.28 m³**.

**As battens it works.** Over the 700 mm rafter gap: 1.95 MPa against 16.6, and
0.93 mm deflection. Covers **29%** of the 475 m needed.

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

## Stair opening — the close-out bay at the back

Owner decision 2026-08-15, re-set out on the 700 mm grid 2026-08-21: no tie on the
setout station at **8,450 mm from the front face**, which is the 13th of 14. That
leaves **1400 mm clear** between the tie at 7,750 and the end tie at 9,250 — 1500 mm
centre to centre. Was 1051 mm.

The opening got wider for free: the remainder that a 9.20 m centreline run leaves over
after eleven 700 mm bays lands in exactly this bay. Owner asked for 1200 mm minimum
for the stair; this beats it by 200.

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
Below that you walk under a floor that is 3.88 m away. A **trimmer** (50 × 150 over the
1.40 m between the two ties) and a **tail joist** (50 × 150, 2.0 m back to the wall,
landing on the omitted station at 8,450) close the rest of the bay — both off one
board. The tail joist is what keeps the decked part of that bay at 600 and 800 mm
centres instead of one 1400 mm span.

Structure is trivial: tail joist delivers about 1.15 kN to the trimmer, which over
1.40 m runs at 3.0 MPa against 14.8. The rafter on the omitted station has no tie, so
its 0.98 kN thrust goes into the plate instead — 0.41 MPa about the vertical axis.

The tie flanking the opening is **no worse than a typical one**, which is worth
stating because it looks like it should be: it picks up half the trimmer reaction,
but it also loses the deck over four of the six metres on the stair side. It comes
out at 13.8 mm instant against 14.3 for a typical tie.

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
| 50 × 250 × 6 m | 38 | 50 (40 free + 10 in temporary bracing) | **0** — 12 spare |
| 50 × 150 × 6 m | 39.1 m | 0 | **7** |
| 100 × 250 × 6 m | 13 ties | 16 | **0** — 3 spare |
| 100 × 100 × 6 m | 20 | 0 | **20** |
| 50 × 100 | 124.2 m | 228 m from the rafter rip | **0** |
| 25 × 100 battens | 433 m | 140 m @ 20 mm | **293 m** |
| 25 × 50 counter-battens | 188.8 m | 0 | **188.8 m** |

The 10 boards holding the temporary diagonals cannot be released until the wind
girder and gable panels are in — which is why rafters sit at the tail of the
allocation queue in `model/src/stock.js`, and why the last rafters show yellow.

## Buy — order this

Confirmed quantities, 2026-08-16. Contingency is already inside each figure.

**€310/m³ is VAT-INCLUSIVE** — €256.20/m³ ex VAT. Earlier versions of this
schedule treated 310 as ex-VAT and added 21% on top, which overstated every
inclusive total by a factor of 1.21.

| Section | Length | **Order** | Metres | Need | Spare | m³ | ex VAT | **incl VAT** |
|---|---|---|---|---|---|---|---|---|
| 50 × 150 | 6.0 m | **24** | 144 | 22 | 2 (9%) | 1.080 | 276.70 | 334.80 |
| 100 × 100 | 6.0 m | **24** | 144 | 22 | 2 (9%) | 1.440 | 368.93 | 446.40 |
| 25 × 100 roof battens | 6.0 m | **86** | 516 | 78 | 8 (10%) | 1.290 | 330.50 | 399.90 |
| 25 × 50 counter + wall battens | 6.0 m | **98** | 588 | 89 | 9 (10%) | 0.735 | 188.31 | 227.85 |
| **TOTAL** | | **233** | **1,398** | | | **4.590** | **1,175.96** | **€1,422.90** |

€246.94 of that is VAT. **Budget €1,422.90 all in.**

Down €18.60 from the 576 mm setout on the battens, and back up €74.40 on the
100 × 100 — which is the **brace ledger** the knee braces now stand on (F24).
Four boards, and it is the only cash the whole knee-brace rework costs: the
longer braces come out of the rip byproduct and the seat cuts are labour. The
ties and rafters come out of stock either way, so the 8 boards saved there show
up as spare, not as money. See [stability.md](stability.md) for why the ledger
has to be 100 mm thick and not 50.

### Nothing to buy in these — all from your own stock

| Section | Used | Own | |
|---|---|---|---|
| 50 × 250 | 38 | 50 | 30 ripped for rafters, 6 roof support, 2 gable diagonals — **12 spare** |
| 100 × 250 | 13 | 16 | the 13 ties, **3 spare** — real margin at last |
| 50 × 100 | 124.2 m | 228 m | all from the rafter rip — blocking, spacers, collars, verticals, knee braces |

### Sort the 50 × 150 before you cut

Of the 23 boards needed, **13 are used at full 6.00 m** — 6 levelling course and
7 eaves fascia. A defect anywhere in one of those costs the whole board; you
cannot cut around it. The 2 spare cover exactly 2 such boards.

The other 10 go to short pieces — stair treads at 0.90 m, strings 5.44, trimmer
1.15, tail joist 2.00, newel 1.84 — and those are forgiving, because a knot just
moves the cut.

**So put the straightest, cleanest boards into the levelling course and fascia
first, and let the stair take what is left.**

Ask the yard about **3.5 m or 7 m** for the wall battens: they are 3.44 m each, so
a 6 m board wastes 2.56 m of every one.

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

**Deck: 22 mm OSB, not 18.** 18 mm OSB/3 is rated to 600 mm *centres*; at 700 it is
off the span tables. The 40 mm boarding in the model carries the 600 mm clear span
easily (0.10 mm) and is the alternative if boards are preferred to sheet. **Do not buy
18 mm for this floor** — that figure was written when the ties were at 576.

## Why the ties are at 700 mm — and what it costs

**As built, owner 2026-08-21.** 700 mm centres on a 100 mm tie is **600 mm clear**,
which is what takes a 600 × 1000 mm insulation pack with no cutting. That is the whole
reason, and it is a good one — the alternative was binning 100 mm off every pack across
55 m² of floor.

But it is not free, and this is the part to read before decking anything.

### The loft floor does not pass on a plain span

100 × 250 over 6 m, w = 1391 N/m at 700 centres, limit L/250 = **24 mm**:

| How the tie is modelled | Instant | **Final, with creep** | |
|---|---|---|---|
| Simply supported, 6.00 m — every earlier figure in this project | 16.4 mm | **27.3 mm** | **14% over**, L/220 |
| Simply supported on the true bearing centres, 5.85 m | 14.8 mm | **24.6 mm** | 2.5% over |
| **Propped by the knee braces — 5.06 m span, 0.47 m overhangs** | 7.9 mm | **13.2 mm** | **factor 1.8** ✓ |

The method reproduces the model's own 22.8 mm at 576 mm exactly, so the load basis is
sound. What it says is that **the answer depends entirely on whether the knee braces
count.** Unpropped it fails; propped it passes with real margin; and the two bounds
straddle the limit, which is precisely why the model was conservative before.

### So the knee braces are now primary supports

They prop the tie **395 mm inboard of each bearing** — head at y = ±2.53 m, bearing at
±2.925 — which cuts the span from 6.00 m to **5.06 m**. Deflection goes as span⁴, so
that is worth 44%.

Demand per brace is now **4.07 kN vertical, 5.75 kN axial** at 45°, against the
**0.78 kN of wind** they were designed for. See *Knee braces* below — the detail has
to change.

### The other three jobs, checked

| | at 700 mm | |
|---|---|---|
| Bending | 8.41 MPa unpropped, 5.98 propped, vs 14.8 | factor 1.8 — never the problem |
| Rafter tie, horizontal | 3.80 kN per tie end vs 11.8 kN of bracket | factor 3.1, was 3.8 |
| Strut bearing on the tie | 0.93 MPa vs fc,90,d 1.73 | unchanged — 8 struts per side either way |
| **Plate splices (F16a)** | nearest tie to any splice **150 mm** | **resolved** — was 72 mm, and 600 mm centres would have made it 50 |

### And two things that got worse

**Deck goes to 22 mm OSB, not 18.** 18 mm OSB/3 is rated to 600 mm *centres*; at 700
it is off the span tables. The 40 mm boarding already in the model carries 600 clear
easily (0.10 mm) and is the alternative.

**1200 mm sheet no longer lands on a tie.** 1200 is not a multiple of 700, so a sheet
edge meets a tie only every sixth bay. Cut edges falling between ties need noggins.
The insulation module won this argument over the sheet module — that is a real
trade, not a free win.

## Purlin X-bracing — buildability first, F19 second

**Owner 2026-08-21.** Each purlin frame is triangulated **across** the building —
strut plus vertical make a triangle, the collar ties the two sides. **Along** the
building there is nothing: eight frames joined only by two 50 × 250 purlins is a
pinned parallelogram. It stands up and then leans over, and the rafters that would
eventually stop it cannot go on until the purlins are already up.

So this bracing was always going to exist. The only question was whether it was scrap
that gets binned or a permanent member — and it is free either way.

| | |
|---|---|
| 7 bays per slope, frames 1.40 m apart, verticals 1.815 m | diagonal **2.29 m at 52.4°** |
| Panel force, half the 12.9 kN gable triangle per purlin line | 6.45 kN |
| Diagonal axial | **10.6 kN** |
| As **compression**, 50 × 100, λ 159, kc 0.128 | 9.3 kN — **factor 0.88, fails** |
| As **tension**, net section 80% | 38.8 kN — **factor 3.7** ✓ |
| Verticals, promoted from 0.06 kN | 8.4 kN — factor 1.74 |
| Purlin as top chord | 0.52 MPa — nothing |
| Material, 28 diagonals | **64.2 m of 50 × 100 — free off the rafter rip** |

**Tension-only.** Fit both diagonals of every X; whichever is in tension does the work
and the other goes slack and buckles harmlessly. **The connection is the design** —
tension bracing has no bearing to fall back on: about **8 × 6×120 per end**, ~450 screws
in total, and that is the real cost.

**It has to discharge.** End frames sit at x = ±4.60 against the gable walls at ±4.65,
so the end panels land on the gables — but that connection has to be as real as the
rest. Below, the X dumps into the ties, the ties into the wind girder (factor 10.3),
the girder into the walls.

### Erection — brace each bay before you leave it

1. **Ties bolted down first.** 2 × M14 every end; permanent now, and you stand on them.
2. **Start at a gable.** The end frame is held by the gable wall for free — that is the
   anchor for the whole run.
3. **Stand the next frame and fit its X back immediately.** Never leave a frame standing
   on the purlin alone overnight.
4. **The purlin follows the frames.** A 50 × 250 will not span 10.3 m of air waiting for
   supports.
5. Work in from one gable, or from both ends toward the middle. Until the second bay is
   braced a single braced bay carries everything — fine for erection wind, but do not
   leave it part-braced with weather coming.

### Purlin splice — recut 4.75 + 5.55

The cut list said **6.00 + 4.30**, which puts the joint at x = **+0.85** and the nearest
frame at **+1.00** — a 50 × 250 lap hanging 150 mm off its support.

**4.75 + 5.55 lands it exactly on the frame at −0.40.** Same two boards, both inside 6 m
stock, no extra material; it is only which end you cut from. It is also the *only*
option — for a splice to reach a frame with both pieces under 6 m the frame has to sit
within ±0.85 m of centre, and −0.40 is the only one that does. Both purlin runs splice
there; they are 3 m apart across the building, so the joints are not adjacent.

## Knee braces — now primary supports, not wind braces

30 → **26**, 50 × 100, 453 mm, 45°. Same timber, same count per tie. What changes is
the **joint**.

**Bear the brace. Do not screw it.**

Cut the brace head to a flat level face so it bears directly up against the tie
underside. 50 × 100 cut square at 45° gives a **7071 mm² bearing face**, and 4.07 kN on
it is **0.58 MPa against fc,90,d 1.73** — factor 3.0. Locate it sideways with a shallow
**10 mm** housing or a cleat each side. Screws then do one job: stop it falling out.
Same at the foot on the post top.

This is the principle the purlin/post joint already follows: **cut the compression
member, not the bending one.**

**Do not house it 25 mm into the tie.** A rebate on the *underside* of a beam at a
support is the one case EN 1995 6.5.2 singles out — the re-entrant corner starts a
shear crack along the grain and it runs, and the prop point is exactly where shear
peaks. 10 mm to locate is not a structural notch. Deeper than that, radius the internal
corner to 8–10 mm and never square it.

**Why screws cannot do it.** 4 × 6×100 connector screws give about **5.6 kN against a
5.75 kN demand** — at capacity, nothing spare, on a joint designed with a factor of 7
against a load 5× smaller. Worse, the pair of joints is only about 2.2 kN/mm in slip,
soft enough to hand several millimetres of the deflection benefit straight back.
Bearing on wood does not slip.

**The thrust is contained.** Each brace pushes the wall top outward by 4.07 kN, and the
two braces on a tie push against each other — the tie picks up 4.07 kN of axial
compression between the heads. Euler on the weak axis over 5.06 m is 88 kN, factor 22,
and it partly cancels the 2.38 kN of rafter-thrust tension already there. Nothing to do,
but know it is there before anyone leaves a brace out.

**Battens at 300 mm.** Suits tile-profile metal, and the grid ties all 30 rafters
together every 300 mm up the slope — lateral restraint that partly covers what the
deleted roof-plane braces would have done (F19). The battens are nowhere near
working: 1.95 MPa over the 700 mm rafter gap, against 16.6.

**A 6 m batten is 8 bays at 700 mm.** Batten joints land on a rafter line, so every
piece has to be a whole number of bays: 8 × 700 = 5.60 m used, 400 mm binned — **6.7%
waste**, worse than the 4% at 576 and much worse than the zero at 600. 433 m of batten
is **78 boards**. Buying the insulation fit costs a little here.

**Counter-battens are not optional** if the workshop is heated or used wet — they
create the ventilated cavity that stops condensation dripping off the underside of
the sheeting. See F21.

## Notes

- **All lengths assume 6 m stock.** At 4 m the 100 × 100 count goes to 30, at 3 m to 33,
  and the 5.52 m girder pieces no longer fit at all — every one would need an extra
  splice. Confirm 100 × 100 comes in 6 m before ordering.
- The 13 ties come out of the 16 owned 100 × 250 with **three spare**. At 576 mm it was
  16 of 16, exactly, with nothing to cover a bad board.
- Wind girder: 100 × 100, each 7.33 m diagonal spliced 6.00 + 1.33 so the joint lands
  on a tie crossing. 4 diagonals.
- Both rips throw off 50 × 100: the levelling course 36 m, the rafters 252 m. Total
  228 m against a 128.9 m demand (verticals, collars, spacers, blocking, knee
  braces). 99 m spare. The levelling course is bought as 50 × 150 now, so it no
  longer throws off byproduct — that is why this is 228 and not 288.
- Rafters need the straightest stock. Sort before cutting.
- Nest the short items longest-first. The board counts above assume it: 0.6% waste on
  50 × 250 and 11.8% on 100 × 100. Cutting ad hoc costs 3–4 more boards.
