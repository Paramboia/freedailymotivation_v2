import { Quote } from '@/types';

let quotes: Quote[] = [];

export async function loadQuotes() {
  const response = await fetch('/api/quotes');
  if (!response.ok) {
    throw new Error('Failed to load quotes');
  }
  quotes = await response.json();
}

export function getRandomQuote(category?: string): Quote | null {
  const filteredQuotes = category
    ? quotes.filter(quote => quote.category.toLowerCase() === category.toLowerCase())
    : quotes;

  if (filteredQuotes.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
}

export function getQuotesByAuthor(author: string): Quote[] {
  return quotes.filter(quote => quote.author.toLowerCase() === author.toLowerCase());
}

export function getAllAuthors(): string[] {
  return Array.from(new Set(quotes.map(quote => quote.author)));
}

export function getAllCategories(): string[] {
  const categories = new Set(quotes.map(quote => quote.category));
  return Array.from(categories);
}

export function likeQuote(id: string): Quote {
  const quote = quotes.find(q => q.id === id);
  if (quote) {
    quote.likes += 1;
  }
  return quote!;
}

export function getMostLikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

export function getMostDislikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.dislikes - a.dislikes).slice(0, limit);
}

export function toggleLikeQuote(id: string): Quote {
  const quote = quotes.find(q => q.id === id);
  if (quote) {
    quote.likes = quote.likes ? 0 : 1; // Toggle between 0 and 1
  }
  return quote!;
}

export function isQuoteLiked(id: string): boolean {
  const quote = quotes.find(q => q.id === id);
  return quote ? quote.likes > 0 : false;
}
