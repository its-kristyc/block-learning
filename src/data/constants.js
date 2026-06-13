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
];

// Canonical apparatus display order. Any apparatus not listed sorts to the end.
export const APPARATUS_ORDER = [
  'Mat',
  'Reformer',
  'Cadillac',
  'Wunda Chair',
  'Spine Corrector',
  'Ladder Barrel',
];

export const LEVELS = ['Fundamental', 'Intermediate', 'Advanced'];

export function apparatusRank(a) {
  const i = APPARATUS_ORDER.indexOf(a);
  return i === -1 ? APPARATUS_ORDER.length : i;
}
