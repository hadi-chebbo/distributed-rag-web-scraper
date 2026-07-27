import { useState } from "react";

interface Props {
    onSend: (question: string) => void;
    loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
    const [question, setQuestion] = useState("");

    function submit() {
        if (!question.trim() || loading) return;
        onSend(question);
        setQuestion("");
    }

    return (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] px-6 py-4">
            <div className="max-w-3xl mx-auto flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] pl-4 pr-1.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent)]/30 focus-within:border-[var(--accent)] transition">
                <input
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--ink-muted)]"
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submit();
                    }}
                />

                <button
                    onClick={submit}
                    disabled={loading || !question.trim()}
                    aria-label="Send question"
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--ink)] text-white disabled:bg-[var(--border)] disabled:text-[var(--ink-muted)] transition"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 19V5M12 5L5 12M12 5L19 12"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}