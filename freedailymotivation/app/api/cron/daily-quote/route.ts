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

    // Get random quote from API
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://freedailymotivation.com';
    const quoteResponse = await fetch(`${appUrl}/api/random-quote`);
    
    if (!quoteResponse.ok) {
      throw new Error(`Failed to fetch quote: ${quoteResponse.statusText}`);
    }

    const quote = await quoteResponse.json();

    if (!quote.message) {
      throw new Error('Invalid quote format received');
    }

    // Check if required env vars are present
    const restApiKey = process.env.ONESIGNAL_REST_API_KEY;
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (!restApiKey || !appId) {
      throw new Error('Missing required OneSignal configuration');
    }

    console.log('OneSignal configuration:', {
      appId,
      restApiKeyPrefix: restApiKey.substring(0, 10) + '...',
      quoteLength: quote.message.length
    });

    // Send notification immediately (cron runs at 8:00 AM)
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ['Total Subscriptions'], // Use the correct segment name from OneSignal dashboard
        contents: { 
          en: `"${quote.message}" ${quote.heading}` 
        },
        headings: { 
          en: 'FreeDailyMotivation ✨' 
        },
        ttl: 86400, // Expire after 24 hours if not delivered
        isAnyWeb: true,
        target_channel: "push",
        channel_for_external_user_ids: "push",
        web_push_topic: "daily_motivation",
        priority: 10 // High priority to ensure delivery
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
          messageLength: quote.message.length
        }
      });
      throw new Error(data.errors?.[0] || 'Failed to send notification');
    }

    console.log('Successfully sent notification:', {
      notificationId: data.id,
      recipients: data.recipients,
      quoteText: quote.message,
      heading: quote.heading
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        notification: data,
        quote: {
          text: quote.message,
          heading: quote.heading
        }
      }
    }, { headers });
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