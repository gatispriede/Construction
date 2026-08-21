#!/usr/bin/env python3
"""Whole-building stability check, re-run from params.json.

Everything below is DERIVED from model/params.json, so the check moves when the
model moves. Run it after any change to geometry, bracing or the loft deck:

    python3 model/stability.py          # table
    python3 model/stability.py --md     # markdown, for docs/stability.md

It does NOT replace the Latvian structural engineer. It checks the load paths
the model CLAIMS to have. If a path is missing from the model, this file cannot
find it - it can only show that the members carrying the known ones are big
enough, and say by how much.

Basis: EN 1991-1-4 wind, EN 1995-1-1 timber, C24, service class 2.
Assumptions that move every number are collected in ASSUMPTIONS at the bottom.
"""
import json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, 'params.json')))

# --- Material -------------------------------------------------------------
# kmod 0.9 (short term) is used even on the pure wind cases, where EN 1995
# allows 1.1 (instantaneous). That leaves 22% of unclaimed margin on every wind
# line below, which is where the "TIGHT" rows have their real cover.
KMOD, GM = 0.9, 1.3
FM_D = 24.0 * KMOD / GM      # bending           16.6 MPa
FC_D = 21.0 * KMOD / GM      # compression ||    14.5 MPa
FT_D = 14.0 * KMOD / GM      # tension ||         9.7 MPa
FC90_D = 2.5 * KMOD / GM * 1.5   # bearing across the grain, kc,90 = 1.5
E_MEAN, E_05 = 11000.0, 7400.0
GQ, GG_FAV = 1.5, 0.9
RHO_TIMBER = 5.0             # kN/m3

# Fastener design values. Kept identical to the ones already quoted in
# params.json so this file cannot silently disagree with the drawings.
SCREW_6 = 1.4        # kN  6x100/6x120, single shear, timber to timber
SCREW_8 = 2.2        # kN  8x160, single shear
SCREW_8_WD = 4.0     # kN  8x200, withdrawal, 100 mm of embedment past the
                     #     ledger. EN 1995 8.7.2 with fax,k 10.5 gives 5.8; 4.0
                     #     is a deliberate round-down.
PILE_UPLIFT = 8.0    # kN  300 mm x 1.2 m bored pile: 2 kN of pile + shaft
                     #     friction at a deliberately low 10 kPa, /1.5

# --- Geometry (same chain as src/geometry.js) -----------------------------
h = P['heights']
L, Wd = P['plan']['length'], P['plan']['width']
sillTop = h['pier'] + h['sillCourse'] * h['sillCourses']
postTop = sillTop + h['post']
plateTop = postTop + h['plateCourse'] * h['plateCourses']
tieBottom = plateTop - P['joists']['endNotch']
pitch = math.radians(P['roof']['pitchDeg'])
roofRise = Wd / 2 * math.tan(pitch)
overhang = P['roof']['tailSlopeLength'] * math.cos(pitch)
roofWidth = 2 * (Wd / 2 + overhang)
ridgeZ = plateTop + roofRise
slopeHalf = (Wd / 2) / math.cos(pitch)          # eaves to ridge, on slope
wallH = plateTop - h['pier']

# Tie setout: a hard spacing from the front gable with the residual thrown into
# the close-out bay — same rule as geometry.js tieStations(), not an even divide.
tieRun = L - P['sections']['joist'][0]
tieSp = P['joists']['spacing']
tieBays = math.floor(tieRun / tieSp + 1e-9)
if abs(tieRun - tieBays * tieSp) > 1e-6:
    tieBays -= 1
nTies = tieBays + 2 if abs(tieRun - (tieBays) * tieSp) > 1e-6 else tieBays + 1
tieBays = nTies - 1
postSp = L / len(P['bays']['longWallClearGaps'])  # 8 gaps, ~1.16 m

