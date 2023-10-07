import { useEffect, useState } from 'react';
import { EDirection } from '@/types.d';

export const useSwipeDirection = (
  callback: (value: EDirection) => void,
  swipeStep: number = 1,
) => {
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchStartX = e.touches[0].clientX;
      const touchStartY = e.touches[0].clientY;

      const handleTouchMove = (e: TouchEvent) => {
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setDeltaX(Math.floor(deltaX / swipeStep));
        } else {
          setDeltaY(Math.floor(deltaY / swipeStep));
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        setDeltaX(0);
        setDeltaY(0);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  useEffect(() => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      callback(deltaX > 0 ? EDirection.RIGHT : EDirection.LEFT);
    } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
      callback(deltaY > 0 ? EDirection.DOWN : EDirection.UP);
    }
  }, [deltaX, deltaY]);
};
