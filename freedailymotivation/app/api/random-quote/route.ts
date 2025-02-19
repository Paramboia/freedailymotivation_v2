import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: quote, error } = await supabase
      .from('Quotes')
      .select(`
        quote_text,
        author:Authors!inner (
          name
        )
      `)
      .order('RANDOM()')
      .limit(1)
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: quote.quote_text,
      heading: `Quote by ${quote.author?.name || 'Unknown Author'}`
    });
  } catch (error) {
    console.error('Random quote error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random quote' },
      { status: 500 }
    );
  }
} 