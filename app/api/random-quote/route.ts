import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

interface Quote {
  quote_text: string;
  author_name: string;
}

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
    
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('Missing DATABASE_URL environment variable');
      throw new Error('Missing DATABASE_URL environment variable');
    }

    const sql = neon(databaseUrl);
    
    console.log('Fetching random quote from Neon...');

    // Fetch random quote with author
    const quotesData = await sql`
      SELECT 
        q.id,
        q.quote_text,
        a.author_name
      FROM quotes q
      INNER JOIN authors a ON q.author_id = a.id
      ORDER BY RANDOM()
      LIMIT 1
    `;

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
      message: randomQuote.quote_text,
      heading: `- ${randomQuote.author_name || 'Unknown Author'}`
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