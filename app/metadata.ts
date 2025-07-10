import type { Metadata } from "next";

// Metadata for the home page
export const metadata: Metadata = {
  title: "Free Daily Motivation - Inspirational Quotes",
  description: "Find the best inspirational quotes from famous and influential people across various fields, including business, sports, science, and life, to motivate and inspire you daily.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
