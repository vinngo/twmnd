"use client";

import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "./actions";
import { GoogleIcon } from "@/components/google-icon";

export default function LandingPage() {
  const handleLogin = async () => {
    const { url, error } = await loginWithGoogle();
    if (error) {
      console.error(error);
    }
    //@ts-expect-error idc
    window.location.href = url;
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">TwinMind</h1>
      </header>

      <Button
        className="flex items-center gap-2 px-6 py-5"
        onClick={handleLogin}
      >
        <GoogleIcon />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}
