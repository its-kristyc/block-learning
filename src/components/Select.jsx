import { useState } from 'react';
import { C } from '../styles/tokens.js';

// Multi-select dropdown. values: string[], onChange: (string[]) => void
export function Select({ values, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const active = values.length > 0;

  const toggle = opt => {
    if (values.includes(opt)) {
      onChange(values.filter(v => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };

  const label = values.length === 0
    ? placeholder
    : values.length === 1
      ? values[0]
      : `${placeholder} (${values.length})`;

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
          maxWidth: 180,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        {active
          ? (
            <span
              onClick={e => { e.stopPropagation(); onChange([]); setOpen(false); }}
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
            minWidth: 160,
            maxHeight: 260,
            overflowY: 'auto',
          }}>
            {options.map(o => {
              const selected = values.includes(o);
              return (
                <button
                  key={o}
                  onClick={() => toggle(o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', textAlign: 'left',
                    fontSize: 12.5,
                    fontWeight: selected ? 700 : 500,
                    color: selected ? C.redDeep : C.ink,
                    background: selected ? C.redSoft : 'none',
                    border: 'none', borderRadius: 7,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{
                    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                    border: `1.5px solid ${selected ? C.red : C.line}`,
                    background: selected ? C.red : 'transparent',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selected && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none"
                        stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
