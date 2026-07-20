import { useEffect, useRef, useState } from "react";
import { School, Users, GraduationCap, Award, MapPin, Map } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const stats = [
    { value: 1248, labelKey: "impact.schools", icon: School, color: "text-brand-purple", bg: "bg-surface-lavender" },
    { value: 245672, labelKey: "impact.adolescents", icon: Users, color: "text-brand-pink", bg: "bg-surface-peach" },
    { value: 12840, labelKey: "impact.teachers", icon: GraduationCap, color: "text-brand-teal", bg: "bg-surface-mint" },
    { value: 8563, labelKey: "impact.clubs", icon: Award, color: "text-brand-yellow", bg: "bg-surface-yellow" },
    { value: 72, labelKey: "impact.districts", icon: MapPin, color: "text-brand-teal", bg: "bg-surface-blue" },
    { value: 10, labelKey: "impact.provinces", icon: Map, color: "text-brand-blue", bg: "bg-surface-lilac" },
];
export function ImpactStats() {
    const { t } = useLanguage();
    const sectionRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const startedRef = useRef(false);
    useEffect(() => {
        const node = sectionRef.current;
        if (!node || startedRef.current)
            return;
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && !startedRef.current) {
                    startedRef.current = true;
                    observer.disconnect();
                    const duration = 2000;
                    const start = performance.now();
                    const tick = (now) => {
                        const elapsed = Math.min(1, (now - start) / duration);
                        const eased = 1 - Math.pow(1 - elapsed, 3);
                        setProgress(eased);
                        if (elapsed < 1)
                            requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            }
        }, { threshold: 0.2 });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);
    const format = (n) => Math.round(n).toLocaleString("en-US");
    return (<section ref={sectionRef} className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:pb-14">
      <div className="rounded-3xl bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-extrabold leading-snug text-brand-navy sm:text-xl">
          {t("impact.title")}
        </h2>
        <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-5 lg:flex lg:justify-between">
          {stats.map((s) => {
            const Icon = s.icon;
            return (<div key={s.labelKey} className="flex flex-col items-center text-center">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${s.bg}`}>
                  <Icon className={`h-6 w-6 ${s.color}`}/>
                </span>
                <p className="mt-2 text-lg font-extrabold text-brand-navy sm:text-xl">
                  {format(s.value * progress)}
                </p>
                <p className="text-xs font-semibold leading-tight text-muted-foreground">{t(s.labelKey)}</p>
              </div>);
        })}
        </div>
      </div>
    </section>);
}
