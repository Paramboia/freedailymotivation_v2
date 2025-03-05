'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Declare the dataLayer for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function usePageViewTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Construct the full URL
      const url = searchParams?.size 
        ? `${pathname}?${searchParams}`
        : pathname;
        
      // Push to dataLayer
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'pageview',
          page: {
            path: url,
            title: document.title
          }
        });
        
        console.log('GTM pageview tracked:', url);
      }
    }
  }, [pathname, searchParams]);
}
