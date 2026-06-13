import { lvlColor, lvlBg } from '../styles/tokens.js';

export function LevelPill({ level, small }) {
  return (
    <span style={{
      fontSize: small ? 11 : 12,
      fontWeight: 500,
      color: lvlColor[level],
      background: lvlBg[level],
      borderRadius: 99,
      padding: small ? '1px 8px' : '3px 10px',
      whiteSpace: 'nowrap',
    }}>
      {level}
    </span>
  );
}
