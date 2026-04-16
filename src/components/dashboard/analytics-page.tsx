"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import type { AnalyticsPayload } from "@/lib/types";

export function AnalyticsPage() {
  const analyticsQuery = useApiResource<AnalyticsPayload>("/api/analytics", {
    series: [],
    collectionSplit: []
  });
  const [chartMode, setChartMode] = useState<"line" | "bar">("line");

  if (analyticsQuery.loading) {
    return <LoadingPanel rows={3} />;
  }

  if (analyticsQuery.error) {
    return <div className="glass-panel rounded-[2rem] p-6 text-sm text-rose-700 shadow-sm">{analyticsQuery.error}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">Revenue analytics</p>
            <h2 className="mt-2 text-3xl font-semibold text-forest">Yielding stronger decisions</h2>
          </div>
          <div className="flex gap-3">
            <Button variant={chartMode === "line" ? "primary" : "secondary"} onClick={() => setChartMode("line")}>
              Line
            </Button>
            <Button variant={chartMode === "bar" ? "primary" : "secondary"} onClick={() => setChartMode("bar")}>
              Bar
            </Button>
          </div>
        </div>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "line" ? (
              <LineChart data={analyticsQuery.data.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,60,43,0.12)" />
                <XAxis dataKey="month" stroke="#496857" />
                <YAxis stroke="#496857" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#1A3C2B" strokeWidth={3} />
                <Line type="monotone" dataKey="farmers" stroke="#D4A853" strokeWidth={3} />
              </LineChart>
            ) : (
              <BarChart data={analyticsQuery.data.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,60,43,0.12)" />
                <XAxis dataKey="month" stroke="#496857" />
                <YAxis stroke="#496857" />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#1A3C2B" radius={[8, 8, 0, 0]} />
                <Bar dataKey="farmers" fill="#D4A853" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Collections donut</p>
        <h2 className="mt-2 text-3xl font-semibold text-forest">Recovery rate</h2>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analyticsQuery.data.collectionSplit} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={6}>
                {analyticsQuery.data.collectionSplit.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {analyticsQuery.data.collectionSplit.map((item) => (
            <div key={item.name} className="rounded-[1.3rem] bg-white/75 p-4">
              <p className="text-sm text-forest/55">{item.name}</p>
              <p className="mt-2 text-2xl font-semibold text-forest">{item.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