kb = P['kneeBraces']
kbAng = math.radians(kb['angleDeg'])
braceLen = kb['length']
footZ = tieBottom - braceLen * math.sin(kbAng)
braceRun = braceLen * math.cos(kbAng)

# --- Wind, EN 1991-1-4 ----------------------------------------------------
VB, RHO, Z0, Z0II = P['site']['windBasic_ms'], 1.25, 0.3, 0.05   # terrain III

def qp(z, z0=Z0):
    z = max(z, 5.0)                              # zmin, terrain III
    cr = 0.19 * (z0 / Z0II) ** 0.07 * math.log(z / z0)
    return (1 + 7 / math.log(z / z0)) * 0.5 * RHO * (cr * VB) ** 2 / 1000.0

QP = qp(ridgeZ)                 # ze = h <= b, so one value for the whole envelope
QP_II = qp(ridgeZ, 0.05)        # terrain II, for the sensitivity line

CPE_W, CPE_L = 0.8, -0.55       # walls, h/d ~ 1.3
CPE_RW, CPE_RL = 0.7, -0.25     # duopitch 54 deg, wind across the ridge
CPI = 0.2

# Case A - wind ACROSS the ridge, per metre of building length.
wA_wall = (CPE_W + abs(CPE_L)) * QP * wallH
wA_roof = (CPE_RW + abs(CPE_RL)) * QP * slopeHalf * math.sin(pitch)
wA = wA_wall + wA_roof
VA = wA * L
# Each rafter pair + tie is a triangle in its own plane, so ALL of the roof load
# lands at the two wall tops. The wall itself spans sill to plate, so half of it
# arrives there too. That total is what the deck and the portals share.
wA_deck = wA_roof + wA_wall / 2
VA_deck = wA_deck * L

# Case B - wind ALONG the ridge, on the gable.
gableTri = 0.5 * roofWidth * roofRise
FB_wall = (CPE_W + abs(CPE_L)) * QP * Wd * wallH
FB_tri = (CPE_W + abs(CPE_L)) * QP * gableTri
VBt = FB_wall + FB_tri

# --- Dead load, for overturning ------------------------------------------
# Lower-bound on purpose: light where light is unfavourable.
G_roof = 0.25 * (2 * slopeHalf + 2 * P['roof']['tailSlopeLength']) * (L + 1.0)
G_deck = 0.12 * L * Wd
G_ties = 0.1 * 0.25 * Wd * (nTies - 1) * RHO_TIMBER
perM = (2 * 0.15 * h['sillCourse'] + 2 * 0.15 * h['plateCourse']
        + P['sections']['post'][0] * P['sections']['post'][1] * h['post'] / postSp
        + P['sections']['girt'][0] * P['sections']['girt'][1])
G_walls = perM * 2 * (L + Wd) * RHO_TIMBER
G = G_roof + G_deck + G_ties + G_walls

CHECKS = []
def check(group, item, demand, capacity, unit, note):
    CHECKS.append(dict(g=group, item=item, d=demand, c=capacity, unit=unit,
                       f=(capacity / demand if demand > 0 else math.inf), note=note))

A = 'A. Wind across the ridge (on the long wall)'
B = 'B. Wind along the ridge (on the gable)'
C = 'C. Whole building'

# === A. The transverse portal: tie, knee braces, ledger ==================
# Conservative: the portal takes the whole bay reaction, with no help from the
# deck. That is the state the frame is in on the day the ties go in, and it is
# also what has to be true for the front gable NOT to be the weak link (below).
H_bay = wA_deck * tieSp * GQ
N_brace = H_bay / math.cos(kbAng)
H_bay_deck = wA_wall / 2 * tieSp * GQ            # with the deck taking the roof
N_brace_deck = H_bay_deck / math.cos(kbAng)

