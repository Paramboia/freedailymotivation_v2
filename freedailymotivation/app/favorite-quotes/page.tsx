import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs';

export default async function FavoriteQuotes() {
  console.log('FavoriteQuotes component rendered'); // Log to check if component renders

  // Fetch Clerk JWT token
  const { getToken } = auth();
  const token = await getToken();

  if (!token) {
    console.log('No Clerk token found');
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: Clerk token missing
      </div>
    );
  }

  // Create a Supabase client instance and set the auth token
  const supabase = createServerComponentClient({ cookies });
  supabase.auth.setAuth(token);

  // Attempt to retrieve the user
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user from Supabase:', error);
      return (
        <div className="min-h-screen flex items-center justify-center">
          Error fetching user: {error.message}
        </div>
      );
    }

    if (!user) {
      console.log('No user found');
      return (
        <div className="min-h-screen flex items-center justify-center">
          No user found. Please log in.
        </div>
      );
    }

    console.log('User fetched successfully:', user);

    return (
      <div className="min-h-screen flex items-center justify-center">
        User ID: {user.id}
      </div>
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        An unexpected error occurred.
      </div>
    );
  }
}
