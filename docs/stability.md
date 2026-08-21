# Stability and wind

Re-run 2026-08-21, from scratch, after the knee braces went to 600 mm on a
continuous ledger. `python3 model/stability.py` regenerates every number here
from `model/params.json`; nothing below is typed in by hand.

**The short version.** The building stands up, and the timber is nowhere near
its limits — no member in the frame is below a factor of 2.9, and most are
above 10. What the
re-run changes is *which* things are load-bearing. Two of them were being
treated as belt-and-braces and are not:

1. **The knee-brace portals are a primary system, not a nicety.** The front
   gable cannot take a half share of the transverse wind — see below — so the
   portals have to, and that means every brace end connection is a structural
   connection with a number on it. Six screws, not four.
2. **Global overturning across the ridge does not work on self weight.** It is
   the sill-to-pile anchorage that holds the building down. That was already
   F6; now it has a figure, and it is a small one: 0.7 kN per pile.

Nothing here needs a bigger member anywhere. It needs three connections built
deliberately.

## The load

| | |
|---|---|
| Peak velocity pressure | **557 Pa** at the 7.77 m ridge (vb 24 m/s, terrain III) |
| Base shear across the ridge | **44.4 kN** characteristic |
| Base shear along the ridge | **26.5 kN** characteristic |
| Arriving at loft-deck level | **32.4 kN**, 73% of the transverse total |
| Per tie bay at 576 mm | 3.00 kN design → **4.25 kN** axial in each knee brace |

Across the ridge is the case that governs everything, and the reason is the
roof: at 54° it presents 38.5 m² of side elevation against the wall's 32 m²,
and it sits high. **Half the transverse wind on this building is roof.**

That also corrects an old number. The brace force in `params.json` used to read
0.78 kN, from wall load only. Each rafter pair plus its tie is a triangle in
its own plane, so *all* of the roof's transverse load lands at the two wall
tops as well. The honest figure is 4.25 kN — 5.4 times larger, and it is what
turns "4 screws will do" into "use 6".

## Two paths across the width, and one of them is weak

Wind across the ridge has to get from the wall tops down to the piles. There
are two routes and they work in parallel:

**The diaphragm route** — loft deck spanning 9.31 m to the gable walls, gables
acting as shear walls in their own plane. The deck is fine — 4.05 kN/m against
9.33, **provided the panel edges are screwed at 150 mm and not at the flat
300 mm the fastener schedule used to say**, which would leave it at 1.2 — and
the back gable is fine.
The front gable is not: a 3 m entrance in a 6 m wall leaves two 1.5 m piers at
2.3:1, and a half share of the shear needs **27.9 kN of hold-down at each
opening jamb** against about 16 kN of pile. Factor 0.6. See F25.

**The portal route** — every tie plus its two knee braces, taking its own bay's
load straight down the posts. With 6 screws at each brace end this path is good
for 95 kN against a 48.6 kN design demand, on its own, with the deck ignored
entirely. Factor 2.0.

So the answer to the front gable is not to rebuild it. It is that the portals
carry the width, the deck and the gables are the second path, and the front
gable can be as weak as it likes as long as the knee braces are built properly.
That is the whole argument for the ledger.

## Every check

