"use client";

import { useState, useEffect } from 'react';
// Removed old quotes import - functions not implemented in Neon yet
import { Quote } from '@/types';
import { Card } from "@/components/ui/card";

export default function TopQuotes() {
  const [mostLiked, setMostLiked] = useState<Quote[]>([]);
  const [mostDisliked, setMostDisliked] = useState<Quote[]>([]);

  useEffect(() => {
    async function fetchTopQuotes() {
      // Note: getMostLikedQuotes and getMostDislikedQuotes not yet implemented in Neon
      // TODO: Create API endpoints for these features
      console.log('Top quotes feature not yet implemented with Neon');
      setMostLiked([]);
      setMostDisliked([]);
    }
    fetchTopQuotes();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <Card className="p-4 flex-1">
        <h2 className="text-xl font-bold mb-4">Most Liked Quotes</h2>
        <ul>
          {mostLiked.map((quote) => (
            <li key={quote.id} className="mb-2">
              "{quote.text}" - {quote.author} ({quote.likes} likes)
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-4 flex-1">
        <h2 className="text-xl font-bold mb-4">Most Disliked Quotes</h2>
        <ul>
          {mostDisliked.map((quote) => (
            <li key={quote.id} className="mb-2">
              "{quote.text}" - {quote.author} ({quote.dislikes} dislikes)
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
