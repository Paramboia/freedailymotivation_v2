'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ThemeWrapper from "@/components/ThemeWrapper";
import dynamic from 'next/dynamic';
import { Quote } from '@/types';
import { Poppins } from "next/font/google";
import ConditionalFooter from "@/components/ConditionalFooter";
import ClientPageTracker from "@/components/ClientPageTracker";

const QuoteBox = dynamic(() => import("@/components/quote-box"), { ssr: false });

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export default function AuthorQuotes({ params }: { params: { author: string } }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const authorName = capitalizeWords(decodeURIComponent(params.author.replace(/-/g, ' ')));

  useEffect(() => {
    async function fetchAuthorQuotes() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/quotes?author=${encodeURIComponent(authorName)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.quotes) {
          throw new Error('Invalid response format: missing quotes array');
        }

        // Format quotes to match the Quote interface
        const formattedQuotes: Quote[] = data.quotes.map((quote: any) => ({
          id: String(quote.id),
          text: quote.text || quote.quote_text,
          author: authorName,
          likes: quote.likes || 0,
          dislikes: quote.dislikes || 0,
          category: quote.category || ''
        }));

        setQuotes(formattedQuotes);
      } catch (err) {
        console.error('Error fetching author quotes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuthorQuotes();
  }, [authorName]);

  // Pagination calculations
  const totalPages = Math.ceil(quotes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuotes = quotes.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <ThemeWrapper>
        <ClientPageTracker />
        <main className="flex-1 min-h-screen">
          <div className="flex-grow">
            <div className="container mx-auto px-4 py-8">
              <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
                Famous Inspirational Quotes - {authorName}
              </h1>
              <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center">
                  <div className="loader"></div>
                  <div className="mt-4 text-gray-600 dark:text-gray-400">Loading quotes by {authorName}...</div>
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
        <ConditionalFooter />
      </ThemeWrapper>
    );
  }

  if (error) {
    return (
      <ThemeWrapper>
        <ClientPageTracker />
        <main className="flex-1 min-h-screen">
          <div className="flex-grow">
            <div className="container mx-auto px-4 py-8">
              <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
                Famous Inspirational Quotes - {authorName}
              </h1>
              <div className="max-w-2xl mx-auto text-center mb-8">
                <p className="mb-4 dark:text-gray-300">
                  Oops... something went wrong while loading quotes by {authorName}! Please try again or refresh the page.
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
        <ConditionalFooter />
      </ThemeWrapper>
    );
  }

  if (quotes.length === 0) {
    return (
      <ThemeWrapper>
        <ClientPageTracker />
        <main className="flex-1 min-h-screen">
          <div className="flex-grow">
            <div className="container mx-auto px-4 py-8">
              <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
                Famous Inspirational Quotes - {authorName}
              </h1>
              <div className="max-w-2xl mx-auto text-center mb-8">
                <p className="mb-4 dark:text-gray-300">
                  No quotes found for {authorName}. Please check the author name or try browsing other authors.
                </p>
              </div>
              <div className="text-center mt-12">
                <Link href="/inspirational-quotes-famous">
                  <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">
                    Back to Famous Quotes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <ConditionalFooter />
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <ClientPageTracker />
      <main className="flex-1 min-h-screen">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
              Famous Inspirational Quotes - {authorName}
            </h1>
            <div className="max-w-2xl mx-auto text-center mb-8">
              <p className="mb-4 dark:text-gray-300">
                Looking for the perfect quote to inspire your next big move or connect with like-minded thinkers? <Link href="/" className="text-blue-500 hover:underline dark:text-blue-400">Free Daily Motivation</Link> has you covered! Discover insights from {authorName}, a legendary figure known for their wisdom and impact. Whether you're looking to enhance your social media posts, presentations, or personal mindset, our platform makes it easy to find and share quotes that resonate with your goals. Let {authorName}'s words fuel your journey to success.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {paginatedQuotes.map((quote) => (
                <QuoteBox key={quote.id} quote={quote} _isAuthorPage={true} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {(() => {
                    let startPage, endPage;
                    
                    if (totalPages <= 3) {
                      // Show all pages if 3 or fewer
                      startPage = 1;
                      endPage = totalPages;
                    } else {
                      // Always show 3 pages with current in middle
                      startPage = Math.max(1, currentPage - 1);
                      endPage = Math.min(totalPages, startPage + 2);
                      
                      // Adjust if we're near the end
                      if (endPage - startPage < 2) {
                        startPage = Math.max(1, endPage - 2);
                      }
                    }
                    
                    const pages = [];
                    
                    // Add "1..." if there's a gap at the start
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          className="w-10 h-10 p-0 text-sm bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700"
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(
                          <span key="start-dots" className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                    }
                    
                    // Add the main page numbers (always 3 or fewer)
                    for (let page = startPage; page <= endPage; page++) {
                      pages.push(
                        <button
                          key={page}
                          className={`w-10 h-10 p-0 text-sm rounded-md ${
                            currentPage === page
                              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                              : "bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      );
                    }
                    
                    // Add "...last" if there's a gap at the end
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="end-dots" className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          className="w-10 h-10 p-0 text-sm bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>

                <button
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}

            {/* Results Info */}
            {quotes.length > 0 && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Showing {startIndex + 1}-{Math.min(endIndex, quotes.length)} of {quotes.length} quotes
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/inspirational-quotes-famous">
                <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">
                  Back to Famous Quotes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <ConditionalFooter />
    </ThemeWrapper>
  );
}


