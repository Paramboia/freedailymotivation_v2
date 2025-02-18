import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message, heading } = await request.json();
    
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: "9bee561c-d825-4050-b998-1b3245cad317",
        included_segments: ['Subscribed Users'],
        contents: { en: message },
        headings: { en: heading || 'Daily Motivation' },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0] || 'Failed to send notification');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
} 