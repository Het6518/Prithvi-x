import { cn } from "@/lib/utils";

export function StatusPill({ value }: { value: string }) {
  const tones: Record<string, string> = {
    CLEAR: "bg-emerald-100 text-emerald-800",
    DUE: "bg-amber-100 text-amber-800",
    OVERDUE: "bg-rose-100 text-rose-800",
    GOLD: "bg-amber-100 text-amber-900",
    SILVER: "bg-slate-100 text-slate-700",
    BRONZE: "bg-orange-100 text-orange-800"
  };

  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", tones[value] || "bg-forest/10 text-forest")}>
      {value}
    </span>
  );
}
