import { Link } from "react-router-dom";
import { Users, HelpCircle, PlayCircle, BarChart3, MessageCircle, Presentation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const actions = [
    { labelKey: "iwant.join", icon: Users, color: "text-brand-purple", bg: "bg-surface-lavender", to: "/clubs" },
    { labelKey: "iwant.quiz", icon: HelpCircle, color: "text-brand-pink", bg: "bg-surface-peach", to: "/quiz/$quizId", params: { quizId: "quiz-digital-safety-1" } },
    { labelKey: "iwant.video", icon: PlayCircle, color: "text-brand-teal", bg: "bg-surface-mint", to: "/learn" },
    { labelKey: "iwant.progress", icon: BarChart3, color: "text-brand-blue", bg: "bg-surface-blue", to: "/progress" },
    { labelKey: "iwant.talk", icon: MessageCircle, color: "text-brand-purple", bg: "bg-surface-lilac", to: "/support" },
    { labelKey: "iwant.teachers", icon: Presentation, color: "text-brand-teal", bg: "bg-surface-yellow", to: "/dashboard/teacher" },
];
export function QuickActions() {
    const { t } = useLanguage();
    return (<section className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6">
      <div className="rounded-3xl bg-card p-5 shadow-sm sm:p-6">
        <span className="text-lg font-extrabold text-brand-navy">{t("iwant.title")}</span>
        <div className="-mx-1 mt-4 flex gap-5 overflow-x-auto px-1 pb-2 lg:justify-around lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {actions.map((a) => {
            const Icon = a.icon;
            return (<Link key={a.labelKey} to={a.params?.quizId ? `/quiz/${a.params.quizId}` : a.to} className="flex w-20 shrink-0 flex-col items-center gap-2 text-center transition-transform hover:scale-105 lg:w-auto">
                <span className={`flex h-14 w-14 items-center justify-center rounded-full ${a.bg}`}>
                  <Icon className={`h-7 w-7 ${a.color}`}/>
                </span>
                <span className="text-xs font-bold leading-tight text-foreground">{t(a.labelKey)}</span>
              </Link>);
        })}
        </div>
      </div>
    </section>);
}
