import { neon } from '@neondatabase/serverless';
import { UserResource } from '@clerk/types';

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable');
}

const sql = neon(DATABASE_URL);

export async function testNeonConnection() {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM users`;
    return { success: true, count: result[0]?.count };
  } catch (error) {
    console.error('Neon connection test failed:', error);
    return { success: false, error };
  }
}

export async function createOrGetUser(clerkUser: UserResource): Promise<string | null> {
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
  
  try {
    // First, try to find user by Clerk ID (normal case)
    const existingUser = await sql`
      SELECT * FROM users 
      WHERE clerk_user_id = ${clerkUser.id}
      LIMIT 1
    `;

    if (existingUser && existingUser.length > 0) {
      console.log('User found by Clerk ID:', existingUser[0].id);
      return existingUser[0].id;
    }

    // If not found by Clerk ID, try to find by email (migration case)
    if (userEmail) {
      const emailUser = await sql`
        SELECT * FROM users 
        WHERE email = ${userEmail}
        LIMIT 1
      `;

      if (emailUser && emailUser.length > 0) {
        console.log('User found by email - updating Clerk ID for production migration:', emailUser[0].id);
        
        // Update the existing user with the new production Clerk ID
        const updatedUser = await sql`
          UPDATE users 
          SET clerk_user_id = ${clerkUser.id}
          WHERE id = ${emailUser[0].id}
          RETURNING *
        `;

        if (updatedUser && updatedUser.length > 0) {
          console.log('User migrated to production Clerk ID:', updatedUser[0].id);
          return updatedUser[0].id;
        }
      }
    }

    // User doesn't exist at all, create a new one
    const newUser = await sql`
      INSERT INTO users (clerk_user_id, email)
      VALUES (${clerkUser.id}, ${userEmail ?? null})
      RETURNING *
    `;

    if (newUser && newUser.length > 0) {
      console.log('New user created:', newUser[0].id);
      return newUser[0].id;
    }

    return null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}

export async function toggleLike(userId: string, quoteId: string) {
  console.log('Toggling like:', { userId, quoteId });

  try {
    const existingLike = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${userId} AND quote_id = ${quoteId}
      LIMIT 1
    `;

    if (existingLike && existingLike.length > 0) {
      console.log('Removing existing like:', existingLike[0]);
      await sql`
        DELETE FROM favorites
        WHERE id = ${existingLike[0].id}
      `;
      return false; // Like removed
    } else {
      console.log('Adding new like');
      const newLike = await sql`
        INSERT INTO favorites (user_id, quote_id)
        VALUES (${userId}, ${quoteId})
        RETURNING *
      `;
      console.log('New like added:', newLike[0]);
      return true; // Like added
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
}

export async function getLikeStatus(userId: string, quoteId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${userId} AND quote_id = ${quoteId}
      LIMIT 1
    `;
    return result && result.length > 0;
  } catch (error) {
    console.error('Error fetching like status:', error);
    return false;
  }
}

export async function getLikeCount(quoteId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM favorites
      WHERE quote_id = ${quoteId}
    `;
    return result[0]?.count ? parseInt(result[0].count) : 0;
  } catch (error) {
    console.error('Error fetching like count:', error);
    return 0;
  }
}

export { sql };

