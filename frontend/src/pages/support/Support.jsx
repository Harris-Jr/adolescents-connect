import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  HeartPulse,
  Brain,
  Shield,
  Pill,
  Scale,
  Baby,
  MessageCircle,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  LifeBuoy,
  X,
  CheckCircle2,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import { CONTACT_METHODS } from "@/lib/support-data";

// Presentation only — icon + colour per category id. Content (title,
// description) now comes from the API (/api/support/meta).
const ICONS = {
  "mental-health": Brain,
  srh: HeartPulse,
  gbv: Shield,
  "substance-abuse": Pill,
  "legal-aid": Scale,
  "child-protection": Baby,
};
const CATEGORY_STYLES = {
  "mental-health": { surface: "bg-surface-lavender", text: "text-brand-purple" },
  srh: { surface: "bg-surface-peach", text: "text-brand-pink" },
  gbv: { surface: "bg-surface-blue", text: "text-brand-blue" },
  "substance-abuse": { surface: "bg-surface-mint", text: "text-brand-teal" },
  "legal-aid": { surface: "bg-surface-yellow", text: "text-brand-navy" },
  "child-protection": { surface: "bg-surface-lilac", text: "text-brand-purple" },
};
const DEFAULT_STYLE = { surface: "bg-muted", text: "text-brand-navy" };

function Support() {
  const [referralOpen, setReferralOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiGet("/support/meta")
      .then((data) => {
        if (active) setCategories(data.categories ?? []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load support services");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <section className="rounded-3xl bg-gradient-to-br from-brand-teal to-brand-blue p-8 text-white sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
          <LifeBuoy className="h-3.5 w-3.5" /> Support Services
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">Need Help?</h1>
        <p className="mt-2 text-lg font-semibold text-white/90">You are not alone.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setReferralOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-teal transition-transform hover:scale-105"
          >
            <LifeBuoy className="h-4 w-4" /> I Need Help
          </button>
          <Link
            to="/support/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/30"
          >
            <MessageCircle className="h-4 w-4" /> Talk to Someone
          </Link>
        </div>
      </section>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-destructive bg-destructive/10 px-5 py-4">
        <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" />
        <p className="text-sm font-bold text-destructive">
          Emergency? Call{" "}
          <a href="tel:991" className="underline">
            991
          </a>{" "}
          or{" "}
          <a href="tel:116" className="underline">
            116
          </a>{" "}
          (Child Helpline)
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-extrabold text-brand-navy">How can we help?</h2>

      {loading ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 text-sm font-semibold text-brand-pink">{error}</p>
      ) : categories.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Support categories will appear here soon.
        </p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = ICONS[cat.id] ?? LifeBuoy;
            const style = CATEGORY_STYLES[cat.id] ?? DEFAULT_STYLE;

            return (
              <article key={cat.id} className="flex flex-col rounded-3xl bg-card p-6 shadow-sm">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.surface}`}
                >
                  <Icon className={`h-6 w-6 ${style.text}`} />
                </span>
                <h3 className="mt-4 font-extrabold text-brand-navy">{cat.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{cat.description}</p>
                <Link
                  to={`/support/services?category=${encodeURIComponent(cat.title)}`}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  Find Services <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Link
          to="/support/chat"
          className="flex items-center gap-4 rounded-3xl bg-surface-lavender p-6 transition-transform hover:scale-[1.01]"
        >
          <MessageCircle className="h-8 w-8 text-brand-purple" />
          <span>
            <span className="block font-extrabold text-brand-navy">Talk to a counsellor</span>
            <span className="block text-sm text-foreground/70">
              A safe, confidential chat space.
            </span>
          </span>
        </Link>
        <Link
          to="/support/resources"
          className="flex items-center gap-4 rounded-3xl bg-surface-mint p-6 transition-transform hover:scale-[1.01]"
        >
          <BookOpen className="h-8 w-8 text-brand-teal" />
          <span>
            <span className="block font-extrabold text-brand-navy">Wellbeing resources</span>
            <span className="block text-sm text-foreground/70">
              Articles, videos and tips for you.
            </span>
          </span>
        </Link>
      </div>

      {referralOpen && (
        <ReferralModal categories={categories} onClose={() => setReferralOpen(false)} />
      )}
    </main>
  );
}
function ReferralModal({ categories, onClose }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [situation, setSituation] = useState("");
  const [method, setMethod] = useState("");
  const reference = `ALK-${Math.floor(100000 + Math.random() * 900000)}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {step !== 4 && (
          <div className="mb-6 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-brand-teal" : "bg-muted"}`}
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-extrabold text-brand-navy">What do you need help with?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose a category to get started.</p>
            <div className="mt-4 grid gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.title)}
                  className={
                    "rounded-xl border px-4 py-3 text-left text-sm font-bold transition " +
                    (category === c.title
                      ? "border-brand-teal bg-surface-mint text-brand-teal"
                      : "border-border hover:bg-muted")
                  }
                >
                  {c.title}
                </button>
              ))}
            </div>
            <StepNav onNext={() => setStep(2)} nextDisabled={!category} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-extrabold text-brand-navy">Tell us what's happening</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This is optional and completely confidential. Share only what you're comfortable with.
            </p>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={5}
              placeholder="Describe your situation (optional)..."
              className="mt-4 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30"
            />
            <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-extrabold text-brand-navy">How should we reach you?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick the option you're most comfortable with.
            </p>
            <div className="mt-4 grid gap-2">
              {CONTACT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={
                    "rounded-xl border px-4 py-3 text-left transition " +
                    (method === m.id
                      ? "border-brand-teal bg-surface-mint"
                      : "border-border hover:bg-muted")
                  }
                >
                  <span className="block text-sm font-bold text-brand-navy">{m.label}</span>
                  <span className="block text-xs text-muted-foreground">{m.description}</span>
                </button>
              ))}
            </div>
            <StepNav
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextLabel="Send referral"
              nextDisabled={!method}
            />
          </div>
        )}

        {step === 4 && (
          <div className="py-4 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-mint">
              <CheckCircle2 className="h-8 w-8 text-brand-teal" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-brand-navy">
              Your referral has been sent
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Someone will reach out to you. You are not alone.
            </p>
            <p className="mt-4 inline-block rounded-xl bg-muted px-4 py-2 text-sm font-bold text-brand-navy">
              Reference: {reference}
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-brand-navy px-4 py-3 text-sm font-bold text-white"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function StepNav({ onBack, onNext, nextLabel = "Continue", nextDisabled }) {
  return (
    <div className="mt-6 flex gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground hover:bg-muted"
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 rounded-xl bg-brand-teal px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
      >
        {nextLabel}
      </button>
    </div>
  );
}
export default Support;
