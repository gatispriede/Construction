# Findings

Dārza iela 10, Sigulda · timber post-frame *mazēka* · frame observed 2026-08-14,
roof design as described by the owner

Numbers come from [assumptions.md](assumptions.md). Anything resting on a
photo-read dimension says so.

The frame is good work — sound joinery, bracing that has been thought about,
decent timber. Almost everything below is about what is *under* it and what is
about to go *on top* of it.

---

## Decision on record

**2026-08-14 — the foundation stays as built.** Brick piers, dry-laid on grade.
Underpinning a standing frame was judged not realistic, and the shallow
alternatives were declined. That is the owner's call and it is not revisited
below.

What it means, stated once: bearing is **192 kPa** on ground good for 50–75, so
differential settlement will continue, and the piers sit in frost-susceptible
soil so they will heave differentially each winter. Neither is sudden. Both are
slow and cumulative.

**So the design stance changes from preventing movement to tolerating it:**

- **A timber frame is the right structure for this.** Pegged and bolted timber
  accommodates differential movement that would crack masonry. You already have
  the forgiving option.
- **Keep every pier accessible and shimmable.** Do not bury them, do not pour a
  skirt against them, do not plant against them. The maintenance action is
  jacking a bay a few millimetres and adding a shim — make that possible.
- **Check the frame for level each spring**, after the ground has thawed and
  before the summer. Log it. A pier that moves 5 mm a year is maintenance; one
  that moves 25 mm is telling you something.
- **Skip the lime plaster** the first permit description mentions. Rigid render
  on a moving frame cracks. The second description already specifies decorative
  boarding — use that. Boards move with the frame and can be refixed.
- **Do not pour a concrete floor slab tied to the frame.** A slab bearing on
  the ground while the frame moves independently will fight the sill. If you
  want a solid floor, keep it structurally separate.
- **Bolted connections, not glued or rigid.** Everything recommended below is
  bolted or strapped precisely so it can be adjusted later. That was already
  the recommendation; it matters more now.
- **The loft deck earns extra keep.** A stiff diaphragm at tie level spreads
  differential settlement across the whole frame instead of letting one bay
  rack on its own.

The one ground-level item still worth doing, because it is drainage and
clearance rather than foundation work: **F5**. Getting water away from the sill
slows settlement and heave both, and costs a day with a shovel.

## Critical

### F1 (superseded — see the decision above)

**Approved:** *Pamati: Betona konstrukcija ar metāla armējumu* — reinforced
concrete, plus a concrete floor.

**Built:** clay bricks, dry-laid, one to three courses, directly on grass.

Estimated bearing: **~157 kPa**. Topsoil carries 50–75 kPa, and only while it
keeps consolidating. You are roughly **twice** over.

That uses ~245 kN completed weight over ~25 piers at 250 × 250 mm — pier size
and spacing are photo-read. Bigger or closer piers improve it, but not by the
factor of two you would need.

**What happens:** progressive differential settlement. Not collapse — a slow
rack. Doors stop closing, the frame goes out of square, the roof plane twists,
tight joints open.

**Fix.** The approved solution is already permitted and is the right one.
Reinforced concrete pads below frost depth, one under each frame post rather
than at arbitrary 1.2 m spacing. Far easier now, with no roof and no floor, than
at any later point.

### F2 — Piers bear above frost depth

Frost penetration around Sigulda is roughly **1.2 m**. These bear at grade, in
the most frost-susceptible material on site.

- **Heave.** Each pier lifts a different amount each winter depending on local
  moisture, and does not come back down evenly.
- **The brick.** Ordinary clay brick is not frost-resistant when saturated, and
  these wick straight from soil. Freeze–thaw spalls them, and a spalled pier
  under a loaded sill is a settlement event.

**Fix.** Same excavation as F1. Bear below 1.2 m on compacted granular fill.

### F3 — The 50 mm rafter seat cannot hold the thrust

