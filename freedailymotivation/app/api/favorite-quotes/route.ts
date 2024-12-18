import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. Get and validate user ID
    const { userId } = await getAuth(request);
    console.log('User ID from Clerk:', userId);
    
    if (!userId) {
      console.log('No user ID found');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      // 3. First, get just the favorite quote IDs
      console.log('Fetching favorites for user:', userId);
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('quote_id')
        .eq('user_id', userId);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
        return new NextResponse(
          JSON.stringify({ error: 'Error fetching favorites: ' + favoritesError.message }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      if (!favorites?.length) {
        console.log('No favorites found');
        return new NextResponse(
          JSON.stringify({ quotes: [] }),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const quoteIds = favorites.map(f => f.quote_id);
      console.log('Found quote IDs:', quoteIds);

      // 4. Then get the quotes with these IDs
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
        return new NextResponse(
          JSON.stringify({ error: 'Error fetching quotes: ' + quotesError.message }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('Raw quotes data:', JSON.stringify(quotes, null, 2));

      if (!quotes?.length) {
        console.log('No quotes found');
        return new NextResponse(
          JSON.stringify({ quotes: [] }),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // 5. Transform the data
      const formattedQuotes = quotes.map(quote => ({
        id: quote.id,
        text: quote.quote_text,
        author: quote.authors?.[0]?.author_name || 'Unknown Author',
        likes: 0,
        category: '',
        dislikes: 0
      }));

      console.log('Formatted quotes:', JSON.stringify(formattedQuotes, null, 2));
      return new NextResponse(
        JSON.stringify({ quotes: formattedQuotes }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return new NextResponse(
        JSON.stringify({ error: 'Database operation failed' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Top level error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
