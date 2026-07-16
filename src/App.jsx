import { useState, useEffect, useRef, useCallback } from 'react';
import { Compass, BarChart3, Layers, Info } from 'lucide-react';
import { C } from './styles/tokens.js';
import { useViewport } from './hooks/useViewport.js';
import { storage, emptyUser } from './lib/storage.js';
import { onAuth, isConfigured } from './lib/supabase.js';
import { Drawer } from './components/Drawer.jsx';
import { Account } from './components/Account.jsx';
import { Explore } from './features/explore/Explore.jsx';
import { Programs } from './features/programs/Programs.jsx';
import { Practice } from './features/practice/Practice.jsx';

// ── Nav config ────────────────────────────────────────────────────────────
const TABS = [
  { key: 'explore',  label: 'Explore',  Icon: Compass },
  { key: 'programs', label: 'Programs', Icon: BarChart3 },
  { key: 'practice', label: 'Practice', Icon: Layers },
];

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const { isMobile }      = useViewport();
  const [tab, setTab]     = useState('explore');
  const [user, setUserState] = useState(emptyUser);
  const [session, setSession] = useState(null);
  const [drawer, setDrawer]  = useState(null);
  const saveTimer         = useRef(null);
  const leaveGuard        = useRef(null);
  const sessionRef        = useRef(null);

  // Track the auth session; reload data whenever it changes (sign-in/out).
  useEffect(() => {
    return onAuth(s => {
      sessionRef.current = s;
      setSession(s);
      storage.load(s).then(d => {
        setUserState(d ? { ...emptyUser, ...d } : emptyUser);
      });
    });
  }, []);

  // Debounced save on every user state change (local now, cloud when signed in)
  const setUser = useCallback(u => {
    setUserState(u);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => storage.save(u, sessionRef.current), 600);
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

  // ── Nav items ─────────────────────────────────────────────────────────
  const navItems = TABS.map(({ key, label, Icon }) => {
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
        <Icon size={20} strokeWidth={1.8} />
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
        </nav>
      )}

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        {/* Global header */}
        <header style={{
          display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10,
          padding: isMobile ? '14px 12px' : '16px 22px',
          borderBottom: `1px solid ${C.line}`,
          background: C.card, flexShrink: 0,
        }}>
          <span style={{
            fontWeight: 700, fontSize: isMobile ? 16 : 20, color: C.ink, lineHeight: 1.1,
            minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            BASI Block System
          </span>

          {/* Data-info tooltip */}
          <span
            className="saveInfo"
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0, color: C.muted, cursor: 'help' }}
            tabIndex={0}
            aria-label="How your data is saved"
          >
            <Info size={17} strokeWidth={2} />
            <span className="saveTip" style={{
              position: 'absolute', top: 28, left: 0,
              width: 230, background: C.ink, color: '#fff',
              fontSize: 11.5, lineHeight: 1.45,
              borderRadius: 8, padding: '9px 11px',
              boxShadow: '0 6px 24px rgba(0,0,0,.22)',
              zIndex: 60, opacity: 0, visibility: 'hidden',
              transition: 'opacity .15s', pointerEvents: 'none', fontWeight: 400,
            }}>
              {session
                ? `Signed in as ${session.user.email}. Your notes, favorites, and programs sync across every device you sign in on.`
                : isConfigured
                ? "Your notes, favorites, and programs are saved on this device. Sign in to sync them across devices."
                : "Your notes, favorites, and programs are saved in this browser on this device. They aren't synced or sent anywhere."}
            </span>
          </span>

          <div style={{ flex: 1 }} />

          <Account session={session} isMobile={isMobile} />

          {!isMobile && (
            <span style={{
              fontSize: 10.5, fontWeight: 500, color: C.muted,
              userSelect: 'none', whiteSpace: 'nowrap',
            }}>
              BASI students only &nbsp;·&nbsp; Designed and vibe-coded by Kristy 🤍
            </span>
          )}
        </header>

        {/* Tab content */}
        <main style={{ flex: 1, minHeight: 0, overflowY: isMobile ? 'auto' : 'hidden' }}>
          {tab === 'explore'  && <Explore  user={user} toggleFav={toggleFav} openFrom={openFrom} isMobile={isMobile} />}
          {tab === 'programs' && <Programs user={user} setUser={setUser} openFrom={openFrom} isMobile={isMobile} leaveGuard={leaveGuard} />}
          {tab === 'practice' && <Practice isMobile={isMobile} openFrom={openFrom} />}
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

    </div>
  );
}
