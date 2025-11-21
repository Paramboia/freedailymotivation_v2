import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');

    if (!quoteId) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(databaseUrl);

    const result = await sql`
      SELECT COUNT(*) as count
      FROM favorites
      WHERE quote_id = ${quoteId}
    `;

    const count = result[0]?.count ? parseInt(result[0].count) : 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching like count:', error);
    return NextResponse.json({ count: 0 });
  }
}

