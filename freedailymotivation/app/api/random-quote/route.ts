import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Author {
  author_name: string;
}

interface Quote {
  quote_text: string;
  authors: Author[] | null;
}

export const runtime = 'edge';

// Headers for all responses
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function GET() {
  try {
    console.log('Starting random quote fetch...');
    
    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    // Create Supabase client specifically for this request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );
    
    console.log('Supabase client created, testing connection...');
    
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
      return NextResponse.json(
        { 
          error: 'Failed to fetch random quote',
          details: `Supabase connection error: ${testError.message}`
        },
        { status: 500, headers }
      );
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
      return NextResponse.json(
        { 
          error: 'Failed to fetch random quote',
          details: `Supabase query error: ${error.message}`
        },
        { status: 500, headers }
      );
    }

    if (!quote) {
      console.error('No quote found in database');
      return NextResponse.json(
        { 
          error: 'Failed to fetch random quote',
          details: 'No quote found in database'
        },
        { status: 404, headers }
      );
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
    }, { headers });
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
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}