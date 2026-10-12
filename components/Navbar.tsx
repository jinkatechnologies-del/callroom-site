"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => setSignedIn(!!u)), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/logo-icon-transparent.png"
            alt="CallRoom"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="text-[17px] font-extrabold tracking-tight">
            <span className="font-medium text-foreground">Call</span>
            <span className="text-accent">Room</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Signed-in admins keep a way back to the dashboard. Sign In is
              hidden from the public nav while the site is waitlist-only. */}
          {signedIn && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/#waitlist"
            className="rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover sm:px-4"
          >
            Join Waitlist
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
