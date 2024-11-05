"use client";

import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <Link href="/" className="flex items-center text-white dark:text-gray-300 text-lg font-bold">
      <Image
        src="/logo.webp"
        alt="Free Daily Motivation Logo"
        width={32}
        height={32}
        className="mr-2"
      />
    </Link>
  );
};

export default Header;
