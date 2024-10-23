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
10. JSON Data Management: Quotes and author data are stored and fetched from JSON files, enabling efficient and scalable content updates.
11. SEO Optimized Author Pages: Programmatically generated pages for famous authors using SEO techniques to improve discoverability on search engines.
12. Dynamic Author Pages: Automatically generated pages for individual authors, displaying their quotes, biography, and relevant links for easy exploration.
13. Custom URL Structures: Author pages are dynamically linked with URLs (e.g., “/inspirational-quotes-famous?author=bill-gates”) for consistency and easy SEO management.

# Relevant Docs:


# Current File Structure:
FreeDailyMotivation
├── .next
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
├── hooks
├── lib
├── node_modules
├── requirements
│   └── instructions.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
- All new components should be added to the components folder and be named like example-component.tsx unless otherwise specified.
- All new pages should go in /app.

