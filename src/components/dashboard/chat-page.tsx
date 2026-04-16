"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Plus, SendHorizonal } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import type { ChatSessionRecord } from "@/lib/types";

const languages = ["English", "Hindi", "Gujarati", "Marathi", "Rajasthani"];

export function ChatPage() {
  const chatQuery = useApiResource<{ sessions: ChatSessionRecord[] }>("/api/chat", { sessions: [] });
  const [language, setLanguage] = useState("English");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [chatError, setChatError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setChatError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId: selectedSessionId || undefined,
          language,
          message: input.trim()
        })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to send message.");

      setInput("");
      setCreatingNew(false);
      setSelectedSessionId(payload.sessionId);
      chatQuery.setData({ sessions: payload.sessions });
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Unable to send message.");
    } finally {
      setLoading(false);
    }
  }

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
            }}
            className="neo-pill bg-gold/20 text-forest cursor-pointer hover:bg-gold/40 transition-colors"
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
              }}
              className={`w-full border-3 border-black p-4 text-left transition-all ${
                selectedSessionId === session.id
                  ? "bg-gold/20 shadow-neo-sm"
                  : "bg-white hover:shadow-neo-sm hover:translate-x-0.5"
              }`}
              style={{ borderRadius: "6px" }}
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
                Typing...
              </div>
            </div>
          ) : null}
          {chatError ? (
            <div className="neo-toast">{chatError}</div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 border-t-3 border-black pt-5">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="neo-input flex-1"
            placeholder="Ask about crop stress, irrigation, nutrient deficiency, or disease..."
          />
          <button className="neo-btn-primary flex h-12 w-12 items-center justify-center !px-0" type="submit">
            <SendHorizonal className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
