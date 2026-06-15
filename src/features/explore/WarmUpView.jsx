import { C } from '../../styles/tokens.js';
import { EXERCISES } from '../../data/index.js';
import { WARMUP_SERIES } from '../../data/warmupSeries.js';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';

function PlaceholderRow({ name }) {
  return (
    <div style={{
      padding: '9px 12px',
      borderRadius: 8,
      background: C.paper,
      border: `1px dashed ${C.line}`,
      fontSize: 13.5,
      color: C.muted,
      fontStyle: 'italic',
    }}>
      {name}
    </div>
  );
}

export function WarmUpView({ user, toggleFav, openFrom }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {WARMUP_SERIES.map(series => {
        const resolved = series.exercises.map(ref => {
          const ex = EXERCISES.find(e => e.id === ref)
            ?? EXERCISES.find(e => e.name === ref && e.apparatus === series.apparatus)
            ?? EXERCISES.find(e => e.name === ref);
          return { name: ref, ex };
        });

        const foundIds = resolved.filter(r => r.ex).map(r => r.ex.id);

        return (
          <div key={series.id} style={{
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            overflow: 'hidden',
            background: '#fff',
          }}>
            <div style={{
              padding: '11px 14px',
              borderBottom: `1px solid ${C.line}`,
              background: C.paper,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600, fontSize: 16,
                color: C.ink,
              }}>
                {series.name}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: C.muted }}>
                {series.exercises.length} exercises
              </span>
            </div>

            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {resolved.map(({ name, ex }) =>
                ex ? (
                  <ExerciseCard
                    key={ex.id}
                    exo={ex}
                    compact
                    fav={user.favorites.includes(ex.id)}
                    onFav={() => toggleFav(ex.id)}
                    onOpen={() => openFrom(foundIds, ex.id)}
                  />
                ) : (
                  <PlaceholderRow key={name} name={name} />
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
