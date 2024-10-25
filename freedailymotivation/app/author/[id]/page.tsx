import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import QuoteBox from '@/components/quote-box';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AuthorPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: author, error: authorError } = await supabase
    .from('authors')
    .select('*')
    .eq('id', params.id)
    .single();

  const { data: quotes, error: quotesError } = await supabase
    .from('quotes')
    .select('*')
    .eq('author_id', params.id);

  if (authorError || quotesError) {
    console.error('Error fetching data:', authorError || quotesError);
    return <div>Error loading author data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/inspirational-quotes-famous" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Famous Quotes
      </Link>
      <h1 className="text-3xl font-bold mb-6">{author?.name}</h1>
      {author?.description && (
        <p className="text-gray-600 mb-8">{author.description}</p>
      )}
      <h2 className="text-2xl font-semibold mb-4">Quotes</h2>
      <div className="space-y-6">
        {quotes?.map((quote) => (
          <QuoteBox key={quote.id} quote={quote} />
        ))}
      </div>
    </div>
  );
}
