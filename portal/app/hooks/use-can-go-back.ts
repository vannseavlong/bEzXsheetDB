import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router';

const serviceSegments = [
  'category',
  'category-addon',
  'product',
  'product-option',
  'banner',
  'voucher',
  'promotions',
  'service-bundle',
  'roles',
  'users',
  'push-notification',
  'cleaner',
  'item',
  'coupon',
  'blocked-schedule',
  'top-up',
  'payment-link'
];

const getBaseServiceSegment = (path: string | null): string | null => {
  if (!path) return null;
  for (const segment of serviceSegments) {
    if (path === `/${segment}` || path.startsWith(`/${segment}/`)) {
      return segment;
    }
  }
  return null;
};

const isDetailPage = (path: string | null, segment: string | null): boolean => {
  if (!path || !segment) return false;
  // Check if the path starts with the segment followed by a slash AND has more characters after the slash,
  // indicating it's not just the base segment itself (e.g., /category vs /category/123).
  // Also, explicitly exclude paths ending with /new (like /voucher/new-voucher) if you consider them "new" forms,
  // though your route definition makes /voucher/:voucherId also cover new-voucher.
  // For simplicity with your current routes, checking for a segment after the base seems sufficient.
  const parts = path.split('/');
  return parts.length > 2 && parts[1] === segment;
};

export default function useCanGoBack() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const previousLocationPathRef = useRef<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = previousLocationPathRef.current;

    // Get the base service segment for current and previous paths
    const currentSegment = getBaseServiceSegment(currentPath);
    const prevSegment = getBaseServiceSegment(prevPath);

    let shouldEnable = false;

    if (
      navigationType === 'PUSH' &&
      currentSegment !== null &&
      prevSegment !== null &&
      currentSegment === prevSegment
    ) {
      shouldEnable = true;
    } else if (
      window.history.length > 1 &&
      currentSegment !== null &&
      isDetailPage(currentPath, currentSegment)
    ) {
      shouldEnable = true;
    }

    setCanGoBack(shouldEnable);
    previousLocationPathRef.current = currentPath;
  }, [location.pathname, navigationType]);

  const hiddenHeader = serviceSegments.some((segment) =>
    location.pathname.startsWith(`/${segment}/`)
  );

  return {
    canGoBack,
    hiddenHeader
  };
}
