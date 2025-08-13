"use client";

import { useDeviceType } from '@/hooks/useDeviceType';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import SiteHeader from '../SiteHeader';
import SparklesBackground from '../SparklesBackground';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { isNativeApp } = useDeviceType();

  if (isNativeApp) {
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
