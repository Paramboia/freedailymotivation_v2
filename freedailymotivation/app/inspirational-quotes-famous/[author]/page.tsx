import { getQuotesByAuthor, loadQuotes } from '@/lib/quotes';
import QuoteBox from "@/components/quote-box";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AuthorQuotes({ params }: { params: { author: string } }) {
  await loadQuotes();
  const authorName = decodeURIComponent(params.author.replace('-', ' '));
  const quotes = getQuotesByAuthor(authorName);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-400 to-purple-400 dark:from-pink-800 dark:to-purple-800">
      <h1 className="text-4xl font-bold mb-8 text-white">Quotes by {authorName}</h1>
      {quotes.map((quote) => (
        <QuoteBox key={quote.id} quote={quote} onNewQuote={() => {}} />
      ))}
      <Link href="/famous-inspirational-quotes" className="mt-8">
        <Button variant="secondary">Back to Famous Quotes</Button>
      </Link>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { author: string } }) {
  const authorName = decodeURIComponent(params.author.replace('-', ' '));
  return {
    title: `Inspirational Quotes by ${authorName} | Free Daily Motivation`,
    description: `Discover inspiring quotes from ${authorName}. Get your daily dose of motivation and wisdom.`,
  };
}
