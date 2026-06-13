import { C } from '../styles/tokens.js';
import { LevelPill } from './LevelPill.jsx';
import { KindBadge } from './KindBadge.jsx';
import { Heart } from './Heart.jsx';

export function ExerciseCard({ exo, fav, onFav, onOpen, draggable, onDragStart, compact }) {
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
          {!compact && <LevelPill level={exo.level} small />}
        </div>
        <div style={{
          fontSize: 12, color: C.muted, marginTop: 6,
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        }}>
          {exo.collection && (
            <>
              <span>{exo.collection.name}</span>
              <KindBadge kind={exo.collection.kind} />
              <span>·</span>
            </>
          )}
          <span>{exo.apparatus}</span>
          {compact && <><span>·</span><span>{exo.level}</span></>}
        </div>
      </div>
      {onFav && <Heart on={fav} onClick={onFav} />}
    </div>
  );
}
