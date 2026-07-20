import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Sparkles,
  Heart,
  Shield,
  Users,
  Landmark,
  Briefcase,
  BookOpen,
  User,
  GraduationCap,
} from "lucide-react";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import {
  PROVINCES,
  DISTRICTS_BY_PROVINCE,
  DISABILITY_OPTIONS,
} from "@/lib/zambia-locations";

const grades = ["5", "6", "7", "8", "9", "10", "11", "12"];
const avatarColors = [
  "bg-brand-purple",
  "bg-brand-pink",
  "bg-brand-teal",
  "bg-brand-blue",
  "bg-brand-yellow",
  "bg-brand-navy",
];
const subjects = [
  "Life Skills",
  "Health & Wellbeing",
  "Digital Safety",
  "Leadership",
  "Civic Education",
  "Career Guidance",
  "SRHR",
];
const interestList = [
  {
    key: "Life Skills",
    icon: Sparkles,
    surface: "bg-surface-lavender",
    color: "text-brand-purple",
  },
  { key: "Health", icon: Heart, surface: "bg-surface-peach", color: "text-brand-pink" },
  { key: "Digital Safety", icon: Shield, surface: "bg-surface-blue", color: "text-brand-blue" },
  { key: "Leadership", icon: Users, surface: "bg-surface-mint", color: "text-brand-teal" },
  { key: "Civic Ed", icon: Landmark, surface: "bg-surface-yellow", color: "text-brand-yellow" },
  { key: "Career", icon: Briefcase, surface: "bg-surface-lilac", color: "text-brand-purple" },
];

