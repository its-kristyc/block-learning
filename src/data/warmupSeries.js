// Warm-up series definitions. Each series is an ordered sequence of exercises
// taught as the Warm Up block (block 1). Extracted series use real IDs;
// F2 Chair uses name-based lookup until its exercises are extracted.
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
    exercises: ['mat-008', 'mat-002', 'mat-016', 'mat-017', 'mat-018'],
  },
  {
    id: 'wu-cadillac',
    name: 'Cadillac',
    apparatus: 'Cadillac',
    exercises: ['cad-010', 'cad-011', 'cad-012', 'cad-013', 'cad-014'],
  },
  {
    id: 'wu-f2chair',
    name: 'F2 Chair',
    apparatus: 'F2 Chair',
    // f2-001/002/003 resolve by ID; Spine Twist Supine is not in the F2 Chair
    // PDFs, so it stays a name-based placeholder (dashed) until it exists.
    exercises: [
      'f2-001',
      'f2-002',
      'f2-003',
      'Spine Twist Supine',
    ],
  },
];
