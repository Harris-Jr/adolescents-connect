import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HubIllustration } from "./HubIllustration";
import { useLanguage } from "@/contexts/LanguageContext";
const features = [
    {
        id: "learn",
        titleKey: "feature.learn.title",
        descKey: "feature.learn.desc",
        surface: "bg-surface-lavender",
        arrowColor: "text-brand-purple",
        to: "/learn",
    },
    {
        id: "healthy_futures",
        titleKey: "feature.health.title",
        descKey: "feature.health.desc",
        surface: "bg-surface-peach",
        arrowColor: "text-brand-pink",
        to: "/learn",
        search: { subject: "health" },
    },
    {
        id: "stay_safe",
        titleKey: "feature.safe.title",
        descKey: "feature.safe.desc",
        surface: "bg-surface-blue",
        arrowColor: "text-brand-blue",
        to: "/learn",
        search: { subject: "digital-safety" },
    },
    {
        id: "challenges",
        titleKey: "feature.challenges.title",
        descKey: "feature.challenges.desc",
        surface: "bg-surface-yellow",
        arrowColor: "text-brand-red",
        to: "/challenges",
    },
    {
        id: "leadership",
        titleKey: "feature.leadership.title",
        descKey: "feature.leadership.desc",
        surface: "bg-surface-mint",
        arrowColor: "text-brand-teal",
        to: "/clubs",
    },
    {
        id: "need_help",
        titleKey: "feature.help.title",
        descKey: "feature.help.desc",
        surface: "bg-surface-lilac",
        arrowColor: "text-brand-purple",
        to: "/support",
    },
];
export function FeatureCards() {
    const { t } = useLanguage();
    return (<section className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 sm:pt-14">
      <div className="rounded-3xl bg-card p-5 shadow-sm sm:p-8">
        <h2 className="text-center text-2xl font-extrabold text-brand-navy sm:text-3xl">
          {t("features.title")}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {features.map((f) => (<Link key={f.id} to={f.search ? `${f.to}?${new URLSearchParams(f.search)}` : f.to} className={`${f.surface} group flex flex-col items-center rounded-3xl p-4 text-center transition-transform hover:-translate-y-1 sm:p-6`}>
              <HubIllustration id={f.id}/>
              <h3 className="mt-4 text-sm font-extrabold uppercase text-brand-navy sm:text-base">{t(f.titleKey)}</h3>
              <p className="mt-2 text-xs leading-snug text-foreground/70 sm:text-sm">{t(f.descKey)}</p>
              <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm transition-transform group-hover:translate-x-1">
                <ArrowRight className={`h-4 w-4 ${f.arrowColor}`}/>
              </span>
            </Link>))}
        </div>
      </div>
    </section>);
}
