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
    return <div className="neo-error">{analyticsQuery.error}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="neo-card p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="neo-eyebrow">Revenue analytics</p>
            <h2 className="mt-2 text-3xl font-bold text-forest">Yielding stronger decisions</h2>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.15)" />
                <XAxis dataKey="month" stroke="#000" fontWeight={700} fontSize={12} />
                <YAxis stroke="#000" fontWeight={700} fontSize={12} />
                <Tooltip contentStyle={{ border: "3px solid #000", borderRadius: "6px", boxShadow: "3px 3px 0px #000" }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#1A3C2B" strokeWidth={3} />
                <Line type="monotone" dataKey="farmers" stroke="#D4A853" strokeWidth={3} />
              </LineChart>
            ) : (
              <BarChart data={analyticsQuery.data.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.15)" />
                <XAxis dataKey="month" stroke="#000" fontWeight={700} fontSize={12} />
                <YAxis stroke="#000" fontWeight={700} fontSize={12} />
                <Tooltip contentStyle={{ border: "3px solid #000", borderRadius: "6px", boxShadow: "3px 3px 0px #000" }} />
                <Legend />
                <Bar dataKey="revenue" fill="#1A3C2B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="farmers" fill="#D4A853" radius={[2, 2, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="neo-card p-6">
        <p className="neo-eyebrow">Collections donut</p>
        <h2 className="mt-2 text-3xl font-bold text-forest">Recovery rate</h2>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analyticsQuery.data.collectionSplit} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={6} stroke="#000" strokeWidth={2}>
                {analyticsQuery.data.collectionSplit.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: "3px solid #000", borderRadius: "6px", boxShadow: "3px 3px 0px #000" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {analyticsQuery.data.collectionSplit.map((item) => (
            <div key={item.name} className="border-3 border-black bg-white p-4 shadow-neo-sm" style={{ borderRadius: "6px" }}>
              <p className="text-xs font-bold uppercase tracking-wider text-forest/55">{item.name}</p>
              <p className="mt-2 text-2xl font-bold text-forest">{item.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
