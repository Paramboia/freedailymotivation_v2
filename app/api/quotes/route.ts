import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authorFilter = searchParams.get('author');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const sql = neon(databaseUrl);

  try {
    let quotesData;

    if (authorFilter) {
      quotesData = await sql`
        SELECT 
          q.id,
          q.quote_text,
          a.author_name,
          c.category_name
        FROM quotes q
        INNER JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE a.author_name ILIKE ${authorFilter}
        ORDER BY q.created_at DESC
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
        ORDER BY q.created_at DESC
      `;
    }

    const quotes = quotesData.map(item => ({
      id: item.id,
      text: item.quote_text,
      author: item.author_name || 'Unknown Author',
      category: item.category_name || 'Uncategorized',
      likes: 0,
      dislikes: 0
    }));

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Error loading quotes:', error);
    return NextResponse.json({ error: 'Failed to load quotes' }, { status: 500 });
  }
}
