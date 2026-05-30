import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { getStudent, studentTotals, useStore } from "@/lib/mock-data";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports — SERVELOG" }] }),
  component: Reports,
});

function Reports() {
  const subs = useStore((s) => s.submissions);
  const student = getStudent();
  const { approved } = studentTotals(student.id);
  const approvedSubs = subs.filter((s) => s.studentId === student.id && s.status === "approved");
  const today = new Date();

  return (
    <>
      <AppHeader
        title="Hours Summary Report"
        subtitle="Ready for registrar submission"
        right={
          <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
        }
      />
      <article className="mx-5 my-5 rounded-2xl border border-border bg-card p-6 text-sm">
        <header className="border-b border-border pb-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">New Era University</p>
          <h2 className="mt-1 text-base font-semibold">Community Service Hours Summary</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">Generated {today.toLocaleDateString()}</p>
        </header>

        <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
          <Row k="Student" v={student.name} />
          <Row k="Student No." v={student.studentNo} />
          <Row k="Course" v={student.course} />
          <Row k="Violation" v={student.violation} />
          <Row k="Required" v={`${student.requiredHours} hours`} />
          <Row k="Completed" v={`${approved} hours`} />
        </dl>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verified Activities</h3>
        <table className="mt-2 w-full text-[11px]">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr><th className="py-1.5 font-medium">Date</th><th className="font-medium">Activity</th><th className="text-right font-medium">Hrs</th></tr>
          </thead>
          <tbody>
            {approvedSubs.map((s) => (
              <tr key={s.id} className="border-b border-border/50">
                <td className="py-2 align-top">{new Date(s.date).toLocaleDateString()}</td>
                <td className="py-2 align-top">
                  <p className="font-medium text-foreground">{s.title}</p>
                  <p className="text-muted-foreground">{s.organizer} · {s.location}</p>
                </td>
                <td className="py-2 text-right align-top">{s.hours}</td>
              </tr>
            ))}
            {approvedSubs.length === 0 && (
              <tr><td colSpan={3} className="py-3 text-center text-muted-foreground">No verified activities yet.</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr><td colSpan={2} className="pt-3 text-right font-medium">Total approved hours</td><td className="pt-3 text-right font-semibold">{approved}</td></tr>
          </tfoot>
        </table>

        <div className="mt-10 grid grid-cols-2 gap-6 text-[11px]">
          <div>
            <div className="border-t border-border pt-1.5 text-center">Student Signature</div>
          </div>
          <div>
            <div className="border-t border-border pt-1.5 text-center">OSD Signature</div>
          </div>
        </div>
      </article>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </>
  );
}
