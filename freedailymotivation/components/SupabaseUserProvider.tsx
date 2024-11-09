'use client';

import React from 'react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

export function SupabaseUserProvider({ children }: { children: React.ReactNode }) {
  const { isSupabaseConnected, supabaseUserId: _supabaseUserId } = useSupabaseUser();

  // You can add loading or error states here if needed
  if (!isSupabaseConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="loader"></div>
          <div>Finding the best motivational quotes for you...</div>
        </div>

        {/* Add the loader styles */}
        <style jsx>{`
          .loader {
            border: 8px solid transparent;
            border-top: 8px solid;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            border-image: linear-gradient(to right, #ff007f, #3498db);
            border-image-slice: 1;
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
