import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ThemeWrapper from "@/components/ThemeWrapper";

export const revalidate = 3600; // Revalidate every hour

async function getAuthors() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('authors')  // Changed 'Authors' to 'authors'
    .select('name')
    .order('name');

  if (error) {
    console.error('Error fetching authors:', error);
    return [];
  }

  console.log('Fetched authors:', data); // Add this line for debugging
  return data?.map(author => author.name) || [];
}

export default async function InspirationalQuotesFamous() {
  const authors = await getAuthors();

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Famous Inspirational Quotes</h1>
          <div className="max-w-2xl text-center mb-8">
            <p className="mb-4 dark:text-gray-300">
              Looking for the perfect quote to inspire your next big move or connect with like-minded thinkers? <Link href="/" className="text-blue-500 hover:underline dark:text-blue-400">Free Daily Motivation</Link> has you covered! With thousands of famous quotes at your fingertips, you'll discover insights from legends like Albert Einstein, Steve Jobs, and Oprah Winfrey. Whether you're looking to enhance your social media posts, presentations, or personal mindset, our platform makes it easy to find and share quotes that resonate with your goals. Explore categories like business, sport, and life, and let Free Daily Motivation fuel your journey to success.
            </p>
          </div>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Check out the top inspirational quotes from famous people!</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mb-8">
            {authors.length > 0 ? (
              authors.map((author) => (
                <Link key={author} href={`/inspirational-quotes-famous/${encodeURIComponent(author.toLowerCase().replace(' ', '-'))}`}>
                  <Button variant="secondary" size="sm" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">
                    {author}
                  </Button>
                </Link>
              ))
            ) : (
              <p className="text-center dark:text-gray-300">No authors found. Please check the database connection.</p>
            )}
          </div>
        </main>
        <footer className="p-4 text-sm text-white text-center dark:text-gray-300">
          © 2024 Free Daily Motivation. All rights reserved.
        </footer>
      </div>
    </ThemeWrapper>
  );
}
