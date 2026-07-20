import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
export function Hero() {
    const { t } = useLanguage();
    return (<section className="mx-auto max-w-[1400px] px-4 pt-0 sm:px-6 md:pt-0 lg:min-h-[500px]">
      <div className="grid grid-cols-[55%_45%] items-center gap-3 md:grid-cols-2 md:gap-6 lg:gap-8">
        {/* Text column */}
        <div>
          {/* Pill tag */}
          <div className="inline-flex flex-nowrap items-center whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-extrabold tracking-wide shadow-sm md:text-[11px] lg:px-4 lg:py-2 lg:text-sm">
            <span className="text-brand-purple">LEARN</span>
            <span className="mx-1 text-muted-foreground sm:mx-2">•</span>
            <span className="text-brand-teal">GROW</span>
            <span className="mx-1 text-muted-foreground sm:mx-2">•</span>
            <span className="text-brand-pink">CONNECT</span>
            <span className="mx-1 text-muted-foreground sm:mx-2">•</span>
            <span className="text-brand-blue">ACT</span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold leading-[1.05] tracking-tight text-brand-navy sm:mt-3 sm:text-5xl lg:text-6xl">
            {t("hero.line1")}
            <br />
            {t("hero.line2")}
            <br />
            <span className="italic text-brand-purple underline decoration-brand-pink/60 decoration-2 underline-offset-4 sm:underline-offset-8">
              {t("hero.line3")}
            </span>
          </h1>

          <p className="mt-2 max-w-md text-xs text-muted-foreground sm:mt-3 sm:text-lg">
            {t("hero.tagline")}
          </p>

          <Link to="/auth?mode=register" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink px-5 py-2.5 text-[13px] font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-105 sm:mt-4 sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-base">
            {t("hero.cta")}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 sm:h-7 sm:w-7">
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4"/>
            </span>
          </Link>
        </div>

        {/* Illustration column */}
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl">
          {/* Mobile / tablet hero (cropped slightly at right edge) */}
          <img src="/images/hero-mobile.jpeg" alt="A group of smiling African adolescents standing together" width={1024} height={1536} className="h-full min-h-[220px] w-full object-contain object-center lg:hidden"/>
          {/* Desktop hero */}
          <img src="/images/hero-desktop.jpeg" alt="A diverse group of smiling African adolescents standing together" width={1512} height={1024} className="hidden h-full w-full object-contain object-right lg:block"/>
        </div>
      </div>
    </section>);
}
