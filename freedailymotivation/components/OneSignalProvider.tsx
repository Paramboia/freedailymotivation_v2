"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function OneSignalProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      console.log('OneSignal: Window object initialized');

      // Unregister any existing service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(const registration of registrations) {
            if (registration.active && (
              registration.active.scriptURL.includes("OneSignalSDKWorker") ||
              registration.active.scriptURL.includes("onesignal")
            )) {
              console.log('Unregistering existing OneSignal service worker');
              registration.unregister();
            }
          } 
        });
      }
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
                serviceWorkerPath: "/onesignal/OneSignalSDKWorker.js",
                serviceWorkerParam: {
                  scope: "/onesignal/"
                },
                notifyButton: {
                  enable: true,
                  size: 'large',
                  position: 'bottom-right',
                  showCredit: false,
                },
                persistNotification: false,
                promptOptions: {
                  slidedown: {
                    prompts: [
                      {
                        type: "push",
                        autoPrompt: true,
                        text: {
                          actionMessage: "Get daily motivational quotes delivered right to you!",
                          acceptButton: "Yes, I'm in!",
                          cancelButton: "Maybe later"
                        },
                        delay: {
                          pageViews: 1,
                          timeDelay: 5
                        }
                      }
                    ]
                  }
                }
              });
              console.log('OneSignal: Init completed');

              // Check push support
              const isPushSupported = await OneSignal.Notifications.isPushSupported();
              console.log('OneSignal: Push support status:', isPushSupported);
              
              if (!isPushSupported) {
                console.log('OneSignal: Push notifications are not supported');
                return;
              }

              // Check permission status
              const permission = await OneSignal.Notifications.permission;
              console.log('OneSignal: Current permission status:', permission);

              // Handle different permission states
              switch (permission) {
                case false:
                  console.log('OneSignal: Permission not granted yet');
                  break;
                case true:
                  console.log('OneSignal: Permission already granted');
                  break;
                default:
                  console.log('OneSignal: Permission status unknown');
                  break;
              }

              // Add permission change listener
              OneSignal.Notifications.addEventListener('permissionChange', async (permissionChange) => {
                console.log('OneSignal: Permission changed:', permissionChange);
                
                if (permissionChange) {
                  try {
                    // Attempt to get the device ID after permission is granted
                    const deviceId = await OneSignal.User.getOneSignalId();
                    console.log('OneSignal: Device registered with ID:', deviceId);
                    
                    // Get subscription state
                    const isSubscribed = await OneSignal.Notifications.isSubscribed();
                    console.log('OneSignal: Subscription status:', isSubscribed);
                  } catch (error) {
                    console.error('OneSignal: Error after permission change:', error);
                  }
                }
              });

            } catch (error) {
              console.error('OneSignal: Initialization error:', error);
              if (error instanceof Error) {
                console.error('Error details:', {
                  name: error.name,
                  message: error.message,
                  stack: error.stack
                });
              }
            }
          });
        `}
      </Script>
    </>
  );
}