import { useState } from "react";
import axios from "axios";

import NavBar from "../components/NavBar";
import CrawlResultRow from "../components/CrawlResultRow";

interface CrawlResult {
    url: string;
    title?: string;
    status: "success" | "error";
    error?: string;
}

interface CrawlResponse {
    pagesCrawled: number;
    pagesFailed: number;
    durationMs: number;
    results: CrawlResult[];
}

export default function CrawlPage() {
    const [url, setUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CrawlResponse | null>(null);

    async function startCrawl() {
        if (!url.trim() || loading) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post<CrawlResponse>(
                "http://localhost:3000/crawl",
                { url }
            );

            setResult(response.data);
        } catch (err) {
            setError("Couldn't crawl that site. Check the URL and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg)]">
            <NavBar />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
                    {/* Intro */}
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)]">
                            Crawl a website
                        </h2>
                        <p className="text-sm text-[var(--ink-muted)]">
                            Enter a URL to scrape its pages into your knowledge base.
                        </p>
                    </div>

                    {/* URL form */}
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] pl-4 pr-1.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent)]/30 focus-within:border-[var(--accent)] transition">
                        <input
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--ink-muted)]"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") startCrawl();
                            }}
                        />

                        <button
                            onClick={startCrawl}
                            disabled={loading || !url.trim()}
                            className="rounded-full bg-[var(--ink)] text-white text-xs font-medium px-4 py-2 disabled:bg-[var(--border)] disabled:text-[var(--ink-muted)] transition"
                        >
                            {loading ? "Crawling..." : "Start crawl"}
                        </button>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="animate-fade-in flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 w-fit">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                            <span className="text-sm text-[var(--ink-muted)] ml-1">
                                Crawling site...
                            </span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="animate-fade-in rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Results */}
                    {result && (
                        <div className="animate-fade-in space-y-4">
                            {/* Stats */}
                            <div className="flex items-center gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
                                <Stat label="Pages crawled" value={result.pagesCrawled} />
                                <Stat label="Failed" value={result.pagesFailed} />
                                <Stat
                                    label="Duration"
                                    value={`${(result.durationMs / 1000).toFixed(1)}s`}
                                />
                            </div>

                            {/* Page list */}
                            <div className="space-y-2">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                                    Pages
                                </span>

                                <div className="space-y-2">
                                    {result.results.map((page, index) => (
                                        <CrawlResultRow key={index} page={page} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div>
            <div className="text-lg font-semibold text-[var(--ink)]">{value}</div>
            <div className="text-xs text-[var(--ink-muted)]">{label}</div>
        </div>
    );
}