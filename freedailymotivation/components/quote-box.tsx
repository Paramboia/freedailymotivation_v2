"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, Share2, ThumbsUp } from "lucide-react";
import { Quote } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { toggleLike, getLikeStatus, getLikeCount } from '@/lib/supabase-client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

interface QuoteBoxProps {
  quote: Quote;
  onNewQuote?: () => void;
}

export default function QuoteBox({ quote, onNewQuote }: QuoteBoxProps) {
  const [currentQuote, setCurrentQuote] = useState(quote);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(quote.likes);
  const { user: _user } = useUser();
  const { supabaseUserId } = useSupabaseUser();

  useEffect(() => {
    setCurrentQuote(quote);
    setLikeCount(quote.likes);
  }, [quote]);

  useEffect(() => {
    async function fetchData() {
      // Always fetch like count
      const count = await getLikeCount(quote.id);
      setLikeCount(count);

      // Only fetch like status if user is authenticated
      if (supabaseUserId && quote.id) {
        const likeStatus = await getLikeStatus(supabaseUserId, quote.id);
        setIsLiked(likeStatus);
      }
    }
    fetchData();
  }, [supabaseUserId, quote.id]);

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    // You might want to add a toast notification here
  };

  const handleLike = async () => {
    if (!supabaseUserId) {
      console.error('No user ID available');
      // You might want to show a login prompt here
      return;
    }
    try {
      const newLikeStatus = await toggleLike(supabaseUserId, currentQuote.id);
      setIsLiked(newLikeStatus);
      
      // Update the like count
      const newLikeCount = await getLikeCount(currentQuote.id);
      setLikeCount(newLikeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleNewQuote = () => {
    if (onNewQuote) {
      onNewQuote();
    }
  };

  const handleShareQuote = async () => {
    const quote = `"${currentQuote.text}" - ${currentQuote.author}`;
    const extraLine = "Visit www.freedailymotivation.com for more inspirational quotes!";
    const message = `${quote}\n\n${extraLine} ✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Free Daily Motivation',
          text: message,
          url: 'https://www.FreeDailyMotivation.com',
        });
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }

    function fallbackShare() {
      const encodedMessage = encodeURIComponent(message);
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <TooltipProvider>
      <Card className="p-6">
        <blockquote className="text-xl mb-4">"{currentQuote.text}"</blockquote>
        <p className="text-right text-gray-600 dark:text-gray-400 mb-4">- {currentQuote.author}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onNewQuote}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Quote
            </Button>
            <Button variant="outline" size="sm" onClick={copyQuote}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLike}
                disabled={!supabaseUserId}
              >
                <ThumbsUp className={cn("h-4 w-4 mr-2", isLiked ? "fill-current" : "")} />
                {likeCount} likes
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!supabaseUserId ? "Sign in to like quotes" : isLiked ? "Unlike this quote" : "Like this quote"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </TooltipProvider>
  );
}
