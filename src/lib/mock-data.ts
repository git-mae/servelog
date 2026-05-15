// In-memory mock store for SERVELOG demo. Replace with Lovable Cloud later.
import { useSyncExternalStore } from "react";

export type Role = "student" | "adviser";

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
  adviserComment?: string;
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
}

export interface Adviser {
  id: string;
  name: string;
  email: string;
  department: string;
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

const ADVISER: Adviser = {
  id: "adv-001",
  name: "Prof. Teresita C. Alcantara",
  email: "t.alcantara@neu.edu.ph",
  department: "College of Informatics & Computing Studies",
};

const ROSTER: Student[] = [
  STUDENT,
  { id: "stu-002", name: "Andrea Delos Santos", studentNo: "2022-00789", course: "BS Information Technology", email: "andrea.ds@neu.edu.ph", violation: "Tardiness (chronic)", requiredHours: 20 },
  { id: "stu-003", name: "Rochel Mae Arcellas", studentNo: "2022-00533", course: "BS Information Technology", email: "rochel.a@neu.edu.ph", violation: "Improper ID", requiredHours: 15 },
  { id: "stu-004", name: "Mark Villanueva", studentNo: "2021-00112", course: "BS Computer Science", email: "mark.v@neu.edu.ph", violation: "Cutting classes", requiredHours: 40 },
  { id: "stu-005", name: "Janelle Santos", studentNo: "2023-00220", course: "BS Information Systems", email: "janelle.s@neu.edu.ph", violation: "Cafeteria misconduct", requiredHours: 10 },
];

const OPPORTUNITIES: Opportunity[] = [
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
  { id: "sub-007", studentId: "stu-004", title: "Community Tutorial", organizer: "CICS SC", location: "Brgy. Holy Spirit", date: "2026-05-01", hours: 4, description: "Tutored grade-school kids in math.", status: "rejected", adviserComment: "Proof image is unclear. Please re-upload a higher quality photo with visible date.", createdAt: "2026-05-02T11:00:00Z" },
];

interface State {
  role: Role | null;
  currentStudentId: string;
  currentAdviserId: string;
  submissions: Submission[];
}

let state: State = {
  role: (typeof window !== "undefined" ? (localStorage.getItem("servelog:role") as Role | null) : null),
  currentStudentId: "stu-001",
  currentAdviserId: "adv-001",
  submissions: seedSubs(),
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
    return sub;
  },
  decide(id: string, status: "approved" | "rejected", comment?: string) {
    state = {
      ...state,
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status, adviserComment: comment } : s,
      ),
    };
    emit();
  },
};

export const getStudent = (id = state.currentStudentId): Student =>
  ROSTER.find((s) => s.id === id) ?? STUDENT;

export const getAdviser = (): Adviser => ADVISER;

export const getRoster = (): Student[] => ROSTER;

export const getOpportunities = (): Opportunity[] => OPPORTUNITIES;

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
