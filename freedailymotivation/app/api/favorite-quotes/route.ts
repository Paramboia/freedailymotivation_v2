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

    // Direct SQL query to get favorites with quotes and authors
    const { data: quotes, error } = await supabase
      .from('favorites')
      .select(`
        quote_id,
        quotes (
          id,
          quote_text,
          authors (
            author_name
          )
        )
      `)
      .eq('user_id', userId)
      .not('quotes', 'is', null);

    console.log('Raw query result:', JSON.stringify(quotes, null, 2));

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!quotes?.length) {
      console.log('No quotes found for user:', userId);
      return NextResponse.json({ quotes: [] });
    }

    // Transform the data into the expected format
    const formattedQuotes = quotes.map(favorite => {
      const quote = favorite.quotes;
      return {
        id: quote.id,
        text: quote.quote_text,
        author: quote.authors?.[0]?.author_name || 'Unknown Author',
        likes: 0,
        category: '',
        dislikes: 0
      };
    });

    console.log('Formatted quotes:', JSON.stringify(formattedQuotes, null, 2));
    return NextResponse.json({ quotes: formattedQuotes });
  } catch (error) {
    console.error('Error in favorite quotes API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
