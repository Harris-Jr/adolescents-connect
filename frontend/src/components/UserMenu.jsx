import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABEL = {
  learner: "Learner",
  teacher: "Teacher",
  school_admin: "School Admin",
  programme_admin: "Programme Admin",
  admin: "Admin",
};

/**
 * Signed-in user chip with a dropdown showing name + role and a logout
 * action. Used in the admin/teacher/school dashboard headers, mirroring the
 * learner Navbar's logout pattern.
 */
export function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Account";
  const roleLabel = ROLE_LABEL[user.role?.toLowerCase()] ?? user.role ?? "";
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-purple text-xs font-extrabold text-primary-foreground">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block max-w-[9rem] truncate">{name}</span>
            <span className="block text-[11px] font-semibold text-muted-foreground">
              {roleLabel}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block text-sm font-bold text-foreground">{name}</span>
          <span className="block text-xs font-normal text-muted-foreground">{roleLabel}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer font-semibold">
          <Link to="/profile">
            <UserRound className="mr-2 h-4 w-4" /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => logout()}
          className="cursor-pointer font-semibold text-brand-red focus:text-brand-red"
        >
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
