"use client";

import Link from "next/link";
import { useState } from "react";
import { useProgram } from "@/lib/ProgramContext";

function formatCode(code: string) {
  return code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

export default function DashboardOverview() {
  const { program, members, pendingRequests } = useProgram();
  const [copied, setCopied] = useState(false);

  if (!program) {
    return <p className="text-sm text-muted">Loading program...</p>;
  }

  const admins = members.filter((m) => m.role !== "member").length;
  const attendings = members.filter((m) => m.isAttending).length;
  const trainees = members.length - attendings;

  async function copyCode() {
    await navigator.clipboard.writeText(program!.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{program.name}</h1>
        {program.institution && (
          <p className="mt-1 text-sm text-muted">{program.institution}</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-medium text-muted">Program join code</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <p className="font-mono text-3xl font-bold tracking-widest text-foreground">
            {formatCode(program.joinCode)}
          </p>
          <button
            onClick={copyCode}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-sm text-muted">
          {program.joinsEnabled
            ? "Share this code with residents and faculty. They enter it in the CallRoom app, and you approve each request here."
            : "Joining is currently turned off. Turn it back on in Settings to accept new requests."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/members"
          className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-white/20"
        >
          <p className="text-xs font-medium text-muted">Pending requests</p>
          <p
            className={`mt-1 text-3xl font-bold ${
              pendingRequests.length ? "text-accent" : "text-foreground"
            }`}
          >
            {pendingRequests.length}
          </p>
        </Link>
        <Link
          href="/dashboard/members"
          className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-white/20"
        >
          <p className="text-xs font-medium text-muted">Members</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {members.length}
          </p>
          <p className="mt-1 text-xs text-muted">
            {trainees} trainees, {attendings} attendings
          </p>
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-muted">Admins</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{admins}</p>
          <p className="mt-1 text-xs text-muted">Including the coordinator</p>
        </div>
      </div>
    </div>
  );
}
