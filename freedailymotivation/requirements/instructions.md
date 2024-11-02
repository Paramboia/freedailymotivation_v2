#Project Overview
Use this guide to build FreeDailyMotivation.com a user-friendly website designed to provide daily doses of inspiration through a curated collection of motivational quotes. The platform aims to inspire and uplift users by offering a seamless experience to explore, share, and engage with quotes across various categories (busienss, science, sports, life), including those from famous entrepreneurs, athletes, and thought leaders.

You will be using Next.js, Shadcn UI, Tailwind CSS, Lucid icon, Supabase and Clerk for authentication.

# Core Functionalities:
1. Daily Quote Generation: Users can generate new motivational quotes with a single click, drawn from various categories.
2. Category-Based Quotes: Quotes are organized by themes (e.g., Sports, Life, Business) and famous people (e.g., entrepreneurs, athletes), allowing users to explore specific types of motivation.
3. Responsive Design: The website is optimized for both desktop and mobile viewing, ensuring a smooth experience across devices.
4. Dark Mode: A toggle feature that allows users to switch to a premium black/dark mode for a sleek and comfortable viewing experience.
5. Social Media Sharing: Users can share their favorite quotes directly via WhatsApp, Telegram, and Twitter, etc. through a dedicated sharing button.
6. Minimalist and Intuitive Navigation: Simple navigation with a clean design, including a small header, a fixed quote box, and a non-intrusive 'About Us' page link.
7. Gradient Backgrounds and Styling: Visual elements, such as gradient backgrounds and fixed-width quote boxes, enhance the modern aesthetic of the site.
8. Bookmark Encouragement Feature: A mechanic to encourage users to bookmark the website for daily visits.
9. Like and Dislike Feature: Users can like and dislike quotes, and the website will show the most liked and disliked quotes.
10. SEO Optimized Author Pages: Programmatically generated pages for famous authors using SEO techniques to improve discoverability on search engines.
11. Dynamic Author Pages: Automatically generated pages for individual authors, displaying their quotes, biography, and relevant links for easy exploration.
12. Custom URL Structures: Author pages are dynamically linked with URLs (e.g., “/inspirational-quotes-famous?author=bill-gates”) for consistency and easy SEO management.
13. Authentication: Users can sign up, log in, and log out using Clerk.

# Relevant Docs:
- Clerk: https://clerk.com/docs/components/overview
    Install @clerk/nextjs
    The package to use with Clerk and NextJS.

    bashCopynpm install @clerk/nextjs

    Set your environment variables
    Add these keys to your .env.local or create the file if it doesn't exist. Retrieve these keys anytime from the API keys page.

    .env.local
    CopyNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dXAtYmx1ZWJpcmQtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA
    CLERK_SECRET_KEY=••••••••••••••••••••••••••••••••••••••••••••••••••

    Update middleware.ts
    Update your middleware file or create one at the root of your project or src/ directory if you're using a src/ directory structure.
    The clerkMiddleware helper enables authentication and is where you'll configure your protected routes.

    middleware.ts
    typescriptCopyimport { clerkMiddleware } from "@clerk/nextjs/server";

    export default clerkMiddleware();

    export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
    };

    Add ClerkProvider to your app
    All Clerk hooks and components must be children of the ClerkProvider component.
    You can control which content signed in and signed out users can see with Clerk's prebuilt components.

    /src/app/layout.tsx
    typescriptCopyimport {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
    } from '@clerk/nextjs'
    import './globals.css'

    export default function RootLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    return (
        <ClerkProvider>
        <html lang="en">
            <body>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
            {children}
            </body>
        </html>
        </ClerkProvider>
    )
    }

    Create your first user
    Run your project. Then, visit your app's homepage at http://localhost:3000 and sign up to create your first user.

    bashCopynpm run dev

    Next steps

    Utilize your own pages for authentication
    The account portal is the fastest way to add authentication, but Clerk has pre-built, customizable components to use in your app too.
    Continue to the Next.js guide

- Supabase: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
    I have already created the supabase project and the database, with the following tables: 
     -- Create Users table
    CREATE TABLE Users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create Authors table
    CREATE TABLE Authors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        author_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create Categories table
    CREATE TABLE Categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        category_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create Quotes table (with foreign keys to Authors and Categories)
    CREATE TABLE Quotes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        quote_text TEXT NOT NULL,
        author_id UUID REFERENCES Authors(id) ON DELETE CASCADE,
        category_id UUID REFERENCES Categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE Favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES Quotes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, quote_id)  -- Ensures only one like per user per quote
    );

# Current File Structure:
FreeDailyMotivation/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── api/
│   │   └── quotes/
│   │       └── route.ts
│   ├── inspirational-quotes-famous/
│   │   ├── [author]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx
│   ├── globals.css
│   ├── headers.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── table.tsx
│   ├── AuthComponent.tsx
│   ├── AuthPopup.tsx
│   ├── BookmarkReminder.tsx
│   ├── CategoryButtons.tsx
│   ├── Header.tsx
│   ├── QuoteBox.tsx
│   ├── SavePagePopup.tsx
│   ├── SiteHeader.tsx
│   ├── ThemeToggle.tsx
│   └── ThemeWrapper.tsx
├── contexts/
│   └── theme-context.tsx
├── lib/
│   └── quotes.ts
├── pages/
│   └── _app.tsx
├── public/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-192x192.png
│   ├── favicon-512x512.png
│   ├── apple-touch-icon.png
│   ├── safari-pinned-tab.svg
│   ├── site.webmanifest
│   └── sitemap.xml
├── types/
│   └── index.ts
├── utils/
│   └── supabase/
│       └── server.ts
├── .env.local
├── middleware.ts
├── next.config.js
├── package.json
└── README.md

# Rules
- All new components should be added to the components folder and be named like example-component.tsx unless otherwise specified.
- All new pages should go in /app.

