import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay = 1000) => {
  const savedCallback = useRef(callback);
  const interval = useRef<NodeJS.Timer>();

  const clear = () => {
    if (interval.current) clearInterval(interval.current);
  };

  const start = () => {
    clear();
    interval.current = setInterval(() => savedCallback.current(), delay);
  };

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // useEffect(() => {
  //   start();
  //   return () => clear();
  // }, [delay]);

  return [start, clear];
};
