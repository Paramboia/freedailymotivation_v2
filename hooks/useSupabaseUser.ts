'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function useSupabaseUser() {
  const { isLoaded, isSignedIn } = useUser();
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    async function initDatabaseUser() {
      try {
        // Check database connection
        const connectionResponse = await fetch('/api/user');
        const connectionData = await connectionResponse.json();
        setIsSupabaseConnected(connectionData.connected);

        if (!connectionData.connected) {
          console.error('Failed to connect to database');
          return;
        }

        if (isLoaded && isSignedIn) {
          // Create or get user via API
          const userResponse = await fetch('/api/user', { method: 'POST' });
          const userData = await userResponse.json();
          
          if (userData.userId) {
            console.log("User ID from database:", userData.userId);
            setSupabaseUserId(userData.userId);
          }
        }
      } catch (error) {
        console.error("Error in initDatabaseUser:", error);
        setIsSupabaseConnected(false);
      }
    }

    initDatabaseUser();
  }, [isLoaded, isSignedIn]);

  return { isSupabaseConnected, supabaseUserId };
}
