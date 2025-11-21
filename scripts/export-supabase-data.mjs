// Script to export Supabase data
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_KEY environment variables are required');
  console.log('Usage: SUPABASE_URL=url SUPABASE_KEY=key node scripts/export-supabase-data.mjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
  try {
    console.log('Starting Supabase data export...\n');

    // Create export directory
    await mkdir('./migration-backup', { recursive: true });

    // Export Users
    console.log('Exporting users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (usersError) {
      console.error('Error exporting users:', usersError);
    } else {
      writeFileSync('./migration-backup/users.json', JSON.stringify(users, null, 2));
      console.log(`✓ Exported ${users.length} users`);
    }

    // Export Authors
    console.log('Exporting authors...');
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (authorsError) {
      console.error('Error exporting authors:', authorsError);
    } else {
      writeFileSync('./migration-backup/authors.json', JSON.stringify(authors, null, 2));
      console.log(`✓ Exported ${authors.length} authors`);
    }

    // Export Categories
    console.log('Exporting categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (categoriesError) {
      console.error('Error exporting categories:', categoriesError);
    } else {
      writeFileSync('./migration-backup/categories.json', JSON.stringify(categories, null, 2));
      console.log(`✓ Exported ${categories.length} categories`);
    }

    // Export Quotes
    console.log('Exporting quotes...');
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (quotesError) {
      console.error('Error exporting quotes:', quotesError);
    } else {
      writeFileSync('./migration-backup/quotes.json', JSON.stringify(quotes, null, 2));
      console.log(`✓ Exported ${quotes.length} quotes`);
    }

    // Export Favorites
    console.log('Exporting favorites...');
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (favoritesError) {
      console.error('Error exporting favorites:', favoritesError);
    } else {
      writeFileSync('./migration-backup/favorites.json', JSON.stringify(favorites, null, 2));
      console.log(`✓ Exported ${favorites.length} favorites`);
    }

    console.log('\n✅ Export completed! Data saved to ./migration-backup/');
  } catch (error) {
    console.error('Unexpected error during export:', error);
    process.exit(1);
  }
}

exportData();

