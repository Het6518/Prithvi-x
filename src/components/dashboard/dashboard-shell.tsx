import Link from "next/link";
import { BarChart3, Boxes, CreditCard, Home, Map, MessageSquareText, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/shared/logout-button";

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 p-4 lg:grid-cols-[280px_1fr] lg:p-6">
        <aside className="neo-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border-3 border-black bg-forest text-lg font-bold text-background shadow-neo-sm">
              P
            </div>
            <div>
              <p className="neo-eyebrow">Prithvix</p>
              <p className="text-lg font-bold text-forest">Dealer OS</p>
            </div>
          </div>
          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 border-2 border-transparent px-4 py-3 text-sm font-bold text-forest/75 transition-all duration-150 hover:border-black hover:bg-gold/20 hover:shadow-neo-sm hover:translate-x-0.5"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-12 border-3 border-black bg-forest p-5 text-background shadow-neo-gold" style={{ borderRadius: "8px" }}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Logged in</p>
            <p className="mt-3 text-xl font-bold">{user?.name || "Dealer User"}</p>
            <p className="text-sm text-background/65">
              {user?.role || "DEALER"} | {(user as { sub?: string } | null)?.sub || "demo-user"}
            </p>
            <LogoutButton />
          </div>
        </aside>
        <div className="space-y-6">
          <header className="neo-card flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="neo-eyebrow">Operations cockpit</p>
              <h1 className="mt-2 font-heading text-4xl text-forest">Prithvix Dashboard</h1>
            </div>
            <div className="border-3 border-black bg-white px-5 py-4 text-right shadow-neo-sm" style={{ borderRadius: "6px" }}>
              <p className="text-sm font-bold text-forest/55">Season pulse</p>
              <p className="mt-1 text-2xl font-bold text-forest">Strong collection momentum</p>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
