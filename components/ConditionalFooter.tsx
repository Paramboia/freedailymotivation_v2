"use client";

import { useDeviceType } from '@/hooks/useDeviceType';
import { useEffect, useState } from 'react';
import Footer from './Footer';

const ConditionalFooter = () => {
  const { isNativeApp } = useDeviceType();
  const [shouldHideFooter, setShouldHideFooter] = useState(false);
  
  useEffect(() => {
    // Multiple checks to detect if we're in mobile app
    const urlParams = new URLSearchParams(window.location.search);
    const isAppMode = urlParams.get('app') === 'true';
    
    // Check for Capacitor
    const hasCapacitor = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
    
    // Check user agent for mobile app indicators
    const userAgent = navigator.userAgent || '';
    const isWebView = userAgent.includes('wv') || userAgent.includes('Version/') && userAgent.includes('Mobile');
    
    // Check if we're in an iframe (webview)
    const inIframe = window.self !== window.top;
    
    // Check for mobile device
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(userAgent);
    
    // Hide footer if any mobile app indicator is detected
    const shouldHide = isNativeApp || isAppMode || hasCapacitor || (isMobileDevice && (isWebView || inIframe));
    
    console.log('ConditionalFooter detection:', {
      isNativeApp,
      isAppMode,
      hasCapacitor,
      isWebView,
      inIframe,
      isMobileDevice,
      shouldHide,
      userAgent: userAgent.substring(0, 50) + '...'
    });
    
    setShouldHideFooter(shouldHide);
  }, [isNativeApp]);
  
  // Don't render footer in mobile app (it has bottom navigation instead)
  if (shouldHideFooter) {
    return null;
  }
  
  // Render footer for web version
  return <Footer />;
};

export default ConditionalFooter;
