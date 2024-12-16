import { currentUser } from "@clerk/nextjs/server";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ThemeWrapper from "@/components/ThemeWrapper";
import { Quote } from '@/types';
import { Metadata } from 'next';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

async function getUserId(clerkUserId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  // Get user by clerk_user_id
  const { data: existingUser, error: _fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (_fetchError) {
    console.error('Error fetching user:', _fetchError);
    return null;
  }

  if (existingUser) {
    return existingUser.id;
  }

  console.error('User not found for clerk_user_id:', clerkUserId);
  return null;
}

async function getFavoriteQuotes(userId: string) {
  const supabase = createServerComponentClient({ cookies });

  // First get the favorite quote IDs for the user
  const { data: favoriteData, error: favoriteError } = await supabase
    .from('favorites')
    .select('quote_id')
    .eq('user_id', userId);

  if (favoriteError) {
    console.error('Error fetching favorites:', favoriteError);
    return [];
  }

  if (!favoriteData || favoriteData.length === 0) {
    return [];
  }

  const quoteIds = favoriteData.map(fav => fav.quote_id);

  // Then get the actual quotes with their authors
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      id,
      quote_text,
      authors!inner (
        author_name
      )
    `)
    .in('id', quoteIds);

  if (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }

  return data.map(quote => ({
    id: quote.id,
    text: quote.quote_text,
    author: quote.authors[0]?.author_name || 'Unknown Author',
    likes: 0,
    category: '',
    dislikes: 0
  }));
}

export default async function FavoriteQuotes() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col items-center justify-center p-8">
            <h1
              className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}
            >
              My Favorite Quotes
            </h1>
            <div className="max-w-2xl text-center">
              <p className="mb-4 dark:text-gray-300">
                Please sign in to view your favorite quotes from{' '}
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Daily Motivation
                </Link>
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  const userId = await getUserId(user.id);
  console.log('Clerk user ID:', user.id);
  console.log('Supabase user ID:', userId);
  
  if (!userId) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col items-center justify-center p-8">
            <p className="text-center dark:text-gray-300">
              Error: Unable to find your user information. This might happen if your account is not properly set up.
              Please try signing out and signing in again.
            </p>
          </main>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  const quotes = await getFavoriteQuotes(userId);
  console.log('Fetched quotes:', quotes);

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1
            className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}
          >
            My Favorite Quotes
          </h1>
          <div className="max-w-2xl text-center mb-8">
            <p className="mb-4 dark:text-gray-300">
              Welcome to your personal collection of favorite quotes from{' '}
              <Link href="/" className="text-blue-600 hover:underline">
                Free Daily Motivation
              </Link>
              ! Here are all the inspiring quotes you've liked.
            </p>
          </div>
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {quotes.length > 0 ? (
              quotes.map((quote: Quote) => (
                <QuoteBox key={quote.id} quote={quote} />
              ))
            ) : (
              <p className="text-center dark:text-gray-300">
                You haven't liked any quotes yet. Browse through our collection and click the heart icon to add quotes to your favorites!
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeWrapper>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Favorite Quotes | Free Daily Motivation',
    description: 'View your favorite quotes that inspire and motivate you.',
  };
}
