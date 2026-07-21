import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BookOpen, CircleCheck, Award, Users, Trophy, Info, MessageCircle } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";
const icons = { lesson: BookOpen, quiz: CircleCheck, badge: Award, club: Users, challenge: Trophy, system: Info, chat: MessageCircle, ambassador: Award };
export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
    return (<div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={`${unreadCount} unread notifications`} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy transition active:scale-95 hover:bg-muted">
        <Bell className="h-5 w-5"/>
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-pink px-1 text-[10px] font-extrabold text-primary-foreground">{unreadCount}</span>}
      </button>
      {open && (<div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-extrabold text-brand-navy">Notifications</h2>
            <button type="button" onClick={markAllRead} className="text-xs font-bold text-brand-purple hover:underline">Mark all as read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map((item) => {
                const Icon = icons[item.type] ?? Info;
                return (<button key={item.id} type="button" onClick={() => markRead(item.id)} className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition hover:bg-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-lavender text-brand-purple"><Icon className="h-4 w-4"/></span>
                  <span className="min-w-0"><span className="block text-sm font-semibold text-foreground">{item.message}</span><span className="mt-0.5 block text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("en-ZM", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></span>
                  {!item.read && <span className="mt-2 h-2 w-2 rounded-full bg-brand-pink"/>}
                </button>);
            })}
          </div>
          <Link to="/notifications" onClick={() => setOpen(false)} className="block px-4 py-3 text-center text-sm font-bold text-brand-purple hover:bg-muted">View All</Link>
        </div>)}
    </div>);
}
