#!/usr/bin/env node

/**
 * Test script for Daily Notification System
 * This script tests all components of the daily quote notification system
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    }
    console.log('📄 Loaded environment variables from .env.local');
  } else {
    console.log('⚠️ No .env.local file found - using system environment variables only');
  }
}

// Load environment variables first
loadEnvFile();

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://freedailymotivation.com';
const CRON_SECRET = process.env.CRON_SECRET;

console.log('🚀 Testing Daily Notification System');
console.log('=====================================');

// Helper function to make HTTP requests with redirect handling
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Following redirect to: ${res.headers.location}`);
        return makeRequest(res.headers.location, options).then(resolve).catch(reject);
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test 1: Check environment variables
function testEnvironmentVariables() {
  console.log('\n1️⃣ Testing Environment Variables');
  console.log('----------------------------------');
  
  const requiredVars = {
    'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL || 'Using fallback',
    'NEXT_PUBLIC_ONESIGNAL_APP_ID': process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    'ONESIGNAL_REST_API_KEY': process.env.ONESIGNAL_REST_API_KEY ? '✓ Set (hidden)' : '❌ Missing',
    'CRON_SECRET': process.env.CRON_SECRET ? '✓ Set (hidden)' : '❌ Missing'
  };

  let allSet = true;
  for (const [key, value] of Object.entries(requiredVars)) {
    const status = value && value !== '❌ Missing' ? '✅' : '❌';
    console.log(`${status} ${key}: ${value || '❌ Missing'}`);
    if (!value || value === '❌ Missing') allSet = false;
  }

  return allSet;
}

// Test 2: Test random quote API
async function testRandomQuoteAPI() {
  console.log('\n2️⃣ Testing Random Quote API');
  console.log('-----------------------------');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/random-quote`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Daily-Notification-Test/1.0'
      }
    });

    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Random Quote API is working');
      console.log(`📝 Quote: "${response.data.message}"`);
      console.log(`👤 Author: ${response.data.heading}`);
      return { success: true, quote: response.data };
    } else {
      console.log('❌ Random Quote API failed');
      console.log('Response:', response.data);
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error testing Random Quote API:', error.message);
    return { success: false };
  }
}

// Test 3: Test daily quote cron endpoint (if CRON_SECRET is available)
async function testDailyQuoteCron() {
  console.log('\n3️⃣ Testing Daily Quote Cron Endpoint');
  console.log('-------------------------------------');

  if (!CRON_SECRET) {
    console.log('⚠️ CRON_SECRET not available - skipping cron test');
    console.log('💡 This test requires the CRON_SECRET environment variable');
    return { success: false, reason: 'No CRON_SECRET' };
  }

  try {
    console.log('🔄 Testing cron endpoint (this will send a real notification!)...');
    const response = await makeRequest(`${BASE_URL}/api/cron/daily-quote`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRON_SECRET}`,
        'User-Agent': 'Daily-Notification-Test/1.0'
      }
    });

    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Daily Quote Cron is working');
      console.log('📤 Notification sent successfully');
      if (response.data.quote) {
        console.log(`📝 Quote: "${response.data.quote.text}"`);
        console.log(`👤 Author: ${response.data.quote.heading}`);
      }
      if (response.data.data?.notification?.id) {
        console.log(`🔢 Notification ID: ${response.data.data.notification.id}`);
      }
      return { success: true };
    } else {
      console.log('❌ Daily Quote Cron failed');
      console.log('Response:', response.data);
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error testing Daily Quote Cron:', error.message);
    return { success: false };
  }
}

// Test 4: Validate OneSignal configuration
function testOneSignalConfig() {
  console.log('\n4️⃣ Testing OneSignal Configuration');
  console.log('-----------------------------------');

  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!appId) {
    console.log('❌ NEXT_PUBLIC_ONESIGNAL_APP_ID is missing');
    return false;
  }

  if (!restApiKey) {
    console.log('❌ ONESIGNAL_REST_API_KEY is missing');
    return false;
  }

  // Validate app ID format (should be a UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(appId)) {
    console.log('❌ NEXT_PUBLIC_ONESIGNAL_APP_ID format is invalid');
    return false;
  }

  // Validate REST API key format (should start with os_v2_app_)
  if (!restApiKey.startsWith('os_v2_app_')) {
    console.log('❌ ONESIGNAL_REST_API_KEY format is invalid');
    return false;
  }

  console.log('✅ OneSignal App ID format is valid');
  console.log('✅ OneSignal REST API Key format is valid');
  console.log(`📱 App ID: ${appId}`);
  console.log(`🔑 API Key: ${restApiKey.substring(0, 15)}...`);
  
  return true;
}

// Test 5: Test a simple OneSignal API call
async function testOneSignalAPI() {
  console.log('\n5️⃣ Testing OneSignal API Connection');
  console.log('------------------------------------');

  const restApiKey = process.env.ONESIGNAL_REST_API_KEY;
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

  if (!restApiKey || !appId) {
    console.log('⚠️ OneSignal credentials missing - skipping API test');
    return { success: false, reason: 'Missing credentials' };
  }

  try {
    // Test with OneSignal's app info endpoint
    const response = await makeRequest(`https://onesignal.com/api/v1/apps/${appId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${restApiKey}`
      }
    });

    if (response.status === 200) {
      console.log('✅ OneSignal API connection successful');
      console.log(`📱 App Name: ${response.data.name || 'N/A'}`);
      console.log(`👥 Total Users: ${response.data.players || 'N/A'}`);
      return { success: true };
    } else {
      console.log('❌ OneSignal API connection failed');
      console.log(`Status: ${response.status}`);
      console.log('Response:', response.data);
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error testing OneSignal API:', error.message);
    return { success: false };
  }
}

// Test 6: Test OneSignal webhook endpoint
async function testOneSignalWebhook() {
  console.log('\n6️⃣ Testing OneSignal Webhook Endpoint');
  console.log('--------------------------------------');

  try {
    // Test webhook with a sample payload
    const sampleWebhookData = {
      event: 'notification.clicked',
      id: 'test-notification-id',
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      user_id: 'test-user-id',
      timestamp: Date.now(),
      url: 'https://www.freedailymotivation.com'
    };

    const response = await makeRequest(`${BASE_URL}/api/webhooks/onesignal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Daily-Notification-Test/1.0'
      },
      body: JSON.stringify(sampleWebhookData)
    });

    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ OneSignal webhook endpoint is working');
      console.log(`📨 Event processed: ${response.data.event}`);
      console.log(`✅ Response: ${response.data.message}`);
      return { success: true };
    } else {
      console.log('❌ OneSignal webhook endpoint failed');
      console.log('Response:', response.data);
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error testing OneSignal webhook:', error.message);
    return { success: false };
  }
}

// Main test function
async function runTests() {
  console.log(`🌐 Testing against: ${BASE_URL}`);
  
  const envTest = testEnvironmentVariables();
  const configTest = testOneSignalConfig();
  const quoteTest = await testRandomQuoteAPI();
  const oneSignalTest = await testOneSignalAPI();
  const webhookTest = await testOneSignalWebhook();
  const cronTest = await testDailyQuoteCron();

  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`Environment Variables: ${envTest ? '✅ Pass' : '❌ Fail'}`);
  console.log(`OneSignal Configuration: ${configTest ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Random Quote API: ${quoteTest.success ? '✅ Pass' : '❌ Fail'}`);
  console.log(`OneSignal API: ${oneSignalTest.success ? '✅ Pass' : oneSignalTest.reason ? `⚠️ Skipped (${oneSignalTest.reason})` : '❌ Fail'}`);
  console.log(`OneSignal Webhook: ${webhookTest.success ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Daily Quote Cron: ${cronTest.success ? '✅ Pass' : cronTest.reason ? `⚠️ Skipped (${cronTest.reason})` : '❌ Fail'}`);

  const allPassed = envTest && configTest && quoteTest.success && 
                   (oneSignalTest.success || oneSignalTest.reason) && 
                   webhookTest.success &&
                   (cronTest.success || cronTest.reason);
  
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`);
  
  if (!allPassed) {
    console.log('\n💡 Next Steps:');
    if (!envTest) console.log('   - Add missing environment variables');
    if (!configTest) console.log('   - Check OneSignal configuration');
    if (!quoteTest.success) console.log('   - Debug random quote API endpoint');
    if (!oneSignalTest.success && !oneSignalTest.reason) console.log('   - Debug OneSignal API connection');
    if (!webhookTest.success) console.log('   - Debug OneSignal webhook endpoint');
    if (!cronTest.success && !cronTest.reason) console.log('   - Debug daily quote cron endpoint');
  } else {
    console.log('\n🎉 Your daily notification system is ready to go!');
    console.log('   - All APIs are working correctly');
    console.log('   - OneSignal is properly configured');
    console.log('   - Webhook tracking is set up');
    console.log('   - Cron job should run daily at 8:00 AM');
  }
}

// Run the tests
runTests().catch(console.error); 