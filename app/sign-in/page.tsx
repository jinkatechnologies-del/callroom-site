"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  type AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import OAuthButtons from "@/components/OAuthButtons";

function friendlyError(err: AuthError): string {
  switch (err.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email or password doesn't match an account.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    default:
      return "Something went wrong signing you in. Please try again.";
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/get-started?status=signed-in");
    } catch (err) {
      setError(friendlyError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Sign In</h1>
        <p className="mt-2 text-sm text-muted">
          For Program Coordinators and Admins managing a residency program on
          CallRoom.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <OAuthButtons />
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              placeholder="you@program.edu"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an admin account?{" "}
        <Link href="/get-started" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>

      <p className="mt-2 text-center text-xs text-muted">
        Looking for the resident app?{" "}
        <span className="text-foreground">General sign-in is coming soon.</span>
      </p>
    </section>
  );
}
