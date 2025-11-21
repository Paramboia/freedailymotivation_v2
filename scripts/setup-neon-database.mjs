// Script to set up Neon database and import data
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('Usage: DATABASE_URL=your_connection_string node scripts/setup-neon-database.mjs');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Neon database...\n');

    // Drop existing tables if they exist (for clean migration)
    console.log('Dropping existing tables if they exist...');
    await sql`DROP TABLE IF EXISTS favorites CASCADE`;
    await sql`DROP TABLE IF EXISTS quotes CASCADE`;
    await sql`DROP TABLE IF EXISTS categories CASCADE`;
    await sql`DROP TABLE IF EXISTS authors CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    console.log('✓ Existing tables dropped\n');

    // Create Users table
    console.log('Creating users table...');
    await sql`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_user_id TEXT NOT NULL,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Users table created');

    // Create Authors table
    console.log('Creating authors table...');
    await sql`
      CREATE TABLE authors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Authors table created');

    // Create Categories table
    console.log('Creating categories table...');
    await sql`
      CREATE TABLE categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Categories table created');

    // Create Quotes table
    console.log('Creating quotes table...');
    await sql`
      CREATE TABLE quotes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quote_text TEXT NOT NULL,
        author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Quotes table created');

    // Create Favorites table
    console.log('Creating favorites table...');
    await sql`
      CREATE TABLE favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (user_id, quote_id)
      )
    `;
    console.log('✓ Favorites table created\n');

    // Import data
    console.log('📦 Importing data from backup...\n');

    // Import users
    console.log('Importing users...');
    const users = JSON.parse(readFileSync('./migration-backup/users.json', 'utf8'));
    for (const user of users) {
      await sql`
        INSERT INTO users (id, clerk_user_id, email, created_at)
        VALUES (${user.id}, ${user.clerk_user_id}, ${user.email}, ${user.created_at})
      `;
    }
    console.log(`✓ Imported ${users.length} users`);

    // Import authors
    console.log('Importing authors...');
    const authors = JSON.parse(readFileSync('./migration-backup/authors.json', 'utf8'));
    for (const author of authors) {
      await sql`
        INSERT INTO authors (id, author_name, created_at)
        VALUES (${author.id}, ${author.author_name}, ${author.created_at})
      `;
    }
    console.log(`✓ Imported ${authors.length} authors`);

    // Import categories
    console.log('Importing categories...');
    const categories = JSON.parse(readFileSync('./migration-backup/categories.json', 'utf8'));
    for (const category of categories) {
      await sql`
        INSERT INTO categories (id, category_name, created_at)
        VALUES (${category.id}, ${category.category_name}, ${category.created_at})
      `;
    }
    console.log(`✓ Imported ${categories.length} categories`);

    // Import quotes
    console.log('Importing quotes...');
    const quotes = JSON.parse(readFileSync('./migration-backup/quotes.json', 'utf8'));
    for (const quote of quotes) {
      await sql`
        INSERT INTO quotes (id, quote_text, author_id, category_id, created_at)
        VALUES (${quote.id}, ${quote.quote_text}, ${quote.author_id}, ${quote.category_id}, ${quote.created_at})
      `;
    }
    console.log(`✓ Imported ${quotes.length} quotes`);

    // Import favorites
    console.log('Importing favorites...');
    const favorites = JSON.parse(readFileSync('./migration-backup/favorites.json', 'utf8'));
    for (const favorite of favorites) {
      await sql`
        INSERT INTO favorites (id, user_id, quote_id, created_at)
        VALUES (${favorite.id}, ${favorite.user_id}, ${favorite.quote_id}, ${favorite.created_at})
      `;
    }
    console.log(`✓ Imported ${favorites.length} favorites`);

    console.log('\n✅ Database setup and data import completed successfully!');
    console.log('\nDatabase Summary:');
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Authors: ${authors.length}`);
    console.log(`  - Categories: ${categories.length}`);
    console.log(`  - Quotes: ${quotes.length}`);
    console.log(`  - Favorites: ${favorites.length}`);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();

