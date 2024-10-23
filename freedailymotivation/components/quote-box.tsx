"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, Share2, Twitter, Facebook, Linkedin, ThumbsUp, ThumbsDown } from "lucide-react";
import { Quote } from '@/types';
import { likeQuote, dislikeQuote } from '@/lib/quotes';

interface QuoteBoxProps {
  quote: Quote;
  onNewQuote: () => void;
}

export default function QuoteBox({ quote, onNewQuote }: QuoteBoxProps) {
  const [currentQuote, setCurrentQuote] = useState(quote);

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    // You might want to add a toast notification here
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`"${currentQuote.text}" - ${currentQuote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Daily Motivation');
    const summary = encodeURIComponent(`"${currentQuote.text}" - ${currentQuote.author}`);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, '_blank');
  };

  const handleLike = () => {
    const updatedQuote = likeQuote(currentQuote.id);
    setCurrentQuote(updatedQuote);
  };

  const handleDislike = () => {
    const updatedQuote = dislikeQuote(currentQuote.id);
    setCurrentQuote(updatedQuote);
  };

  return (
    <Card className="w-full max-w-2xl p-6 mb-8 bg-white dark:bg-gray-800 shadow-lg">
      <p className="text-xl mb-2 dark:text-white">"{currentQuote.text}"</p>
      <p className="text-right text-gray-600 dark:text-gray-400 mb-4">- {currentQuote.author}</p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleLike}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            {currentQuote.likes}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDislike}>
            <ThumbsDown className="h-4 w-4 mr-2" />
            {currentQuote.dislikes}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={onNewQuote}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={copyQuote}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={shareOnTwitter}>
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={shareOnFacebook}>
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={shareOnLinkedIn}>
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
