// Import necessary libraries
import { createClient } from '@supabase/supabase-js'
import { useUser } from '@clerk/nextjs'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// In your component or page
const { user } = useUser()

// Function to create or fetch user in Supabase
async function getOrCreateSupabaseUser() {
  if (!user) {
    console.log('No user signed in');
    return null;
  }

  console.log('Clerk user:', user);

  // Keep the 'user_' prefix as it seems to be part of the ID
  const clerkUserId = user.id;

  console.log('Fetching user from Supabase with clerk_user_id:', clerkUserId);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    console.error('Error fetching user:', error);
    if (error.code === 'PGRST116') {
      console.log('User not found, attempting to create');
      // If user doesn't exist, create a new one
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ clerk_user_id: clerkUserId, email: user.emailAddresses[0].emailAddress })
        .single()

      if (createError) {
        console.error('Error creating user:', createError);
        return null;
      }

      console.log('New user created:', newUser);
      return newUser;
    }
    return null;
  }

  console.log('User found in Supabase:', data);
  return data;
}

// Use this function when you need to interact with Supabase
const supabaseUser = await getOrCreateSupabaseUser();
console.log('Supabase user:', supabaseUser);
