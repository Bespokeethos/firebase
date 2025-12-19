"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant" | "system";

type Message = {
  role: Role;
  content: string;
};

const STORAGE_KEY = "prometheus.chat.v1";
const STORAGE_LAST_ACTIVE_KEY = "prometheus.chat.lastActive";
const STALE_MS = 24 * 60 * 60 * 1000;

function nowMs() {
  return Date.now();
}

function loadStored(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((m) => m && typeof m === "object")
      .map((m) => ({ role: m.role as Role, content: String(m.content ?? "") }))
      .filter((m) => (m.role === "user" || m.role === "assistant" || m.role === "system") && m.content);
  } catch {
    return [];
  }
}

function isStale(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
    if (!raw) return false;
    const t = Number(raw);
    if (!Number.isFinite(t)) return false;
    return nowMs() - t > STALE_MS;
  } catch {
    return false;
  }
}

function touchActive() {
  try {
    localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(nowMs()));
  } catch {
    // ignore
  }
}

function saveStored(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    touchActive();
  } catch {
    // ignore
  }
}

export function ChatbotPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isStale()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY);
      setMessages([]);
      return;
    }

    const stored = loadStored();
    setMessages(stored);
  }, []);

  useEffect(() => {
    saveStored(messages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const displayMessages = useMemo(() => {
    if (messages.length > 0) return messages;
    return [
      {
        role: "assistant" as const,
        content: "Ask me for a brief, competitors, content drafts, or next steps.",
      },
    ];
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || isSending) return;

    setError(null);
    setIsSending(true);

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }

      setMessages((prev: any) => [...prev, { role: "assistant", content: String(data.reply ?? "") }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setMessages((prev: any) => [
        ...prev,
        {
          role: "assistant",
          content: "I hit an error generating a response. Try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function newChat() {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div>
          <h2 className="text-sm text-gray-400">Chat</h2>
          <p className="text-base font-medium">Prometheus Assistant</p>
        </div>
        <button
          type="button"
          onClick={newChat}
          className="text-sm text-gray-300 hover:text-white underline underline-offset-4"
        >
          New chat
        </button>
      </div>

      <div className="px-4 py-3 space-y-3 max-h-[45vh] overflow-auto">
        {displayMessages.map((m: { role: string; content: any; }, idx: any) => (
          <div
            key={idx}
            className={
              m.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                  : "max-w-[85%] bg-black/30 border border-zinc-800 rounded-lg px-3 py-2"
              }
            >
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-zinc-800">
        {error ? (
          <p className="text-xs text-red-400 mb-2">{error}</p>
        ) : null}

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e: { target: { value: any; }; }) => setInput(e.target.value)}
            onKeyDown={(e: { key: string; preventDefault: () => void; }) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Ask Prometheus…"
            className="flex-1 bg-black/30 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-600"
            disabled={isSending}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={isSending}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 rounded-lg px-3 py-2 text-sm border border-zinc-700"
          >
            {isSending ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
