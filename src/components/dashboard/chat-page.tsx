"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Plus, RefreshCw, SendHorizonal } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import type { ChatSessionRecord } from "@/lib/types";

const languages = ["English", "Hindi", "Gujarati", "Marathi", "Rajasthani"];
const MIN_REQUEST_GAP_MS = 2500; // Prevent client-side spam

export function ChatPage() {
  const chatQuery = useApiResource<{ sessions: ChatSessionRecord[] }>("/api/chat", { sessions: [] });
  const [language, setLanguage] = useState("English");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [chatError, setChatError] = useState("");
  const [lastFailedMessage, setLastFailedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSendTime = useRef(0);

  useEffect(() => {
    if (!creatingNew && !selectedSessionId && chatQuery.data.sessions[0]?.id) {
      setSelectedSessionId(chatQuery.data.sessions[0].id);
    }
  }, [chatQuery.data.sessions, creatingNew, selectedSessionId]);

  const selectedSession = useMemo(
    () => {
      if (!selectedSessionId) return null;
      return chatQuery.data.sessions.find((session) => session.id === selectedSessionId) || null;
    },
    [chatQuery.data.sessions, selectedSessionId]
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedSession?.messages, loading]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    // Client-side rate limiting — prevent rapid-fire clicks
    const now = Date.now();
    if (now - lastSendTime.current < MIN_REQUEST_GAP_MS) {
      setChatError("Please wait a moment before sending another message.");
      return;
    }
    lastSendTime.current = now;

    setLoading(true);
    setChatError("");
    setLastFailedMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId: selectedSessionId || undefined,
          language,
          message: messageText.trim()
        })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to send message.");

      setInput("");
      setCreatingNew(false);
      setSelectedSessionId(payload.sessionId);
      chatQuery.setData({ sessions: payload.sessions });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to send message.";
      setChatError(errorMessage);
      setLastFailedMessage(messageText.trim());
    } finally {
      setLoading(false);
    }
  }, [loading, selectedSessionId, language, chatQuery]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await sendMessage(input);
  }

  async function handleRetry() {
    if (lastFailedMessage) {
      await sendMessage(lastFailedMessage);
    }
  }

  // Determine if send button should be disabled
  const isSendDisabled = loading || !input.trim();

  if (chatQuery.loading) {
    return <LoadingPanel rows={3} />;
  }

  if (chatQuery.error) {
    return <div className="neo-error">{chatQuery.error}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <aside className="neo-card p-5">
        <div className="flex items-center justify-between">
          <p className="neo-eyebrow">Sessions</p>
          <button
            onClick={() => {
              setCreatingNew(true);
              setSelectedSessionId("");
              setChatError("");
              setLastFailedMessage("");
            }}
            className="neo-pill bg-gold/20 text-forest cursor-pointer hover:bg-gold/40 transition-colors"
            disabled={loading}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> New
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {chatQuery.data.sessions.length === 0 ? (
            <div className="border-2 border-dashed border-black/20 p-4 text-center text-xs font-medium text-forest/50">
              No sessions yet. Start a new one!
            </div>
          ) : null}
          {chatQuery.data.sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => {
                setCreatingNew(false);
                setSelectedSessionId(session.id);
                setChatError("");
                setLastFailedMessage("");
              }}
              className={`w-full border-3 border-black p-4 text-left transition-all ${
                selectedSessionId === session.id
                  ? "bg-gold/20 shadow-neo-sm"
                  : "bg-white hover:shadow-neo-sm hover:translate-x-0.5"
              }`}
              style={{ borderRadius: "6px" }}
              disabled={loading}
            >
              <p className="font-bold text-forest">{session.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-forest/55">{session.preview}</p>
            </button>
          ))}
        </div>
      </aside>

      <div className="neo-card flex min-h-[720px] flex-col p-6">
        <div className="flex flex-col gap-4 border-b-3 border-black pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="neo-eyebrow">AI Agronomist</p>
            <h2 className="mt-2 text-3xl font-bold text-forest">Multilingual advisory support</h2>
          </div>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="neo-select"
            style={{ width: "auto" }}
            disabled={loading}
          >
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto py-6">
          {!selectedSession && !loading ? (
            <div className="neo-empty">
              Start a fresh session to ask about crop stress, irrigation, pest pressure, or nutrient deficiency.
            </div>
          ) : null}
          {(selectedSession?.messages || []).map((message) => (
            <div key={message.id} className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.role === "USER" ? "neo-bubble-user" : "neo-bubble-bot"}`}>
                {message.content}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="neo-bubble-bot inline-flex items-center gap-3">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span className="typing-dots">AI advisor is typing</span>
              </div>
            </div>
          ) : null}
          {chatError ? (
            <div className="space-y-3">
              <div className="neo-toast">{chatError}</div>
              {lastFailedMessage ? (
                <div className="flex justify-center">
                  <button
                    onClick={handleRetry}
                    disabled={loading}
                    className="inline-flex items-center gap-2 border-3 border-black bg-white px-5 py-2.5 text-sm font-bold text-forest shadow-neo-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderRadius: "6px" }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry message
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 border-t-3 border-black pt-5">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="neo-input flex-1"
            placeholder="Ask about crop stress, irrigation, nutrient deficiency, or disease..."
            disabled={loading}
          />
          <button
            className="neo-btn-primary flex h-12 w-12 items-center justify-center !px-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            disabled={isSendDisabled}
            title={loading ? "Waiting for response..." : "Send message"}
          >
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
