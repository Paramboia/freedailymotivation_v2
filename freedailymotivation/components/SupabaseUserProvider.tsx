'use client';

import React from 'react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

export function SupabaseUserProvider({ children }: { children: React.ReactNode }) {
  const { isSupabaseConnected, supabaseUserId: _supabaseUserId } = useSupabaseUser();

  // You can add loading or error states here if needed
  if (!isSupabaseConnected) {
    return <div>Connecting to Supabase...</div>;
  }

  return <>{children}</>;
}
