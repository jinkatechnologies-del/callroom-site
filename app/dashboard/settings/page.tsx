"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgram } from "@/lib/ProgramContext";
import {
  callableErrorMessage,
  deleteProgram,
  regenerateProgramJoinCode,
  setProgramSettings,
} from "@/lib/programApi";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent disabled:opacity-60";

export default function SettingsPage() {
  const router = useRouter();
  const { program, programId, role, refreshClaims } = useProgram();
  const isCoordinator = role === "coordinator";

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenBusy, setRegenBusy] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (program) {
      setName(program.name);
      setInstitution(program.institution ?? "");
    }
  }, [program]);

  if (!program || !programId) return null;

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await setProgramSettings({
        programId: programId!,
        name: name.trim(),
        institution: institution.trim(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      setError(callableErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleJoins() {
    setError(null);
    try {
      await setProgramSettings({
        programId: programId!,
        joinsEnabled: !program!.joinsEnabled,
      });
    } catch (err) {
      setError(callableErrorMessage(err));
    }
  }

  async function regenerate() {
    setError(null);
    setRegenBusy(true);
    try {
      await regenerateProgramJoinCode({ programId: programId! });
      setConfirmRegen(false);
    } catch (err) {
      setError(callableErrorMessage(err));
    } finally {
      setRegenBusy(false);
    }
  }

  async function remove() {
    setError(null);
    setDeleting(true);
    try {
      await deleteProgram({ programId: programId! });
      await refreshClaims();
      router.push("/dashboard");
    } catch (err) {
      setError(callableErrorMessage(err));
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        {!isCoordinator && (
          <p className="mt-1 text-sm text-muted">
            Only the Program Coordinator can change program details.
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <form
        onSubmit={saveDetails}
        className="space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">
          Program details
        </h2>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Program name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            disabled={!isCoordinator}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Institution
          </label>
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            maxLength={120}
            disabled={!isCoordinator}
            className={inputClass}
          />
        </div>
        {isCoordinator && (
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
          </button>
        )}
      </form>

      <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground">Joining</h2>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground">Accept new join requests</p>
            <p className="text-xs text-muted">
              When off, the join code stops working until you turn it back on.
            </p>
          </div>
          <button
            onClick={toggleJoins}
            disabled={!isCoordinator}
            aria-pressed={program.joinsEnabled}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
              program.joinsEnabled ? "bg-accent" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                program.joinsEnabled ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="text-sm text-foreground">Regenerate join code</p>
            <p className="text-xs text-muted">
              The old code stops working immediately. Current members are not
              affected.
            </p>
          </div>
          {confirmRegen ? (
            <div className="flex gap-2">
              <button
                onClick={regenerate}
                disabled={regenBusy}
                className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-background hover:bg-accent-hover disabled:opacity-60"
              >
                {regenBusy ? "Working..." : "Confirm"}
              </button>
              <button
                onClick={() => setConfirmRegen(false)}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRegen(true)}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>

      {isCoordinator && (
        <div className="space-y-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="text-sm font-semibold text-red-400">Delete program</h2>
          <p className="text-sm text-muted">
            Removes every member, all pending requests, the join code, and the
            program call schedule. This cannot be undone. Type the program name
            to confirm.
          </p>
          <input
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder={program.name}
            className={inputClass}
          />
          <button
            onClick={remove}
            disabled={deleting || deleteText !== program.name}
            className="rounded-full bg-red-500/90 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
          >
            {deleting ? "Deleting..." : "Delete program"}
          </button>
        </div>
      )}
    </div>
  );
}
