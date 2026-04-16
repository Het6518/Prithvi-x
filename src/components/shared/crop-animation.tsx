"use client";

import { useEffect, useState } from "react";

// You can customize the colorful emojis here!
const FLOWERS = ["🌷", "🌻", "🌺", "🌷", "🌾", "🌼", "🌷", "🌸"];

export function CropAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate a random-looking but static array of colorful flowers
  const crops = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    emoji: FLOWERS[i % FLOWERS.length],
    delay: (i * 0.3) % 2,
    size: 28 + (i * 11) % 16, // Font sizes from 28px to 44px
  }));

  return (
    // Fixed container ensures it stays attached to the bottom of the viewport
    // z-50 keeps it above other content, pointer-events-none ensures it doesn't block clicks
    <div className="fixed bottom-[-4px] left-0 right-0 pointer-events-none z-50 flex items-end justify-between overflow-hidden px-4 sm:px-12 h-32 opacity-95">
      {crops.map((crop) => (
        <div
          key={crop.id}
          className="animate-sway origin-bottom"
          style={{
            fontSize: `${crop.size}px`,
            lineHeight: 1,
            animationDelay: `${crop.delay}s`,
            animationDuration: `${3 + crop.delay}s`,
            filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.3))",
          }}
        >
          {crop.emoji}
        </div>
      ))}
    </div>
  );
}
