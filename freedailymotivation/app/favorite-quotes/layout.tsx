import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Your Favorite Quotes - Free Daily Motivation',
  description: 'View your collection of favorite motivational quotes.',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
