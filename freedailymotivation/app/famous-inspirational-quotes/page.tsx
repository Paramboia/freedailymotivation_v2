import { Button } from "@/components/ui/button";
import Link from "next/link";
import QuoteBox from "@/components/quote-box";

export default function FamousInspirationalQuotes() {
  const authors = [
    "Abraham Lincoln", "Albert Einstein", "Steve Jobs", "Oprah Winfrey",
    // Add more authors here
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-400 to-purple-400">
      <h1 className="text-4xl font-bold mb-8 text-white">Famous Inspirational Quotes</h1>
      <QuoteBox />
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Check out the top inspirational quotes from famous people!</h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
          {authors.map((author) => (
            <Link key={author} href={`/inspirational-quotes-famous?author=${author.toLowerCase().replace(' ', '-')}`}>
              <Button variant="secondary" size="sm">{author}</Button>
            </Link>
          ))}
        </div>
      </div>
      <Link href="/" className="mt-8">
        <Button variant="secondary">Back to Home Page</Button>
      </Link>
    </div>
  );
}
