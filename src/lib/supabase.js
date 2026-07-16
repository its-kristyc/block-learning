import { createClient } from '@supabase/supabase-js';

// Keys live in .env.local (git-ignored). Until they're set, the app runs in
// local-only mode and everything below no-ops gracefully.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

export const supabase = isConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,        // keep the login across page reloads
        autoRefreshToken: true,
        detectSessionInUrl: true,    // handle the magic-link redirect
      },
    })
  : null;

// ── Auth helpers ──────────────────────────────────────────────────────────
// Send a magic sign-in link to `email`. The link returns the user to the app.
export function sendMagicLink(email) {
  if (!supabase) return Promise.reject(new Error('Supabase not configured'));
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
}

export function signOut() {
  return supabase ? supabase.auth.signOut() : Promise.resolve();
}

// Subscribe to session changes. Calls back with the current session (or null).
// Returns an unsubscribe function.
export function onAuth(cb) {
  if (!supabase) {
    cb(null);
    return () => {};
  }
  supabase.auth.getSession().then(({ data }) => cb(data.session));
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}
