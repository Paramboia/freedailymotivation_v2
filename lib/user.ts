import { neon } from '@neondatabase/serverless';
import { UserResource } from '@clerk/types';

const sql = neon(process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL!);

export async function getOrCreateSupabaseUser(clerkUser: UserResource) {
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
  console.log('Creating or getting user:', { clerkUserId: clerkUser.id, email: userEmail });

  try {
    // First, try to find user by Clerk ID (normal case)
    const existingUser = await sql`
      SELECT * FROM users
      WHERE clerk_user_id = ${clerkUser.id}
      LIMIT 1
    `;

    if (existingUser && existingUser.length > 0) {
      console.log('User found by Clerk ID:', existingUser[0]);
      return existingUser[0];
    }

    // If not found by Clerk ID, try to find by email (migration case)
    if (userEmail) {
      const emailUser = await sql`
        SELECT * FROM users
        WHERE email = ${userEmail}
        LIMIT 1
      `;

      if (emailUser && emailUser.length > 0) {
        console.log('User found by email - updating Clerk ID for production migration:', emailUser[0]);
        
        // Update the existing user with the new production Clerk ID
        const updatedUser = await sql`
          UPDATE users
          SET clerk_user_id = ${clerkUser.id}
          WHERE id = ${emailUser[0].id}
          RETURNING *
        `;

        console.log('User migrated to production Clerk ID:', updatedUser[0]);
        return updatedUser[0];
      }
    }

    // User doesn't exist at all, create a new one
    const insertedUser = await sql`
      INSERT INTO users (clerk_user_id, email)
      VALUES (${clerkUser.id}, ${userEmail ?? null})
      RETURNING *
    `;

    console.log('New user created:', insertedUser[0]);
    return insertedUser[0];
  } catch (error) {
    console.error('Unexpected error in getOrCreateSupabaseUser:', error);
    throw error;
  }
}
