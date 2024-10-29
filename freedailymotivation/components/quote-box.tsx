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
    <div className={cn("w-full flex justify-center mb-8")}>
      <TooltipProvider>
        <Card className="w-full max-w-2xl p-8 rounded-3xl bg-white dark:bg-[#333]">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                "{currentQuote.text}"
              </p>
              <p className="text-right mt-4 text-gray-600 dark:text-gray-400">
                - {currentQuote.author}
              </p>
            </div>
            
            <div className="flex justify-between items-center pt-4">
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
                {!isAuthorPage && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={onNewQuote}>
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
                    <Button variant="ghost" size="sm">
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
        </Card>
      </TooltipProvider>
    </div>
  );
}
