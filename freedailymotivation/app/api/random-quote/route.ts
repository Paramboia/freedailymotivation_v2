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
    
    console.log('Fetching quotes...');

    // Fetch quotes with authors using inner join
    const { data: quotesData, error } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        authors:authors!inner (
          author_name
        )
      `);

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

    if (!quotesData || quotesData.length === 0) {
      console.error('No quotes found in database');
      return NextResponse.json(
        { 
          error: 'Failed to fetch random quote',
          details: 'No quotes found in database'
        },
        { status: 404, headers }
      );
    }

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const randomQuote = quotesData[randomIndex];

    console.log('Quote fetched successfully:', {
      id: randomQuote.id,
      hasAuthor: !!randomQuote.authors,
      quoteLength: randomQuote.quote_text.length
    });

    // Ensure we're treating authors as an array
    const authors = Array.isArray(randomQuote.authors) 
      ? randomQuote.authors 
      : [randomQuote.authors];

    const formattedQuote: Quote = {
      quote_text: randomQuote.quote_text,
      authors: authors.map(author => ({ author_name: author.author_name }))
    };

    console.log('Quote formatted successfully');

    return NextResponse.json({
      message: formattedQuote.quote_text,
      heading: `- ${formattedQuote.authors?.[0]?.author_name || 'Unknown Author'}`
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