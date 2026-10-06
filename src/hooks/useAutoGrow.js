import { useRef, useLayoutEffect, useCallback } from 'react';

function fit(el) {
  el.style.height = 'auto';
  const border = el.offsetHeight - el.clientHeight;
  el.style.height = `${el.scrollHeight + border}px`;
}

// Grows a textarea to fit its content. Returns a callback ref; re-measures
// when the value changes or the textarea's width changes (drawer resize,
// rotation), and works even if the textarea mounts after the hook runs.
export function useAutoGrow(value) {
  const elRef = useRef(null);
  const roRef = useRef(null);

  const ref = useCallback(el => {
    roRef.current?.disconnect();
    roRef.current = null;
    elRef.current = el;
    if (!el) return;
    fit(el);
    if (typeof ResizeObserver === 'undefined') return;
    let w = el.clientWidth;
    roRef.current = new ResizeObserver(() => {
      if (el.clientWidth !== w) { w = el.clientWidth; fit(el); }
    });
    roRef.current.observe(el);
  }, []);

  useLayoutEffect(() => {
    if (elRef.current) fit(elRef.current);
  }, [value]);

  return ref;
}