imin = min(kb['section']) * 1000 / math.sqrt(12)
lam = braceLen * 1000 / imin
lrel = lam / math.pi * math.sqrt(21 / E_05)
kk = 0.5 * (1 + 0.2 * (lrel - 0.3) + lrel ** 2)
kc = 1 / (kk + math.sqrt(kk * kk - lrel * lrel))
A_br = kb['section'][0] * kb['section'][1] * 1e6

check(A, f"knee brace {braceLen*1000:.0f} mm, buckling", N_brace,
      kc * A_br * FC_D / 1000, 'kN', f"lambda {lam:.0f}, kc {kc:.2f}")
check(A, f"knee brace {braceLen*1000:.0f} mm, tension on the net section",
      N_brace, 0.8 * A_br * FT_D / 1000, 'kN',
      'the leeward brace of every pair pulls - 20% off for the screw holes')
nsc = kb.get('screwsPerEnd', 4)
check(A, f"knee brace end connection, {nsc} x 6 mm screws", N_brace,
      nsc * SCREW_6, 'kN', f"{N_brace_deck:.1f} kN once the deck is on")

lg = P.get('braceLedger')
if lg:
    b_t, b_d = lg['section']                     # 50 thick x 100 deep, on edge
    V_foot = N_brace * math.sin(kbAng)
    H_foot = N_brace * math.cos(kbAng)
    # Ties are at 576 and posts at ~1164, so every other brace lands mid-bay.
    # That one is the load the ledger has to span with.
    W_str = b_t * 1e3 * (b_d * 1e3) ** 2 / 6
    W_wk = b_d * 1e3 * (b_t * 1e3) ** 2 / 6
    I_wk = b_d * 1e3 * (b_t * 1e3) ** 3 / 12
    check(A, 'ledger bending, vertical (strong axis)',
          (V_foot * postSp / 4) * 1e6 / W_str, FM_D, 'MPa',
          f"one mid-bay brace foot over {postSp*1000:.0f} mm")
    check(A, 'ledger bending, horizontal (weak axis)',
          (H_foot * postSp / 4) * 1e6 / W_wk, FM_D, 'MPa',
          'the tension brace pulling the ledger off the wall')
    check(A, 'ledger deflection, weak axis',
          H_foot * 1e3 * (postSp * 1e3) ** 3 / (48 * E_MEAN * I_wk),
          postSp * 1000 / 300, 'mm', 'L/300')
    check(A, 'ledger fixing, withdrawal at each post', 2 * H_foot,
          lg['screwsPerPost'] * SCREW_8_WD, 'kN',
          f"both braces of the bay pulling at once, {lg['screwSize']}")
    check(A, 'brace foot bearing on the ledger seat',
          V_foot * 1000 / (kb['section'][0] * 1e3 * lg['seatDepth'] * 1e3),
          FC90_D, 'MPa', f"{lg['seatDepth']*1000:.0f} mm seat, across the grain")

# Portal capacity against the whole transverse load, and the post that has to
# carry the frame moment.
H_portal = min(nsc * SCREW_6, kc * A_br * FC_D / 1000) * math.cos(kbAng)
check(A, 'portal path, whole transverse shear', VA_deck * GQ,
      H_portal * tieBays, 'kN',
      f"{tieBays} braced bays x {H_portal:.1f} kN - this is the path that does "
      'not depend on the front gable')
Wp = P['sections']['post'][0] * 1e3 * (P['sections']['post'][1] * 1e3) ** 2 / 6
check(A, 'post, frame moment at the knee', (H_bay / 2 * (footZ - sillTop)),
      Wp * FM_D / 1e6, 'kNm', 'pinned base, rigid corner')
w_post = CPE_W * QP * postSp * GQ
check(A, 'post, out-of-plane bending between sill and plate',
      (w_post * h['post'] ** 2 / 8) * 1e6 / Wp, FM_D, 'MPa',
      f"{postSp*1000:.0f} mm apart, 150 mm wall")

