import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Trophy,
  FileText,
  Settings,
  Download,
  CheckCircle2,
} from "lucide-react";
import { AdminLayout, StatCard, Panel } from "@/components/AdminLayout";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SchoolProfileSettings } from "@/components/settings/SchoolProfileSettings";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "learners", label: "Learners", icon: GraduationCap },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "clubs", label: "Clubs", icon: Trophy },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const GRADES = [5, 6, 7, 8, 9, 10, 11, 12];

const statusPill = {
  active: "bg-surface-mint text-brand-teal",
  inactive: "bg-muted text-muted-foreground",
  pending: "bg-surface-yellow text-brand-navy",
};

function SchoolDashboard() {
  const { user } = useAuth();
  const schoolName = user?.schoolName ?? "Your School";
  const [active, setActive] = useState("overview");
  const [grade, setGrade] = useState("all");
  const [learners, setLearners] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const tok = getAccessToken();
    const h = { Authorization: `Bearer ${tok}` };
    const get = (p) =>
      fetch(`${API_URL}${p}`, { headers: h }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`Failed to load: ${p}`)),
      );
    setIsLoading(true);
    setLoadError(null);
    Promise.all([
      get("/school/learners"),
      get("/school/teachers"),
      get("/school/clubs"),
      get("/school/stats"),
    ])
      .then(([ld, td, cd, sd]) => {
        if (!mounted) return;
        setLearners(ld.learners ?? []);
        setTeachers(td.teachers ?? []);
        setClubs(cd.clubs ?? []);
        setStats(sd);
      })
      .catch((err) => {
        if (mounted) setLoadError(err.message || "Failed to load school data");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredLearners = useMemo(
    () => learners.filter((l) => grade === "all" || l.grade === grade),
    [learners, grade],
  );

  const totalLearners = stats?.totalLearners ?? learners.length;
  const activeTeachersCount =
    stats?.activeTeachers ?? teachers.filter((t) => t.status === "active").length;
  const totalClubs = stats?.totalClubs ?? clubs.length;
  const avgCompletion =
    stats?.avgCompletion ??
    (learners.length > 0
      ? Math.round(learners.reduce((s, l) => s + (l.completion ?? 0), 0) / learners.length)
      : 0);

  const generateReport = () => {
    if (learners.length === 0) {
      toast.error("No learner data to export yet");
      return;
    }
    const rows = [
      ["Name", "Grade", "Gender", "Status", "Completion %"],
      ...learners.map((l) => [
        l.name ?? `${l.firstName ?? ""} ${l.lastName ?? ""}`.trim(),
        String(l.grade ?? ""),
        l.gender ?? "",
        l.status ?? "",
        String(l.completion ?? ""),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "school-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const skeleton = <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  const errorBox = (
    <div className="rounded-2xl bg-card p-8 text-center text-sm text-brand-pink shadow-sm">
      {loadError}
    </div>
  );
  const statSkeleton = <div className="h-24 animate-pulse rounded-2xl bg-muted" />;

  const learnerTable = (
    <Panel
      title="Learners"
      action={
        <select
          value={grade}
          onChange={(e) =>
            setGrade(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">All grades</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
      }
    >
      {isLoading ? (
        skeleton
      ) : loadError ? (
        errorBox
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4 font-bold">Name</th>
                <th className="py-2 pr-4 font-bold">Grade</th>
                <th className="py-2 pr-4 font-bold">Gender</th>
                <th className="py-2 pr-4 font-bold">Completion</th>
                <th className="py-2 pr-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLearners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="border-0 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <GraduationCap className="mb-3 h-12 w-12 text-muted-foreground/40" />
                      <p className="text-sm font-semibold text-muted-foreground">
                        No learners enrolled at this school yet
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Enrolled learners will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLearners.map((l) => (
                  <tr key={l.id} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 font-semibold text-brand-navy">
                      {l.name ?? `${l.firstName ?? ""} ${l.lastName ?? ""}`.trim()}
                    </td>
                    <td className="py-2.5 pr-4">Grade {l.grade}</td>
                    <td className="py-2.5 pr-4">{l.gender}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-brand-purple"
                            style={{ width: `${l.completion ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{l.completion ?? 0}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusPill[l.status] ?? statusPill.inactive}`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );

  const teacherList = (
    <Panel title="Teachers">
      {isLoading ? (
        skeleton
      ) : loadError ? (
        errorBox
      ) : teachers.length === 0 ? (
        <div className="py-8 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-semibold text-muted-foreground">No teachers added yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Teachers will appear here once they are assigned to this school
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {teachers.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-semibold text-brand-navy">
                  {t.name ?? `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Array.isArray(t.subjects) ? t.subjects.join(", ") : (t.subject ?? "—")}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusPill[t.status] ?? statusPill.inactive}`}
              >
                {t.status ?? "inactive"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );

  const clubSummary = (
    <Panel title="Club Activity">
      {isLoading ? (
        skeleton
      ) : loadError ? (
        errorBox
      ) : clubs.length === 0 ? (
        <div className="rounded-xl border border-border bg-background p-8 text-center">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-semibold text-muted-foreground">No club activity yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clubs created by teachers will appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-bold text-brand-navy">{c.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.category}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-purple">
                  {c.members ?? c._count?.members ?? 0} members
                </span>
                <span className="text-muted-foreground">{c.lastActivity ?? "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );

  return (
    <AdminLayout
      brand="School Admin"
      subtitle={schoolName}
      items={NAV}
      active={active}
      onSelect={setActive}
    >
      {active === "overview" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-brand-purple to-brand-pink p-6 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-white/80">
              School Dashboard
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">{schoolName}</h2>
            <p className="mt-1 text-sm text-white/80">Lusaka District · Lusaka Province</p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {isLoading ? (
              <>
                {statSkeleton}
                {statSkeleton}
                {statSkeleton}
                {statSkeleton}
              </>
            ) : (
              <>
                <StatCard label="Total Learners" value={totalLearners} icon={GraduationCap} />
                <StatCard
                  label="Active Teachers"
                  value={activeTeachersCount}
                  icon={Users}
                  surface="bg-surface-mint"
                  color="text-brand-teal"
                />
                <StatCard
                  label="Clubs"
                  value={totalClubs}
                  icon={Trophy}
                  surface="bg-surface-yellow"
                  color="text-brand-yellow"
                />
                <StatCard
                  label="Completion Rate"
                  value={`${avgCompletion}%`}
                  icon={CheckCircle2}
                  surface="bg-surface-blue"
                  color="text-brand-blue"
                />
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={generateReport}
              disabled={isLoading || learners.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              Generate School Report
            </button>
          </div>

          {learnerTable}
          <div className="grid gap-6 lg:grid-cols-2">
            {teacherList}
            {clubSummary}
          </div>
        </div>
      )}

      {active === "learners" && <div className="space-y-6">{learnerTable}</div>}
      {active === "teachers" && <div className="space-y-6">{teacherList}</div>}
      {active === "clubs" && <div className="space-y-6">{clubSummary}</div>}

      {active === "reports" && (
        <Panel title="Reports">
          <p className="text-sm text-muted-foreground">
            Download a complete learner progress report for {schoolName}.
          </p>
          <button
            type="button"
            onClick={generateReport}
            disabled={isLoading || learners.length === 0}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            Generate School Report (CSV)
          </button>
          {!isLoading && learners.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              No learner data available to export yet.
            </p>
          )}
        </Panel>
      )}

      {active === "settings" && (
        <div className="space-y-6">
          <SchoolProfileSettings />
          <AccountSettings />
        </div>
      )}
    </AdminLayout>
  );
}

export default SchoolDashboard;
