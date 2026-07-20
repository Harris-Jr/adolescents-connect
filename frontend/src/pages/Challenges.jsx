import { useState, useEffect } from "react";
import { Trophy, Coins, Calendar, CheckCircle2, Target, Plus } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useClubs } from "@/contexts/ClubsContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

function Challenges() {
  const {
    joinedChallenges,
    completedChallenges,
    joinChallenge,
    challengeStepsDone,
    advanceChallenge,
  } = useClubs();
  const { isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    apiGet("/challenges")
      .then((data) => setChallenges(data.challenges))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const mine = challenges.filter((ch) => joinedChallenges.includes(ch.id));
  const done = challenges.filter((ch) => completedChallenges.includes(ch.id));

  // Deadline formatting
  function formatDeadline(iso) {
    return new Date(iso).toLocaleDateString("en-ZM", { day: "numeric", month: "short", year: "numeric" });
  }

  // Each challenge from DB has no "steps" field — we default to 5 for progress tracking
  function getSteps(ch) { return ch.steps ?? 5; }

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal to-brand-blue p-8 text-white sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          <Trophy className="h-3.5 w-3.5" /> Challenges
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Take on a challenge</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Push yourself, earn points and unlock badges. Every challenge you complete moves you up the leaderboard.
        </p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <TabBtn active={tab === "active"} onClick={() => setTab("active")}>Active Challenges</TabBtn>
        <TabBtn active={tab === "mine"} onClick={() => setTab("mine")}>My Challenges ({mine.length})</TabBtn>
        <TabBtn active={tab === "completed"} onClick={() => setTab("completed")}>Completed ({done.length})</TabBtn>
      </div>

      {tab === "active" && (
        loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-56 animate-pulse rounded-3xl bg-muted" />)}
          </div>
        ) : error ? (
          <p className="mt-12 text-center text-sm text-destructive">{error}</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch) => {
              const joined = joinedChallenges.includes(ch.id);
              const completed = completedChallenges.includes(ch.id);
              return (
                <article key={ch.id} className="flex flex-col rounded-3xl bg-card p-6 shadow-sm">
                  {ch.subject && (
                    <span className="w-fit rounded-full bg-surface-blue px-2.5 py-0.5 text-[11px] font-bold text-brand-blue">
                      {ch.subject}
                    </span>
                  )}
                  <h3 className="mt-3 font-extrabold text-brand-navy">{ch.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{ch.description}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-brand-yellow" /> {ch.points} pts
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {formatDeadline(ch.deadline)}
                    </span>
                  </div>
                  {completed ? (
                    <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-surface-mint px-4 py-2.5 text-sm font-bold text-brand-teal">
                      <CheckCircle2 className="h-4 w-4" /> Completed
                    </span>
                  ) : joined ? (
                    <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-surface-lavender px-4 py-2.5 text-sm font-bold text-brand-purple">
                      Joined — see My Challenges
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) { toast.error("Register or login to join a challenge"); return; }
                        joinChallenge(ch.id);
                        toast.success("Challenge joined!");
                      }}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                    >
                      <Plus className="h-4 w-4" /> Join Challenge
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )
      )}

      {tab === "mine" && (
        mine.length === 0 ? (
          <Empty text="You haven't joined any challenges yet." />
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {mine.map((ch) => {
              const steps = getSteps(ch);
              const stepsDone = challengeStepsDone(ch.id);
              const pct = Math.round((stepsDone / steps) * 100);
              return (
                <article key={ch.id} className="rounded-3xl bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-brand-navy">{ch.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-yellow">
                      <Coins className="h-3.5 w-3.5" /> {ch.points}
                    </span>
                  </div>
                  {ch.subject && <p className="mt-1 text-sm text-muted-foreground">{ch.subject}</p>}
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>{stepsDone} / {steps} steps</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-blue"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    onClick={() => { advanceChallenge(ch.id, steps); toast.success("Progress saved!"); }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                  >
                    <Target className="h-4 w-4" /> Log progress
                  </button>
                </article>
              );
            })}
          </div>
        )
      )}

      {tab === "completed" && (
        done.length === 0 ? (
          <Empty text="No completed challenges yet. Keep going!" />
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {done.map((ch) => (
              <article key={ch.id} className="rounded-3xl bg-surface-mint p-6">
                <CheckCircle2 className="h-8 w-8 text-brand-teal" />
                <h3 className="mt-3 font-extrabold text-brand-navy">{ch.title}</h3>
                {ch.subject && <p className="mt-1 text-sm text-foreground/70">{ch.subject}</p>}
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal">
                  <Coins className="h-4 w-4" /> +{ch.points} points earned
                </p>
              </article>
            ))}
          </div>
        )
      )}
    </main>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={"rounded-full px-4 py-2 text-sm font-bold transition " +
        (active ? "bg-brand-navy text-white" : "bg-card text-foreground hover:bg-muted")}
    >
      {children}
    </button>
  );
}

function Empty({ text }) {
  return <p className="mt-12 text-center text-sm text-muted-foreground">{text}</p>;
}

export default Challenges;
