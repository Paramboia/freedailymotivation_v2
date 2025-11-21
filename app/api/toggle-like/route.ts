import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const clerkUserId = session.userId;

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quoteId } = await request.json();

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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userData[0].id;

    // Check if like exists
    const existingLike = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${userId} AND quote_id = ${quoteId}
      LIMIT 1
    `;

    if (existingLike && existingLike.length > 0) {
      // Remove like
      await sql`
        DELETE FROM favorites
        WHERE id = ${existingLike[0].id}
      `;
      return NextResponse.json({ liked: false });
    } else {
      // Add like
      await sql`
        INSERT INTO favorites (user_id, quote_id)
        VALUES (${userId}, ${quoteId})
      `;
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}

