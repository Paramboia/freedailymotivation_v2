import Image from "next/image";
import { Button } from "@/components/ui/button";
import QuoteBox from "@/components/quote-box";
import CategoryButtons from "@/components/category-buttons";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-400 to-pink-400">
      <h1 className="text-4xl font-bold mb-8 text-white">Free Daily Motivation</h1>
      <QuoteBox />
      <CategoryButtons />
      <footer className="mt-8 text-sm text-white">
        © 2024 Free Daily Motivation. All rights reserved.
      </footer>
    </div>
  );
}
