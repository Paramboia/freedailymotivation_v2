import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Inspirational Quotes - Free Daily Motivation",
  description: "Explore our collection of inspirational quotes from famous thinkers, leaders, and innovators. Find the perfect quote to motivate yourself or others.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Quotes() {
  return (
    <>
      {/* Rest of your component */}
    </>
  );
}
