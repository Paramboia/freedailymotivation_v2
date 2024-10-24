"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-dark' : 'bg-gradient-to-br from-purple-400 to-pink-400'
    }`}>
      {children}
    </div>
  );
}
