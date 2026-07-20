import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Coins,
} from "lucide-react";
import { getSubject } from "@/lib/learn-catalog";
import { apiGet } from "@/lib/api";
import { useProgress } from "@/contexts/ProgressContext";
import { toast } from "sonner";
import { useAuth, getAccessToken } from "@/contexts/AuthContext";

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl p-12 text-center">
      <h1 className="text-2xl font-extrabold text-brand-navy">Quiz not found</h1>
      <Link to="/learn" className="mt-4 inline-block font-bold text-brand-purple">
        Back to Learning Hub
      </Link>
    </div>
  );
}

function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-72 animate-pulse rounded-3xl bg-muted" />
    </main>
  );
}

function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const { saveQuizResult } = useProgress();
  const { isAuthenticated } = useAuth();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("taking");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    apiGet(`/courses/quizzes/${quizId}`)
      .then((data) => {
        if (!active) return;
        setQuiz(data.quiz);
        setAnswers(Array(data.quiz.questions.length).fill(-1));
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "Failed to load quiz");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [quizId]);

  if (isLoading) return <Loading />;
  if (loadError || !quiz) return <NotFound />;

  const subj = getSubject(quiz.subject);

  const select = (optIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optIndex;
      return next;
    });
  };

  const isLast = current === quiz.questions.length - 1;
  const answered = answers[current] !== -1;

  const submit = async () => {
    if (!isAuthenticated) {
      toast.error("Register or login to submit a quiz");
      return;
    }
    const score = quiz.questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
    const total = quiz.questions.length;
    const points = score * quiz.pointsPerQuestion;
    const passed = Math.round((score / total) * 100) >= quiz.passMark;
    const res = { score, total, points, answers, passed, takenAt: new Date().toISOString() };
    setResult(res);
    saveQuizResult(quiz.id, res);
    // Persist attempt to DB
    try {
      const tok = getAccessToken();
      if (tok) {
        await fetch(`http://localhost:5000/api/courses/quizzes/${quiz.id}/attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
          body: JSON.stringify({ score, total, pointsEarned: passed ? points : 0 }),
        });
      }
    } catch (err) {
      console.error("Failed to save quiz attempt:", err);
    }
    toast.success("Quiz submitted successfully");
    if (passed) {
      toast.success("Quiz Passed!", { description: `You earned ${points} points!` });
    } else {
      toast.error("Quiz not passed", { description: "Try again to earn points." });
    }
    setPhase("results");
  };
  const restart = () => {
    setAnswers(Array(quiz.questions.length).fill(-1));
    setCurrent(0);
    setResult(null);
    setPhase("taking");
  };

  // ---- Results ----
  if (phase === "results" && result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
          <span
            className={
              "mx-auto flex h-20 w-20 items-center justify-center rounded-full " +
              (result.passed
                ? "bg-surface-mint text-brand-teal"
                : "bg-surface-peach text-brand-pink")
            }
          >
            <Trophy className="h-10 w-10" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">
            {result.passed ? "Well done!" : "Keep practising!"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{quiz.title}</p>

          <div className="mt-6 flex items-center justify-center gap-8">
            <div>
              <p className="text-4xl font-extrabold text-brand-navy">
                {result.score}/{result.total}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">Score</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-brand-purple">{pct}%</p>
              <p className="text-xs font-semibold text-muted-foreground">Percentage</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span
              className={
                "rounded-full px-4 py-1.5 text-sm font-bold " +
                (result.passed ? "bg-brand-teal text-white" : "bg-brand-pink text-white")
              }
            >
              {result.passed ? "PASSED" : "TRY AGAIN"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-yellow px-4 py-1.5 text-sm font-bold text-brand-navy">
              <Coins className="h-4 w-4 text-brand-yellow" /> +{result.points} points
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setPhase("review")}
              className="rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white"
            >
              Review Answers
            </button>
            <button
              onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-5 py-2.5 text-sm font-bold text-foreground hover:bg-border"
            >
              <RotateCcw className="h-4 w-4" /> Retake
            </button>
            <Link
              to="/learn"
              className="rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-bold text-white"
            >
              Next Lesson
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---- Review ----
  if (phase === "review" && result) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <button
          onClick={() => setPhase("results")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-purple"
        >
          <ArrowLeft className="h-4 w-4" /> Back to results
        </button>
        <h1 className="mt-3 text-2xl font-extrabold text-brand-navy">Review Answers</h1>
        <div className="mt-5 space-y-5">
          {quiz.questions.map((q, qi) => {
            const chosen = result.answers[qi];
            return (
              <div key={q.id} className="rounded-3xl bg-card p-5 shadow-sm">
                <p className="font-bold text-brand-navy">
                  {qi + 1}. {q.text}
                </p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.correct;
                    const isChosenWrong = oi === chosen && chosen !== q.correct;
                    return (
                      <div
                        key={oi}
                        className={
                          "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm " +
                          (isCorrect
                            ? "border-brand-teal bg-surface-mint text-brand-navy"
                            : isChosenWrong
                              ? "border-brand-red bg-surface-peach text-brand-navy"
                              : "border-border bg-background text-foreground")
                        }
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-teal" />
                        ) : isChosenWrong ? (
                          <XCircle className="h-4 w-4 shrink-0 text-brand-red" />
                        ) : (
                          <span className="h-4 w-4 shrink-0" />
                        )}
                        <span className="font-semibold">{opt}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 rounded-xl bg-surface-lavender px-3 py-2 text-xs text-foreground/80">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  // ---- Taking ----
  const q = quiz.questions[current];
  const progressPct = ((current + 1) / quiz.questions.length) * 100;
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-extrabold text-brand-navy sm:text-xl">{quiz.title}</h1>
        <span className={`rounded-full ${subj.surface} ${subj.text} px-3 py-1 text-xs font-bold`}>
          {subj.label}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Question {current + 1} of {quiz.questions.length}
          </span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-card p-6 shadow-sm">
        <p className="text-lg font-bold text-brand-navy">{q.text}</p>
        <div className="mt-5 space-y-3">
          {q.options.map((opt, oi) => {
            const selected = answers[current] === oi;
            return (
              <button
                key={oi}
                onClick={() => select(oi)}
                className={
                  "flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition " +
                  (selected
                    ? "border-brand-purple bg-surface-lavender text-brand-purple"
                    : "border-border bg-background text-foreground hover:border-brand-purple/40")
                }
              >
                <span
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold " +
                    (selected ? "bg-brand-purple text-white" : "bg-muted text-muted-foreground")
                  }
                >
                  {String.fromCharCode(65 + oi)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm disabled:opacity-40 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </button>
        {isLast ? (
          <button
            onClick={submit}
            disabled={!answered}
            className="rounded-xl bg-brand-teal px-6 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02]"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={!answered}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02]"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </main>
  );
}

export default Quiz;
