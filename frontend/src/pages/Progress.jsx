import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Award, BookOpen, CircleCheck, Coins } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { apiGet } from "@/lib/api";
function Progress() {
  const { completedCount, totalPoints, badges, courseProgress, cacheCourses } = useProgress();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiGet("/courses")
      .then((data) => {
        if (!active) return;
        const list = data.courses || [];
        setCourses(list);
        // prime the progress cache so courseProgress() has real lesson counts
        cacheCourses(list);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load courses");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cacheCourses]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-navy">My Progress</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Track your learning progress and achievements.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Lessons", completedCount, CircleCheck],
          ["Points", totalPoints, Coins],
          ["Badges", badges.length, Award],
        ].map(([label, value, Icon]) => {
          const StatIcon = Icon;
          return (
            <div key={String(label)} className="rounded-2xl bg-card p-4 shadow-sm">
              <StatIcon className="h-5 w-5 text-brand-purple" />
              <p className="mt-2 text-2xl font-extrabold text-brand-navy">{String(value)}</p>
              <p className="text-xs text-muted-foreground">{String(label)}</p>
            </div>
          );
        })}
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-extrabold text-brand-navy">Courses</h2>
        {loading ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : error ? (
          <p className="mt-4 text-sm font-semibold text-brand-pink">{error}</p>
        ) : courses.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No courses available yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {courses.map((course) => {
              const progress = courseProgress(course.id);
              return (
                <Link
                  key={course.id}
                  to={`/learn/${course.id}`}
                  className="rounded-2xl bg-card p-5 shadow-sm transition hover:-translate-y-0.5"
                >
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                    <BookOpen className="h-5 w-5 text-brand-purple" />
                    <h3 className="truncate font-bold text-brand-navy">{course.title}</h3>
                    <span className="text-xs font-bold text-brand-purple">{progress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-purple"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
export default Progress;
