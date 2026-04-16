import Link from "next/link";
import { BarChart3, Boxes, CreditCard, Home, LogOut, Map, MessageSquareText, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/shared/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/farmers", label: "Farmers", icon: Users },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/credit", label: "Udhaar", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/map", label: "Map", icon: Map },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquareText }
];

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(245,240,232,1),rgba(238,233,223,1))]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 p-4 lg:grid-cols-[280px_1fr] lg:p-6">
        <aside className="glass-panel rounded-[2rem] p-6 shadow-ambient">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-lg font-semibold text-background">P</div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Prithvix</p>
              <p className="text-lg font-semibold text-forest">Dealer OS</p>
            </div>
          </div>
          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-forest/75 transition hover:bg-forest hover:text-background"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-12 rounded-[1.6rem] bg-forest p-5 text-background">
            <p className="text-xs uppercase tracking-[0.22em] text-background/60">Logged in</p>
            <p className="mt-3 text-xl font-semibold">{user?.name || "Dealer User"}</p>
            <p className="text-sm text-background/65">
              {user?.role || "DEALER"} | {(user as { sub?: string } | null)?.sub || "demo-user"}
            </p>
            <form action="/api/auth/logout" method="post">
              <Button variant="secondary" className="mt-5 w-full border-white/10 bg-white/10 text-background hover:bg-white/15">
                <span className="inline-flex items-center gap-2">
                  <LogOut className="h-4 w-4" /> Logout
                </span>
              </Button>
            </form>
          </div>
        </aside>
        <div className="space-y-6">
          <header className="glass-panel flex flex-col justify-between gap-4 rounded-[2rem] p-6 shadow-sm sm:flex-row sm:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gold">Operations cockpit</p>
              <h1 className="mt-2 font-heading text-4xl text-forest">Prithvix Dashboard</h1>
            </div>
            <div className="rounded-[1.5rem] border border-forest/10 bg-white/70 px-5 py-4 text-right">
              <p className="text-sm text-forest/55">Season pulse</p>
              <p className="mt-1 text-2xl font-semibold text-forest">Strong collection momentum</p>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
