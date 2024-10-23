"use client";

import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

export default function AuthComponent() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  return (
    <div>
      <SignInButton mode="modal" />
      <SignUpButton mode="modal" />
    </div>
  );
}
