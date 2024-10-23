"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Copy, Share2 } from "lucide-react";

export default function QuoteBox() {
  const [quote, setQuote] = useState("Becoming is better than being - Anonymous");

  const generateNewQuote = () => {
    // TODO: Implement quote generation logic
    setQuote("New quote goes here");
  };

  return (
    <Card className="w-full max-w-2xl p-6 mb-8 bg-white shadow-lg">
      <p className="text-xl mb-4">{quote}</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="icon" onClick={generateNewQuote}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
