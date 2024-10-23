"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, Share2 } from "lucide-react";

interface Quote {
  text: string;
  author: string;
  category: string;
}

export default function QuoteBox({ quote, onNewQuote }: { quote: Quote, onNewQuote: () => void }) {
  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    // You might want to add a toast notification here
  };

  const shareQuote = () => {
    // Implement sharing functionality (e.g., open a modal with share options)
  };

  return (
    <Card className="w-full max-w-2xl p-6 mb-8 bg-white shadow-lg">
      <p className="text-xl mb-2">"{quote.text}"</p>
      <p className="text-right text-gray-600 mb-4">- {quote.author}</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="icon" onClick={onNewQuote}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={copyQuote}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={shareQuote}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
