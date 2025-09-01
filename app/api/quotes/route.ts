import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface DatabaseQuote {
  id: string;
  quote_text: string;
  authors: {
    author_name: string;
  }[];
  categories: {
    category_name: string;
  }[];
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const authorFilter = searchParams.get('author');

  let query = supabase
    .from('quotes')
    .select('id, quote_text, authors!inner(author_name), categories!inner(category_name)')
    .order('created_at', { ascending: false });

  // If author filter is provided, filter by author name
  if (authorFilter) {
    query = query.ilike('authors.author_name', authorFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error loading quotes:', error);
    return NextResponse.json({ error: 'Failed to load quotes' }, { status: 500 });
  }

  const quotes = (data as DatabaseQuote[]).map(item => ({
    id: item.id,
    text: item.quote_text,
    author: item.authors[0]?.author_name || 'Unknown Author',
    category: item.categories[0]?.category_name || 'Uncategorized',
    likes: 0,
    dislikes: 0
  }));

  return NextResponse.json({ quotes });
}