function Onboarding() {
  const { user, updateUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(""); // student or teacher
  const [gender, setGender] = useState(user?.gender ?? "");
  const [grade, setGrade] = useState(user?.grade ?? "");
  const [school, setSchool] = useState(user?.school ?? "");
  const [dob, setDob] = useState(user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "");
  const [province, setProvince] = useState(user?.province ?? "");
  const [district, setDistrict] = useState(user?.district ?? "");
  const [disability, setDisability] = useState(user?.disabilityStatus ?? "");
  const [teacherSubjects, setTeacherSubjects] = useState(user?.subjects ?? []);
  const [staffId, setStaffId] = useState(user?.staffId ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? avatarColors[0]);
  const [interests, setInterests] = useState(user?.interests ?? []);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const tok = getAccessToken();
    if (!tok) return;
    fetch(`${API_URL}/schools`, { headers: { Authorization: `Bearer ${tok}` } })
      .then((res) => (res.ok ? res.json() : { schools: [] }))
      .then((data) => setSchools(data.schools ?? []))
      .catch(() => {});
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }
    if (user && user.onboardingComplete) {
      navigate("/dashboard/learner", { replace: true });
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen animate-pulse bg-muted" aria-label="Checking your account" />
    );
  }

  const toggleInterest = (key) =>
    setInterests((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]));

  const toggleSubject = (subject) =>
    setTeacherSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );

  const canProceedStep2 = role !== "";
  const canProceedStep3 =
    gender &&
    (role === "student"
      ? grade && school && dob && province && district && disability
      : school && teacherSubjects.length > 0);
  const canProceedStep4 = true; // Avatar selection is not required, skip
  const canProceedStep5 = true; // Interests selection is not required, skip

  const handleNext = () => {
    // Save data for current step before proceeding
    if (step === 2) {
      // Update role in context
      updateUser({ role: role === "student" ? "learner" : "teacher" });
    } else if (step === 3) {
      // Save profile data
      const profileData = { gender, province, district };
      if (role === "student") {
        profileData.grade = grade;
        profileData.dateOfBirth = dob;
        profileData.disabilityStatus = disability;
      }
      profileData.school = school;
      if (role === "teacher") {
        profileData.subjects = teacherSubjects;
        profileData.staffId = staffId;
      }
      // TODO: Call API to update profile with partial data
      // For now, just store in context state
      updateUser(profileData);
    } else if (step === 4) {
      // Save avatar
      updateUser({ avatar });
    } else if (step === 5) {
      // Save interests
      updateUser({ interests });
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const finish = async () => {
    const tok = getAccessToken();
    if (tok) {
      try {
        await fetch(`${API_URL}/users/me`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
          body: JSON.stringify({
            gender,
            grade: grade || null,
            schoolName: school || null,
            subjects: role === "teacher" ? teacherSubjects : [],
            staffId: staffId || null,
            dateOfBirth: dob || null,
            province: province || null,
            district: district || null,
            disabilityStatus: disability || null,
            onboardingDone: true,
          }),
        });
      } catch (err) {
        console.error("Failed to save onboarding:", err);
      }
    }
    updateUser({ avatar, interests, onboardingComplete: true });
    navigate(
      role === "teacher"
        ? "/dashboard/teacher"
        : user?.role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/learner",
    );
  };

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "A";
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl bg-card p-7 shadow-lg sm:p-10">
        <div className="flex flex-col items-center">
          <img src="/images/alinks-logo.jpeg" alt="A-LINKS" width={160} height={64} className="h-10 w-auto" />
          {/* Progress dots - 6 steps */}
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <span
                key={s}
                className={
                  "h-2.5 rounded-full transition-all " +
                  (s === step
                    ? "w-8 bg-brand-purple"
                    : s < step
                      ? "w-2.5 bg-brand-teal"
                      : "w-2.5 bg-border")
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-8 min-h-[260px]">
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-brand-navy">
                Welcome to A-LINKS, {user?.firstName}!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Let's get you set up. We'll be done in no time.
              </p>
              <div className="mt-8 flex justify-center">
                <span
                  className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-extrabold text-white ${avatar}`}
                >
                  {initials}
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-brand-navy">
                Are you a student or a teacher?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose your path to personalize your experience.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { value: "student", label: "Student", icon: User },
                  { value: "teacher", label: "Teacher", icon: GraduationCap },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={
                      "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition " +
                      (role === value
                        ? "border-brand-purple bg-surface-lavender"
                        : "border-border bg-background hover:border-brand-purple/40")
                    }
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        role === value ? "bg-brand-purple text-white" : "bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-sm font-bold text-foreground">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-center text-2xl font-extrabold text-brand-navy">
                Tell us about yourself
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {role === "student" ? "Help us personalize your learning journey." : "Share your teaching details."}
              </p>
              <div className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                  Gender
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>

                {role === "student" && (
                  <>
                    <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                      Date of Birth
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                      Grade
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                      >
                        <option value="" disabled>
                          Select grade
                        </option>
                        {grades.map((g) => (
                          <option key={g} value={g}>
                            Grade {g}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                    Province
                    <select
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        setDistrict("");
                      }}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                    >
                      <option value="" disabled>
                        Select province
                      </option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                    District
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!province}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {province ? "Select district" : "Pick province first"}
                      </option>
                      {(DISTRICTS_BY_PROVINCE[province] ?? []).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {role === "student" && (
                  <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                    Disability Status
                    <select
                      value={disability}
                      onChange={(e) => setDisability(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {DISABILITY_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                  School Name
                  <input
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Your school"
                    list="school-options"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                  />
                  <datalist id="school-options">
                    {schools
                      .filter((s) => !province || !s.province || s.province === province)
                      .map((s) => (
                        <option key={s.id} value={s.name} />
                      ))}
                  </datalist>
                </label>

                {role === "teacher" && (
                  <>
                    <div>
                      <p className="mb-2 text-sm font-bold text-foreground">Subject(s) Taught</p>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => {
                          const active = teacherSubjects.includes(subject);
                          return (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => toggleSubject(subject)}
                              className={
                                "rounded-full px-3 py-1.5 text-xs font-bold transition " +
                                (active
                                  ? "bg-brand-purple text-white"
                                  : "border border-border bg-background text-foreground hover:border-brand-purple/40")
                              }
                            >
                              {active && <Check className="inline h-3 w-3 mr-1" />}
                              {subject}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="flex flex-col gap-1.5 text-sm font-bold text-foreground">
                      Staff ID (optional)
                      <input
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="Your staff ID"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                      />
                    </label>

                    <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                      Your school admin will verify your account before activation.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-brand-navy">Pick your profile colour</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a colour that represents you.
              </p>
              <div className="mt-6 flex justify-center">
                <span
                  className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-extrabold text-white ${avatar}`}
                >
                  {initials}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {avatarColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatar(c)}
                    aria-label={`Choose ${c}`}
                    className={`h-10 w-10 rounded-full ${c} ring-offset-2 transition ${avatar === c ? "ring-2 ring-brand-navy" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h1 className="text-center text-2xl font-extrabold text-brand-navy">
                What are you interested in?
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Pick topics you'd like to explore.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {interestList.map(({ key, icon: Icon, surface, color }) => {
                  const active = interests.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleInterest(key)}
                      className={
                        "relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition " +
                        (active
                          ? "border-brand-purple " + surface
                          : "border-border bg-background hover:border-brand-purple/40")
                      }
                    >
                      {active && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${surface} ${color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-bold text-foreground">{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-mint text-brand-teal">
                <PartyPopper className="h-10 w-10" />
              </span>
              <h1 className="mt-5 text-2xl font-extrabold text-brand-navy">You're all set!</h1>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your A-LINKS journey starts now. Let's go learn, grow, connect and take action.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3) ||
                (step === 4 && !canProceedStep4) ||
                (step === 5 && !canProceedStep5)
              }
              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
            >
              <BookOpen className="h-4 w-4" />
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
export default Onboarding;
