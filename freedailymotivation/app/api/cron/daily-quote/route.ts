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

    // Check if required env vars are present
    const restApiKey = process.env.ONESIGNAL_REST_API_KEY;
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (!restApiKey || !appId) {
      throw new Error('Missing required OneSignal configuration');
    }

    console.log('OneSignal configuration:', {
      appId,
      authHeader: `Key ${restApiKey.substring(0, 10)}...` // Only log part of the key for security
    });

    // Send notification
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ['Total Subscribed Users'],
        contents: { 
          en: quote.message 
        },
        headings: { 
          en: quote.heading || 'Your Daily Dose of Motivation' 
        },
        send_after: tomorrow.toISOString(),
        delayed_option: "timezone",
        delivery_time_of_day: "08:00",
        ttl: 86400, // Expire after 24 hours if not delivered
        isAnyWeb: true,
        target_channel: "push",
        channel_for_external_user_ids: "push"
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OneSignal API error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        requestBody: {
          app_id: appId,
          scheduledFor: tomorrow.toISOString(),
          messageLength: quote.message.length
        }
      });
      throw new Error(data.errors?.[0] || 'Failed to send notification');
    }

    console.log('Successfully scheduled notification:', {
      notificationId: data.id,
      recipients: data.recipients,
      scheduledFor: tomorrow.toISOString(),
      quoteText: quote.message,
      heading: quote.heading
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