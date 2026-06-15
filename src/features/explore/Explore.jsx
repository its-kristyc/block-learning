import { useState, useEffect } from 'react';
import { C } from '../../styles/tokens.js';
import { EXERCISES, BLOCKS, APPARATUS_ORDER, applyFilters } from '../../data/index.js';
import { Wheel } from '../../components/Wheel.jsx';
import { FilterRow } from '../../components/FilterRow.jsx';
import { KindBadge } from '../../components/KindBadge.jsx';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';
import { Empty } from '../../components/Empty.jsx';
import { SeriesGroupedList } from './SeriesGroupedList.jsx';
import { ApparatusGroupedList } from './ApparatusGroupedList.jsx';
import { WarmUpView } from './WarmUpView.jsx';

const noFilters = { apparatus: [], level: [], collection: [] };

function SearchBar({ query, setQuery }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search exercises, series, groups…"
        style={{
          fontSize: 13.5,
          padding: '9px 12px 9px 36px',
          border: `1px solid ${C.line}`,
          borderRadius: 10, outline: 'none',
          background: '#fff', width: '100%', boxSizing: 'border-box',
        }}
      />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={C.muted} strokeWidth="2" strokeLinecap="round"
        style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
      </svg>
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: C.muted,
            cursor: 'pointer', lineHeight: 1,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function Explore({ user, toggleFav, openFrom, isMobile }) {
  const [block, setBlock]     = useState(null);
  const [coll, setColl]       = useState('all');      // 'all' | 'favorites'
  const [filters, setFilters] = useState(noFilters);
  const [searchTab, setSearchTab] = useState('exercises');
  const [query, setQuery]     = useState('');

  // Reset filters whenever the scope changes
  useEffect(() => { setFilters(noFilters); }, [block, coll]);

  const q         = query.trim().toLowerCase();
  const searching = q.length > 0;

  const baseScope  = coll === 'favorites'
    ? EXERCISES.filter(e => user.favorites.includes(e.id))
    : EXERCISES;
  const blockScope = block ? baseScope.filter(e => e.block === block) : baseScope;

  const allView = !block && !searching;

  const visible = applyFilters(blockScope, filters);

  // ── Search results body ─────────────────────────────────────────────────
  let panelBody;
  if (searching) {
    const pool = applyFilters(
      baseScope.filter(e => block ? e.block === block : true),
      filters
    );
    const exMatches = pool.filter(e => e.name.toLowerCase().includes(q));

    const collMap = {};
    pool.forEach(e => {
      if (e.collection && e.collection.name.toLowerCase().includes(q)) {
        const key = `${e.collection.name}|${e.apparatus}`;
        if (!collMap[key]) {
          collMap[key] = { ...e.collection, apparatus: e.apparatus, members: [] };
        }
        collMap[key].members.push(e);
      }
    });
    const collMatches = Object.values(collMap);

    panelBody = (
      <>
        {/* Search tabs */}
        <div style={{ display: 'flex', gap: 4, margin: '4px 0 14px', borderBottom: `1px solid ${C.line}` }}>
          {[
            ['exercises',   `Exercises (${exMatches.length})`],
            ['collections', `Series & groups (${collMatches.length})`],
          ].map(([k, label]) => (
            <button key={k} onClick={() => setSearchTab(k)}
              style={{
                fontSize: 13, fontWeight: 600,
                padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer',
                color: searchTab === k ? C.red : C.muted,
                borderBottom: searchTab === k ? `2px solid ${C.red}` : '2px solid transparent',
                marginBottom: -1,
              }}>
              {label}
            </button>
          ))}
        </div>

        {searchTab === 'exercises'
          ? <ApparatusGroupedList list={exMatches} user={user} toggleFav={toggleFav} openFrom={openFrom} />
          : collMatches.length
            ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {collMatches.map(cm => (
                  <div key={`${cm.name}|${cm.apparatus}`} style={{
                    background: C.card, border: `1px solid ${C.line}`,
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{cm.name}</span>
                      <KindBadge kind={cm.kind} />
                      <span style={{ fontSize: 12, color: C.muted }}>
                        {cm.apparatus} · {cm.members.length} exercises
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {cm.members.map(m => (
                        <ExerciseCard
                          key={m.id} exo={m} compact
                          fav={user.favorites.includes(m.id)}
                          onFav={() => toggleFav(m.id)}
                          onOpen={() => openFrom(cm.members.map(x => x.id), m.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
            : <Empty msg="No series or groups match." />
        }
      </>
    );
  } else if (coll === 'favorites' && baseScope.length === 0) {
    panelBody = <Empty msg="No favorites yet. Tap the heart on any exercise to keep it here." />;
  } else if (block === 1) {
    panelBody = <WarmUpView user={user} toggleFav={toggleFav} openFrom={openFrom} />;
  } else {
    panelBody = (
      <SeriesGroupedList
        list={visible} user={user} toggleFav={toggleFav} openFrom={openFrom}
        groupByBlock={!block}
      />
    );
  }

  // ── Block header ───────────────────────────────────────────────────────
  const panelTitle = block ? (
    <div>
      <button
        onClick={() => setBlock(null)}
        style={{
          fontSize: 13, fontWeight: 600, color: C.redDeep,
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
        }}
      >
        ← All
      </button>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: C.red, marginTop: 16 }}>
        BLOCK {block}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <h2 style={{ margin: '1px 0 0', fontSize: 17, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: C.ink }}>
          {BLOCKS[block - 1]}
        </h2>
        <span style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>
          {block === 1 ? '4 series' : `${visible.length} ${visible.length === 1 ? 'exercise' : 'exercises'}`}
        </span>
      </div>
    </div>
  ) : null;

  // ── Panel ──────────────────────────────────────────────────────────────
  const panel = (
    <div style={isMobile
      ? { padding: '10px 14px 90px' }
      : {
          width: 'clamp(400px, 48%, 600px)', flexShrink: 0,
          borderLeft: `1px solid ${C.line}`,
          background: C.card,
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }
    }>
      {/* Controls */}
      <div style={{ padding: isMobile ? '0 0 12px' : '16px 18px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* All / Favorites toggle */}
        <div style={{ display: 'flex', background: C.lineSoft, borderRadius: 99, padding: 3, width: 'fit-content' }}>
          {[['all', 'All'], ['favorites', `♥ Favorites${user.favorites.length ? ' ' + user.favorites.length : ''}`]].map(([k, label]) => (
            <button key={k} onClick={() => setColl(k)}
              style={{
                fontSize: 12.5, fontWeight: 700,
                padding: '5px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                background: coll === k ? C.card : 'transparent',
                color: coll === k ? C.redDeep : C.muted,
                boxShadow: coll === k ? '0 1px 2px rgba(0,0,0,.08)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        <SearchBar query={query} setQuery={setQuery} />

        {block !== 1 && (
          <FilterRow
            filters={filters}
            setFilters={setFilters}
            scope={block ? baseScope.filter(e => e.block === block) : baseScope}
            apparatusOptions={allView ? APPARATUS_ORDER : undefined}
          />
        )}
      </div>

      {/* Scrollable list area */}
      <div style={{
        flex: isMobile ? 'none' : 1,
        overflowY: isMobile ? 'visible' : 'auto',
        borderTop: isMobile ? 'none' : `1px solid ${C.line}`,
      }}>
        <div style={{ padding: isMobile ? '12px 0 0' : '12px 18px 24px' }}>
          {block && !searching && panelTitle && (
            <div style={{ marginBottom: 12 }}>{panelTitle}</div>
          )}
          {panelBody}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      height: isMobile ? 'auto' : '100%',
      overflow: isMobile ? 'visible' : 'hidden',
    }}>
      {/* Wheel side */}
      <div style={{
        flex: isMobile ? 'none' : 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '16px 0 4px' : 24,
      }}>
        <Wheel
          selected={block}
          onSelect={n => setBlock(n)}
          size={isMobile ? Math.min(360, window.innerWidth - 28) : 460}
        />
        <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, height: 18 }}>
          {block
            ? `Showing ${BLOCKS[block - 1]} — click 'Clear' to reset`
            : 'Click a block to explore exercises'}
        </div>
      </div>

      {panel}
    </div>
  );
}
