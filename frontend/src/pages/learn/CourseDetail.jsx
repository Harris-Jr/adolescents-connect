import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Activity,
  HelpCircle,
  Lock,
  CheckCircle2,
  GraduationCap,
  Award,
} from "lucide-react";
import { getSubject } from "@/lib/learn-catalog";
import { apiGet } from "@/lib/api";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const typeIcon = {
  video: Video,
  reading: FileText,
  activity: Activity,
  quiz: HelpCircle,
};

const typeLabel = {
  video: "Video",
  reading: "Reading",
  activity: "Activity",
  quiz: "Quiz",
};

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl p-12 text-center">
      <h1 className="text-2xl font-extrabold text-brand-navy">Course not found</h1>
      <Link to="/learn" className="mt-4 inline-block font-bold text-brand-purple">
        Back to Learning Hub
      </Link>
    </div>
  );
}

function Loading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      <div className="mt-5 h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-8 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  );
}

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const { courseProgress, isLessonComplete, isCourseComplete, awardBadge, cacheCourses } =
    useProgress();
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    apiGet(`/courses/${courseId}`)
      .then((data) => {
        if (!active) return;
        setCourse(data.course);
        cacheCourses([data.course]);
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "Failed to load course");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseId, cacheCourses]);

  useEffect(() => {
    if (course && isCourseComplete(course.id)) {
      awardBadge(`${course.title} Graduate`);
    }
  }, [course, isCourseComplete, awardBadge]);

  if (isLoading) return <Loading />;
  if (loadError || !course) return <NotFound />;

  const subj = getSubject(course.subject);
  const progress = courseProgress(course.id);
  const complete = isCourseComplete(course.id);
  const firstIncomplete =
    course.lessons.find((l) => !isLessonComplete(course.id, l.id)) ?? course.lessons[0];

  const downloadCertificate = () => {
    const learnerName =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
      "A-LINKS Learner";
    const completionDate = new Date().toLocaleDateString();
    const escapeHtml = (value) =>
      value.replace(
        /[&<>'"]/g,
        (character) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ??
          character,
      );
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>A-LINKS Certificate</title><style>body{margin:0;padding:48px;background:#f5f5f5;font-family:Arial,sans-serif;color:#13233f}.certificate{max-width:900px;margin:auto;padding:72px 56px;text-align:center;background:white;border:12px double #6d3fc0}.brand{font-size:28px;font-weight:800;letter-spacing:.12em}.eyebrow{margin-top:48px;font-size:18px;text-transform:uppercase;letter-spacing:.18em;color:#6d3fc0}h1{font-size:48px;margin:14px 0 30px}.statement{font-size:22px;line-height:1.7}.name{font-size:34px;font-weight:800;border-bottom:2px solid #e15b94;display:inline-block;padding:0 24px 8px}.course{font-size:28px;font-weight:800}.date{margin-top:44px;font-size:16px;color:#596579}</style></head><body><main class="certificate"><div class="brand">A-LINKS</div><div class="eyebrow">Certificate of Completion</div><h1>Achievement Award</h1><p class="statement">This certifies that</p><div class="name">${escapeHtml(learnerName)}</div><p class="statement">has successfully completed</p><div class="course">${escapeHtml(course.title)}</div><p class="date">Completion date: ${escapeHtml(completionDate)}</p></main></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${course.id}-certificate.html`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Certificate downloaded");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        to="/learn"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-purple"
      >
        <ArrowLeft className="h-4 w-4" /> Learning Hub
      </Link>

      {/* Banner */}
      <div
        className={`mt-4 flex items-center gap-4 rounded-3xl ${subj.banner} p-6 text-white sm:p-8`}
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <BookOpen className="h-8 w-8" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
              {subj.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
              <GraduationCap className="h-3 w-3" /> Grade {course.grade}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{course.title}</h1>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground sm:text-base">{course.description}</p>

      {/* Progress + start */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>{course.lessons.length} lessons</span>
            <span>{progress}% complete</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <Link
          to={`/learn/${course.id}/${firstIncomplete.id}`}
          className="rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
        >
          {progress > 0 ? "Continue Course" : "Start Course"}
        </Link>
      </div>

      {/* Certificate preview */}
      {complete && (
        <div className="mt-6 overflow-hidden rounded-3xl border-2 border-brand-yellow bg-surface-yellow p-6 text-center">
          <Award className="mx-auto h-12 w-12 text-brand-yellow" />
          <h2 className="mt-2 text-lg font-extrabold text-brand-navy">Certificate of Completion</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Congratulations! You have completed <strong>{course.title}</strong>.
          </p>
          <button
            type="button"
            onClick={downloadCertificate}
            className="mt-4 rounded-xl bg-brand-navy px-5 py-2 text-sm font-bold text-white"
          >
            Download Certificate
          </button>
        </div>
      )}

      {/* Lessons list */}
      <h2 className="mt-8 text-lg font-extrabold text-brand-navy">Lessons</h2>
      <ol className="mt-3 space-y-2">
        {course.lessons.map((lesson, i) => {
          const Icon = typeIcon[lesson.type];
          const done = isLessonComplete(course.id, lesson.id);
          const prevDone = i === 0 || isLessonComplete(course.id, course.lessons[i - 1].id);
          const locked = !prevDone && !done;
          const inner = (
            <div
              className={
                "flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm transition " +
                (locked ? "opacity-60" : "hover:bg-muted")
              }
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-extrabold text-brand-navy">
                {i + 1}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${subj.surface} ${subj.text}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-brand-navy">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">
                  {typeLabel[lesson.type]} · {lesson.duration}
                </p>
              </div>
              {done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-teal" />
              ) : locked ? (
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <span className="shrink-0 text-xs font-bold text-brand-purple">Open</span>
              )}
            </div>
          );
          return (
            <li key={lesson.id}>
              {locked ? inner : <Link to={`/learn/${course.id}/${lesson.id}`}>{inner}</Link>}
            </li>
          );
        })}
      </ol>
    </main>
  );
}

export default CourseDetail;
