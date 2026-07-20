import { NavLink } from "react-router-dom";
export function PageShell({ title, subtitle, children, }) {
    return (<main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      <div className="mt-8 rounded-3xl bg-card p-8 shadow-sm">
        {children ?? (<p className="text-sm text-muted-foreground">This section is coming soon.</p>)}
      </div>
    </main>);
}
const sidebarLinks = [
    { to: "/dashboard/learner", label: "Overview" },
    { to: "/learn", label: "Learning Hub" },
    { to: "/clubs", label: "Clubs & Leadership" },
    { to: "/progress", label: "My Progress" },
    { to: "/support", label: "Support" },
];
export function DashboardShell({ title, subtitle, children, }) {
    return (<main className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row">
      <aside className="shrink-0 rounded-3xl bg-card p-4 shadow-sm lg:w-60">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {sidebarLinks.map((l) => (<NavLink key={l.to} to={l.to} className={({ isActive }) => "whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-colors hover:bg-muted " +
                (isActive ? "bg-surface-lavender text-brand-purple" : "text-foreground")}>
              {l.label}
            </NavLink>))}
        </nav>
      </aside>
      <section className="flex-1">
        <h1 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-6 rounded-3xl bg-card p-8 shadow-sm">
          {children ?? <p className="text-sm text-muted-foreground">This dashboard is coming soon.</p>}
        </div>
      </section>
    </main>);
}
