import { useEffect } from 'react';

export const useKeyDown = (callback: (e: KeyboardEvent) => void, active = true) => {
  useEffect(() => {
    if (active) window.addEventListener('keydown', callback);
    return () => window.removeEventListener('keydown', callback);
  }, [active]);
};
