import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface Author {
  author_name: string;
}

interface Quote {
  quote_text: string;
  authors: Author[] | null;
}

export async function GET() {
  try {
    console.log('Fetching random quote from Supabase...');
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // First, check if we can connect to Supabase
    const { data: _test, error: testError } = await supabase
      .from('quotes')
      .select('count(*)', { count: 'exact', head: true });

    if (testError) {
      console.error('Supabase connection test error:', {
        message: testError.message,
        code: testError.code,
        details: testError.details
      });
      throw new Error(`Supabase connection error: ${testError.message}`);
    }

    // Fetch random quote with optional author
    const { data: quote, error } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        authors!quotes_author_id_fkey (
          id,
          author_name
        )
      `)
      .order('RANDOM()')
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        query: 'quotes with author join'
      });
      throw error;
    }

    if (!quote) {
      console.error('No quote found in database');
      throw new Error('No quote found in database');
    }

    const formattedQuote: Quote = {
      quote_text: quote.quote_text,
      authors: quote.authors ? [{ author_name: quote.authors[0]?.author_name || 'Unknown Author' }] : null
    };

    console.log('Successfully fetched quote:', formattedQuote);

    return NextResponse.json({
      message: formattedQuote.quote_text,
      heading: `Quote by ${formattedQuote.authors?.[0]?.author_name || 'Unknown Author'}`
    });
  } catch (error) {
    console.error('Random quote error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch random quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}