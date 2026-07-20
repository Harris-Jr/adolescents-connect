import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  Clock,
  Flag,
  MapPin,
  Megaphone,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

const statusPill = {
  SUBMITTED: "bg-surface-yellow text-brand-yellow",
  VERIFIED: "bg-surface-mint text-brand-teal",
  REJECTED: "bg-muted text-muted-foreground",
};

function Ambassador() {
  const { isAuthenticated } = useAuth();
  const [ambassador, setAmbassador] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [motivation, setMotivation] = useState("");
  const [applying, setApplying] = useState(false);
  const [report, setReport] = useState({
    missionId: "",
    title: "",
    description: "",
    activityDate: "",
    location: "",
    participants: "",
    evidenceUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const authHeaders = () => ({ Authorization: `Bearer ${getAccessToken()}` });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [meRes, missionsRes] = await Promise.all([
        fetch(`${API_URL}/ambassadors/me`, { headers: authHeaders() }),
        fetch(`${API_URL}/ambassadors/missions`, { headers: authHeaders() }),
      ]);
      if (!meRes.ok || !missionsRes.ok) throw new Error("load failed");
      const me = await meRes.json();
      const ms = await missionsRes.json();
      setAmbassador(me.ambassador);
      setMissions(ms.missions ?? []);
    } catch {
      setError("Failed to load the Ambassador Hub. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const apply = async () => {
    if (!motivation.trim()) {
      toast.error("Please tell us why you want to be an ambassador");
      return;
    }
    setApplying(true);
    try {
      const res = await fetch(`${API_URL}/ambassadors/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ motivation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAmbassador(data.ambassador);
      setMotivation("");
      toast.success("Application submitted! We'll review it soon.");
    } catch (err) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const uploadEvidence = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_URL}/upload/material`, {
        method: "POST",
        headers: authHeaders(),
        body: fd,
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setReport((current) => ({ ...current, evidenceUrl: url }));
      toast.success("Photo attached");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const submitReport = async () => {
    if (!report.title.trim() || !report.description.trim() || !report.activityDate) {
      toast.error("Title, description and activity date are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/ambassadors/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...report, missionId: report.missionId || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAmbassador((current) => ({ ...current, reports: [data.report, ...(current.reports ?? [])] }));
      setReport({
        missionId: "", title: "", description: "", activityDate: "",
        location: "", participants: "", evidenceUrl: "",
      });
      toast.success("Report submitted for verification");
    } catch (err) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30";

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-40 animate-pulse rounded-3xl bg-muted" />
          <div className="h-40 animate-pulse rounded-3xl bg-muted" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="font-bold text-brand-pink">{error}</p>
        <button
          type="button"
          onClick={load}
          className="mt-4 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Try again
        </button>
      </main>
    );
  }

  const status = ambassador?.status;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        to="/clubs"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:underline"
      >
        <ChevronLeft className="h-4 w-4" /> Clubs &amp; Leadership
      </Link>

      <div className="mt-3 rounded-3xl bg-gradient-to-r from-brand-purple to-brand-pink p-8 text-white">
        <div className="flex items-center gap-3">
          <Megaphone className="h-8 w-8" />
          <h1 className="text-3xl font-extrabold">Adolescent Ambassador Hub</h1>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-white/90">
          Ambassadors lead change in their schools and communities — running leadership
          missions, organising community activities and inspiring other adolescents.
        </p>
      </div>

      {/* Not yet applied, or re-applying after rejection/deactivation */}
      {(!ambassador || status === "REJECTED" || status === "INACTIVE") && (
        <section className="mt-6 rounded-3xl bg-card p-7 shadow-sm">
          {status === "REJECTED" && (
            <p className="mb-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              Your previous application was not approved. You're welcome to apply again.
            </p>
          )}
          {status === "INACTIVE" && (
            <p className="mb-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              Your ambassador role is currently inactive. You can re-apply below.
            </p>
          )}
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-brand-navy">
            <Sparkles className="h-5 w-5 text-brand-purple" /> Become an Ambassador
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us why you'd make a great ambassador — your leadership experience, ideas for
            your community, or what change you want to see.
          </p>
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            rows={5}
            placeholder="I want to be an ambassador because…"
            className={`mt-4 ${inputClass}`}
          />
          <button
            type="button"
            onClick={apply}
            disabled={applying}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {applying ? "Submitting…" : "Submit Application"}
          </button>
        </section>
      )}

      {status === "PENDING" && (
        <section className="mt-6 rounded-3xl bg-card p-7 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-yellow text-brand-yellow">
            <Clock className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-extrabold text-brand-navy">Application under review</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Thanks for applying! A programme administrator is reviewing your application —
            you'll get a notification as soon as there's a decision.
          </p>
        </section>
      )}

      {status === "APPROVED" && (
        <>
          <section className="mt-6 flex items-center gap-4 rounded-3xl bg-card p-6 shadow-sm">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-mint text-brand-teal">
              <Award className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-brand-navy">You're an Ambassador! 🎉</h2>
              <p className="text-sm text-muted-foreground">
                Complete leadership missions and report your community activities below.
                Verified reports earn points on the leaderboard.
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-3xl bg-card p-7 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-brand-navy">
              <Flag className="h-5 w-5 text-brand-purple" /> Leadership Missions
            </h2>
            {missions.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No active missions right now — check back soon, or report a general community
                activity below.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {missions.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-brand-navy">{m.title}</h3>
                      <span className="shrink-0 rounded-full bg-surface-lavender px-2.5 py-1 text-xs font-bold text-brand-purple">
                        {m.points} pts
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{m.description}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setReport((current) => ({ ...current, missionId: m.id }));
                        document.getElementById("report-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-3 text-sm font-bold text-brand-purple hover:underline"
                    >
                      Report this mission →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="report-form" className="mt-6 rounded-3xl bg-card p-7 shadow-sm">
            <h2 className="text-xl font-extrabold text-brand-navy">Report an Activity</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground sm:col-span-2">
                Mission (optional — leave blank for a general community activity)
                <select
                  value={report.missionId}
                  onChange={(e) => setReport((c) => ({ ...c, missionId: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">General community activity</option>
                  {missions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.points} pts)
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground sm:col-span-2">
                Activity title
                <input
                  value={report.title}
                  onChange={(e) => setReport((c) => ({ ...c, title: e.target.value }))}
                  placeholder="e.g. Digital safety talk at assembly"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground sm:col-span-2">
                What happened?
                <textarea
                  value={report.description}
                  onChange={(e) => setReport((c) => ({ ...c, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the activity, who took part and what you achieved"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Activity date</span>
                <input
                  type="date"
                  value={report.activityDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setReport((c) => ({ ...c, activityDate: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> Adolescents reached</span>
                <input
                  type="number"
                  min="0"
                  value={report.participants}
                  onChange={(e) => setReport((c) => ({ ...c, participants: e.target.value }))}
                  placeholder="e.g. 40"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location (optional)</span>
                <input
                  value={report.location}
                  onChange={(e) => setReport((c) => ({ ...c, location: e.target.value }))}
                  placeholder="e.g. School hall"
                  className={inputClass}
                />
              </label>
              <div className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                Photo evidence (optional)
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold hover:bg-muted">
                  <Camera className="h-4 w-4" />
                  {uploading ? "Uploading…" : report.evidenceUrl ? "Photo attached ✓" : "Upload a photo"}
                  <input type="file" accept="image/*" onChange={uploadEvidence} className="sr-only" />
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={submitReport}
              disabled={submitting || uploading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit Report"}
            </button>
          </section>

          <section className="mt-6 rounded-3xl bg-card p-7 shadow-sm">
            <h2 className="text-xl font-extrabold text-brand-navy">My Reports</h2>
            {(ambassador.reports ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No reports yet — your submitted activities will appear here.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {ambassador.reports.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-brand-navy">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.mission ? `Mission: ${r.mission.title}` : "Community activity"} ·{" "}
                        {new Date(r.activityDate).toLocaleDateString()}
                        {r.participants ? ` · ${r.participants} reached` : ""}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${statusPill[r.status] ?? "bg-muted"}`}
                    >
                      {r.status === "VERIFIED" && <Check className="h-3 w-3" />}
                      {r.status === "VERIFIED"
                        ? `Verified · +${r.pointsAwarded} pts`
                        : r.status === "SUBMITTED"
                          ? "Under review"
                          : "Not verified"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
export default Ambassador;
