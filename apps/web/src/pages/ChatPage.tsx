import { useState } from "react";
import axios from "axios";

import NavBar from "../components/NavBar";
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
            <NavBar />

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