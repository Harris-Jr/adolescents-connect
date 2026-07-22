import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { UserMenu } from "@/components/UserMenu";
export function AdminLayout({ brand, subtitle, items, active, onSelect, children, }) {
    const [open, setOpen] = useState(false);
    const nav = (<nav className="flex gap-1 lg:flex-col">
      {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const cls = "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold transition-colors " +
                (isActive
                    ? "bg-surface-lavender text-brand-purple"
                    : "text-foreground/80 hover:bg-muted");
            if (item.to) {
                return (<Link key={item.id} to={item.to} className={cls} onClick={() => setOpen(false)}>
              <Icon className="h-4 w-4 shrink-0"/>
              {item.label}
            </Link>);
            }
            return (<button key={item.id} type="button" onClick={() => {
                    onSelect(item.id);
                    setOpen(false);
                }} className={cls}>
            <Icon className="h-4 w-4 shrink-0"/>
            {item.label}
          </button>);
        })}
    </nav>);
    return (<div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-3 py-6 lg:flex">
        <Link to="/" className="px-3 text-lg font-extrabold text-brand-navy">
          A-LINKS
        </Link>
        <p className="mb-6 px-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{brand}</p>
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open && (<div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)}/>
          <aside className="absolute left-0 top-0 h-full w-64 overflow-y-auto bg-card px-3 py-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="text-lg font-extrabold text-brand-navy">A-LINKS</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5"/>
              </button>
            </div>
            {nav}
          </aside>
        </div>)}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:px-8">
          <button type="button" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5"/>
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold text-brand-navy">{brand}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>);
}
export function StatCard({ label, value, icon: Icon, surface = "bg-surface-lavender", color = "text-brand-purple", }) {
    return (<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${surface}`}>
          <Icon className={`h-5 w-5 ${color}`}/>
        </span>
      </div>
      <p className="mt-4 text-2xl font-extrabold text-brand-navy">{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
    </div>);
}
export function Panel({ title, action, children }) {
    return (<section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-brand-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>);
}
