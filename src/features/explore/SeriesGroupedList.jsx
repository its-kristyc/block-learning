import { C } from '../../styles/tokens.js';
import { BLOCKS, APPARATUS_ORDER, LEVELS, BLOCK_DISPLAY_ORDER, apparatusRank } from '../../data/index.js';
import { ExerciseCard } from '../../components/ExerciseCard.jsx';
import { Empty } from '../../components/Empty.jsx';

function blockRank(n) {
  const i = BLOCK_DISPLAY_ORDER.indexOf(n);
  return i === -1 ? 999 : i;
}

function levelRank(l) {
  const i = LEVELS.indexOf(l);
  return i === -1 ? 999 : i;
}

function blockLabel(n) {
  if (n === 13) return { num: '1.1', name: 'Foundation' };
  return { num: String(n), name: BLOCKS[n - 1] ?? `Block ${n}` };
}

function sortList(list) {
  return [...list].sort((a, b) => {
    const bd = blockRank(a.block) - blockRank(b.block);
    if (bd !== 0) return bd;
    const ad = apparatusRank(a.apparatus) - apparatusRank(b.apparatus);
    if (ad !== 0) return ad;
    return levelRank(a.level) - levelRank(b.level);
  });
}

function toCollectionSegments(items) {
  const segments = [];
  items.forEach(e => {
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
  return segments;
}

function CollectionSegments({ segments, allIds, user, toggleFav, openFrom }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {segments.map((seg, si) =>
        seg.collKey ? (
          <div key={si} style={{
            background: C.card, border: `1px solid ${C.line}`,
            borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>
                {seg.collection.name}
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>
                {seg.items.length} {seg.items.length === 1 ? 'exercise' : 'exercises'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {seg.items.map(m => (
                <ExerciseCard key={m.id} exo={m} compact
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
              <ExerciseCard key={e.id} exo={e}
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

function ApparatusSection({ apparatus, items, allIds, user, toggleFav, openFrom }) {
  const segments = toCollectionSegments(items);
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: 0.8, color: C.muted, paddingBottom: 6,
      }}>
        {apparatus}
      </div>
      <CollectionSegments
        segments={segments} allIds={allIds}
        user={user} toggleFav={toggleFav} openFrom={openFrom}
      />
    </div>
  );
}

function groupByApparatus(list) {
  const seen = [];
  list.forEach(e => { if (!seen.includes(e.apparatus)) seen.push(e.apparatus); });
  seen.sort((a, b) => apparatusRank(a) - apparatusRank(b));
  return seen.map(ap => ({ apparatus: ap, items: list.filter(e => e.apparatus === ap) }));
}

export function SeriesGroupedList({ list, user, toggleFav, openFrom, groupByBlock }) {
  if (!list.length) return <Empty msg="No exercises match these filters." />;

  const sorted = sortList(list);
  const allIds = sorted.map(e => e.id);

  if (!groupByBlock) {
    return (
      <div>
        {groupByApparatus(sorted).map(({ apparatus, items }) => (
          <ApparatusSection key={apparatus}
            apparatus={apparatus} items={items} allIds={allIds}
            user={user} toggleFav={toggleFav} openFrom={openFrom}
          />
        ))}
      </div>
    );
  }

  const blockNums = [...new Set(sorted.map(e => e.block))]
    .sort((a, b) => blockRank(a) - blockRank(b));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {blockNums.map(n => {
        const { num, name } = blockLabel(n);
        const blockExs = sorted.filter(e => e.block === n);
        return (
          <div key={n}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 7,
              paddingBottom: 8, borderBottom: `1px solid ${C.line}`,
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.red, letterSpacing: 0.5 }}>
                BLOCK {num}
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: C.ink }}>
                {name}
              </span>
            </div>
            {groupByApparatus(blockExs).map(({ apparatus, items }) => (
              <ApparatusSection key={apparatus}
                apparatus={apparatus} items={items} allIds={allIds}
                user={user} toggleFav={toggleFav} openFrom={openFrom}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
