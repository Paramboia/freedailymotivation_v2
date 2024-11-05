"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, ThumbsUp } from "lucide-react";
import { Quote } from '@/types';
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { toggleLike, getLikeStatus, getLikeCount } from '@/lib/supabase-client';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

interface QuoteBoxProps {
  quote: Quote;
  onNewQuote?: () => void;
  _isAuthorPage?: boolean;
  selectedCategory?: string | null;
}

export default function QuoteBox({ quote, onNewQuote, _isAuthorPage = false, _selectedCategory = null }: QuoteBoxProps) {
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
  }, [quote.id, supabaseUserId]);

  const handleLike = async () => {
    if (supabaseUserId && quote.id) {
      const newLikeStatus = await toggleLike(supabaseUserId, quote.id);
      setIsLiked(newLikeStatus);
      setLikeCount(likeCount + (newLikeStatus ? 1 : -1));
    }
  };

  const handleNewQuote = () => {
    onNewQuote?.();
  };

  return (
    <Card className="flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[32px] md:text-[42px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center whitespace-nowrap">
          {currentQuote.text}
        </h1>
        <p className="text-sm text-gray-500 text-center">
          {currentQuote.author}
        </p>
      </div>
      <div className="flex flex-row items-center justify-center mt-8">
        <Button onClick={handleLike} className={cn(
          "mr-4",
          isLiked ? "bg-green-500 text-white" : "bg-gray-500 text-white"
        )}>
          <ThumbsUp className="mr-2 h-4 w-4" />
          {likeCount}
        </Button>
        <Button onClick={handleNewQuote} className="bg-blue-500 text-white">
          <RefreshCw className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>
    </Card>
  );
}
