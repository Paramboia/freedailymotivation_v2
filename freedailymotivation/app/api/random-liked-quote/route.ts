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
    console.log('Starting random liked quote fetch...');
    
    // Verify environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    
    console.log('Fetching quotes that have been liked...');

    // Get quotes that have been favorited by any user
    const { data: quotesData, error } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        authors:authors!inner (
          author_name
        ),
        favorites!inner (
          id
        )
      `);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch random liked quote',
          details: `Supabase query error: ${error.message}`,
          code: error.code
        },
        { status: 500, headers }
      );
    }

    if (!quotesData || quotesData.length === 0) {
      console.log('No liked quotes found, falling back to random quote...');
      
      // Fallback: get any random quote if no liked quotes exist
      const { data: fallbackQuotes, error: fallbackError } = await supabase
        .from('quotes')
        .select(`
          id,
          quote_text,
          authors:authors!inner (
            author_name
          )
        `)
        .limit(100); // Get a reasonable sample size

      if (fallbackError || !fallbackQuotes?.length) {
        return NextResponse.json(
          { 
            error: 'Failed to fetch random quote',
            details: 'No quotes found in database'
          },
          { status: 404, headers }
        );
      }

      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      const randomQuote = fallbackQuotes[randomIndex];
      
      return NextResponse.json({
        message: randomQuote.quote_text,
        heading: `- ${randomQuote.authors?.[0]?.author_name || 'Unknown Author'}`,
        source: 'fallback'
      }, { headers });
    }

    // Select a random quote from liked quotes
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const randomQuote = quotesData[randomIndex];

    console.log('Liked quote fetched successfully:', {
      id: randomQuote.id,
      hasAuthor: !!randomQuote.authors,
      quoteLength: randomQuote.quote_text.length,
      likeCount: randomQuote.favorites?.length || 0
    });

    // Ensure we're treating authors as an array
    const authors = Array.isArray(randomQuote.authors) 
      ? randomQuote.authors 
      : [randomQuote.authors];

    return NextResponse.json({
      message: randomQuote.quote_text,
      heading: `- ${authors?.[0]?.author_name || 'Unknown Author'}`,
      source: 'liked',
      likeCount: randomQuote.favorites?.length || 0
    }, { headers });

  } catch (error) {
    console.error('Random liked quote error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch random liked quote',
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