'use client';

import { usePageViewTracking } from '@/hooks/usePageViewTracking';

export default function ClientPageTracker() {
  usePageViewTracking();
  return null;
}
