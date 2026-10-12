"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type {
  JoinRequestDoc,
  ProgramDoc,
  ProgramMemberDoc,
  ProgramRole,
} from "@/lib/programApi";

type Status = "loading" | "signed-out" | "no-program" | "not-admin" | "ready";

type ProgramContextValue = {
  status: Status;
  user: User | null;
  programId: string | null;
  role: ProgramRole | null;
  program: ProgramDoc | null;
  members: ProgramMemberDoc[];
  pendingRequests: JoinRequestDoc[];
  /** Forces a fresh ID token so new custom claims (pr) are picked up. */
  refreshClaims: () => Promise<void>;
};

const ProgramContext = createContext<ProgramContextValue | null>(null);

const CLAIM_TO_ROLE: Record<string, ProgramRole> = {
  k: "coordinator",
  a: "admin",
  m: "member",
};

export function ProgramProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [programId, setProgramId] = useState<string | null>(null);
  const [role, setRole] = useState<ProgramRole | null>(null);
  const [claimsLoaded, setClaimsLoaded] = useState(false);
  const [program, setProgram] = useState<ProgramDoc | null>(null);
  const [members, setMembers] = useState<ProgramMemberDoc[]>([]);
  const [pendingRequests, setPendingRequests] = useState<JoinRequestDoc[]>([]);
  const [claimsVersion, setClaimsVersion] = useState(0);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  // Read program membership from custom claims (pr: {programId: k|a|m}).
  useEffect(() => {
    if (!user) {
      setProgramId(null);
      setRole(null);
      setClaimsLoaded(user === null);
      return;
    }
    let cancelled = false;
    user.getIdTokenResult(claimsVersion > 0).then((result) => {
      if (cancelled) return;
      const pr = result.claims.pr as Record<string, string> | undefined;
      const entry = pr ? Object.entries(pr)[0] : undefined;
      setProgramId(entry ? entry[0] : null);
      setRole(entry ? CLAIM_TO_ROLE[entry[1]] ?? null : null);
      setClaimsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user, claimsVersion]);

  const isAdmin = role === "coordinator" || role === "admin";

  // Live program doc + roster.
  useEffect(() => {
    if (!programId || !isAdmin) {
      setProgram(null);
      setMembers([]);
      return;
    }
    const unsubProgram = onSnapshot(doc(db, "programs", programId), (snap) => {
      setProgram(snap.exists() ? (snap.data() as ProgramDoc) : null);
    });
    const unsubMembers = onSnapshot(
      collection(db, "programs", programId, "members"),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as ProgramMemberDoc);
        const order: Record<ProgramRole, number> = {
          coordinator: 0,
          admin: 1,
          member: 2,
        };
        list.sort(
          (a, b) =>
            order[a.role] - order[b.role] ||
            a.displayName.localeCompare(b.displayName)
        );
        setMembers(list);
      }
    );
    const unsubRequests = onSnapshot(
      query(
        collection(db, "programs", programId, "joinRequests"),
        where("status", "==", "pending")
      ),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as JoinRequestDoc);
        list.sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));
        setPendingRequests(list);
      }
    );
    return () => {
      unsubProgram();
      unsubMembers();
      unsubRequests();
    };
  }, [programId, isAdmin]);

  let status: Status;
  if (user === undefined || (user && !claimsLoaded)) status = "loading";
  else if (!user) status = "signed-out";
  else if (!programId) status = "no-program";
  else if (!isAdmin) status = "not-admin";
  else status = "ready";

  const value: ProgramContextValue = {
    status,
    user: user ?? null,
    programId,
    role,
    program,
    members,
    pendingRequests,
    refreshClaims: async () => {
      if (auth.currentUser) await auth.currentUser.getIdToken(true);
      setClaimsVersion((v) => v + 1);
    },
  };

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
}

export function useProgram(): ProgramContextValue {
  const ctx = useContext(ProgramContext);
  if (!ctx) throw new Error("useProgram must be used inside ProgramProvider");
  return ctx;
}
