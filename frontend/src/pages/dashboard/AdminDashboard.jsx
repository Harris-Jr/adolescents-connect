import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  School,
  ClipboardCheck,
  BarChart3,
  Bell,
  FileText,
  Settings,
  Download,
  Search,
  Plus,
  Eye,
  Check,
  X,
  Building2,
  Globe2,
  Trophy,
  GraduationCap,
  LifeBuoy,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { AdminLayout, StatCard, Panel } from "@/components/AdminLayout";
import { API_URL, apiGet, apiPatch, apiPost, apiDelete } from "@/lib/api";
import { getAccessToken } from "@/contexts/AuthContext";
import { PENDING_CONTENT, SENT_NOTIFICATIONS, PROVINCES } from "@/lib/admin-data";

// Pie slice colours by role label (presentation only)
const ROLE_COLORS = {
  Learner: "var(--brand-purple)",
  Teacher: "var(--brand-teal)",
  "School Admin": "var(--brand-blue)",
  "Programme Admin": "var(--brand-pink)",
  Admin: "var(--brand-navy)",
};
const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "schools", label: "Schools", icon: School },
  { id: "referrals", label: "Referral Services", icon: LifeBuoy },
  { id: "content", label: "Content Approval", icon: ClipboardCheck },
  { id: "mande", label: "M&E", icon: BarChart3, to: "/mande" },
  { id: "ambassadors", label: "Ambassadors", icon: Users, to: "/admin/ambassadors" },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "chat", label: "Live Chat", icon: MessageCircle },
  { id: "settings", label: "Settings", icon: Settings },
];
const statusPill = {
  active: "bg-surface-mint text-brand-teal",
  inactive: "bg-muted text-muted-foreground",
  pending: "bg-surface-yellow text-brand-navy",
};
function AdminDashboard() {
  const [active, setActive] = useState("overview");
  return (
    <AdminLayout
      brand="Programme Admin"
      subtitle="National oversight & monitoring"
      items={NAV}
      active={active}
      onSelect={setActive}
    >
      {active === "overview" && <OverviewSection />}
      {active === "users" && <UsersSection />}
      {active === "schools" && <SchoolsSection />}
      {active === "referrals" && <ReferralServicesSection />}
      {active === "content" && <ContentApprovalSection />}
      {active === "notifications" && <NotificationsSection />}
      {active === "reports" && <ReportsSection />}
      {active === "chat" && <ChatSection />}
      {active === "settings" && (
        <Panel title="Settings">
          <p className="text-sm text-muted-foreground">
            Programme configuration settings are coming soon.
          </p>
        </Panel>
      )}
    </AdminLayout>
  );
}
function OverviewSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiGet("/admin/overview")
      .then((d) => {
        if (active) setData(d);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load overview");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return <p className="text-sm font-semibold text-brand-pink">{error}</p>;
  }

  const { kpis, monthlyRegistrations, activityByProvince, usersByRole, recentRegistrations } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Users" value={kpis.totalUsers.toLocaleString()} icon={Users} />
        <StatCard
          label="Schools"
          value={kpis.schools}
          icon={Building2}
          surface="bg-surface-mint"
          color="text-brand-teal"
        />
        <StatCard
          label="Provinces"
          value={kpis.provinces}
          icon={Globe2}
          surface="bg-surface-blue"
          color="text-brand-blue"
        />
        <StatCard
          label="Active Clubs"
          value={kpis.activeClubs}
          icon={Trophy}
          surface="bg-surface-yellow"
          color="text-brand-yellow"
        />
        <StatCard
          label="Teachers Trained"
          value={kpis.teachersTrained}
          icon={GraduationCap}
          surface="bg-surface-peach"
          color="text-brand-pink"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Monthly Registrations">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRegistrations} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="var(--brand-purple)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Activity by Province">
          <div className="h-64">
            {activityByProvince.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No province data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityByProvince} margin={{ left: -16, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="province"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="activity" fill="var(--brand-teal)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Users by Role">
          <div className="h-64">
            {usersByRole.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No users yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {usersByRole.map((d) => (
                      <Cell key={d.name} fill={ROLE_COLORS[d.name] ?? "var(--brand-navy)"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Recent Registrations">
          {recentRegistrations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registrations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-4 font-bold">Name</th>
                    <th className="py-2 pr-4 font-bold">Role</th>
                    <th className="py-2 pr-4 font-bold">Province</th>
                    <th className="py-2 pr-4 font-bold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((u) => (
                    <tr key={u.id} className="border-b border-border/60">
                      <td className="py-2.5 pr-4 font-semibold text-brand-navy">{u.name}</td>
                      <td className="py-2.5 pr-4">{u.role}</td>
                      <td className="py-2.5 pr-4">{u.province}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [province, setProvince] = useState("all");
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    apiGet("/admin/users")
      .then((d) => {
        if (active) setUsers(d.users ?? []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load users");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (role !== "all" && u.role !== role) return false;
        if (province !== "all" && u.province !== province) return false;
        const q = search.trim().toLowerCase();
        if (q && !`${u.name} ${u.email}`.toLowerCase().includes(q)) return false;
        return true;
      }),
    [users, search, role, province],
  );
  const allSelected = filtered.length > 0 && filtered.every((u) => selected.includes(u.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((u) => u.id));
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const setStatus = async (status) => {
    if (selected.length === 0 || busy) return;
    setBusy(true);
    const isActive = status === "active";
    const ids = [...selected];
    try {
      const results = await Promise.allSettled(
        ids.map((id) => apiPatch(`/admin/users/${id}`, { isActive })),
      );
      const okIds = new Set();
      let failures = 0;
      results.forEach((r, i) => {
        if (r.status === "fulfilled") okIds.add(ids[i]);
        else failures += 1;
      });
      setUsers((prev) => prev.map((u) => (okIds.has(u.id) ? { ...u, status } : u)));
      setSelected([]);
      if (failures > 0) {
        toast.error(`${failures} update${failures > 1 ? "s" : ""} failed`);
      } else {
        toast.success(`${okIds.size} user${okIds.size > 1 ? "s" : ""} ${status === "active" ? "activated" : "deactivated"}`);
      }
    } finally {
      setBusy(false);
    }
  };
  const exportSelected = () => {
    const rows = users.filter((u) => selected.length === 0 || selected.includes(u.id));
    const csv = [
      ["Name", "Email", "Role", "Province", "School", "Status", "Joined"],
      ...rows.map((u) => [u.name, u.email, u.role, u.province, u.school, u.status, u.joined]),
    ]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Panel title="Users">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All roles</option>
          <option>Learner</option>
          <option>Teacher</option>
          <option>School Admin</option>
          <option>Programme Admin</option>
        </select>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All provinces</option>
          {PROVINCES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">
          {selected.length} selected
        </span>
        <button
          type="button"
          disabled={selected.length === 0 || busy}
          onClick={() => setStatus("active")}
          className="rounded-lg bg-surface-mint px-3 py-1.5 text-xs font-bold text-brand-teal disabled:opacity-40"
        >
          Activate
        </button>
        <button
          type="button"
          disabled={selected.length === 0 || busy}
          onClick={() => setStatus("inactive")}
          className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground disabled:opacity-40"
        >
          Deactivate
        </button>
        <button
          type="button"
          onClick={exportSelected}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-bold text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm font-semibold text-brand-pink">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              {users.length === 0 ? "No registered users yet" : "No users match your filters"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {users.length === 0
                ? "Users will appear here once they sign up"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                <th className="py-2 pr-4 font-bold">Name</th>
                <th className="py-2 pr-4 font-bold">Email</th>
                <th className="py-2 pr-4 font-bold">Role</th>
                <th className="py-2 pr-4 font-bold">Province</th>
                <th className="py-2 pr-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/60">
                  <td className="py-2.5 pr-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(u.id)}
                      onChange={() => toggleOne(u.id)}
                    />
                  </td>
                  <td className="py-2.5 pr-4 font-semibold text-brand-navy">{u.name}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{u.email}</td>
                  <td className="py-2.5 pr-4">{u.role}</td>
                  <td className="py-2.5 pr-4">{u.province}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusPill[u.status]}`}
                    >
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Panel>
  );
}
function SchoolsSection() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ name: "", district: "", province: "Lusaka" });

  useEffect(() => {
    let active = true;
    apiGet("/admin/schools")
      .then((d) => {
        if (active) setSchools(d.schools ?? []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load schools");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addSchool = async () => {
    if (!draft.name.trim() || !draft.district.trim() || saving) return;
    setSaving(true);
    try {
      const { school } = await apiPost("/admin/schools", {
        name: draft.name.trim(),
        district: draft.district.trim(),
        province: draft.province,
      });
      setSchools((prev) => {
        // resolve-or-create may return an existing school — de-dupe by id
        if (prev.some((s) => s.id === school.id)) {
          return prev.map((s) => (s.id === school.id ? school : s));
        }
        return [...prev, school].sort((a, b) => a.name.localeCompare(b.name));
      });
      setDraft({ name: "", district: "", province: "Lusaka" });
      setShowForm(false);
      toast.success(`School "${school.name}" saved`);
    } catch (err) {
      toast.error(err.message || "Failed to save school");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Panel
      title="Schools"
      action={
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-purple px-3 py-1.5 text-xs font-bold text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Add School
        </button>
      }
    >
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-3">
          <input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="School name"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm sm:col-span-3"
          />
          <input
            value={draft.district}
            onChange={(e) => setDraft((d) => ({ ...d, district: e.target.value }))}
            placeholder="District"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
          <select
            value={draft.province}
            onChange={(e) => setDraft((d) => ({ ...d, province: e.target.value }))}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {PROVINCES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSchool}
            disabled={saving}
            className="rounded-lg bg-brand-navy px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save School"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm font-semibold text-brand-pink">{error}</p>
        ) : schools.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
            <School className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-muted-foreground">No schools yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a school above, or schools are created automatically when users register.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4 font-bold">Name</th>
                <th className="py-2 pr-4 font-bold">District</th>
                <th className="py-2 pr-4 font-bold">Province</th>
                <th className="py-2 pr-4 font-bold">Learners</th>
                <th className="py-2 pr-4 font-bold">Teachers</th>
                <th className="py-2 pr-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((s) => (
                <tr key={s.id} className="border-b border-border/60">
                  <td className="py-2.5 pr-4 font-semibold text-brand-navy">{s.name}</td>
                  <td className="py-2.5 pr-4">{s.district}</td>
                  <td className="py-2.5 pr-4">{s.province}</td>
                  <td className="py-2.5 pr-4">{s.learners}</td>
                  <td className="py-2.5 pr-4">{s.teachers}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusPill[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Panel>
  );
}
const EMPTY_SERVICE = {
  name: "",
  categoryId: "",
  province: "Lusaka",
  district: "",
  location: "",
  phone: "",
  hours: "",
  description: "",
  is24Hours: false,
  isActive: true,
};

function ReferralServicesSection() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_SERVICE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([apiGet("/admin/referral-services"), apiGet("/support/meta")])
      .then(([svc, meta]) => {
        if (!active) return;
        setServices(svc.services ?? []);
        setCategories(meta.categories ?? []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load referral services");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => {
    setDraft({ ...EMPTY_SERVICE, categoryId: categories[0]?.id ?? "" });
    setEditingId(null);
    setShowForm(true);
  };
  const openEdit = (s) => {
    setDraft({
      name: s.name,
      categoryId: s.categoryId,
      province: s.province,
      district: s.district,
      location: s.location,
      phone: s.phone,
      hours: s.hours,
      description: s.description ?? "",
      is24Hours: s.is24Hours,
      isActive: s.isActive,
    });
    setEditingId(s.id);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY_SERVICE);
  };
  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (saving) return;
    const required = ["name", "categoryId", "province", "district", "location", "phone", "hours"];
    if (required.some((k) => !String(draft[k]).trim())) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const { service } = await apiPatch(`/admin/referral-services/${editingId}`, draft);
        setServices((prev) => prev.map((s) => (s.id === editingId ? service : s)));
        toast.success("Service updated");
      } else {
        const { service } = await apiPost("/admin/referral-services", draft);
        setServices((prev) => [service, ...prev]);
        toast.success("Service added");
      }
      closeForm();
    } catch (err) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    try {
      await apiDelete(`/admin/referral-services/${s.id}`);
      setServices((prev) => prev.filter((x) => x.id !== s.id));
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete service");
    }
  };

  return (
    <Panel
      title="Referral Services"
      action={
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-purple px-3 py-1.5 text-xs font-bold text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Service
        </button>
      }
    >
      <p className="mb-4 rounded-xl bg-surface-yellow px-4 py-2.5 text-xs font-semibold text-brand-navy">
        Verify phone numbers and addresses before go-live. National lines 116 (Childline), 933 (GBV)
        and 991 (emergency) are confirmed; other contact details need ZCSIF sign-off.
      </p>

      {showForm && (
        <div className="mb-5 grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
          <input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Service name *"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm sm:col-span-2"
          />
          <select
            value={draft.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">Select category *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            value={draft.province}
            onChange={(e) => set("province", e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {PROVINCES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <input
            value={draft.district}
            onChange={(e) => set("district", e.target.value)}
            placeholder="District *"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
          <input
            value={draft.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Phone *"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
          <input
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Location / address *"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            value={draft.hours}
            onChange={(e) => set("hours", e.target.value)}
            placeholder="Hours * (e.g. Mon–Fri, 08:00 – 17:00)"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              checked={draft.is24Hours}
              onChange={(e) => set("is24Hours", e.target.checked)}
              className="h-4 w-4 accent-brand-teal"
            />
            Open 24 hours
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 accent-brand-teal"
            />
            Visible to learners
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Service" : "Save Service"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm font-semibold text-brand-pink">{error}</p>
        ) : services.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
            <LifeBuoy className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              No referral services yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a service above, or seed the directory from the backend.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4 font-bold">Name</th>
                <th className="py-2 pr-4 font-bold">Category</th>
                <th className="py-2 pr-4 font-bold">Location</th>
                <th className="py-2 pr-4 font-bold">Phone</th>
                <th className="py-2 pr-4 font-bold">Active</th>
                <th className="py-2 pr-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-border/60">
                  <td className="py-2.5 pr-4 font-semibold text-brand-navy">{s.name}</td>
                  <td className="py-2.5 pr-4">{s.category}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {s.location}
                    <span className="block text-xs">
                      {s.district}, {s.province}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">{s.phone}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        s.isActive ? "bg-surface-mint text-brand-teal" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s.isActive ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        aria-label={`Edit ${s.name}`}
                        className="rounded-lg border border-border p-1.5 text-foreground hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(s)}
                        aria-label={`Delete ${s.name}`}
                        className="rounded-lg border border-border p-1.5 text-brand-red hover:bg-muted"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Panel>
  );
}

function ContentApprovalSection() {
  const [queue, setQueue] = useState(PENDING_CONTENT);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState([]);
  const approve = (item) => {
    setQueue((q) => q.filter((c) => c.id !== item.id));
    setDone((d) => [{ id: item.id, title: item.title, result: "Approved" }, ...d]);
  };
  const confirmReject = (item) => {
    setQueue((q) => q.filter((c) => c.id !== item.id));
    setDone((d) => [{ id: item.id, title: item.title, result: "Rejected" }, ...d]);
    setRejecting(null);
    setReason("");
  };
  return (
    <div className="space-y-6">
      <Panel title={`Pending Review (${queue.length})`}>
        {queue.length === 0 ? (
          <p className="text-sm text-muted-foreground">No content awaiting review. 🎉</p>
        ) : (
          <ul className="space-y-3">
            {queue.map((item) => (
              <li key={item.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-brand-navy">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.type} · {item.subject} · Grade {item.grade}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.teacher} — {item.school} · Uploaded {item.uploaded}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-foreground"
                    >
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => approve(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-teal px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejecting(rejecting === item.id ? null : item.id);
                        setReason("");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                </div>
                {rejecting === item.id && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      className="min-w-[200px] flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      disabled={!reason.trim()}
                      onClick={() => confirmReject(item)}
                      className="rounded-lg bg-brand-red px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
                    >
                      Confirm Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {done.length > 0 && (
        <Panel title="Recently Reviewed">
          <ul className="divide-y divide-border/60">
            {done.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-semibold text-brand-navy">{d.title}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${d.result === "Approved" ? "bg-surface-mint text-brand-teal" : "bg-surface-peach text-brand-red"}`}
                >
                  {d.result === "Approved" ? "Live to learners" : "Rejected"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
function NotificationsSection() {
  const [target, setTarget] = useState("All Users");
  const [scope, setScope] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("In-App");
  const [log, setLog] = useState(SENT_NOTIFICATIONS);
  const needsScope = target === "By Role" || target === "By Province" || target === "By School";
  const canSend = subject.trim() && message.trim() && (!needsScope || scope.trim());
  const send = () => {
    if (!canSend) return;
    setLog((l) => [
      {
        id: `N${l.length + 1}`,
        subject: subject.trim(),
        target: needsScope ? `${target}: ${scope}` : target,
        channel,
        sent: new Date().toISOString().slice(0, 10),
        recipients: Math.floor(Math.random() * 1500) + 50,
      },
      ...l,
    ]);
    setSubject("");
    setMessage("");
    setScope("");
  };
  return (
    <div className="space-y-6">
      <Panel title="Compose Notification">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
            Target
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
            >
              <option>All Users</option>
              <option>By Role</option>
              <option>By Province</option>
              <option>By School</option>
            </select>
          </label>
          {needsScope && (
            <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
              {target.replace("By ", "")}
              <input
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder={`Enter ${target.replace("By ", "").toLowerCase()}`}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
              />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground sm:col-span-2">
            Subject
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Notification subject"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground sm:col-span-2">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Write your message..."
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal"
            />
          </label>
          <div className="flex flex-col gap-1.5 text-sm font-bold text-foreground sm:col-span-2">
            Channel
            <div className="flex flex-wrap gap-2">
              {["In-App", "SMS", "Email"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${channel === c ? "border-brand-purple bg-brand-purple text-white" : "border-border bg-background text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          <Bell className="h-4 w-4" /> Send Notification
        </button>
      </Panel>

      <Panel title="Sent Notifications">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4 font-bold">Subject</th>
                <th className="py-2 pr-4 font-bold">Target</th>
                <th className="py-2 pr-4 font-bold">Channel</th>
                <th className="py-2 pr-4 font-bold">Recipients</th>
                <th className="py-2 pr-4 font-bold">Sent</th>
              </tr>
            </thead>
            <tbody>
              {log.map((n) => (
                <tr key={n.id} className="border-b border-border/60">
                  <td className="py-2.5 pr-4 font-semibold text-brand-navy">{n.subject}</td>
                  <td className="py-2.5 pr-4">{n.target}</td>
                  <td className="py-2.5 pr-4">{n.channel}</td>
                  <td className="py-2.5 pr-4">{n.recipients.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{n.sent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
function ReportsSection() {
  const [exporting, setExporting] = useState(false);
  const exportUsers = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { users } = await apiGet("/admin/users");
      if (!users || users.length === 0) {
        toast.info("No users to export yet");
        return;
      }
      const csv = [
        ["Name", "Email", "Role", "Province", "School", "Status", "Joined"],
        ...users.map((u) => [u.name, u.email, u.role, u.province, u.school, u.status, u.joined]),
      ]
        .map((r) => r.map((c) => `"${c}"`).join(","))
        .join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "programme-report.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.message || "Failed to export users");
    } finally {
      setExporting(false);
    }
  };
  return (
    <Panel title="Reports">
      <p className="text-sm text-muted-foreground">
        Generate national programme reports across all schools and provinces.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={exportUsers}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Export Users (CSV)"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground"
        >
          <FileText className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>
    </Panel>
  );
}

function ChatSection() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const pollRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    fetchSessions();
    const t = setInterval(fetchSessions, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetchMessages(selected.id);
    clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchMessages(selected.id), 4000);
    return () => clearInterval(pollRef.current);
  }, [selected]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchSessions() {
    try {
      const tok = getAccessToken();
      const res = await fetch(`${API_URL}/support/chat/sessions`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch { /* non-fatal */ }
  }

  async function fetchMessages(sessionId) {
    try {
      const res = await fetch(`${API_URL}/support/chat/${sessionId}/messages`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch { /* non-fatal */ }
  }

  async function sendReply() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");
    try {
      const tok = getAccessToken();
      await fetch(`${API_URL}/support/chat/${selected.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tok}`,
        },
        body: JSON.stringify({ text }),
      });
      await fetchMessages(selected.id);
    } catch { /* non-fatal */ }
    finally { setSending(false); }
  }

  const statusPillChat = {
    pending: "bg-surface-yellow text-brand-navy",
    active: "bg-surface-mint text-brand-teal",
    closed: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4 overflow-hidden">
      {/* Sessions list */}
      <div className="flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-extrabold text-brand-navy">Chat Requests</h2>
          <p className="text-xs text-muted-foreground">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground">No chat sessions yet.</p>
          ) : (
            sessions.map((s) => {
              const name = s.user
                ? `${s.user.firstName} ${s.user.lastName}`
                : (s.guestName ?? "Anonymous");
              const lastMsg = s.messages?.[0]?.text ?? "No messages yet";
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelected(s); setMessages([]); }}
                  className={
                    "w-full border-b border-border/60 px-4 py-3 text-left transition hover:bg-muted " +
                    (selected?.id === s.id ? "bg-surface-lavender" : "")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-brand-navy">{name}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusPillChat[s.status] ?? "bg-muted"}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{lastMsg}</p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-card shadow-sm">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a session to view the chat.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-border bg-brand-teal px-5 py-3 text-white">
              <MessageCircle className="h-5 w-5" />
              <div>
                <p className="text-sm font-extrabold">
                  {selected.user
                    ? `${selected.user.firstName} ${selected.user.lastName}`
                    : (selected.guestName ?? "Anonymous")}
                </p>
                <p className="text-xs text-white/80">Session {selected.id.slice(0, 8)}…</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.from === "counsellor"
                      ? "flex justify-end"
                      : m.from === "system"
                        ? "flex justify-center"
                        : "flex justify-start"
                  }
                >
                  <div className={
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm " +
                    (m.from === "counsellor"
                      ? "bg-brand-navy text-white"
                      : m.from === "system"
                        ? "bg-muted text-muted-foreground text-xs italic"
                        : "bg-surface-mint text-foreground")
                  }>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
                  placeholder="Type a reply..."
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-teal"
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !reply.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal text-white disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
