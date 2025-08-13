"use client";

import { useState, useEffect } from 'react';

interface DeviceInfo {
  isNativeApp: boolean;
  isMobile: boolean;
  platform: 'ios' | 'android' | 'web';
}

export const useDeviceType = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isNativeApp: false,
    isMobile: false,
    platform: 'web'
  });

  useEffect(() => {
    const detectDevice = async () => {
      let isNativeApp = false;
      let platform: 'ios' | 'android' | 'web' = 'web';
      let isMobile = false;

      // Multiple checks for Capacitor
      if (typeof window !== 'undefined') {
        // Check for Capacitor object
        isNativeApp = (window as any).Capacitor !== undefined;
        
        // Alternative check: look for Capacitor in global scope
        if (!isNativeApp) {
          isNativeApp = (window as any).cordova !== undefined || 
                       (window as any).PhoneGap !== undefined ||
                       (window as any).phonegap !== undefined;
        }

        // Check user agent for app context
        const userAgent = navigator.userAgent || '';
        if (userAgent.includes('FreeDailyMotivation') || 
            userAgent.includes('wv') || // WebView indicator
            window.location.protocol === 'file:') {
          isNativeApp = true;
        }
      }

      if (isNativeApp) {
        try {
          const { Capacitor } = await import('@capacitor/core');
          platform = Capacitor.getPlatform() as 'ios' | 'android';
          isMobile = true;
          console.log('Capacitor detected:', platform);
        } catch (error) {
          console.log('Capacitor import failed, checking user agent');
          // Fallback platform detection
          const userAgent = navigator.userAgent;
          if (userAgent.includes('Android')) {
            platform = 'android';
          } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
            platform = 'ios';
          }
          isMobile = true;
        }
      } else {
        // Fallback mobile detection for web
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      }

      console.log('Device detection:', { isNativeApp, isMobile, platform });
      
      setDeviceInfo({
        isNativeApp,
        isMobile,
        platform
      });
    };

    detectDevice();
  }, []);

  return deviceInfo;
};
