import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ThemeWrapper from "@/components/ThemeWrapper";
import QuoteBox from "@/components/quote-box";
import { Quote } from '@/types';

export const revalidate = 3600; // Revalidate every hour

async function getAuthorQuotes(authorName: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('quotes')
    .select('id, quote_text, authors!inner(name)')
    .eq('authors.name', authorName);

  if (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    text: item.quote_text,
    author: authorName, // Use the authorName directly
    likes: 0, // You might want to implement a likes system in the future
    category: '', // Add a default value for category
    dislikes: 0 // Add a default value for dislikes
  }));
}

export default async function AuthorQuotes({ params }: { params: { author: string } }) {
  const authorName = decodeURIComponent(params.author.replace('-', ' '));
  const quotes = await getAuthorQuotes(authorName);

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Famous Inspirational Quotes - {authorName}</h1>
          <div className="max-w-2xl text-center mb-8">
            <p className="mb-4 dark:text-gray-300">
              Looking for the perfect quote to inspire your next big move or connect with like-minded thinkers? Free Daily Motivation has you covered! Discover insights from {authorName}, a legendary figure known for their wisdom and impact. Whether you're looking to enhance your social media posts, presentations, or personal mindset, our platform makes it easy to find and share quotes that resonate with your goals. Let {authorName}'s words fuel your journey to success.
            </p>
          </div>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Inspirational Quotes by {authorName}</h2>
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {quotes.map((quote: Quote) => (
              <QuoteBox key={quote.id} quote={quote} onNewQuote={() => {}} />
            ))}
          </div>
          <Link href="/" className="mt-8">
            <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">
              Find More Quotes
            </Button>
          </Link>
        </main>
        <footer className="p-4 text-sm text-white text-center dark:text-gray-300">
          © 2024 Free Daily Motivation. All rights reserved.
        </footer>
      </div>
    </ThemeWrapper>
  );
}

export async function generateMetadata({ params }: { params: { author: string } }) {
  const authorName = decodeURIComponent(params.author.replace('-', ' '));
  return {
    title: `Inspirational Quotes by ${authorName} | Free Daily Motivation`,
    description: `Discover inspiring quotes from ${authorName}. Get your daily dose of motivation and wisdom.`,
  };
}
