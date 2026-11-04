"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

/** Navbar bell with live unread count. */
export function NotificationBell() {
  const [count, setCount] = useState(0);
  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/notifications/unread-count", { cache: "no-store" });
      if (r.ok) setCount(((await r.json()) as { count?: number }).count ?? 0);
    } catch { /* offline — stay silent */ }
  }, []);
  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);
  return (
    <Link href="/dashboard/notifications" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-xl hover:bg-accent">
      <Bell className="size-5" />
      {count > 0 && (
        <span className="absolute right-1 top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-extrabold text-navy">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
