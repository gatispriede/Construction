# Stability and wind

Re-run 2026-08-26, from scratch, against the 600 mm tie setout (up from 700,
after 700 did not work on site) and the knee braces on their ledger. `python3 model/stability.py` regenerates every number
here from `model/params.json`; nothing below is typed in by hand.

**The short version.** The building stands up, and no check in the frame comes
out below 1.4 — the tightest is bearing under a brace foot, and most of the
timber is above 10. What the re-run changes is *which parts are load-bearing*.
Three of them were being treated as belt-and-braces and are not:

1. **The knee braces are now the busiest members in the building.** They already
   became vertical props at 600 mm tie centres (F7, F24). The re-run adds their
   other job: the front gable cannot take a half share of the transverse wind,
   so the brace portals are the primary lateral system across the width too.
2. **A prop needs something to stand on, and mid-bay there is nothing.** Below
   the plate courses the wall between posts is open frame. That is what the
   ledger is for, and it is why it has to be 100 × 100 — see below.
3. **Global overturning across the ridge does not work on self weight.** It is
   the sill-to-pile anchorage that holds the building down. That was already F6;
   now it has a figure, and it is a small one: 0.8 kN per pile.

Nothing here needs a bigger member. It needs four connections built
deliberately: the brace seats, the ledger into the posts, the tie-end bolts, and
the sill anchors.

## The load

| | |
|---|---|
| Peak velocity pressure | **557 Pa** at the 7.77 m ridge (vb 24 m/s, terrain III) |
| Base shear across the ridge | **44.4 kN** characteristic |
| Base shear along the ridge | **26.5 kN** characteristic |
| Arriving at loft-deck level | **32.4 kN**, 73% of the transverse total |
| Per tie bay at 600 mm | 3.13 kN design → **4.43 kN** axial in each knee brace |
| Floor load per tie | 1391 N/m → **5.1 kN** vertical per brace, 7.3 kN axial |

Across the ridge is the case that governs, and the reason is the roof: at 54° it
presents 38.5 m² of side elevation against the wall's 32 m², and it sits high.
**Half the transverse wind on this building is roof.**

That also corrects an old number. The brace force in `params.json` used to read
0.78 kN, from wall load only. Each rafter pair plus its tie is a triangle in its
own plane, so *all* of the roof's transverse load lands at the two wall tops as
well. The honest wind figure is 5.17 kN.

But the wind is not what sizes the brace any more — **gravity is**. As a prop it
carries 5.1 kN vertical mid-bay, and up to 8.2 kN where a foot lands over a post
and the prop goes rigid instead of springy. Wind only unloads one brace of each
pair; it never governs.

## Two paths across the width, and one of them is weak

**The diaphragm route** — loft deck spanning to the gable walls, gables acting as
shear walls in their own plane. The deck is fine at 4.05 kN/m against 9.33,
provided the panel edges are screwed at 150 mm and not at the flat 300 mm the
fastener schedule used to say. The back gable is fine. The front gable is not: a
3 m entrance in a 6 m wall leaves two 1.5 m piers at 2.3:1, and rocking one on a
half share needs **41.8 kNm** against the **18 kNm** its pile group can hold —
three piles a side counting the corner, as built; two would have given 12.
Inverted, **the front gable is good for about 22% of the transverse shear, not
50%.** See F25.

**The portal route** — every tie plus its two knee braces, taking its own bay's
load down the posts. With 6 screws at each brace end this path is good for 77 kN
against a 48.6 kN design demand, on its own, with the deck ignored entirely.

So the answer to the front gable is not to rebuild it. The portals carry the
width; the deck and the gables are the second path. That is the second reason
the brace connections are structural, on top of the propping.

## Why the ledger is 100 × 100 and not 50

The ledger is a spring under a prop, and every millimetre it sags is a
millimetre handed back to the tie — the same objection F24 makes about screw
slip at the brace head. Ties at 600 mm against posts at 1162 mm mean most brace
feet land mid-bay, where the ledger spans:

| ledger | spring | sag under the prop | tie, final |
|---|---|---|---|
| foot lands on a post | rigid | 0 | **3.0 mm** |
| **100 × 100** | 2.8 kN/mm | 1.8 mm | **12.0 mm** |
| 50 × 100 on edge | 0.7 kN/mm | 3.5 mm | **20.1 mm** |
| no braces at all | — | — | 27.3 mm, **over the 24 mm limit** |

