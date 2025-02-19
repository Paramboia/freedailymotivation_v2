import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Author {
  author_name: string;
}

interface Quote {
  quote_text: string;
  authors: Author[] | null;
}

export const runtime = 'edge';

export async function GET() {
  try {
    console.log('Starting random quote fetch...');
    
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

    console.log('Connection test successful, fetching random quote...');

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
      console.error('Supabase query error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        query: 'quotes with author join'
      });
      throw new Error(`Supabase query error: ${error.message}`);
    }

    if (!quote) {
      console.error('No quote found in database');
      throw new Error('No quote found in database');
    }

    console.log('Quote fetched successfully:', {
      id: quote.id,
      hasAuthor: !!quote.authors
    });

    const formattedQuote: Quote = {
      quote_text: quote.quote_text,
      authors: quote.authors ? [{ author_name: quote.authors[0]?.author_name || 'Unknown Author' }] : null
    };

    console.log('Quote formatted successfully');

    return NextResponse.json({
      message: formattedQuote.quote_text,
      heading: `Quote by ${formattedQuote.authors?.[0]?.author_name || 'Unknown Author'}`
    });
  } catch (error) {
    console.error('Random quote error:', error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error); 
    return NextResponse.json(
      { 
        error: 'Failed to fetch random quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}