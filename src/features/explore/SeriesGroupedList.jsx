import { C } from '../../styles/tokens.js';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';
import { Empty } from '../../components/Empty.jsx';

export function SeriesGroupedList({ list, user, toggleFav, openFrom }) {
  if (!list.length) return <Empty msg="No exercises match these filters." />;

  const allIds = list.map(x => x.id);

  // Group consecutive exercises sharing the same collection+apparatus into bordered boxes.
  const segments = [];
  list.forEach(e => {
    const collKey = e.collection ? `${e.collection.name}|${e.apparatus}` : null;
    const last = segments[segments.length - 1];
    if (collKey && last && last.collKey === collKey) {
      last.items.push(e);
    } else if (collKey) {
      segments.push({ collKey, collection: e.collection, items: [e] });
    } else {
      segments.push({ collKey: null, items: [e] });
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {segments.map((seg, si) =>
        seg.collKey ? (
          <div key={si} style={{
            background: C.card, border: `1px solid ${C.line}`,
            borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 8,
              marginBottom: 8, flexWrap: 'wrap',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>
                {seg.collection.name}
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>
                {seg.items.length} {seg.items.length === 1 ? 'exercise' : 'exercises'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {seg.items.map(m => (
                <ExerciseCard
                  key={m.id}
                  exo={m}
                  compact
                  fav={user.favorites.includes(m.id)}
                  onFav={() => toggleFav(m.id)}
                  onOpen={() => openFrom(allIds, m.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {seg.items.map(e => (
              <ExerciseCard
                key={e.id}
                exo={e}
                fav={user.favorites.includes(e.id)}
                onFav={() => toggleFav(e.id)}
                onOpen={() => openFrom(allIds, e.id)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
