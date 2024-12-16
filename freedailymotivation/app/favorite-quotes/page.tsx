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
type Author = {
  author_name: string;
}

type QuoteWithAuthor = {
  id: string;
  quote_text: string;
  authors: Author[];
}

type FavoriteQuote = {
  quote_id: string;
  quotes: QuoteWithAuthor;
}

async function getFavoriteQuotes(userId: string) {
  const supabase = createServerComponentClient({ cookies });
  console.log('Querying favorites for user ID:', userId);

  // Get all favorite quotes with author information
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      quote_id,
      quotes:quotes!inner (
        id,
        quote_text,
        authors:authors!inner (
          author_name
        )
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('No favorites found for user');
    return [];
  }

  console.log('Raw favorites data:', data);

  // Map the data to the expected Quote format
  return (data as FavoriteQuote[]).map(favorite => ({
    id: favorite.quotes.id,
    text: favorite.quotes.quote_text,
    author: favorite.quotes.authors[0]?.author_name || 'Unknown Author',
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

  const userId = user.id;
  console.log('Using Supabase user ID:', userId);

  const quotes = await getFavoriteQuotes(userId);
  console.log('Final quotes array:', quotes);

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
