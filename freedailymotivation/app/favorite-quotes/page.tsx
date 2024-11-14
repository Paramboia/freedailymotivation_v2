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
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) throw error;
    console.log('User ID fetched from Supabase:', data?.id);
    return data?.id;
  } catch (error) {
    console.error('Error fetching user ID from Supabase:', error);
    return null;
  }
}

async function getFavoriteQuotes(userId: string) {
  console.log('getFavoriteQuotes function called with userId:', userId);

  try {
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

    if (error) throw error;
    console.log('Fetched favorite quotes data:', data);

    return data.map((item) => {
      const quote = Array.isArray(item.quotes) ? item.quotes[0] : item.quotes;
      return {
        id: quote?.id || item.quote_id,
        text: quote?.quote_text || 'Unknown Quote',
        author: 'Unknown Author',
        likes: 0,
        category: '',
        dislikes: 0,
      };
    });
  } catch (error) {
    console.error('Error fetching favorite quotes from Supabase:', error);
    return [];
  }
}

export default async function FavoriteQuotes() {
  console.log('FavoriteQuotes component rendered');

  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    console.log('User is not logged in or does not have an ID');
    return (
      <div className="min-h-screen flex items-center justify-center">
        Testing Favorite Quotes Page
      </div>
    );
  }

  const userId = await getUserId(user.id);
  console.log('User ID from getUserId function:', userId);

  if (!userId) {
    return <div>Error: User not found.</div>;
  }

  const quotes = await getFavoriteQuotes(userId);
  console.log('Quotes retrieved:', quotes);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1
          className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}
        >
          My Favorite Quotes
        </h1>
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          {quotes.length > 0 ? (
            quotes.map((quote: Quote) => (
              <div key={quote.id} className="mb-4">
                <p className="text-lg dark:text-gray-300">
                  "{quote.text}" - {quote.author}
                </p>
              </div>
            ))
          ) : (
            <p className="dark:text-gray-300">
              You have no favorite quotes yet.
            </p>
          )}
        </div>
        <Link href="/" className="mt-8">
          <Button
            variant="secondary"
            className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]"
          >
            Back to Home
          </Button>
        </Link>
      </main>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Favorite Quotes | Free Daily Motivation',
    description: 'View your favorite quotes that inspire and motivate you.',
  };
}
