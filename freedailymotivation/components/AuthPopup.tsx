"use client";

import { useState, useEffect } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AuthPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      const timer = setTimeout(() => setIsOpen(true), 5000); // Show popup after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isSignedIn]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in for full access</DialogTitle>
          <DialogDescription>
            Sign in to like quotes and access all features. You can continue as a visitor, but some features will be limited.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Continue as Visitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
