'use client';

import React from 'react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { Loader2 } from 'lucide-react'; // Import the loader icon

export function SupabaseUserProvider({ children }: { children: React.ReactNode }) {
  const { isSupabaseConnected, supabaseUserId: _supabaseUserId } = useSupabaseUser();

  // You can add loading or error states here if needed
  if (!isSupabaseConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="loader" />
          <div>Finding the best motivational quotes for you...</div>
        </div>
        <style jsx>{`
          .loader {
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            background: linear-gradient(to right, #ff007f, #3498db);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
