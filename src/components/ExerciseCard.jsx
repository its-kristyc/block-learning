import { C } from '../styles/tokens.js';
import { LevelPill } from './LevelPill.jsx';
import { Heart } from './Heart.jsx';

export function ExerciseCard({ exo, fav, onFav, onOpen, draggable, onDragStart, compact, indicator }) {
  return (
    <div
      onClick={onOpen}
      draggable={draggable}
      onDragStart={onDragStart}
      className="exCard"
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: compact ? '10px 12px' : '12px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: draggable ? 'grab' : 'pointer',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: compact ? 15 : 17, color: C.ink, lineHeight: 1.2 }}>
            {exo.name}
          </span>
          <LevelPill level={exo.level} small />
        </div>
        <div style={{
          fontSize: 12, color: C.muted, marginTop: 5,
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        }}>
          {exo.collection && (
            <>
              <span>{exo.collection.name}</span>
              <span>·</span>
            </>
          )}
          <span>{exo.apparatus}</span>
        </div>
      </div>
      {indicator ?? (onFav && <Heart on={fav} onClick={onFav} />)}
    </div>
  );
}
