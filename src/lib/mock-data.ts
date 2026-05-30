// In-memory mock store for SERVELOG demo. Replace with Lovable Cloud later.
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { notify } from "./browser-notifications";

export type Role = "student" | "admin";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  studentId: string;
  title: string;
  organizer: string;
  location: string;
  date: string; // ISO
  hours: number;
  description: string;
  proofDataUrl?: string;
  status: SubmissionStatus;
  reviewerComment?: string;
  flagged?: boolean; // AI duplicate flag
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  studentNo: string;
  course: string;
  email: string;
  violation: string;
  requiredHours: number;
  clearedAt?: string;
  clearanceNote?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  office: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  hours: number;
  tag: string;
}

const STUDENT: Student = {
  id: "stu-001",
  name: "Patrizia Rodriguez",
  studentNo: "2022-00451",
  course: "BS Information Technology",
  email: "patrizia.rodriguez@neu.edu.ph",
  violation: "Dress code violation (3rd offense)",
  requiredHours: 30,
};

const ADMIN: Admin = {
  id: "adm-001",
  name: "Dean Romulo P. Bautista",
  email: "r.bautista@neu.edu.ph",
  office: "Office of Student Discipline",
};

const INITIAL_ROSTER: Student[] = [
  STUDENT,
  { id: "stu-002", name: "Andrea Delos Santos", studentNo: "2022-00789", course: "BS Information Technology", email: "andrea.ds@neu.edu.ph", violation: "Tardiness (chronic)", requiredHours: 20 },
  { id: "stu-003", name: "Rochel Mae Arcellas", studentNo: "2022-00533", course: "BS Information Technology", email: "rochel.a@neu.edu.ph", violation: "Improper ID", requiredHours: 15 },
  { id: "stu-004", name: "Mark Villanueva", studentNo: "2021-00112", course: "BS Computer Science", email: "mark.v@neu.edu.ph", violation: "Cutting classes", requiredHours: 40 },
  { id: "stu-005", name: "Janelle Santos", studentNo: "2023-00220", course: "BS Information Systems", email: "janelle.s@neu.edu.ph", violation: "Cafeteria misconduct", requiredHours: 10 },
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  { id: "op-1", title: "Brigada Eskwela: Classroom Cleanup", organizer: "NEU Outreach Office", date: "2026-06-04", location: "Bagong Silangan Elementary", hours: 6, tag: "Education" },
  { id: "op-2", title: "Coastal Cleanup Drive", organizer: "Green NEU Org", date: "2026-06-12", location: "Manila Baywalk", hours: 5, tag: "Environment" },
  { id: "op-3", title: "Tech Tutoring for Seniors", organizer: "CICS Student Council", date: "2026-06-18", location: "NEU Centennial Hall", hours: 4, tag: "Tech" },
];

const seedSubs = (): Submission[] => [
  { id: "sub-001", studentId: "stu-001", title: "Feeding Program at Brgy. Commonwealth", organizer: "NEU CSO", location: "Brgy. Commonwealth", date: "2026-04-12", hours: 6, description: "Helped distribute meals and supplies to 80+ families.", status: "approved", createdAt: "2026-04-13T10:00:00Z" },
  { id: "sub-002", studentId: "stu-001", title: "Tree Planting Activity", organizer: "Green NEU", location: "La Mesa Watershed", date: "2026-04-26", hours: 5, description: "Planted 30 narra saplings.", status: "approved", createdAt: "2026-04-27T10:00:00Z" },
  { id: "sub-003", studentId: "stu-001", title: "Library Book Sorting", organizer: "NEU Library", location: "NEU Main Library", date: "2026-05-08", hours: 4, description: "Sorted and re-shelved donated books.", status: "pending", createdAt: "2026-05-09T08:30:00Z" },
  { id: "sub-004", studentId: "stu-002", title: "Coastal Cleanup", organizer: "Green NEU", location: "Manila Bay", date: "2026-05-02", hours: 5, description: "Trash collection along baywalk.", status: "pending", createdAt: "2026-05-03T09:00:00Z" },
  { id: "sub-005", studentId: "stu-002", title: "Tree Planting Activity", organizer: "Green NEU", location: "La Mesa Watershed", date: "2026-04-26", hours: 5, description: "Planted saplings.", status: "pending", flagged: true, createdAt: "2026-05-04T08:00:00Z" },
  { id: "sub-006", studentId: "stu-003", title: "Donation Drive", organizer: "NEU CSO", location: "NEU Quadrangle", date: "2026-04-20", hours: 3, description: "Sorted donated clothes.", status: "approved", createdAt: "2026-04-21T10:00:00Z" },
  { id: "sub-007", studentId: "stu-004", title: "Community Tutorial", organizer: "CICS SC", location: "Brgy. Holy Spirit", date: "2026-05-01", hours: 4, description: "Tutored grade-school kids in math.", status: "rejected", reviewerComment: "Proof image is unclear. Please re-upload a higher quality photo with visible date.", createdAt: "2026-05-02T11:00:00Z" },
];

