import { useState, useRef, useCallback } from 'react';

/**
 * Hook for handling swipe gestures on touch devices
 * @param {Object} options - Swipe gesture options
 * @param {Function} [options.onSwipeLeft] - Callback for left swipe
 * @param {Function} [options.onSwipeRight] - Callback for right swipe
 * @param {Function} [options.onSwipeUp] - Callback for up swipe
 * @param {Function} [options.onSwipeDown] - Callback for down swipe
 * @param {Function} [options.onSwipe] - Generic swipe callback with direction
 * @param {number} [options.threshold=50] - Minimum distance in pixels to trigger swipe
 * @param {boolean} [options.preventDefaultTouchMove=false] - Whether to prevent default touch move
 * @returns {Object} Touch event handlers and swipe state
 */
export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onSwipe,
  threshold = 50,
  preventDefaultTouchMove = false
} = {}) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    if (preventDefaultTouchMove) {
      e.preventDefault();
    }
  }, [preventDefaultTouchMove]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    // Determine if horizontal or vertical swipe
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    let direction = null;

    if (isHorizontal) {
      if (Math.abs(deltaX) > threshold) {
        direction = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }

    if (direction) {
      onSwipe?.(direction);

      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    }

    setIsSwiping(false);
  }, [isSwiping, threshold, onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isSwiping
  };
};

/**
 * Hook for tracking pan gesture (continuous swipe)
 * @returns {Object} Touch event handlers, offset, and panning state
 */
export const usePanGesture = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    setIsPanning(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isPanning) return;

    const deltaX = e.touches[0].clientX - startPos.current.x;
    const deltaY = e.touches[0].clientY - startPos.current.y;

    setOffset({ x: deltaX, y: deltaY });
  }, [isPanning]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  const reset = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setIsPanning(false);
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    offset,
    isPanning,
    reset
  };
};

