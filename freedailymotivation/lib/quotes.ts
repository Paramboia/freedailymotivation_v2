import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { Quote } from '@/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getRandomQuote(category?: string): Promise<Quote | null> {
  try {
    let query = supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        author_id,
        authors (
          id,
          name
        ),
        categories (
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
      likes: 0,
      dislikes: 0,
      category: randomQuote.categories?.category_name || ''
    };
  } catch (error) {
    console.error('Error in getRandomQuote:', error);
    return null;
  }
}

export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('category_name')
      .order('category_name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data.map(category => category.category_name);
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return [];
  }
}

export async function getMostLikedQuotes(limit: number = 5): Promise<Quote[]> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        likes,
        authors!inner (
          name
        )
      `)
      .order('likes', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching most liked quotes:', error);
      return [];
    }

    return data.map(quote => ({
      id: quote.id,
      text: quote.quote_text,
      author: quote.authors[0]?.name || 'Unknown Author',
      likes: quote.likes || 0,
      dislikes: 0,
      category: ''
    }));
  } catch (error) {
    console.error('Error in getMostLikedQuotes:', error);
    return [];
  }
}

export async function getMostDislikedQuotes(limit: number = 5): Promise<Quote[]> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        dislikes,
        authors!inner (
          name
        )
      `)
      .order('dislikes', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching most disliked quotes:', error);
      return [];
    }

    return data.map(quote => ({
      id: quote.id,
      text: quote.quote_text,
      author: quote.authors[0]?.name || 'Unknown Author',
      likes: 0,
      dislikes: quote.dislikes || 0,
      category: ''
    }));
  } catch (error) {
    console.error('Error in getMostDislikedQuotes:', error);
    return [];
  }
}
