export function LoadingPanel({ rows = 4 }: { rows?: number }) {
  return (
    <div className="neo-card animate-pulse p-6">
      <div className="h-4 w-32 border-2 border-black/20 bg-forest/10" />
      <div className="mt-4 h-10 w-64 border-2 border-black/20 bg-forest/10" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-20 border-2 border-black/10 bg-white" />
        ))}
      </div>
    </div>
  );
}
