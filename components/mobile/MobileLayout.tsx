"use client";

import { useDeviceType } from '@/hooks/useDeviceType';
import { useEffect, useState } from 'react';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import SiteHeader from '../SiteHeader';
import SparklesBackground from '../SparklesBackground';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { isNativeApp } = useDeviceType();
  const [forceNativeApp, setForceNativeApp] = useState(false);

  useEffect(() => {
    // Additional checks for when we're in a mobile app
    const checkForNativeApp = () => {
      // Check URL parameters for app detection
      const urlParams = new URLSearchParams(window.location.search);
      const isApp = urlParams.get('app') === 'true';
      
      // Check if we're in an iframe (webview)
      const inIframe = window.self !== window.top;
      
      // Check for mobile user agent
      const isMobileUserAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      // Check for specific Capacitor indicators in the DOM
      const hasCapacitorScript = document.querySelector('script[src*="capacitor"]');
      
      if (isApp || inIframe || (isMobileUserAgent && hasCapacitorScript)) {
        setForceNativeApp(true);
      }
    };

    checkForNativeApp();
  }, []);

  const shouldUseMobileLayout = isNativeApp || forceNativeApp;

  console.log('MobileLayout decision:', { isNativeApp, forceNativeApp, shouldUseMobileLayout });

  if (shouldUseMobileLayout) {
    return (
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900 relative">
        <SparklesBackground />
        <MobileHeader />
        <main className="flex-1 pb-20"> {/* pb-20 to account for bottom navigation */}
          {children}
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // Fallback to web layout
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900 relative">
      <SparklesBackground />
      <SiteHeader />
      {children}
    </div>
  );
};

export default MobileLayout;
