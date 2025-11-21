// Check if Jensen Huang appears in authors list
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function checkAuthors() {
  console.log('🔍 Checking authors list...\n');

  const authors = await sql`
    SELECT id, author_name
    FROM authors
    ORDER BY author_name ASC
  `;

  console.log(`Total authors: ${authors.length}\n`);

  // Find Jensen
  const jensen = authors.filter(a => a.author_name.toLowerCase().includes('jensen'));
  
  if (jensen.length > 0) {
    console.log('✅ Jensen Huang FOUND in authors list!');
    console.log('Details:', jensen[0]);
    console.log('URL slug:', jensen[0].author_name.toLowerCase().replace(/\s+/g, '-'));
  } else {
    console.log('❌ Jensen Huang NOT found in authors list');
  }

  // Show first and last few authors for verification
  console.log('\nFirst 5 authors:');
  authors.slice(0, 5).forEach(a => console.log(`  - ${a.author_name}`));
  
  console.log('\nLast 5 authors:');
  authors.slice(-5).forEach(a => console.log(`  - ${a.author_name}`));
}

checkAuthors();

