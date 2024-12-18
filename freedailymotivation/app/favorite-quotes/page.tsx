'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import ThemeWrapper from "@/components/ThemeWrapper";
import Link from 'next/link';
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { Poppins } from "next/font/google";
import type { Quote } from '@/types';

const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FavoriteQuotes() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavoriteQuotes() {
      if (!isUserLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/favorite-quotes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched quotes:', data);
        
        if (!data.quotes) {
          throw new Error('Invalid response format: missing quotes array');
        }

        // Convert numeric ids to strings
        const formattedQuotes: Quote[] = data.quotes.map((quote: any) => ({
          ...quote,
          id: String(quote.id)
        }));

        setQuotes(formattedQuotes);
      } catch (err) {
        console.error('Error fetching favorite quotes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch favorite quotes');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavoriteQuotes();
  }, [user, isUserLoaded]);

  if (!isUserLoaded) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 dark:from-black dark:to-zinc-900">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-gray-600 dark:text-gray-400">Loading user information...</p>
          </div>
        </div>
      </ThemeWrapper>
    );
  }

  if (isLoading) {
    return (
      <ThemeWrapper>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Loading your favorite quotes...</p>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  if (error) {
    return (
      <ThemeWrapper>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center flex-col">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Try Again
            </button>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  if (quotes.length === 0 && user) {
    return (
      <ThemeWrapper>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow flex items-center justify-center flex-col">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't favorited any quotes yet.</p>
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Find Inspirational Quotes to Like
            </Link>
          </div>
          <Footer />
        </div>
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <main className="flex-1 bg-white dark:bg-gray-900 min-h-screen">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
              My Favorite Quotes
            </h1>
            <div className="max-w-2xl mx-auto text-center mb-8">
              <p className="mb-4 dark:text-gray-300">
                Welcome to your personal collection of favorite quotes from{' '}
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Daily Motivation
                </Link>
                ! Here, you'll find inspiring words from renowned figures that
                resonate with you the most.
              </p>
              <p className="mb-4 dark:text-gray-300">
                Remember to sign in and like your favorite{' '}
                <Link href="/find-quotes" className="text-blue-600 hover:underline">
                  quotes
                </Link>{' '}
                to build a unique selection of motivational insights you can
                revisit anytime.
              </p>
            </div>
            {!user ? (
              <div className="text-center mt-12">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transform transition duration-200 hover:scale-105"
                >
                  Sign In
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
      </main>
      <Footer />
    </ThemeWrapper>
  );
}
