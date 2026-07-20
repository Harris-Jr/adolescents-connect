import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  FileText,
  FileSpreadsheet,
  Target,
  Users,
  BookOpen,
  Trophy,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { StatCard, Panel } from "@/components/AdminLayout";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

const PIE_COLORS = [
  "var(--brand-purple)",
  "var(--brand-pink)",
  "var(--brand-teal)",
  "var(--brand-blue)",
  "var(--brand-yellow)",
  "var(--brand-navy)",
  "var(--muted-foreground)",
];

function Mande() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState("");

  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated || !["admin", "programme_admin"].includes(user?.role ?? ""))
    ) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, user?.role]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const tok = getAccessToken();
        const res = await fetch(`${API_URL}/mande?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${tok}` },
        });
        if (!res.ok) throw new Error("Failed to load M&E data");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("Failed to load M&E data. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [from, to, isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated || !["admin", "programme_admin"].includes(user?.role ?? "")) {
    return <div className="min-h-screen animate-pulse bg-muted" aria-label="Checking access" />;
  }

  const exportReport = async (format) => {
    setExporting(format);
    try {
      const tok = getAccessToken();
      const res = await fetch(`${API_URL}/mande/export?format=${format}&from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `alinks-mande-report.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} report downloaded`);
    } catch {
      toast.error("Failed to export report");
    } finally {
      setExporting("");
    }
  };

  const genderData = (data?.genderBreakdown ?? []).map((g) => ({
    name: g.gender,
    value: g.count,
  }));
  const disabilityData = (data?.disabilityBreakdown ?? []).map((d) => ({
    name: d.status,
    value: d.count,
  }));

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <Link
        to="/dashboard/admin"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Programme Admin
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">M&amp;E Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitoring &amp; Evaluation — targets, participation and impact.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-bold text-foreground">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-foreground">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
            />
          </label>
          <button
            type="button"
            onClick={() => exportReport("csv")}
            disabled={Boolean(exporting)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> {exporting === "csv" ? "Exporting…" : "CSV"}
          </button>
          <button
            type="button"
            onClick={() => exportReport("xlsx")}
            disabled={Boolean(exporting)}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" /> {exporting === "xlsx" ? "Exporting…" : "Excel"}
          </button>
          <button
            type="button"
            onClick={() => exportReport("pdf")}
            disabled={Boolean(exporting)}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground disabled:opacity-50"
          >
            <FileText className="h-4 w-4" /> {exporting === "pdf" ? "Exporting…" : "PDF"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 text-center font-bold text-brand-pink">{error}</p>
      ) : data ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total Learners"
              value={String(data.totals.learners)}
              icon={Target}
            />
            <StatCard
              label="Participation Rate"
              value={`${data.totals.participationRate}%`}
              icon={Users}
              surface="bg-surface-mint"
              color="text-brand-teal"
            />
            <StatCard
              label="Avg Quiz Score"
              value={`${data.totals.avgQuizScore}%`}
              icon={BookOpen}
              surface="bg-surface-blue"
              color="text-brand-blue"
            />
            <StatCard
              label="Club Joins"
              value={String(data.totals.clubJoins)}
              icon={Trophy}
              surface="bg-surface-yellow"
              color="text-brand-yellow"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Registrations by Month">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.registrationsByMonth}
                    margin={{ left: -16, right: 8, top: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name="Registrations" fill="var(--brand-purple)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Participation Rate by Province">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.participationByProvince}
                    margin={{ left: -16, right: 8, top: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="province"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="rate" name="Participation %" fill="var(--brand-teal)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Quiz Performance (Avg Score)">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.quizPerformance}
                    layout="vertical"
                    margin={{ left: 24, right: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="quiz" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip />
                    <Bar dataKey="avgScore" name="Avg Score %" fill="var(--brand-pink)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Gender Breakdown">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Disability Inclusion">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={disabilityData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {disabilityData.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Ambassador Activities">
              <div className="grid h-64 grid-cols-2 content-center gap-4">
                {[
                  { label: "Active ambassadors", value: data.ambassadorActivity.activeAmbassadors },
                  { label: "Pending applications", value: data.ambassadorActivity.pendingApplications },
                  { label: "Reports submitted", value: data.ambassadorActivity.reportsSubmitted },
                  { label: "Reports verified", value: data.ambassadorActivity.reportsVerified },
                  { label: "Adolescents reached", value: data.ambassadorActivity.adolescentsReached },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-muted p-4 text-center">
                    <p className="text-2xl font-extrabold text-brand-navy">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Club Joins by Month">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.clubJoinsByMonth} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Joins"
                      stroke="var(--brand-yellow)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </>
      ) : null}
    </main>
  );
}
export default Mande;
