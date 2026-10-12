"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useProgram } from "@/lib/ProgramContext";

const liveLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/members", label: "Members" },
  { href: "/dashboard/settings", label: "Settings" },
];

const upcoming = [
  "Teams",
  "People",
  "Directory",
  "Templates",
  "Conference",
  "Call Builder",
];

function Gate({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, program, role, pendingRequests } = useProgram();
  const pathname = usePathname();

  if (status === "loading") {
    return <Gate title="Loading your program" body="One moment." />;
  }
  if (status === "signed-out") {
    return (
      <Gate
        title="Sign in to your dashboard"
        body="The program dashboard is for Program Coordinators and Admins."
        action={
          <Link
            href="/sign-in"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background hover:bg-accent-hover"
          >
            Sign In
          </Link>
        }
      />
    );
  }
  if (status === "no-program") {
    return (
      <Gate
        title="No program yet"
        body="Your account isn't connected to a program. Set one up to become its Program Coordinator."
        action={
          <Link
            href="/get-started"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background hover:bg-accent-hover"
          >
            Set Up a Program
          </Link>
        }
      />
    );
  }
  if (status === "not-admin") {
    return (
      <Gate
        title="Admins only"
        body="You're a member of a program, but only Coordinators and Admins can use the dashboard. Ask your Program Coordinator for admin access."
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row">
      <aside className="md:w-52 md:shrink-0">
        <div className="mb-5">
          <p className="truncate text-sm font-semibold text-foreground">
            {program?.name ?? "Your program"}
          </p>
          <p className="text-xs capitalize text-muted">{role}</p>
        </div>

        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {liveLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-surface-elevated text-foreground"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {link.label}
                {link.href === "/dashboard/members" &&
                  pendingRequests.length > 0 && (
                    <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold text-background">
                      {pendingRequests.length}
                    </span>
                  )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 hidden md:block">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted/70">
            Coming soon
          </p>
          <ul className="mt-2 space-y-1">
            {upcoming.map((label) => (
              <li key={label} className="px-3 py-1.5 text-sm text-muted/50">
                {label}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="mt-6 hidden px-3 text-xs font-medium text-muted hover:text-foreground md:block"
        >
          Sign out
        </button>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
