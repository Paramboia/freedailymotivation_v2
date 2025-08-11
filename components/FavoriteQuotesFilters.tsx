'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterX, ChevronDown, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface FavoriteQuotesFiltersProps {
  sortBy: string;
  selectedAuthor: string;
  selectedCategory: string;
  availableAuthors: string[];
  availableCategories: string[];
  onSortChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

// Custom Select Trigger component that shows X when value is selected
interface CustomSelectTriggerProps {
  value: string;
  defaultValue: string;
  placeholder: string;
  onClear: () => void;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function CustomSelectTrigger({ 
  value, 
  defaultValue, 
  placeholder, 
  onClear, 
  isOpen, 
  onClick,
  children 
}: CustomSelectTriggerProps) {
  const hasValue = value !== defaultValue;
  
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  return (
    <button
      type="button"
      className="flex h-10 w-full items-center justify-between rounded-md border border-white/30 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
    >
      <span className="block truncate">
        {hasValue ? children : placeholder}
      </span>
      {hasValue ? (
        <X 
          className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" 
          onClick={handleClearClick}
        />
      ) : (
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      )}
    </button>
  );
}

export default function FavoriteQuotesFilters({
  sortBy,
  selectedAuthor,
  selectedCategory,
  availableAuthors,
  availableCategories,
  onSortChange,
  onAuthorChange,
  onCategoryChange,
  onClearFilters
}: FavoriteQuotesFiltersProps) {
  const hasActiveFilters = selectedAuthor !== 'all' || selectedCategory !== 'all';
  
  // State for tracking which dropdowns are open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAuthorClear = () => {
    onAuthorChange('all');
    setOpenDropdown(null);
  };

  const handleCategoryClear = () => {
    onCategoryChange('all');
    setOpenDropdown(null);
  };

  const getDisplayValue = (value: string, defaultValue: string, items: string[]) => {
    if (value === defaultValue) return '';
    return items.find(item => item === value) || value;
  };

  return (
    <div ref={containerRef} className="mb-8 p-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/50">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Sort By */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by
            </label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-600/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Author Filter */}
          <div className="flex flex-col gap-2 min-w-[160px] relative">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Author
            </label>
            <div className="relative">
              <CustomSelectTrigger
                value={selectedAuthor}
                defaultValue="all"
                placeholder="All authors"
                onClear={handleAuthorClear}
                isOpen={openDropdown === 'author'}
                onClick={() => setOpenDropdown(openDropdown === 'author' ? null : 'author')}
              >
                {getDisplayValue(selectedAuthor, 'all', availableAuthors)}
              </CustomSelectTrigger>
              {openDropdown === 'author' && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      onAuthorChange('all');
                      setOpenDropdown(null);
                    }}
                  >
                    All authors
                  </div>
                  {availableAuthors.map((author) => (
                    <div
                      key={author}
                      className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        onAuthorChange(author);
                        setOpenDropdown(null);
                      }}
                    >
                      {author}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2 min-w-[160px] relative">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <div className="relative">
              <CustomSelectTrigger
                value={selectedCategory}
                defaultValue="all"
                placeholder="All categories"
                onClear={handleCategoryClear}
                isOpen={openDropdown === 'category'}
                onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
              >
                {getDisplayValue(selectedCategory, 'all', availableCategories)}
              </CustomSelectTrigger>
              {openDropdown === 'category' && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      onCategoryChange('all');
                      setOpenDropdown(null);
                    }}
                  >
                    All categories
                  </div>
                  {availableCategories.map((category) => (
                    <div
                      key={category}
                      className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        onCategoryChange(category);
                        setOpenDropdown(null);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-600/50 hover:bg-white/90 dark:hover:bg-gray-800/90 mt-2 sm:mt-6"
          >
            <FilterX className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
