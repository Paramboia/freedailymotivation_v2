"use client";

import React, { useState } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Quote } from "@/types";
import Footer from "@/components/Footer";
import SavePagePopup from "@/components/SavePagePopup"; // Import SavePagePopup
import { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
});

async function getUserId(clerkUserId: string) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }

  return data?.id;
}

async function getFavoriteQuotes(userId: string) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      quote_id,
      quotes!inner (
        id,
        quote_text,
        authors!inner (
          author_name
        )
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorite quotes:", error);
    return [];
  }

  return data.map((item) => {
    const quote = Array.isArray(item.quotes) ? item.quotes[0] : item.quotes;
    const author = quote?.authors ? quote.authors[0] : { author_name: "Unknown Author" };

    return {
      id: quote?.id || item.quote_id,
      text: quote?.quote_text || "Unknown Quote",
      author: author?.author_name || "Unknown Author",
      likes: 0,
      category: "",
      dislikes: 0,
    };
  });
}

export default async function FavoriteQuotes() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [clickCount, setClickCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 3) {
        setShowPopup(true);
      }
      return newCount;
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setClickCount(0); // Reset click count when popup is closed
  };

  if (!user?.id) {
    return (
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col" onClick={handleClick}>
          <main className="flex-grow flex flex-col items-center justify-center p-8">
            <h1
              className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}
            >
              My Favorite Quotes
            </h1>
            <div className="max-w-2xl text-center">
              <p className="mb-4 dark:text-gray-300">
                Welcome to your personal collection of favorite quotes from{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  Free Daily Motivation
                </Link>
                ! Here, you’ll find inspiring words from renowned figures that
                resonate with you the most.
              </p>
              <p className="mb-4 dark:text-gray-300">
                Remember to log in and like your favorite{" "}
                <Link href="/find-quotes" className="text-blue-600 hover:underline">
                  quotes
                </Link>{" "}
                to build a unique selection of motivational insights you can
                revisit anytime.
              </p>
            </div>
          </main>
          <Footer />
          {showPopup && <SavePagePopup onClose={handleClosePopup} />}
        </div>
      </ThemeWrapper>
    );
  }

  const userId = await getUserId(user.id);
  if (!userId) {
    return <div>Error: User not found.</div>;
  }

  const quotes = await getFavoriteQuotes(userId);

  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col" onClick={handleClick}>
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1
            className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}
          >
            My Favorite Quotes
          </h1>
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {quotes.length > 0 ? (
              quotes.map((quote: Quote) => (
                <div key={quote.id} className="mb-4">
                  <p className="text-lg dark:text-gray-300">
                    "{quote.text}" - {quote.author}
                  </p>
                </div>
              ))
            ) : (
              <p className="dark:text-gray-300">You have no favorite quotes yet.</p>
            )}
          </div>
          <Link href="/" className="mt-8">
            <Button
              variant="secondary"
              className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]"
            >
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
        {showPopup && <SavePagePopup onClose={handleClosePopup} />}
      </div>
    </ThemeWrapper>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Favorite Quotes | Free Daily Motivation",
    description: "View your favorite quotes that inspire and motivate you.",
  };
}
