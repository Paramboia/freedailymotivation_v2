import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Author {
  author_name: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

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

    const debounceTimeout = setTimeout(fetchAuthors, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSelect = (authorName: string) => {
    const slug = authorName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/inspirational-quotes-famous/${slug}`);
  };

  return (
    <div className="relative w-full max-w-md mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search authors..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white dark:bg-gray-800 border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg z-50">
          {suggestions.map((author) => (
            <li
              key={author}
              onClick={() => handleSelect(author)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              {author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 