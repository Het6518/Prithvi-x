"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import type { MapPoint } from "@/lib/types";

const AnalyticsMap = dynamic(
  () => import("@/components/dashboard/analytics-map").then((mod) => mod.AnalyticsMap),
  { ssr: false }
);

export function MapPage() {
  const mapQuery = useApiResource<{ points: MapPoint[] }>("/api/map", { points: [] });
  const [heatmap, setHeatmap] = useState(false);

  if (mapQuery.loading) {
    return <LoadingPanel rows={2} />;
  }

  if (mapQuery.error) {
    return <div className="glass-panel rounded-[2rem] p-6 text-sm text-rose-700 shadow-sm">{mapQuery.error}</div>;
  }

  return (
    <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Spatial analytics</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest">Village map with clustered coverage</h2>
        </div>
        <Button variant="secondary" onClick={() => setHeatmap((current) => !current)}>
          {heatmap ? "Show Clusters" : "Show Heatmap"}
        </Button>
      </div>
      <AnalyticsMap points={mapQuery.data.points} heatmap={heatmap} />
    </div>
  );
}
