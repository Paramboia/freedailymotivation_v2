// Test Larry Ellison in database
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const result = await sql`
  SELECT author_name 
  FROM authors 
  WHERE author_name ILIKE '%larry%'
`;

console.log('Larry Ellison found:', result.length > 0 ? '✅ YES' : '❌ NO');
if (result.length > 0) {
  console.log('Name in DB:', result[0].author_name);
}