At 54°, each rafter pushes **1.00 kN outward** at the wall.

A flat 50 mm seat gives about **0.48 kN** of friction. Roughly **half** what is
needed. The same applies at the purlin.

Crushing is not the problem — bearing stress is 0.46 MPa against about 2.5 MPa
capacity, comfortable. **Sliding is the problem.** The rafter foot has nothing
stopping it walking outward except friction, and friction is short by 2×.
Across 19 rafters that is **19 kN of outward push per long wall**, applied at
the top of a frame standing on loose bricks.

**Fix — the seat detail, in order of importance:**

1. **Cut a birdsmouth.** The rafter must seat against a *vertical* face, not
   just down onto a flat one. That converts thrust from friction into bearing
   and is the single thing that makes this safe. Cut depth no more than 1/3 of
   the rafter depth — on a 200 mm rafter that is 65 mm maximum, leaving 135 mm
   of section over the plate. Seat length 90–100 mm, not 50.
2. **A strap or framing angle at every rafter.** Hot-dip galvanised, minimum
   Z275 coating — this is an unheated building in a Baltic winter, so plain zinc
   plate will not last. Fix with square-twist or ring-shank nails, not screws:
   screws are brittle in shear and this is a shear connection. This also does
   the uplift job in F6.
3. **A bearing packer that tolerates movement.** The plate is old hewn timber
   and will move seasonally. Bed the rafter on a strip of EPDM or bitumen
   membrane rather than timber-on-timber — it takes up the irregularity in a
   hewn surface, stops point-loading on a high spot, and prevents the two faces
   trapping water against each other. Do **not** pack with steel shims or
   mortar: both are harder than the timber and will crush into it.
4. **Same at the purlin.** 50 mm is not enough there either. Notch the rafter
   over the purlin and strap it.

Do not rely on the tie beams alone to absorb this. They only work as ties if
every rafter foot is positively connected to something the ties reach — and at
0.6 m rafter spacing against ties on the posts, most rafters have no tie
directly beneath them. The plate has to distribute, which it can, but only if
the feet are fixed rather than resting.

### F4 — Purlin posts must not land on the tie beams. Use struts.

You want to avoid buying new cross beams and stand the purlin supports on the
tie beams that are already there. That works — but only if the support is a
**strut down to the wall plate**, not a vertical post onto the tie.

With struts at every tie beam, purlin reaction 3.58 kN each:

| | |
|---|---|
| Strut axial force | 4.42 kN → **0.44 MPa** in a 100 × 100. Nothing. |
| Horizontal kick into the tie | 2.60 kN tension → **0.10 MPa**. Negligible. |
| Tie beam then carries | floor only |

**Vertical posts onto the tie instead:**

| Tie beam load case | Deflection | Limit |
|---|---|---|
| Purlin posts + ceiling | 26 mm | 20 mm — fails |
| Purlin posts + loft storage | 37 mm | 20 mm — fails badly |

Bending survives either way (9–13 MPa against 14.8). It is **deflection** that
kills it: a post puts the whole roof reaction into the middle of a beam that is
already near its limit carrying the floor.

The strut is short timber — 2.55 m, offcut territory — and it lands directly
over the wall, so the load goes straight down the posts to the piers. It is
both the cheapest and by far the strongest option.

**But it moves the problem into a connection.** A strut in compression pushes
its base down *and outward*. Per tie beam that is 2.60 kN from the strut plus
about 2.09 kN of rafter thrust (roughly 2.15 rafters land per tie at 0.6 m
against 1.29 m) — call it **4.7 kN of outward push at each wall, per tie**.

The tie beam resists that in tension easily (0.19 MPa in a 100 × 250). The
question is whether it is *connected* well enough to do so. A 100 mm wide beam
simply resting on the plate transfers nothing. Each tie needs a positive fixing
into the plate — a housed joint, a bolt, or a strap — or the struts will
gradually push the tops of the walls apart. That is the same connection that
does the uplift job in F6, so do them together.

