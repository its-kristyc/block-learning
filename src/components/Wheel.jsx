import { C } from '../styles/tokens.js';
import { BLOCKS } from '../data/index.js';

function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function wedgePath(cx, cy, r1, r2, a1, a2) {
  const [x1, y1] = polar(cx, cy, r2, a1);
  const [x2, y2] = polar(cx, cy, r2, a2);
  const [x3, y3] = polar(cx, cy, r1, a2);
  const [x4, y4] = polar(cx, cy, r1, a1);
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
}

function wrapLines(name) {
  const words = name.split(' ');
  if (words.length <= 2) return words;
  if (name === 'Lateral Flexion & Rotation') return ['Lateral', 'Flexion &', 'Rotation'];
  return [words.slice(0, 3).join(' '), words.slice(3).join(' ')].filter(Boolean);
}

export function Wheel({ selected, onSelect, size }) {
  const cx = 250, cy = 250;

  return (
    <svg
      viewBox="0 0 500 500"
      width={size} height={size}
      style={{ display: 'block', flexShrink: 0, transition: 'width .35s ease, height .35s ease' }}
    >
      {BLOCKS.map((name, i) => {
        const n = i + 1;
        const center = n === 12 ? 0 : n * 30;
        const a1 = center - 13.6;
        const a2 = center + 13.6;
        const sel = selected === n;
        const [lx, ly] = polar(cx, cy, 178, center);
        const [nx, ny] = polar(cx, cy, 112, center);
        const lines = wrapLines(name);

        return (
          <g key={n} onClick={() => onSelect(sel ? null : n)} style={{ cursor: 'pointer' }} className="wedge">
            <path
              d={wedgePath(cx, cy, 92, 238, a1, a2)}
              style={{ fill: sel ? C.redDeep : C.wheel, transition: 'fill .2s' }}
            />
            <text
              x={lx} y={ly - (lines.length - 1) * 5.5}
              textAnchor="middle"
              fill="#fff"
              fontWeight="800"
              fontSize="11"
              letterSpacing="0.3"
              style={{ textTransform: 'uppercase', pointerEvents: 'none' }}
            >
              {lines.map((ln, j) => (
                <tspan key={j} x={lx} dy={j === 0 ? 0 : 12}>
                  {ln.toUpperCase()}
                </tspan>
              ))}
            </text>
            {sel && (
              <circle cx={nx} cy={ny} r="17" fill="#fff" style={{ pointerEvents: 'none' }} />
            )}
            <text
              x={nx} y={ny + 7}
              textAnchor="middle"
              fill={sel ? C.redDeep : '#fff'}
              fontWeight="800"
              fontSize="21"
              style={{ pointerEvents: 'none' }}
            >
              {n}
            </text>
          </g>
        );
      })}

      {/* Hub */}
      <g onClick={() => selected && onSelect(null)} style={{ cursor: selected ? 'pointer' : 'default' }}>
        <circle cx={cx} cy={cy} r="90" fill={C.paper} />
        {selected ? (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" fill={C.redDeep}
              fontWeight="800" fontSize="13" letterSpacing="1">
              CLEAR
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill={C.muted}
              fontWeight="700" fontSize="11" letterSpacing="0.5">
              show all
            </text>
          </>
        ) : (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" fill={C.muted}
              fontWeight="800" fontSize="13" letterSpacing="2">
              BLOCK
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill={C.muted}
              fontWeight="800" fontSize="13" letterSpacing="2">
              SYSTEM
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
