import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the quotes with a single join query
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
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching quotes:', error);
      return NextResponse.json({ quotes: [] });
    }

    if (!quotes?.length) {
      return NextResponse.json({ quotes: [] });
    }

    // Transform the data into the expected Quote format
    const formattedQuotes = quotes.map(favorite => ({
      id: favorite.quotes.id,
      text: favorite.quotes.quote_text,
      author: favorite.quotes.authors?.[0]?.author_name || 'Unknown Author',
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
