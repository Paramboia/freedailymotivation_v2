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
            try {
              await OneSignal.init({
                appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",
                notifyButton: {
                  enable: true, // Enable the notify button
                  size: 'large', // Options: 'small', 'medium', 'large'
                  theme: 'default', // Options: 'default', 'inverse'
                  position: 'bottom-right', // Options: 'bottom-left', 'bottom-right'
                  showCredit: false,
                  text: {
                    'tip.state.unsubscribed': 'Subscribe to notifications',
                    'tip.state.subscribed': "You're subscribed to notifications",
                    'tip.state.blocked': "You've blocked notifications",
                    'message.prenotify': 'Click to subscribe to notifications',
                    'message.action.subscribed': "Thanks for subscribing!",
                    'message.action.resubscribed': "You're subscribed to notifications",
                    'message.action.unsubscribed': "You won't receive notifications again",
                  }
                },
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
                          timeDelay: 20
                        }
                      }
                    ]
                  }
                }
              });

              // Add subscription change listener
              OneSignal.User.PushSubscription.addEventListener('change', async (event) => {
                const isSubscribed = await OneSignal.User.PushSubscription.optedIn();
                console.log('Subscription changed:', isSubscribed);
              });

              // Check initial subscription status
              const isSubscribed = await OneSignal.User.PushSubscription.optedIn();
              console.log('Initial subscription status:', isSubscribed);

            } catch (error) {
              console.error('OneSignal initialization error:', error);
            }
          });
        `}
      </Script>
    </>
  );
}