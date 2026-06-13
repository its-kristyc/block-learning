import { useState, useEffect, useRef, useCallback } from 'react';
import { C } from './styles/tokens.js';
import { useViewport } from './hooks/useViewport.js';
import { storage, emptyUser } from './lib/storage.js';
import { Drawer } from './components/Drawer.jsx';
import { Explore } from './features/explore/Explore.jsx';

// ── Placeholder tabs (implemented in future sessions) ────────────────────
function Programs() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.muted, fontSize: 14 }}>
      Programs — coming soon
    </div>
  );
}
function Practice() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.muted, fontSize: 14 }}>
      Practice — coming soon
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────
const TABS = [
  {
    key: 'explore',
    label: 'Explore',
    // Compass icon
    icon: 'M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20ZM16 8l-2.5 6.5L8 16l2.5-6.5L16 8Z',
  },
  {
    key: 'programs',
    label: 'Programs',
    // Bar chart icon
    icon: 'M4 4h5v16H4zM10 4h5v10h-5zM16 4h5v7h-5z',
  },
  {
    key: 'practice',
    label: 'Practice',
    // Cards / file icon
    icon: 'M6 3h9l3 3v15H6zM6 8h12',
  },
];

function NavIcon({ d }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const { isMobile }      = useViewport();
  const [tab, setTab]     = useState('explore');
  const [user, setUserState] = useState(emptyUser);
  const [drawer, setDrawer]  = useState(null);
  const fileRef           = useRef(null);
  const saveTimer         = useRef(null);
  const leaveGuard        = useRef(null);

  // Load persisted user data on mount
  useEffect(() => {
    storage.load().then(d => {
      if (d) setUserState({ ...emptyUser, ...d });
    });
  }, []);

  // Debounced save on every user state change
  const setUser = useCallback(u => {
    setUserState(u);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => storage.save(u), 600);
  }, []);

  // Guard inter-tab navigation while a draft program is dirty
  const guardedNav = useCallback(fn => {
    if (leaveGuard.current) {
      const ok = leaveGuard.current(fn);
      if (!ok) return;
    }
    fn();
  }, []);

  const toggleFav = id => setUser({
    ...user,
    favorites: user.favorites.includes(id)
      ? user.favorites.filter(f => f !== id)
      : [...user.favorites, id],
  });
  const setNote = (id, text) => setUser({ ...user, notes: { ...user.notes, [id]: text } });
  const openFrom = (list, id) => setDrawer({ list, index: list.indexOf(id) });

  // Export all user data as JSON
  const doExport = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'basi-study-backup.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Import a previously exported JSON backup
  const doImport = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (d && typeof d === 'object') setUser({ ...emptyUser, ...d });
      } catch {
        alert("That file couldn't be read as a backup.");
      }
    };
    r.readAsText(f);
    e.target.value = '';
  };

  // ── Nav items ─────────────────────────────────────────────────────────
  const navItems = TABS.map(({ key, label, icon }) => {
    const on = tab === key;
    return (
      <button
        key={key}
        onClick={() => guardedNav(() => setTab(key))}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          padding: isMobile ? '8px 16px' : '10px 6px',
          background: on && !isMobile ? C.redSoft : 'none',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          color: on ? C.redDeep : C.muted,
          width: isMobile ? 'auto' : 64,
        }}
      >
        <NavIcon d={icon} />
        <span style={{ fontSize: 10.5, fontWeight: 700 }}>{label}</span>
      </button>
    );
  });

  // ── Layout ───────────────────────────────────────────────────────────
  return (
    <div style={{
      color: C.ink, background: C.paper,
      height: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      overflow: 'hidden',
    }}>
      {/* Desktop nav rail */}
      {!isMobile && (
        <nav style={{
          width: 76, flexShrink: 0,
          borderRight: `1px solid ${C.line}`,
          background: C.card,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '14px 6px', gap: 6,
        }}>
          {navItems}
          <div style={{ flex: 1 }} />
          {/* Export / import in the rail */}
          <button
            onClick={doExport}
            title="Export my data"
            style={{
              fontSize: 12.5, fontWeight: 600, color: C.muted,
              background: 'none', border: `1px solid ${C.line}`,
              borderRadius: 8, padding: '5px 8px', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            title="Import a backup"
            style={{
              fontSize: 12.5, fontWeight: 600, color: C.muted,
              background: 'none', border: `1px solid ${C.line}`,
              borderRadius: 8, padding: '5px 8px', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" transform="rotate(180 12 12)" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>
        </nav>
      )}

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        {/* Global header */}
        <header style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: isMobile ? '10px 14px' : '10px 22px',
          borderBottom: `1px solid ${C.line}`,
          background: C.card, flexShrink: 0,
        }}>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.3, color: C.ink }}>
            BASI Block System
          </span>
          <div style={{ flex: 1 }} />

          {/* Mobile: export / import in header */}
          {isMobile && (
            <>
              <button onClick={doExport} title="Export my data"
                style={{
                  fontSize: 12.5, fontWeight: 600, color: C.muted,
                  background: 'none', border: `1px solid ${C.line}`,
                  borderRadius: 8, padding: '6px 9px', cursor: 'pointer',
                  display: 'inline-flex',
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button onClick={() => fileRef.current?.click()} title="Import a backup"
                style={{
                  fontSize: 12.5, fontWeight: 600, color: C.muted,
                  background: 'none', border: `1px solid ${C.line}`,
                  borderRadius: 8, padding: '6px 9px', cursor: 'pointer',
                  display: 'inline-flex',
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" transform="rotate(180 12 12)" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </button>
            </>
          )}

          {/* Data-info tooltip */}
          <span
            className="saveInfo"
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', color: C.muted, cursor: 'help' }}
            tabIndex={0}
            aria-label="How your data is saved"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" strokeLinecap="round" />
              <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
            </svg>
            <span className="saveTip" style={{
              position: 'absolute', top: 28, right: 0,
              width: 230, background: C.ink, color: '#fff',
              fontSize: 11.5, lineHeight: 1.45,
              borderRadius: 8, padding: '9px 11px',
              boxShadow: '0 6px 24px rgba(0,0,0,.22)',
              zIndex: 60, opacity: 0, visibility: 'hidden',
              transition: 'opacity .15s', pointerEvents: 'none', fontWeight: 400,
            }}>
              Your notes, favorites, and programs are saved in this browser on this device.
              They aren't synced or sent anywhere. Use the export button to back them up or
              move them to another device.
            </span>
          </span>
        </header>

        {/* Tab content */}
        <main style={{ flex: 1, minHeight: 0, overflowY: isMobile ? 'auto' : 'hidden' }}>
          {tab === 'explore'  && <Explore  user={user} toggleFav={toggleFav} openFrom={openFrom} isMobile={isMobile} />}
          {tab === 'programs' && <Programs leaveGuard={leaveGuard} />}
          {tab === 'practice' && <Practice />}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <nav style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          background: C.card, borderTop: `1px solid ${C.line}`,
          display: 'flex', justifyContent: 'space-around',
          padding: '4px 0 8px', zIndex: 40,
        }}>
          {navItems}
        </nav>
      )}

      {/* Exercise detail drawer */}
      <Drawer
        ctx={drawer} setCtx={setDrawer}
        user={user} toggleFav={toggleFav} setNote={setNote}
        isMobile={isMobile}
      />

      {/* Hidden file input for import */}
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        onChange={doImport}
        style={{ display: 'none' }}
      />
    </div>
  );
}
