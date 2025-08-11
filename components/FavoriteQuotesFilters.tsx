'use client';

import { ChevronDown, X } from "lucide-react";
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
}

// Simple dropdown button component
interface DropdownButtonProps {
  label: string;
  value: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  className?: string;
}

function DropdownButton({ 
  label, 
  value, 
  defaultValue, 
  options, 
  onSelect,
  className = ""
}: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasValue = value !== defaultValue;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(defaultValue);
    setIsOpen(false);
  };

  const displayLabel = hasValue 
    ? options.find(opt => opt.value === value)?.label || label
    : label;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        className="flex items-center justify-between h-9 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{displayLabel}</span>
        {hasValue ? (
          <X 
            className="h-4 w-4 ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" 
            onClick={handleClearClick}
          />
        ) : (
          <ChevronDown className={`h-4 w-4 ml-2 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
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
  onCategoryChange
}: FavoriteQuotesFiltersProps) {
  // Prepare options for dropdowns
  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' }
  ];

  const authorOptions = [
    { value: 'all', label: 'Author' },
    ...availableAuthors.map(author => ({ value: author, label: author }))
  ];

  const categoryOptions = [
    { value: 'all', label: 'Category' },
    ...availableCategories.map(category => ({ value: category, label: category }))
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <DropdownButton
          label="Newest first"
          value={sortBy}
          defaultValue="newest"
          options={sortOptions}
          onSelect={onSortChange}
        />
        
        <DropdownButton
          label="Author"
          value={selectedAuthor}
          defaultValue="all"
          options={authorOptions}
          onSelect={onAuthorChange}
        />
        
        <DropdownButton
          label="Category"
          value={selectedCategory}
          defaultValue="all"
          options={categoryOptions}
          onSelect={onCategoryChange}
        />
      </div>
    </div>
  );
}
