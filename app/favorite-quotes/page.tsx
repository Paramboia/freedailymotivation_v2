'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import ThemeWrapper from "@/components/ThemeWrapper";
import Link from 'next/link';
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { Poppins } from "next/font/google";
import type { Quote } from '@/types';
import { analytics } from "@/lib/analytics";
import FavoriteQuotesFilters from "@/components/FavoriteQuotesFilters";

const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FavoriteQuotes() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Filter states
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleFindQuotesClick = () => {
    analytics.trackCTAClick('Find Quotes', 'Favorite Quotes Page');
  };

  const handleSignInClick = () => {
    analytics.trackCTAClick('Sign In', 'Favorite Quotes Page');
  };

  // Filter and sort quotes based on current filters
  const applyFilters = useCallback(() => {
    let filtered = [...quotes];

    // Apply author filter
    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(quote => quote.author === selectedAuthor);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quote => quote.category === selectedCategory);
    }

    setFilteredQuotes(filtered);
  }, [quotes, selectedAuthor, selectedCategory]);

  // Handle filter changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Re-fetch with new sort order
    fetchFavoriteQuotes(value, selectedAuthor, selectedCategory);
  };

  const handleAuthorChange = (value: string) => {
    setSelectedAuthor(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleClearFilters = () => {
    setSelectedAuthor('all');
    setSelectedCategory('all');
  };

  const fetchFavoriteQuotes = useCallback(async (currentSortBy?: string, currentAuthor?: string, currentCategory?: string) => {
    if (!isUserLoaded || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (currentSortBy) params.append('sortBy', currentSortBy);
      if (currentAuthor && currentAuthor !== 'all') params.append('author', currentAuthor);
      if (currentCategory && currentCategory !== 'all') params.append('category', currentCategory);

      const response = await fetch(`/api/favorite-quotes?${params.toString()}`, {
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

      // Convert numeric ids to strings and ensure author is properly mapped
      const formattedQuotes: Quote[] = data.quotes.map((quote: any) => ({
        id: String(quote.id),
        text: quote.text,
        author: quote.author,
        likes: quote.likes || 0,
        dislikes: quote.dislikes || 0,
        category: quote.category || ''
      }));

      setQuotes(formattedQuotes);
      setAvailableAuthors(data.availableAuthors || []);
      setAvailableCategories(data.availableCategories || []);
    } catch (err) {
      console.error('Error fetching favorite quotes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch favorite quotes');
    } finally {
      setIsLoading(false);
    }
  }, [user, isUserLoaded]);

  // Initial fetch
  useEffect(() => {
    fetchFavoriteQuotes();
  }, [fetchFavoriteQuotes]);

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
        <main className="flex-1 min-h-screen">
          <div className="flex-grow">
            <div className="container mx-auto px-4 py-8">
              <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
                My Favorite Quotes
              </h1>
              <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center">
                  <div className="loader"></div>
                  <div className="mt-4 text-gray-600 dark:text-gray-400">Loading your favorite quotes...</div>
                </div>

                <style jsx>{`
                  .loader {
                    border: 8px solid transparent;
                    border-top: 8px solid;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    border-image: linear-gradient(to right, #ff007f, #3498db);
                    border-image-slice: 1;
                  }

                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </ThemeWrapper>
    );
  }

  if (error) {
    return (
      <ThemeWrapper>
      <main className="flex-1 min-h-screen">
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
                Oops... something went wrong! Please try again or refresh the page.
              </p>
            </div>
            <div className="text-center mt-12">
            <button 
              onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
              >
                Try Again
            </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ThemeWrapper>
    );
  }

  if (quotes.length === 0 && user) {
    return (
      <ThemeWrapper>
        <main className="flex-1 min-h-screen">
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
                  You haven't liked any{' '}
                <Link href="/find-quotes" className="text-blue-600 hover:underline">
                  quotes
                </Link>{' '}
                   yet. Start exploring to find quotes that inspire you!
                </p>
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/find-quotes"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
                  onClick={handleFindQuotesClick}
                >
                  Find Quotes
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <main className="flex-1 min-h-screen">
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
                Remember to sign in and to like your favorite{' '}
                <Link href="/find-quotes" className="text-blue-600 hover:underline">
                  quotes
                </Link>{' '}
                to build a unique selection of motivational insights you can
                revisit anytime.
              </p>
            </div>
            {!user ? (
              <div className="text-center mt-12">
                <SignInButton mode="modal">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
                    onClick={handleSignInClick}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </div>
            ) : (
              <div>
                <FavoriteQuotesFilters
                  sortBy={sortBy}
                  selectedAuthor={selectedAuthor}
                  selectedCategory={selectedCategory}
                  availableAuthors={availableAuthors}
                  availableCategories={availableCategories}
                  onSortChange={handleSortChange}
                  onAuthorChange={handleAuthorChange}
                  onCategoryChange={handleCategoryChange}
                  onClearFilters={handleClearFilters}
                />
                
                {filteredQuotes.length === 0 ? (
                  <div className="text-center mt-8 p-8 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/50">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No quotes found with the current filters.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredQuotes.map((quote) => (
                      <QuoteBox key={quote.id} quote={quote} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </ThemeWrapper>
  );
}
