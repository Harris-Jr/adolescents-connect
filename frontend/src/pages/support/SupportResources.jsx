import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, PlayCircle, Lightbulb } from "lucide-react";
import { WELLBEING_RESOURCES, WELLBEING_TOPICS } from "@/lib/support-data";
const TYPE_ICON = { Article: BookOpen, Video: PlayCircle, Tip: Lightbulb };
const TOPIC_STYLE = {
  "Mental Health": { surface: "bg-surface-lavender", text: "text-brand-purple" },
  Relationships: { surface: "bg-surface-peach", text: "text-brand-pink" },
  "Body Safety": { surface: "bg-surface-blue", text: "text-brand-blue" },
  "Healthy Living": { surface: "bg-surface-mint", text: "text-brand-teal" },
};
function SupportResources() {
  const [topic, setTopic] = useState("all");
  const filtered = useMemo(
    () =>
      topic === "all" ? WELLBEING_RESOURCES : WELLBEING_RESOURCES.filter((r) => r.topic === topic),
    [topic],
  );
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <Link
        to="/support"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Support
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-brand-navy sm:text-4xl">
        Wellbeing Resources
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Articles, videos and tips to help you look after your mind, body and relationships.
      </p>

      {/* Topic filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setTopic("all")}
          className={
            "rounded-full px-4 py-1.5 text-sm font-bold transition " +
            (topic === "all"
              ? "bg-brand-navy text-white"
              : "bg-card text-foreground hover:bg-muted")
          }
        >
          All Topics
        </button>
        {WELLBEING_TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={
              "rounded-full px-4 py-1.5 text-sm font-bold transition " +
              (topic === t ? "bg-brand-navy text-white" : "bg-card text-foreground hover:bg-muted")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const Icon = TYPE_ICON[r.type];
          const style = TOPIC_STYLE[r.topic];
          return (
            <article
              key={r.id}
              className="flex flex-col rounded-3xl bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${style.surface}`}
                >
                  <Icon className={`h-5 w-5 ${style.text}`} />
                </span>
                <span
                  className={`rounded-full ${style.surface} ${style.text} px-2.5 py-0.5 text-[11px] font-bold`}
                >
                  {r.type}
                </span>
              </div>
              <h3 className="mt-4 font-extrabold text-brand-navy">{r.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.summary}</p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>{r.topic}</span>
                <span>{r.readTime}</span>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
export default SupportResources;
