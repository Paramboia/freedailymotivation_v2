import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quoteId = searchParams.get('quoteId');

  if (!quoteId) {
    return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { count, error } = await supabase
    .from('favorites')
    .select('id', { count: 'exact' })
    .eq('quote_id', quoteId);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch like count' }, { status: 500 });
  }

  return NextResponse.json({ likes: count });
}
