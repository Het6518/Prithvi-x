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
    return <div className="neo-error">{error}</div>;
  }

  const { overview } = data;

  return (
    <div className="space-y-6">
      <div className="neo-card border-amber-500 bg-amber-100 px-6 py-5 text-amber-900">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-bold">
            {overview.overdueCount} farmers are overdue beyond 21 days. Prioritize collections in{" "}
            {overview.overdueVillages.join(" and ") || "your highest-risk villages"}.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {overview.stats.map((stat) => (
          <div key={stat.label} className="neo-card p-5">
            <p className="text-sm font-bold text-forest/55">{stat.label}</p>
            <p className="mt-4 text-4xl font-bold text-forest">
              {stat.kind === "currency" ? formatCurrency(stat.value) : stat.value.toLocaleString("en-IN")}
            </p>
            <div className="mt-4 neo-pill bg-gold/20 text-forest">
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              {stat.change} this month
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="neo-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="neo-eyebrow">Recent activity</p>
              <h2 className="mt-2 text-2xl font-bold text-forest">What happened today</h2>
            </div>
            <Clock3 className="h-5 w-5 text-forest/40" />
          </div>
          <div className="space-y-4">
            {overview.recentActivity.length === 0 ? (
              <div className="neo-empty">No recent activity yet.</div>
            ) : null}
            {overview.recentActivity.map((item) => (
              <div key={`${item.title}-${item.time}`} className="border-3 border-black bg-white p-4 shadow-neo-sm" style={{ borderRadius: "6px" }}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-bold text-forest">{item.title}</p>
                  <p className="neo-pill bg-forest/5">{item.time}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-forest/65">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="neo-card p-6">
          <p className="neo-eyebrow">Collections focus</p>
          <h2 className="mt-2 text-2xl font-bold text-forest">Recovery shortlist</h2>
          <div className="mt-6 space-y-4">
            {overview.collectionsFocus.length === 0 ? (
              <div className="neo-empty">No overdue collections.</div>
            ) : null}
            {overview.collectionsFocus.map((item) => (
              <div key={item.id} className="neo-card-dark flex items-center justify-between p-4">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-background/65">{item.village}</p>
                </div>
                <p className="text-xl font-bold">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
