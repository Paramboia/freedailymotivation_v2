import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface Author {
  author_name: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch('/api/authors');
        const data: Author[] = await response.json();
        const filteredAuthors = data.filter((author: Author) =>
          author.author_name.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredAuthors.map((author: Author) => author.author_name));
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    if (query) {
      const debounceTimeout = setTimeout(fetchAuthors, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setSuggestions([]); // Clear suggestions if the query is empty
    }
  }, [query]);

  const handleSelect = (authorName: string) => {
    setQuery(authorName);
    setSuggestions([]);
    const slug = authorName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/inspirational-quotes-famous/${slug}`);
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="relative w-64 md:w-64 max-w-[160px] md:max-w-none">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isMobile ? "Authors..." : "Search authors..."}
          className="w-full pl-10 pr-10 py-1.5 text-sm rounded-lg bg-white/20 dark:bg-white/10 text-gray-900 dark:text-white border-0 hover:bg-white/30 dark:hover:bg-white/20 focus:bg-white/30 dark:focus:bg-white/20 focus:outline-none transition-colors placeholder-gray-600 dark:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white dark:bg-[#333] border border-gray-200 dark:border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg z-50">
          {suggestions.map((author) => (
            <li
              key={author}
              onClick={() => handleSelect(author)}
              className="px-4 py-2 cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#444] transition-colors text-sm"
            >
              {author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 