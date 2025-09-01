import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    // Parse query parameters for filtering
    const url = new URL(request.url);
    const sortBy = url.searchParams.get('sortBy') || 'newest'; // 'newest', 'oldest', 'most_liked', 'less_liked'
    const authorFilter = url.searchParams.get('author');
    const categoryFilter = url.searchParams.get('category');
    
    // Add debugging information
    console.log('Request URL:', request.url);
    console.log('Query params:', { sortBy, authorFilter, categoryFilter });
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Get the current user from Clerk
    const session = await auth();
    console.log('Full session object:', session);
    const clerkUserId = session.userId;
    
    console.log('Clerk User ID:', clerkUserId);
    
    if (!clerkUserId) {
      console.log('No user ID found in session - user not authenticated');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized',
          debug: {
            sessionExists: !!session,
            sessionKeys: session ? Object.keys(session) : [],
            userIdExists: !!session?.userId,
            url: request.url
          }
        }), 
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

    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // First get the Supabase user ID using the Clerk ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to fetch user', 
          details: userError.message,
          clerkUserId 
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

    if (!userData) {
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

    console.log('Found Supabase user:', userData);

    // Get favorites using the Supabase user ID with creation dates for sorting
    const favoritesQuery = supabase
      .from('favorites')
      .select('quote_id, created_at')
      .eq('user_id', userData.id);

    const { data: favorites, error: favoritesError } = await favoritesQuery;

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to fetch favorites', 
          details: favoritesError.message
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

    // If no favorites found, return empty array
    if (!favorites?.length) {
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

    console.log('Found favorites:', favorites);

    // Get quotes with author information
    const quoteIds = favorites.map(f => f.quote_id);
    console.log('Quote IDs:', quoteIds);

    // Build the quotes query with author and category filtering
    let quotesQuery = supabase
      .from('quotes')
      .select(`
        id,
        quote_text,
        authors!quotes_author_id_fkey (
          id,
          author_name
        ),
        categories!quotes_category_id_fkey (
          id,
          category_name
        )
      `)
      .in('id', quoteIds);

    // Apply author filter if specified
    if (authorFilter) {
      quotesQuery = quotesQuery.eq('authors.author_name', authorFilter);
    }

    // Apply category filter if specified
    if (categoryFilter) {
      quotesQuery = quotesQuery.eq('categories.category_name', categoryFilter);
    }

    const { data: quotes, error: quotesError } = await quotesQuery;

    if (quotesError) {
      console.error('Error fetching quotes:', quotesError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch quotes', details: quotesError.message }), 
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

    // Get like counts for each quote if we need to sort by likes
    let quotesWithLikes: Array<any> = quotes || [];
    if (sortBy === 'most_liked' || sortBy === 'less_liked') {
      const quoteIdsForLikes = quotesWithLikes.map(q => q.id);
      
      if (quoteIdsForLikes.length > 0) {
        const { data: likeCounts, error: likeError } = await supabase
          .from('favorites')
          .select('quote_id')
          .in('quote_id', quoteIdsForLikes);

        if (!likeError && likeCounts) {
          // Count likes for each quote
          const likeCountMap = likeCounts.reduce((acc: Record<string, number>, like: any) => {
            acc[like.quote_id] = (acc[like.quote_id] || 0) + 1;
            return acc;
          }, {});

          // Add like counts to quotes and sort
          quotesWithLikes = quotesWithLikes.map((quote: any) => ({
            ...quote,
            likeCount: likeCountMap[quote.id] || 0
          }));

          // Sort by like count
          quotesWithLikes.sort((a: any, b: any) => {
            if (sortBy === 'most_liked') {
              return b.likeCount - a.likeCount;
            } else {
              return a.likeCount - b.likeCount;
            }
          });
        }
      }
    }

    // Transform the data and add user's like timestamp for proper sorting
    const formattedQuotes = quotesWithLikes.map((quote: any) => {
      // Ensure we handle the authors array correctly
      const authors = Array.isArray(quote.authors) 
        ? quote.authors 
        : [quote.authors];

      // Ensure we handle the categories array correctly
      const categories = Array.isArray(quote.categories) 
        ? quote.categories 
        : [quote.categories];

      // Find when this user liked this quote
      const userFavorite = favorites?.find(f => f.quote_id === quote.id);
      const userLikedAt = userFavorite ? new Date(userFavorite.created_at) : new Date(0);

      return {
        id: String(quote.id),
        text: quote.quote_text,
        author: authors[0]?.author_name || 'Unknown Author',
        likes: quote.likeCount || 0,
        dislikes: 0,
        category: categories[0]?.category_name || '',
        userLikedAt: userLikedAt
      };
    });

    // Apply sorting based on sortBy parameter (after filtering)
    if (sortBy === 'newest') {
      // Sort by when the user liked each quote (newest first)
      formattedQuotes.sort((a, b) => b.userLikedAt.getTime() - a.userLikedAt.getTime());
    } else if (sortBy === 'oldest') {
      // Sort by when the user liked each quote (oldest first)
      formattedQuotes.sort((a, b) => a.userLikedAt.getTime() - b.userLikedAt.getTime());
    }
    // most_liked and less_liked are already sorted above

    // Remove the userLikedAt property from the final response
    const finalQuotes = formattedQuotes.map(({ userLikedAt, ...quote }) => quote);

    // Also return available filters for the frontend
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
