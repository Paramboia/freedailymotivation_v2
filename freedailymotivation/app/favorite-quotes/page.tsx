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

// Define types for our database structure
type DatabaseQuote = {
  id: string;
  quote_text: string;
  authors: { author_name: string }[];
}

type FavoriteWithQuote = {
  quotes: DatabaseQuote;
}

async function getFavoriteQuotes(userId: string): Promise<Quote[]> {
  try {
    const supabase = createServerComponentClient({ cookies });
    console.log('Fetching favorites for user:', userId);

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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No favorites found');
      return [];
    }

    console.log('Raw favorites data:', data);

    // Transform the data into Quote format
    return (data as FavoriteWithQuote[]).map(favorite => {
      const quote = favorite.quotes;
      return {
        id: quote.id,
        text: quote.quote_text,
        author: quote.authors?.[0]?.author_name || 'Unknown Author',
        likes: 0,
        category: '',
        dislikes: 0
      };
    });
  } catch (error) {
    console.error('Unexpected error in getFavoriteQuotes:', error);
    return [];
  }
}

export default async function FavoriteQuotes() {
  try {
    const user = await currentUser();
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
            Please sign in to view your favorite quotes
          </h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Go back home
          </Link>
        </div>
      );
    }

    const quotes = await getFavoriteQuotes(user.id);
    console.log('Processed quotes:', quotes);

    return (
      <ThemeWrapper>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow container mx-auto px-4 py-8">
            <h1 className={`${poppins.className} text-4xl mb-8 text-center text-gray-800 dark:text-white`}>
              Your Favorite Quotes
            </h1>
            {quotes.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't favorited any quotes yet.</p>
                <Link href="/" className="text-blue-500 hover:text-blue-700">
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
          </main>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  } catch (error) {
    console.error('Error in FavoriteQuotes page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
          Something went wrong
        </h1>
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          Go back home
        </Link>
      </div>
    );
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Favorite Quotes | Free Daily Motivation',
    description: 'View your favorite quotes that inspire and motivate you.',
  };
}
