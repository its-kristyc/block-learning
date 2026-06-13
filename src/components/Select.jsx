import { useState } from 'react';
import { C } from '../styles/tokens.js';

export function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const active = !!value;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 12.5,
          fontWeight: active ? 600 : 400,
          color: active ? C.redDeep : C.muted,
          background: active ? C.redSoft : '#fff',
          border: `1px solid ${active ? C.red : C.line}`,
          borderRadius: 99,
          padding: '5px 10px',
          maxWidth: 170,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        {active
          ? (
            <span
              onClick={e => { e.stopPropagation(); onChange(''); setOpen(false); }}
              aria-label={`Clear ${placeholder} filter`}
              style={{ display: 'inline-flex', color: C.redDeep, cursor: 'pointer' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: 0.55 }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: 34, left: 0, zIndex: 41,
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 10,
            boxShadow: '0 6px 24px rgba(0,0,0,.12)',
            padding: 4,
            minWidth: 150,
            maxHeight: 260,
            overflowY: 'auto',
          }}>
            {options.map(o => (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  fontSize: 12.5,
                  fontWeight: o === value ? 700 : 500,
                  color: o === value ? C.redDeep : C.ink,
                  background: o === value ? C.redSoft : 'none',
                  border: 'none', borderRadius: 7,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
