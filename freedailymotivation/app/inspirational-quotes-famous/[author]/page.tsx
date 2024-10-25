import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ThemeWrapper from "@/components/ThemeWrapper";
import dynamic from 'next/dynamic';
import { Quote } from '@/types';

const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

export const revalidate = 3600; // Revalidate every hour

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

async function getAuthorQuotes(authorName: string) {
  const supabase = createServerComponentClient({ cookies });
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
    author: capitalizeWords(authorName),
    likes: 0,
    category: '',
    dislikes: 0
  }));
}

export default async function AuthorQuotes({ params }: { params: { author: string } }) {
  const authorName = capitalizeWords(decodeURIComponent(params.author.replace('-', ' ')));
  const quotes = await getAuthorQuotes(authorName);

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Famous Inspirational Quotes - {authorName}</h1>
          <div className="max-w-2xl text-center mb-8">
            <p className="mb-4 dark:text-gray-300">
              Looking for the perfect quote to inspire your next big move or connect with like-minded thinkers? <Link href="/" className="text-blue-500 hover:underline dark:text-blue-400">Free Daily Motivation</Link> has you covered! Discover insights from {authorName}, a legendary figure known for their wisdom and impact. Whether you're looking to enhance your social media posts, presentations, or personal mindset, our platform makes it easy to find and share quotes that resonate with your goals. Let {authorName}'s words fuel your journey to success.
            </p>
          </div>
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {quotes.map((quote: Quote) => (
              <QuoteBox key={quote.id} quote={quote} />
            ))}
          </div>
          <Link href="/inspirational-quotes-famous" className="mt-8">
            <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">
              Back to Famous Quotes
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
  const authorName = capitalizeWords(decodeURIComponent(params.author.replace('-', ' ')));
  return {
    title: `Inspirational Quotes by ${authorName} | Free Daily Motivation`,
    description: `Discover inspiring quotes from ${authorName}. Get your daily dose of motivation and wisdom.`,
  };
}
