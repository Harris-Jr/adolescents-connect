import { SearchX } from "lucide-react";
export function EmptyState({ title, message }) {
    return (<div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-lavender text-brand-purple"><SearchX className="h-8 w-8"/></span>
      <h2 className="mt-4 text-lg font-extrabold text-brand-navy">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
    </div>);
}
