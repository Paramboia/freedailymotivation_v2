import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Headers for all responses
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('🔔 OneSignal Webhook received:', {
      timestamp: new Date().toISOString(),
      url: request.url,
      data: data
    });

    // Handle different types of webhook events
    const event = data.event || 'unknown';
    
    switch (event) {
      case 'notification.displayed':
        console.log('📱 Notification displayed:', {
          notificationId: data.id,
          appId: data.app_id,
          userId: data.user_id,
          timestamp: data.timestamp
        });
        break;
        
      case 'notification.clicked':
        console.log('👆 Notification clicked:', {
          notificationId: data.id,
          appId: data.app_id,
          userId: data.user_id,
          url: data.url,
          timestamp: data.timestamp
        });
        break;
        
      case 'notification.dismissed':
        console.log('❌ Notification dismissed:', {
          notificationId: data.id,
          appId: data.app_id,
          userId: data.user_id,
          timestamp: data.timestamp
        });
        break;
        
      default:
        console.log('🔍 Unknown webhook event:', {
          event: event,
          data: data
        });
        break;
    }

    // You could add database logging here
    // await logNotificationEvent(data);

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      event: event
    }, { headers });

  } catch (error) {
    console.error('❌ OneSignal webhook error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers });
}

// Optional: Function to log events to database
/*
async function logNotificationEvent(data: any) {
  // Example: Save to Supabase
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase
    .from('notification_events')
    .insert({
      event_type: data.event,
      notification_id: data.id,
      user_id: data.user_id,
      app_id: data.app_id,
      timestamp: data.timestamp,
      data: data
    });
}
*/ 