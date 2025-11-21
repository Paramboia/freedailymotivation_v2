// Script to test if new quote is accessible
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function testNewQuote() {
  console.log('🔍 Testing new Jensen Huang quote...\n');

  try {
    // Check if author exists
    console.log('1. Checking for Jensen Huang author:');
    const author = await sql`
      SELECT * FROM authors
      WHERE author_name ILIKE '%jensen%huang%'
    `;
    console.log('Author found:', author.length > 0 ? '✅' : '❌');
    if (author.length > 0) {
      console.log('Author details:', JSON.stringify(author[0], null, 2));
    }
    console.log('');

    // Check for quotes by this author
    console.log('2. Checking for quotes by Jensen Huang:');
    const quotes = await sql`
      SELECT 
        q.id,
        q.quote_text,
        q.author_id,
        q.category_id,
        a.author_name,
        c.category_name
      FROM quotes q
      LEFT JOIN authors a ON q.author_id = a.id
      LEFT JOIN categories c ON q.category_id = c.id
      WHERE a.author_name ILIKE '%jensen%huang%'
    `;
    console.log('Quotes found:', quotes.length);
    if (quotes.length > 0) {
      quotes.forEach((q, idx) => {
        console.log(`\nQuote ${idx + 1}:`);
        console.log(`  Text: "${q.quote_text.substring(0, 50)}..."`);
        console.log(`  Author ID: ${q.author_id}`);
        console.log(`  Category: ${q.category_name || 'None'}`);
        console.log(`  Has proper author link: ${q.author_id ? '✅' : '❌'}`);
        console.log(`  Has proper category link: ${q.category_id ? '✅' : '⚠️  (optional)'}`);
      });
    }
    console.log('');

    // Test random quote query (what the API uses)
    console.log('3. Testing random quote query (as used by API):');
    const randomQuotes = await sql`
      SELECT 
        q.id,
        q.quote_text,
        a.author_name,
        c.category_name
      FROM quotes q
      INNER JOIN authors a ON q.author_id = a.id
      LEFT JOIN categories c ON q.category_id = c.id
      WHERE a.author_name ILIKE '%jensen%huang%'
      LIMIT 1
    `;
    console.log('Found in random query:', randomQuotes.length > 0 ? '✅' : '❌');
    if (randomQuotes.length > 0) {
      console.log('Quote accessible via API query: ✅');
      console.log('Quote:', JSON.stringify(randomQuotes[0], null, 2));
    } else {
      console.log('⚠️  Quote NOT accessible via API query');
      console.log('This usually means:');
      console.log('  - author_id is NULL or incorrect');
      console.log('  - There\'s a foreign key mismatch');
    }
    console.log('');

    // Check total quote count
    console.log('4. Total database stats:');
    const totalAuthors = await sql`SELECT COUNT(*) as count FROM authors`;
    const totalQuotes = await sql`SELECT COUNT(*) as count FROM quotes`;
    console.log(`  Total authors: ${totalAuthors[0].count}`);
    console.log(`  Total quotes: ${totalQuotes[0].count}`);
    console.log('');

    console.log('═══════════════════════════════════════');
    if (randomQuotes.length > 0) {
      console.log('✅ New quote is properly configured!');
      console.log('If it\'s not showing on the website, try:');
      console.log('  1. Clear browser cache (Ctrl+Shift+R)');
      console.log('  2. Wait a few seconds for deployment');
      console.log('  3. Check /api/random-quote endpoint directly');
    } else {
      console.log('❌ Issue found with the new quote');
      console.log('Action needed: Check the author_id in the quotes table');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testNewQuote();

