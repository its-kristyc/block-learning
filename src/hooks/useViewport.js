import { useState, useEffect } from 'react';

export function useViewport() {
  const [w, setW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return { isMobile: w <= 1024, w };
}
