import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    
    // First, check if we can connect to Supabase
    const { data: _test, error: testError } = await supabase
      .from('Quotes')
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
      .from('Quotes')
      .select(`
        quote_text,
        authors:Authors (
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
        details: error.details
      });
      throw error;
    }

    if (!quote) {
      console.error('No quote found in database');
      throw new Error('No quote found in database');
    }

    console.log('Successfully fetched quote:', quote);

    // Handle case where quote has no author or authors is an array
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