"use client";

import { Button } from "@/components/ui/button";

export default function CategoryButtons() {
  const categories = ["Business", "Sport", "Science", "Life"];

  return (
    <div className="flex space-x-2 mt-4">
      {categories.map((category) => (
        <Button key={category} variant="secondary">
          {category}
        </Button>
      ))}
    </div>
  );
}
