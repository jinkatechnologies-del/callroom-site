import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

// Thin typed wrappers around the existing ShiftLoft Cloud Functions.
// All permission checks and audit logging live server-side.

export type ProgramRole = "coordinator" | "admin" | "member";

export type ProgramDoc = {
  programId: string;
  name: string;
  institution: string;
  joinCode: string;
  joinsEnabled: boolean;
  memberCount: number;
  pendingRequestCount: number;
  coordinatorUid: string;
  adminUids: string[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type ProgramMemberDoc = {
  uid: string;
  role: ProgramRole;
  joinedAt: string;
  addedBy: string;
  displayName: string;
  pgyLevel: string;
  specialty: string;
  credentialSuffix: string;
  isAttending: boolean;
};

export type JoinRequestDoc = {
  uid: string;
  requestedAt: string;
  displayName: string;
  pgyLevel: string;
  specialty: string;
  credentialSuffix: string;
  isAttending: boolean;
  status: "pending" | "approved" | "denied";
};

function call<Req, Res>(name: string) {
  const fn = httpsCallable<Req, Res>(functions, name);
  return async (data: Req): Promise<Res> => (await fn(data)).data;
}

export const createProgram = call<
  { name: string; institution: string },
  { programId: string; joinCode: string; joinCodeDisplay: string }
>("createProgram");

export const reviewProgramJoin = call<
  { programId: string; targetUid: string; decision: "accept" | "deny"; denyReason?: string },
  { ok: boolean; accepted: boolean }
>("reviewProgramJoin");

export const setProgramAdmin = call<
  { programId: string; targetUid: string; grant: boolean },
  { ok: boolean }
>("setProgramAdmin");

export const removeProgramMember = call<
  { programId: string; targetUid: string },
  { ok: boolean }
>("removeProgramMember");

export const regenerateProgramJoinCode = call<
  { programId: string },
  { joinCode: string; joinCodeDisplay: string }
>("regenerateProgramJoinCode");

export const setProgramSettings = call<
  { programId: string; name?: string; institution?: string; joinsEnabled?: boolean },
  { ok: boolean }
>("setProgramSettings");

export const deleteProgram = call<{ programId: string }, { ok: boolean }>(
  "deleteProgram"
);

/** Turns a Firebase callable error into a readable message. */
export function callableErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const msg = String((err as { message: unknown }).message);
    return msg.replace(/^Firebase:\s*/i, "") || "Something went wrong.";
  }
  return "Something went wrong.";
}
