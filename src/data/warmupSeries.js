// Warm-up series definitions. Each series is an ordered sequence of exercises
// taught as the Warm Up block (block 1). Mat Foundation uses real IDs;
// others use name-based lookup until their exercises are extracted.
export const WARMUP_SERIES = [
  {
    id: 'wu-foundation',
    name: 'Mat Foundation',
    apparatus: 'Mat',
    exercises: ['mat-001', 'mat-002', 'mat-003', 'mat-004'],
  },
  {
    id: 'wu-intermediate',
    name: 'Mat Intermediate',
    apparatus: 'Mat',
    exercises: [
      'Roll-Up',
      'Spine Twist Supine',
      'Double Leg Stretch',
      'Single Leg Stretch',
      'Criss Cross',
    ],
  },
  {
    id: 'wu-cadillac',
    name: 'Cadillac',
    apparatus: 'Cadillac',
    exercises: [
      'Roll-Up with RUBar',
      'Spine Twist Supine with PTBar',
      'Mini Roll-Up',
      'Mini Roll-Up Oblique',
      'Roll-Up with PTBar',
    ],
  },
  {
    id: 'wu-f2chair',
    name: 'F2 Chair',
    apparatus: 'F2 Chair',
    exercises: [
      'Roll-up with Extension',
      'Mini Roll-Up',
      'Mini Roll-Up Oblique',
      'Spine Twist Supine',
    ],
  },
];
