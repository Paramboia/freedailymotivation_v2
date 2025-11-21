import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    // Parse query parameters for filtering
    const url = new URL(request.url);
    const sortBy = url.searchParams.get('sortBy') || 'newest';
    const authorFilter = url.searchParams.get('author');
    const categoryFilter = url.searchParams.get('category');
    
    console.log('Query params:', { sortBy, authorFilter, categoryFilter });
    
    // Get the current user from Clerk
    const session = await auth();
    const clerkUserId = session.userId;
    
    console.log('Clerk User ID:', clerkUserId);
    
    if (!clerkUserId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(databaseUrl);

    // First get the user ID using the Clerk ID
    const userData = await sql`
      SELECT id FROM users
      WHERE clerk_user_id = ${clerkUserId}
      LIMIT 1
    `;

    if (!userData || userData.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    const userId = userData[0].id;
    console.log('Found user:', userId);

    // Build query with filters
    let quotesQuery;
    
    if (authorFilter && categoryFilter) {
      quotesQuery = await sql`
        SELECT 
          q.id,
          q.quote_text,
          a.author_name,
          c.category_name,
          f.created_at as liked_at,
          (SELECT COUNT(*) FROM favorites WHERE quote_id = q.id) as like_count
        FROM favorites f
        JOIN quotes q ON f.quote_id = q.id
        JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE f.user_id = ${userId}
          AND a.author_name = ${authorFilter}
          AND c.category_name = ${categoryFilter}
      `;
    } else if (authorFilter) {
      quotesQuery = await sql`
        SELECT 
          q.id,
          q.quote_text,
          a.author_name,
          c.category_name,
          f.created_at as liked_at,
          (SELECT COUNT(*) FROM favorites WHERE quote_id = q.id) as like_count
        FROM favorites f
        JOIN quotes q ON f.quote_id = q.id
        JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE f.user_id = ${userId}
          AND a.author_name = ${authorFilter}
      `;
    } else if (categoryFilter) {
      quotesQuery = await sql`
        SELECT 
          q.id,
          q.quote_text,
          a.author_name,
          c.category_name,
          f.created_at as liked_at,
          (SELECT COUNT(*) FROM favorites WHERE quote_id = q.id) as like_count
        FROM favorites f
        JOIN quotes q ON f.quote_id = q.id
        JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE f.user_id = ${userId}
          AND c.category_name = ${categoryFilter}
      `;
    } else {
      quotesQuery = await sql`
        SELECT 
          q.id,
          q.quote_text,
          a.author_name,
          c.category_name,
          f.created_at as liked_at,
          (SELECT COUNT(*) FROM favorites WHERE quote_id = q.id) as like_count
        FROM favorites f
        JOIN quotes q ON f.quote_id = q.id
        JOIN authors a ON q.author_id = a.id
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE f.user_id = ${userId}
      `;
    }

    // If no favorites found, return empty array
    if (!quotesQuery || quotesQuery.length === 0) {
      return new NextResponse(
        JSON.stringify({ quotes: [] }), 
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Transform and sort the data
    const formattedQuotes = quotesQuery.map((quote: any) => ({
      id: String(quote.id),
      text: quote.quote_text,
      author: quote.author_name || 'Unknown Author',
      likes: parseInt(quote.like_count) || 0,
      dislikes: 0,
      category: quote.category_name || '',
      userLikedAt: new Date(quote.liked_at)
    }));

    // Apply sorting
    if (sortBy === 'newest') {
      formattedQuotes.sort((a, b) => b.userLikedAt.getTime() - a.userLikedAt.getTime());
    } else if (sortBy === 'oldest') {
      formattedQuotes.sort((a, b) => a.userLikedAt.getTime() - b.userLikedAt.getTime());
    } else if (sortBy === 'most_liked') {
      formattedQuotes.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'less_liked') {
      formattedQuotes.sort((a, b) => a.likes - b.likes);
    }

    // Remove the userLikedAt property from the final response
    const finalQuotes = formattedQuotes.map(({ userLikedAt, ...quote }) => quote);

    // Get available filters
    const availableAuthors = Array.from(new Set(finalQuotes.map(q => q.author))).sort();
    const availableCategories = Array.from(new Set(finalQuotes.map(q => q.category).filter(c => c))).sort();

    return new NextResponse(
      JSON.stringify({ 
        quotes: finalQuotes,
        availableAuthors,
        availableCategories
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}
