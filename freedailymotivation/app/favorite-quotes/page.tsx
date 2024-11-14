import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Quote } from '@/types';
import { Metadata } from 'next';
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

async function getUserId(clerkUserId: string) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }

  console.log('User ID fetched from Supabase:', data?.id); // Log the user ID fetched

  return data?.id;
}

async function getFavoriteQuotes(userId: string) {
  console.log('getFavoriteQuotes function called with userId:', userId); // Log to check if the function is called

  // Return dummy data to test display independently of Supabase
  return [
    {
      id: 'dummy-id',
      text: 'This is a test quote.',
      author: 'Test Author',
      likes: 0,
      category: '',
      dislikes: 0,
    },
  ];

  // Uncomment the following code to test with actual Supabase data once display logic is confirmed working with dummy data

  /*
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      quote_id,
      quotes!inner (
        id,
        quote_text
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorite quotes:', error);
    return [];
  }

  console.log('Fetched favorite quotes data:', data); // Log the raw data from Supabase

  return data.map((item) => {
    const quote = Array.isArray(item.quotes) ? item.quotes[0] : item.quotes;

    const mappedQuote = {
      id: quote?.id || item.quote_id,
      text: quote?.quote_text || 'Unknown Quote',
      author: 'Unknown Author', // Temporarily set to check display
      likes: 0,
      category: '',
      dislikes: 0,
    };

    console.log('Mapped quote data:', mappedQuote); // Log the mapped data for display purposes

    return mappedQuote;
  });
  */
}

export default async function FavoriteQuotes() {
  console.log('FavoriteQuotes component rendered'); // Log to check if component renders

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Testing Favorite Quotes Page
      </div>
    );
  }

  const userId = await getUserId(user.id);
  console.log('User ID from getUserId function:', userId); // Log the user ID obtained

  if (!userId) {
    return <div>Error: User not found.</div>;
  }

  const quotes = await getFavoriteQuotes(userId);
  console.log('Quotes retrieved:', quotes); // Log the quotes array obtained

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1
          className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px
