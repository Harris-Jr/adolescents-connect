import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

const PILL =
  "flex items-center gap-1 rounded-full bg-white px-3 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.12)]";

/**
 * Floating pill bottom nav for the admin-family dashboards (phone + tablet),
 * reusing the learner MobileBottomNav pill pattern. Shows the first 3 nav
 * items inline plus a "More" button that opens a bottom sheet with the full
 * list.
 *
 * items: [{ id, label, icon, to? }] — `to` items navigate; the rest call
 * onSelect(id) to drive the dashboard's section state.
 */
export function DashboardBottomNav({ items, active, onSelect }) {
  const [open, setOpen] = useState(false);
  const primary = items.slice(0, 3);
  const rest = items.slice(3);
  const isActive = (item) => item.id === active;

  const pillItemClass = (item) =>
    "flex flex-col items-center gap-0.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition active:scale-95 " +
    (isActive(item) ? "bg-[#6B3FA0] text-white" : "text-muted-foreground");

  const sheetItemClass = (item) =>
    "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition active:scale-[0.98] " +
    (isActive(item) ? "bg-surface-lavender text-brand-purple" : "text-foreground hover:bg-muted");

  return (
    <>
      {createPortal(
        <nav
          className="fixed inset-x-0 bottom-5 z-40 flex justify-center gap-2 px-3 pb-[env(safe-area-inset-bottom)] lg:hidden"
          aria-label="Dashboard navigation"
        >
        <div className={PILL}>
          {primary.map((item) => {
            const Icon = item.icon;
            const inner = (
              <>
                <Icon className="h-[22px] w-[22px]" strokeWidth={2.2} />
                <span className="max-w-[3.5rem] truncate">{item.label}</span>
              </>
            );
            return item.to ? (
              <Link key={item.id} to={item.to} className={pillItemClass(item)}>
                {inner}
              </Link>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={pillItemClass(item)}
              >
                {inner}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="More"
          className={`${PILL} text-muted-foreground transition active:scale-95`}
        >
          <span className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-[10px] font-semibold">
            <Menu className="h-[22px] w-[22px]" strokeWidth={2.2} />
            <span>More</span>
          </span>
        </button>
        </nav>,
        document.body,
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="rounded-t-[32px] bg-white">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="grid max-h-[65vh] gap-1 overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {rest.map((item) => {
              const Icon = item.icon;
              return item.to ? (
                <DrawerClose asChild key={item.id}>
                  <Link to={item.to} className={sheetItemClass(item)}>
                    <Icon className="h-5 w-5 text-[#6B3FA0]" />
                    {item.label}
                  </Link>
                </DrawerClose>
              ) : (
                <DrawerClose asChild key={item.id}>
                  <button type="button" onClick={() => onSelect?.(item.id)} className={sheetItemClass(item)}>
                    <Icon className="h-5 w-5 text-[#6B3FA0]" />
                    {item.label}
                  </button>
                </DrawerClose>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
