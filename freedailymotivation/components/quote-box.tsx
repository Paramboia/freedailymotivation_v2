"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, Share, ThumbsUp } from "lucide-react";
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
    <Card className="w-full max-w-2xl p-8 rounded-3xl bg-white dark:bg-gray-800">
      <div className="space-y-6">
        <div>
          <p className="text-2xl font-medium text-gray-900 dark:text-gray-100">
            "{currentQuote.text}"
          </p>
          <p className="text-right mt-4 text-gray-600 dark:text-gray-400">
            - {currentQuote.author}
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={!supabaseUserId}
            className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ThumbsUp className={cn("h-5 w-5", isLiked ? "fill-current text-blue-500" : "")} />
            <span>{likeCount > 0 ? `(${likeCount})` : '(0)'}</span>
          </Button>

          <div className="flex gap-2">
            {!isAuthorPage && (
              <Button variant="ghost" size="sm" onClick={onNewQuote}>
                <RefreshCw className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={copyQuote}>
              <Copy className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
