import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
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

    if (error) throw error;

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
      { error: 'Failed to fetch random quote' },
      { status: 500 }
    );
  }
} 