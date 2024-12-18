'use client';

import Link from 'next/link';
import ThemeWrapper from "@/components/ThemeWrapper";
import { Quote } from '@/types';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FavoriteQuotes() {
  const { isLoaded, isSignedIn } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/favorite-quotes', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch quotes');
        }
        const data = await response.json();
        console.log('Fetched quotes:', data);
        setQuotes(data.quotes);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`${poppins.className} text-4xl mb-4 text-gray-800 dark:text-white`}>
              Loading...
            </h1>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  if (!isSignedIn) {
    return (
      <ThemeWrapper>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center">
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Sign in to view favorite quotes
              </button>
            </Link>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
              Your Favorite Quotes
            </h1>
            {isLoading ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Loading your favorite quotes...
                </p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">
                  {error}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Try Again
                </button>
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't favorited any quotes yet.
                </p>
                <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Find Inspirational Quotes to Like
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
}
