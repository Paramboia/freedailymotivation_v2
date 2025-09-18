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
      const userAgent = navigator.userAgent || '';
      const isMobileUserAgent = /Android|iPhone|iPad|iPod/i.test(userAgent);
      
      // Check for webview indicators
      const isWebView = userAgent.includes('wv') || userAgent.includes('Version/') && userAgent.includes('Mobile');
      
      // Check for Capacitor
      const hasCapacitor = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
      
      // Check for specific Capacitor indicators in the DOM
      const hasCapacitorScript = document.querySelector('script[src*="capacitor"]');
      
      // More aggressive detection - if mobile device and any app indicator
      const shouldForceNativeApp = isApp || hasCapacitor || (isMobileUserAgent && (inIframe || isWebView || hasCapacitorScript));
      
      console.log('MobileLayout detection:', {
        isApp,
        inIframe,
        isMobileUserAgent,
        isWebView,
        hasCapacitor,
        hasCapacitorScript: !!hasCapacitorScript,
        shouldForceNativeApp,
        userAgent: userAgent.substring(0, 50) + '...'
      });
      
      if (shouldForceNativeApp) {
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
