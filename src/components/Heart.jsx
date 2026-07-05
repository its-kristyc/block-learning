import { Heart as HeartIcon } from 'lucide-react';
import { C } from '../styles/tokens.js';

export function Heart({ on, onClick, size = 18 }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      aria-label={on ? 'Remove favorite' : 'Add favorite'}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 4, lineHeight: 0,
        color: on ? C.red : '#C9BFB4',
        fontSize: size,
      }}
    >
      <HeartIcon size={size} strokeWidth={2} fill={on ? C.red : 'none'} />
    </button>
  );
}
