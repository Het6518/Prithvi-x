"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { MapPoint } from "@/lib/types";

function clusterPoints(points: MapPoint[]) {
  const clusters = new Map<string, MapPoint[]>();

  for (const point of points) {
    const key = `${Math.round(point.lat * 2) / 2}-${Math.round(point.lng * 2) / 2}`;
    const current = clusters.get(key) || [];
    current.push(point);
    clusters.set(key, current);
  }

  return Array.from(clusters.values()).map((group, index) => ({
    id: `cluster-${index}`,
    lat: group.reduce((sum, item) => sum + item.lat, 0) / group.length,
    lng: group.reduce((sum, item) => sum + item.lng, 0) / group.length,
    farmers: group,
    count: group.length,
    intensity: group.reduce((sum, item) => sum + item.intensity, 0) / group.length
  }));
}

function markerIcon(count: number) {
  return new L.DivIcon({
    className: "prithvix-map-pin",
    html: `<div style="height:40px;width:40px;border-radius:9999px;background:#1A3C2B;border:3px solid #D4A853;box-shadow:0 0 0 8px rgba(212,168,83,0.12);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:12px;">${count}</div>`,
    iconSize: [40, 40]
  });
}

export function AnalyticsMap({ heatmap = false, points }: { heatmap?: boolean; points: MapPoint[] }) {
  const clusters = clusterPoints(points);

  return (
    <div className="h-[420px] overflow-hidden rounded-[1.8rem]">
      <MapContainer center={[23.5, 75.5]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {heatmap
          ? points.map((point) => (
              <CircleMarker
                key={point.id}
                center={[point.lat, point.lng]}
                radius={30 * point.intensity}
                pathOptions={{ color: "#D4A853", fillColor: "#D4A853", fillOpacity: 0.25 }}
              >
                <Popup>{point.name}</Popup>
              </CircleMarker>
            ))
          : clusters.map((cluster) => (
              <Marker key={cluster.id} position={[cluster.lat, cluster.lng]} icon={markerIcon(cluster.count)}>
                <Popup>
                  <div className="space-y-2">
                    <p className="font-semibold">{cluster.count} farmer profiles</p>
                    {cluster.farmers.map((farmer) => (
                      <p key={farmer.id} className="text-sm">
                        {farmer.name} | {farmer.village}
                      </p>
                    ))}
                  </div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
}
