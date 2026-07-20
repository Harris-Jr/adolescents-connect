import { BookOpen, CircleCheck, Award, Users, Trophy, Info } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";
import { EmptyState } from "@/components/EmptyState";
const icons = {
  lesson: BookOpen,
  quiz: CircleCheck,
  badge: Award,
  club: Users,
  challenge: Trophy,
  system: Info,
};
function Notifications() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-extrabold text-brand-navy">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">{unreadCount} unread update{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="shrink-0 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-primary-foreground transition active:scale-95 hover:opacity-90"
        >
          Mark all as read
        </button>
      </header>
      {notifications.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          message="New lessons, results and announcements will appear here."
        />
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-sm">
          {notifications.map((item) => {
            const Icon = icons[item.type];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => markRead(item.id)}
                className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-4 border-b border-border/60 p-5 text-left transition last:border-0 hover:bg-muted"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-lavender text-brand-purple">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-brand-navy">{item.message}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("en-ZM", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </span>
                {!item.read && <span className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-pink" />}
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
export default Notifications;
