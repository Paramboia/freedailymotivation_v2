import fs from 'fs';
import path from 'path';
import { Quote } from '@/types';

let quotes: Quote[] = [];

export async function loadQuotes() {
  if (quotes.length === 0) {
    const response = await fetch('/quotes.json');
    quotes = await response.json();
  }
  return quotes;
}

export function getRandomQuote(category?: string): Quote {
  const filteredQuotes = category
    ? quotes.filter(quote => quote.category.toLowerCase() === category.toLowerCase())
    : quotes;
  
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
  return Array.from(new Set(quotes.map(quote => quote.category)));
}

export function likeQuote(id: string): Quote {
  const quote = quotes.find(q => q.id === id);
  if (quote) {
    quote.likes += 1;
  }
  return quote!;
}

export function dislikeQuote(id: string): Quote {
  const quote = quotes.find(q => q.id === id);
  if (quote) {
    quote.dislikes += 1;
  }
  return quote!;
}

export function getMostLikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

export function getMostDislikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.dislikes - a.dislikes).slice(0, limit);
}
