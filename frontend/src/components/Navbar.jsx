import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, ChevronDown, Menu, X, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
const languages = [
    { value: "en", label: "English" },
    { value: "bem", label: "Icibemba" },
    { value: "ny", label: "Nyanja" },
    { value: "to", label: "Tonga" },
];
export function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const currentLabel = language === "bem" ? "Icibemba" : "English";
    const selectLanguage = (value) => {
        if (value === "ny") {
            toast.message("Nyanja translations coming soon.");
            return;
        }
        if (value === "to") {
            toast.message("Tonga translations coming soon.");
            return;
        }
        setLanguage(value);
    };
    const LanguageDropdown = ({ mobile = false }) => (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Language" className={mobile
            ? "flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            : "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"}>
          <Globe className="h-4 w-4 text-brand-blue"/>
          <span className="font-bold">{currentLabel}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground"/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((l) => (<DropdownMenuItem key={l.value} onSelect={() => selectLanguage(l.value)} className="font-semibold">
            {l.label}
          </DropdownMenuItem>))}
      </DropdownMenuContent>
    </DropdownMenu>);
    const initials = user?.name
        ? user.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "";
    return (<header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 sm:gap-5">
          <img src="/images/alinks-logo.jpeg" alt="Adolescents LINKS logo" width={200} height={80} className="h-14 w-auto sm:h-16 lg:h-20"/>
          <div className="hidden h-10 w-px bg-border lg:block"/>
          <p className="hidden text-xs font-semibold leading-snug text-muted-foreground lg:block">
            Locate <span className="text-brand-pink">•</span> Inform{" "}
            <span className="text-brand-teal">•</span> Nurture
            <br />
            Knowledge in Action <span className="text-brand-yellow">•</span> Sustain
          </p>
        </Link>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageDropdown />

          {isAuthenticated ? (<div className="flex items-center gap-3">
              <NotificationBell />
              <Link to="/profile" aria-label="Your profile" className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-purple text-sm font-extrabold text-primary-foreground transition hover:scale-105">
                {user?.avatarImage ? <img src={user.avatarImage} alt="" className="h-full w-full object-cover"/> : null}
                {!user?.avatarImage && initials}
              </Link>
              <button onClick={logout} className="flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105">
                <LogOut className="h-4 w-4"/>
                {t("nav.logout")}
              </button>
            </div>) : (<>
              <Link to="/auth" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted">
                {t("nav.login")}
              </Link>
              <Link to="/auth?mode=register" className="rounded-xl bg-brand-navy px-5 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105">
                {t("nav.register")}
              </Link>
            </>)}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy transition-colors hover:bg-muted md:hidden">
          {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (<div className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <LanguageDropdown mobile/>

            {isAuthenticated ? (<div className="grid gap-2">
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-bold"><UserRound className="h-4 w-4"/> My Profile</Link>
              <button onClick={() => {
                    logout();
                    setOpen(false);
                }} className="flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-primary-foreground">
                <LogOut className="h-4 w-4"/>
                {t("nav.logout")} ({user?.name})
              </button>
              </div>) : (<>
                <Link to="/auth" onClick={() => setOpen(false)} className="rounded-xl border border-border bg-card px-5 py-2.5 text-center text-sm font-bold text-foreground">
                  {t("nav.login")}
                </Link>
                <Link to="/auth?mode=register" onClick={() => setOpen(false)} className="rounded-xl bg-brand-navy px-5 py-2.5 text-center text-sm font-bold text-primary-foreground">
                  {t("nav.register")}
                </Link>
              </>)}
          </div>
        </div>)}
    </header>);
}
