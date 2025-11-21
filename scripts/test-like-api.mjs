// Test the like API endpoints
console.log('🧪 Testing Like API Endpoints\n');

const testQuoteId = '2926f98a-9c4a-4f16-9e83-a4642448687c'; // Jensen Huang quote

console.log('1. Testing /api/like-count');
try {
  const response = await fetch(`http://localhost:3000/api/like-count?quoteId=${testQuoteId}`);
  const data = await response.json();
  console.log('   Status:', response.status);
  console.log('   Response:', data);
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

console.log('\n2. Testing /api/like-status (without auth)');
try {
  const response = await fetch(`http://localhost:3000/api/like-status?quoteId=${testQuoteId}`);
  const data = await response.json();
  console.log('   Status:', response.status);
  console.log('   Response:', data);
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

console.log('\nℹ️  Note: /api/toggle-like requires authentication, test from browser console instead');

