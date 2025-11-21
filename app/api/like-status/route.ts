import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const clerkUserId = session.userId;

    if (!clerkUserId) {
      return NextResponse.json({ liked: false });
    }

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

    // Get user ID from Clerk ID
    const userData = await sql`
      SELECT id FROM users
      WHERE clerk_user_id = ${clerkUserId}
      LIMIT 1
    `;

    if (!userData || userData.length === 0) {
      return NextResponse.json({ liked: false });
    }

    const userId = userData[0].id;

    // Check if like exists
    const result = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${userId} AND quote_id = ${quoteId}
      LIMIT 1
    `;

    return NextResponse.json({ liked: result && result.length > 0 });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json({ liked: false });
  }
}

