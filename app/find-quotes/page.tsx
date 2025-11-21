"use client";

import React from 'react';
import { useState, useEffect } from 'react';
// Removed old quotes import - now using API routes
import { Quote } from '@/types';
import dynamic from 'next/dynamic';
import CategoryButtons from "@/components/category-buttons";
import SavePagePopup from "@/components/SavePagePopup";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Poppins } from "next/font/google";
import ConditionalFooter from "@/components/ConditionalFooter"; // Import the ConditionalFooter component

const QuoteBox = dynamic(() => import("@/components/quote-box"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center -mt-16"> {/* Adjust the margin-top here */}
          <div className="loader"></div>
          <div>Finding the best motivational quotes for you...</div>
        </div>

        {/* Add the loader styles */}
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
  )
});

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FindQuotes() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function initializeQuotes() {
      try {
        // Set categories directly (no API needed for static list)
        const categoryNames = ['business', 'life', 'science', 'sport'];
        setCategories(categoryNames);

        // Fetch initial random quote from API
        const quoteResponse = await fetch('/api/random-quote');
        const quoteData = await quoteResponse.json();
        setQuote({
          id: quoteData.id, // Use real ID from database
          text: quoteData.message,
          author: quoteData.heading.replace('- ', ''),
          likes: 0,
          dislikes: 0,
          category: quoteData.category || ''
        });
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    }
    initializeQuotes();
  }, []);

  const handleNewQuote = async () => {
    try {
      // Build URL with category filter if selected
      const categoryParam = selectedCategory && selectedCategory !== 'all' 
        ? `?category=${selectedCategory}` 
        : '';
      const quoteResponse = await fetch(`/api/random-quote${categoryParam}`);
      const quoteData = await quoteResponse.json();
      setQuote({
        id: quoteData.id, // Use real ID from database
        text: quoteData.message,
        author: quoteData.heading.replace('- ', ''),
        likes: 0,
        dislikes: 0,
        category: quoteData.category || selectedCategory || ''
      });
    } catch (error) {
      console.error('Error fetching new quote:', error);
    }
  };

  const handleCategorySelect = async (category: string | undefined) => {
    setSelectedCategory(category);
    
    // Fetch new quote with selected category
    try {
      const categoryParam = category && category !== 'all' 
        ? `?category=${category}` 
        : '';
      const quoteResponse = await fetch(`/api/random-quote${categoryParam}`);
      const quoteData = await quoteResponse.json();
      setQuote({
        id: quoteData.id, // Use real ID from database
        text: quoteData.message,
        author: quoteData.heading.replace('- ', ''),
        likes: 0,
        dislikes: 0,
        category: quoteData.category || category || ''
      });
    } catch (error) {
      console.error('Error fetching quote with category:', error);
    }
  };

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto px-4 py-12 md:py-8 flex-grow">
          <div className="mb-16 md:mb-12">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>
              Find Inspirational Quotes
            </h1>
          </div>
          {quote && (
            <QuoteBox 
              quote={quote}
              onNewQuote={handleNewQuote}
              selectedCategory={selectedCategory}
              _isSingleQuote={true}
            />
          )}
          {!quote && (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
              <div>Loading quote...</div>
            </div>
          )}
          {categories.length > 0 && (
            <div className="mt-8">
              <CategoryButtons 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          )}
        </main>
        <ConditionalFooter /> {/* Use the ConditionalFooter component */}
      </div>
      {showPopup && <SavePagePopup onClose={() => setShowPopup(false)} />}
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
    </ThemeWrapper>
  );
}
