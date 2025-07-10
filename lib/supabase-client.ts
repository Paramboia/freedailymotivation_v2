import { createClient } from '@supabase/supabase-js';
import { UserResource } from '@clerk/types';
import type { Database } from '@/types/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('users').select('count').single();
    return { success: !error, error };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
}

export async function createOrGetUser(clerkUser: UserResource): Promise<string | null> {
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
  
  try {
    // First, try to find user by Clerk ID (normal case)
    const { data: existingUser, error: initialError } = await supabase
      .from('users')
      .select()
      .eq('clerk_user_id', clerkUser.id)
      .single();

    if (!initialError && existingUser) {
      console.log('User found by Clerk ID:', existingUser.id);
      return existingUser.id;
    }

    // If not found by Clerk ID, try to find by email (migration case)
    if (userEmail) {
      const { data: emailUser, error: emailError } = await supabase
        .from('users')
        .select()
        .eq('email', userEmail)
        .single();

      if (!emailError && emailUser) {
        console.log('User found by email - updating Clerk ID for production migration:', emailUser.id);
        
        // Update the existing user with the new production Clerk ID
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ clerk_user_id: clerkUser.id })
          .eq('id', emailUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user Clerk ID:', updateError);
          return null;
        }

        console.log('User migrated to production Clerk ID:', updatedUser?.id);
        return updatedUser?.id ?? null;
      }
    }

    // User doesn't exist at all, create a new one
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        clerk_user_id: clerkUser.id,
        email: userEmail ?? null,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return null;
    }

    console.log('New user created:', newUser?.id);
    return newUser?.id ?? null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}

export async function toggleLike(userId: string, quoteId: string) {
  console.log('Toggling like:', { userId, quoteId });

  const { data: existingLike, error: fetchError } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('quote_id', quoteId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching like:', fetchError);
    return false;
  }

  if (existingLike) {
    console.log('Removing existing like:', existingLike);
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingLike.id);

    if (deleteError) {
      console.error('Error removing like:', deleteError);
      return false;
    }
    return false; // Like removed
  } else {
    console.log('Adding new like');
    const { data: newLike, error: insertError } = await supabase
      .from('favorites')
      .insert([
        { user_id: userId, quote_id: quoteId }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error adding like:', JSON.stringify(insertError, null, 2));
      return false;
    }
    console.log('New like added:', newLike);
    return true; // Like added
  }
}

export async function getLikeStatus(userId: string, quoteId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('quote_id', quoteId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching like status:', error);
    return false;
  }

  return !!data;
}

export async function getLikeCount(quoteId: string): Promise<number> {
  const { count, error } = await supabase
    .from('favorites')
    .select('id', { count: 'exact' })
    .eq('quote_id', quoteId);

  if (error) {
    console.error('Error fetching like count:', error);
    return 0;
  }

  return count || 0;
}
