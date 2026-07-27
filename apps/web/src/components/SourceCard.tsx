interface Source {
    url: string;
}

interface Props {
    sources: Source[];
}

export default function SourceCard({ sources }: Props) {
    if (!sources.length) return null;

    return (
        <div className="animate-fade-in space-y-2 pt-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                Sources
            </span>

            <div className="flex flex-wrap gap-2">
                {sources.map((source, index) => {
                    let label = source.url;
                    try {
                        label = new URL(source.url).hostname.replace("www.", "");
                    } catch {}

                    return (
                        
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            {label}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}