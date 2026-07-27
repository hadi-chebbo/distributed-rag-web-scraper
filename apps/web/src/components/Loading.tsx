export default function Loading() {
    return (
        <div className="animate-fade-in space-y-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                Assistant
            </span>

            <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}