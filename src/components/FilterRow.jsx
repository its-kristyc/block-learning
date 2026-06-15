import { useMemo } from 'react';
import { C } from '../styles/tokens.js';
import { Select } from './Select.jsx';
import { LEVELS } from '../data/index.js';

export function FilterRow({ filters, setFilters, scope, hideApparatus, apparatusOptions }) {
  const colls = useMemo(() => {
    const pool = filters.apparatus.length
      ? scope.filter(e => filters.apparatus.includes(e.apparatus))
      : scope;
    return [...new Set(
      pool.filter(e => e.collection).map(e => e.collection.name)
    )].sort();
  }, [filters.apparatus, scope]);

  const apparatuses = useMemo(() => (
    apparatusOptions ?? [...new Set(scope.map(e => e.apparatus))].sort()
  ), [apparatusOptions, scope]);

  const active = (
    hideApparatus
      ? [filters.level, filters.collection]
      : [filters.apparatus, filters.level, filters.collection]
  ).some(arr => arr.length > 0);

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      {!hideApparatus && (
        <Select
          values={filters.apparatus}
          onChange={v => setFilters({ ...filters, apparatus: v, collection: [] })}
          options={apparatuses}
          placeholder="Apparatus"
        />
      )}
      <Select
        values={filters.level}
        onChange={v => setFilters({ ...filters, level: v })}
        options={LEVELS}
        placeholder="Level"
      />
      <Select
        values={filters.collection}
        onChange={v => setFilters({ ...filters, collection: v })}
        options={colls}
        placeholder="Series / group"
      />
      {active && (
        <button
          onClick={() => setFilters({ apparatus: [], level: [], collection: [] })}
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
