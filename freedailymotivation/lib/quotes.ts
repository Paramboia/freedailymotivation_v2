import { Quote } from '@/types';

let quotes: Quote[] = [];

export async function loadQuotes() {
  if (quotes.length === 0) {
    const response = await fetch('/quotes.json');
    const data = await response.json();
    let id = 1;
    for (const category in data) {
      data[category].forEach((text: string) => {
        const [quoteText, author] = text.split(' - ');
        quotes.push({
          id: id.toString(),
          text: quoteText.trim(),
          author: author.trim(),
          category,
          likes: 0,
          dislikes: 0
        });
        id++;
      });
    }
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

export function getMostLikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

export function getMostDislikedQuotes(limit: number = 10): Quote[] {
  return [...quotes].sort((a, b) => b.dislikes - a.dislikes).slice(0, limit);
}

export function toggleLikeQuote(id: string): Quote {
  const quote = quotes.find(q => q.id === id);
  if (quote) {
    const likedQuotes = JSON.parse(localStorage.getItem('likedQuotes') || '[]');
    const index = likedQuotes.indexOf(id);
    if (index > -1) {
      // User has already liked this quote, so unlike it
      likedQuotes.splice(index, 1);
      quote.likes -= 1;
    } else {
      // User hasn't liked this quote yet, so like it
      likedQuotes.push(id);
      quote.likes += 1;
    }
    localStorage.setItem('likedQuotes', JSON.stringify(likedQuotes));
  }
  return quote!;
}

export function isQuoteLiked(id: string): boolean {
  const likedQuotes = JSON.parse(localStorage.getItem('likedQuotes') || '[]');
  return likedQuotes.includes(id);
}
