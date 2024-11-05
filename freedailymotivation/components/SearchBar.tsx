import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Author {
  author_name: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 2) {
      const fetchAuthors = async () => {
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

      fetchAuthors();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (authorName: string) => {
    const slug = authorName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/inspirational-quotes-famous/${slug}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search authors..."
        className="border p-2 rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded mt-1">
          {suggestions.map((author) => (
            <li
              key={author}
              onClick={() => handleSelect(author)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 