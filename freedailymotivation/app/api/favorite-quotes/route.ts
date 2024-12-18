import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Step 1: Get the Supabase user ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single();

    if (userError || !userData) {
      console.error('Error finding user:', userError);
      return NextResponse.json({ quotes: [] });
    }

    // Step 2: Get the favorite quote IDs
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('quote_id')
      .eq('user_id', userData.id);

    if (favoritesError || !favorites?.length) {
      console.error('Error fetching favorites:', favoritesError);
      return NextResponse.json({ quotes: [] });
    }

    const quoteIds = favorites.map(f => f.quote_id);

    // Step 3: Get the quotes with authors
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

    if (quotesError || !quotes?.length) {
      console.error('Error fetching quotes:', quotesError);
      return NextResponse.json({ quotes: [] });
    }

    const formattedQuotes = quotes.map(quote => ({
      id: quote.id,
      text: quote.quote_text,
      author: quote.authors?.[0]?.author_name || 'Unknown Author',
      likes: 0,
      category: '',
      dislikes: 0
    }));

    return NextResponse.json({ quotes: formattedQuotes });
  } catch (error) {
    console.error('Error in favorite quotes API:', error);
    return NextResponse.json({ quotes: [] });
  }
}