# === A. The other transverse path: deck diaphragm into the gables ========
V_deck = VA_deck * GQ
v_edge = V_deck / 2 / Wd
DECK_EDGE = 0.15
check(A, 'loft deck diaphragm, unit shear', v_edge, SCREW_6 / DECK_EDGE, 'kN/m',
      f"6x100 at {DECK_EDGE*1000:.0f} mm on panel EDGES. At the 300 mm the "
      'schedule used to say, it is 4.7 kN/m and a factor of 1.2')
check(A, 'deck chord force in the edge tie', V_deck * L / 8 / Wd,
      P['sections']['joist'][0] * P['sections']['joist'][1] * 1e6 * FT_D / 1000,
      'kN', 'the two edge ties are the chords - the SPLICES carry this')

# Gable shear walls. Racking capacity of a braced post-and-beam panel is set by
# the brace END CONNECTIONS, which nobody has specified - see F10. So the check
# is stated as what those connections have to deliver.
V_gable = V_deck / 2
nb_back = P['braces']['backGable']
diagAng = math.atan2(h['girtBottom'], postSp)
check(A, 'back gable, force per built diagonal', V_gable / nb_back / math.cos(diagAng),
      P['sections']['brace'][0] * P['sections']['brace'][1] * 1e6 * FC_D / 1000,
      'kN', f"{nb_back} diagonals, timber is fine - the ENDS are not specified")
# The front gable's two piers rock about their compression edge, so what
# resists is the pile GROUP under each pier, each pile at its own lever arm
# from that edge. The pile sitting on the toe contributes nothing.
front_len = Wd - P['opening']['width']
pier = front_len / 2
nJamb = P['opening']['jambPiles']
arms = [pier * i / (nJamb - 1) for i in range(1, nJamb)]   # toe excluded
check(A, 'front gable pier, overturning on its pile group', V_gable / 2 * wallH,
      sum(PILE_UPLIFT * a for a in arms), 'kNm',
      f"{P['opening']['width']:.0f} m opening leaves two {pier:.1f} m piers at "
      f"{wallH/pier:.1f}:1. {nJamb} piles a side counting the corner - two would "
      f"give {PILE_UPLIFT*pier:.0f} kNm. Tributary half-share assumed; see the note")
# What the jamb piles are actually for, and here they are comfortable: the
# header. UDL back-figured from the F8 lintel check, 2.07 MPa on 220 x 185.
w_lintel = 2.07 * (220 * 185 ** 2 / 6) * 8 / (P['opening']['width'] * 1000) ** 2
check(A, 'jamb pile, vertical from the entrance header',
      w_lintel * P['opening']['width'] / 2, 28.0, 'kN',
      'the job the jamb piles actually do - and they now do it on a pile '
      'instead of on a slab that heaves (F8, F23)')

# Sway, portal only, no deck: pinned bases, corners made rigid by the knee
# braces, so each post is 3EI/h^3 and the pair is 6EI/h^3.
I_post = P['sections']['post'][0] * 1e3 * (P['sections']['post'][1] * 1e3) ** 3 / 12
hcol = (footZ - sillTop) * 1000
sway = (wA_deck * tieSp) * 1e3 * hcol ** 3 / (6 * E_MEAN * I_post)
check(A, 'sway at tie level, portal only, deck ignored', sway,
      (tieBottom - sillTop) * 1000 / 250, 'mm',
      f"characteristic wind, H/250; = H/{(tieBottom-sillTop)*1000/sway:.0f}")

# === B. Along the ridge ==================================================
V_long = VBt * GQ
roofPlane = 2 * slopeHalf * (L + 1.0)
check(B, 'roof sheeting as a diaphragm (F19)', FB_tri * GQ / 2 / (2 * slopeHalf),
      1.5, 'kN/m', 'no roof-plane braces: the sheeting is the only path')
