import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users, ArrowLeft, LogOut } from "lucide-react";
import { apiGet } from "@/lib/api";
import { getCategoryStyle, getCategoryLabel } from "@/lib/club-category-styles";
import { useClubs } from "@/contexts/ClubsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";


function ClubDetail() {
  const { clubId } = useParams();
  const { joinedClubId, joinClub, leaveClub, membershipLoading } = useClubs();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet(`/clubs/${encodeURIComponent(clubId)}`)
      .then((data) => setClub(data.club))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [clubId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      </main>
    );
  }

  if (error || !club) {
    return (
      <div className="mx-auto max-w-2xl p-12 text-center">
        <h1 className="text-2xl font-extrabold text-brand-navy">Club not found</h1>
        <Link to="/clubs" className="mt-4 inline-block font-bold text-brand-purple">Back to Clubs</Link>
      </div>
    );
  }

  const style = getCategoryStyle(club.category);
  const isMember = joinedClubId === club.id;

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <Link to="/clubs" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple">
        <ArrowLeft className="h-4 w-4" /> All clubs
      </Link>

      <section className={`mt-4 overflow-hidden rounded-3xl ${style.banner} p-8 text-white sm:p-10`}>
        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          {getCategoryLabel(club.category)}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{club.name}</h1>
        {(club.school || club.province) && (
          <p className="mt-1 text-sm text-white/90">
            {[club.school, club.province].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
          <Users className="h-4 w-4" /> {club._count.members} members
        </p>
      </section>

      {club.description && (
        <p className="mt-6 max-w-3xl text-sm text-foreground/80 sm:text-base">{club.description}</p>
      )}

      <div className="mt-4">
        {isMember ? (
          <button
            disabled={membershipLoading}
            onClick={async () => {
              await leaveClub();
              toast.success("You left the club");
              navigate("/clubs");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive px-4 py-2.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" /> Leave Club
          </button>
        ) : (
          <button
            disabled={membershipLoading}
            onClick={() => {
              if (!isAuthenticated) { toast.error("Login to join a club"); return; }
              joinClub(club.id);
              toast.success("You joined the club!");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
          >
            Join Club
          </button>
        )}
      </div>

      {/* Members panel — honest empty state */}
      <section className="mt-8 rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-navy">
          <Users className="h-5 w-5 text-brand-purple" /> Members
        </h2>
        {club._count.members === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No members yet — be the first to join!</p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            {club._count.members} member{club._count.members !== 1 ? "s" : ""} in this club.
          </p>
        )}
      </section>
    </main>
  );
}

export default ClubDetail;
