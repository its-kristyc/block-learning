export const BLOCKS = [
  'Warm Up',
  'Foot Work',
  'Abdominal Work',
  'Hip Work',
  'Spinal Articulation',
  'Stretches',
  'Full Body Integration I',
  'Arm Work',
  'Leg Work',
  'Full Body Integration II',
  'Lateral Flexion & Rotation',
  'Back Extension',
  'Foundation',
];

// Canonical apparatus display order. Any apparatus not listed sorts to the end.
export const APPARATUS_ORDER = [
  'Mat',
  'Mat (Magic Circle)',
  'Reformer',
  'Cadillac',
  'Pole',
  'PED-a-PUL',
  'F2 Chair',
  'Wunda Chair',
  'Ladder Barrel',
  'Spine Corrector',
];

export const LEVELS = ['Fundamental', 'Intermediate', 'Advanced'];

// Display order for block grouping — Foundation (13) sits after Warm Up (1)
export const BLOCK_DISPLAY_ORDER = [1, 13, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function apparatusRank(a) {
  const i = APPARATUS_ORDER.indexOf(a);
  return i === -1 ? APPARATUS_ORDER.length : i;
}
