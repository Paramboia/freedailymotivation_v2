import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Quote } from '@/types';
import { Metadata } from 'next';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer"; // Import the Footer component

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

async function getFavoriteQuotes(userId: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('favorites')
    .select('quote_id, quotes(quote_text, authors!inner(author_name))')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorite quotes:', error);
    return [];
  }

  return data.map(item => ({
    id: item.quote_id,
    text: item.quotes.quote_text,
    author: item.quotes.authors[0]?.author_name || 'Unknown Author',
    likes: 0,
    category: '',
    dislikes: 0
  }));
}

export default async function FavoriteQuotes() {
  const supabase = createServerComponentClient({ cookies });
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please sign in to view your favorite quotes.</div>;
  }

  const quotes = await getFavoriteQuotes(user.id);

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>Your Favorite Quotes</h1>
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {quotes.length > 0 ? (
              quotes.map((quote: Quote) => (
                <div key={quote.id} className="mb-4">
                  <p className="text-lg dark:text-gray-300">"{quote.text}" - {quote.author}</p>
                </div>
              ))
            ) : (
              <p className="dark:text-gray-300">You have no favorite quotes yet.</p>
            )}
          </div>
          <Link href="/" className="mt-8">
            <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer /> {/* Use the Footer component */}
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