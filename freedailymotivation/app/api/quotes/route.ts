import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface DatabaseQuote {
  id: string;
  quote_text: string;
  authors: {
    name: string;
  }[];
  categories: {
    category_name: string;
  }[];
}

export async function GET(_request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from('quotes')
    .select('id, quote_text, authors!inner(name), categories!inner(category_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading quotes:', error);
    return NextResponse.json({ error: 'Failed to load quotes' }, { status: 500 });
  }

  const quotes = (data as DatabaseQuote[]).map(item => ({
    id: item.id,
    text: item.quote_text,
    author: item.authors[0]?.name || 'Unknown Author',
    category: item.categories[0]?.category_name || 'Uncategorized',
    likes: 0,
    dislikes: 0
  }));

  return NextResponse.json(quotes);
}