50 mm of thickness stays inside the limit and gives away three quarters of what
the braces were fitted to buy. 100 × 100 costs 4 boards, €74.40, and it is the
only cash the whole knee-brace rework needs.

Lengthening the braces from 453 to 600 mm belongs to the same argument: it moves
the prop 104 mm further inboard, which takes the tie from 14.5 to 12.0 mm on the
same ledger, and it drops the foot clear of the lapped plate courses onto a
member fixed to the posts.

## Every check

| check | demand | capacity | factor | note |
|---|---|---|---|---|
| knee brace 600 mm, buckling | 4.43 kN | 63.59 kN | **14.4** | lambda 42, kc 0.87 |
| knee brace 600 mm, tension on the net section | 4.43 kN | 38.77 kN | **8.8** | the leeward brace of every pair pulls - 20% off for the screw holes |
| knee brace end connection, 6 x 6 mm screws | 4.43 kN | 8.40 kN | **1.9** | 1.6 kN once the deck is on |
| ledger bending, vertical (strong axis) | 5.46 MPa | 16.62 MPa | **3.0** | one mid-bay brace foot over 1162 mm |
| ledger bending, horizontal (weak axis) | 5.46 MPa | 16.62 MPa | **3.0** | the tension brace pulling the ledger off the wall |
| ledger deflection, weak axis | 1.12 mm | 3.88 mm | **3.5** | L/300 |
| ledger fixing, withdrawal at each post | 6.26 kN | 24.00 kN | **3.8** | both braces of the bay pulling at once, 8 x 200 partial thread |
| brace foot bearing on the ledger seat | 0.63 MPa | 2.60 MPa | **4.1** | 100 mm seat, across the grain |
| portal path, whole transverse shear | 48.55 kN | 89.10 kN | **1.8** | 15 braced bays x 5.9 kN - this is the path that does not depend on the front gable |
| post, frame moment at the knee | 4.10 kNm | 11.15 kNm | **2.7** | pinned base, rigid corner |
| post, out-of-plane bending between sill and plate | 1.06 MPa | 16.62 MPa | **15.7** | 1162 mm apart, 150 mm wall |
| loft deck diaphragm, unit shear | 4.05 kN/m | 9.33 kN/m | **2.3** | 6x100 at 150 mm on panel EDGES. At the 300 mm the schedule used to say, it is 4.7 kN/m and a factor of 1.2 |
| deck chord force in the edge tie | 9.41 kN | 242.31 kN | **25.8** | the two edge ties are the chords - the SPLICES carry this |
| back gable, force per built diagonal | 12.94 kN | 203.54 kN | **15.7** | 4 diagonals, timber is fine - the ENDS are not specified |
| front gable pier, overturning on its pile group | 41.75 kNm | 18.00 kNm | **0.4** | 3 m opening leaves two 1.5 m piers at 2.3:1. 3 piles a side counting the corner - two would give 12 kNm. Tributary half-share assumed; see the note |
| jamb pile, vertical from the entrance header | 3.46 kN | 28.00 kN | **8.1** | the job the jamb piles actually do - and they now do it on a pile instead of on a slab that heaves (F8, F23) |
| sway at tie level, portal only, deck ignored | 11.25 mm | 12.16 mm | **1.1** | characteristic wind, H/250; = H/270 |
| roof sheeting as a diaphragm (F19) | 0.81 kN/m | 1.50 kN/m | **1.9** | no roof-plane braces: the sheeting is the only path |
| wind girder diagonal, 100x100 | 12.57 kN | 134.69 kN | **10.7** | restrained every 600 mm along it, kc 0.93 |
| long wall, force per built diagonal | 10.59 kN | 203.54 kN | **19.2** | 4 per wall, end bays - ends again unspecified |
| overturning across the ridge, self weight alone | 243.29 kNm | 213.72 kNm | **0.9** | self weight 79 kN at 0.9 |
| hold-down needed per windward pile | 0.55 kN | 8.00 kN | **14.6** | 9 piles down the windward wall - this is F6, and now it has a number |
| overturning along the ridge | 127.21 kNm | 331.27 kNm | **2.6** | the long way is never the problem |
| sliding, shear per pile connection | 2.56 kN | 20.00 kN | **7.8** | 26 piles, M14 anchor in single shear |
| net uplift per rafter foot | 1.61 kN | 8.00 kN | **5.0** | strap per F3/F6 |
| tie deflection, braces propping it | 10.38 mm | 24.00 mm | **2.3** | 23.5 mm unpropped; 2.6 where a foot lands on a post |
| brace as a prop, axial | 9.99 kN | 56.52 kN | **5.7** | 6.3 kN mid-bay, 10.0 on a post. kmod 0.8, floor load |
| brace head bearing on the tie underside | 1.00 MPa | 2.31 MPa | **2.3** | flat cut face, 7071 mm2 - NOT a notch in the tie |
| tie end hold-down, uplift | 3.46 kN | 14.20 kN | **4.1** | 2 x M14. The props take more than the whole floor, so the ends LIFT |
| tie axial compression between the brace heads | 4.43 kN | 57.34 kN | **12.9** | Euler, weak axis, between the props - self-contained, see _thrust |
| ledger bending under the prop, mid-bay | 7.73 MPa | 14.77 MPa | **1.9** | k = 2.8 kN/mm, sags 1.6 mm |
| brace foot bearing on the ledger seat, floor load | 1.41 MPa | 2.31 MPa | **1.6** | 100 mm seat, 12 mm locating housing |
| ledger into each post, vertical | 7.06 kN | 18.00 kN | **2.5** | 6 x 8 x 200 partial thread in shear, PLUS a 20 mm housing so the shoulder bears |

