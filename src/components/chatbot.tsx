"use client";
import { useState, useEffect, useRef } from "react";
import { X, Send, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface GeminiHistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

const WELCOME: Message = {
  role: "assistant",
  content: "أهلاً! أنا مساعد قطرة ☕ اسألني عن أي شي يخص القهوة المقطرة والـ V60",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeminiHistoryItem[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const updatedHistory: GeminiHistoryItem[] = [
      ...history,
      { role: "user", parts: [{ text }] },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error },
        ]);
      } else {
        const assistantText: string = data.response;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantText },
        ]);
        setHistory([
          ...updatedHistory,
          { role: "model", parts: [{ text: assistantText }] },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "تعذّر الاتصال. تأكد من الإنترنت وحاول مرة ثانية.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="افتح مساعد القهوة"
        style={{
          position: "fixed",
          bottom: "5.5rem",
          left: "1rem",
          zIndex: 60,
          width: "52px",
          height: "52px",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, var(--accent-400), var(--accent-600))",
          border: "1.5px solid var(--accent-500)",
          boxShadow: "0 4px 20px rgba(196,154,60,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(196,154,60,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(196,154,60,0.35)";
        }}
      >
        {isOpen ? (
          <X size={20} color="#0c0906" />
        ) : (
          <Coffee size={20} color="#0c0906" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "9rem",
            left: "1rem",
            zIndex: 60,
            width: "min(380px, calc(100vw - 2rem))",
            maxHeight: "520px",
            display: "flex",
            flexDirection: "column",
            borderRadius: "1.25rem",
            overflow: "hidden",
            background: "var(--surface-900)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem 1rem",
              borderBottom: "1px solid var(--surface-700)",
              background: "var(--surface-800)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, var(--accent-400), var(--accent-600))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Coffee size={15} color="#0c0906" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--ink-100)",
                    lineHeight: 1.2,
                  }}
                >
                  مساعد قطرة
                </p>
                <p style={{ fontSize: "0.65rem", color: "var(--accent-400)" }}>
                  متخصص في القهوة المقطرة
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق"
              style={{
                color: "var(--ink-400)",
                padding: "0.25rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink-100)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink-400)")
              }
            >
              <X size={17} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.875rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
              minHeight: 0,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-start" : "flex-end",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "0.55rem 0.875rem",
                    borderRadius:
                      msg.role === "user"
                        ? "1rem 1rem 0.25rem 1rem"
                        : "1rem 1rem 1rem 0.25rem",
                    background:
                      msg.role === "user"
                        ? "var(--surface-700)"
                        : "linear-gradient(135deg, var(--accent-950), var(--surface-800))",
                    border:
                      msg.role === "user"
                        ? "1px solid var(--surface-600)"
                        : "1px solid rgba(196,154,60,0.25)",
                    color:
                      msg.role === "user" ? "var(--ink-200)" : "var(--ink-100)",
                    fontSize: "0.83rem",
                    lineHeight: 1.6,
                    direction: "rtl",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    padding: "0.6rem 0.875rem",
                    borderRadius: "1rem 1rem 1rem 0.25rem",
                    background: "linear-gradient(135deg, var(--accent-950), var(--surface-800))",
                    border: "1px solid rgba(196,154,60,0.25)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "9999px",
                        background: "var(--accent-400)",
                        animation: `dotPulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                        display: "inline-block",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              padding: "0.75rem",
              borderTop: "1px solid var(--surface-700)",
              display: "flex",
              gap: "0.5rem",
              background: "var(--surface-800)",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="اسألني عن قهوتك…"
              disabled={isLoading}
              style={{
                flex: 1,
                background: "var(--surface-950)",
                border: "1px solid var(--surface-600)",
                borderRadius: "0.75rem",
                padding: "0.5rem 0.875rem",
                color: "var(--ink-100)",
                fontSize: "0.83rem",
                direction: "rtl",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "var(--accent-500)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "var(--surface-600)")
              }
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="إرسال"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "0.75rem",
                background:
                  input.trim() && !isLoading
                    ? "linear-gradient(135deg, var(--accent-400), var(--accent-600))"
                    : "var(--surface-700)",
                border: "1px solid var(--surface-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                opacity: input.trim() && !isLoading ? 1 : 0.4,
                transition: "background 0.2s, opacity 0.2s",
                flexShrink: 0,
              }}
            >
              <Send size={15} color={input.trim() && !isLoading ? "#0c0906" : "var(--ink-400)"} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </>
  );
}
