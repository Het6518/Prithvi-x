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
    return <div className="neo-error">{mapQuery.error}</div>;
  }

  return (
    <div className="neo-card p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="neo-eyebrow">Spatial analytics</p>
          <h2 className="mt-2 text-3xl font-bold text-forest">Village map with clustered coverage</h2>
        </div>
        <Button variant={heatmap ? "primary" : "secondary"} onClick={() => setHeatmap((current) => !current)}>
          {heatmap ? "Show Clusters" : "Show Heatmap"}
        </Button>
      </div>
      {mapQuery.data.points.length === 0 ? (
        <div className="neo-empty">No farmer locations available. Add farmers with village data to see them on the map.</div>
      ) : (
        <AnalyticsMap points={mapQuery.data.points} heatmap={heatmap} />
      )}
    </div>
  );
}
