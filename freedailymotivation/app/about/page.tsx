import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeWrapper from "@/components/ThemeWrapper";

export default function AboutUs() {
  return (
    <ThemeWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">About Us</h1>
          <div className="max-w-2xl text-center">
            <p className="mb-4 dark:text-gray-300">
              Welcome to Free Daily Motivation! Our mission is to be the first to offer an easy and intuitive way to generate multiple inspirational quotes from a wide range of categories, including "business," "sport," "science," and "life."
            </p>
            <p className="mb-4 dark:text-gray-300">
              Whether you're looking to enhance your work presentation or boost your social media content, our website provides a rich resource for finding the perfect quote to inspire and engage your audience.
            </p>
            <p className="mb-8 dark:text-gray-300">
              At Free Daily Motivation, we are dedicated to delivering daily doses of motivation and positivity through carefully curated quotes. We are passionate about helping you stay focused and inspired each day with messages that resonate with you.
            </p>
          </div>
          <Link href="/">
            <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">Back to Home Page</Button>
          </Link>
        </main>
        <footer className="p-4 text-sm text-white text-center dark:text-gray-300">
          © 2024 Free Daily Motivation. All rights reserved.
        </footer>
      </div>
    </ThemeWrapper>
  );
}
