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
    html: `<div style="height:42px;width:42px;border:3px solid #000;background:#1A3C2B;box-shadow:3px 3px 0px #000;display:flex;align-items:center;justify-content:center;color:#F5F0E8;font-weight:900;font-size:13px;border-radius:4px;">${count}</div>`,
    iconSize: [42, 42]
  });
}

// Heatmap color gradient: green → yellow → red based on intensity
function getHeatColor(intensity: number): string {
  // intensity is 0..1
  const clamped = Math.min(1, Math.max(0, intensity));
  if (clamped < 0.33) {
    // Green to Yellow
    const t = clamped / 0.33;
    const r = Math.round(34 + t * (234 - 34));
    const g = Math.round(197 + t * (179 - 197));
    const b = Math.round(94 + t * (8 - 94));
    return `rgb(${r},${g},${b})`;
  } else if (clamped < 0.66) {
    // Yellow to Orange
    const t = (clamped - 0.33) / 0.33;
    const r = Math.round(234 + t * (249 - 234));
    const g = Math.round(179 - t * (179 - 115));
    const b = Math.round(8 + t * (22 - 8));
    return `rgb(${r},${g},${b})`;
  } else {
    // Orange to Red
    const t = (clamped - 0.66) / 0.34;
    const r = Math.round(249 - t * (249 - 220));
    const g = Math.round(115 - t * (115 - 38));
    const b = Math.round(22 + t * (38 - 22));
    return `rgb(${r},${g},${b})`;
  }
}

export function AnalyticsMap({ heatmap = false, points }: { heatmap?: boolean; points: MapPoint[] }) {
  const clusters = clusterPoints(points);

  // Calculate max intensity for normalization
  const maxIntensity = Math.max(...points.map((p) => p.intensity), 0.5);

  return (
    <div className="neo-map">
      <MapContainer center={[23.5, 75.5]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {heatmap
          ? points.map((point) => {
              const normalizedIntensity = point.intensity / maxIntensity;
              const color = getHeatColor(normalizedIntensity);
              return (
                <CircleMarker
                  key={point.id}
                  center={[point.lat, point.lng]}
                  radius={Math.max(15, 40 * normalizedIntensity)}
                  pathOptions={{
                    color: "#000",
                    weight: 2,
                    fillColor: color,
                    fillOpacity: 0.55
                  }}
                >
                  <Popup>
                    <div style={{ fontWeight: 700 }}>
                      <p>{point.name}</p>
                      <p style={{ fontSize: "12px", color: "#555" }}>{point.village}</p>
                      <p style={{ fontSize: "12px", color: "#555" }}>Intensity: {(normalizedIntensity * 100).toFixed(0)}%</p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })
          : clusters.map((cluster) => (
              <Marker key={cluster.id} position={[cluster.lat, cluster.lng]} icon={markerIcon(cluster.count)}>
                <Popup>
                  <div style={{ fontWeight: 700 }}>
                    <p style={{ fontSize: "14px" }}>{cluster.count} farmer profiles</p>
                    {cluster.farmers.map((farmer) => (
                      <p key={farmer.id} style={{ fontSize: "12px", fontWeight: 500, color: "#555" }}>
                        {farmer.name} | {farmer.village}
                      </p>
                    ))}
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* Heatmap legend */}
        {heatmap ? (
          <div className="leaflet-bottom leaflet-right" style={{ pointerEvents: "none" }}>
            <div style={{
              background: "#F5F0E8",
              border: "3px solid #000",
              padding: "8px 12px",
              margin: "10px",
              boxShadow: "3px 3px 0px #000",
              borderRadius: "4px",
              pointerEvents: "auto",
              fontSize: "11px",
              fontWeight: 700
            }}>
              <p style={{ marginBottom: "4px" }}>DENSITY</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "12px", height: "12px", background: "#22c55e", border: "1px solid #000" }} />
                <span>Low</span>
                <div style={{ width: "12px", height: "12px", background: "#eab308", border: "1px solid #000", marginLeft: "4px" }} />
                <span>Med</span>
                <div style={{ width: "12px", height: "12px", background: "#dc2626", border: "1px solid #000", marginLeft: "4px" }} />
                <span>High</span>
              </div>
            </div>
          </div>
        ) : null}
      </MapContainer>
    </div>
  );
}
