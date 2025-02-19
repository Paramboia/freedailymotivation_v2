import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    
    // Add proper response headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }

    // Get random quote
    const quoteResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/random-quote`);
    const quote = await quoteResponse.json();

    if (!quote.message) {
      throw new Error('Failed to fetch quote');
    }

    // Send notification
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: "9bee561c-d825-4050-b998-1b3245cad317",
        included_segments: ['Subscribed Users'],
        contents: { en: quote.message },
        headings: { en: quote.heading || 'Daily Motivation' },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0] || 'Failed to send notification');
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Daily quote notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send daily quote' },
      { status: 500 }
    );
  }
} 