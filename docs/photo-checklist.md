# What to send

Drop photos into `refs/photos/`, plans/drawings into `refs/plans/`.
Name them roughly by what they show (`north-elevation.jpg`, `roof-ridge-01.jpg`) — it saves a round of "which wall is this?".

## Photos — priority order

Structure first, finishes never. Unfinished is good: exposed framing tells me more than a rendered wall.

**1. Whole-building orientation (4 shots)**
Each elevation from far enough back to see the full height, roughly straight-on.
Include the ground line — foundation and grade matter.

**2. Roof structure**
- Ridge, along its length
- A rafter/truss pair, showing how it meets the wall plate
- Any purlin, collar tie, ridge beam, or bracing
- Where the roof changes direction (hips, valleys, dormers)
- Underside of the roof from inside, wide

**3. Floor structure**
- Joists from below, showing direction and what they bear on
- Any beam carrying joists, and both of its ends (the bearing is where things fail)
- Stair opening / any hole cut through the floor
- Openings > 2 m wide and whatever spans them

**4. Walls**
- Each load-bearing wall, corner to corner
- Wall/floor and wall/roof junctions
- Any wall that stops short, has been removed, or was added later
- Openings — big windows, sliders, garage doors, knock-throughs

**5. Foundation**
- Perimeter, all sides, at grade
- Any exposed footing, pier, pad, or crawlspace
- Any visible crack — include something for scale (tape, coin, hand)

**6. Anything that looks wrong**
Cracks, gaps, out-of-plumb, sagging lines, water staining, rust, rot, movement at joints.
Shoot these twice: close-up, then stepped back so I can place it in the building.

## Numbers — the minimum set

Six numbers get the model to real scale. Everything else I infer from photos and label as an assumption.

| # | Measurement | Value |
|---|---|---|
| 1 | Overall footprint, outside face to outside face (L × W) | |
| 2 | Number of storeys, and finished floor to finished floor height | |
| 3 | External wall thickness, and what it's built of | |
| 4 | Roof pitch (degrees, or rise-over-run) | |
| 5 | Longest unsupported floor span, and joist size + spacing | |
| 6 | Longest unsupported roof span, and rafter size + spacing | |

Extra credit, if easy: beam sizes and spans, foundation width and depth, lintel sizes over big openings, storey height of any half-level or vaulted space.

## Also worth saying

- Where you are (climate matters: snow load, wind, frost depth, seismic)
- Construction type — timber frame, masonry, ICF, steel, mixed
- What's built so far vs. still to come
- Anything already changed from the original plan

Every dimension I take from a photo rather than a tape measure lands in `docs/assumptions.md` with a confidence flag. Nothing structural gets concluded from a guessed number without that being visible.
