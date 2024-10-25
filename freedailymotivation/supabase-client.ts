import { createClient } from '@supabase/supabase-js';
import { User } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function createOrGetUser(clerkUser: User) {
  console.log("Creating or getting user:", { 
    clerkUserId: clerkUser.id, 
    email: clerkUser.emailAddresses[0]?.emailAddress,
    name: `${clerkUser.firstName} ${clerkUser.lastName}`
  });

  try {
    // First, try to get the user
    let { data: user, error } = await supabase
      .from('users')
      .select('id, clerk_user_id, email')
      .eq('clerk_user_id', clerkUser.id)
      .single();

    console.log("Supabase query result:", { user, error });

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("User not found, creating new user");
        // User not found, so create a new one
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

        console.log("New user created:", newUser);
        user = newUser;
      } else {
        console.error("Error fetching user:", error);
        return null;
      }
    }

    console.log("User from Supabase:", user);
    return user?.id;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      console.error("Supabase connection test failed:", error);
      return { success: false, error };
    }

    console.log("Supabase connection test successful:", { count: data?.length });
    return { success: true, count: data?.length };
  } catch (error) {
    console.error("Unexpected error during Supabase connection test:", error);
    return { success: false, error };
  }
}
