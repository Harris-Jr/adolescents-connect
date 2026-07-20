import { useEffect, useState } from "react";
import { Award, Coins, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useClubs } from "@/contexts/ClubsContext";
import { API_URL } from "@/lib/api";

const GRADES = [5, 6, 7, 8, 9, 10, 11, 12];
const LEADERBOARD_SCOPES = ["National", "Provincial", "School", "Friends"];

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const RANK_COLORS = ["bg-brand-yellow text-brand-navy", "bg-muted text-foreground", "bg-surface-peach text-brand-pink"];

function Leaderboard() {
  const { user } = useAuth();
  const { totalPoints } = useProgress();
  const { challengePoints } = useClubs();
  const [scope, setScope] = useState("National");
  const [grade, setGrade] = useState("all");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const myPoints = totalPoints + challengePoints;

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/leaderboard`)
      .then((r) => r.json())
      .then((data) => { setLeaderboard(data.leaderboard ?? []); setError(null); })
      .catch(() => setError("Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leaderboard.filter((e) => grade === "all" || e.grade === Number(grade));

  const myEntry = leaderboard.find((e) => e.userId === user?.id);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow to-brand-pink p-8 text-white sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          <Award className="h-3.5 w-3.5" /> Leaderboard
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Top learners</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Earn points by completing lessons, quizzes and challenges to climb the rankings.
        </p>
      </section>

      {/* Scope tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {LEADERBOARD_SCOPES.map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={
              "rounded-full px-4 py-2 text-sm font-bold transition " +
              (scope === s ? "bg-brand-navy text-white" : "bg-card text-foreground hover:bg-muted")
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grade filter */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={grade === "all"} onClick={() => setGrade("all")}>All Grades</Chip>
        {GRADES.map((g) => (
          <Chip key={g} active={grade === g} onClick={() => setGrade(g)}>Grade {g}</Chip>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Trophy className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-lg font-bold text-foreground">No rankings yet</h2>
            <p className="mt-2 mx-auto max-w-md text-sm text-muted-foreground">
              Complete quizzes and challenges to be the first on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((entry) => (
              <div
                key={entry.userId}
                className={
                  "flex items-center gap-4 px-5 py-3.5 " +
                  (entry.userId === user?.id ? "bg-surface-lavender" : "")
                }
              >
                <span
                  className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold " +
                    (RANK_COLORS[entry.rank - 1] ?? "bg-muted text-foreground")
                  }
                >
                  {entry.rank}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-xs font-extrabold text-white">
                  {initials(entry.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-brand-navy">
                    {entry.name}{entry.userId === user?.id ? " (You)" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.grade ? `Grade ${entry.grade}` : ""}
                    {entry.grade && entry.school ? " · " : ""}
                    {entry.school ?? ""}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-brand-navy">
                  <Coins className="h-4 w-4 text-brand-yellow" />
                  {entry.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current user rank */}
      <div className="mt-4 rounded-2xl border-2 border-brand-purple bg-surface-lavender px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-xs font-extrabold text-white">
            {user?.firstName ? initials(`${user.firstName} ${user.lastName}`) : "ME"}
          </span>
          <div>
            <span className="block text-sm font-extrabold text-brand-navy">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : "You"} (You)
            </span>
            <span className="block text-xs text-muted-foreground">
              <Coins className="mr-1 inline h-3 w-3" />
              {myEntry ? `Rank #${myEntry.rank} · ` : ""}{myPoints.toLocaleString()} points earned
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1.5 text-xs font-bold transition " +
        (active
          ? "border-brand-purple bg-surface-lavender text-brand-purple"
          : "border-border bg-card text-foreground hover:bg-muted")
      }
    >
      {children}
    </button>
  );
}

export default Leaderboard;
