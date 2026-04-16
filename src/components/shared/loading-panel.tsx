export function LoadingPanel({ rows = 4 }: { rows?: number }) {
  return (
    <div className="glass-panel animate-pulse rounded-[2rem] p-6 shadow-sm">
      <div className="h-4 w-32 rounded-full bg-forest/10" />
      <div className="mt-4 h-10 w-64 rounded-2xl bg-forest/10" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-20 rounded-[1.4rem] bg-white/70" />
        ))}
      </div>
    </div>
  );
}
