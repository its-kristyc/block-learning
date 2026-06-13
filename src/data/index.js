import rawExercises from './exercises.json';
import { APPARATUS_ORDER, LEVELS } from './constants.js';

export { APPARATUS_ORDER, LEVELS };
export { BLOCKS, apparatusRank } from './constants.js';

export const EXERCISES = rawExercises;

export const byId = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

export const APPARATUSES = [...new Set(EXERCISES.map(e => e.apparatus))]
  .sort((a, b) => {
    const ai = APPARATUS_ORDER.indexOf(a);
    const bi = APPARATUS_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

export const MUSCLES = [...new Set(EXERCISES.flatMap(e => e.muscleFocus))].sort();

export const noFilters = { apparatus: '', level: '', muscle: '', collection: '' };

export function applyFilters(list, f) {
  return list.filter(e =>
    (!f.apparatus   || e.apparatus          === f.apparatus) &&
    (!f.level       || e.level              === f.level) &&
    (!f.muscle      || e.muscleFocus.includes(f.muscle)) &&
    (!f.collection  || e.collection?.name   === f.collection)
  );
}
