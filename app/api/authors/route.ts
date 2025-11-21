import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(databaseUrl);
    const data = await sql`
      SELECT author_name
      FROM authors
      ORDER BY author_name ASC
    `;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in authors API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 