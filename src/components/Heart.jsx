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
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill={on ? C.red : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
