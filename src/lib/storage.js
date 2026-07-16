import { supabase } from './supabase.js';

const KEY = 'basi-user-data-v1';

export const emptyUser = { notes: {}, favorites: [], programs: [] };

// ── Local cache (also the whole story when signed out / offline) ────────────
function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocal(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error('local save failed', e);
  }
}

// Is there anything worth keeping in a user object?
function hasContent(d) {
  if (!d) return false;
  return (
    (d.programs && d.programs.length) ||
    (d.favorites && d.favorites.length) ||
    (d.notes && Object.keys(d.notes).length)
  );
}

// ── Cloud row: one JSONB blob per user in `user_data` (RLS-protected) ────────
async function loadCloud(userId) {
  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.error('cloud load failed', error);
    return undefined; // undefined = couldn't reach cloud (distinct from "no row")
  }
  return data ? data.data : null; // null = no row yet for this user
}

async function saveCloud(userId, data) {
  const { error } = await supabase
    .from('user_data')
    .upsert(
      { user_id: userId, data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (error) console.error('cloud save failed', error);
}

export const storage = {
  // Load for the given session (or null when signed out).
  // On first sign-in, migrates existing local data up to the cloud.
  async load(session) {
    const local = loadLocal();

    if (!session || !supabase) {
      return local; // local-only mode
    }

    const cloud = await loadCloud(session.user.id);

    if (cloud === undefined) {
      // Cloud unreachable (offline) — fall back to the local cache.
      return local;
    }

    if (cloud === null) {
      // No cloud row yet. If we have local data, migrate it up.
      if (hasContent(local)) {
        await saveCloud(session.user.id, local);
        return local;
      }
      return null;
    }

    // Cloud is source of truth once signed in. Mirror it locally for offline.
    saveLocal(cloud);
    return cloud;
  },

  // Save always writes the local cache immediately; when signed in it also
  // pushes to the cloud (last-write-wins).
  save(data, session) {
    saveLocal(data);
    if (session && supabase) {
      saveCloud(session.user.id, data); // fire-and-forget; local already safe
    }
  },
};
