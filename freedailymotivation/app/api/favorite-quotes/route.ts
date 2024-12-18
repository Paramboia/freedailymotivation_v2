import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    console.log('User ID from Clerk:', userId);
    
    if (!userId) {
      console.log('No user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // First get the favorite quote IDs
    console.log('Fetching favorites for user:', userId);
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('quote_id')
      .eq('user_id', userId);

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      return NextResponse.json({ quotes: [] });
    }

    if (!favorites?.length) {
      console.log('No favorites found for user');
      return NextResponse.json({ quotes: [] });
    }

    const quoteIds = favorites.map(f => f.quote_id);
    console.log('Found quote IDs:', quoteIds);

    // Then get the quotes with authors
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        authors (
          author_name
        )
      `)
      .in('id', quoteIds);

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      return NextResponse.json({ quotes: [] });
    }

    if (!quotes?.length) {
      console.log('No quotes found for the given IDs');
      return NextResponse.json({ quotes: [] });
    }

    console.log('Raw quotes data:', JSON.stringify(quotes, null, 2));

    // Transform the data into the expected Quote format
    const formattedQuotes = quotes.map(quote => ({
      id: quote.id,
      text: quote.quote_text,
      author: quote.authors?.[0]?.author_name || 'Unknown Author',
      likes: 0,
      category: '',
      dislikes: 0
    }));

    console.log('Formatted quotes:', JSON.stringify(formattedQuotes, null, 2));
    return NextResponse.json({ quotes: formattedQuotes });
  } catch (error) {
    console.error('Error in favorite quotes API:', error);
    return NextResponse.json({ quotes: [] });
  }
}
