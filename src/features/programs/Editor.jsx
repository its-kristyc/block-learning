import { useState, useRef, useMemo } from 'react';
import { C } from '../../styles/tokens.js';
import { EXERCISES, BLOCKS, byId, apparatusRank, BLOCK_DISPLAY_ORDER } from '../../data/index.js';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';
import { KindBadge } from '../../components/KindBadge.jsx';
import { Select } from '../../components/Select.jsx';
import { MobileBlockRows } from './MobileBlockRows.jsx';

const primaryBtn = {
  fontSize: 12.5, fontWeight: 700, color: '#fff',
  background: C.red, border: 'none', borderRadius: 8,
  padding: '7px 13px', cursor: 'pointer',
};

function LibrarySearch({ q, setQ }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search exercises…"
        style={{
          fontSize: 13, padding: '6px 10px 6px 30px',
          border: `1px solid ${C.line}`, borderRadius: 8,
          outline: 'none', background: '#fff',
          width: '100%', boxSizing: 'border-box',
        }}
      />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"
        style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
      </svg>
      {q && (
        <button onClick={() => setQ('')} aria-label="Clear search"
          style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', lineHeight: 1, display: 'inline-flex' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
      )}
    </div>
  );
}

function BoardRow({ e, onRemove, onOpen }) {
  if (!e) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: '7px 8px', cursor: 'grab' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill={C.muted} style={{ flexShrink: 0, opacity: 0.55 }}>
          <circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/>
          <circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/>
          <circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/>
        </svg>
        <div onClick={onOpen} style={{ fontWeight: 600, fontSize: 12.5, cursor: 'pointer', flex: 1, lineHeight: 1.3, color: C.ink }}>
          {e.name}
        </div>
        <button onClick={onRemove} aria-label="Remove"
          style={{ border: 'none', background: 'none', color: C.redDeep, cursor: 'pointer', padding: '2px 4px', flexShrink: 0, lineHeight: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, marginLeft: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10.5, color: C.muted }}>{e.apparatus}</span>
        {e.collection && (
          <>
            <span style={{ fontSize: 10.5, color: C.muted }}>·</span>
            <span style={{ fontSize: 10.5, color: C.muted }}>{e.collection.name}</span>
            <KindBadge kind={e.collection.kind} />
          </>
        )}
      </div>
    </div>
  );
}

