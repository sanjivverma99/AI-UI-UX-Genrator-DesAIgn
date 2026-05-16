"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

function Header() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <header className="relative z-50 pointer-events-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Image src="/uiux logo.png" alt="logo" width={40} height={40} />
          <h2 className="text-xl font-semibold">
            Des<span className="text-pink-400">AIgn</span>
          </h2>
        </div>

        <ul className="flex gap-10 items-center text-lg">
          <li className="hover:text-pink-400 cursor-pointer">Home</li>
          <li className="hover:text-pink-400 cursor-pointer">Plan</li>
        </ul>

        <div className="relative z-50">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button>Get Started</Button>
            </SignInButton>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;