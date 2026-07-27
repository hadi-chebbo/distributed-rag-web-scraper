interface Page {
    url: string;
    title?: string;
    status: "success" | "error";
    error?: string;
}

export default function CrawlResultRow({ page }: { page: Page }) {
    const isError = page.status === "error";

    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <div className="min-w-0">
                <div className="text-sm text-[var(--ink)] truncate">
                    {page.title || page.url}
                </div>
                <div className="text-xs text-[var(--ink-muted)] truncate">
                    {page.url}
                </div>
            </div>

            <span
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isError
                        ? "bg-red-50 text-red-700"
                        : "bg-[var(--accent-soft)] text-[var(--accent)]"
                }`}
            >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        isError ? "bg-red-500" : "bg-[var(--accent)]"
                    }`}
                />
                {isError ? "Failed" : "Scraped"}
            </span>
        </div>
    );
}