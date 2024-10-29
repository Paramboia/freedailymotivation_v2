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
          className="absolute right-2 top-2 dark:hover:bg-[#444]"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Enjoying what you see? 💫
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Save this page to your bookmarks for easy motivation!
        </p>
        
        <div className="flex justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            className="dark:bg-[#444] dark:text-white dark:hover:bg-[#555]"
          >
            Got It!
          </Button>
        </div>
      </Card>
    </div>
  );
}
