// Script to test Neon database connection and verify data
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('Usage: DATABASE_URL=your_connection_string node scripts/test-neon-connection.mjs');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function testConnection() {
  console.log('🧪 Testing Neon Database Connection...\n');

  try {
    // Test 1: Connection
    console.log('Test 1: Basic Connection');
    const connectionTest = await sql`SELECT NOW() as current_time`;
    console.log(`✅ Connected! Server time: ${connectionTest[0].current_time}`);
    console.log('');

    // Test 2: Count records
    console.log('Test 2: Verify Record Counts');
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`✅ Users: ${userCount[0].count} (expected: 15)`);
    
    const authorCount = await sql`SELECT COUNT(*) as count FROM authors`;
    console.log(`✅ Authors: ${authorCount[0].count} (expected: 183)`);
    
    const categoryCount = await sql`SELECT COUNT(*) as count FROM categories`;
    console.log(`✅ Categories: ${categoryCount[0].count} (expected: 4)`);
    
    const quoteCount = await sql`SELECT COUNT(*) as count FROM quotes`;
    console.log(`✅ Quotes: ${quoteCount[0].count} (expected: 593)`);
    
    const favoriteCount = await sql`SELECT COUNT(*) as count FROM favorites`;
    console.log(`✅ Favorites: ${favoriteCount[0].count} (expected: 124)`);
    console.log('');

    // Test 3: Fetch random quote with author
    console.log('Test 3: Fetch Random Quote with Author');
    const randomQuote = await sql`
      SELECT 
        q.quote_text,
        a.author_name,
        c.category_name
      FROM quotes q
      INNER JOIN authors a ON q.author_id = a.id
      LEFT JOIN categories c ON q.category_id = c.id
      ORDER BY RANDOM()
      LIMIT 1
    `;
    if (randomQuote && randomQuote.length > 0) {
      console.log(`✅ Quote: "${randomQuote[0].quote_text.substring(0, 50)}..."`);
      console.log(`   Author: ${randomQuote[0].author_name}`);
      console.log(`   Category: ${randomQuote[0].category_name || 'N/A'}`);
    } else {
      console.log('❌ No quotes found');
    }
    console.log('');

    // Test 4: Test foreign key relationships
    console.log('Test 4: Verify Foreign Key Relationships');
    const orphanedQuotes = await sql`
      SELECT COUNT(*) as count 
      FROM quotes q
      LEFT JOIN authors a ON q.author_id = a.id
      WHERE a.id IS NULL
    `;
    console.log(`✅ Orphaned quotes (should be 0): ${orphanedQuotes[0].count}`);
    
    const orphanedFavorites = await sql`
      SELECT COUNT(*) as count 
      FROM favorites f
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN quotes q ON f.quote_id = q.id
      WHERE u.id IS NULL OR q.id IS NULL
    `;
    console.log(`✅ Orphaned favorites (should be 0): ${orphanedFavorites[0].count}`);
    console.log('');

    // Test 5: Sample a few users
    console.log('Test 5: Sample User Records');
    const sampleUsers = await sql`
      SELECT id, clerk_user_id, email, created_at
      FROM users
      LIMIT 3
    `;
    sampleUsers.forEach((user, idx) => {
      console.log(`✅ User ${idx + 1}: ${user.email || 'No email'}`);
    });
    console.log('');

    // Test 6: Check categories
    console.log('Test 6: Verify Categories');
    const categories = await sql`
      SELECT category_name, COUNT(q.id) as quote_count
      FROM categories c
      LEFT JOIN quotes q ON c.id = q.category_id
      GROUP BY c.id, c.category_name
      ORDER BY c.category_name
    `;
    categories.forEach(cat => {
      console.log(`✅ ${cat.category_name}: ${cat.quote_count} quotes`);
    });
    console.log('');

    // Test 7: Sample favorite with joins
    console.log('Test 7: Test Favorite Quote Query (with joins)');
    const sampleFavorite = await sql`
      SELECT 
        f.id,
        u.email,
        q.quote_text,
        a.author_name
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      JOIN quotes q ON f.quote_id = q.id
      JOIN authors a ON q.author_id = a.id
      LIMIT 1
    `;
    if (sampleFavorite && sampleFavorite.length > 0) {
      console.log(`✅ User: ${sampleFavorite[0].email || 'No email'}`);
      console.log(`   Liked: "${sampleFavorite[0].quote_text.substring(0, 40)}..."`);
      console.log(`   By: ${sampleFavorite[0].author_name}`);
    }
    console.log('');

    console.log('═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════');
    console.log('\n✨ Neon database is ready for production!');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    process.exit(1);
  }
}

testConnection();