**One thing the struts do not fix:** with ties at ~1.29 m spacing rather than
0.8 m, a 100 × 250 tie carrying a real loft floor is at **L/263** (1.5 kPa) or
**L/197** (2.0 kPa) — past the L/300 you want for a floor. Fine as a ceiling
(L/526). If you intend to store weight up there, either accept a visible ~23 mm
sag, or put a beam down the spine, or deepen the ties to 300 mm.

### F4b — If you ever do add cross beams, size them properly

Two purlin posts landing on a beam that spans the full 6 m width, simply
supported on the walls, at ±1.5 m:

| Cross-frame spacing | Load per post | Moment | 50 × 250 | 100 × 250 | 100 × 300 |
|---|---|---|---|---|---|
| 2.0 m | 5.5 kN | 8.3 kNm | 16 MPa, 48 mm | 8 MPa, 24 mm | 5.5 MPa, 14 mm |
| 3.0 m | 8.3 kN | 12.5 kNm | 24 MPa, 72 mm | 12 MPa, 36 mm | 8.3 MPa, 21 mm |
| 4.5 m | 12.5 kN | 18.7 kNm | 36 MPa, 108 mm | 18 MPa, 54 mm | 12.5 MPa, 31 mm |

Bending capacity is about 14.8 MPa and the deflection limit about 24 mm.
**50 × 250 fails in every case.** At 3 m spacing you need 100 × 300 minimum.

**The better fix costs almost nothing.** Add a **strut from each purlin down to
the wall plate**, at roughly the same 54°. The purlin load then travels axially
into the wall instead of bending the cross beam:

- strut force ~10.3 kN axial — trivial for any reasonable section
- cross beam becomes a **tie in tension**, 6.1 kN, which is **0.48 MPa** in a
  50 × 250 against roughly 8 MPa capacity

That is the traditional queen-post-with-struts frame, and it is what the
approved elevation already draws near the apex. Struts turn an impossible beam
into an easy one.

---

## High

### F5 — Sill ~200 mm above grade with vegetation against it

Splash-back and lying snow keep the sill wet for months a year, and there is no
damp-proof course between brick and timber, so the brick wicks straight in.

The sill is the one member you cannot replace without dismantling the building.

**Fix.** 300 mm above finished grade minimum, 450 mm right. Bitumen or EPDM DPC
on every pier. Fall the ground away and keep a gravel margin clear of planting.

### F6 — No uplift load path from rafter to ground

Design wind on the gable is around **32.6 kN**. Once complete, weight and
friction handle global sliding and overturning with margin.

That is not the failure mode. The failure mode is **local uplift at the eaves of
a 54° roof**, and nothing mechanical connects rafter → plate → post → sill →
pier → ground. The building is held down by its own weight.

**Fix.** A continuous strapped load path: anchors at every rafter-to-plate
junction (same operation as F3), and holding-down straps or bolts from sill into
the new concrete. The anchor has to be cast in, so do it with the foundations.

### F7 — Tie beams: resolved by spacing, not by section

The 100 × 250 was never the problem. Over 6 m it runs at **10.0 MPa against a
14.8 capacity** — a factor of 1.5 on strength. It failed on **deflection**.

At the original one-tie-per-post spacing of 1.151 m:

| Load case | Instant | Final, with creep | |
|---|---|---|---|
| Ceiling only, 0.75 kPa | 10.2 mm | 22.6 mm | just inside 24 |
| Loft storage, 2.0 kPa | 27.3 mm | **45.6 mm** — L/132 | fails 24 |

Two things make 6 m hard. Span-to-depth is **24:1**, where a floor wants 16–18:1.
And deflection grows with span to the **fourth power** while bending grows with the
square — so a section that is sensible at 4 m (5.4 mm) is marginal at 6 m (27.3 mm).
Creep at kdef 0.80 then roughly doubles the day-one figure.

