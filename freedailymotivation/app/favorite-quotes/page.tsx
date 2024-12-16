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

async function getFavoriteQuotes(userId: string): Promise<Quote[]> {
  try {
    const supabase = createServerComponentClient({ cookies });
    console.log('Fetching favorites for user:', userId);

    // Get favorites with quotes and authors in a single query
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        quotes (
          id,
          quote_text,
          authors (
            author_name
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('No favorites found');
      return [];
    }

    console.log('Raw favorites data:', JSON.stringify(data, null, 2));

    // Map the joined data to Quote format
    return data
      .filter(favorite => favorite.quotes) // Filter out any null quotes
      .map(favorite => ({
        id: favorite.quotes.id,
        text: favorite.quotes.quote_text,
        author: favorite.quotes.authors?.[0]?.author_name || 'Unknown Author',
        likes: 0,
        category: '',
        dislikes: 0
      }));

  } catch (error) {
    console.error('Error in getFavoriteQuotes:', error);
    return [];
  }
}

export default async function FavoriteQuotes() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
              Please sign in to view your favorite quotes
            </h1>
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Go back home
            </Link>
          </div>
        </div>
      );
    }

    const quotes = await getFavoriteQuotes(user.id);
    console.log('Final quotes:', quotes);

    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="container mx-auto px-4 py-8">
            <h1 className={`${poppins.className} text-4xl mb-8 text-center text-gray-800 dark:text-white`}>
              Your Favorite Quotes
            </h1>
            <div className="max-w-6xl mx-auto">
              {quotes.length === 0 ? (
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't favorited any quotes yet.
                  </p>
                  <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Discover quotes to favorite
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {quotes.map((quote) => (
                    <QuoteBox key={quote.id} quote={quote} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  } catch (error) {
    console.error('Error in FavoriteQuotes page:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We're having trouble loading your favorite quotes.
          </p>
          <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Go back home
          </Link>
        </div>
      </div>
    );
  }
}

export const metadata: Metadata = {
  title: 'Your Favorite Quotes - Free Daily Motivation',
  description: 'View your collection of favorite motivational quotes.',
};
