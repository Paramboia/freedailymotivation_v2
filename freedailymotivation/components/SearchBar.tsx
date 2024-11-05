import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 2) {
      const fetchAuthors = async () => {
        const supabase = createServerComponentClient({ cookies });
        const { data, error } = await supabase
          .from('authors')
          .select('author_name')
          .ilike('author_name', `%${query}%`);

        if (!error) {
          setSuggestions(data.map(author => author.author_name));
        }
      };

      fetchAuthors();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (authorName) => {
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