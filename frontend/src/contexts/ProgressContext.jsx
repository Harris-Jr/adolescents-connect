import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";
import { apiGet, API_URL } from "@/lib/api";

const ProgressContext = createContext(undefined);

function storageKeyFor(userId) {
  return userId ? `alinks-progress-${userId}` : null;
}

const EMPTY_STATE = {
  completedLessons: [],
  badges: [],
  quizResults: {},
};

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [state, setState] = useState(EMPTY_STATE);
  const [courseCache, setCourseCache] = useState({});
  const [dbPoints, setDbPoints] = useState(0);

  // Load this specific user's progress whenever the logged-in
  // user changes (login, logout, switching accounts).
  useEffect(() => {
    const key = storageKeyFor(userId);
    if (!key) {
      setState(EMPTY_STATE);
      return;
    }
    try {
      const raw = window.localStorage.getItem(key);
      setState(raw ? JSON.parse(raw) : EMPTY_STATE);
    } catch {
      setState(EMPTY_STATE);
    }
  }, [userId]);

  // Fetch real points from DB on login
  useEffect(() => {
    if (!userId) { setDbPoints(0); return; }
    const tok = getAccessToken();
    if (!tok) return;
    fetch(`${API_URL}/users/me/points`, {
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then((r) => r.json())
      .then((data) => setDbPoints(data.points ?? 0))
      .catch(() => {/* non-fatal */});
  }, [userId]);

  const persist = useCallback(
    (next) => {
      const key = storageKeyFor(userId);
      if (!key) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [userId],
  );

  // Fetch and cache a course's real lesson list from the API
  // so progress is calculated against real database lessons,
  // not the old static catalog file.
  const cacheCourses = useCallback((courseList) => {
    if (!Array.isArray(courseList) || courseList.length === 0) return;
    setCourseCache((prev) => {
      const next = { ...prev };
      for (const c of courseList) {
        next[c.id] = c;
      }
      return next;
    });
  }, []);

  const ensureCourseLoaded = useCallback(
    async (courseId) => {
      if (courseCache[courseId]) return courseCache[courseId];
      try {
        const data = await apiGet(`/courses/${courseId}`);
        setCourseCache((prev) => ({ ...prev, [courseId]: data.course }));
        return data.course;
      } catch {
        return null;
      }
    },
    [courseCache],
  );

  useEffect(() => {
    // Best-effort prefetch: nothing to do until a course is asked for.
  }, []);

  const completeLesson = useCallback(
    (courseId, lessonId) => {
      setState((prev) => {
        const key = `${courseId}/${lessonId}`;
        if (prev.completedLessons.includes(key)) return prev;
        const next = {
          ...prev,
          completedLessons: [...prev.completedLessons, key],
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isLessonComplete = useCallback(
    (courseId, lessonId) =>
      state.completedLessons.includes(`${courseId}/${lessonId}`),
    [state.completedLessons],
  );

  // Synchronous progress based on whatever is currently cached.
  // Pages should call ensureCourseLoaded(courseId) once (e.g. via
  // the course detail/lesson page) so this has real lesson counts.
  const courseProgress = useCallback(
    (courseId) => {
      const course = courseCache[courseId];
      if (!course || !course.lessons || course.lessons.length === 0) return 0;
      const done = course.lessons.filter((l) =>
        state.completedLessons.includes(`${courseId}/${l.id}`),
      ).length;
      return Math.round((done / course.lessons.length) * 100);
    },
    [state.completedLessons, courseCache],
  );

  const isCourseComplete = useCallback(
    (courseId) => courseProgress(courseId) === 100,
    [courseProgress],
  );

  const saveQuizResult = useCallback(
    (quizId, result) => {
      setState((prev) => {
        const next = {
          ...prev,
          quizResults: { ...prev.quizResults, [quizId]: result },
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const getQuizResult = useCallback(
    (quizId) => state.quizResults[quizId],
    [state.quizResults],
  );

  const localPoints = useMemo(
    () =>
      Object.values(state.quizResults).reduce(
        (sum, r) => sum + (r.points || 0),
        0,
      ),
    [state.quizResults],
  );

  // Prefer DB points when available (synced on login), fall back to localStorage
  const totalPoints = dbPoints > 0 ? dbPoints : localPoints;

  const awardBadge = useCallback(
    (badge) => {
      setState((prev) => {
        if ((prev.badges || []).includes(badge)) return prev;
        const next = { ...prev, badges: [...(prev.badges || []), badge] };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const value = {
    completeLesson,
    isLessonComplete,
    courseProgress,
    isCourseComplete,
    saveQuizResult,
    getQuizResult,
    totalPoints,
    completedCount: state.completedLessons.length,
    completedLessons: state.completedLessons,
    badges: state.badges || [],
    awardBadge,
    ensureCourseLoaded,
    cacheCourses,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
