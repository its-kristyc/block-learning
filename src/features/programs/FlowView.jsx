import { C } from '../../styles/tokens.js';
import { BLOCKS, byId } from '../../data/index.js';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
  </svg>
);

const primaryBtn = {
  fontSize: 12.5, fontWeight: 700, color: '#fff',
  background: C.red, border: 'none', borderRadius: 8,
  padding: '7px 13px', cursor: 'pointer',
};

export function FlowView({ board, back, onEdit, onDelete, user, openFrom, isMobile }) {
  const blocksWith = BLOCKS.map((name, i) => [i + 1, name, board.blocks[i + 1] || []]);
  const total = blocksWith.reduce((s, [, , a]) => s + a.length, 0);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: isMobile ? 90 : 30 }}>
      <div style={{
        maxWidth: 680, margin: '0 auto', width: '100%', boxSizing: 'border-box',
        padding: isMobile ? '12px 14px 8px' : '16px 18px 10px',
      }}>
        <button onClick={back} style={{ fontSize: 13, fontWeight: 600, color: C.redDeep, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <h2 style={{ margin: 0, flex: 1, minWidth: 120, fontSize: 19, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: C.ink }}>
            {board.name}
          </h2>
          <button onClick={onEdit} title="Edit" aria-label="Edit program"
            className="menuDots"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 6, display: 'inline-flex', borderRadius: 6 }}>
            <PencilIcon />
          </button>
          <button onClick={onDelete} title="Delete" aria-label="Delete program"
            className="menuDots"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.redDeep, padding: 6, display: 'inline-flex', borderRadius: 6 }}>
            <TrashIcon />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '8px 18px' }}>
        {total === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 14 }}>This program is empty.</div>
            <button onClick={onEdit} style={primaryBtn}>Build it</button>
          </div>
        )}

        {blocksWith.map(([n, name, ids]) => ids.length > 0 && (
          <div key={n} style={{ marginBottom: 22 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.redSoft, borderRadius: 8, padding: '6px 11px', marginBottom: 10,
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: C.redDeep }}>{n}</span>
              <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: C.redDeep }}>{name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {ids.map(id => {
                const e = byId[id];
                if (!e) return null;
                return <ExerciseCard key={id} exo={e} onOpen={() => openFrom(ids, id)} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
