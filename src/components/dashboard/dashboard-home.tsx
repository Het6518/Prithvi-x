"use client";

import { AlertTriangle, ArrowUpRight, Clock3 } from "lucide-react";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatCurrency } from "@/lib/utils";
import type { DashboardOverview } from "@/lib/types";

export function DashboardHome() {
  const { data, loading, error } = useApiResource<{ overview: DashboardOverview }>("/api/dashboard", {
    overview: {
      stats: [],
      recentActivity: [],
      overdueCount: 0,
      overdueVillages: [],
      collectionsFocus: []
    }
  });

  if (loading) {
    return <LoadingPanel rows={4} />;
  }

  if (error) {
    return <div className="glass-panel rounded-[2rem] p-6 text-sm text-rose-700 shadow-sm">{error}</div>;
  }

  const { overview } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-5 text-amber-900 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-semibold">
            {overview.overdueCount} farmers are overdue beyond 21 days. Prioritize collections in{" "}
            {overview.overdueVillages.join(" and ") || "your highest-risk villages"}.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {overview.stats.map((stat) => (
          <div key={stat.label} className="glass-panel rounded-[1.8rem] p-5 shadow-sm">
            <p className="text-sm text-forest/55">{stat.label}</p>
            <p className="mt-4 text-4xl font-semibold text-forest">
              {stat.kind === "currency" ? formatCurrency(stat.value) : stat.value.toLocaleString("en-IN")}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest/5 px-3 py-1 text-xs font-semibold text-forest">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {stat.change} this month
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-gold">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-forest">What happened today</h2>
            </div>
            <Clock3 className="h-5 w-5 text-forest/40" />
          </div>
          <div className="space-y-4">
            {overview.recentActivity.map((item) => (
              <div key={`${item.title}-${item.time}`} className="rounded-[1.4rem] border border-forest/10 bg-white/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-forest">{item.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-forest/45">{item.time}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-forest/65">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Collections focus</p>
          <h2 className="mt-2 text-2xl font-semibold text-forest">Recovery shortlist</h2>
          <div className="mt-6 space-y-4">
            {overview.collectionsFocus.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-[1.4rem] bg-forest p-4 text-background">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-background/65">{item.village}</p>
                </div>
                <p className="text-xl font-semibold">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
