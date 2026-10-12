"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type AuthError,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { callableErrorMessage, createProgram } from "@/lib/programApi";
import OAuthButtons from "@/components/OAuthButtons";

// Keep in sync with the "Last Updated" dates on /terms and /privacy.
const TERMS_VERSION = "2026-09-09";
const PRIVACY_VERSION = "2026-09-09";

type RoleChoice = "coordinator" | "attending" | "app" | "resident";
const PGY_LEVELS = ["PGY-1", "PGY-2", "PGY-3", "PGY-4", "PGY-5", "PGY-6", "PGY-7"];

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent";
const labelClass = "mb-1.5 block text-xs font-medium text-muted";

function friendlyAuthError(err: AuthError): string {
  switch (err.code) {
    case "auth/email-already-in-use":
      return "An account with that email already exists. Sign in instead.";
    case "auth/weak-password":
      return "Choose a password with at least 8 characters.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    default:
      return `Something went wrong creating your account (${err.code}).`;
  }
}

/** Step 1: create or sign in to an account. */
function AccountStep() {
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
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged moves the page to the next step.
    } catch (err) {
      setError(friendlyAuthError(err as AuthError));
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <OAuthButtons redirectTo={null} />
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputClass} placeholder="you@program.edu" />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" type="password" required minLength={8}
            autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass} placeholder="At least 8 characters" />
        </div>
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
        )}
        <button type="submit" disabled={loading}
          className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-60">
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

/** Step 2: profile (if new) plus program details, then createProgram. */
function ProgramStep({ user, hasProfile }: { user: User; hasProfile: boolean }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.displayName ?? "");
  const [roleChoice, setRoleChoice] = useState<RoleChoice>("coordinator");
  const [pgy, setPgy] = useState("PGY-1");
  const [credential, setCredential] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [programName, setProgramName] = useState("");
  const [institution, setInstitution] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pgyLevelFor(choice: RoleChoice): string {
    if (choice === "coordinator") return "Program Coordinator";
    if (choice === "attending") return "Attending";
    if (choice === "app") return "APP";
    return pgy;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    try {
      if (!hasProfile) {
        const now = new Date().toISOString();
        // Mirrors saveUserProfile() in the app's utils/userProfile.ts.
        await setDoc(doc(db, "users", user.uid), {
          email: user.email ?? "",
          displayName: displayName.trim(),
          specialty: specialty.trim(),
          pgyLevel: pgyLevelFor(roleChoice),
          credentialSuffix: roleChoice === "coordinator" ? "" : credential.trim(),
          isAttending: roleChoice === "attending",
          profilePhoto: null,
          termsAcceptedAt: now,
          termsAcceptedVersion: TERMS_VERSION,
          privacyAcceptedVersion: PRIVACY_VERSION,
          setupComplete: true,
          createdAt: now,
          updatedAt: now,
        });
      }
      await createProgram({
        name: programName.trim(),
        institution: institution.trim(),
      });
      // Pick up the new coordinator claim before opening the dashboard.
      await user.getIdToken(true);
      router.push("/dashboard");
    } catch (err) {
      setError(callableErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!hasProfile && (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-foreground">About you</h2>
          <div>
            <label className={labelClass}>Full name</label>
            <input required maxLength={120} value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass} placeholder="Jane Smith" />
          </div>
          <div>
            <label className={labelClass}>Your role</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["coordinator", "Program Coordinator"],
                ["attending", "Attending"],
                ["resident", "Resident"],
                ["app", "APP"],
              ] as [RoleChoice, string][]).map(([value, label]) => (
                <button key={value} type="button" onClick={() => setRoleChoice(value)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    roleChoice === value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-background text-foreground hover:border-white/20"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {roleChoice === "resident" && (
            <div>
              <label className={labelClass}>Training level</label>
              <div className="flex flex-wrap gap-2">
                {PGY_LEVELS.map((level) => (
                  <button key={level} type="button" onClick={() => setPgy(level)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      pgy === level
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted hover:text-foreground"
                    }`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className={roleChoice === "coordinator" ? "" : "grid gap-4 sm:grid-cols-2"}>
            <div>
              <label className={labelClass}>Specialty</label>
              <input required maxLength={80} value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className={inputClass} placeholder="Plastic Surgery" />
            </div>
            {roleChoice !== "coordinator" && (
              <div>
                <label className={labelClass}>Credentials (optional)</label>
                <input maxLength={40} value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  className={inputClass}
                  placeholder={roleChoice === "app" ? "PA-C" : "MD"} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground">Your program</h2>
        <div>
          <label className={labelClass}>Program name</label>
          <input required maxLength={80} value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className={inputClass} placeholder="Plastic Surgery Residency" />
        </div>
        <div>
          <label className={labelClass}>Institution (optional)</label>
          <input maxLength={120} value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className={inputClass} placeholder="University Medical Center" />
        </div>
        <p className="text-xs text-muted">
          You&apos;ll be the Program Coordinator: the one super admin who can
          appoint other admins.
        </p>
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#ff9f0a]" />
        <span>
          I agree to CallRoom&apos;s{" "}
          <Link href="/terms" className="underline hover:text-foreground">Terms of Use</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
        </span>
      </label>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
      )}

      <button type="submit" disabled={loading}
        className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-60">
        {loading ? "Creating your program..." : "Create Program"}
      </button>
    </form>
  );
}

export default function GetStartedPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) {
      setHasProfile(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const token = await user.getIdTokenResult();
      const pr = token.claims.pr as Record<string, string> | undefined;
      if (pr && Object.keys(pr).length > 0) {
        router.replace("/dashboard");
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!cancelled) setHasProfile(snap.exists());
    })();
    return () => {
      cancelled = true;
    };
  }, [user, router]);

  const step = !user ? 1 : 2;

  return (
    <section className="mx-auto max-w-lg px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Step {step} of 2
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {step === 1 ? "Create your account" : "Set up your program"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {step === 1
            ? "For Program Coordinators setting up a residency program on CallRoom."
            : "Residents join later with the code you'll get on the next screen."}
        </p>
      </div>

      {user === undefined || (user && hasProfile === null) ? (
        <p className="text-center text-sm text-muted">Loading...</p>
      ) : !user ? (
        <>
          <AccountStep />
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-accent hover:underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted">
            Joining an existing program? Download the app and enter your program&apos;s code.
          </p>
        </>
      ) : (
        <>
          <ProgramStep user={user} hasProfile={hasProfile === true} />
          <p className="mt-6 text-center text-xs text-muted">
            Signed in as {user.email}.{" "}
            <button onClick={() => signOut(auth)} className="underline hover:text-foreground">
              Use a different account
            </button>
          </p>
        </>
      )}
    </section>
  );
}