Nothing about the section fixes that; 250 mm is already the deepest stock on site.
**Spacing is the only lever**, and it is a direct one — halve the spacing, halve the
load each tie carries, halve the deflection.

**Ties are at 700 mm — 13 of them, not 9.** 700 mm centres on a 100 mm tie is
**600 mm clear**, which is what takes the owner's 600 × 1000 mm insulation packs
uncut. Set out on site and reported 2026-08-21. Superseded 576 mm (an even division)
and a brief 600 mm centres.

**This spacing does not pass on a plain span, and that is the finding.**

| How the tie is modelled | Instant | **Final, with creep** | |
|---|---|---|---|
| Simply supported, 6.00 m — the basis of every earlier figure here | 16.4 mm | **27.3 mm** | **14% over**, L/220 |
| Simply supported on the true bearing centres, 5.85 m | 14.8 mm | **24.6 mm** | 2.5% over |
| **Propped by the knee braces — 5.06 m span** | 7.9 mm | **13.2 mm** | factor 1.8 ✓ |

Limit is L/250 = 24 mm on the full 2.0 kPa workshop floor load. The method reproduces
the model's own 22.8 mm at 576 mm exactly, so the load basis is sound.

**The two bounds straddle the limit.** Unpropped it fails; propped it passes with real
margin. Which one you get is decided by a joint detail — see F24.

Still to watch:

- The tie does **three jobs** — loft floor, rafter tie, eaves cantilever. Bending is
  8.41 MPa against 14.8 unpropped, 5.98 propped: never the problem. The rafter-tie
  horizontal goes 3.13 → 3.80 kN per tie end against 11.8 kN of bracket, factor 3.1.
- **Deck goes to 22 mm OSB.** 18 mm is rated to 600 mm centres, not 700.
- **1200 mm sheet no longer lands on a tie** — 1200 is not a multiple of 700, so a
  sheet edge meets a tie only every sixth bay. Cut edges need noggins.
- **Batten waste goes up**, 4% → 6.7%: a 6 m batten is 8 bays of 700, using 5.60 m.

### F16a — resolved by the 700 mm setout

Two ties used to land within the end distance of a plate splice. At 700 mm centres
they no longer do.

| | 576 mm | 600 mm (considered) | **700 mm (built)** |
|---|---|---|---|
| worst clearance, tie to splice | 72 mm | 50 mm | **150 mm** |

EN 1995 wants 7d = 98 mm for a loaded M14. Splices sit at −0.65 (lower) and −1.65,
+1.35, +3.35 (upper), and are as-built — they do not move. The nearest tie to any of
them is now 150 mm. **Nothing to do.** Strapping the splices is still worth doing for
F16's own reasons, but it is no longer a tie-bolt problem.

### F24 — The knee braces are now primary supports, and the joint is wrong for it

**New 2026-08-21, and it is the open item on the loft floor.**

The 30 → 26 knee braces prop each tie **395 mm inboard of its bearing**, cutting the
span from 6.00 m to 5.06 m. That is the entire difference between a floor at 27.3 mm
and one at 13.2 mm. They are no longer optional.

But they were designed as **wind braces** — 0.78 kN axial, held by 4 × 6×100 connector
screws each end. As props the demand is **4.07 kN vertical, 5.75 kN axial**, against
about **5.6 kN of screw capacity**. At capacity, nothing spare, on a joint that had a
factor of 7. And screw slip — the pair of joints is only ~2.2 kN/mm — hands several
millimetres of the benefit straight back.

**Fix: bear the brace, do not screw it.** Cut the brace head to a flat level face
bearing directly on the tie underside. 50 × 100 cut square at 45° gives 7071 mm²;
4.07 kN on it is **0.58 MPa against fc,90,d 1.73**, factor 3.0. Locate sideways with a
shallow **10 mm** housing or a cleat each side; screws only stop it falling out. Same
at the foot on the post top. Same principle as the purlin/post joint: **cut the
compression member, not the bending one.**

