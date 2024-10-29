import { createClient } from '@supabase/supabase-js';
import { UserResource } from '@clerk/types';

let supabase: ReturnType<typeof createClient>;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing');
    throw new Error('Supabase configuration is incomplete');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw error;
}

export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('users').select('count').single();
    return { success: !error, error };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
}

export async function createOrGetUser(clerkUser: UserResource) {
  console.log("Creating or getting user:", { 
    clerkUserId: clerkUser.id, 
    email: clerkUser.emailAddresses[0]?.emailAddress,
    name: `${clerkUser.firstName} ${clerkUser.lastName}`
  });

  try {
    const { data: existingUser, error: initialError } = await supabase
      .from('users')
      .select('id, clerk_user_id, email')
      .eq('clerk_user_id', clerkUser.id)
      .single();

    if (initialError) {
      if (initialError.code === 'PGRST116') {
        console.log("User not found, creating new user");
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            clerk_user_id: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
          })
          .select('id, clerk_user_id, email')
          .single();

        if (createError) {
          console.error("Error creating user:", createError);
          return null;
        }

        return newUser?.id;
      } else {
        console.error("Error fetching user:", initialError);
        return null;
      }
    }

    return existingUser?.id;
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