export function Editor({ draft, setDraft, onSave, onCancel, openFrom, isMobile }) {
  const [pickQ, setPickQ]         = useState('');
  const [libFilters, setLibFilters] = useState({ apparatus: [], block: [] });
  const [pickerBlock, setPickerBlock] = useState(null); // mobile only
  const drag      = useRef(null);
  const [dropHint, setDropHint]   = useState(null);

  const add = (blockN, exId) => {
    const arr = draft.blocks[blockN] || [];
    if (arr.includes(exId)) return;
    setDraft({ ...draft, blocks: { ...draft.blocks, [blockN]: [...arr, exId] } });
  };
  const remove = (blockN, exId) => setDraft({
    ...draft,
    blocks: { ...draft.blocks, [blockN]: (draft.blocks[blockN] || []).filter(i => i !== exId) },
  });
  const move = (blockN, idx, dir) => {
    const arr = [...(draft.blocks[blockN] || [])];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setDraft({ ...draft, blocks: { ...draft.blocks, [blockN]: arr } });
  };

  const handleDrop = (toBlock, toIdx) => {
    const d = drag.current;
    drag.current = null;
    setDropHint(null);
    if (!d) return;
    const blocks = JSON.parse(JSON.stringify(draft.blocks));
    if (d.fromBlock != null) {
      blocks[d.fromBlock] = (blocks[d.fromBlock] || []).filter(i => i !== d.exId);
    }
    const target = (blocks[toBlock] || []).filter(i => i !== d.exId);
    const at = toIdx == null ? target.length : Math.max(0, Math.min(toIdx, target.length));
    if (d.fromBlock == null && (draft.blocks[toBlock] || []).includes(d.exId)) return;
    target.splice(at, 0, d.exId);
    blocks[toBlock] = target;
    setDraft({ ...draft, blocks });
  };

  const libApparatuses = useMemo(() => (
    [...new Set(EXERCISES.map(e => e.apparatus))].sort((a, b) => apparatusRank(a) - apparatusRank(b))
  ), []);
  const blockOptions = BLOCK_DISPLAY_ORDER.map(n => BLOCKS[n - 1]);
  const searchingLib = pickQ.trim().length > 0;
  const pickerList = searchingLib
    ? EXERCISES.filter(e => e.name.toLowerCase().includes(pickQ.toLowerCase()))
    : EXERCISES.filter(e =>
        (!libFilters.apparatus.length || libFilters.apparatus.includes(e.apparatus)) &&
        (!libFilters.block.length || libFilters.block.includes(BLOCKS[e.block - 1]))
      );

  const header = (
    <div style={{ padding: isMobile ? '12px 14px 8px' : '16px 18px 10px', flexShrink: 0 }}>
      <button onClick={onCancel} style={{ fontSize: 13, fontWeight: 600, color: C.redDeep, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
        ← Back
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
        <input
          value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          style={{
            fontSize: 17, fontWeight: 800, color: C.ink,
            background: 'transparent', border: 'none',
            borderBottom: `1px dashed ${C.line}`,
            outline: 'none', flex: 1, minWidth: 140, padding: '4px 2px',
          }}
        />
        <button onClick={onSave} style={primaryBtn}>Save</button>
      </div>
    </div>
  );

  // ── Mobile layout ────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ paddingBottom: 90 }}>
        {header}
        <div style={{ padding: '4px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {BLOCKS.map((name, i) => {
            const n = i + 1;
            const ids = draft.blocks[n] || [];
            return (
              <div key={n} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: ids.length ? 8 : 0 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: C.red }}>{n}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1, color: C.ink }}>{name}</span>
                  <button
                    onClick={() => { setPickerBlock(n); setPickQ(''); }}
                    style={{ fontSize: 11.5, fontWeight: 600, color: C.redDeep, background: 'none', border: `1px solid ${C.line}`, borderRadius: 8, padding: '4px 9px', cursor: 'pointer' }}
                  >
                    + Add
                  </button>
                </div>
                <MobileBlockRows
                  ids={ids} blockN={n}
                  onReorder={newIds => setDraft({ ...draft, blocks: { ...draft.blocks, [n]: newIds } })}
                  onRemove={id => remove(n, id)}
                  onOpen={id => openFrom(ids, id)}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile add-exercise picker sheet */}
        {pickerBlock && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
            <div onClick={() => setPickerBlock(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(34,24,18,.42)' }} />
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, height: '75%',
              background: C.paper, borderRadius: '16px 16px 0 0',
              padding: '14px 14px 20px', display: 'flex', flexDirection: 'column',
              animation: 'slideUp .25s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 14, textTransform: 'uppercase', color: C.ink }}>
                  Add to {BLOCKS[pickerBlock - 1]}
                </span>
                <div style={{ flex: 1 }} />
                <button onClick={() => setPickerBlock(null)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`, background: C.card, color: C.ink, fontSize: 16, cursor: 'pointer', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18"/>
                  </svg>
                </button>
              </div>
              <LibrarySearch q={pickQ} setQ={setPickQ} />
              {!searchingLib && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  <Select
                    values={libFilters.apparatus}
                    onChange={v => setLibFilters(f => ({ ...f, apparatus: v }))}
                    options={libApparatuses}
                    placeholder="Apparatus"
                  />
                  <Select
                    values={libFilters.block}
                    onChange={v => setLibFilters(f => ({ ...f, block: v }))}
                    options={blockOptions}
                    placeholder="Block"
                  />
                </div>
              )}
              <div style={{ flex: 1, overflowY: 'auto', marginTop: 10, paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pickerList.map(e => (
                  <div key={e.id}
                    onClick={() => { add(pickerBlock, e.id); setPickerBlock(null); }}
                    style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: '9px 12px', cursor: 'pointer' }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: C.ink }}>{e.name}</span>
                    <span style={{ fontSize: 11.5, color: C.muted, marginLeft: 8 }}>{e.apparatus} · Block {e.block} · {e.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Desktop layout ───────────────────────────────────────────────────
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {header}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, margin: '0 18px 18px', border: `1px solid ${C.line}`, borderRadius: 12, overflow: 'hidden' }}>
        {/* Library palette */}
        <div style={{ width: 270, borderRight: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', padding: '10px 12px', background: C.card }}>
          <LibrarySearch q={pickQ} setQ={setPickQ} />
          {!searchingLib && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              <Select
                values={libFilters.apparatus}
                onChange={v => setLibFilters(f => ({ ...f, apparatus: v }))}
                options={libApparatuses}
                placeholder="Apparatus"
              />
              <Select
                values={libFilters.block}
                onChange={v => setLibFilters(f => ({ ...f, block: v }))}
                options={blockOptions}
                placeholder="Block"
              />
            </div>
          )}
          <div style={{ flex: 1, overflowY: 'auto', marginTop: 10, paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pickerList.map(e => (
              <ExerciseCard key={e.id} exo={e} compact draggable
                onDragStart={ev => { drag.current = { exId: e.id, fromBlock: null }; ev.dataTransfer.effectAllowed = 'copyMove'; }}
                onOpen={() => openFrom(pickerList.map(x => x.id), e.id)}
              />
            ))}
          </div>
        </div>

        {/* Kanban board */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', display: 'flex', gap: 10, padding: '12px 14px 18px', alignItems: 'stretch' }}>
          {BLOCKS.map((name, i) => {
            const n = i + 1;
            const ids = draft.blocks[n] || [];
            const hintHere = dropHint && dropHint.block === n ? dropHint.idx : null;
            return (
              <div key={n}
                onDragOver={e => { e.preventDefault(); if (drag.current && ids.length === 0) setDropHint({ block: n, idx: 0 }); }}
                onDrop={e => { e.preventDefault(); handleDrop(n, hintHere); }}
                style={{
                  width: 215, flexShrink: 0, background: C.lineSoft, borderRadius: 12,
                  padding: '10px 10px 12px', display: 'flex', flexDirection: 'column',
                  border: `1px dashed ${ids.length ? 'transparent' : C.line}`,
                }}
              >
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.red }}>{n}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.4, lineHeight: 1.25, color: C.ink }}>{name}</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {ids.length === 0 && hintHere === 0 && (
                    <div style={{ height: 2, background: C.red, borderRadius: 2, margin: '8px 2px' }} />
                  )}
                  {ids.map((id, idx) => {
                    const e = byId[id];
                    return (
                      <div key={id}
                        onDragOver={ev => {
                          ev.preventDefault();
                          if (!drag.current) return;
                          const r = ev.currentTarget.getBoundingClientRect();
                          const after = ev.clientY > r.top + r.height / 2;
                          setDropHint({ block: n, idx: after ? idx + 1 : idx });
                        }}
                        style={{ paddingTop: 6 }}
                      >
                        {hintHere === idx && <div style={{ height: 2, background: C.red, borderRadius: 2, margin: '0 2px 4px' }} />}
                        <div draggable
                          onDragStart={ev => { drag.current = { exId: id, fromBlock: n }; ev.dataTransfer.effectAllowed = 'move'; }}
                          onDragEnd={() => { drag.current = null; setDropHint(null); }}
                        >
                          <BoardRow
                            e={e}
                            onRemove={() => remove(n, id)}
                            onOpen={() => openFrom(ids, id)}
                          />
                        </div>
                        {hintHere === idx + 1 && idx === ids.length - 1 && (
                          <div style={{ height: 2, background: C.red, borderRadius: 2, margin: '4px 2px 0' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
