import { cn } from "@/lib/utils";

export function StatusPill({ value }: { value: string }) {
  const tones: Record<string, string> = {
    CLEAR: "bg-emerald-200 text-emerald-900",
    DUE: "bg-amber-200 text-amber-900",
    OVERDUE: "bg-rose-200 text-rose-900",
    GOLD: "bg-amber-200 text-amber-900",
    SILVER: "bg-slate-200 text-slate-800",
    BRONZE: "bg-orange-200 text-orange-900"
  };

  return (
    <span className={cn("neo-pill", tones[value] || "bg-forest/10 text-forest")}>
      {value}
    </span>
  );
}
