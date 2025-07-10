'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { createOrGetUser, testSupabaseConnection } from "@/lib/supabase-client";

export function useSupabaseUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    async function initSupabaseUser() {
      const connectionTest = await testSupabaseConnection();
      setIsSupabaseConnected(connectionTest.success);

      if (!connectionTest.success) {
        console.error('Failed to connect to Supabase');
        return;
      }

      if (isLoaded && isSignedIn && user) {
        console.log("User signed in:", user);
        try {
          const userId = await createOrGetUser(user);
          console.log("User ID from Supabase:", userId);
          setSupabaseUserId(userId);
        } catch (error) {
          console.error("Error in createOrGetUser:", error);
        }
      }
    }

    initSupabaseUser();
  }, [isLoaded, isSignedIn, user]);

  return { isSupabaseConnected, supabaseUserId };
}
