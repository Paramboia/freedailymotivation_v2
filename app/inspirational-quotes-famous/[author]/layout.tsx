import { Metadata } from 'next';

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export async function generateMetadata({ params }: { params: { author: string } }): Promise<Metadata> {
  const authorName = capitalizeWords(decodeURIComponent(params.author.replace(/-/g, ' ')));
  return {
    title: `Inspirational Quotes by ${authorName} | Free Daily Motivation`,
    description: `Explore inspiring quotes from ${authorName}. Find wisdom and motivation to fuel your success. Perfect for presentations, social media, and personal growth.`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
