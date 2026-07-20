import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Upload,
  ListChecks,
  UsersRound,
  Activity as ActivityIcon,
  GraduationCap,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  LogOut,
  Search,
  Bell,
  Plus,
  Trash2,
  Pencil,
  Download,
  FileText,
  Video,
  ArrowLeft,
  Award,
  X,
  Megaphone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  TRAINING_RESOURCES,
  SUBJECT_OPTIONS,
  GRADE_OPTIONS,
} from "@/lib/teacher-data";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/contexts/AuthContext";
import { toast } from "sonner";
const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "learners", label: "My Learners", icon: Users },
  { id: "plans", label: "Lesson Plans", icon: ClipboardList },
  { id: "materials", label: "Upload Materials", icon: Upload },
  { id: "quizzes", label: "Quizzes", icon: ListChecks },
  { id: "clubs", label: "Club Management", icon: UsersRound },
  { id: "activities", label: "Classroom Activities", icon: ActivityIcon },
  { id: "training", label: "Training Resources", icon: GraduationCap },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];
function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [section, setSection] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const firstName = user?.firstName ?? "Teacher";
  const lastName = user?.lastName ?? "";
  const name = `${firstName} ${lastName}`.trim() || "Teacher";
  const school = user?.schoolName ?? "Your School";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const title = NAV.find((n) => n.id === section)?.label ?? "Overview";
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all lg:static " +
          (mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 ") +
          (collapsed ? " w-64 lg:w-20" : " w-64")
        }
      >
        <div className="flex items-center justify-between gap-2 px-4 py-5">
          {!collapsed && (
            <img src="/images/alinks-logo.jpeg" alt="A-LINKS" width={140} height={56} className="h-9 w-auto" />
          )}
          <button
            onClick={() => {
              setCollapsed((v) => !v);
              setMobileOpen(false);
            }}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-brand-navy transition hover:bg-muted"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setSection(id);
                  setMobileOpen(false);
                }}
                title={label}
                className={
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition " +
                  (active
                    ? "bg-surface-lavender text-brand-purple"
                    : "text-foreground hover:bg-muted") +
                  (collapsed ? " lg:justify-center" : "")
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
                {collapsed && <span className="lg:hidden">{label}</span>}
              </button>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className={
            "m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-pink transition hover:bg-muted " +
            (collapsed ? "lg:justify-center" : "")
          }
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
          {collapsed && <span className="lg:hidden">Logout</span>}
        </button>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search learners, materials..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
            />
          </div>
          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-pink" />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal text-sm font-extrabold text-white">
            {initials}
          </span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <h1 className="mb-5 text-2xl font-extrabold text-brand-navy sm:text-3xl">{title}</h1>
          {section === "overview" && <Overview firstName={firstName} school={school} />}
          {section === "learners" && <MyLearners />}
          {section === "plans" && <LessonPlans />}
          {section === "materials" && <UploadMaterials />}
          {section === "quizzes" && <CreateQuiz />}
          {section === "clubs" && <ClubManagement />}
          {section === "activities" && <ClassroomActivities />}
          {section === "training" && <TrainingResources />}
          {section === "reports" && <Reports />}
          {section === "settings" && <TeacherSettings name={name} school={school} />}
        </main>
      </div>
    </div>
  );
}
/* ---------------- Overview ---------------- */
function useTeacherLearners() {
  const [learners, setLearners] = useState([]);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [clubsCount, setClubsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let active = true;
    const tok = getAccessToken();
    setIsLoading(true);
    setLoadError(null);

    Promise.all([
      fetch(`${API_URL}/school/learners`, {
        headers: { Authorization: `Bearer ${tok}` },
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load learners")))),
      fetch(`${API_URL}/teacher/materials`, {
        headers: { Authorization: `Bearer ${tok}` },
      }).then((r) => (r.ok ? r.json() : { materials: [] })),
      fetch(`${API_URL}/school/clubs`, {
        headers: { Authorization: `Bearer ${tok}` },
      }).then((r) => (r.ok ? r.json() : { clubs: [] })),
    ])
      .then(([learnersData, materialsData, clubsData]) => {
        if (!active) return;
        setLearners(learnersData.learners || []);
        setMaterialsCount((materialsData.materials || []).length);
        setClubsCount((clubsData.clubs || []).length);
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "Failed to load dashboard data");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { learners, materialsCount, clubsCount, isLoading, loadError };
}

function Overview({ firstName, school }) {
  const { learners, materialsCount, clubsCount, isLoading, loadError } = useTeacherLearners();

  const stats = [
    {
      label: "Total Learners",
      value: learners.length,
      surface: "bg-surface-lavender",
      color: "text-brand-purple",
      icon: Users,
    },
    {
      label: "Active This Week",
      value: learners.filter((l) => l.status === "active").length,
      surface: "bg-surface-mint",
      color: "text-brand-teal",
      icon: ActivityIcon,
    },
    {
      label: "Materials Uploaded",
      value: materialsCount,
      surface: "bg-surface-blue",
      color: "text-brand-blue",
      icon: Upload,
    },
    {
      label: "Clubs Managed",
      value: clubsCount,
      surface: "bg-surface-yellow",
      color: "text-brand-yellow",
      icon: UsersRound,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-teal to-brand-blue p-6 text-white sm:p-8">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Welcome, {firstName}! 👋</h2>
        <p className="mt-1 text-sm text-white/85">{school}</p>
      </section>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, surface, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-card p-4 shadow-sm">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${surface} ${color}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-extrabold text-brand-navy">
              {isLoading ? "…" : value}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-lg font-extrabold text-brand-navy">Recent Learner Activity</h2>
        {isLoading ? (
          <div className="mt-3 h-40 animate-pulse rounded-2xl bg-muted" />
        ) : loadError ? (
          <div className="mt-3 rounded-2xl bg-card p-8 text-center text-sm text-brand-pink shadow-sm">
            {loadError}
          </div>
        ) : learners.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-card p-8 text-center shadow-sm">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              No learners assigned yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your enrolled learners will appear here
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <Th>Name</Th>
                  <Th>Grade</Th>
                  <Th>Status</Th>
                  <Th>Progress</Th>
                </tr>
              </thead>
              <tbody>
                {learners.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <Td className="font-bold text-brand-navy">{l.name}</Td>
                    <Td>Grade {l.grade}</Td>
                    <Td>
                      <StatusPill active={l.status === "active"} />
                    </Td>
                    <Td>
                      <ProgressBar value={l.completion} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
/* ---------------- My Learners ---------------- */
function MyLearners() {
  const [selected, setSelected] = useState(null);
  const [learners, setLearners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let active = true;
    const tok = getAccessToken();
    fetch(`${API_URL}/school/learners`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load learners"))))
      .then((data) => {
        if (active) setLearners(data.learners || []);
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "Failed to load learners");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (selected) return <LearnerDetail learner={selected} onBack={() => setSelected(null)} />;

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-card" />;

  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-xs uppercase text-muted-foreground">
          <tr>
            <Th>Name</Th>
            <Th>Grade</Th>
            <Th>Progress</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {loadError ? (
            <tr>
              <td colSpan="4" className="border-0 py-12 text-center text-sm text-brand-pink">
                {loadError}
              </td>
            </tr>
          ) : learners.length === 0 ? (
            <tr>
              <td colSpan="4" className="border-0 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Users className="mb-3 h-12 w-12 text-muted-foreground/40" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    No learners assigned yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your enrolled learners will appear here
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            learners.map((l) => (
              <tr
                key={l.id}
                onClick={() => setSelected(l)}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-muted"
              >
                <Td className="font-bold text-brand-navy">{l.name}</Td>
                <Td>Grade {l.grade}</Td>
                <Td>
                  <ProgressBar value={l.completion} />
                </Td>
                <Td>
                  <StatusPill active={l.status === "active"} />
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
function LearnerDetail({ learner, onBack }) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-purple"
      >
        <ArrowLeft className="h-4 w-4" /> All learners
      </button>
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple text-lg font-extrabold text-white">
          {learner.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-brand-navy">{learner.name}</h2>
          <p className="text-sm text-muted-foreground">
            Grade {learner.grade} · {learner.completion}% overall progress
          </p>
        </div>
      </div>
      <section>
        <h3 className="font-extrabold text-brand-navy">Overall Progress</h3>
        <div className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
          <ProgressBar value={learner.completion} />
        </div>
      </section>
      <section className="rounded-2xl bg-card p-5 text-center shadow-sm">
        <Award className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-3 text-sm font-semibold text-muted-foreground">
          Per-subject progress, badges and quiz history aren\'t tracked per
          learner yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          This view will show detailed subject breakdowns and quiz results
          once that data is available from the backend
        </p>
      </section>
    </div>
  );
}
/* ---------------- Lesson Plans ---------------- */
function LessonPlans() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [objectives, setObjectives] = useState([""]);
  const [activities, setActivities] = useState([""]);
  const [form, setForm] = useState({
    title: "",
    subject: SUBJECT_OPTIONS[0],
    grade: "7",
    description: "",
  });

  const fetchPlans = () => {
    const tok = getAccessToken();
    setIsLoading(true);
    fetch(`${API_URL}/teacher/lesson-plans`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load lesson plans"))))
      .then((data) => setPlans(data.plans || []))
      .catch((err) => setLoadError(err.message || "Failed to load lesson plans"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const tok = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/teacher/lesson-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({
          title: form.title,
          subject: form.subject,
          grade: form.grade,
          description: form.description,
          objectives: objectives.filter((o) => o.trim()),
          activities: activities.filter((a) => a.trim()),
        }),
      });
      if (!res.ok) throw new Error("Failed to save lesson plan");
      toast.success("Lesson plan saved");
      setShowForm(false);
      setForm({ title: "", subject: SUBJECT_OPTIONS[0], grade: "7", description: "" });
      setObjectives([""]);
      setActivities([""]);
      fetchPlans();
    } catch (err) {
      toast.error(err.message || "Failed to save lesson plan");
    } finally {
      setSaving(false);
    }
  };

  if (showForm) {
    return (
      <FormCard
        title="Create Lesson Plan"
        onCancel={() => setShowForm(false)}
        onSubmit={save}
        submitLabel={saving ? "Saving\u2026" : "Save Lesson Plan"}
      >
        <Field label="Title">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Lesson title"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject">
            <select
              className={inputCls}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Grade">
            <select
              className={inputCls}
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            >
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea
            className={inputCls}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <RepeaterField
          label="Learning Objectives"
          items={objectives}
          setItems={setObjectives}
          placeholder="Objective"
        />
        <RepeaterField
          label="Activities"
          items={activities}
          setItems={setActivities}
          placeholder="Activity"
        />
      </FormCard>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={() => setShowForm(true)}>Create Lesson Plan</AddButton>
      </div>
      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-card" />
      ) : loadError ? (
        <div className="rounded-2xl bg-card p-8 text-center text-sm text-brand-pink shadow-sm">
          {loadError}
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            No lesson plans created yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use the "Create Lesson Plan" button above to start planning
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <Th>Title</Th>
                <Th>Subject</Th>
                <Th>Grade</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <Td className="font-bold text-brand-navy">{p.title}</Td>
                  <Td>{p.subject}</Td>
                  <Td>Grade {p.grade}</Td>
                  <Td>{new Date(p.createdAt).toLocaleDateString()}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
/* ---------------- Upload Materials ---------------- */
function UploadMaterials() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: SUBJECT_OPTIONS[0],
    type: "Document",
    description: "",
    link: "",
  });

  const fetchMaterials = () => {
    const tok = getAccessToken();
    setIsLoading(true);
    fetch(`${API_URL}/teacher/materials`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load materials"))))
      .then((data) => setMaterials(data.materials || []))
      .catch((err) => setLoadError(err.message || "Failed to load materials"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const toggleGrade = (g) =>
    setGrades((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const upload = async () => {
    if (!form.title.trim()) return;
    setUploading(true);
    const tok = getAccessToken();
    try {
      let url = form.link || null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch(`${API_URL}/upload/material`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tok}` },
          body: fd,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err.error || "File upload failed");
        }
        const uploadData = await uploadRes.json();
        url = uploadData.url;
      }

      const res = await fetch(`${API_URL}/teacher/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({
          title: form.title,
          subject: form.subject,
          type: form.type,
          grade: grades.length ? grades.sort((a, b) => a - b).join(", ") : null,
          description: form.description,
          url,
        }),
      });
      if (!res.ok) throw new Error("Failed to save material");

      toast.success("Material uploaded \u2014 awaiting admin approval");
      setForm({ title: "", subject: SUBJECT_OPTIONS[0], type: "Document", description: "", link: "" });
      setGrades([]);
      setFile(null);
      fetchMaterials();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteMaterial = async (id) => {
    const tok = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/teacher/materials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error("Failed to delete material");
      setMaterials((prev) => prev.filter((x) => x.id !== id));
      toast.success("Material deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete material");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-extrabold text-brand-navy">Upload New Material</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Uploaded materials go for admin approval before appearing to learners.
        </p>
        <div className="mt-4 space-y-4">
          <Field label="Material Title">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Online Safety Guide"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject">
              <select
                className={inputCls}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Type">
              <select
                className={inputCls}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Video</option>
                <option>Document</option>
                <option>Activity</option>
                <option>Quiz</option>
              </select>
            </Field>
          </div>
          <Field label="Grade Level (select multiple)">
            <div className="flex flex-wrap gap-2">
              {GRADE_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGrade(g)}
                  className={
                    "rounded-full px-3 py-1 text-xs font-bold transition " +
                    (grades.includes(g)
                      ? "bg-brand-purple text-white"
                      : "bg-muted text-foreground hover:bg-border")
                  }
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Description">
            <textarea
              className={inputCls}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label="YouTube Link (optional)">
            <input
              className={inputCls}
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </Field>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-8 text-center text-sm text-muted-foreground hover:border-brand-purple/50">
            <Upload className="h-5 w-5" />
            {file ? file.name : "Click to choose a file (PDF, DOCX, MP4 \u2014 max 20MB)"}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.mp4,.mov"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <AddButton onClick={upload} disabled={uploading}>
            {uploading ? "Uploading\u2026" : "Upload Material"}
          </AddButton>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-extrabold text-brand-navy">My Uploaded Materials</h2>
        {isLoading ? (
          <div className="mt-3 h-40 animate-pulse rounded-2xl bg-card" />
        ) : loadError ? (
          <div className="mt-3 rounded-2xl bg-card p-8 text-center text-sm text-brand-pink shadow-sm">
            {loadError}
          </div>
        ) : materials.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-card p-8 text-center shadow-sm">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              No materials uploaded yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use the upload area above to share teaching materials with learners
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <Th>Title</Th>
                  <Th>Type</Th>
                  <Th>Grade</Th>
                  <Th>Subject</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <Td className="font-bold text-brand-navy">{m.title}</Td>
                    <Td>{m.type}</Td>
                    <Td>{m.grade || "\u2014"}</Td>
                    <Td>{m.subject}</Td>
                    <Td>{new Date(m.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <ApprovalPill status={m.status} />
                    </Td>
                    <Td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteMaterial(m.id)}
                          className="text-brand-red hover:opacity-70"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
function CreateQuiz() {
  const [meta, setMeta] = useState({
    title: "",
    subject: SUBJECT_OPTIONS[0],
    grade: "7",
    pointsPerQuestion: "10",
    passMark: "60",
  });
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correct: 0, explanation: "" },
  ]);
  const [saving, setSaving] = useState(false);

  const update = (qi, patch) =>
    setQuestions((qs) => qs.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  const updateOption = (qi, oi, val) =>
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? val : o)) } : q,
      ),
    );
  const addQuestion = () =>
    setQuestions((qs) => [
      ...qs,
      { text: "", options: ["", "", "", ""], correct: 0, explanation: "" },
    ]);
  const removeQuestion = (qi) => setQuestions((qs) => qs.filter((_, i) => i !== qi));

  const isValid =
    meta.title.trim() &&
    questions.every((q) => q.text.trim() && q.options.every((o) => o.trim()));

  const submit = async () => {
    if (!isValid) {
      toast.error("Add a title and fill in every question and option");
      return;
    }
    setSaving(true);
    const tok = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/teacher/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({
          title: meta.title,
          subject: meta.subject,
          grade: meta.grade,
          pointsPerQuestion: meta.pointsPerQuestion,
          passMark: meta.passMark,
          questions,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create quiz");
      }
      toast.success("Quiz published");
      setMeta({ title: "", subject: SUBJECT_OPTIONS[0], grade: "7", pointsPerQuestion: "10", passMark: "60" });
      setQuestions([{ text: "", options: ["", "", "", ""], correct: 0, explanation: "" }]);
    } catch (err) {
      toast.error(err.message || "Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <Field label="Quiz Title">
          <input
            className={inputCls}
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
            placeholder="Quiz title"
          />
        </Field>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Field label="Subject">
            <select
              className={inputCls}
              value={meta.subject}
              onChange={(e) => setMeta({ ...meta, subject: e.target.value })}
            >
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Grade">
            <select
              className={inputCls}
              value={meta.grade}
              onChange={(e) => setMeta({ ...meta, grade: e.target.value })}
            >
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Points / Question">
            <input
              className={inputCls}
              type="number"
              min="1"
              value={meta.pointsPerQuestion}
              onChange={(e) => setMeta({ ...meta, pointsPerQuestion: e.target.value })}
            />
          </Field>
          <Field label="Pass Mark (%)">
            <input
              className={inputCls}
              type="number"
              min="0"
              max="100"
              value={meta.passMark}
              onChange={(e) => setMeta({ ...meta, passMark: e.target.value })}
            />
          </Field>
        </div>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-brand-navy">Question {qi + 1}</h3>
            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(qi)}
                className="text-brand-red hover:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-3 space-y-3">
            <input
              className={inputCls}
              value={q.text}
              onChange={(e) => update(qi, { text: e.target.value })}
              placeholder="Question text"
            />
            {q.options.map((opt, oi) => (
              <label key={oi} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={q.correct === oi}
                  onChange={() => update(qi, { correct: oi })}
                  className="h-4 w-4 accent-[var(--brand-purple)]"
                />
                <input
                  className={inputCls}
                  value={opt}
                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                />
              </label>
            ))}
            <p className="text-xs text-muted-foreground">
              Select the radio next to the correct answer.
            </p>
            <textarea
              className={inputCls}
              rows={2}
              value={q.explanation}
              onChange={(e) => update(qi, { explanation: e.target.value })}
              placeholder="Explanation (shown in review)"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2 text-sm font-bold text-brand-purple hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Add Question
      </button>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={submit}
          disabled={saving || !isValid}
          className="rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-bold text-white hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {saving ? "Publishing\u2026" : "Publish Quiz"}
        </button>
      </div>
    </div>
  );
}
/* ---------------- Club Management ---------------- */
function ClubManagement() {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [view, setView] = useState("list");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "leadership",
    description: "",
  });

  const fetchClubs = () => {
    const tok = getAccessToken();
    setIsLoading(true);
    fetch(`${API_URL}/school/clubs`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load clubs"))))
      .then((data) => setClubs(data.clubs || []))
      .catch((err) => setLoadError(err.message || "Failed to load clubs"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const createClub = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const tok = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/clubs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create club");
      }
      toast.success("Club created");
      setForm({ name: "", category: "leadership", description: "" });
      setView("list");
      fetchClubs();
    } catch (err) {
      toast.error(err.message || "Failed to create club");
    } finally {
      setSaving(false);
    }
  };

  if (view === "create") {
    return (
      <FormCard
        title="Create Club"
        onCancel={() => setView("list")}
        onSubmit={createClub}
        submitLabel={saving ? "Creating\u2026" : "Create Club"}
      >
        <Field label="Club Name">
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Category">
          <select
            className={inputCls}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="leadership">Leadership</option>
            <option value="digital_safety">Digital Safety</option>
            <option value="health_wellbeing">Health & Wellbeing</option>
            <option value="civic_education">Civic Education</option>
            <option value="career_guidance">Career Guidance</option>
            <option value="debate">Debate</option>
            <option value="environmental">Environmental</option>
          </select>
        </Field>
        <Field label="Description">
          <textarea
            className={inputCls}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
      </FormCard>
    );
  }
  if (view !== "list") {
    const club = clubs.find((c) => c.id === view);
    if (club) return <ClubDetail club={club} onBack={() => setView("list")} />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={() => setView("create")}>Create Club</AddButton>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-2xl bg-card p-8 text-center text-sm text-brand-pink shadow-sm">
          {loadError}
        </div>
      ) : clubs.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
          <UsersRound className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            No clubs created yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use the "Create Club" button above to start a club
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => (
            <button
              key={c.id}
              onClick={() => setView(c.id)}
              className="rounded-2xl bg-card p-5 text-left shadow-sm transition-transform hover:-translate-y-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-lavender text-brand-purple">
                <UsersRound className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-extrabold text-brand-navy">{c.name}</h3>
              <p className="text-xs text-muted-foreground">{c.category}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {c._count?.members ?? 0} members
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function ClubDetail({ club, onBack }) {
  const [announcement, setAnnouncement] = useState("");
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchDetail = () => {
    const tok = getAccessToken();
    setIsLoading(true);
    Promise.all([
      fetch(`${API_URL}/clubs/${club.id}`, {
        headers: { Authorization: `Bearer ${tok}` },
      }).then((r) => (r.ok ? r.json() : { club: null })),
      fetch(`${API_URL}/clubs/${club.id}/announcements`).then((r) =>
        r.ok ? r.json() : { announcements: [] },
      ),
    ])
      .then(([clubData, announcementsData]) => {
        setMembers((clubData.club?.members || []).map((m) => m.user));
        setPosts(announcementsData.announcements || []);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [club.id]);

  const postAnnouncement = async () => {
    if (!announcement.trim()) return;
    setPosting(true);
    const tok = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/clubs/${club.id}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ message: announcement }),
      });
      if (!res.ok) throw new Error("Failed to post announcement");
      setAnnouncement("");
      fetchDetail();
    } catch (err) {
      toast.error(err.message || "Failed to post announcement");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-purple"
      >
        <ArrowLeft className="h-4 w-4" /> All clubs
      </button>
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-brand-navy">{club.name}</h2>
        <p className="text-sm text-muted-foreground">
          {club.category} \u00b7 {club._count?.members ?? members.length} members
        </p>
      </div>
      <section>
        <h3 className="font-extrabold text-brand-navy">Post Announcement</h3>
        <div className="mt-2 flex gap-2">
          <input
            className={inputCls}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Write an announcement..."
          />
          <button
            onClick={postAnnouncement}
            disabled={posting}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-purple px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Megaphone className="h-4 w-4" /> {posting ? "Posting\u2026" : "Post"}
          </button>
        </div>
        {isLoading ? (
          <div className="mt-3 h-16 animate-pulse rounded-xl bg-muted" />
        ) : posts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No announcements yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {posts.map((p) => (
              <li
                key={p.id}
                className="rounded-xl bg-surface-lavender px-4 py-2.5 text-sm text-foreground"
              >
                <p>{p.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.author?.firstName} {p.author?.lastName} \u00b7{" "}
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 className="font-extrabold text-brand-navy">Members</h3>
        {isLoading ? (
          <div className="mt-2 h-24 animate-pulse rounded-2xl bg-muted" />
        ) : members.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No members yet.</p>
        ) : (
          <div className="mt-2 divide-y divide-border rounded-2xl bg-card shadow-sm">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal text-xs font-extrabold text-white">
                  {`${m.firstName?.[0] ?? ""}${m.lastName?.[0] ?? ""}`}
                </span>
                <span className="text-sm font-bold text-brand-navy">
                  {m.firstName} {m.lastName}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Grade {m.grade ?? "\u2014"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
/* ---------------- Classroom Activities ---------------- */
function ClassroomActivities() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", gradeGroup: "Grade 8", due: "" });

  const fetchActivities = () => {
    const tok = getAccessToken();
    setIsLoading(true);
    fetch(`${API_URL}/teacher/activities`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load activities"))))
      .then((data) => setActivities(data.activities || []))
      .catch((err) => setLoadError(err.message || "Failed to load activities"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const createActivity = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const tok = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/teacher/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({
          title: form.title,
          gradeGroup: form.gradeGroup,
          due: form.due || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create activity");
      toast.success("Activity assigned");
      setForm({ title: "", gradeGroup: "Grade 8", due: "" });
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      toast.error(err.message || "Failed to create activity");
    } finally {
      setSaving(false);
    }
  };

  const deleteActivity = async (id) => {
    const tok = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/teacher/activities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error("Failed to delete activity");
      setActivities((prev) => prev.filter((x) => x.id !== id));
      toast.success("Activity deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete activity");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={() => setShowForm((v) => !v)}>Create Activity</AddButton>
      </div>
      {showForm && (
        <FormCard
          title="New Activity"
          onCancel={() => setShowForm(false)}
          onSubmit={createActivity}
          submitLabel={saving ? "Saving\u2026" : "Assign Activity"}
        >
          <Field label="Activity Title">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Grade Group">
              <select
                className={inputCls}
                value={form.gradeGroup}
                onChange={(e) => setForm({ ...form, gradeGroup: e.target.value })}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g}>Grade {g}</option>
                ))}
              </select>
            </Field>
            <Field label="Due Date">
              <input
                className={inputCls}
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
                placeholder="e.g. Jun 20"
              />
            </Field>
          </div>
        </FormCard>
      )}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-2xl bg-card p-8 text-center text-sm text-brand-pink shadow-sm">
          {loadError}
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
          <ActivityIcon className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            No activities created yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use the "Create Activity" button above to assign classroom activities
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <div key={a.id} className="relative rounded-2xl bg-card p-5 shadow-sm">
              <button
                onClick={() => deleteActivity(a.id)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-brand-red"
                aria-label="Delete activity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-mint text-brand-teal">
                <ActivityIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-extrabold text-brand-navy">{a.title}</h3>
              <p className="text-xs text-muted-foreground">
                {a.gradeGroup} \u00b7 Due {a.due || "TBD"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Assigned {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
/* ---------------- Training Resources ---------------- */
function TrainingResources() {
  const topics = useMemo(
    () => ["All", ...Array.from(new Set(TRAINING_RESOURCES.map((r) => r.topic)))],
    [],
  );
  const [topic, setTopic] = useState("All");
  const list = TRAINING_RESOURCES.filter((r) => topic === "All" || r.topic === topic);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Official training materials provided by programme admins.
      </p>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={
              "rounded-full px-4 py-1.5 text-sm font-bold transition " +
              (topic === t ? "bg-brand-navy text-white" : "bg-card text-foreground hover:bg-muted")
            }
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <div key={r.id} className="flex flex-col rounded-2xl bg-card p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-blue text-brand-blue">
              {r.format === "Video" ? (
                <Video className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </span>
            <h3 className="mt-3 font-extrabold text-brand-navy">{r.title}</h3>
            <p className="text-xs text-muted-foreground">
              {r.topic} · {r.format}
            </p>
            <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ---------------- Reports ---------------- */
function Reports() {
  const [learners, setLearners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let active = true;
    const tok = getAccessToken();
    fetch(`${API_URL}/school/learners`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load learners"))))
      .then((data) => {
        if (active) setLearners(data.learners || []);
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "Failed to load learners");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const exportCsv = () => {
    const header = "Name,Grade,Progress %,Status\n";
    const rows = learners
      .map((l) => `${l.name},${l.grade},${l.completion},${l.status}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learner-progress-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Learner progress report by class / grade.</p>
        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            disabled={learners.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white"
          >
            <FileText className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-card" />
      ) : loadError ? (
        <div className="rounded-2xl bg-card p-8 text-center text-sm text-brand-pink shadow-sm">
          {loadError}
        </div>
      ) : learners.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground">No learner data yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <Th>Name</Th>
                <Th>Grade</Th>
                <Th>Progress</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {learners.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0">
                  <Td className="font-bold text-brand-navy">{l.name}</Td>
                  <Td>Grade {l.grade}</Td>
                  <Td>
                    <ProgressBar value={l.completion} />
                  </Td>
                  <Td>
                    <StatusPill active={l.status === "active"} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
/* ---------------- Settings ---------------- */
function TeacherSettings({ name, school }) {
  return (
    <div className="max-w-lg space-y-4 rounded-2xl bg-card p-6 shadow-sm">
      <Field label="Full Name">
        <input className={inputCls} defaultValue={name} />
      </Field>
      <Field label="School">
        <input className={inputCls} defaultValue={school} />
      </Field>
      <Field label="Email">
        <input className={inputCls} defaultValue="teacher@alinks.org" />
      </Field>
      <button className="rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white">
        Save Changes
      </button>
    </div>
  );
}
/* ---------------- shared bits ---------------- */
const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 disabled:opacity-60";
function Th({ children }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={"px-4 py-3 text-foreground " + className}>{children}</td>;
}
function ProgressBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{value}%</span>
    </div>
  );
}
function StatusPill({ active }) {
  return (
    <span
      className={
        "rounded-full px-2.5 py-0.5 text-xs font-bold " +
        (active ? "bg-surface-mint text-brand-teal" : "bg-muted text-muted-foreground")
      }
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
function ApprovalPill({ status }) {
  const map = {
    Approved: "bg-surface-mint text-brand-teal",
    Pending: "bg-surface-yellow text-brand-navy",
    Rejected: "bg-surface-peach text-brand-pink",
  };
  return (
    <span className={"rounded-full px-2.5 py-0.5 text-xs font-bold " + map[status]}>{status}</span>
  );
}
function AddButton({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-purple px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      <Plus className="h-4 w-4" /> {children}
    </button>
  );
}
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-brand-navy">{label}</span>
      {children}
    </label>
  );
}
function RepeaterField({ label, items, setItems, placeholder }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold text-brand-navy">{label}</span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls}
              value={it}
              onChange={(e) => setItems(items.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={`${placeholder} ${i + 1}`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setItems(items.filter((_, j) => j !== i))}
                className="shrink-0 rounded-xl bg-muted px-3 text-brand-red hover:bg-border"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setItems([...items, ""])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple"
      >
        <Plus className="h-3.5 w-3.5" /> Add {placeholder}
      </button>
    </div>
  );
}
function FormCard({ title, children, onCancel, onSubmit, submitLabel }) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-brand-navy">{title}</h2>
        <button
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onSubmit}
          className="rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-bold text-white hover:scale-[1.02]"
        >
          {submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl bg-muted px-5 py-2.5 text-sm font-bold text-foreground hover:bg-border"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
export default TeacherDashboard;
