"use client";

import { Facebook, Info } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex justify-center items-center p-4 text-sm text-white dark:text-gray-300 relative">
      <div className="text-center">
        <span>© 2024 Free Daily Motivation.</span>
        <br />
        <span>All rights reserved.</span>
      </div>
      <div className="absolute right-4 flex items-center">
        <Link href="https://www.facebook.com/people/Free-Daily-Motivation/61566119962164/" className="flex items-center text-white dark:text-gray-300 hover:text-white/80 focus:text-white/80">
          <Facebook className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Join the Community</span>
        </Link>
      </div>
      <div className="absolute left-4 flex items-center">
        <Link href="/about" className="flex items-center">
          <Info className="h-5 w-5 mr-1 text-white dark:text-gray-300 hover:text-white/80 focus:text-white/80" />
          <span className="hidden sm:inline text-white dark:text-gray-300 hover:text-white/80 focus:text-white/80">About Us</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer; 