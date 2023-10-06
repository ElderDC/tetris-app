import { useRef } from 'react';

export const useAnimationFrame = (callback: (time: number) => void) => {
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  const clear = () => {
    if (requestRef.current) window.cancelAnimationFrame(requestRef.current);
  };

  const start = () => {
    clear();
    requestRef.current = requestAnimationFrame(animate);
  };

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  return [start, clear];
};