export type NotifKind = "submitted" | "approved" | "rejected" | "upcoming" | "ready-clearance" | "cleared" | "violation";

export interface Notification {
  id: string;
  recipientRole: Role;
  recipientId: string;
  kind: NotifKind;
  title: string;
  body: string;
  href?: string;
  hrefParams?: Record<string, string>;
  read: boolean;
  createdAt: string;
  dedupeKey?: string;
}

interface State {
  role: Role | null;
  currentStudentId: string;
  currentAdminId: string;
  submissions: Submission[];
  notifications: Notification[];
  roster: Student[];
  opportunities: Opportunity[];
}

let state: State = {
  role: (typeof window !== "undefined" ? (localStorage.getItem("servelog:role") as Role | null) : null),
  currentStudentId: "stu-001",
  currentAdminId: "adm-001",
  submissions: seedSubs(),
  notifications: [],
  roster: INITIAL_ROSTER,
  opportunities: INITIAL_OPPORTUNITIES,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useStore = <T,>(selector: (s: State) => T): T =>
  useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );

export const actions = {
  setRole(role: Role | null) {
    state = { ...state, role };
    if (typeof window !== "undefined") {
      if (role) localStorage.setItem("servelog:role", role);
      else localStorage.removeItem("servelog:role");
    }
    emit();
  },
  addSubmission(input: Omit<Submission, "id" | "status" | "createdAt" | "studentId" | "flagged">) {
    const id = `sub-${Math.random().toString(36).slice(2, 8)}`;
    const dup = state.submissions.some(
      (s) => s.studentId === state.currentStudentId && s.date === input.date && s.location.toLowerCase() === input.location.toLowerCase(),
    );
    const sub: Submission = {
      ...input,
      id,
      studentId: state.currentStudentId,
      status: "pending",
      flagged: dup,
      createdAt: new Date().toISOString(),
    };
    state = { ...state, submissions: [sub, ...state.submissions] };
    emit();
    const stu = getStudent(sub.studentId);
    actions.pushNotification({
      recipientRole: "admin",
      recipientId: ADMIN.id,
      kind: "submitted",
      title: "New submission for review",
      body: `${stu.name} logged "${sub.title}" (${sub.hours} hrs)`,
      href: "/admin/review/$id",
      hrefParams: { id: sub.id },
    });
    return sub;
  },
  decide(id: string, status: "approved" | "rejected", comment?: string) {
    const target = state.submissions.find((s) => s.id === id);
    state = {
      ...state,
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status, reviewerComment: comment } : s,
      ),
    };
    emit();
    if (target) {
      actions.pushNotification({
        recipientRole: "student",
        recipientId: target.studentId,
        kind: status,
        title: status === "approved" ? "Activity approved" : "Activity needs changes",
        body: status === "approved"
          ? `"${target.title}" was approved (+${target.hours} hrs)`
          : `"${target.title}" was rejected${comment ? ` — ${comment}` : ""}`,
        href: "/app/history",
      });
      if (status === "approved") {
        const stu = getStudent(target.studentId);
        const totals = studentTotals(target.studentId);
        if (!stu.clearedAt && totals.approved >= stu.requiredHours) {
          actions.pushNotification({
            recipientRole: "admin",
            recipientId: ADMIN.id,
            kind: "ready-clearance",
            title: "Student ready for clearance",
            body: `${stu.name} reached ${totals.approved}/${stu.requiredHours} hrs`,
            href: "/admin/clearance",
            dedupeKey: `clearance:${stu.id}`,
          });
        }
      }
    }
  },
  addOpportunity(input: Omit<Opportunity, "id">) {
    const op: Opportunity = { ...input, id: `op-${Math.random().toString(36).slice(2, 7)}` };
    state = { ...state, opportunities: [op, ...state.opportunities] };
    emit();
    actions.pushNotification({
      recipientRole: "student",
      recipientId: STUDENT.id,
      kind: "upcoming",
      title: "New community service posted",
      body: `${op.title} on ${new Date(op.date).toLocaleDateString()} at ${op.location}`,
      href: "/app/home",
      dedupeKey: `new-op:${op.id}`,
    });
    return op;
  },
  addViolation(input: { name: string; studentNo: string; course: string; email: string; violation: string; requiredHours: number }) {
    const existing = state.roster.find((s) => s.studentNo === input.studentNo);
    if (existing) {
      state = {
        ...state,
        roster: state.roster.map((s) =>
          s.id === existing.id
            ? { ...s, violation: input.violation, requiredHours: input.requiredHours, clearedAt: undefined, clearanceNote: undefined }
            : s,
        ),
      };
      emit();
      actions.pushNotification({
        recipientRole: "student",
        recipientId: existing.id,
        kind: "violation",
        title: "Violation record updated",
        body: `${input.violation} · ${input.requiredHours} hrs required`,
        href: "/app/profile",
      });
      return existing;
    }
    const stu: Student = {
      id: `stu-${Math.random().toString(36).slice(2, 7)}`,
      ...input,
    };
    state = { ...state, roster: [...state.roster, stu] };
    emit();
    return stu;
  },
  clearStudent(studentId: string, note?: string) {
    const stu = state.roster.find((s) => s.id === studentId);
    if (!stu) return;
    state = {
      ...state,
      roster: state.roster.map((s) =>
        s.id === studentId ? { ...s, clearedAt: new Date().toISOString(), clearanceNote: note } : s,
      ),
    };
    emit();
    actions.pushNotification({
      recipientRole: "student",
      recipientId: studentId,
      kind: "cleared",
      title: "You're cleared 🎉",
      body: note ? note : "Community service requirement marked complete.",
      href: "/app/profile",
    });
  },
  pushNotification(input: Omit<Notification, "id" | "read" | "createdAt">) {
    if (input.dedupeKey && state.notifications.some((n) => n.dedupeKey === input.dedupeKey)) return;
    const n: Notification = {
      ...input,
      id: `ntf-${Math.random().toString(36).slice(2, 8)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    state = { ...state, notifications: [n, ...state.notifications] };
    emit();
    if (state.role === input.recipientRole) {
      toast(input.title, { description: input.body });
      notify(input.title, input.body);
    }
  },
  markAllRead(role: Role) {
    state = {
      ...state,
      notifications: state.notifications.map((n) =>
        n.recipientRole === role ? { ...n, read: true } : n,
      ),
    };
    emit();
  },
};

export const getNotifications = (role: Role, recipientId: string) =>
  state.notifications.filter((n) => n.recipientRole === role && n.recipientId === recipientId);

export const getUnreadCount = (role: Role, recipientId: string) =>
  getNotifications(role, recipientId).filter((n) => !n.read).length;

let remindersSeeded = false;
export function seedUpcomingReminders() {
  if (remindersSeeded) return;
  remindersSeeded = true;
  const now = Date.now();
  const horizon = now + 1000 * 60 * 60 * 24 * 3;
  for (const op of state.opportunities) {
    const t = new Date(op.date).getTime();
    if (t >= now && t <= horizon) {
      actions.pushNotification({
        recipientRole: "student",
        recipientId: STUDENT.id,
        kind: "upcoming",
        title: "Upcoming community service",
        body: `${op.title} on ${new Date(op.date).toLocaleDateString()} at ${op.location}`,
        href: "/app/home",
        dedupeKey: `upcoming:${op.id}`,
      });
    }
  }
  if (state.notifications.every((n) => n.kind !== "upcoming") && state.opportunities[0]) {
    const op = state.opportunities[0];
    actions.pushNotification({
      recipientRole: "student",
      recipientId: STUDENT.id,
      kind: "upcoming",
      title: "Upcoming community service",
      body: `${op.title} on ${new Date(op.date).toLocaleDateString()} at ${op.location}`,
      href: "/app/home",
      dedupeKey: `upcoming:${op.id}`,
    });
  }
}

export const getStudent = (id = state.currentStudentId): Student =>
  state.roster.find((s) => s.id === id) ?? STUDENT;

export const getAdmin = (): Admin => ADMIN;

export const getRoster = (): Student[] => state.roster;

export const getOpportunities = (): Opportunity[] => state.opportunities;

export const findSimilar = (sub: Submission): Submission | undefined =>
  state.submissions.find(
    (s) =>
      s.id !== sub.id &&
      s.date === sub.date &&
      s.location.toLowerCase() === sub.location.toLowerCase(),
  );

export const studentTotals = (studentId: string) => {
  const subs = state.submissions.filter((s) => s.studentId === studentId);
  const approved = subs.filter((s) => s.status === "approved").reduce((a, b) => a + b.hours, 0);
  const pending = subs.filter((s) => s.status === "pending").reduce((a, b) => a + b.hours, 0);
  return { approved, pending, all: subs };
};
