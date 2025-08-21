"use client";

import { useDeviceType } from '@/hooks/useDeviceType';
import { useEffect, useState } from 'react';
import Footer from './Footer';

const ConditionalFooter = () => {
  const { isNativeApp } = useDeviceType();
  const [shouldHideFooter, setShouldHideFooter] = useState(false);
  
  useEffect(() => {
    // Check URL parameter for app mode
    const urlParams = new URLSearchParams(window.location.search);
    const isAppMode = urlParams.get('app') === 'true';
    
    setShouldHideFooter(isNativeApp || isAppMode);
  }, [isNativeApp]);
  
  // Don't render footer in mobile app (it has bottom navigation instead)
  if (shouldHideFooter) {
    return null;
  }
  
  // Render footer for web version
  return <Footer />;
};

export default ConditionalFooter;
