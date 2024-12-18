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
          quote_id: string;
          user_id: string;
          created_at: string;
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
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    // Get the quotes with a single join query
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        quote_id,
        quotes:quotes (
          id,
          quote_text,
          authors:authors (
            author_name
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching quotes:', error);
      return NextResponse.json({ quotes: [] });
    }

    if (!favorites?.length) {
      return NextResponse.json({ quotes: [] });
    }

    console.log('Raw favorites:', JSON.stringify(favorites, null, 2));

    // Transform the data into the expected Quote format
    const formattedQuotes = favorites.map(favorite => {
      const quote = favorite.quotes;
      if (!quote) {
        return null;
      }

      return {
        id: quote.id,
        text: quote.quote_text,
        author: Array.isArray(quote.authors) && quote.authors[0] ? quote.authors[0].author_name : 'Unknown Author',
        likes: 0,
        category: '',
        dislikes: 0
      };
    }).filter((quote): quote is NonNullable<typeof quote> => quote !== null);

    return NextResponse.json({ quotes: formattedQuotes });
  } catch (error) {
    console.error('Error in favorite quotes API:', error);
    return NextResponse.json({ quotes: [] });
  }
}
