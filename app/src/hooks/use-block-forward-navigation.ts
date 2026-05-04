import { useEffect } from 'react';

/**
 * Blocks forward navigation (browser Next button and swipe-forward gesture)
 * while keeping backward navigation fully functional.
 *
 * Strategy:
 *   1. Patch `history.pushState` / `replaceState` to stamp a monotonically-
 *      increasing `__navIndex` on every history entry so we can tell which
 *      direction a popstate event came from.
 *
 *   2. On `popstate`, if the incoming index is greater than the current one,
 *      reverse the jump immediately with `history.go(-(delta))`.
 *
 *   3. Block the *visual* forward-swipe gesture before the browser has a
 *      chance to render the transition:
 *        • touchstart  – record the start X/Y and whether the touch began
 *                        near the right edge (the "forward swipe" hot zone).
 *        • touchmove   – if we're in the hot zone AND the finger is moving
 *                        left-to-right, call preventDefault() to swallow the
 *                        event so the browser never starts the navigation
 *                        animation.  Must be registered as { passive: false }.
 *
 *      "Near the right edge" is defined as the rightmost EDGE_ZONE_PX pixels
 *      of the viewport.  Adjust if needed.
 *
 * Should be called once at the application root.
 */

const EDGE_ZONE_PX = 50; // pixels from the right edge that trigger a forward swipe

export default function useBlockForwardNavigation() {
  useEffect(() => {
    // ------------------------------------------------------------------
    // 1. Seed the current entry with __navIndex = 0 if not already set.
    // ------------------------------------------------------------------
    if (window.history.state?.__navIndex === undefined) {
      window.history.replaceState(
        { ...(window.history.state ?? {}), __navIndex: 0 },
        document.title
      );
    }

    let currentIndex: number = window.history.state?.__navIndex ?? 0;

    // ------------------------------------------------------------------
    // 2. Patch pushState / replaceState.
    // ------------------------------------------------------------------
    const originalPushState = window.history.pushState.bind(window.history);
    window.history.pushState = function (state: unknown, title: string, url?: string | URL | null) {
      currentIndex += 1;
      const patchedState = {
        ...(state !== null && typeof state === 'object' ? state : {}),
        __navIndex: currentIndex
      };
      return originalPushState(patchedState, title, url);
    };

    const originalReplaceState = window.history.replaceState.bind(window.history);
    window.history.replaceState = function (
      state: unknown,
      title: string,
      url?: string | URL | null
    ) {
      const patchedState = {
        ...(state !== null && typeof state === 'object' ? state : {}),
        __navIndex: currentIndex
      };
      return originalReplaceState(patchedState, title, url);
    };

    // ------------------------------------------------------------------
    // 3. Intercept popstate: reverse any forward jump.
    // ------------------------------------------------------------------
    const handlePopState = (event: PopStateEvent) => {
      const newIndex: number = event.state?.__navIndex ?? 0;

      if (newIndex > currentIndex) {
        window.history.go(-(newIndex - currentIndex));
        return;
      }

      currentIndex = newIndex;
    };

    window.addEventListener('popstate', handlePopState);

    // ------------------------------------------------------------------
    // 4. Block the visual forward-swipe gesture via touch interception.
    //
    //    The forward-swipe gesture on mobile browsers (and desktop trackpads
    //    that emulate touch) is a right-edge-originating swipe to the left
    //    (startX near right edge, deltaX < 0 as finger moves left→right is
    //    the BACK gesture; right→left from LEFT edge would also be back).
    //
    //    Forward swipe = finger starts near the RIGHT edge and moves RIGHT
    //    (deltaX > 0, i.e. moving from right edge toward center/left).
    //    Actually on most browsers:
    //      • Back  gesture: start near LEFT  edge, swipe RIGHT (deltaX > 0)
    //      • Forward gesture: start near RIGHT edge, swipe LEFT  (deltaX < 0)
    //
    //    We want to block the forward one only.
    // ------------------------------------------------------------------
    let touchStartX = 0;
    let touchStartY = 0;
    let blockingSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      // A forward swipe begins near the right edge of the screen.
      blockingSwipe = touchStartX > window.innerWidth - EDGE_ZONE_PX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!blockingSwipe) return;

      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      // Only block if horizontal movement dominates and finger moves LEFT
      // (negative deltaX = right-edge swipe moving toward center = forward).
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
        e.preventDefault();
      }
    };

    // passive: false is required to allow preventDefault() inside touchmove.
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // ------------------------------------------------------------------
    // 5. Cleanup.
    // ------------------------------------------------------------------
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);
}
