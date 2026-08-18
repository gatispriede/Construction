// Layers grouped by WHERE THEY GO in the building.
//
// The list used to be one flat run of 30 entries with a reference letter each.
// It outgrew that: 30 letters is a lookup table you have to learn, and a flat
// list gives no clue that `fascia` and `battens` are the same trade on the same
// day while `sills` and `piers` are months earlier. Grouping by location makes
// the panel readable without any letters at all.
//
// Order within a group is bottom-up / outside-in, which is also build order.

export const LAYER_GROUPS = [
  ['Ground and foundation', [
    'ground', 'piers', 'floorSlab', 'floorNotes',
  ]],
  ['Walls', [
    'sills', 'posts', 'girts', 'braces', 'plates', 'plateSplices',
    'must_frontGablePanels', 'wallBattens', 'cladding_white',
  ]],
  ['Loft floor', [
    'ties', 'kneeBraces', 'blocking', 'must_tieBolts',
    'must_windGirder', 'loftDeck',
  ]],
  ['Stair', [
    'stairOpening', 'stairs',
  ]],
  ['Roof', [
    'roof', 'rafterSpacers', 'must_rafterStraps', 'purlins',
    'reinforce_gableStuds', 'fascia', 'battens',
  ]],
  ['Annotation', [
    'dimensions', 'fasteners', 'memberMarks',
  ]],
];

// Flat order, derived — nothing else should hand-maintain a second list.
export const LAYER_ORDER = LAYER_GROUPS.flatMap(([, names]) => names);

// Which group a layer belongs to, for the fastener schedule's connection
// labels. Reads as "loft floor -> walls" instead of "J -> F".
const GROUP_OF = new Map(
  LAYER_GROUPS.flatMap(([group, names]) => names.map((n) => [n, group])));

export function groupOf(name) {
  return GROUP_OF.get(name) ?? '';
}

// The layer's own name is the label now. No letters to cross-reference.
export function labelOf(name) {
  return name;
}

// Sort a set of layer names into canonical order, unknowns last.
export function inOrder(names) {
  const rank = (n) => {
    const i = LAYER_ORDER.indexOf(n);
    return i === -1 ? 999 : i;
  };
  return [...names].sort((a, b) => rank(a) - rank(b));
}
