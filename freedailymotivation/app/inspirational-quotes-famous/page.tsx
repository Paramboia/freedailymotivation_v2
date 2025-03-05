import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Metadata } from 'next';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer"; // Import the Footer component
import dynamic from 'next/dynamic';

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

const ClientPageTracker = dynamic(() => import('@/components/ClientPageTracker'), { ssr: false });

export const dynamic = 'force-dynamic';

// Helper function to convert author name to URL-friendly format
function nameToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export const metadata: Metadata = {
  title: 'Famous Inspirational Quotes | Free Daily Motivation',
  description: 'Discover inspirational quotes from famous figures like Albert Einstein, Steve Jobs, and more. Enhance your presentations, social media, and personal growth with our curated collection of motivational sayings.',
};

export default async function InspirationalQuotesFamous() {
  const supabase = createServerComponentClient({ cookies });

  const { data: authors, error } = await supabase
    .from('authors')
    .select('id, author_name')
    .order('author_name');

  if (error) {
    console.error('Error fetching authors:', error);
    return <div>Error loading authors. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientPageTracker />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>Famous Inspirational Quotes</h1>
        <p className="mb-4 dark:text-gray-300 text-center">
          Looking for the perfect quote to inspire your next big move or connect with like-minded thinkers? 
          <Link href="/" className="text-blue-600 hover:underline"> Free Daily Motivation </Link> 
          has you covered! With thousands of famous quotes at your fingertips, you'll discover insights from legends like 
          Albert Einstein, Steve Jobs, and Oprah Winfrey. Whether you're looking to enhance your social media posts, 
          presentations, or personal mindset, our platform makes it easy to find and share quotes that resonate with your goals. 
          Explore categories like business, sport, and life, and let Free Daily Motivation fuel your journey to success.
        </p>
        
        <h2 className="text-3xl font-semibold mb-6 text-[rgb(51,51,51)] dark:text-white text-center">Check out the top inspirational quotes from famous people!</h2>
        
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {authors?.map((author) => (
            <Link 
              key={author.id} 
              href={`/inspirational-quotes-famous/${nameToSlug(author.author_name)}`}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "h-10 px-4 py-2",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                "dark:bg-[#333] dark:text-white dark:hover:bg-[#444]"
              )}
            >
              {author.author_name}
            </Link>
          ))}
        </div>
      </div>
      <Footer /> {/* Use the Footer component */}
    </div>
  );
}
