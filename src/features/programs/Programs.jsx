import { useState, useEffect, useRef } from 'react';
import { C } from '../../styles/tokens.js';
import { uid } from '../../lib/utils.js';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { Empty } from '../../components/Empty.jsx';
import { FlowView } from './FlowView.jsx';
import { Editor } from './Editor.jsx';

const DotsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
  </svg>
);

const primaryBtn = {
  fontSize: 12.5, fontWeight: 700, color: '#fff',
  background: C.red, border: 'none', borderRadius: 8,
  padding: '7px 13px', cursor: 'pointer',
};
const menuPop = {
  position: 'absolute', right: 0, top: 36, zIndex: 31,
  background: C.card, border: `1px solid ${C.line}`,
  borderRadius: 10, boxShadow: '0 6px 24px rgba(0,0,0,.12)',
  padding: 4, display: 'flex', flexDirection: 'column', minWidth: 130,
};
const menuItem = {
  fontSize: 13, fontWeight: 600, color: C.ink,
  background: 'none', border: 'none', borderRadius: 7,
  padding: '8px 12px', textAlign: 'left', cursor: 'pointer',
};

export function Programs({ user, setUser, openFrom, isMobile, leaveGuard }) {
  const [viewId, setViewId]             = useState(null);
  const [draft, setDraft]               = useState(null);
  const [menuId, setMenuId]             = useState(null);
  const [toDelete, setToDelete]         = useState(null);
  const [discardPrompt, setDiscardPrompt] = useState(null);
  const draftRef = useRef(null);

  const isDirty = () =>
    draftRef.current &&
    JSON.stringify(draftRef.current.draft) !== draftRef.current.original;

  // Register leave guard so App-level tab switching is intercepted while draft is dirty
  useEffect(() => {
    leaveGuard.current = pendingFn => {
      if (!isDirty()) return true;
      setDiscardPrompt({ run: pendingFn || null });
      return false;
    };
    return () => { leaveGuard.current = null; };
  });

  const openDraft = (b, original) => { draftRef.current = { draft: b, original }; setDraft(b); };
  const updateDraft = b => { draftRef.current = { ...draftRef.current, draft: b }; setDraft(b); };
  const closeDraft = () => { draftRef.current = null; setDraft(null); };

  const startNew = () => {
    const b = { id: uid(), name: 'Untitled program', blocks: {} };
    openDraft(b, JSON.stringify(b));
  };
  const startEdit = b => {
    const copy = JSON.parse(JSON.stringify(b));
    openDraft(copy, JSON.stringify(copy));
  };
  const saveDraft = () => {
    const exists = user.programs.some(b => b.id === draft.id);
    setUser({
      ...user,
      programs: exists
        ? user.programs.map(b => b.id === draft.id ? draft : b)
        : [...user.programs, draft],
    });
    setViewId(draft.id);
    closeDraft();
  };
  const cancelEdit = () => {
    if (isDirty()) {
      setDiscardPrompt({
        run: () => { setViewId(user.programs.some(b => b.id === draft.id) ? draft.id : null); closeDraft(); },
      });
      return;
    }
    setViewId(user.programs.some(b => b.id === draft.id) ? draft.id : null);
    closeDraft();
  };
  const confirmDiscard = () => {
    const action = discardPrompt?.run;
    closeDraft();
    setDiscardPrompt(null);
    if (action) action();
  };
  const confirmDelete = () => {
    setUser({ ...user, programs: user.programs.filter(b => b.id !== toDelete.id) });
    if (viewId === toDelete.id) setViewId(null);
    setToDelete(null);
  };
  const dupBoard = b => setUser({
    ...user,
    programs: [...user.programs, { ...b, id: uid(), name: b.name + ' (copy)', blocks: JSON.parse(JSON.stringify(b.blocks)) }],
  });

  const viewBoard = user.programs.find(b => b.id === viewId);

  let content;
  if (draft) {
    content = (
      <Editor
        draft={draft} setDraft={updateDraft}
        onSave={saveDraft} onCancel={cancelEdit}
        openFrom={openFrom} isMobile={isMobile}
      />
    );
  } else if (viewBoard) {
    content = (
      <FlowView
        board={viewBoard}
        back={() => setViewId(null)}
        onEdit={() => startEdit(viewBoard)}
        onDelete={() => setToDelete(viewBoard)}
        user={user} openFrom={openFrom} isMobile={isMobile}
      />
    );
  } else {
    content = (
      <div style={{ padding: isMobile ? '16px 14px 90px' : '24px 28px', maxWidth: 760, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: C.ink }}>
            My programs
          </h2>
          <div style={{ flex: 1 }} />
          <button onClick={startNew} style={primaryBtn}>+ New program</button>
        </div>

        {user.programs.length === 0 && (
          <Empty msg="No programs yet. Create one and build a class by placing exercises into the twelve blocks — your tools, your judgment." />
        )}

        <div>
          {user.programs.map(b => {
            const count = Object.values(b.blocks).reduce((s, a) => s + a.length, 0);
            return (
              <div key={b.id}
                onClick={() => setViewId(b.id)}
                className="progRow"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '15px 10px', borderBottom: `1px solid ${C.line}` }}
              >
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: 15.5, color: C.ink }}>{b.name}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>
                    {count} {count === 1 ? 'exercise' : 'exercises'}
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={e => { e.stopPropagation(); setMenuId(menuId === b.id ? null : b.id); }}
                    title="More" aria-label="More actions"
                    className="menuDots"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 6, display: 'inline-flex', borderRadius: 6 }}
                  >
                    <DotsIcon />
                  </button>
                  {menuId === b.id && (
                    <>
                      <div onClick={e => { e.stopPropagation(); setMenuId(null); }} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
                      <div style={menuPop} onClick={e => e.stopPropagation()}>
                        <button onClick={() => { startEdit(b); setMenuId(null); }} style={menuItem}>Edit</button>
                        <button onClick={() => { dupBoard(b); setMenuId(null); }} style={menuItem}>Duplicate</button>
                        <button onClick={() => { setToDelete(b); setMenuId(null); }} style={{ ...menuItem, color: C.redDeep }}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      {content}
      {toDelete && (
        <ConfirmDialog
          title="Delete this program?"
          body={`"${toDelete.name}" will be permanently removed. Exercises and notes are not affected.`}
          confirmLabel="Delete" confirmDanger
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
      {discardPrompt && (
        <ConfirmDialog
          title="Discard unsaved changes?"
          body="This program has changes that haven't been saved. Leaving now will lose them."
          confirmLabel="Discard" confirmDanger
          onConfirm={confirmDiscard}
          onClose={() => setDiscardPrompt(null)}
        />
      )}
    </>
  );
}
