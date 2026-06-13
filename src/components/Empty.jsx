import { C } from '../styles/tokens.js';

export function Empty({ msg }) {
  return (
    <div style={{
      padding: '40px 16px',
      textAlign: 'center',
      color: C.muted,
      fontSize: 14,
    }}>
      {msg}
    </div>
  );
}
