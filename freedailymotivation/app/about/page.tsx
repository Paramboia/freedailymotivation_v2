import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-400 to-purple-400 text-white">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      <div className="max-w-2xl text-center">
        <p className="mb-4">
          Welcome to Free Daily Motivation! Our mission is to be the first to offer an easy and intuitive way to generate multiple inspirational quotes from a wide range of categories, including "business," "sport," "science," and "life."
        </p>
        <p className="mb-4">
          Whether you're looking to enhance your work presentation or boost your social media content, our website provides a rich resource for finding the perfect quote to inspire and engage your audience.
        </p>
        <p className="mb-8">
          At Free Daily Motivation, we are dedicated to delivering daily doses of motivation and positivity through carefully curated quotes. We are passionate about helping you stay focused and inspired each day with messages that resonate with you.
        </p>
      </div>
      <Link href="/">
        <Button variant="secondary">Back to Home Page</Button>
      </Link>
    </div>
  );
}
