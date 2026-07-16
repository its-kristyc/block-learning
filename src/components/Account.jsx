import { useState } from 'react';
import { Cloud, CloudOff, X } from 'lucide-react';
import { C } from '../styles/tokens.js';
import { sendMagicLink, signOut, isConfigured } from '../lib/supabase.js';

// Header control for cloud sync. Signed out → "Sign in to sync" button that
// opens a magic-link modal. Signed in → email + "Sign out". When Supabase
// isn't configured yet, renders nothing (app stays in local-only mode).
export function Account({ session, isMobile }) {
  const [open, setOpen]   = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [errMsg, setErr]  = useState('');

  if (!isConfigured) return null;

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setState('sending');
    try {
      const { error } = await sendMagicLink(email.trim());
      if (error) throw error;
      setState('sent');
    } catch (err) {
      setErr(err.message || 'Something went wrong');
      setState('error');
    }
  }

  function close() {
    setOpen(false);
    setState('idle');
    setEmail('');
    setErr('');
  }

  // ── Signed in ─────────────────────────────────────────────────────────
  if (session) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, whiteSpace: 'nowrap' }}>
        <Cloud size={15} strokeWidth={2} color={C.gold} />
        {!isMobile && (
          <span style={{ fontSize: 11.5, color: C.muted, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {session.user.email}
          </span>
        )}
        <button
          onClick={() => signOut()}
          style={{
            fontSize: 11, fontWeight: 600, color: C.muted,
            background: 'none', border: `1px solid ${C.line}`,
            borderRadius: 7, padding: '4px 9px', cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </span>
    );
  }

  // ── Signed out ────────────────────────────────────────────────────────
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap',
          fontSize: 11.5, fontWeight: 700, color: C.redDeep,
          background: C.redSoft, border: 'none',
          borderRadius: 8, padding: '6px 11px', cursor: 'pointer',
        }}
      >
        <CloudOff size={15} strokeWidth={2} />
        {isMobile ? 'Sync' : 'Sign in to sync'}
      </button>

      {open && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(64,58,58,.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 340, maxWidth: '100%', background: C.card,
              borderRadius: 16, padding: 22,
              boxShadow: '0 18px 50px rgba(0,0,0,.28)', position: 'relative',
            }}
          >
            <button
              onClick={close}
              aria-label="Close"
              style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}
            >
              <X size={18} />
            </button>

            {state === 'sent' ? (
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.ink, margin: '2px 0 8px' }}>Check your email</h2>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: C.muted, margin: 0 }}>
                  We sent a sign-in link to <strong style={{ color: C.ink }}>{email}</strong>.
                  Open it on this device to turn on sync. You can close this window.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.ink, margin: '2px 0 6px' }}>Sync across devices</h2>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: C.muted, margin: '0 0 14px' }}>
                  Enter your email and we'll send a one-tap sign-in link. No password.
                  Your programs and notes will follow you to any device you sign in on.
                </p>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    fontSize: 14, padding: '10px 12px',
                    border: `1px solid ${C.line}`, borderRadius: 9,
                    outline: 'none', color: C.ink, background: C.paper,
                  }}
                />
                {state === 'error' && (
                  <p style={{ fontSize: 12, color: C.red, margin: '8px 0 0' }}>{errMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  style={{
                    width: '100%', marginTop: 12,
                    fontSize: 14, fontWeight: 700, color: '#fff',
                    background: state === 'sending' ? C.faint : C.red,
                    border: 'none', borderRadius: 9, padding: '11px 0',
                    cursor: state === 'sending' ? 'default' : 'pointer',
                  }}
                >
                  {state === 'sending' ? 'Sending…' : 'Send sign-in link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
