"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

interface CategoryButtonsProps {
  categories: string[];
  onCategorySelect: (category: string | undefined) => void;
  selectedCategory: string | undefined;
}

export default function CategoryButtons({ categories, onCategorySelect, selectedCategory }: CategoryButtonsProps) {
  const handleCategoryClick = (category: string) => {
    const isCurrentlySelected = selectedCategory === category;
    
    if (isCurrentlySelected) {
      onCategorySelect(undefined);
      // Track category deselection
      analytics.trackCategorySelection(category, true);
    } else {
      onCategorySelect(category);
      // Track category selection
      analytics.trackCategorySelection(category, false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {categories.map((category) => (
        <Button 
          key={category} 
          variant="secondary"
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "transition-colors",
            selectedCategory === category
              ? "bg-primary text-primary-foreground dark:bg-white dark:text-black"
              : "bg-secondary text-secondary-foreground dark:bg-[#333] dark:text-white dark:hover:bg-[#444]"
          )}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)} {/* Capitalize the first letter */}
        </Button>
      ))}
    </div>
  );
}