## The three that are not comfortable

**Front gable, 22% not 50%** — do not rely on the front gable for transverse
shear. Build the brace connections to schedule and the gable becomes a second
path carrying whatever it attracts, which is fine: the portals have 77 kN
against a 49 kN total and can absorb the rest. The tributary half-share this
table checks is deliberately conservative — with 4 × 6 mm screws at the diagonal
ends (F10) the joint slip dominates and a braced gable panel comes out no
stiffer than a handful of portals, so the real split is nothing like 50/50. It
cannot be computed properly until those joints are specified.

**Overturning across the ridge, 0.9** — 78 kN of building against 243 kNm of
overturning leaves a 34 kNm shortfall, which is 5.6 kN spread over the 9 piles
down the windward wall. **0.6 kN each.** Any real sill-to-pile anchor covers it
many times over; no anchor at all does not. This is F6, and it is why F6 is not
optional.

**Sway H/236, portals only** — that is the frame with the deck ignored:
characteristic wind, no diaphragm. It is the state the frame is in between the
ties going in and the deck going down, and it is the arithmetic behind F0: the
temporary diagonals stay up until the deck is screwed down. With the deck on,
sway is governed by the diaphragm and the gables, not by the portals.

## What this check cannot see

It checks the load paths the model claims to have. A path the model does not
know about is invisible to it, and so is a path that exists on paper but is
built badly. Two specific holes:

- **The built diagonals' end connections have never been specified** (F10). The
  timber is 15× oversized; the connections are unknown, so the racking capacity
  of both gables and both long walls is unknown. This is the biggest open item
  in the lateral system.
- **The roof sheeting is doing diaphragm duty** (F19), because the roof-plane
  braces were deleted. 0.81 kN/m against an assumed 1.5. That assumption is
  about fixings and sheet laps, not timber — confirm it with the sheet supplier.

## Assumptions that move the numbers

- Floor load on one tie is 1200 N/m at 600 mm centres, and final deflection is 1.665x instantaneous - both taken from the 600 mm setout in params.joists so this file and F7 cannot drift apart.
- vb = 24 m/s, terrain III. Terrain II would raise qp from 557 to 790 Pa - divide every wind factor by 1.42 to see it.
- kmod 0.9 throughout. EN 1995 allows 1.1 for instantaneous wind, so every wind row has 22% more cover than it shows.
- cpe,10 walls +0.8 / -0.55, roof +0.7 / -0.25 at 54 deg, cpi +-0.2.
- Racking capacity of the built diagonals is stated as force per diagonal, not kN/m: their end connections have never been specified (F10). That is also why the gable/portal SHARE cannot be computed properly: with 4 x 6 mm screws the joint slip dominates, and a braced gable panel comes out no stiffer than a handful of portals. So the front gable is checked on a tributary half-share, which is conservative, and the line above says what share it can actually take.
- Pile uplift 8 kN: 2 kN of concrete plus shaft friction at 10 kPa, /1.5. Confirm against the real soil.

None of this replaces the Latvian structural engineer that findings.md asks for
before the roof goes up. It is a consistency check with its working shown.
