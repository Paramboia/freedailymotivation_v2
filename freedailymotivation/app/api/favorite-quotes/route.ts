import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { userId } = await getAuth(request);
    console.log('User ID from Clerk:', userId);
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // First verify the database connection
    try {
      const { error: connectionError } = await supabase
        .from('favorites')
        .select('count')
        .limit(1)
        .single();

      if (connectionError) {
        console.error('Database connection error:', connectionError);
        return new NextResponse(
          JSON.stringify({ error: 'Database connection error' }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    } catch (connError) {
      console.error('Failed to test database connection:', connError);
      return new NextResponse(
        JSON.stringify({ error: 'Database connection failed' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get favorites with a simpler query first
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('quote_id')
      .eq('user_id', userId);

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch favorites' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!favorites?.length) {
      return new NextResponse(
        JSON.stringify({ quotes: [] }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const quoteIds = favorites.map(f => f.quote_id);
    console.log('Quote IDs found:', quoteIds);

    // Get quotes with a simpler query
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('id, quote_text')
      .in('id', quoteIds);

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch quotes' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Raw quotes:', quotes);

    // Transform to expected format
    const formattedQuotes = quotes?.map(quote => ({
      id: quote.id,
      text: quote.quote_text,
      author: 'Unknown Author', // Simplified for now
      likes: 0,
      category: '',
      dislikes: 0
    })) || [];

    return new NextResponse(
      JSON.stringify({ quotes: formattedQuotes }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
