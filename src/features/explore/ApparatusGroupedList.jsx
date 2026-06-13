import { C } from '../../styles/tokens.js';
import { apparatusRank } from '../../data/index.js';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';
import { Empty } from '../../components/Empty.jsx';

export function ApparatusGroupedList({ list, user, toggleFav, openFrom }) {
  if (!list.length) return <Empty msg="No exercises match." />;

  const present = [...new Set(list.map(e => e.apparatus))]
    .sort((a, b) => apparatusRank(a) - apparatusRank(b));

  const groups = present
    .map(ap => [ap, list.filter(e => e.apparatus === ap)])
    .filter(([, a]) => a.length);

  const flat = groups.flatMap(([, a]) => a.map(e => e.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {groups.map(([ap, exs]) => (
        <div key={ap}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontSize: 13.5, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 0.8, color: C.ink,
            }}>
              {ap}
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>{exs.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {exs.map(e => (
              <ExerciseCard
                key={e.id}
                exo={e}
                fav={user.favorites.includes(e.id)}
                onFav={() => toggleFav(e.id)}
                onOpen={() => openFrom(flat, e.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
