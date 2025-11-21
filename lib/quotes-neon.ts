import { sql } from './neon-client';

export interface Quote {
  id: string;
  quote_text: string;
  author_id: string;
  category_id: string | null;
  created_at: string;
  author_name?: string;
  category_name?: string;
}

export async function getRandomQuote(category?: string): Promise<Quote | null> {
  try {
    let query;
    
    if (category && category !== 'all') {
      query = await sql`
        SELECT 
          q.id,
          q.quote_text,
          q.author_id,
          q.category_id,
          q.created_at,
          a.author_name,
          c.category_name
        FROM quotes q
        LEFT JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE c.category_name = ${category}
        ORDER BY RANDOM()
        LIMIT 1
      `;
    } else {
      query = await sql`
        SELECT 
          q.id,
          q.quote_text,
          q.author_id,
          q.category_id,
          q.created_at,
          a.author_name,
          c.category_name
        FROM quotes q
        LEFT JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        ORDER BY RANDOM()
        LIMIT 1
      `;
    }

    return query && query.length > 0 ? (query[0] as Quote) : null;
  } catch (error) {
    console.error('Error fetching random quote:', error);
    return null;
  }
}

export async function getQuotesByAuthor(authorName: string): Promise<Quote[]> {
  try {
    const quotes = await sql`
      SELECT 
        q.id,
        q.quote_text,
        q.author_id,
        q.category_id,
        q.created_at,
        a.author_name,
        c.category_name
      FROM quotes q
      LEFT JOIN authors a ON q.author_id = a.id
      LEFT JOIN categories c ON q.category_id = c.id
      WHERE a.author_name = ${authorName}
      ORDER BY q.created_at DESC
    `;
    return (quotes as Quote[]) || [];
  } catch (error) {
    console.error('Error fetching quotes by author:', error);
    return [];
  }
}

export async function getAllCategories() {
  try {
    const categories = await sql`
      SELECT * FROM categories
      ORDER BY category_name ASC
    `;
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getAllAuthors() {
  try {
    const authors = await sql`
      SELECT * FROM authors
      ORDER BY author_name ASC
    `;
    return authors || [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

export async function getFavoriteQuotes(userId: string): Promise<Quote[]> {
  try {
    const quotes = await sql`
      SELECT 
        q.id,
        q.quote_text,
        q.author_id,
        q.category_id,
        q.created_at,
        a.author_name,
        c.category_name
      FROM favorites f
      JOIN quotes q ON f.quote_id = q.id
      LEFT JOIN authors a ON q.author_id = a.id
      LEFT JOIN categories c ON q.category_id = c.id
      WHERE f.user_id = ${userId}
      ORDER BY f.created_at DESC
    `;
    return (quotes as Quote[]) || [];
  } catch (error) {
    console.error('Error fetching favorite quotes:', error);
    return [];
  }
}

export async function searchQuotes(searchTerm: string): Promise<Quote[]> {
  try {
    const searchPattern = `%${searchTerm}%`;
    const quotes = await sql`
      SELECT 
        q.id,
        q.quote_text,
        q.author_id,
        q.category_id,
        q.created_at,
        a.author_name,
        c.category_name
      FROM quotes q
      LEFT JOIN authors a ON q.author_id = a.id
      LEFT JOIN categories c ON q.category_id = c.id
      WHERE q.quote_text ILIKE ${searchPattern}
         OR a.author_name ILIKE ${searchPattern}
      ORDER BY q.created_at DESC
      LIMIT 50
    `;
    return (quotes as Quote[]) || [];
  } catch (error) {
    console.error('Error searching quotes:', error);
    return [];
  }
}

