"use client";

import { useEffect, useState } from "react";

export function CropAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate a random-looking but static array of crops so it doesn't cause hydration errors
  const crops = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: (i * 0.3) % 2,
    baseHeight: 30 + (i * 17) % 50,
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-40 overflow-hidden h-40 opacity-30 flex items-end justify-between px-10">
      {crops.map((crop) => (
        <div
          key={crop.id}
          className="crop-stalk"
          style={{
            height: `${crop.baseHeight}px`,
            animationDelay: `${crop.delay}s`,
            animationDuration: `${3 + crop.delay}s`,
          }}
        >
          <div 
            className="crop-leaf-left" 
            style={{ animationDelay: `${crop.delay + 0.5}s` }} 
          />
          <div 
            className="crop-leaf-right" 
            style={{ animationDelay: `${crop.delay + 0.2}s` }} 
          />
        </div>
      ))}
    </div>
  );
}
