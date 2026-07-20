import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Search, Users, Trophy, Sparkles, Award, ArrowRight, Send } from "lucide-react";
import { apiGet, API_URL } from "@/lib/api";
import { AMBASSADOR_REQUIREMENTS } from "@/lib/clubs-catalog";
import { getCategoryStyle, getCategoryLabel, CATEGORY_OPTIONS } from "@/lib/club-category-styles";
import { useClubs } from "@/contexts/ClubsContext";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";


function ClubsIndex() {
  const { joinedClubId, joinClub } = useClubs();
  const { isAuthenticated } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    apiGet("/clubs")
      .then((data) => setClubs(data.clubs))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      if (category && c.category !== category) return false;
      const q = search.trim().toLowerCase();
      if (q && !`${c.name} ${c.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [clubs, search, category]);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      {/* Hero banner */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple to-brand-pink p-8 text-white sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" /> Clubs & Leadership
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          Find your people. Lead the change.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Join a club, build leadership skills, take on challenges and represent your community as
          an A-LINKS Ambassador.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-purple transition-transform hover:scale-105"
          >
            <Trophy className="h-4 w-4" /> View Challenges
          </Link>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/30"
          >
            <Award className="h-4 w-4" /> Leaderboard
          </Link>
        </div>
      </section>

      {/* My club banner */}
      {joinedClubId && (
        <Link
          to={`/clubs/${encodeURIComponent(joinedClubId)}`}
          className="mt-6 flex items-center justify-between rounded-2xl bg-surface-mint px-5 py-4 transition-transform hover:scale-[1.01]"
        >
          <span className="text-sm font-bold text-brand-navy">
            You're a member of a club — view My Club
          </span>
          <ArrowRight className="h-5 w-5 text-brand-teal" />
        </Link>
      )}

      {/* Filters */}
      <section className="mt-8 rounded-3xl bg-card p-5 shadow-sm sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name or category..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
          />
        </div>
        <div className="mt-4">
          <CategorySelect value={category} onChange={setCategory} />
        </div>
      </section>

      {/* Club cards */}
      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Couldn't load clubs" message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No clubs found" message="Clear the search or category filter." />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => {
            const style = getCategoryStyle(club.category);
            const joined = joinedClubId === club.id;
            return (
              <div key={club.id} className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-sm">
                <div className={`flex h-20 items-center justify-center ${style.banner}`}>
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className={`w-fit rounded-full ${style.surface} ${style.text} px-2.5 py-0.5 text-[11px] font-bold`}>
                    {getCategoryLabel(club.category)}
                  </span>
                  <h3 className="mt-2 font-extrabold text-brand-navy">{club.name}</h3>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground">{club.description}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> {club._count.members} members
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/clubs/${encodeURIComponent(club.id)}`}
                      className="flex-1 rounded-xl border border-border px-3 py-2 text-center text-sm font-bold text-foreground transition-colors hover:bg-muted"
                    >
                      View
                    </Link>
                    {joined ? (
                      <span className="flex-1 rounded-xl bg-surface-mint px-3 py-2 text-center text-sm font-bold text-brand-teal">
                        Joined
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error("Register or login to join a club");
                            return;
                          }
                          joinClub(club.id);
                          toast.success("You joined the club!");
                        }}
                        className="flex-1 rounded-xl bg-brand-navy px-3 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AmbassadorSection />
    </main>
  );
}

function CategorySelect({ value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold text-muted-foreground">Category</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
      >
        <option value="">All Categories</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
    </label>
  );
}

function AmbassadorSection() {
  const { user, isAuthenticated } = useAuth();
  const [why, setWhy] = useState("");
  const [change, setChange] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const apply = async () => {
    if (!isAuthenticated) {
      toast.error("Register or login to apply");
      return;
    }
    if (!why.trim()) {
      toast.error("Please share your motivation");
      return;
    }
    setSubmitting(true);
    try {
      const motivation = change.trim() ? `${why.trim()}\n\nThe change I will make: ${change.trim()}` : why.trim();
      const res = await fetch(`${API_URL}/ambassadors/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ motivation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
      toast.success("Ambassador application submitted");
    } catch (err) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section id="ambassador" className="mt-12 grid gap-6 rounded-3xl bg-surface-lavender p-6 sm:p-8 lg:grid-cols-2">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-3 py-1 text-xs font-bold text-white">
          <Award className="h-3.5 w-3.5" /> Ambassador Programme
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-brand-navy">Become an A-LINKS Ambassador</h2>
        <p className="mt-2 text-sm text-foreground/80">
          Ambassadors are youth leaders who champion A-LINKS in their schools and communities.
        </p>
        <h3 className="mt-6 text-sm font-extrabold text-brand-navy">Requirements</h3>
        <ul className="mt-3 space-y-2">
          {AMBASSADOR_REQUIREMENTS.map((req) => (
            <li key={req} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
              {req}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        {submitted ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-mint">
              <Award className="h-8 w-8 text-brand-teal" />
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-brand-navy">Application submitted!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you{user?.firstName ? `, ${user.firstName}` : ""}. We'll review your application soon.
            </p>
            <Link
              to="/ambassador"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple hover:underline"
            >
              Track your application in the Ambassador Hub <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-brand-navy">Apply now</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadField label="Name" value={user ? `${user.firstName} ${user.lastName}` : "Guest"} />
              <ReadField label="School" value={user?.schoolName ?? "—"} />
            </div>
            <ReadField label="Grade" value={user?.grade ? `Grade ${user.grade}` : "—"} />
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-brand-navy">Why do you want to be an ambassador?</span>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                placeholder="Share your motivation..."
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-brand-navy">What change will you make?</span>
              <textarea
                value={change}
                onChange={(e) => setChange(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
                placeholder="Describe the impact you'll create..."
              />
            </label>
            <button
              type="button"
              onClick={apply}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit Application"}
            </button>
            <Link
              to="/ambassador"
              className="block text-center text-xs font-bold text-brand-purple hover:underline"
            >
              Already applied? Visit the Ambassador Hub →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ReadField({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-brand-navy">{label}</span>
      <div className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export default ClubsIndex;
