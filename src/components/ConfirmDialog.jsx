import { C } from '../styles/tokens.js';

const primaryBtn = {
  fontSize: 12.5, fontWeight: 700, color: '#fff',
  background: C.red, border: 'none', borderRadius: 8,
  padding: '7px 13px', cursor: 'pointer',
};
const ghostBtn = {
  fontSize: 12.5, fontWeight: 600, color: C.muted,
  background: 'none', border: `1px solid ${C.line}`,
  borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
};

export function ConfirmDialog({ title, body, confirmLabel, confirmDanger, onConfirm, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(34,24,18,.45)', animation: 'fadeIn .2s ease' }}
      />
      <div style={{
        position: 'relative', background: C.card, borderRadius: 14,
        padding: '20px 22px', width: 'min(360px, 88vw)', boxSizing: 'border-box',
        boxShadow: '0 10px 40px rgba(0,0,0,.25)', animation: 'slideUp .2s ease',
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5, marginBottom: 16 }}>{body}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{ ...primaryBtn, background: confirmDanger ? C.redDeep : C.red }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
