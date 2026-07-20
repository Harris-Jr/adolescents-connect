import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Flag, Megaphone, Plus, Users, X } from "lucide-react";
import { toast } from "sonner";
import { StatCard, Panel } from "@/components/AdminLayout";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

const TABS = [
  { id: "applications", label: "Applications" },
  { id: "missions", label: "Missions" },
  { id: "reports", label: "Reports" },
];

const appPill = {
  PENDING: "bg-surface-yellow text-brand-yellow",
  APPROVED: "bg-surface-mint text-brand-teal",
  REJECTED: "bg-muted text-muted-foreground",
  INACTIVE: "bg-muted text-muted-foreground",
};

function AdminAmbassadors() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [missions, setMissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMission, setNewMission] = useState({ title: "", description: "", points: "50" });
  const [creating, setCreating] = useState(false);

  const authHeaders = () => ({ Authorization: `Bearer ${getAccessToken()}` });

  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated || !["admin", "programme_admin"].includes(user?.role ?? ""))
    ) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, user?.role]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [appsRes, missionsRes, reportsRes] = await Promise.all([
        fetch(`${API_URL}/ambassadors/applications`, { headers: authHeaders() }),
        fetch(`${API_URL}/ambassadors/missions`, { headers: authHeaders() }),
        fetch(`${API_URL}/ambassadors/reports`, { headers: authHeaders() }),
      ]);
      if (!appsRes.ok || !missionsRes.ok || !reportsRes.ok) throw new Error();
      setApplications((await appsRes.json()).applications ?? []);
      setMissions((await missionsRes.json()).missions ?? []);
      setReports((await reportsRes.json()).reports ?? []);
    } catch {
      setError("Failed to load ambassador data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated || !["admin", "programme_admin"].includes(user?.role ?? "")) {
    return <div className="min-h-screen animate-pulse bg-muted" aria-label="Checking access" />;
  }

  const reviewApplication = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/ambassadors/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApplications((current) =>
        current.map((a) => (a.id === id ? { ...a, status: data.ambassador.status } : a)),
      );
      toast.success(`Application ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "deactivated"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update application");
    }
  };

  const createMission = async () => {
    if (!newMission.title.trim() || !newMission.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/ambassadors/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(newMission),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMissions((current) => [data.mission, ...current]);
      setNewMission({ title: "", description: "", points: "50" });
      toast.success("Mission created");
    } catch (err) {
      toast.error(err.message || "Failed to create mission");
    } finally {
      setCreating(false);
    }
  };

  const toggleMission = async (mission) => {
    try {
      const res = await fetch(`${API_URL}/ambassadors/missions/${mission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ isActive: !mission.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMissions((current) => current.map((m) => (m.id === mission.id ? data.mission : m)));
      toast.success(data.mission.isActive ? "Mission activated" : "Mission deactivated");
    } catch (err) {
      toast.error(err.message || "Failed to update mission");
    }
  };

  const reviewReport = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/ambassadors/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReports((current) =>
        current.map((r) =>
          r.id === id
            ? { ...r, status: data.report.status, pointsAwarded: data.report.pointsAwarded }
            : r,
        ),
      );
      toast.success(action === "verify" ? "Report verified" : "Report rejected");
    } catch (err) {
      toast.error(err.message || "Failed to review report");
    }
  };

  const pendingApps = applications.filter((a) => a.status === "PENDING").length;
  const activeAmbassadors = applications.filter((a) => a.status === "APPROVED").length;
  const pendingReports = reports.filter((r) => r.status === "SUBMITTED").length;

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30";

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <Link
        to="/dashboard/admin"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Programme Admin
      </Link>

      <div className="mt-3">
        <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">Ambassador Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recruitment, leadership missions and community activity verification.
        </p>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 text-center font-bold text-brand-pink">{error}</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard label="Active Ambassadors" value={String(activeAmbassadors)} icon={Megaphone} />
            <StatCard
              label="Pending Applications"
              value={String(pendingApps)}
              icon={Users}
              surface="bg-surface-yellow"
              color="text-brand-yellow"
            />
            <StatCard
              label="Reports Awaiting Review"
              value={String(pendingReports)}
              icon={Flag}
              surface="bg-surface-blue"
              color="text-brand-blue"
            />
          </div>

          <div className="mt-6 flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={
                  "rounded-xl px-4 py-2 text-sm font-bold transition " +
                  (tab === t.id
                    ? "bg-brand-navy text-white"
                    : "border border-border text-foreground hover:bg-muted")
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
          {tab === "applications" && (
            <Panel title="Ambassador Applications">
              {applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {applications.map((a) => (
                    <div key={a.id} className="rounded-2xl bg-muted p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-brand-navy">
                            {a.user.firstName} {a.user.lastName}
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              {[a.user.schoolName, a.user.district, a.user.province]
                                .filter(Boolean)
                                .join(" · ") || "No school on record"}
                              {a.user.grade ? ` · Grade ${a.user.grade}` : ""}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Applied {new Date(a.appliedAt).toLocaleDateString()} · {a._count.reports}{" "}
                            report(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${appPill[a.status]}`}>
                            {a.status}
                          </span>
                          {a.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                onClick={() => reviewApplication(a.id, "approve")}
                                className="inline-flex items-center gap-1 rounded-lg bg-brand-teal px-3 py-1.5 text-xs font-bold text-white"
                              >
                                <Check className="h-3 w-3" /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => reviewApplication(a.id, "reject")}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-background"
                              >
                                <X className="h-3 w-3" /> Reject
                              </button>
                            </>
                          )}
                          {a.status === "APPROVED" && (
                            <button
                              type="button"
                              onClick={() => reviewApplication(a.id, "deactivate")}
                              className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-background"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 rounded-xl bg-background p-3 text-sm text-foreground">
                        {a.motivation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {tab === "missions" && (
            <Panel title="Leadership Missions">
              <div className="mb-5 grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-[2fr_3fr_auto_auto]">
                <input
                  value={newMission.title}
                  onChange={(e) => setNewMission((c) => ({ ...c, title: e.target.value }))}
                  placeholder="Mission title"
                  className={inputClass}
                />
                <input
                  value={newMission.description}
                  onChange={(e) => setNewMission((c) => ({ ...c, description: e.target.value }))}
                  placeholder="Description"
                  className={inputClass}
                />
                <input
                  type="number"
                  min="0"
                  value={newMission.points}
                  onChange={(e) => setNewMission((c) => ({ ...c, points: e.target.value }))}
                  placeholder="Points"
                  className={`${inputClass} w-24`}
                />
                <button
                  type="button"
                  onClick={createMission}
                  disabled={creating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
              {missions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No missions yet — create the first one above.</p>
              ) : (
                <div className="space-y-3">
                  {missions.map((m) => (
                    <div
                      key={m.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-brand-navy">
                          {m.title}
                          <span className="ml-2 rounded-full bg-surface-lavender px-2 py-0.5 text-xs font-bold text-brand-purple">
                            {m.points} pts
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">{m.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleMission(m)}
                        className={
                          "rounded-lg px-3 py-1.5 text-xs font-bold " +
                          (m.isActive
                            ? "bg-surface-mint text-brand-teal"
                            : "border border-border text-muted-foreground hover:bg-background")
                        }
                      >
                        {m.isActive ? "Active — click to deactivate" : "Inactive — click to activate"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {tab === "reports" && (
            <Panel title="Activity Reports">
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reports submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <div key={r.id} className="rounded-2xl bg-muted p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-brand-navy">{r.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.ambassador.user.firstName} {r.ambassador.user.lastName}
                            {r.ambassador.user.schoolName ? ` · ${r.ambassador.user.schoolName}` : ""} ·{" "}
                            {r.mission ? `Mission: ${r.mission.title} (${r.mission.points} pts)` : "Community activity"} ·{" "}
                            {new Date(r.activityDate).toLocaleDateString()}
                            {r.participants ? ` · ${r.participants} reached` : ""}
                            {r.location ? ` · ${r.location}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.status === "SUBMITTED" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => reviewReport(r.id, "verify")}
                                className="inline-flex items-center gap-1 rounded-lg bg-brand-teal px-3 py-1.5 text-xs font-bold text-white"
                              >
                                <Check className="h-3 w-3" /> Verify
                              </button>
                              <button
                                type="button"
                                onClick={() => reviewReport(r.id, "reject")}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-background"
                              >
                                <X className="h-3 w-3" /> Reject
                              </button>
                            </>
                          ) : (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                r.status === "VERIFIED"
                                  ? "bg-surface-mint text-brand-teal"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {r.status === "VERIFIED" ? `Verified · +${r.pointsAwarded} pts` : "Rejected"}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 rounded-xl bg-background p-3 text-sm text-foreground">
                        {r.description}
                      </p>
                      {r.evidenceUrl && (
                        <a
                          href={r.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs font-bold text-brand-purple hover:underline"
                        >
                          View photo evidence →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}
          </div>
        </>
      )}
    </main>
  );
}
export default AdminAmbassadors;