diag = math.hypot(L / 2, Wd)
N_girder = V_long / 2 / 2 * diag / Wd
gs = P['advice']['girderSection']
lam_g = (tieSp * diag / (L / 2)) * 1000 / (min(gs) * 1000 / math.sqrt(12))
lrel_g = lam_g / math.pi * math.sqrt(21 / E_05)
kg = 0.5 * (1 + 0.2 * (lrel_g - 0.3) + lrel_g ** 2)
kc_g = 1 / (kg + math.sqrt(kg * kg - lrel_g * lrel_g))
check(B, 'wind girder diagonal, 100x100', N_girder,
      kc_g * gs[0] * gs[1] * 1e6 * FC_D / 1000, 'kN',
      f"restrained every {tieSp*1000:.0f} mm along it, kc {kc_g:.2f}")
check(B, 'long wall, force per built diagonal',
      V_long / 2 / P['braces']['longWall'] / math.cos(diagAng),
      P['sections']['brace'][0] * P['sections']['brace'][1] * 1e6 * FC_D / 1000,
      'kN', f"{P['braces']['longWall']} per wall, end bays - ends again unspecified")

# === C. Whole building ===================================================
M_ov_A = GQ * (wA_wall * L * (h['pier'] + wallH / 2)
               + wA_roof * L * (plateTop + roofRise / 2))
M_res_A = GG_FAV * G * Wd / 2
check(C, 'overturning across the ridge, self weight alone', M_ov_A, M_res_A,
      'kNm', f"self weight {G:.0f} kN at 0.9")
short = max(M_ov_A - M_res_A, 0.0)
nPileSide = math.ceil(L / P['piers']['spacing']) + 1
check(C, 'hold-down needed per windward pile', short / Wd / nPileSide,
      PILE_UPLIFT, 'kN', f"{nPileSide} piles down the windward wall - "
      'this is F6, and now it has a number')
M_ov_B = GQ * (FB_wall * (h['pier'] + wallH / 2) + FB_tri * (plateTop + roofRise / 3))
check(C, 'overturning along the ridge', M_ov_B, GG_FAV * G * L / 2, 'kNm',
      'the long way is never the problem')
nPiles = math.ceil(2 * (L + Wd) / P['piers']['spacing'])
check(C, 'sliding, shear per pile connection', GQ * max(VA, VBt) / nPiles,
      2 * 10.0, 'kN', f"{nPiles} piles, M14 anchor in single shear")
F_up = (0.7 + CPI) * QP * slopeHalf * P['roof']['rafterSpacing'] * GQ
check(C, 'net uplift per rafter foot',
      max(F_up - GG_FAV * 0.25 * slopeHalf * P['roof']['rafterSpacing'], 0.01),
      2 * 4.0, 'kN', 'strap per F3/F6')

# === D. The loft floor: the braces as props ==============================
# The braces stopped being wind braces on 2026-08-21 — at 700 mm tie centres the
# floor only passes because they prop each tie inboard of its bearing. That
# makes the LEDGER part of the floor's load path, and a ledger that spans
# between posts is a spring, not a support: every millimetre it sags is a
# millimetre handed back to the tie.
#
# Four supports, not two: the wall bearing at each end and a prop at each brace
# head. Solved by the flexibility method with the two props as the redundants,
# so the prop can be given a real stiffness instead of being assumed rigid.
TIE_W = 1.391                      # N/mm on one tie at 700 mm centres
CREEP = 1.665                      # instantaneous -> final, same factor as F7
TIE_SPAN = 6000.0
I_TIE = P['sections']['joist'][0] * 1e3 * (P['sections']['joist'][1] * 1e3) ** 3 / 12
EI_TIE = E_MEAN * I_TIE

