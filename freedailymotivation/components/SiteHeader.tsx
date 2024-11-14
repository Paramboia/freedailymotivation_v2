"use client";

import Header from "./Header";
import { ThemeToggle } from "./theme-toggle";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { User, Quote, Lightbulb, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import SearchBar from "@/components/SearchBar";

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
      <div className="flex items-center gap-4">
        <Header />
        <SearchBar />
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-0.1">
          <Link href="/find-quotes" className="flex items-center">
            <HeaderIconButton>
              <Lightbulb className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Find Quotes</span>
            </HeaderIconButton>
          </Link>
          <Link href="/inspirational-quotes-famous" className="flex items-center">
            <HeaderIconButton>
              <Quote className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Famous Quotes</span>
            </HeaderIconButton>
          </Link>
          <Link href="/favorite-quotes" className="flex items-center">
            <HeaderIconButton>
              <Star className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Favorite Quotes</span>
            </HeaderIconButton>
          </Link>
          <ThemeToggle className="text-white hover:text-white/80 focus:text-white/80 bg-transparent hover:bg-transparent focus:bg-transparent dark:text-gray-300 dark:hover:text-white dark:focus:text-white" />
        </div>
        <div className="ml-0.5">
          <SignedOut>
            <SignInButton>
              <HeaderIconButton>
                <User className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Sign In</span>
              </HeaderIconButton>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
