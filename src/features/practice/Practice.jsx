import { useState } from 'react';
import { C } from '../../styles/tokens.js';
import { EXERCISES, BLOCKS } from '../../data/index.js';
import { LevelPill } from '../../components/LevelPill.jsx';
import { KindBadge } from '../../components/KindBadge.jsx';

const DECK_SIZE = 15;

function Center({ children }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 16px 90px', boxSizing: 'border-box' }}>
      {children}
    </div>
  );
}

function CircleBtn({ onClick, disabled, label, children, primary }) {
  return (
    <button
      onClick={onClick} disabled={disabled} aria-label={label}
      style={{
        width: 40, height: 40, flexShrink: 0, borderRadius: 99,
        border: primary ? 'none' : `1px solid ${C.line}`,
        background: primary ? C.red : C.card,
        color: primary ? '#fff' : (disabled ? '#D5CCC1' : C.ink),
        fontSize: 17, cursor: disabled ? 'default' : 'pointer',
        lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}

export function Practice({ isMobile, openFrom }) {
  const [deck, setDeck]         = useState(null);
  const [idx, setIdx]           = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone]         = useState(false);

  const start = () => {
    const shuffled = [...EXERCISES].sort(() => Math.random() - 0.5).slice(0, DECK_SIZE);
    setDeck(shuffled); setIdx(0); setRevealed(false); setDone(false);
  };

  const go = d => {
    const j = idx + d;
    if (j >= 0 && j < deck.length) { setIdx(j); setRevealed(false); }
  };

  // ── Start screen ──────────────────────────────────────────────────────
  if (!deck) {
    return (
      <Center>
        <div style={{ fontSize: 44 }}>🃏</div>
        <h2 style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700, color: C.ink }}>
          Practice Session
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: C.muted, textAlign: 'center', maxWidth: 380, margin: '10px 0 18px' }}>
          {DECK_SIZE} exercises, shuffled. Each card shows the name, series or group, and apparatus — perform it on your own, then reveal to check yourself.
        </p>
        <button onClick={start} style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: C.red, border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>
          Start — {DECK_SIZE} cards
        </button>
      </Center>
    );
  }

  // ── Completion screen ─────────────────────────────────────────────────
  if (done) {
    return (
      <Center>
        <div style={{ fontSize: 44 }}>🎉</div>
        <h2 style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700, color: C.ink }}>
          Session Complete
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: C.muted, margin: '8px 0 18px' }}>
          {DECK_SIZE} of {DECK_SIZE} — nicely done.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={start} style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', background: C.red, border: 'none', borderRadius: 8, padding: '7px 13px', cursor: 'pointer' }}>
            New session
          </button>
          <button onClick={() => { setDeck(null); setDone(false); }} style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, background: 'none', border: `1px solid ${C.line}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
            Done
          </button>
        </div>
      </Center>
    );
  }

  const e = deck[idx];
  const atEnd = idx === deck.length - 1;

  const card = (
    <div style={{
      width: isMobile ? '100%' : 'min(420px, 78vw)',
      background: C.card, border: `1px solid ${C.line}`,
      borderRadius: 16, padding: isMobile ? '20px 16px' : '24px 24px',
      textAlign: 'center', boxShadow: '0 2px 12px rgba(60,40,20,.06)',
      boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: isMobile ? 10.5 : 11.5, fontWeight: 800, letterSpacing: 1.2, color: C.red, marginBottom: 8 }}>
        BLOCK {e.block} · {BLOCKS[e.block - 1].toUpperCase()}
      </div>
      <div style={{ fontSize: isMobile ? 19 : 25, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.4, color: C.ink, lineHeight: 1.2 }}>
        {e.name}
      </div>
      <div style={{ fontSize: isMobile ? 12 : 13.5, color: C.muted, marginTop: 9, display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {e.collection && (
          <><span>{e.collection.name}</span><KindBadge kind={e.collection.kind} /><span>·</span></>
        )}
        <span>{e.apparatus}</span>
        <span>·</span>
        <LevelPill level={e.level} small />
      </div>

      {revealed && (
        <div style={{ textAlign: 'left', marginTop: 16, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 16 }}>
          <p style={{ margin: '0 0 12px', fontSize: isMobile ? 13.5 : 14, lineHeight: 1.55, color: C.ink }}>
            {e.setup}
          </p>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => openFrom(deck.map(x => x.id), e.id)}
              style={{ fontSize: 12.5, fontWeight: 700, color: C.red, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              View full details →
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const revealBtn = (
    <button
      onClick={() => setRevealed(r => !r)}
      style={{ fontSize: 12.5, fontWeight: 700, color: C.muted, background: C.lineSoft, border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 8 }}
    >
      {revealed ? 'Hide' : 'Reveal'}
    </button>
  );

  // ── Mobile layout ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Center>
        {card}
        <div style={{ marginTop: 16 }}>{revealBtn}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', maxWidth: 320, marginTop: 16 }}>
          <CircleBtn onClick={() => go(-1)} disabled={idx === 0} label="Previous">←</CircleBtn>
          <span style={{ fontSize: 12, color: C.muted }}>{idx + 1} / {DECK_SIZE}</span>
          <CircleBtn onClick={() => atEnd ? setDone(true) : go(1)} disabled={false} label={atEnd ? 'Finish' : 'Next'} primary>
            {atEnd ? '✓' : '→'}
          </CircleBtn>
        </div>
      </Center>
    );
  }

  // ── Desktop layout ────────────────────────────────────────────────────
  return (
    <Center>
      <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, letterSpacing: 1 }}>
        {idx + 1} OF {DECK_SIZE}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <CircleBtn onClick={() => go(-1)} disabled={idx === 0} label="Previous">←</CircleBtn>
        {card}
        <CircleBtn onClick={() => atEnd ? setDone(true) : go(1)} disabled={false} label={atEnd ? 'Finish' : 'Next'} primary>
          {atEnd ? '✓' : '→'}
        </CircleBtn>
      </div>
      <div style={{ marginTop: 18 }}>{revealBtn}</div>
    </Center>
  );
}
