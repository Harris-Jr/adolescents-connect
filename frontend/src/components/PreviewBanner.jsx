import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
export function PreviewBanner() {
    return (<aside className="border-b border-brand-yellow bg-surface-yellow px-4 py-3" aria-label="Preview notice">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-center">
        <p className="min-w-0 text-sm font-bold text-brand-navy">
          <Eye className="mr-1.5 inline h-4 w-4"/> You are viewing a preview. Register or Login to get full access.
        </p>
        <div className="flex shrink-0 gap-2">
          <Link to="/auth?mode=register" className="rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-bold text-primary-foreground transition active:scale-95 hover:opacity-90">Register</Link>
          <Link to="/auth" className="rounded-lg border border-brand-navy px-3 py-1.5 text-xs font-bold text-brand-navy transition active:scale-95 hover:bg-card">Login</Link>
        </div>
      </div>
    </aside>);
}
