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
      // Check if running in Capacitor
      const isNativeApp = typeof window !== 'undefined' && 
        (window as any).Capacitor !== undefined;

      // Detect platform
      let platform: 'ios' | 'android' | 'web' = 'web';
      let isMobile = false;

      if (isNativeApp) {
        try {
          const { Capacitor } = await import('@capacitor/core');
          platform = Capacitor.getPlatform() as 'ios' | 'android';
          isMobile = true;
        } catch (error) {
          console.error('Error detecting Capacitor platform:', error);
        }
      } else {
        // Fallback mobile detection for web
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      }

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
