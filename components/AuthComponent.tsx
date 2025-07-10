"use client";

import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { analytics } from "@/lib/analytics";

export default function AuthComponent() {
  const { isSignedIn, user: _user } = useUser();
  const prevSignedInState = useRef<boolean | null>(null);

  useEffect(() => {
    // Track authentication state changes
    if (prevSignedInState.current !== null && prevSignedInState.current !== isSignedIn) {
      if (isSignedIn) {
        analytics.trackAuth('sign_in');
      } else {
        analytics.trackAuth('sign_out');
      }
    }
    prevSignedInState.current = isSignedIn ?? null;
  }, [isSignedIn]);

  const handleSignInClick = () => {
    // Track sign in button click
    analytics.trackCTAClick('Sign In', 'Auth Component');
  };

  const handleSignUpClick = () => {
    // Track sign up button click
    analytics.trackCTAClick('Sign Up', 'Auth Component');
  };

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  return (
    <div>
      <div onClick={handleSignInClick}>
        <SignInButton mode="modal" />
      </div>
      <div onClick={handleSignUpClick}>
        <SignUpButton mode="modal" />
      </div>
    </div>
  );
}
