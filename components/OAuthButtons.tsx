"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  type AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.1A11.999 11.999 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.26A12 12 0 0 0 0 12c0 1.93.46 3.76 1.26 5.38l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.62l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.415 2.06-1.243 2.76-.994.837-2.106 1.31-3.12 1.222-.11-1.09.39-2.207 1.223-2.964.822-.79 2.19-1.362 3.14-1.018ZM20.61 17.4c-.44 1-.66 1.45-1.24 2.34-.8 1.24-1.93 2.79-3.33 2.8-1.24.02-1.56-.81-3.24-.8-1.68.01-2.03.82-3.28.8-1.4-.02-2.47-1.4-3.27-2.64-2.24-3.46-2.48-7.52-1.09-9.68.98-1.54 2.53-2.44 4-2.44 1.5 0 2.44.83 3.68.83 1.2 0 1.94-.83 3.67-.83 1.31 0 2.7.72 3.68 1.95-3.23 1.77-2.71 6.38.44 7.67Z" />
    </svg>
  );
}

function friendlyOAuthError(err: AuthError): string {
  if (err.code === "auth/popup-closed-by-user") return "";
  if (err.code === "auth/account-exists-with-different-credential") {
    return "That email is already linked to a different sign-in method.";
  }
  return "Something went wrong signing you in. Please try again.";
}

export default function OAuthButtons() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);

  async function handleGoogle() {
    setError(null);
    setLoading("google");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/get-started?status=signed-in");
    } catch (err) {
      const msg = friendlyOAuthError(err as AuthError);
      if (msg) setError(msg);
    } finally {
      setLoading(null);
    }
  }

  async function handleApple() {
    setError(null);
    setLoading("apple");
    try {
      const provider = new OAuthProvider("apple.com");
      provider.addScope("email");
      provider.addScope("name");
      await signInWithPopup(auth, provider);
      router.push("/get-started?status=signed-in");
    } catch (err) {
      const msg = friendlyOAuthError(err as AuthError);
      if (msg) setError(msg);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated disabled:opacity-60"
        >
          <GoogleIcon />
          {loading === "google" ? "..." : "Google"}
        </button>
        <button
          type="button"
          onClick={handleApple}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated disabled:opacity-60"
        >
          <AppleIcon />
          {loading === "apple" ? "..." : "Apple"}
        </button>
      </div>
      {error && (
        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
