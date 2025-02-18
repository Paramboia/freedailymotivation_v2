"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function OneSignalProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
    }
  }, []);

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        defer
        strategy="lazyOnload"
      />
      <Script id="onesignal-init" strategy="lazyOnload">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "9bee561c-d825-4050-b998-1b3245cad317",
            });
          });
        `}
      </Script>
    </>
  );
} 