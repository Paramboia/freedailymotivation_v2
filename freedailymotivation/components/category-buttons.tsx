"use client";

import { Button } from "@/components/ui/button";

interface CategoryButtonsProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
}

export default function CategoryButtons({ categories, onCategorySelect }: CategoryButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {categories.map((category) => (
        <Button 
          key={category} 
          variant="secondary"
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
