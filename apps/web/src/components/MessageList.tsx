interface Props {
    answer: string;
}

export default function MessageList({ answer }: Props) {
    if (!answer) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                <div className="h-10 w-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                </div>
                <p className="text-sm text-[var(--ink-muted)]">
                    Ask something about your scraped data
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-8 overflow-y-auto">
            <div className="animate-fade-in space-y-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                    Assistant
                </span>

                <div className="rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 whitespace-pre-wrap text-sm leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}