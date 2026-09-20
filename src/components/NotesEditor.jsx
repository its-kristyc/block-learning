import { useRef } from 'react';
import { Bold, Italic } from 'lucide-react';
import { C } from '../styles/tokens.js';

// Minimal markdown-style formatting: **bold**, *italic*, ***both***.
// Plain text stays plain text if no markers are typed — nothing to migrate.
const MARKUP_RE = /(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;

export function renderNotesMarkup(text) {
  if (!text) return null;
  return text.split(MARKUP_RE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      return <strong key={i}><em>{part.slice(3, -3)}</em></strong>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function wrapSelection(el, value, onChange, marker) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);

  const isWrapped = selected.length >= marker.length * 2
    && selected.startsWith(marker) && selected.endsWith(marker);

  let next, selStart, selEnd;
  if (isWrapped) {
    const inner = selected.slice(marker.length, selected.length - marker.length);
    next = before + inner + after;
    selStart = start;
    selEnd = start + inner.length;
  } else if (selected) {
    next = before + marker + selected + marker + after;
    selStart = start + marker.length;
    selEnd = end + marker.length;
  } else {
    next = before + marker + marker + after;
    selStart = selEnd = start + marker.length;
  }

  onChange(next);
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(selStart, selEnd);
  });
}

const toolbarBtn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 28, border: `1px solid ${C.line}`, borderRadius: 6,
  background: C.card, color: C.ink, cursor: 'pointer', padding: 0,
};

export function NotesEditor({ value, onChange, placeholder, minHeight = 96, background = C.paper }) {
  const ref = useRef(null);

  const applyMarker = marker => {
    if (ref.current) wrapSelection(ref.current, value || '', onChange, marker);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        <button
          type="button"
          title="Bold"
          aria-label="Bold"
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyMarker('**')}
          style={toolbarBtn}
        >
          <Bold size={13} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          title="Italic"
          aria-label="Italic"
          onMouseDown={e => e.preventDefault()}
          onClick={() => applyMarker('*')}
          style={toolbarBtn}
        >
          <Italic size={13} strokeWidth={2.25} />
        </button>
      </div>

      <textarea
        ref={ref}
        className="noteField"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight, boxSizing: 'border-box',
          fontSize: 14, lineHeight: 1.5, color: C.ink,
          background, border: `1px solid ${C.line}`,
          borderRadius: 10, padding: '10px 12px',
          resize: 'vertical', outline: 'none', fontFamily: 'inherit',
        }}
      />

      {value && (
        <div style={{
          fontSize: 13, lineHeight: 1.5, color: C.muted, marginTop: 6,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {renderNotesMarkup(value)}
        </div>
      )}
    </div>
  );
}
