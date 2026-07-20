import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

const ClubsContext = createContext(undefined);

const PROGRESS_KEY = "alinks-challenge-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : { joinedChallenges: [], completedChallenges: [], challengeProgress: {} };
  } catch {
    return { joinedChallenges: [], completedChallenges: [], challengeProgress: {} };
  }
}

function saveProgress(data) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export function ClubsProvider({ children }) {
  const { user } = useAuth();

  const [joinedClubId, setJoinedClubId] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [progress, setProgress] = useState(loadProgress);

  // Restore membership on mount / user change
  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) return;
    fetch(`${API_URL}/clubs/mine`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const clubs = data.clubs ?? [];
        setJoinedClubId(clubs.length > 0 ? clubs[0].id : null);
      })
      .catch((err) => console.error("getMyClubs error:", err));
  }, [user]);

  const joinClub = useCallback(async (clubId) => {
    const tok = getAccessToken();
    if (!tok) return;
    setMembershipLoading(true);
    try {
      const res = await fetch(`${API_URL}/clubs/${encodeURIComponent(clubId)}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.ok || res.status === 409) {
        setJoinedClubId(clubId);
      }
    } catch (err) {
      console.error("joinClub error:", err);
    } finally {
      setMembershipLoading(false);
    }
  }, []);

  const leaveClub = useCallback(async () => {
    const tok = getAccessToken();
    if (!tok || !joinedClubId) return;
    setMembershipLoading(true);
    try {
      await fetch(`${API_URL}/clubs/${encodeURIComponent(joinedClubId)}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tok}` },
      });
      setJoinedClubId(null);
    } catch (err) {
      console.error("leaveClub error:", err);
    } finally {
      setMembershipLoading(false);
    }
  }, [joinedClubId]);

  const joinChallenge = useCallback((challengeId) => {
    setProgress((prev) => {
      if (prev.joinedChallenges.includes(challengeId)) return prev;
      const next = {
        ...prev,
        joinedChallenges: [...prev.joinedChallenges, challengeId],
        challengeProgress: { ...prev.challengeProgress, [challengeId]: prev.challengeProgress[challengeId] ?? 0 },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const advanceChallenge = useCallback((challengeId, totalSteps) => {
    setProgress((prev) => {
      const done = Math.min((prev.challengeProgress[challengeId] ?? 0) + 1, totalSteps);
      const completed = done >= totalSteps;
      const next = {
        ...prev,
        challengeProgress: { ...prev.challengeProgress, [challengeId]: done },
        completedChallenges:
          completed && !prev.completedChallenges.includes(challengeId)
            ? [...prev.completedChallenges, challengeId]
            : prev.completedChallenges,
        joinedChallenges: completed
          ? prev.joinedChallenges.filter((c) => c !== challengeId)
          : prev.joinedChallenges,
      };
      saveProgress(next);
      // Persist completion to DB
      if (completed && !prev.completedChallenges.includes(challengeId)) {
        const tok = getAccessToken();
        if (tok) {
          fetch(`${API_URL}/challenges/${encodeURIComponent(challengeId)}/complete`, {
            method: "POST",
            headers: { Authorization: `Bearer ${tok}` },
          }).catch((err) => console.error("completeChallenge error:", err));
        }
      }
      return next;
    });
  }, []);

  const challengeStepsDone = useCallback(
    (challengeId) => progress.challengeProgress[challengeId] ?? 0,
    [progress.challengeProgress]
  );

  const value = {
    joinedClubId,
    membershipLoading,
    joinClub,
    leaveClub,
    joinedChallenges: progress.joinedChallenges,
    completedChallenges: progress.completedChallenges,
    joinChallenge,
    challengeStepsDone,
    advanceChallenge,
    challengePoints: 0,
  };

  return <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>;
}

export function useClubs() {
  const ctx = useContext(ClubsContext);
  if (!ctx) throw new Error("useClubs must be used within a ClubsProvider");
  return ctx;
}
