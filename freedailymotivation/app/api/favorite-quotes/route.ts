import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

interface Database {
  public: {
    Tables: {
      favorites: {
        Row: {
          user_id: string;
          quote_id: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          quote_text: string;
        };
      };
      authors: {
        Row: {
          author_name: string;
        };
      };
    };
  };
}

export async function GET(request: NextRequest) {
  try {
    // 1. Get and validate user ID
    const auth = getAuth(request);
    const userId = auth.userId;
    console.log('Auth object:', auth);
    console.log('User ID from Clerk:', userId);
    
    if (!userId) {
      console.log('No user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        return NextResponse.json(
          { error: 'Error fetching favorites: ' + favoritesError.message },
          { status: 500 }
        );
      }

      if (!favorites?.length) {
        console.log('No favorites found');
        return NextResponse.json({ quotes: [] });
      }

      const quoteIds = favorites.map(f => f.quote_id);
      console.log('Found quote IDs:', quoteIds);

      // 4. Then get the quotes with these IDs
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('id, quote_text, authors!inner(author_name)')
        .in('id', quoteIds);

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
        return NextResponse.json(
          { error: 'Error fetching quotes: ' + quotesError.message },
          { status: 500 }
        );
      }

      console.log('Raw quotes data:', JSON.stringify(quotes, null, 2));

      if (!quotes?.length) {
        console.log('No quotes found');
        return NextResponse.json({ quotes: [] });
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
      return NextResponse.json({ quotes: formattedQuotes });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Top level error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
