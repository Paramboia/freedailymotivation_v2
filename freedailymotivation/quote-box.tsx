import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createOrGetUser, testSupabaseConnection } from "@/lib/supabase-client";

export default function QuoteBox() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      console.log("QuoteBox init");
      const connectionTest = await testSupabaseConnection();
      console.log("Supabase connection test result:", connectionTest);

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

    init();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Supabase User ID: {supabaseUserId || "Not found"}</p>
    </div>
  );
}
