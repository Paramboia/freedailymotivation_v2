import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ThemeWrapper from "@/components/ThemeWrapper";
import { default as nextDynamic } from 'next/dynamic';
import { Quote } from '@/types';
import { Metadata } from 'next';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer"; // Import the Footer component
import ClientPageTracker from "@/components/ClientPageTracker"; // Import the ClientPageTracker component

const QuoteBox = nextDynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export const revalidate = 3600; // Revalidate every hour

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

async function getAuthorQuotes(authorName: string) {
  const supabase = createServerComponentClient({ cookies });
  
  // First, get the exact author name from the authors table
  const { data: authorData } = await supabase
    .from('authors')
    .select('author_name')
    .ilike('author_name', authorName)
    .single();

  if (!authorData) {
    console.error('Author not found:', authorName);
    return [];
  }

  const exactAuthorName = authorData.author_name;

  // Then use the exact author name to get quotes
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      id,
      quote_text,
      authors!inner (
        author_name
      )
    `)
    .eq('authors.author_name', exactAuthorName);

  if (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    text: item.quote_text,
    author: exactAuthorName,
    likes: 0,
    category: '',
    dislikes: 0
  }));
}

export default async function AuthorQuotes({ params }: { params: { author: string } }) {
  const authorName = capitalizeWords(decodeURIComponent(params.author.replace(/-/g, ' ')));
  const quotes = await getAuthorQuotes(authorName);

  return (
    <ThemeWrapper>
      <ClientPageTracker />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>Famous Inspirational Quotes - {authorName}</h1>
          <div className="max-w-2xl text-center mb-8">
            <p className="mb-4 dark:text-gray-300">
              Looking for the perfect quote to inspire your next big move or connect with like-minded thinkers? <Link href="/" className="text-blue-500 hover:underline dark:text-blue-400">Free Daily Motivation</Link> has you covered! Discover insights from {authorName}, a legendary figure known for their wisdom and impact. Whether you're looking to enhance your social media posts, presentations, or personal mindset, our platform makes it easy to find and share quotes that resonate with your goals. Let {authorName}'s words fuel your journey to success.
            </p>
          </div>
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {quotes.map((quote: Quote) => (
              <QuoteBox key={quote.id} quote={quote} _isAuthorPage={true} />
            ))}
          </div>
          <Link href="/inspirational-quotes-famous" className="mt-8">
            <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">
              Back to Famous Quotes
            </Button>
          </Link>
        </main>
        <Footer /> {/* Use the Footer component */}
      </div>
    </ThemeWrapper>
  );
}

export async function generateMetadata({ params }: { params: { author: string } }): Promise<Metadata> {
  const authorName = capitalizeWords(decodeURIComponent(params.author.replace('-', ' ')));
  return {
    title: `Inspirational Quotes by ${authorName} | Free Daily Motivation`,
    description: `Explore inspiring quotes from ${authorName}. Find wisdom and motivation to fuel your success. Perfect for presentations, social media, and personal growth.`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
