"use client";

import dynamic from "next/dynamic";
import { GlobeFallback } from "@/components/3d/globe-fallback";

const GlobeScene = dynamic(
  () => import("@/components/3d/globe-scene").then((mod) => mod.GlobeScene),
  {
    ssr: false,
    loading: () => <GlobeFallback />
  }
);

export function LazyGlobe() {
  return <GlobeScene />;
}
