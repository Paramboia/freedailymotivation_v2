import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase
      .from('authors')
      .select('author_name')
      .order('author_name');

    if (error) {
      console.error('Error fetching authors:', error);
      return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in authors API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 