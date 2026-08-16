# Assumptions

Every dimension in the model is one of three things. Nothing structural in
[findings.md](findings.md) rests on a `photo` value without saying so.

- **given** — measured by you, or written in the submitted paperwork
- **photo** — read off a photograph, proportionally. Treat as ±15%.
- **derived** — computed from the other two

Source photos: `refs/photos/` · source drawings: `refs/plans/` (rendered from `Public/paperwork/`)

## Given

| Value | Source |
|---|---|
| Footprint 9.0 × 6.0 m, outside face | you, 2026-08-14 |
| Wall stack 0.15 + 0.15 + 2.70 + 0.15 + 0.15 = 3.30 m | you |
| Front wall one course fewer = 3.15 m | you |
| Joist cantilever 0.50 m; plate overhang 1.00 m | you |
| Roof 11 m long, 54° | you |
| Entrance ~3 m wide, front (gable) wall | you |
| Approved: 10 × 6 m, 60 m², eaves 3.3 m, ridge 7.7 m | Skaidrojošais apraksts2.pdf |
| Approved: reinforced concrete foundation, concrete floor | same |
| Approved: 6.00 m rafters, 4.00 m roof rise, 0.50 m gable overhang | Skats no priekšas / sāna |
| Site: Dārza iela 10, Sigulda; 7 m to nearest boundary | same |

## Read off photographs — verify these

| Value | Used | Why it matters |
|---|---|---|
| Post spacing ~1.1 m | 8 bays / 9 m, 5 bays / 6 m | Sets how much load each pier takes |
| Post section ~150 × 150 mm | all posts | Buckling and bearing checks |
| Sill 2 courses, ~200 × 150 mm each | perimeter | Spanning between piers |
| Girt at ~1.50 m | mid-height rail | Racking |
| Pier ~250 × 250 mm, ~1.2 m spacing, 1–3 brick courses | 25 piers | **Drives the bearing number in F1** |
| Pier height above grade ~200 mm | sill at 0.20 m | Drives F4 |
| Joists ~60 × 200 mm at ~0.8 m | tie beams | **Drives the span check in F6** |
| Joists ~55% installed | display only | — |

The two that most change the conclusions are the **pier size/spacing** and the
**joist section**. If either is materially different from the above, say so and
the numbers get rerun.

## Unresolved — these need an answer

1. **Where does the rafter foot land?** On the wall plate (3.0 m from centre) or
   on the joist cantilever tip (3.5 m)? At 54° that is the difference between a
   7.63 m ridge and an 8.32 m ridge, against an approved maximum of 7.70 m.
   Currently modelled as the cantilever tip. See F3.

2. **Eaves height datum.** The model puts the plate top at 3.50 m above grade
   (0.20 m pier + 3.30 m timber). The permit says the lowest point is 3.30 m.
   Either the pier is not counted, or the piers are shorter than modelled.

3. **Entrance height.** Modelled at 2.80 m. The approved elevation scales to
   ~3.1 m in a 3.70 m wall; proportionally that is ~2.8 m in your 3.30 m wall.

4. **Whether the collar truss from the approved elevation is still the plan.**
   The drawing shows a collar with struts near the apex. Nothing on site yet.

5. **Loads.** Snow 1.5 kPa ground and wind 24 m/s basic are typical Latvian
   values, not the Sigulda-specific figures from the national annex.

## Deviations from the approved paperwork

Recorded as fact, not judgement — the regulatory consequence is yours to weigh.

| Item | Approved | Built |
|---|---|---|
| Foundation | Reinforced concrete | Dry-laid clay brick on topsoil |
| Floor | Concrete | None |
| Length | 10.0 m | 9.0 m |
| Area | 60 m² | 54 m² |
| Gable overhang | 0.50 m | 1.00 m |
| Ridge height | 7.70 m max | 8.32 m as modelled |
| Timber treatment | Insecticide + fire retardant | Not evident in photos |

Being *under* on area and length keeps you inside the Group I ≤60 m² limit and
the setbacks still work. The foundation and the height are the two that matter.
