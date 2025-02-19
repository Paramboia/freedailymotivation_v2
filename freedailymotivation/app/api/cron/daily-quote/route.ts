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
      console.error('Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }

    // Get random quote
    const quoteResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/random-quote`);
    
    if (!quoteResponse.ok) {
      throw new Error(`Failed to fetch quote: ${quoteResponse.statusText}`);
    }

    const quote = await quoteResponse.json();

    if (!quote.message) {
      throw new Error('Invalid quote format received');
    }

    // Get tomorrow at 8 AM in the user's timezone (Europe/Madrid)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    // Send notification
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.ONESIGNAL_REST_API_KEY,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users'],
        contents: { 
          en: quote.message 
        },
        headings: { 
          en: quote.heading || 'Your Daily Dose of Motivation' 
        },
        send_after: tomorrow.toISOString(),
        delayed_option: "timezone",
        delivery_time_of_day: "8:00AM",
        ttl: 86400, // Expire after 24 hours if not delivered
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OneSignal API error:', data);
      throw new Error(data.errors?.[0] || 'Failed to send notification');
    }

    console.log('Successfully scheduled notification:', {
      quoteText: quote.message,
      heading: quote.heading,
      scheduledFor: tomorrow.toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        notification: data,
        scheduledFor: tomorrow.toISOString(),
        quote: {
          text: quote.message,
          heading: quote.heading
        }
      }
    });
  } catch (error) {
    console.error('Daily quote notification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send daily quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}