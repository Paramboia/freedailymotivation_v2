import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { Quote } from '@/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
      author: randomQuote.authors[0]?.name || 'Unknown Author',
      category: randomQuote.categories[0]?.category_name || '',
      likes: 0,
      dislikes: 0
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
