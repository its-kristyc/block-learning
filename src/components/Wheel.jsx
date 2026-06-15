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

// Chord width at label radius 178 ≈ 84 SVG units.
// Per-label font sizes keep every line within that width.
const WEDGE_CONFIG = {
  'Warm Up':                    { lines: ['WARM', 'UP'],                        size: 11 },
  'Foot Work':                  { lines: ['FOOT', 'WORK'],                      size: 11 },
  'Abdominal Work':             { lines: ['ABDOMINAL', 'WORK'],                 size: 11 },
  'Hip Work':                   { lines: ['HIP', 'WORK'],                       size: 11 },
  'Spinal Articulation':        { lines: ['SPINAL', 'ARTICULATION'],            size: 10, xOffset: 7 },
  'Stretches':                  { lines: ['STRETCHES'],                         size: 11 },
  'Full Body Integration I':    { lines: ['FULL BODY', 'INTEGRATION', 'I'],     size: 9.5 },
  'Arm Work':                   { lines: ['ARM', 'WORK'],                       size: 11 },
  'Leg Work':                   { lines: ['LEG', 'WORK'],                       size: 11 },
  'Full Body Integration II':   { lines: ['FULL BODY', 'INTEGRATION', 'II'],    size: 9.5 },
  'Lateral Flexion & Rotation': { lines: ['LATERAL', 'FLEXION &', 'ROTATION'], size: 9.5 },
  'Back Extension':             { lines: ['BACK', 'EXTENSION'],                 size: 11 },
};

export function Wheel({ selected, onSelect, size }) {
  const cx = 250, cy = 250;

  return (
    <svg
      viewBox="0 0 500 500"
      width={size} height={size}
      style={{ display: 'block', flexShrink: 0, transition: 'width .35s ease, height .35s ease' }}
    >
      {BLOCKS.slice(0, 12).map((name, i) => {
        const n = i + 1;
        const center = n === 12 ? 0 : n * 30;
        const a1 = center - 13.6;
        const a2 = center + 13.6;
        const sel = selected === n;
        const [lx, ly] = polar(cx, cy, 178, center);
        const [nx, ny] = polar(cx, cy, 112, center);
        const { lines, size: fontSize, xOffset = 0 } = WEDGE_CONFIG[name] ?? { lines: [name.toUpperCase()], size: 11 };
        const lineHeight = 12;
        // Shift the first line up so the whole block is vertically centred around ly
        const firstY = ly - ((lines.length - 1) * lineHeight) / 2;

        return (
          <g key={n} onClick={() => onSelect(sel ? null : n)} style={{ cursor: 'pointer' }} className="wedge">
            <path
              d={wedgePath(cx, cy, 92, 238, a1, a2)}
              style={{ fill: sel ? C.redDeep : C.wheel, transition: 'fill .2s' }}
            />
            <text
              x={lx + xOffset} y={firstY}
              textAnchor="middle"
              fill="#fff"
              fontWeight="800"
              fontSize={fontSize}
              letterSpacing="0.3"
              style={{ pointerEvents: 'none' }}
            >
              {lines.map((ln, j) => (
                <tspan key={j} x={lx + xOffset} dy={j === 0 ? 0 : lineHeight}>
                  {ln}
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
            <text x={cx} y={cy + 5} textAnchor="middle" fill={C.redDeep}
              fontWeight="800" fontSize="13" letterSpacing="1">
              CLEAR
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
