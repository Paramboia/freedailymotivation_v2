"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, Quote, Star, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { analytics } from "@/lib/analytics";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  analyticsLabel: string;
}

const navItems: NavItem[] = [
  {
    href: '/find-quotes',
    icon: Lightbulb,
    label: 'Find',
    analyticsLabel: 'Find Quotes'
  },
  {
    href: '/inspirational-quotes-famous',
    icon: Quote,
    label: 'Famous',
    analyticsLabel: 'Famous Quotes'
  },
  {
    href: '/favorite-quotes',
    icon: Star,
    label: 'Favorites',
    analyticsLabel: 'Favorite Quotes'
  },
  {
    href: '/about',
    icon: Info,
    label: 'About',
    analyticsLabel: 'About'
  }
];

const BottomNavigation = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const handleNavClick = (analyticsLabel: string) => {
    analytics.trackCTAClick(analyticsLabel, 'Bottom Navigation');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    analytics.trackCTAClick(`Theme ${newTheme}`, 'Bottom Navigation');
  };

  const isActiveRoute = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-purple-400/95 backdrop-blur-sm dark:bg-black/95 border-t border-white/20 dark:border-gray-700/50">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map(({ href, icon: Icon, label, analyticsLabel }) => {
          const isActive = isActiveRoute(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => handleNavClick(analyticsLabel)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'text-white dark:text-white bg-white/20 dark:bg-white/10'
                  : 'text-white/70 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
        
        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 text-white/70 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-white/10"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 mb-1" />
          ) : (
            <Moon className="h-5 w-5 mb-1" />
          )}
          <span className="text-xs font-medium">Theme</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
