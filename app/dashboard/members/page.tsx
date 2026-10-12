"use client";

import { useState } from "react";
import { useProgram } from "@/lib/ProgramContext";
import {
  callableErrorMessage,
  removeProgramMember,
  reviewProgramJoin,
  setProgramAdmin,
  type JoinRequestDoc,
  type ProgramMemberDoc,
} from "@/lib/programApi";

function describe(p: {
  isAttending: boolean;
  pgyLevel: string;
  specialty: string;
}) {
  const level = p.isAttending ? "Attending" : p.pgyLevel;
  return [level, p.specialty].filter(Boolean).join(" · ");
}

function fullName(p: { displayName: string; credentialSuffix: string }) {
  return p.credentialSuffix
    ? `${p.displayName}, ${p.credentialSuffix}`
    : p.displayName;
}

function RoleBadge({ role }: { role: ProgramMemberDoc["role"] }) {
  if (role === "member") return null;
  const styles =
    role === "coordinator"
      ? "border-accent/40 bg-accent/10 text-accent"
      : "border-blue/40 bg-blue/10 text-blue";
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${styles}`}
    >
      {role}
    </span>
  );
}

function RequestRow({
  request,
  programId,
  onError,
}: {
  request: JoinRequestDoc;
  programId: string;
  onError: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [denying, setDenying] = useState(false);
  const [reason, setReason] = useState("");

  async function decide(decision: "accept" | "deny") {
    setBusy(true);
    try {
      await reviewProgramJoin({
        programId,
        targetUid: request.uid,
        decision,
        ...(decision === "deny" && reason.trim()
          ? { denyReason: reason.trim() }
          : {}),
      });
    } catch (err) {
      onError(callableErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {fullName(request)}
          </p>
          <p className="text-xs text-muted">
            {describe(request)} · Requested{" "}
            {new Date(request.requestedAt).toLocaleDateString()}
          </p>
        </div>
        {!denying && (
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={() => decide("accept")}
              className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-background hover:bg-accent-hover disabled:opacity-60"
            >
              Accept
            </button>
            <button
              disabled={busy}
              onClick={() => setDenying(true)}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-surface disabled:opacity-60"
            >
              Deny
            </button>
          </div>
        )}
      </div>
      {denying && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={200}
            placeholder="Reason (optional, shown to them)"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent sm:flex-1"
          />
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={() => decide("deny")}
              className="rounded-full bg-red-500/90 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
            >
              Confirm deny
            </button>
            <button
              disabled={busy}
              onClick={() => setDenying(false)}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberRow({
  member,
  programId,
  isCoordinator,
  selfUid,
  onError,
}: {
  member: ProgramMemberDoc;
  programId: string;
  isCoordinator: boolean;
  selfUid: string;
  onError: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const isSelf = member.uid === selfUid;
  const canToggleAdmin =
    isCoordinator && !isSelf && member.role !== "coordinator";
  const canRemove = !isSelf && member.role !== "coordinator";

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
    } catch (err) {
      onError(callableErrorMessage(err));
    } finally {
      setBusy(false);
      setConfirmRemove(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {fullName(member)}
            {isSelf && <span className="text-muted"> (you)</span>}
          </p>
          <RoleBadge role={member.role} />
        </div>
        <p className="text-xs text-muted">{describe(member)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {canToggleAdmin && (
          <button
            disabled={busy}
            onClick={() =>
              run(() =>
                setProgramAdmin({
                  programId,
                  targetUid: member.uid,
                  grant: member.role !== "admin",
                })
              )
            }
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background disabled:opacity-60"
          >
            {member.role === "admin" ? "Remove admin" : "Make admin"}
          </button>
        )}
        {canRemove &&
          (confirmRemove ? (
            <>
              <button
                disabled={busy}
                onClick={() =>
                  run(() =>
                    removeProgramMember({ programId, targetUid: member.uid })
                  )
                }
                className="rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                Confirm remove
              </button>
              <button
                disabled={busy}
                onClick={() => setConfirmRemove(false)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              disabled={busy}
              onClick={() => setConfirmRemove(true)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted hover:text-red-400 disabled:opacity-60"
            >
              Remove
            </button>
          ))}
      </div>
    </div>
  );
}

export default function MembersPage() {
  const { programId, role, user, members, pendingRequests } = useProgram();
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  if (!programId || !user) return null;
  const isCoordinator = role === "coordinator";
  const shown = members.filter((m) =>
    `${m.displayName} ${m.pgyLevel} ${m.specialty}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <p className="mt-1 text-sm text-muted">
          Approve join requests and manage who&apos;s in your program.
          {isCoordinator
            ? " As coordinator, you can also grant or revoke admin access."
            : " Only the coordinator can change admin access."}
        </p>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      <section>
        <h2 className="text-sm font-semibold text-foreground">
          Pending requests ({pendingRequests.length})
        </h2>
        <div className="mt-3 space-y-3">
          {pendingRequests.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
              No pending requests.
            </p>
          ) : (
            pendingRequests.map((r) => (
              <RequestRow
                key={r.uid}
                request={r}
                programId={programId}
                onError={setError}
              />
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">
            Roster ({members.length})
          </h2>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search"
            className="w-48 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
        <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
          {shown.map((m) => (
            <MemberRow
              key={m.uid}
              member={m}
              programId={programId}
              isCoordinator={isCoordinator}
              selfUid={user.uid}
              onError={setError}
            />
          ))}
          {shown.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No matches.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