**Do not house it 25 mm into the tie.** A rebate on the underside of a beam at a
support is the case EN 1995 6.5.2 singles out — the re-entrant corner starts a shear
crack and the prop point is where shear peaks.

**The thrust is contained.** Each brace pushes the wall top outward 4.07 kN; the two
braces on a tie push against each other and the tie takes 4.07 kN of axial compression
between the heads. Euler on the weak axis over 5.06 m is 88 kN, factor 22, and it
partly cancels the 2.38 kN of rafter-thrust tension already there.

**Do not deck the loft until the seats are cut.** After the deck goes on, the joint
cannot be inspected or improved.

### F8 — The 3 m entrance removes half the front wall

A 3.0 m opening in a 6.0 m wall leaves two ~1.5 m panels, in the wall that also
carries the gable wind load and has one plate course fewer.

**And there is no foundation at all under the opening** — no sill, no piers
across the 3 m. So right now the two jamb posts are the most heavily loaded
posts in the building and the least supported. That is the single worst
load-path in the frame.

- A header sized for the roof above it, not a nominal lintel.
- Jamb posts carrying the header reaction down to **their own pier**, each one
  a proper concrete pad below frost depth. This is not optional and it is not
  something to leave until the roof is on.
- A threshold that spans the opening, or two independent pads. Do not simply
  run the sill back across — it has nothing to bear on mid-span.
- Racking recovered elsewhere — two 1.5 m panels cannot do what the full wall
  did. Sheathe them or add a designed braced panel.

### F9 — Purlins must bear on the gable walls, not just on the cross frames

The purlin runs the full 11 m, 1 m past each gable. With cross frames only in
the middle of the building, the ends **cantilever 4.0 m to the verge**:

- 20.2 kNm → **38.7 MPa** against a 14.8 MPa capacity
- **113 mm** of droop at the verge

No sensible timber section survives that. The purlin has to be caught at the
gable ends. Two studs off each gable plate, up to the purlin, is all it takes —
and you need those studs anyway to clad the gable.

With gable bearing plus four cross frames at −3, −1, +1, +3 m:

| | |
|---|---|
| Spans | 1.5, 2.0, 2.0, 2.0, 1.5 m + 1.0 m verge cantilever |
| Purlin at max span | 2.4 MPa, 0.7 mm, L/2728 |
| Verge cantilever | 2.4 MPa, 0.4 mm |

That is a very comfortable purlin, and shortening the spans also drops the load
on each cross beam from 8.3 kN to **5.5 kN**, which pulls the cross-beam moment
down to 8.3 kNm — the difference between needing 100 × 300 and getting away
with 100 × 250. See F4.

---

## Medium

### F10 — No permanent racking system

Lateral load currently goes into knee braces and the temporary diagonals. The
paperwork specifies boarding as a *finish*, not a diaphragm, and nothing shows a
permanent racking design. Decide: structural sheathing, let-in bracing, or
designed knee braces every bay — then keep the temporary diagonals up until that
thing exists.

### F11 — Decay and insect damage in salvaged posts

Boring holes and softened surface on several reused timbers, clearest in
`refs/photos/20260814_155102.jpg`. The permit requires treatment against pests
**and fire** (*degšanas aizsardzības līdzekļi*); nothing in the photos suggests
that has happened.

Sound every post with a mallet and probe with an awl before the roof goes on.
Soft more than ~15 mm deep is not carrying its section. Treat while the frame is
open — you will not reach these faces again.

### F12 — Eaves beams cantilever with no hold-down

The stacked pair (lower projecting 0.5 m, upper 1.0 m) carries the overhang
comfortably in bending — about 1.3 MPa. The issue is **net wind uplift at the
tip**, roughly 1.2 kN per beam, and nothing anchoring their inboard ends. A
cantilever with an uplifting tip and an unrestrained tail is a lever.

