"use client";

import Header from "./Header";
import { ThemeToggle } from "./theme-toggle";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { User, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const HeaderIconButton = ({ children, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <Button
    variant="ghost"
    size="sm"
    className="text-white hover:text-white/80 focus:text-white/80 bg-transparent hover:bg-transparent focus:bg-transparent dark:text-gray-300 dark:hover:text-white dark:focus:text-white"
    {...props}
  >
    {children}
  </Button>
);

const SiteHeader = () => {
  return (
    <header className="py-2 px-4 flex justify-between items-center bg-transparent dark:bg-black dark:shadow-dark">
      <Header />
      <div className="flex items-center space-x-2">
        <Link href="/about">
          <HeaderIconButton>
            <Info className="h-4 w-4" />
          </HeaderIconButton>
        </Link>
        <ThemeToggle className="text-white hover:text-white/80 focus:text-white/80 bg-transparent hover:bg-transparent focus:bg-transparent dark:text-gray-300 dark:hover:text-white dark:focus:text-white" />
        <SignedOut>
          <SignInButton>
            <HeaderIconButton>
              <User className="h-4 w-4" />
            </HeaderIconButton>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default SiteHeader;
