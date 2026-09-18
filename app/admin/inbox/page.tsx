"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ADMIN_EMAILS = ["admin@callroom.md"];

type WaitlistEntry = {
  id: string;
  email: string;
  role: string;
  createdAt: Timestamp | null;
};

type InquiryEntry = {
  id: string;
  name: string;
  email: string;
  program: string;
  message: string;
  createdAt: Timestamp | null;
};

function formatDate(ts: Timestamp | null) {
  if (!ts) return "just now";
  return ts.toDate().toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function AuthorizedInbox() {
  const [tab, setTab] = useState<"waitlist" | "inquiries">("inquiries");
  const [waitlist, setWaitlist] = useState<WaitlistEntry[] | null>(null);
  const [inquiries, setInquiries] = useState<InquiryEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const wSnap = await getDocs(
          query(collection(db, "waitlist"), orderBy("createdAt", "desc"))
        );
        setWaitlist(
          wSnap.docs.map((d) => ({
            id: d.id,
            email: d.data().email ?? "",
            role: d.data().role ?? "",
            createdAt: d.data().createdAt ?? null,
          }))
        );

        const iSnap = await getDocs(
          query(
            collection(db, "programInquiries"),
            orderBy("createdAt", "desc")
          )
        );
        setInquiries(
          iSnap.docs.map((d) => ({
            id: d.id,
            name: d.data().name ?? "",
            email: d.data().email ?? "",
            program: d.data().program ?? "",
            message: d.data().message ?? "",
            createdAt: d.data().createdAt ?? null,
          }))
        );
      } catch {
        setLoadError(
          "Couldn't load submissions. Your Firestore rules may not allow reads for this account yet."
        );
      }
    }
    load();
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
      <p className="mt-2 text-sm text-muted">
        Waitlist signups and program inquiries from the website.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab("inquiries")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            tab === "inquiries"
              ? "bg-accent text-background"
              : "border border-border text-muted hover:text-foreground"
          }`}
        >
          Program Inquiries {inquiries ? `(${inquiries.length})` : ""}
        </button>
        <button
          onClick={() => setTab("waitlist")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            tab === "waitlist"
              ? "bg-accent text-background"
              : "border border-border text-muted hover:text-foreground"
          }`}
        >
          Waitlist {waitlist ? `(${waitlist.length})` : ""}
        </button>
      </div>

      {loadError && (
        <p className="mt-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {loadError}
        </p>
      )}

      {!loadError && tab === "inquiries" && (
        <div className="mt-6 space-y-3">
          {inquiries === null && (
            <p className="text-sm text-muted">Loading...</p>
          )}
          {inquiries?.length === 0 && (
            <p className="text-sm text-muted">No inquiries yet.</p>
          )}
          {inquiries?.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {entry.name || "(no name)"}
                </p>
                <p className="text-xs text-muted">
                  {formatDate(entry.createdAt)}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted">
                <a
                  href={`mailto:${entry.email}`}
                  className="text-accent hover:underline"
                >
                  {entry.email}
                </a>
                {entry.program ? ` · ${entry.program}` : ""}
              </p>
              {entry.message && (
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {entry.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loadError && tab === "waitlist" && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
          {waitlist === null && (
            <p className="p-5 text-sm text-muted">Loading...</p>
          )}
          {waitlist?.length === 0 && (
            <p className="p-5 text-sm text-muted">No signups yet.</p>
          )}
          {waitlist && waitlist.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((entry) => (
                  <tr key={entry.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-foreground/90">{entry.email}</td>
                    <td className="px-5 py-3 text-muted">{entry.role}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}

export default function AdminInboxPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  if (user === undefined) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center text-sm text-muted">
        Loading...
      </section>
    );
  }

  if (user === null) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-sm text-muted">
          Sign in with your admin account to view this page.
        </p>
        <Link
          href="/sign-in"
          className="mt-4 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Sign In
        </Link>
      </section>
    );
  }

  if (!ADMIN_EMAILS.includes(user.email ?? "")) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center text-sm text-muted">
        This account isn&apos;t authorized to view the inbox.
      </section>
    );
  }

  return <AuthorizedInbox />;
}
