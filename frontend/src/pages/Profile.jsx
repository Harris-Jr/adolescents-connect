import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Award, BookOpen, Camera, Download, LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { useProgress } from "@/contexts/ProgressContext";
import { COURSES } from "@/lib/learn-catalog";
import { FloatingInput } from "@/components/forms/FloatingInput";
import { FloatingSelect } from "@/components/forms/FloatingSelect";
import { PasswordInput } from "@/components/forms/PasswordInput";
import {
  PROVINCES,
  DISTRICTS_BY_PROVINCE,
  DISABILITY_OPTIONS,
} from "@/lib/zambia-locations";
const preferenceLabels = [
  "New lessons",
  "Quiz results",
  "Badges earned",
  "Club announcements",
  "Challenges",
  "System messages",
];
function Profile() {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { badges, isCourseComplete } = useProgress();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    grade: user?.grade ?? "",
    schoolName: user?.schoolName ?? "",
  });
  const [demographics, setDemographics] = useState({
    dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
    province: user?.province ?? "",
    district: user?.district ?? "",
    disabilityStatus: user?.disabilityStatus ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preferences, setPreferences] = useState(() =>
    Object.fromEntries(preferenceLabels.map((label) => [label, true])),
  );
  const [language, setLanguage] = useState("English");
  const [privateProfile, setPrivateProfile] = useState(true);
  const certificates = useMemo(
    () => COURSES.filter((course) => isCourseComplete(course.id)),
    [isCourseComplete],
  );
  if (!isAuthenticated)
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <LockKeyhole className="mx-auto h-12 w-12 text-brand-purple" />
        <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">Login to view your profile</h1>
        <Link
          to="/auth"
          className="mt-5 inline-block rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Login
        </Link>
      </main>
    );
  const save = async () => {
    setIsSaving(true);
    try {
      const tok = getAccessToken();
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          grade: form.grade || undefined,
          schoolName: form.schoolName || undefined,
          dateOfBirth: demographics.dateOfBirth || null,
          province: demographics.province || null,
          district: demographics.district || null,
          disabilityStatus: demographics.disabilityStatus || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      updateUser(data.user ?? form);
      toast.success("Profile saved");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };
  const photo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const tok = getAccessToken();
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch(`${API_URL}/upload/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
        body: fd,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();
      await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ avatar: url }),
      });
      updateUser({ avatar: url });
      toast.success("Profile photo updated");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };
  const download = (courseName) => {
    const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Learner";
    const text = `A-LINKS CERTIFICATE OF COMPLETION\n\nThis certifies that\n${fullName}\ncompleted\n${courseName}\non ${new Date().toLocaleDateString()}.`;
    const url = URL.createObjectURL(new Blob([text], { type: "application/pdf" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${courseName}-certificate.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Certificate downloaded");
  };
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-navy">My Profile</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-purple text-2xl font-extrabold text-primary-foreground">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  form.firstName.slice(0, 1)
                )}
              </span>
              <div>
                <h2 className="font-extrabold text-brand-navy">Profile photo</h2>
                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-bold hover:bg-muted">
                  <Camera className="h-4 w-4" /> Upload or change
                  <input type="file" accept="image/*" onChange={photo} className="sr-only" />
                </label>
              </div>
            </div>
          </section>
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-brand-navy">Edit Profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Object.entries(form).map(([key, value]) => (
                <FloatingInput
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (letter) => letter.toUpperCase())}
                  type={key === "email" ? "email" : "text"}
                  value={value}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                  success={Boolean(value)}
                />
              ))}
              <FloatingInput
                label="Date Of Birth"
                type="date"
                value={demographics.dateOfBirth}
                onChange={(event) =>
                  setDemographics((current) => ({ ...current, dateOfBirth: event.target.value }))
                }
                success={Boolean(demographics.dateOfBirth)}
              />
              <FloatingSelect
                label="Province"
                value={demographics.province}
                onChange={(value) =>
                  setDemographics((current) => ({ ...current, province: value, district: "" }))
                }
                options={PROVINCES.map((value) => ({ value, label: value }))}
              />
              <FloatingSelect
                label="District"
                value={demographics.district}
                disabled={!demographics.province}
                onChange={(value) =>
                  setDemographics((current) => ({ ...current, district: value }))
                }
                options={(DISTRICTS_BY_PROVINCE[demographics.province] ?? []).map((value) => ({
                  value,
                  label: value,
                }))}
              />
              <FloatingSelect
                label="Disability Status"
                value={demographics.disabilityStatus}
                onChange={(value) =>
                  setDemographics((current) => ({ ...current, disabilityStatus: value }))
                }
                options={DISABILITY_OPTIONS.map((value) => ({ value, label: value }))}
              />
            </div>
            <button
              type="button"
              onClick={save}
              className="mt-5 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Save Profile
            </button>
          </section>
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-brand-navy">Change Password</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PasswordInput label="New password" autoComplete="new-password" />
              <PasswordInput label="Confirm password" autoComplete="new-password" />
            </div>
            <button
              type="button"
              onClick={() => toast.success("Password updated")}
              className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
            >
              Update Password
            </button>
          </section>
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-brand-navy">My Certificates</h2>
            {certificates.length ? (
              <div className="mt-4 space-y-3">
                {certificates.map((course) => (
                  <div
                    key={course.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-muted p-4"
                  >
                    <BookOpen className="h-5 w-5 text-brand-purple" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-brand-navy">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => download(course.title)}
                      aria-label={`Download ${course.title}`}
                      className="rounded-lg bg-brand-navy p-2 text-primary-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Complete a course to automatically unlock its certificate.
              </p>
            )}
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-brand-navy">My Badges</h2>
            {badges.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div key={badge} className="rounded-2xl bg-surface-yellow p-3 text-center">
                    <Award className="mx-auto h-7 w-7 text-brand-yellow" />
                    <p className="mt-1 text-xs font-bold text-brand-navy">{badge}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Your earned badges will appear here.
              </p>
            )}
          </section>
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-brand-navy">Notifications</h2>
            <div className="mt-3 space-y-3">
              {preferenceLabels.map((label) => (
                <label
                  key={label}
                  className="flex items-center justify-between gap-3 text-sm font-semibold"
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[label]}
                    onChange={(event) =>
                      setPreferences((current) => ({ ...current, [label]: event.target.checked }))
                    }
                    className="h-4 w-4 accent-brand-purple"
                  />
                </label>
              ))}
            </div>
          </section>
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-brand-navy">Language</h2>
            <div className="mt-3">
              <FloatingSelect
                label="Language"
                value={language}
                onChange={(value) => {
                  setLanguage(value);
                  toast.success("Language preference saved");
                }}
                options={["English", "Bemba", "Nyanja", "Tonga"].map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </div>
          </section>
          <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-navy">
              <ShieldCheck className="h-5 w-5" /> Privacy
            </h2>
            <label className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold">
              <span>Keep my profile private</span>
              <input
                type="checkbox"
                checked={privateProfile}
                onChange={(event) => setPrivateProfile(event.target.checked)}
                className="h-4 w-4 accent-brand-purple"
              />
            </label>
          </section>
        </aside>
      </div>
    </main>
  );
}
export default Profile;