def propped_tie(prop_in, kprop=None):
    """Uniform load, ends simply supported, props `prop_in` mm in from each end.
    kprop = N/mm at the props, None for rigid. Returns (final mid deflection mm,
    prop reaction kN, end reaction kN)."""
    Lb, w = TIE_SPAN, TIE_W
    d_udl = lambda x: w * x * (Lb ** 3 - 2 * Lb * x * x + x ** 3) / (24 * EI_TIE)
    def pt(a, x):                                   # unit point load at a, defl at x
        b = Lb - a
        return (b * x * (Lb * Lb - b * b - x * x) / (6 * Lb * EI_TIE) if x <= a
                else a * (Lb - x) * (Lb * Lb - a * a - (Lb - x) ** 2) / (6 * Lb * EI_TIE))
    inv = 0.0 if kprop is None else 1.0 / kprop
    R = d_udl(prop_in) / (pt(prop_in, prop_in) + pt(Lb - prop_in, prop_in) + inv)
    mid = d_udl(Lb / 2) - R * (pt(prop_in, Lb / 2) + pt(Lb - prop_in, Lb / 2))
    return mid * CREEP, R / 1000, (w * Lb / 2 - R) / 1000

D = 'D. The loft floor, with the braces propping it'
# The tie BEARS on the outer wall face and the brace head sits `braceRun` in
# from the INNER face, so the prop is a wall thickness further in than the run.
propIn = (P['sections']['wallThickness'] + braceRun) * 1000
if lg:
    b_t, b_d = lg['section']
    I_led = b_t * 1e3 * (b_d * 1e3) ** 3 / 12
    k_led = 48 * E_MEAN * I_led / (postSp * 1000) ** 3      # mid-bay, worst case
else:
    k_led = None
mid_soft, R_soft, end_soft = propped_tie(propIn, k_led)
mid_rigid, R_rigid, end_rigid = propped_tie(propIn, None)
mid_plain = 5 * TIE_W * TIE_SPAN ** 4 / (384 * EI_TIE) * CREEP

check(D, 'tie deflection, braces propping it', mid_soft, TIE_SPAN / 250, 'mm',
      f"{mid_plain:.1f} mm unpropped; {mid_rigid:.1f} where a foot lands on a post")
check(D, 'brace as a prop, axial', R_rigid * math.sqrt(2),
      kc * A_br * (21 * 0.8 / GM) / 1000, 'kN',
      f"{R_soft*math.sqrt(2):.1f} kN mid-bay, {R_rigid*math.sqrt(2):.1f} on a post. kmod 0.8, floor load")
check(D, 'brace head bearing on the tie underside',
      R_rigid * 1000 / (kb['section'][0] * kb['section'][1] * 1e6 / math.cos(kbAng)),
      2.5 * 0.8 / GM * 1.5, 'MPa', 'flat cut face, 7071 mm2 - NOT a notch in the tie')
check(D, 'tie end hold-down, uplift', max(-end_rigid, 0.01), 14.2, 'kN',
      '2 x M14. The props take more than the whole floor, so the ends LIFT')
check(D, 'tie axial compression between the brace heads', R_soft,
      math.pi ** 2 * E_05 * (P['sections']['joist'][1] * 1e3
      * (P['sections']['joist'][0] * 1e3) ** 3 / 12) / ((Wd - 2 * braceRun) * 1000) ** 2 / 1000,
      'kN', 'Euler, weak axis, between the props - self-contained, see _thrust')
if lg:
    check(D, 'ledger bending under the prop, mid-bay',
          (R_soft * postSp / 4) * 1e6 / (b_t * 1e3 * (b_d * 1e3) ** 2 / 6),
          24 * 0.8 / GM, 'MPa', f"k = {k_led/1000:.1f} kN/mm, sags {R_soft*1000/k_led:.1f} mm")
    check(D, 'brace foot bearing on the ledger seat, floor load',
          R_rigid * 1000 / (kb['section'][0] * 1e3 * lg['seatDepth'] * 1e3),
          2.5 * 0.8 / GM * 1.5, 'MPa', '100 mm seat, 12 mm locating housing')
    check(D, 'ledger into each post, vertical', R_rigid,
          lg['screwsPerPost'] * 3.0, 'kN',
          f"{lg['screwsPerPost']} x {lg['screwSize']} in shear, PLUS a 20 mm housing "
          'so the shoulder bears')

