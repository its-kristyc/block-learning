import { Pencil, Trash2 } from 'lucide-react';
import { C } from '../../styles/tokens.js';
import { BLOCKS, byId, blockLabel } from '../../data/index.js';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';

const PencilIcon = () => <Pencil size={15} strokeWidth={2} />;
const TrashIcon = () => <Trash2 size={15} strokeWidth={2} />;

const primaryBtn = {
  fontSize: 12.5, fontWeight: 700, color: '#fff',
  background: C.red, border: 'none', borderRadius: 8,
  padding: '7px 13px', cursor: 'pointer',
};

export function FlowView({ board, back, onEdit, onDelete, onNotesChange, user, openFrom, isMobile }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <h2 style={{ margin: 0, flex: 1, minWidth: 120, fontSize: 19, fontWeight: 800, color: C.ink }}>
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

      <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '16px 18px 0' }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>
          Notes
        </label>
        <textarea
          value={user.notes[`program:${board.id}`] || ''}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Notes on this program — focus, cueing reminders, client considerations…"
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box', resize: 'vertical',
            fontSize: 14, lineHeight: 1.5, color: C.ink, fontFamily: 'inherit',
            background: C.card, border: `1px solid ${C.line}`, borderRadius: 8,
            padding: '10px 12px', outline: 'none',
          }}
        />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '24px 18px 8px' }}>
        {total === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 14 }}>This program is empty.</div>
            <button onClick={onEdit} style={primaryBtn}>Build it</button>
          </div>
        )}

        {blocksWith.map(([n, name, ids]) => ids.length > 0 && (
          <div key={n} style={{ marginBottom: 22 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              paddingBottom: 8, borderBottom: `1px solid ${C.line}`, marginBottom: 10,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Block {blockLabel(n)}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{name}</span>
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
