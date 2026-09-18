"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type AuthError,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import OAuthButtons from "@/components/OAuthButtons";

function friendlyError(err: AuthError): string {
  switch (err.code) {
    case "auth/email-already-in-use":
      return "An account with that email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Choose a password with at least 8 characters.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    default:
      return "Something went wrong creating your account. Please try again.";
  }
}

function SignedInPanel({ user }: { user: User }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user.uid]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/15">
        <svg className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold">You&apos;re signed in</h2>
      <p className="mt-1 text-sm text-muted">{user.email}</p>
      {typeof profile?.programName === "string" && (
        <p className="mt-1 text-sm text-muted">{profile.programName}</p>
      )}

      <div className="mt-6 rounded-xl bg-background p-4 text-left">
        <p className="text-sm text-foreground">
          The web admin dashboard is coming soon. For now, manage your program
          from the CallRoom mobile app using this same account.
        </p>
      </div>

      <button
        onClick={() => {
          signOut(auth);
          router.refresh();
        }}
        className="mt-5 text-xs font-medium text-muted hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
}

function CreateAccountForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [programName, setProgramName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      // NOTE: mirrors the mobile app's users/{uid} profile write.
      // Wire this up to your shared profile-creation logic (role: "admin",
      // programName, name) so it matches what App.tsx / userProfile.ts write.
      void cred;
      router.push("/get-started?status=signed-in");
    } catch (err) {
      setError(friendlyError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }

  return (
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
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
            placeholder="Dr. Jane Smith"
          />
        </div>

        <div>
          <label
            htmlFor="programName"
            className="mb-1.5 block text-xs font-medium text-muted"
          >
            Residency program
          </label>
          <input
            id="programName"
            type="text"
            required
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
            placeholder="e.g. General Surgery Residency"
          />
        </div>

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
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
            placeholder="At least 8 characters"
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
        {loading ? "Creating account…" : "Create Admin Account"}
      </button>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
        By creating an account you agree to CallRoom&apos;s{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
      </form>
    </div>
  );
}

function GetStartedContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const justSignedIn = searchParams.get("status") === "signed-in";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {user ? "Welcome back" : "Create Admin Account"}
        </h1>
        {!user && (
          <p className="mt-2 text-sm text-muted">
            For Program Coordinators and Admins setting up a residency
            program on CallRoom.
          </p>
        )}
      </div>

      {user === undefined && (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
          Loading…
        </div>
      )}

      {user === null && <CreateAccountForm />}

      {user && <SignedInPanel user={user} />}

      {!user && !justSignedIn && (
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </section>
  );
}

export default function GetStartedPage() {
  return (
    <Suspense fallback={null}>
      <GetStartedContent />
    </Suspense>
  );
}