ASSUMPTIONS = [
    f"Floor load on one tie is {TIE_W*1000:.0f} N/m at {tieSp*1000:.0f} mm centres, and "
    f"final deflection is {CREEP:.3f}x instantaneous - both taken from the 700 mm "
    "setout in params.joists so this file and F7 cannot drift apart.",
    f"vb = {VB:.0f} m/s, terrain III. Terrain II would raise qp from "
    f"{QP*1000:.0f} to {QP_II*1000:.0f} Pa - divide every wind factor by "
    f"{QP_II/QP:.2f} to see it.",
    "kmod 0.9 throughout. EN 1995 allows 1.1 for instantaneous wind, so every "
    "wind row has 22% more cover than it shows.",
    "cpe,10 walls +0.8 / -0.55, roof +0.7 / -0.25 at 54 deg, cpi +-0.2.",
    "Racking capacity of the built diagonals is stated as force per diagonal, "
    "not kN/m: their end connections have never been specified (F10). That is "
    "also why the gable/portal SHARE cannot be computed properly: with 4 x 6 mm "
    "screws the joint slip dominates, and a braced gable panel comes out no "
    "stiffer than a handful of portals. So the front gable is checked on a "
    "tributary half-share, which is conservative, and the line above says what "
    "share it can actually take.",
    "Pile uplift 8 kN: 2 kN of concrete plus shaft friction at 10 kPa, /1.5. "
    "Confirm against the real soil.",
]

def report(md=False):
    o = []
    o.append(f"qp = {QP*1000:.0f} Pa at the {ridgeZ:.2f} m ridge")
    o.append(f"Base shear, characteristic: {VA:.1f} kN across the ridge, "
             f"{VBt:.1f} kN along it")
    o.append(f"Of the transverse load, {VA_deck:.1f} kN ({VA_deck/VA*100:.0f}%) "
             f"arrives at loft-deck level; the rest goes straight into the sills")
    o.append(f"Per tie bay at {tieSp*1000:.0f} mm: {H_bay:.2f} kN design, "
             f"knee brace {N_brace:.2f} kN axial")
    share = sum(PILE_UPLIFT * a for a in arms) / wallH * 2 / (VA_deck * GQ)
    o.append(f"The front gable is good for {share*100:.0f}% of the transverse "
             f"shear, not the 50% a tributary split hands it. The portals carry "
             f"the rest: {H_portal*tieBays:.0f} kN of capacity against "
             f"{VA_deck*GQ:.0f} kN total.")
    o.append("")
    grp = None
    if md:
        o.append('| check | demand | capacity | factor | note |')
        o.append('|---|---|---|---|---|')
    for c in CHECKS:
        if md:
            o.append(f"| {c['item']} | {c['d']:.2f} {c['unit']} | {c['c']:.2f} "
                     f"{c['unit']} | **{c['f']:.1f}** | {c['note']} |")
        else:
            if c['g'] != grp:
                grp = c['g']; o.append(f"\n{grp}")
            flag = 'OK   ' if c['f'] >= 1.5 else ('TIGHT' if c['f'] >= 1.0 else 'SHORT')
            o.append(f"  {flag} {c['item']:56s} {c['d']:7.2f} /{c['c']:8.2f} "
                     f"{c['unit']:5s} x{c['f']:5.1f}  {c['note']}")
    o.append("")
    for c in sorted(CHECKS, key=lambda c: c['f'])[:3]:
        o.append(f"Governing: {c['item']} at x{c['f']:.1f}")
    o.append("")
    for a in ASSUMPTIONS:
        o.append(f"- {a}")
    return "\n".join(o)

if __name__ == '__main__':
    print(report('--md' in sys.argv))
