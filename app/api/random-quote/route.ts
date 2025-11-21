import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Headers for all responses
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function GET(request: Request) {
  try {
    console.log('Starting random quote fetch...');
    
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('Missing DATABASE_URL environment variable');
      throw new Error('Missing DATABASE_URL environment variable');
    }

    const sql = neon(databaseUrl);
    
    // Get category from query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    console.log('Fetching random quote from Neon...', { category });

    // Fetch random quote with author, optionally filtered by category
    let quotesData;
    
    if (category && category !== 'all') {
      quotesData = await sql`
        SELECT 
          q.id,
          q.quote_text,
          a.author_name,
          c.category_name
        FROM quotes q
        INNER JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE c.category_name = ${category}
        ORDER BY RANDOM()
        LIMIT 1
      `;
    } else {
      quotesData = await sql`
        SELECT 
          q.id,
          q.quote_text,
          a.author_name,
          c.category_name
        FROM quotes q
        INNER JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        ORDER BY RANDOM()
        LIMIT 1
      `;
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

    const randomQuote = quotesData[0];

    console.log('Quote fetched successfully:', {
      id: randomQuote.id,
      hasAuthor: !!randomQuote.author_name,
      quoteLength: randomQuote.quote_text.length
    });

    return NextResponse.json({
      id: randomQuote.id,
      message: randomQuote.quote_text,
      heading: `- ${randomQuote.author_name || 'Unknown Author'}`,
      category: randomQuote.category_name || ''
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