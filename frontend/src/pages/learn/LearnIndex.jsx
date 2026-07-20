import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Search, BookOpen, PlayCircle, GraduationCap } from "lucide-react";
import { SUBJECTS, getSubject } from "@/lib/learn-catalog";
import { apiGet } from "@/lib/api";
import { useProgress } from "@/contexts/ProgressContext";
import { EmptyState } from "@/components/EmptyState";

const GRADES = [5, 6, 7, 8, 9, 10, 11, 12];

// Map friendly URL aliases to internal subject ids.
const SUBJECT_ALIASES = {
  health: "health_wellbeing",
  "health-wellbeing": "health_wellbeing",
  "digital-safety": "digital_safety",
  "life-skills": "life_skills",
  "civic-education": "civic_education",
  "career-guidance": "career_guidance",
};

function LearnIndex() {
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const initialSubject = (() => {
    if (!subjectParam) return "all";
    const mapped = SUBJECT_ALIASES[subjectParam] ?? subjectParam;
    return SUBJECTS.some((s) => s.id === mapped) ? mapped : "all";
  })();

  const { courseProgress, cacheCourses } = useProgress();
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("all");
  const [subject, setSubject] = useState(initialSubject);

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    apiGet("/courses")
      .then((data) => {
        if (active) { setCourses(data.courses || []); cacheCourses(data.courses || []); }
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "Failed to load courses");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (grade !== "all" && c.grade !== grade) return false;
      if (subject !== "all" && c.subject !== subject) return false;
      const q = search.trim().toLowerCase();
      if (q && !`${c.title} ${c.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [courses, search, grade, subject]);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">Learning Hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Explore lessons, videos, quizzes and activities. Pick a subject and start learning.
        </p>
      </header>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
        />
      </div>

      {/* Grade tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        <FilterTab active={grade === "all"} onClick={() => setGrade("all")}>
          All Grades
        </FilterTab>
        {GRADES.map((g) => (
          <FilterTab key={g} active={grade === g} onClick={() => setGrade(g)}>
            Grade {g}
          </FilterTab>
        ))}
      </div>

      {/* Subject chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={subject === "all"} onClick={() => setSubject("all")} dot="bg-brand-navy">
          All Subjects
        </Chip>
        {SUBJECTS.filter((s, i, arr) => arr.findIndex((x) => x.label === s.label) === i).map(
          (s) => (
            <Chip key={s.id} active={subject === s.id} onClick={() => setSubject(s.id)} dot={s.dot}>
              {s.label}
            </Chip>
          ),
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && loadError && (
        <EmptyState
          title="Couldn't load courses"
          message={loadError}
        />
      )}

      {/* Course grid */}
      {!isLoading && !loadError && (
        filtered.length === 0 ? (
          <EmptyState
            title="No courses found"
            message="Try a different subject, grade or search phrase."
          />
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const subj = getSubject(course.subject);
              const progress = courseProgress(course.id);
              return (
                <Link
                  key={course.id}
                  to={`/learn/${course.id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-sm transition-transform hover:-translate-y-1"
                >
                  <div className={`flex h-24 items-center justify-center ${subj.banner}`}>
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full ${subj.surface} ${subj.text} px-2.5 py-0.5 text-[11px] font-bold`}
                      >
                        {subj.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                        <GraduationCap className="h-3 w-3" /> Grade {course.grade}
                      </span>
                    </div>
                    <h3 className="mt-3 font-extrabold text-brand-navy">{course.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {course.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-muted-foreground">
                      {course.lessons.length} lessons
                    </p>
                    <div className="mt-2">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white transition-transform group-hover:scale-[1.02]">
                      <PlayCircle className="h-4 w-4" />
                      {progress > 0 ? "Continue" : "Start"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      )}
    </main>
  );
}

function FilterTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-4 py-1.5 text-sm font-bold transition " +
        (active ? "bg-brand-navy text-white" : "bg-card text-foreground hover:bg-muted")
      }
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, dot, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition " +
        (active
          ? "border-brand-purple bg-surface-lavender text-brand-purple"
          : "border-border bg-card text-foreground hover:bg-muted")
      }
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      {children}
    </button>
  );
}

export default LearnIndex;
