"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, ThumbsUp } from "lucide-react";
import { Quote } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { toggleLike, getLikeStatus, getLikeCount } from '@/lib/supabase-client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

interface QuoteBoxProps {
  quote: Quote;
  onNewQuote?: () => void;
  isAuthorPage?: boolean;
}

export default function QuoteBox({ quote, onNewQuote, isAuthorPage = false }: QuoteBoxProps) {
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
      const count = await getLikeCount(quote.id);
      setLikeCount(count);

      if (supabaseUserId && quote.id) {
        const likeStatus = await getLikeStatus(supabaseUserId, quote.id);
        setIsLiked(likeStatus);
      }
    }
    fetchData();
  }, [supabaseUserId, quote.id]);

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
  };

  const handleLike = async () => {
    if (!supabaseUserId) {
      console.error('No user ID available');
      return;
    }
    try {
      const newLikeStatus = await toggleLike(supabaseUserId, currentQuote.id);
      setIsLiked(newLikeStatus);
      
      const newLikeCount = await getLikeCount(currentQuote.id);
      setLikeCount(newLikeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <TooltipProvider>
      <Card className={cn(
        "p-6 w-full",
        isAuthorPage ? "min-h-[200px] max-w-2xl mx-auto mb-4" : "min-h-[200px] max-w-2xl"
      )}>
        <div className="flex flex-col h-full justify-between">
          <div>
            <blockquote className="text-xl mb-4">"{currentQuote.text}"</blockquote>
            <p className="text-right text-gray-600 dark:text-gray-400 mb-4">- {currentQuote.author}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {!isAuthorPage && onNewQuote && (
                <Button variant="outline" size="sm" onClick={onNewQuote}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Quote
                </Button>
              )}
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
        </div>
      </Card>
    </TooltipProvider>
  );
}
