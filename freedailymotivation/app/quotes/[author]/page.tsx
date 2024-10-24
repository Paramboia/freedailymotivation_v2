import Head from 'next/head';

export default function AuthorQuotes({ params }) {
  const { author } = params;
  const formattedAuthor = author.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <>
      <Head>
        <title>{`${formattedAuthor} Quotes - Free Daily Motivation`}</title>
        <meta name="description" content={`Discover inspiring quotes by ${formattedAuthor}. Find wisdom and motivation from one of the world's most influential thinkers and leaders.`} />
      </Head>
      {/* Rest of your component */}
    </>
  );
}
