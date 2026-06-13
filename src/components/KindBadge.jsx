import { C } from '../styles/tokens.js';

export function KindBadge({ kind }) {
  const isSeries = kind === 'series';
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color:      isSeries ? C.redDeep : C.gold,
      background: isSeries ? C.redSoft : C.goldSoft,
      borderRadius: 4,
      padding: '1px 5px',
    }}>
      {kind}
    </span>
  );
}
