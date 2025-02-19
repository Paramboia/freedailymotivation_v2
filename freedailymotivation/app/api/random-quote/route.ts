import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Author {
  id: number;
  author_name: string;
}

interface Quote {
  id: number;
  quote_text: string;
  authors: Author[] | null;
}

export async function GET() {
  try {
    console.log('Fetching random quote from Supabase...');
    
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
      .single() as { data: Quote | null, error: any };

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

    console.log('Successfully fetched quote:', quote);

    // Handle case where quote has no author
    const authorName = quote.authors?.[0]?.author_name || 'Unknown Author';

    return NextResponse.json({
      message: quote.quote_text,
      heading: `Quote by ${authorName}`
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