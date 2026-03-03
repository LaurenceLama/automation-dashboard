"use client";

import { createClient } from "../utils/supabase/client";

export default function LoginButton() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg bg-linear-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-600"
    >
      <span className="relative px-5 py-2.5 transition-all duration-270 ease-in-out bg-white text-black rounded-md group-hover:bg-transparent group-hover:text-white">
        Sign in with Google
      </span>
    </button>
  );
}
