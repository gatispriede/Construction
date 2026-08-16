// Canonical layer order and their reference letters.
//
// One source of truth, because the fastener labels are baked into canvas
// textures at build time and cannot ask the viewer what letter a layer ended
// up with. Both modules read this.
//
// I, O and Q are skipped — on a drawing they read as 1, 0 and a smudged O.

const ALPHABET = 'ABCDEFGHJKLMNPRSTUVWXYZ';

export const LAYER_ORDER = [
  // as built
  'ground', 'piers', 'sills', 'posts', 'girts', 'plates', 'plateSplices',
  'braces', 'ties', 'kneeBraces', 'blocking', 'stairOpening', 'stairs',
  // your design, not yet built
  'loftDeck', 'roof', 'rafterSpacers', 'fascia', 'battens', 'wallBattens', 'purlins',
  // must add
  'must_tieBolts', 'must_rafterStraps', 'must_frontGablePanels', 'must_windGirder',
  // wind reinforcement
  'reinforce_gableStuds', 'cladding_white',
  // annotation
  'dimensions', 'fasteners', 'memberMarks',
];

// Past Z, carry on with AA, AB, ... The list outgrew a single letter when the
// stair opening and rafter spacers were added — 24 layers, 23 letters.
function letterAt(i) {
  const n = ALPHABET.length;
  return i < n ? ALPHABET[i] : ALPHABET[Math.floor(i / n) - 1] + ALPHABET[i % n];
}

const LETTER = new Map(LAYER_ORDER.map((n, i) => [n, letterAt(i)]));

export function letterOf(name) {
  return LETTER.get(name) ?? '?';
}

// "girts" -> "E girts", for the layer panel.
export function labelOf(name) {
  return `${letterOf(name)}  ${name}`;
}

// Sort a set of layer names into canonical order, unknowns last.
export function inOrder(names) {
  const rank = (n) => {
    const i = LAYER_ORDER.indexOf(n);
    return i === -1 ? 999 : i;
  };
  return [...names].sort((a, b) => rank(a) - rank(b));
}
