# Migration from Supabase to Neon

This document describes the migration from Supabase to Neon database.

## Migration Date
November 21, 2024

## What Changed

### Database Provider
- **From:** Supabase (PostgreSQL)
- **To:** Neon (Serverless PostgreSQL)

### Database Package
- **Removed:**
  - `@supabase/supabase-js`
  - `@supabase/auth-helpers-nextjs`
  - `@supabase/ssr`
  
- **Added:**
  - `@neondatabase/serverless`

### Environment Variables
- **Removed:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  
- **Added:**
  - `DATABASE_URL` - Neon connection string

### Files Updated

#### New Files Created:
- `lib/neon-client.ts` - Neon database client with user and likes functions
- `lib/quotes-neon.ts` - Quote-related database functions using Neon
- `MIGRATION_TO_NEON.md` - This file

#### API Routes Updated:
- `app/api/random-quote/route.ts` - Now uses Neon
- `app/api/quotes/route.ts` - Now uses Neon
- `app/api/likes/route.ts` - Now uses Neon
- `app/api/favorite-quotes/route.ts` - Now uses Neon
- `app/api/authors/route.ts` - Now uses Neon

#### Old Files (To be removed after testing):
- `lib/supabase-client.ts`
- `lib/supabase.ts`
- `lib/quotes.ts`
- `utils/supabase/client.ts`
- `utils/supabase/server.ts`
- `supabase-client.ts`
- `components/SupabaseUserProvider.tsx`
- `hooks/useSupabaseUser.ts`

## Data Migrated

Successfully migrated all data:
- ✅ 15 users
- ✅ 183 authors  
- ✅ 4 categories
- ✅ 593 quotes
- ✅ 124 favorites

## Database Schema

The schema remains identical to the original Supabase schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Authors table
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quotes table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_text TEXT NOT NULL,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, quote_id)
);
```

## Setup Instructions

### 1. Set Environment Variable

Add to your `.env.local`:

```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

(Get your actual connection string from Neon dashboard)

### 2. For Vercel Deployment

Add the `DATABASE_URL` environment variable in your Vercel project settings:
1. Go to project settings → Environment Variables
2. Add `DATABASE_URL` with your Neon connection string
3. Redeploy

### 3. Testing

After deployment, test these endpoints:
- `/api/random-quote` - Should return a random quote
- `/api/quotes` - Should return all quotes
- `/api/authors` - Should return all authors
- `/api/favorite-quotes` - Should return user's favorites (requires auth)

## Benefits of Neon

1. **Cost-effective:** Better pricing than Supabase for our use case
2. **Serverless:** Scales automatically
3. **Fast:** Built for edge computing
4. **PostgreSQL:** Same database engine, no schema changes needed
5. **Branching:** Database branches for development (future use)

## Rollback Plan

If needed, the original Supabase data is backed up in `migration-backup/` directory:
- `users.json`
- `authors.json`
- `categories.json`
- `quotes.json`
- `favorites.json`

To rollback:
1. Re-enable Supabase project
2. Restore environment variables
3. Revert to commit before migration
4. Import data back to Supabase if needed

## Next Steps

After confirming everything works in production:
1. ✅ Remove old Supabase client files
2. ✅ Remove Supabase packages from `package.json`
3. ✅ Update documentation
4. ✅ Pause/delete Supabase project to avoid charges
5. ✅ Delete migration backup files (optional, keep for 30 days recommended)

## Notes

- Authentication still uses Clerk (unchanged)
- All UUIDs and relationships preserved
- Created dates preserved
- No data loss during migration

