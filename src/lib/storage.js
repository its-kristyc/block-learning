const KEY = 'basi-user-data-v1';

export const emptyUser = { notes: {}, favorites: [], programs: [] };

export const storage = {
  load() {
    return Promise.resolve().then(() => {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    });
  },
  save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.error('save failed', e);
    }
  },
};
