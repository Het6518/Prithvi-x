export function GlobeFallback() {
  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-[2rem] border border-white/40 bg-[radial-gradient(circle_at_30%_20%,rgba(212,168,83,0.22),transparent_20%),radial-gradient(circle_at_65%_35%,rgba(26,60,43,0.38),transparent_28%),linear-gradient(160deg,rgba(14,26,20,0.95),rgba(26,60,43,0.9))] shadow-ambient">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-[radial-gradient(circle_at_30%_30%,rgba(212,168,83,0.25),transparent_18%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.08),transparent_10%),radial-gradient(circle_at_center,rgba(38,97,71,0.95),rgba(16,35,27,1))] shadow-[0_0_80px_rgba(26,60,43,0.8)]" />
      <div className="absolute left-[30%] top-[36%] h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_18px_rgba(212,168,83,0.8)]" />
      <div className="absolute left-[57%] top-[41%] h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.85)]" />
      <div className="absolute left-[45%] top-[58%] h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_18px_rgba(212,168,83,0.8)]" />
      <div className="absolute bottom-6 left-6 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium tracking-[0.24em] text-white/80">
        WEBGL FALLBACK
      </div>
    </div>
  );
}
