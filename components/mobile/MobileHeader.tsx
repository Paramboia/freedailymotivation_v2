"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { analytics } from "@/lib/analytics";

const MobileHeaderIconButton = ({ children, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <Button
    variant="ghost"
    size="sm"
    className="text-white hover:text-white/80 focus:text-white/80 bg-transparent hover:bg-transparent focus:bg-transparent dark:text-gray-300 dark:hover:text-white dark:focus:text-white"
    {...props}
  >
    {children}
  </Button>
);

const MobileHeader = () => {
  const handleSignInClick = () => {
    analytics.trackCTAClick('Sign In', 'Mobile Header');
  };

  return (
    <header className="sticky top-0 z-50 py-3 px-4 flex justify-between items-center bg-purple-400/90 backdrop-blur-sm dark:bg-black/90 dark:shadow-dark">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-[200px]">
        <SearchBar />
      </div>
      
      {/* Center: Logo */}
      <div className="flex-1 flex justify-center">
        <Link href="/" className="flex items-center text-white dark:text-gray-300 text-lg font-bold">
          <Image
            src="/logo.webp"
            alt="Free Daily Motivation Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="hidden sm:inline">FreeDailyMotivation</span>
        </Link>
      </div>
      
      {/* Right: Authentication */}
      <div className="flex-1 flex justify-end">
        <SignedOut>
          <div onClick={handleSignInClick}>
            <SignInButton>
              <MobileHeaderIconButton>
                <User className="h-5 w-5" />
              </MobileHeaderIconButton>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default MobileHeader;
