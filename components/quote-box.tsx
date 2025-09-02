"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, Send, ThumbsUp } from "lucide-react";
import { Quote } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { toggleLike, getLikeStatus, getLikeCount } from '@/lib/supabase-client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import Link from 'next/link';
import { analytics } from "@/lib/analytics";

interface QuoteBoxProps {
  quote: Quote;
  onNewQuote?: () => void;
  _isAuthorPage?: boolean;
  selectedCategory?: string | null;
}

export default function QuoteBox({ quote, onNewQuote, _isAuthorPage = false, selectedCategory }: QuoteBoxProps) {
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
    
    // Track copy action
    analytics.trackQuoteAction('copy', currentQuote.id, currentQuote.author);
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

      // Track like action
      analytics.trackQuoteAction('like', currentQuote.id, currentQuote.author);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleNewQuote = () => {
    console.log('Generating new quote for category:', selectedCategory);
    
    // Track get new quote action
    analytics.trackQuoteAction('get_new_quote', currentQuote.id, currentQuote.author);
    
    if (onNewQuote) {
      onNewQuote();
    }
  };

  const handleShare = () => {
    const shareText = `"${currentQuote.text}" - ${currentQuote.author}\n\nVisit www.freedailymotivation.com for more inspirational quotes! ✨`;
    
    // Track share action
    analytics.trackQuoteAction('share', currentQuote.id, currentQuote.author);
    
    if (navigator.share) {
      navigator.share({
        text: shareText,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Quote copied to clipboard!'))
        .catch((error) => console.error('Error copying to clipboard:', error));
    }
  };

  const slugifyAuthor = (author: string) => {
    return author.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className={cn("w-full flex justify-center mb-8")}>
      <TooltipProvider>
        <Card className="w-full max-w-2xl p-8 rounded-3xl bg-white dark:bg-[#333] h-full min-h-[280px]">
          <div className="h-full flex flex-col">
            {/* Quote text - takes up available space */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-lg text-gray-900 dark:text-white">
                "{currentQuote.text}"
              </p>
            </div>
            
            {/* Author and buttons - always at bottom */}
            <div className="mt-6 space-y-4">
              <p className="text-right text-gray-600 dark:text-gray-400">
                - <Link href={`/inspirational-quotes-famous/${slugifyAuthor(currentQuote.author)}`} className="">
                    {currentQuote.author}
                  </Link>
              </p>
              
              <div className="flex justify-between items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      disabled={!supabaseUserId}
                      className={cn(
                        "flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-[#444]",
                        isLiked && "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 dark:hover:from-pink-600 dark:hover:via-purple-600 dark:hover:to-indigo-600"
                      )}
                    >
                      <ThumbsUp className={cn(
                        "h-5 w-5",
                        isLiked && "fill-current text-white"
                      )} />
                      <span>{likeCount > 0 ? `(${likeCount})` : '(0)'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{!supabaseUserId ? "Sign in to like quotes" : isLiked ? "Unlike this quote" : "Like this quote"}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex gap-2">
                  {!_isAuthorPage && onNewQuote && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleNewQuote}
                        >
                          <RefreshCw className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get new quote</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={copyQuote}>
                        <Copy className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleShare}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share quote</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </TooltipProvider>
    </div>
  );
}
