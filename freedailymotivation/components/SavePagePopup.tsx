"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface SavePagePopupProps {
  onClose: () => void;
}

export default function SavePagePopup({ onClose }: SavePagePopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="relative w-full max-w-md p-6 mx-4 bg-white dark:bg-[#333] shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Save for Daily Inspiration
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Want easy access to daily motivation? Save this page to your bookmarks!
        </p>
        
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="dark:text-gray-300 dark:hover:bg-[#444]"
          >
            Maybe Later
          </Button>
          <Button
            className="ml-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
            onClick={onClose}
          >
            Got It!
          </Button>
        </div>
      </Card>
    </div>
  );
}
