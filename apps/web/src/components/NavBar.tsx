import { NavLink } from "react-router-dom";

const tabs = [
    { to: "/", label: "Chat" },
    { to: "/crawl", label: "Crawl" },
];

export default function NavBar() {
    return (
        <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm px-6 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-pulse-dot" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                    </span>
                    <h1 className="text-sm font-semibold tracking-tight text-[var(--ink)]">
                        RAG Assistant
                    </h1>
                </div>

                <nav className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg)] p-1">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            end
                            className={({ isActive }) =>
                                `px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                                    isActive
                                        ? "bg-[var(--ink)] text-white"
                                        : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                                }`
                            }
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}