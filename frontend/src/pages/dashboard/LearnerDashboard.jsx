import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  ListChecks,
  TrendingUp,
  Users,
  Trophy,
  HeartPulse,
  ShieldCheck,
  Crown,
  LifeBuoy,
  Settings,
  Search,
  Menu,
  ChevronLeft,
  PlayCircle,
  Award,
  Coins,
  CheckCircle2,
  Star,
  Calendar,
  Video,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { useProgress } from "@/contexts/ProgressContext";
import { NotificationBell } from "@/components/NotificationBell";
const navItems = [
  { label: "Home", icon: Home, to: "/dashboard/learner" },
  { label: "My Learning", icon: BookOpen, to: "/learn" },
  { label: "Quizzes", icon: ListChecks, to: "/learn" },
  { label: "My Progress", icon: TrendingUp, to: "/progress" },
  { label: "Clubs", icon: Users, to: "/clubs" },
  { label: "Challenges", icon: Trophy, to: "/challenges" },
  { label: "Healthy Futures", icon: HeartPulse, to: "/learn", search: { subject: "health" } },
  { label: "Stay Safe", icon: ShieldCheck, to: "/learn", search: { subject: "digital-safety" } },
  { label: "Leadership", icon: Crown, to: "/clubs" },
  { label: "Need Help", icon: LifeBuoy, to: "/support" },
  { label: "Settings", icon: Settings, to: "/profile" },
];
const mobileNav = navItems;
const staticCourses = [];
const badges = [];
const challenges = [];
const quickActions = [
  {
    label: "Take a Quiz",
    icon: ListChecks,
    color: "text-brand-purple",
    surface: "bg-surface-lavender",
    to: "/quiz/$quizId",
    params: { quizId: "quiz-1" },
  },
  {
    label: "Watch a Video",
    icon: Video,
    color: "text-brand-pink",
    surface: "bg-surface-peach",
    to: "/learn",
  },
  {
    label: "Join a Club",
    icon: Users,
    color: "text-brand-teal",
    surface: "bg-surface-mint",
    to: "/clubs",
  },
  {
    label: "Talk to Someone",
    icon: MessageCircle,
    color: "text-brand-blue",
    surface: "bg-surface-blue",
    to: "/support/chat",
  },
];
function LearnerDashboard() {
  const { user, logout } = useAuth();
  const { completedCount, totalPoints } = useProgress();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [topLearners, setTopLearners] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/leaderboard`)
      .then((r) => r.json())
      .then((d) => setTopLearners((d.leaderboard ?? []).slice(0, 5)))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (user && user.onboardingComplete === false) {
      navigate("/onboarding");
    }
  }, [user, navigate]);
  const name = user?.name ?? "Learner";
  const firstName = name.split(" ")[0];
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const avatarColor = user?.avatar ?? "bg-brand-purple";
  const stats = [
    {
      label: "Lessons Completed",
      value: completedCount.toString(),
      icon: CheckCircle2,
      surface: "bg-surface-mint",
      color: "text-brand-teal",
    },
    {
      label: "Badges Earned",
      value: Math.min(completedCount, badges.length).toString(),
      icon: Award,
      surface: "bg-surface-yellow",
      color: "text-brand-yellow",
    },
    {
      label: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: Coins,
      surface: "bg-surface-lavender",
      color: "text-brand-purple",
    },
    {
      label: "Club Membership",
      value: completedCount > 0 ? "1" : "0",
      icon: Users,
      surface: "bg-surface-blue",
      color: "text-brand-blue",
    },
  ];
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={
          "hidden shrink-0 flex-col border-r border-border bg-card transition-all lg:flex " +
          (collapsed ? "w-20" : "w-64")
        }
      >
        <div className="flex items-center justify-between gap-2 px-4 py-5">
          {!collapsed && (
            <img src="/images/alinks-logo.jpeg" alt="A-LINKS" width={140} height={56} className="h-9 w-auto" />
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-brand-navy transition hover:bg-muted"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {navItems.map(({ label, icon: Icon, to, search }) => (
            <Link
              key={label}
              to={search ? `${to}?${new URLSearchParams(search)}` : to}
              title={label}
              className={
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted" +
                (collapsed ? " justify-center" : "")
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className={
            "m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-pink transition hover:bg-muted " +
            (collapsed ? "justify-center" : "")
          }
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search lessons, clubs, quizzes..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
            />
          </div>
          <NotificationBell />
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold text-white ${avatarColor}`}
            >
              {initials}
            </span>
            <span className="hidden text-sm font-bold text-foreground sm:block">{firstName}</span>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6">
          {/* Welcome banner */}
          <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-purple to-brand-pink p-6 text-white sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">
                  Welcome back, {firstName}! 👋
                </h1>
                <p className="mt-1 text-sm text-white/85">Ready to learn something new today?</p>
              </div>
              {user?.grade && (
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold">
                  Grade {user.grade}
                </span>
              )}
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, surface, color }) => (
              <div key={label} className="rounded-2xl bg-card p-4 shadow-sm">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${surface} ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-2xl font-extrabold text-brand-navy">{value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-brand-navy">Continue Learning</h2>
            {staticCourses.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-card p-8 text-center shadow-sm">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">
                  You haven't started any courses yet
                </p>
                <Link
                  to="/learn"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <PlayCircle className="h-4 w-4" />
                  Explore Courses
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {staticCourses.map(({ title, subject, icon: Icon, progress, surface, color }) => (
                  <div key={title} className="flex flex-col rounded-2xl bg-card p-5 shadow-sm">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${surface} ${color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {subject}
                    </p>
                    <h3 className="mt-1 font-extrabold text-brand-navy">{title}</h3>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      to="/learn"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Badges */}
          <section>
            <h2 className="text-lg font-extrabold text-brand-navy">My Badges</h2>
            {badges.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-card p-8 text-center shadow-sm">
                <Award className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">
                  Earn your first badge by completing a lesson!
                </p>
              </div>
            ) : (
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                {badges.map(({ label, color }) => (
                  <div key={label} className="flex w-24 shrink-0 flex-col items-center text-center">
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${color} text-white shadow-md`}
                    >
                      <Award className="h-7 w-7" />
                    </span>
                    <span className="mt-2 text-xs font-bold text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Challenges */}
          <section>
            <h2 className="text-lg font-extrabold text-brand-navy">Active Challenges</h2>
            {challenges.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-card p-8 text-center shadow-sm">
                <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">
                  No active challenges yet — explore challenges to join one
                </p>
                <Link
                  to="/challenges"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <Trophy className="h-4 w-4" />
                  Explore Challenges
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {challenges.map(({ title, deadline, points, surface }) => (
                  <div key={title} className={`rounded-2xl ${surface} p-5`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-brand-navy">{title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {deadline}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-brand-purple">
                        <Star className="h-3.5 w-3.5" />
                        {points} pts
                      </span>
                    </div>
                    <Link
                      to="/challenges"
                      className="mt-4 block w-full rounded-xl bg-brand-navy px-4 py-2 text-center text-sm font-bold text-white transition-transform hover:scale-[1.01]"
                    >
                      Join
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Leaderboard */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-brand-navy">Leaderboard Preview</h2>
              <Link to="/leaderboard" className="text-xs font-bold text-brand-purple hover:underline">View all</Link>
            </div>
            {topLearners.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-card p-8 text-center shadow-sm">
                <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-sm">
                {topLearners.map((e) => (
                  <div key={e.userId} className={"flex items-center gap-3 border-b border-border/60 px-4 py-3 last:border-0" + (e.userId === user?.id ? " bg-surface-lavender" : "")}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-extrabold text-foreground">{e.rank}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-purple text-xs font-extrabold text-white">{e.name.split(" ").map((p) => p[0]).slice(0,2).join("").toUpperCase()}</span>
                    <span className="flex-1 truncate text-sm font-bold text-brand-navy">{e.name}{e.userId === user?.id ? " (You)" : ""}</span>
                    <span className="text-xs font-extrabold text-brand-yellow">{e.points.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-extrabold text-brand-navy">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quickActions.map(({ label, icon: Icon, color, surface, to, params }) => (
                <Link
                  key={label}
                  to={params?.quizId ? `/quiz/${params.quizId}` : to}
                  className="flex flex-col items-center gap-3 rounded-2xl bg-card p-5 text-center shadow-sm transition-transform hover:scale-[1.03]"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${surface} ${color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-bold text-foreground">{label}</span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-1 overflow-x-auto border-t border-border bg-card px-2 py-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mobileNav.map(({ label, icon: Icon, to, search }) => (
          <Link
            key={label}
            to={search ? `${to}?${new URLSearchParams(search)}` : to}
            className="flex min-w-20 flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-bold text-muted-foreground transition"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
export default LearnerDashboard;
