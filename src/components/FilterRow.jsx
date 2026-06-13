import { useMemo } from 'react';
import { C } from '../styles/tokens.js';
import { Select } from './Select.jsx';
import { LEVELS } from '../data/index.js';

export function FilterRow({ filters, setFilters, scope, hideApparatus }) {
  const colls = useMemo(() => {
    const pool = filters.apparatus
      ? scope.filter(e => e.apparatus === filters.apparatus)
      : scope;
    return [...new Set(
      pool.filter(e => e.collection).map(e => e.collection.name)
    )].sort();
  }, [filters.apparatus, scope]);

  const muscles = useMemo(() => (
    [...new Set(scope.flatMap(e => e.muscleFocus))].sort()
  ), [scope]);

  const apparatuses = useMemo(() => (
    [...new Set(scope.map(e => e.apparatus))].sort()
  ), [scope]);

  const active = (
    hideApparatus
      ? [filters.level, filters.muscle, filters.collection]
      : Object.values(filters)
  ).some(Boolean);

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      {!hideApparatus && (
        <Select
          value={filters.apparatus}
          onChange={v => setFilters({ ...filters, apparatus: v, collection: '' })}
          options={apparatuses}
          placeholder="Apparatus"
        />
      )}
      <Select
        value={filters.level}
        onChange={v => setFilters({ ...filters, level: v })}
        options={LEVELS}
        placeholder="Level"
      />
      <Select
        value={filters.muscle}
        onChange={v => setFilters({ ...filters, muscle: v })}
        options={muscles}
        placeholder="Muscle focus"
      />
      <Select
        value={filters.collection}
        onChange={v => setFilters({ ...filters, collection: v })}
        options={colls}
        placeholder="Series / group"
      />
      {active && (
        <button
          onClick={() => setFilters({ apparatus: '', level: '', muscle: '', collection: '' })}
          style={{
            fontSize: 12, color: C.muted, background: 'none',
            border: 'none', cursor: 'pointer', textDecoration: 'underline',
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
