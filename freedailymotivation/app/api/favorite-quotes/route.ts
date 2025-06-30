import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    // Add debugging information
    console.log('Request URL:', request.url);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Get the current user from Clerk
    const session = await auth();
    console.log('Full session object:', session);
    const clerkUserId = session.userId;
    
    console.log('Clerk User ID:', clerkUserId);
    
    if (!clerkUserId) {
      console.log('No user ID found in session - user not authenticated');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized',
          debug: {
            sessionExists: !!session,
            sessionKeys: session ? Object.keys(session) : [],
            userIdExists: !!session?.userId,
            url: request.url
          }
        }), 
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

    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // First get the Supabase user ID using the Clerk ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to fetch user', 
          details: userError.message,
          clerkUserId 
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

    if (!userData) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    console.log('Found Supabase user:', userData);

    // Get favorites using the Supabase user ID
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('quote_id')
      .eq('user_id', userData.id);

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to fetch favorites', 
          details: favoritesError.message
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

    console.log('Found favorites:', favorites);

    // Get quotes with author information
    const quoteIds = favorites.map(f => f.quote_id);
    console.log('Quote IDs:', quoteIds);

    // Get quotes with their author information
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        authors!quotes_author_id_fkey (
          id,
          author_name
        )
      `)
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

    // Transform the data
    const formattedQuotes = (quotes || []).map(quote => {
      // Ensure we handle the authors array correctly
      const authors = Array.isArray(quote.authors) 
        ? quote.authors 
        : [quote.authors];

      return {
        id: String(quote.id),
        text: quote.quote_text,
        author: authors[0]?.author_name || 'Unknown Author',
        likes: 0,
        dislikes: 0,
        category: ''
      };
    });

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
