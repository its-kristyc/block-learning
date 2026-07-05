import { useEffect } from 'react';
import { C } from '../styles/tokens.js';
import { byId, BLOCKS, blockLabel } from '../data/index.js';
import { LevelPill } from './LevelPill.jsx';
import { KindBadge } from './KindBadge.jsx';
import { Heart } from './Heart.jsx';

const chip = {
  fontSize: 12, color: C.ink, background: C.card,
  border: `1px solid ${C.line}`, borderRadius: 99, padding: '3px 10px',
};
const p = { margin: '0 0 6px', fontSize: 14, lineHeight: 1.55, color: C.ink };
const ul = { margin: 0, padding: 0, listStyle: 'none' };
const li = { fontSize: 14, lineHeight: 1.6, color: C.ink, display: 'flex', gap: 8 };

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 11.5, fontWeight: 800, letterSpacing: 0.6,
        textTransform: 'uppercase', color: C.muted, marginBottom: 6,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export function Drawer({ ctx, setCtx, user, toggleFav, setNote, isMobile }) {
  const open = !!ctx;
  const exo = ctx ? byId[ctx.list[ctx.index]] : null;

  useEffect(() => {
    const f = e => { if (e.key === 'Escape') setCtx(null); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [setCtx]);

  if (!open || !exo) return null;

  const sheet = isMobile
    ? {
        position: 'fixed', left: 0, right: 0, bottom: 0, height: '88%',
        borderRadius: '16px 16px 0 0', animation: 'slideUp .25s ease',
      }
    : {
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(58%, 640px)', animation: 'slideIn .25s ease',
      };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div
        onClick={() => setCtx(null)}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(34,24,18,.42)', animation: 'fadeIn .25s ease',
        }}
      />
      <div style={{
        ...sheet,
        background: C.card,
        boxShadow: '-8px 0 32px rgba(0,0,0,.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px 10px',
          borderBottom: `1px solid ${C.line}`,
          background: C.card,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h2 style={{
              margin: 0, flex: 1, fontSize: 26, fontWeight: 500, color: C.ink,
              fontFamily: 'var(--font-display)', letterSpacing: 0.3, lineHeight: 1.2,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {exo.name}
              <Heart
                on={user.favorites.includes(exo.id)}
                onClick={() => toggleFav(exo.id)}
                size={20}
              />
            </h2>
            <button
              onClick={() => setCtx(null)}
              aria-label="Close"
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: `1px solid ${C.line}`, background: C.card,
                color: C.ink, fontSize: 16, cursor: 'pointer',
                lineHeight: 1, flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
            <span style={chip}>Block {blockLabel(exo.block)} · {BLOCKS[exo.block - 1]}</span>
            {exo.collection && (
              <span style={{ ...chip, display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                {exo.collection.name} <KindBadge kind={exo.collection.kind} />
              </span>
            )}
            <span style={chip}>{exo.apparatus}</span>
            <LevelPill level={exo.level} />
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 24px' }}>
          {/* Images */}
          {exo.image && exo.image.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {exo.image.map((src, i) => (
                <img key={i} src={src} alt={`${exo.name} ${i + 1}`}
                  style={{ width: '100%', height: 'auto', borderRadius: 10, display: 'block' }} />
              ))}
            </div>
          ) : (
            <div style={{
              width: '100%', height: 56,
              background: C.paper, border: `1px dashed ${C.line}`,
              borderRadius: 10, marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#B9AFA3', fontSize: 12,
            }}>
              No image yet
            </div>
          )}

          <Section label="Description">
            <p style={p}>{exo.setup}</p>
            {exo.resistance && (
              <p style={{ ...p, fontStyle: 'italic', color: C.muted, whiteSpace: 'pre-line' }}>
                Resistance: {exo.resistance}
              </p>
            )}
          </Section>

          {exo.movement && exo.movement.length > 0 && (
            <Section label="Movement">
              {exo.movement.map((step, i) => (
                <p key={i} style={p}>
                  <b style={{ color: C.redDeep }}>
                    {step.breath.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}:
                  </b>{' '}{step.action}
                </p>
              ))}
            </Section>
          )}

          <Section label="Muscle focus">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {exo.muscleFocus.map(m => (
                <span key={m} style={{
                  ...chip, background: C.redSoft,
                  borderColor: 'transparent', color: C.redDeep, fontWeight: 600,
                }}>
                  {m}
                </span>
              ))}
            </div>
          </Section>

          <Section label="Objectives">
            <ul style={ul}>
              {exo.objectives.map(o => (
                <li key={o} style={li}>
                  <span style={{ color: C.muted }}>—</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section label="Cues">
            <ul style={ul}>
              {exo.cues.map(c => (
                <li key={c} style={li}>
                  <span style={{ color: C.muted }}>—</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section label="My notes">
            <textarea
              value={user.notes[exo.id] || ''}
              onChange={e => setNote(exo.id, e.target.value)}
              placeholder="Spring settings, corrections from class, what to feel…"
              style={{
                width: '100%', minHeight: 96, boxSizing: 'border-box',
                fontSize: 14, lineHeight: 1.5, color: C.ink,
                background: C.paper, border: `1px solid ${C.line}`,
                borderRadius: 10, padding: '10px 12px',
                resize: 'vertical', outline: 'none',
              }}
            />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Saved automatically</div>
          </Section>
        </div>
      </div>
    </div>
  );
}
