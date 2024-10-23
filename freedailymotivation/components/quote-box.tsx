"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, Share2, ThumbsUp } from "lucide-react";
import { Quote } from '@/types';
import { toggleLikeQuote, isQuoteLiked } from '@/lib/quotes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface QuoteBoxProps {
  quote: Quote;
  onNewQuote: () => void;
}

export default function QuoteBox({ quote, onNewQuote }: QuoteBoxProps) {
  const [currentQuote, setCurrentQuote] = useState(quote);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setCurrentQuote(quote);
    setIsLiked(isQuoteLiked(quote.id));
  }, [quote]);

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    // You might want to add a toast notification here
  };

  const shareQuote = async () => {
    const shareText = `"${currentQuote.text}" - ${currentQuote.author}\n\nVisit www.FreeDailyMotivation.com for more inspirational quotes ⭐`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Free Daily Motivation',
          text: shareText,
          url: 'https://www.FreeDailyMotivation.com',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  const handleLike = () => {
    const updatedQuote = toggleLikeQuote(currentQuote.id);
    setCurrentQuote(updatedQuote);
    setIsLiked(!isLiked);
  };

  const handleNewQuote = () => {
    onNewQuote();
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl p-6 mb-8 bg-white dark:bg-gray-800 shadow-lg">
        <p className="text-xl mb-2 dark:text-white">"{currentQuote.text}"</p>
        <p className="text-right text-gray-600 dark:text-gray-400 mb-4">- {currentQuote.author}</p>
        <div className="flex justify-between items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLike}
                className={cn(
                  "transition-colors",
                  isLiked ? "bg-primary text-primary-foreground" : ""
                )}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like ({currentQuote.likes})
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? "Unlike this quote" : "Like this quote"}</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleNewQuote}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get a new quote</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={copyQuote}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy quote to clipboard</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={shareQuote}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this quote</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
