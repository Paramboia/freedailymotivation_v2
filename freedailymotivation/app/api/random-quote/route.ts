import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching random quote from Supabase...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Has Supabase Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data: quote, error } = await supabase
      .from('Quotes')
      .select(`
        quote_text,
        authors:Authors!inner (
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

    // Ensure authors is treated as an array
    const authors = Array.isArray(quote.authors) 
      ? quote.authors 
      : [quote.authors];

    return NextResponse.json({
      message: quote.quote_text,
      heading: `Quote by ${authors[0]?.author_name || 'Unknown Author'}`
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