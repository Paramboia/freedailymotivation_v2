// Check users in database
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function checkUsers() {
  console.log('👥 Checking users in Neon database...\n');

  const users = await sql`
    SELECT 
      id,
      clerk_user_id,
      email,
      created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 10
  `;

  console.log(`Total users found: ${users.length}\n`);
  
  console.log('Recent users (last 10):');
  console.log('═══════════════════════════════════════\n');
  
  users.forEach((user, idx) => {
    console.log(`${idx + 1}. User ID: ${user.id}`);
    console.log(`   Clerk ID: ${user.clerk_user_id || '❌ MISSING'}`);
    console.log(`   Email: ${user.email || '❌ MISSING'}`);
    console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
    console.log('');
  });

  // Check for users with missing data
  const usersNoEmail = await sql`
    SELECT COUNT(*) as count FROM users WHERE email IS NULL
  `;
  
  console.log('═══════════════════════════════════════');
  console.log(`Users without email: ${usersNoEmail[0].count}`);
  
  if (usersNoEmail[0].count > 0) {
    console.log('\n⚠️  NOTE: Some users don\'t have email.');
    console.log('This can happen if:');
    console.log('  1. User signed up with a provider that doesn\'t share email');
    console.log('  2. Clerk didn\'t provide email in the session data');
    console.log('  3. User revoked email permissions');
  }
}

checkUsers().catch(console.error);