| check | demand | capacity | factor | note |
|---|---|---|---|---|
| knee brace 600 mm, buckling | 4.25 kN | 63.59 kN | **15.0** | lambda 42, kc 0.87 |
| knee brace 600 mm, tension on the net section | 4.25 kN | 38.77 kN | **9.1** | the leeward brace of every pair pulls - 20% off for the screw holes |
| knee brace end connection, 6 x 6 mm screws | 4.25 kN | 8.40 kN | **2.0** | 1.6 kN once the deck is on |
| ledger bending, vertical (strong axis) | 5.25 MPa | 16.62 MPa | **3.2** | one mid-bay brace foot over 1164 mm |
| ledger bending, horizontal (weak axis) | 5.25 MPa | 16.62 MPa | **3.2** | the tension brace pulling the ledger off the wall |
| ledger deflection, weak axis | 1.08 mm | 3.88 mm | **3.6** | L/300 |
| ledger fixing, withdrawal at each post | 6.01 kN | 12.00 kN | **2.0** | both braces of the bay pulling at once, 8 x 200 partial thread |
| brace foot bearing on the ledger seat | 0.60 MPa | 2.60 MPa | **4.3** | 100 mm seat, across the grain |
| portal path, whole transverse shear | 48.60 kN | 95.04 kN | **2.0** | 16 braced bays x 5.9 kN - this is the path that does not depend on the front gable |
| post, frame moment at the knee | 3.90 kNm | 11.15 kNm | **2.9** | pinned base, rigid corner |
| post, out-of-plane bending between sill and plate | 1.06 MPa | 16.62 MPa | **15.7** | 1164 mm apart, 150 mm wall |
| loft deck diaphragm, unit shear | 4.05 kN/m | 9.33 kN/m | **2.3** | 6x100 at 150 mm on panel EDGES. At the 300 mm the schedule used to say, it is 4.7 kN/m and a factor of 1.2 |
| deck chord force in the edge tie | 9.43 kN | 242.31 kN | **25.7** | the two edge ties are the chords - the SPLICES carry this |
| back gable, force per built diagonal | 12.95 kN | 203.54 kN | **15.7** | 4 diagonals, timber is fine - the ENDS are not specified |
| front gable pier, hold-down at the opening jamb | 27.86 kN | 16.00 kN | **0.6** | 3 m opening leaves two 1.5 m piers, 2.3:1 - this is why the portal path matters |
| sway at tie level, portal only, deck ignored | 10.54 mm | 12.08 mm | **1.1** | characteristic wind, H/250; = H/286 |
| roof sheeting as a diaphragm (F19) | 0.81 kN/m | 1.50 kN/m | **1.9** | no roof-plane braces: the sheeting is the only path |
| wind girder diagonal, 100x100 | 12.57 kN | 135.83 kN | **10.8** | restrained every 576 mm along it, kc 0.93 |
| long wall, force per built diagonal | 10.59 kN | 203.54 kN | **19.2** | 4 per wall, end bays - ends again unspecified |
| overturning across the ridge, self weight alone | 243.55 kNm | 207.77 kNm | **0.9** | self weight 77 kN at 0.9 |
| hold-down needed per windward pile | 0.66 kN | 8.00 kN | **12.1** | 9 piles down the windward wall - this is F6, and now it has a number |
| overturning along the ridge | 127.21 kNm | 322.38 kNm | **2.5** | the long way is never the problem |
| sliding, shear per pile connection | 2.56 kN | 20.00 kN | **7.8** | 26 piles, M14 anchor in single shear |
| net uplift per rafter foot | 1.55 kN | 8.00 kN | **5.2** | strap per F3/F6 |

## What to do about the three that are not comfortable

**Front gable hold-down, 0.6** — do not rely on the front gable for transverse
shear. Build the knee braces to the schedule above and it is a second path
carrying whatever it happens to attract. If you want it to count, the fix is
two more piles under the entrance jambs with an anchor into each — which F23
already asks for, for a different reason.

**Overturning across the ridge, 0.9** — 77 kN of building against 244 kNm of
overturning is a 36 kNm shortfall, which is 5.9 kN spread over the 9 piles down
the windward wall. **0.7 kN each.** Any real sill-to-pile anchor covers it many
times over; no anchor at all does not. This is F6, and it is the reason F6 is
not optional.

**Sway, H/286** — that is the frame with the deck ignored: characteristic wind,
portals alone. It passes H/250 and the deck stiffens it further. Worth knowing
because it is the state the frame is in between the ties going in and the deck
going down, which is exactly when the temporary diagonals must not come out
(F0). Lengthening the braces from 453 to 600 mm improved this from H/255 to
H/286 — the brace foot drops 104 mm, so the effective post height drops with it.

## What this check cannot see

It checks the load paths the model claims to have. A path the model does not
know about is invisible to it, and so is a path that exists on paper but is
built badly. Two specific holes:

- **The built diagonals' end connections have never been specified** (F10). The
  timber is 15× oversized; the connections are unknown, so the racking capacity
  of both gables and both long walls is unknown. This is the single biggest
  open item in the lateral system.
- **The roof sheeting is doing diaphragm duty** (F19), because the roof-plane
  braces were deleted. 0.81 kN/m against an assumed 1.5. That assumption is
  about fixings and sheet laps, not timber, and it is worth confirming with the
  sheet supplier.

## Assumptions that move the numbers

- vb = 24 m/s, **terrain III**. Terrain II would raise qp from 557 to 790 Pa —
  divide every wind factor by 1.42 to see it. At that pressure the front gable
  and the overturning rows get worse, and the brace connection lands at 1.4.
- **kmod 0.9 throughout**, including the pure wind cases where EN 1995 allows
  1.1 for instantaneous load. Every wind row has 22% more cover than it shows.
- cpe,10 walls +0.8 / −0.55, roof +0.7 / −0.25 at 54°, cpi ±0.2.
- Pile uplift 8 kN: 2 kN of concrete plus shaft friction at a deliberately low
  10 kPa, ÷1.5. Confirm against the real soil.
- C24, service class 2, γM 1.3. Screw values are the ones already quoted in
  `params.json`, so this file cannot silently disagree with the drawings.

None of this replaces the Latvian structural engineer that findings.md asks for
before the roof goes up. It is a consistency check with its working shown.
