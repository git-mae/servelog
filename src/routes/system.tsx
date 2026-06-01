import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Workflow, GitBranch, Database, Map } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Mermaid } from "@/components/Mermaid";

export const Route = createFileRoute("/system")({
  head: () => ({
    meta: [
      { title: "System Design — SERVELOG" },
      { name: "description", content: "Architecture, workflow, sequence and ERD diagrams for SERVELOG." },
    ],
  }),
  component: SystemDesign,
});

const workflow = `flowchart TD
  A([Admin records violation]) --> B[Student record created<br/>required hours assigned]
  B --> C{{Notification:<br/>violation logged}}
  A2([Admin posts opportunity]) --> D[Opportunity published]
  D --> E{{Notification:<br/>upcoming service}}
  C --> F[Student browses opportunities]
  E --> F
  F --> G([Student logs activity<br/>with proof])
  G --> H[Submission pending]
  H --> I{{Notification:<br/>new submission}}
  I --> J([Admin reviews submission])
  J -->|Approve| K[Hours credited]
  J -->|Reject| L[Reviewer comment sent]
  L --> G
  K --> M{Approved >= required?}
  M -->|No| F
  M -->|Yes| N{{Notification:<br/>ready for clearance}}
  N --> O([Admin issues clearance])
  O --> P([Student cleared])`;

const sequence = `sequenceDiagram
  autonumber
  actor S as Student
  actor A as Admin (OSD)
  participant UI as SERVELOG App
  participant ST as Store
  participant N as Notifications

  A->>UI: Post opportunity
  UI->>ST: addOpportunity()
  ST->>N: push(upcoming)
  N-->>S: Toast + bell

  S->>UI: Submit activity + proof
  UI->>ST: addSubmission()
  ST->>ST: dedupe check (date+place)
  ST->>N: push(submitted)
  N-->>A: Toast + bell

  A->>UI: Open review
  A->>UI: Approve / Reject
  UI->>ST: decide()
  ST->>N: push(approved|rejected)
  N-->>S: Toast + bell

  alt totals >= required
    ST->>N: push(ready-clearance)
    N-->>A: Toast + bell
    A->>UI: Issue clearance
    UI->>ST: clearStudent()
    ST->>N: push(cleared)
    N-->>S: Toast + bell
  end`;

const erd = `erDiagram
  STUDENT ||--o{ SUBMISSION : "logs"
  STUDENT ||--o{ VIOLATION : "incurs"
  STUDENT ||--o| CLEARANCE : "receives"
  STUDENT ||--o{ NOTIFICATION : "receives"
  ADMIN  ||--o{ OPPORTUNITY : "posts"
  ADMIN  ||--o{ SUBMISSION  : "reviews"
  ADMIN  ||--o{ CLEARANCE   : "issues"
  ADMIN  ||--o{ NOTIFICATION : "receives"
  OPPORTUNITY ||--o{ SUBMISSION : "fulfilled by"

  STUDENT {
    string id PK
    string studentNo
    string name
    string course
    string email
    int requiredHours
  }
  ADMIN {
    string id PK
    string name
    string email
    string office
  }
  VIOLATION {
    string id PK
    string studentId FK
    string description
    int requiredHours
    datetime createdAt
  }
  OPPORTUNITY {
    string id PK
    string title
    string organizer
    date date
    string location
    int hours
    string tag
  }
  SUBMISSION {
    string id PK
    string studentId FK
    string opportunityId FK
    string title
    string location
    date date
    int hours
    string status
    string reviewerComment
    bool flagged
    string proofDataUrl
    datetime createdAt
  }
  CLEARANCE {
    string id PK
    string studentId FK
    string adminId FK
    string note
    datetime clearedAt
  }
  NOTIFICATION {
    string id PK
    string recipientRole
    string recipientId
    string kind
    string title
    string body
    bool read
    datetime createdAt
  }`;

const routes = `flowchart LR
  R([/]) --> L([/login])
  R --> ST[Student]
  R --> AD[Admin]
  ST --> SH([/app/home])
  ST --> SL([/app/log])
  ST --> SHi([/app/history])
  ST --> SR([/app/reports])
  ST --> SP([/app/profile])
  AD --> AQ([/admin/queue])
  AQ --> AR([/admin/review/$id])
  AD --> AV([/admin/verified])
  AD --> AS([/admin/students])
  AD --> AO([/admin/opportunities])
  AD --> AVi([/admin/violations])
  AD --> AC([/admin/clearance])
  AD --> AP([/admin/profile])`;

function SystemDesign() {
  return (
    <PhoneFrame>
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">System Design</h1>
          <p className="text-[11px] text-muted-foreground">Architecture · Workflow · ERD</p>
        </div>
      </header>

      <main className="space-y-6 px-5 py-6">
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Overview</p>
          <h2 className="mt-1 text-lg font-semibold">SERVELOG</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A mobile-first community service tracker for New Era University. Two roles
            (Student and Office of Student Discipline) collaborate over a single workflow:
            violation → service logging → verification → clearance.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <Spec k="Frame" v="480 × 100vh (mobile-first)" />
            <Spec k="Header" v="64 px sticky" />
            <Spec k="Bottom nav" v="64 px fixed" />
            <Spec k="Breakpoint" v="md @ 768 px" />
          </dl>
        </section>

        <Block icon={<Map className="h-4 w-4" />} title="Routing map" chart={routes} />
        <Block icon={<Workflow className="h-4 w-4" />} title="End-to-end workflow" chart={workflow} />
        <Block icon={<GitBranch className="h-4 w-4" />} title="Sequence: submission → clearance" chart={sequence} />
        <Block icon={<Database className="h-4 w-4" />} title="Entity Relationship Diagram" chart={erd} />

        <p className="pb-2 text-center text-[11px] text-muted-foreground">
          Diagrams render with Mermaid · screenshot any section for your paper.
        </p>
      </main>
    </PhoneFrame>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{v}</dd>
    </div>
  );
}

function Block({ icon, title, chart }: { icon: React.ReactNode; title: string; chart: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary text-primary">{icon}</span>
        {title}
      </div>
      <div className="rounded-xl bg-background p-3">
        <Mermaid chart={chart} />
      </div>
    </section>
  );
}
