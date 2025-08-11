'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'quote' | 'author';
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    let structuredData: any = {};

    switch (type) {
      case 'organization':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Free Daily Motivation",
          "url": "https://freedailymotivation.com",
          "logo": "https://freedailymotivation.com/logo.webp",
          "description": "Get your daily dose of motivation with inspirational quotes from famous figures across business, sports, science, and life.",
          "foundingDate": "2024",
          "sameAs": [
            "https://twitter.com/freedailymotiv",
            "https://facebook.com/freedailymotivation"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "hello@freedailymotivation.com"
          }
        };
        break;

      case 'website':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Free Daily Motivation",
          "url": "https://freedailymotivation.com",
          "description": "Get your daily dose of motivation with inspirational quotes from famous figures across business, sports, science, and life.",
          "publisher": {
            "@type": "Organization",
            "name": "Free Daily Motivation",
            "logo": "https://freedailymotivation.com/logo.webp"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://freedailymotivation.com/find-quotes?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        break;

      case 'quote':
        if (data) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "Quotation",
            "text": data.text,
            "author": {
              "@type": "Person",
              "name": data.author
            },
            "about": data.category || "motivation",
            "publisher": {
              "@type": "Organization",
              "name": "Free Daily Motivation",
              "url": "https://freedailymotivation.com"
            },
            "datePublished": new Date().toISOString(),
            "inLanguage": "en"
          };
        }
        break;

      case 'author':
        if (data) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": data.name,
            "description": `Inspirational quotes and wisdom from ${data.name}`,
            "url": `https://freedailymotivation.com/inspirational-quotes-famous/${data.slug}`,
            "sameAs": data.sameAs || [],
            "knowsAbout": [
              "motivation",
              "inspiration", 
              "personal development",
              "success",
              "wisdom"
            ]
          };
        }
        break;
    }

    // Create script element and add to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = `structured-data-${type}`;

    // Remove existing script if it exists
    const existingScript = document.getElementById(`structured-data-${type}`);
    if (existingScript) {
      existingScript.remove();
    }

    // Add new script
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(`structured-data-${type}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null; // This component doesn't render anything
}
