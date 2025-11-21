import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

export async function POST() {
  try {
    const session = await auth();
    const clerkUser = session.userId;

    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(databaseUrl);

    // Get user email from Clerk
    const user = await auth();
    const userEmail = user?.sessionClaims?.email as string | undefined;

    // First, try to find user by Clerk ID
    const existingUser = await sql`
      SELECT * FROM users
      WHERE clerk_user_id = ${clerkUser}
      LIMIT 1
    `;

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ 
        userId: existingUser[0].id,
        connected: true 
      });
    }

    // If not found by Clerk ID, try to find by email
    if (userEmail) {
      const emailUser = await sql`
        SELECT * FROM users
        WHERE email = ${userEmail}
        LIMIT 1
      `;

      if (emailUser && emailUser.length > 0) {
        // Update the existing user with the Clerk ID
        const updatedUser = await sql`
          UPDATE users
          SET clerk_user_id = ${clerkUser}
          WHERE id = ${emailUser[0].id}
          RETURNING *
        `;

        return NextResponse.json({ 
          userId: updatedUser[0].id,
          connected: true 
        });
      }
    }

    // User doesn't exist, create a new one
    const newUser = await sql`
      INSERT INTO users (clerk_user_id, email)
      VALUES (${clerkUser}, ${userEmail ?? null})
      RETURNING *
    `;

    return NextResponse.json({ 
      userId: newUser[0].id,
      connected: true 
    });

  } catch (error) {
    console.error('Error in user route:', error);
    return NextResponse.json({ 
      error: 'Failed to create/get user',
      connected: false 
    }, { status: 500 });
  }
}

// GET endpoint to check connection
export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ connected: false });
    }

    const sql = neon(databaseUrl);
    await sql`SELECT 1`;
    
    return NextResponse.json({ connected: true });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({ connected: false });
  }
}

