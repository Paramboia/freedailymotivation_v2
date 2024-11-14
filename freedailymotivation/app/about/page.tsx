import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeWrapper from "@/components/ThemeWrapper";
import Head from 'next/head';
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Free Daily Motivation</title>
        <meta name="description" content="Learn about Free Daily Motivation, your source for inspirational quotes and daily wisdom. Discover our mission to inspire and motivate people worldwide." />
      </Head>
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col items-center justify-center p-8">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>About Us</h1>
            <div className="max-w-2xl text-center">
              <p className="mb-4 dark:text-gray-300">
                Welcome to <Link href="/" className="text-blue-600 hover:underline"> Free Daily Motivation </Link>! Our mission is to be the first to offer an easy and intuitive way to generate multiple inspirational quotes from a wide range of categories, including "business," "sport," "science," and "life."
              </p>
              <p className="mb-4 dark:text-gray-300">
                Whether you're looking to enhance your work presentation or boost your social media content, our website provides a rich resource for finding the perfect quote to inspire and engage your audience.
              </p>
              <p className="mb-4 dark:text-gray-300">
                At Free Daily Motivation, we&apos;re committed to providing you with the best motivational content to help you achieve your goals and dreams.
              </p>
              <p className="mb-4 dark:text-gray-300">
                A site by <Link href="https://www.linkedin.com/in/miguel-macedo-parente/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> Miguel Macedo Parente</Link>.
              </p>
            </div>
            <Link href="/">
              <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">Back to Home Page</Button>
            </Link>
          </main>
          <Footer />
        </div>
      </ThemeWrapper>
    </>
  );
}
