import { ClerkProvider, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { getOrCreateSupabaseUser } from '../lib/user';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <SupabaseUserHandler>
        <Component {...pageProps} />
      </SupabaseUserHandler>
    </ClerkProvider>
  );
}

function SupabaseUserHandler({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function handleUser() {
      if (isLoaded && user) {
        console.log('Clerk user loaded:', user.id)
        try {
          const supabaseUser = await getOrCreateSupabaseUser(user)
          console.log('Supabase user:', supabaseUser);
        } catch (error) {
          console.error('Error handling Supabase user:', error);
        }
      }
    }
    handleUser();
  }, [isLoaded, user]);

  return <>{children}</>;
}

export default MyApp;
