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
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // 2. Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 3. Get favorites
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('quote_id')
      .eq('user_id', userId);

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch favorites', details: favoritesError.message }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // If no favorites found, return empty array
    if (!favorites?.length) {
      return new NextResponse(
        JSON.stringify({ quotes: [] }), 
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // 4. Get quotes
    const quoteIds = favorites.map(f => f.quote_id);
    console.log('Quote IDs:', quoteIds);

    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('id, quote_text')
      .in('id', quoteIds);

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch quotes', details: quotesError.message }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Transform and return the data
    const formattedQuotes = (quotes || []).map(quote => ({
      id: quote.id,
      text: quote.quote_text,
      author: 'Unknown Author', // Simplified for now
      likes: 0,
      category: '',
      dislikes: 0
    }));

    return new NextResponse(
      JSON.stringify({ quotes: formattedQuotes }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}