Strap the inboard end down to the plate, or run the beams far enough in to be
held by the ties.

---

## Low

### F13 — Front wall plate one course lower

3.15 m against 3.30 m. If deliberate, fine. If not, the roof bears 150 mm out of
level and every rafter that side needs a different cut. Confirm before setting
out the roof.

### F14 — Built 9 m long against 10 m approved

54 m² against 60 m². Inside the Group I limit and the setbacks still work — the
least of your problems, but the permit drawings no longer describe the building.

**Height is fine.** With the rafters bearing on the wall plate the ridge lands
at **7.63 m**, inside the approved 7.70 m.

---

## Loft headroom — the answer

Floor level: plate 3.50 + tie beam 0.25 + floor 0.05 = **3.80 m above grade**.

For 2.2 m walking height the rafter underside must be at 6.00 m. At 54° that
happens at 1.18 m either side of the centreline:

| Distance from centre | Headroom |
|---|---|
| 0 m | 3.83 m |
| 1.00 m | 2.45 m |
| **1.18 m** | **2.20 m** |
| 1.50 m (at the purlin posts) | 1.77 m |
| 2.00 m | 1.08 m |

Notching the ties 50 mm into the wall drops the floor to **3.80 m**, which buys
a little back: the strip is now **2.44 m wide**.

**You get a 2.44 m wide walking strip down the middle** — and the struts land at
the wall, not in the middle, so nothing obstructs it. That is a usable loft:
full height down the spine, storage under the slope either side.

If you want 2.2 m all the way out to the posts at ±1.5 m, the ridge has to rise
to 8.06 m, which is 0.43 m more. Everything else stays the same. Since you are
setting the height aside as a constraint, that is a free choice — but it is a
choice to make now, because it changes every rafter length.

## What to do, in order

1. **Fix the cross-frame spacing and add struts (F4, F9).** This is a design
   decision, costs nothing to make now, and changes what timber you buy.
2. **Foundations (F1, F2, F5, F6).** One excavation solves four findings, and
   this is the last moment it is easy. Concrete below 1.2 m, DPC, hold-down
   straps cast in, sill raised to 300 mm+.
3. **Birdsmouth and strap every rafter (F3).** Do not cut a single rafter until
   this is settled — it changes the setting-out.
4. **Loft (F7) is decided** — 13 ties at 700 mm, sized for full workshop floor
   load **only with the F24 brace seats cut**. Without them it is 14% over on
   load. Order the ties before setting any out, because the run is continuous.
   Previously this read: decide before the last ties go in — ceiling only,
   or a real floor with a centre beam.
5. **Treat the timber (F11)** while every face is still reachable.
6. **Cut the brace seats and fit the ledger before the deck goes down (F24).**
   The braces carry the floor now, and a prop needs something to stand on: below
   the plate the wall between posts is open frame, so most brace feet land on
   air. A 100 × 100 ledger down each long wall fixes it, and it has to be that
   thick for stiffness — a 50 mm one sags 3.5 mm and gives back three quarters
   of what the braces buy. The 2026-08-21 re-run in [stability.md](stability.md)
   adds a second reason: the front gable cannot take its half of the transverse
   wind (F25), so the brace portals are the primary system across the width too.
   None of it can be inspected once the loft is decked.

Steps 2 and 3 are worth doing before anything else goes on the frame. Everything
above the sill is reversible; the foundation stops being reversible the moment
the roof is on.

---

Load numbers here are for locating problems and sizing the argument, not for
construction. Before the roof goes up, the cross beams (F4), the header (F8) and
the foundation (F1) should be checked by a Latvian structural engineer against
the national annexes — the foundation especially, since the approved design
already calls for reinforced concrete and departing from a permitted design is a
different conversation from designing it fresh.
