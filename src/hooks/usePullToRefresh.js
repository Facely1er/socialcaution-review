import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for pull-to-refresh functionality on mobile devices
 * @param {Object} options - Pull to refresh options
 * @param {Function} options.onRefresh - Async function to call when refresh is triggered
 * @param {number} [options.threshold=80] - Distance in pixels to trigger refresh
 * @param {number} [options.resistance=2.5] - Resistance factor for pull feel
 * @param {boolean} [options.enabled=true] - Whether pull-to-refresh is enabled
 * @returns {Object} Container ref, state, and progress
 */
export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canPull, setCanPull] = useState(false);

  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (!enabled) return;

    // Only enable pull-to-refresh if at the top of the scroll
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0) {
      setCanPull(true);
      startY.current = e.touches[0].clientY;
      currentY.current = e.touches[0].clientY;
    }
  }, [enabled]);

  const handleTouchMove = useCallback((e) => {
    if (!enabled || !canPull || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;

    if (delta > 0) {
      // Pull down
      setIsPulling(true);

      // Apply resistance to make it feel more natural
      const distance = Math.min(delta / resistance, threshold * 1.5);
      setPullDistance(distance);

      // Prevent default scrolling behavior
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [enabled, canPull, isRefreshing, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPulling) return;

    setCanPull(false);
    setIsPulling(false);

    // Trigger refresh if pulled beyond threshold
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold); // Lock at threshold during refresh

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        // Animate back to 0
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 300);
      }
    } else {
      // Didn't reach threshold, animate back
      setPullDistance(0);
    }
  }, [enabled, isPulling, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Use passive: false to allow preventDefault
    const touchStartOptions = { passive: false };
    const touchMoveOptions = { passive: false };

    container.addEventListener('touchstart', handleTouchStart, touchStartOptions);
    container.addEventListener('touchmove', handleTouchMove, touchMoveOptions);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1)
  };
};

