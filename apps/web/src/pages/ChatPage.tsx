import { useState } from "react";
import axios from "axios";

import ChatInput from "../components/ChatInput";
import Loading from "../components/Loading";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    async function askQuestion(question: string) {
        setMessages((prev) => [...prev, { role: "user", content: question }]);

        try {
            setLoading(true);

            const response = await axios.post("http://localhost:3000/ask", {
                question,
            });

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.data.answer },
            ]);

        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Something went wrong. Try again." },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex flex-col bg-[var(--bg)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-pulse-dot" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                    </span>
                    <div>
                        <h1 className="text-sm font-semibold tracking-tight text-[var(--ink)]">
                            AI Assistant
                        </h1>
                        <p className="text-xs text-[var(--ink-muted)]">
                            Ask questions about your scraped data
                        </p>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                    {messages.length === 0 && !loading && (
                        <div className="h-[50vh] flex flex-col items-center justify-center text-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
                                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                            </div>
                            <p className="text-sm text-[var(--ink-muted)]">
                                Ask something to get started
                            </p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div key={index} className="animate-fade-in space-y-1.5">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                                {message.role === "user" ? "You" : "Assistant"}
                            </span>

                            <div
                                className={
                                    message.role === "user"
                                        ? "rounded-2xl rounded-tl-sm bg-[var(--ink)] text-white px-4 py-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed"
                                        : "rounded-2xl rounded-tl-sm bg-[var(--surface)] border border-[var(--border)] px-4 py-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed"
                                }
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}

                    {loading && <Loading />}
                </div>
            </main>

            <ChatInput onSend={askQuestion} loading={loading} />
        </div>
    );
}