import { useState, useRef } from 'react';
import { GripVertical, X } from 'lucide-react';
import { C } from '../../styles/tokens.js';
import { byId } from '../../data/index.js';
import { KindBadge } from '../../components/KindBadge.jsx';

export function MobileBlockRows({ ids, blockN, onReorder, onRemove, onOpen }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const dragIdxRef = useRef(null);
  const overIdxRef = useRef(null);
  const holdTimer = useRef(null);
  const startY = useRef(0);
  const rowRefs = useRef({});
  const movedRef = useRef(false);

  const cancelHold = () => { clearTimeout(holdTimer.current); holdTimer.current = null; };
  const setDrag = v => { dragIdxRef.current = v; setDragIdx(v); };
  const setOver = v => { overIdxRef.current = v; setOverIdx(v); };

  const findTarget = y => {
    let target = dragIdxRef.current;
    for (const k of Object.keys(rowRefs.current)) {
      const el = rowRefs.current[k];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (y >= r.top && y <= r.bottom) { target = Number(k); break; }
      if (y < r.top) target = Math.min(target, Number(k));
      if (y > r.bottom) target = Math.max(target, Number(k));
    }
    return target;
  };

  const onPointerDown = (idx, e) => {
    if (e.button === 2) return;
    startY.current = e.clientY;
    movedRef.current = false;

    const move = ev => {
      const y = ev.clientY;
      if (dragIdxRef.current === null) {
        if (Math.abs(y - startY.current) > 8) cancelHold();
        return;
      }
      ev.preventDefault();
      movedRef.current = true;
      setOver(findTarget(y));
    };

    const up = () => {
      cancelHold();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const d = dragIdxRef.current, o = overIdxRef.current;
      if (d !== null && o !== null && o !== d) {
        const next = [...ids];
        const [moved] = next.splice(d, 1);
        next.splice(o, 0, moved);
        onReorder(next);
      } else if (d === null && !movedRef.current) {
        onOpen(ids[idx]);
      }
      setDrag(null); setOver(null);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    holdTimer.current = setTimeout(() => {
      setDrag(idx); setOver(idx);
      if (navigator.vibrate) navigator.vibrate(15);
    }, 350);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {ids.map((id, idx) => {
        const e = byId[id];
        if (!e) return null;
        const dragging = dragIdx === idx;
        const showLineBefore = dragIdx !== null && overIdx === idx && overIdx < dragIdx;
        const showLineAfter  = dragIdx !== null && overIdx === idx && overIdx > dragIdx;
        return (
          <div key={id} ref={el => (rowRefs.current[idx] = el)}>
            {showLineBefore && <div style={{ height: 2, background: C.red, borderRadius: 2, marginBottom: 5 }} />}
            <div
              onPointerDown={ev => onPointerDown(idx, ev)}
              style={{
                background: C.card,
                border: `1px solid ${dragging ? C.red : C.line}`,
                borderRadius: 8, padding: '9px 10px',
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: dragging ? 0.92 : 1,
                boxShadow: dragging ? '0 6px 18px rgba(0,0,0,.16)' : 'none',
                transform: dragging ? 'scale(1.02)' : 'none',
                transition: dragging ? 'none' : 'box-shadow .15s',
                touchAction: 'pan-y', cursor: 'grab', userSelect: 'none',
              }}
            >
              {/* Drag handle dots */}
              <GripVertical size={13} color={C.muted} style={{ flexShrink: 0, opacity: 0.5 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.3 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2, display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>{e.apparatus}</span>
                  {e.collection && (
                    <><span>·</span><span>{e.collection.name}</span><KindBadge kind={e.collection.kind} /></>
                  )}
                </div>
              </div>
              <button
                onPointerDown={ev => ev.stopPropagation()}
                onClick={() => onRemove(id)}
                aria-label="Remove"
                style={{ border: 'none', background: 'none', color: C.redDeep, fontSize: 16, padding: '4px 6px', flexShrink: 0, cursor: 'pointer' }}
              >
                <X size={14} strokeWidth={2.4} />
              </button>
            </div>
            {showLineAfter && <div style={{ height: 2, background: C.red, borderRadius: 2, marginTop: 5 }} />}
          </div>
        );
      })}
    </div>
  );
}
