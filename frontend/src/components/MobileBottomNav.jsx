import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, GraduationCap, Star, Menu, TrendingUp, Trophy, Target, LifeBuoy, User, Settings, LogIn, LogOut, } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, } from "@/components/ui/drawer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
const leftItems = [
    { to: "/", labelKey: "nav.home", icon: Home, exact: true },
    { to: "/learn", labelKey: "nav.learn", icon: GraduationCap, exact: false },
    { to: "/clubs", labelKey: "nav.clubs", icon: Star, exact: false },
];
const drawerItems = [
    { to: "/progress", labelKey: "nav.progress", icon: TrendingUp, search: undefined },
    { to: "/challenges", labelKey: "nav.challenges", icon: Target, search: undefined },
    { to: "/leaderboard", labelKey: "nav.leaderboard", icon: Trophy, search: undefined },
    { to: "/support", labelKey: "nav.support", icon: LifeBuoy, search: undefined },
    { to: "/profile", labelKey: "nav.profile", icon: User, search: undefined },
    { to: "/profile", labelKey: "nav.settings", icon: Settings, search: { tab: "settings" } },
];
const PILL = "flex items-center gap-1 rounded-full bg-white px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.12)]";
export function MobileBottomNav() {
    const [open, setOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const handleLogout = async () => {
        setOpen(false);
        await logout();
        navigate("/");
    };
    return (<>
      <nav className="fixed inset-x-0 bottom-5 z-40 flex justify-center gap-3 px-4 pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Mobile navigation">
        <div className={PILL}>
          {leftItems.map(({ to, labelKey, icon: Icon, exact }) => (<NavLink key={to} to={to} end={exact} className={({ isActive }) => "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-semibold transition active:scale-95 " +
                (isActive ? "bg-[#6B3FA0] text-white" : "text-muted-foreground")}>
              <Icon className="h-[22px] w-[22px]" strokeWidth={2.2}/>
              <span>{t(labelKey)}</span>
            </NavLink>))}
        </div>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className={`${PILL} text-muted-foreground transition active:scale-95`}>
          <span className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-semibold">
            <Menu className="h-[22px] w-[22px]" strokeWidth={2.2}/>
            <span>{t("nav.menu")}</span>
          </span>
        </button>
      </nav>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="rounded-t-[32px] bg-white">
          <DrawerHeader>
            <DrawerTitle>{t("nav.menu")}</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {drawerItems.map(({ to, labelKey, icon: Icon, search }) => (<DrawerClose asChild key={labelKey}>
                <Link to={search ? `${to}?${new URLSearchParams(search)}` : to} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-foreground transition active:scale-[0.98] hover:bg-muted">
                  <Icon className="h-5 w-5 text-[#6B3FA0]"/>
                  {t(labelKey)}
                </Link>
              </DrawerClose>))}
            {isAuthenticated ? (<button type="button" onClick={handleLogout} className="mt-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-foreground transition active:scale-[0.98] hover:bg-muted">
                <LogOut className="h-5 w-5 text-[#6B3FA0]"/>
                {t("nav.logout")}
              </button>) : (<DrawerClose asChild>
                <Link to="/auth" className="mt-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-foreground transition active:scale-[0.98] hover:bg-muted">
                  <LogIn className="h-5 w-5 text-[#6B3FA0]"/>
                  {t("nav.loginRegister")}
                </Link>
              </DrawerClose>)}
          </div>
        </DrawerContent>
      </Drawer>
    </>);
}
