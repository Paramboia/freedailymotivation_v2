import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { Quote } from '@/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

let quotes: Quote[] = [];

export async function loadQuotes() {
  const response = await fetch('/api/quotes');
  if (!response.ok) {
    throw new Error('Failed to load quotes');
  }
  quotes = await response.json();
}

export async function getRandomQuote(category?: string) {
  try {
    let query = supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        authors!inner (
          name
        ),
        categories!inner (
          category_name
        )
      `);

    if (category) {
      query = query.eq('categories.category_name', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching quote:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const randomQuote = data[randomIndex];

    return {
      id: randomQuote.id,
      text: randomQuote.quote_text,
      author: randomQuote.authors?.name || 'Unknown Author',
      category: randomQuote.categories?.category_name || '',
      likes: 0,
      dislikes: 0
    };
  } catch (error) {
    console.error('Error in getRandomQuote:', error);
    return null;
  }
}

export function getQuotesByAuthor(author: string): Quote[] {
  return quotes.filter(quote => quote.author.toLowerCase() === author.toLowerCase());
}

export function getAllAuthors(): string[] {
  return Array.from(new Set(quotes.map(quote => quote.author)));
}

export function getAllCategories(): string[] {
  const categories = new Set(quotes.map(quote => quote.category));
  return Array.from(categories);
}

export function likeQuote(id: string): Quote {
  const quote = quotes.find(q => q.id === id);
  if (quote) {
    quote.likes += 1;
  }
  return quote!;
}

export function getMostLikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

export function getMostDislikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.dislikes - a.dislikes).slice(0, limit);
}

export function toggleLikeQuote(id: string): Quote {
  const quote = quotes.find(q => q.id === id);
  if (quote) {
    quote.likes = quote.likes ? 0 : 1; // Toggle between 0 and 1
  }
  return quote!;
}

export function isQuoteLiked(id: string): boolean {
  const quote = quotes.find(q => q.id === id);
  return quote ? quote.likes > 0 : false;
}
