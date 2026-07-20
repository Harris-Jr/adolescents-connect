import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Video,
  FileText,
  Activity,
  HelpCircle,
} from "lucide-react";
import { getSubject } from "@/lib/learn-catalog";
import { apiGet } from "@/lib/api";
import { useProgress } from "@/contexts/ProgressContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const typeIcon = {
  video: Video,
  reading: FileText,
  activity: Activity,
  quiz: HelpCircle,
};

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl p-12 text-center">
      <h1 className="text-2xl font-extrabold text-brand-navy">Lesson not found</h1>
      <Link to="/learn" className="mt-4 inline-block font-bold text-brand-purple">
        Back to Learning Hub
      </Link>
    </div>
  );
}

function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
    </main>
  );
}

function LessonView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson, isLessonComplete, cacheCourses } = useProgress();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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
        if (active) setLoadError(err.message || "Failed to load lesson");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseId, cacheCourses]);

  if (isLoading) return <Loading />;
  if (loadError || !course) return <NotFound />;

  const index = course.lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) return <NotFound />;

  const lesson = course.lessons[index];
  const subj = getSubject(course.subject);
  const Icon = typeIcon[lesson.type];
  const done = isLessonComplete(courseId, lesson.id);
  const prev = index > 0 ? course.lessons[index - 1] : null;
  const next = index < course.lessons.length - 1 ? course.lessons[index + 1] : null;

  const handleComplete = () => {
    if (!isAuthenticated) {
      toast.error("Register or login to save your progress");
      return;
    }
    completeLesson(courseId, lesson.id);
    toast.success("Lesson completed!", { description: `You have finished ${lesson.title}` });
    if (next) {
      navigate(`/learn/${courseId}/${next.id}`);
    } else {
      navigate(`/learn/${courseId}`);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to={`/learn/${courseId}`}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-purple"
      >
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${subj.surface} ${subj.text}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Lesson {index + 1} of {course.lessons.length}
          </p>
          <h1 className="text-xl font-extrabold text-brand-navy sm:text-2xl">{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {lesson.type === "quiz" && lesson.quizId ? (
          <div className="rounded-3xl bg-surface-lavender p-8 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-brand-purple" />
            <h2 className="mt-2 text-lg font-extrabold text-brand-navy">Ready for the quiz?</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Test what you've learned in this course.
            </p>
            <Link
              to={`/quiz/${lesson.quizId}`}
              className="mt-4 inline-block rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-bold text-white"
            >
              Start Quiz
            </Link>
          </div>
        ) : (
          <>
            {lesson.videoUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-brand-navy shadow-sm">
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            {lesson.body && (
              <article
                className="prose prose-sm mt-6 max-w-none rounded-3xl bg-card p-6 text-foreground shadow-sm [&_h3]:mt-4 [&_h3]:font-extrabold [&_h3]:text-brand-navy [&_li]:ml-4 [&_li]:list-disc [&_p]:mt-3 [&_ul]:mt-2"
                dangerouslySetInnerHTML={{ __html: lesson.body }}
              />
            )}
          </>
        )}
      </div>

      {/* Mark complete */}
      <div className="mt-6 flex items-center justify-center">
        {done ? (
          <span className="inline-flex items-center gap-2 rounded-xl bg-surface-mint px-5 py-2.5 text-sm font-bold text-brand-teal">
            <CheckCircle2 className="h-5 w-5" /> Completed
          </span>
        ) : (
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            <CheckCircle2 className="h-5 w-5" /> Mark as Complete
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
        {prev ? (
          <Link
            to={`/learn/${courseId}/${prev.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/learn/${courseId}/${next.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm hover:bg-muted"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            to={`/learn/${courseId}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm hover:bg-muted"
          >
            Finish <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </main>
  );
}

export default LessonView;
