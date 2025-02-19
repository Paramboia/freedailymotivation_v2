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
    
    // Verify and log environment variables (without exposing sensitive data)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseKey?.length || 0
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables:', {
        url: !supabaseUrl ? 'missing' : 'present',
        key: !supabaseKey ? 'missing' : 'present'
      });
      throw new Error('Missing Supabase environment variables');
    }

    // Create Supabase client specifically for this request
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    
    console.log('Testing Supabase connection...');
    
    // First, check if we can connect to Supabase
    const { data: _test, error: testError } = await supabase
      .from('quotes')
      .select('count(*)', { count: 'exact', head: true });

    if (testError) {
      console.error('Supabase connection test error:', {
        message: testError.message,
        code: testError.code,
        details: testError.details,
        hint: testError.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch random quote',
          details: `Supabase connection error: ${testError.message}`,
          code: testError.code
        },
        { status: 500, headers }
      );
    }

    console.log('Connection successful, fetching random quote...');

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
        hint: error.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch random quote',
          details: `Supabase query error: ${error.message}`,
          code: error.code
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
      hasAuthor: !!quote.authors,
      quoteLength: quote.quote_text.length
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
    console.error('Random quote error:', {
      name: error instanceof Error ? error.name : 'Unknown error type',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      error: error // Log the full error object
    }); 
    return NextResponse.json(
      { 
        error: 'Failed to fetch random quote',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : typeof error
      },
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}