"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export default function BookmarkReminder() {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const hasSeenReminder = localStorage.getItem('hasSeenBookmarkReminder');
    if (!hasSeenReminder) {
      const timer = setTimeout(() => setShowReminder(true), 10000); // Show after 10 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowReminder(false);
    localStorage.setItem('hasSeenBookmarkReminder', 'true');
  };

  if (!showReminder) return null;

  return (
    <Card className="fixed bottom-4 right-4 p-4 max-w-sm bg-white dark:bg-gray-800 shadow-lg">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2" 
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <h3 className="text-lg font-semibold mb-2">Don't miss out on daily motivation!</h3>
      <p className="mb-4">Bookmark this page for easy access to your daily dose of inspiration.</p>
      <Button onClick={handleDismiss}>Got it, thanks!</Button>
    </Card>
  );
}
