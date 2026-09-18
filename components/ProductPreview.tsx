export default function ProductPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_0_90px_-25px_rgba(79,142,247,0.35)]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>

      {/* Tab bar mirroring the real app: Board | Planner | Notes | Plugins */}
      <div className="flex gap-1 border-b border-border bg-background/40 px-4 py-2.5 text-xs font-medium text-muted">
        <span className="rounded-full bg-surface-elevated px-3 py-1 text-foreground">Board</span>
        <span className="px-3 py-1">Planner</span>
        <span className="px-3 py-1">Notes</span>
        <span className="relative px-3 py-1 text-accent">
          Plugins
          <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-5">
        {/* Left: sample board rows */}
        <div className="space-y-2.5 sm:col-span-3">
          {[
            { label: "Rm 412 - Post-op check", tag: "Due 2:00p", tone: "text-blue" },
            { label: "Rm 208 - Pain reassessment", tag: "Due 3:30p", tone: "text-teal" },
            { label: "Rm 315 - D/C summary", tag: "Due 5:00p", tone: "text-purple" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-3.5 py-3"
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-1.5 w-1.5 rounded-full bg-current ${row.tone}`} />
                <span className="text-[13px] text-foreground/90">{row.label}</span>
              </div>
              <span className="text-[11px] text-muted">{row.tag}</span>
            </div>
          ))}
        </div>

        {/* Right: plugin builder callout */}
        <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-4 sm:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
            Plugin Builder
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Build a custom clinical tool with AI and share it with your team.
          </p>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-white/10" />
            <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
            <div className="h-1.5 w-2/3 rounded-full bg-accent/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
