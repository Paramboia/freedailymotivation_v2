"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function OneSignalProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      console.log('OneSignal: Window object initialized');
    }
  }, []);

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        defer
        strategy="lazyOnload"
        onLoad={() => console.log('OneSignal: SDK script loaded')}
        onError={(e) => console.error('OneSignal: SDK script failed to load', e)}
      />
      <Script id="onesignal-init" strategy="lazyOnload">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          console.log('OneSignal: Starting initialization with app ID:', "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}");
          
          OneSignalDeferred.push(async function(OneSignal) {
            try {
              // Enable logging
              OneSignal.Debug.setLogLevel('trace');
              console.log('OneSignal: Debug logging enabled');

              // Initialize
              console.log('OneSignal: Calling init...');
              await OneSignal.init({
                appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",
                allowLocalhostAsSecureOrigin: true,
                serviceWorkerParam: { scope: '/onesignal/' },
                serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
                promptOptions: {
                  slidedown: {
                    prompts: [
                      {
                        type: "push",
                        autoPrompt: true,
                        text: {
                          actionMessage: "Would you like to receive daily motivational quotes?",
                          acceptButton: "Allow",
                          cancelButton: "Cancel"
                        },
                        delay: {
                          pageViews: 1,
                          timeDelay: 5 // Reduced for testing
                        }
                      }
                    ]
                  }
                }
              });
              console.log('OneSignal: Init completed');

              // Log current state
              const isPushSupported = await OneSignal.Notifications.isPushSupported();
              console.log('OneSignal: Push support status:', isPushSupported);

              const permission = await OneSignal.Notifications.permission;
              console.log('OneSignal: Current permission status:', permission);

              const isSubscribed = await OneSignal.User.PushSubscription.optedIn();
              console.log('OneSignal: Current subscription status:', isSubscribed);

              // Get user ID if available
              const user = await OneSignal.User.getUser();
              console.log('OneSignal: User data:', user);

              // Add subscription change listener
              OneSignal.User.PushSubscription.addEventListener('change', async (event) => {
                console.log('OneSignal: Subscription changed:', event);
                const newStatus = await OneSignal.User.PushSubscription.optedIn();
                console.log('OneSignal: New subscription status:', newStatus);
                
                // Get updated user data
                const updatedUser = await OneSignal.User.getUser();
                console.log('OneSignal: Updated user data:', updatedUser);
              });

            } catch (error) {
              console.error('OneSignal: Initialization error:', error);
              // Log additional error details
              if (error instanceof Error) {
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
              }
            }
          });
        `}
      </Script>
    </>
  );
}