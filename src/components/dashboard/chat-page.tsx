"use client";

import { useEffect, useMemo, useState } from "react";
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
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
      window.alert(error instanceof Error ? error.message : "Unable to send message.");
    } finally {
      setLoading(false);
    }
  }

  if (chatQuery.loading) {
    return <LoadingPanel rows={3} />;
  }

  if (chatQuery.error) {
    return <div className="glass-panel rounded-[2rem] p-6 text-sm text-rose-700 shadow-sm">{chatQuery.error}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <aside className="glass-panel rounded-[2rem] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Sessions</p>
          <button
            onClick={() => {
              setCreatingNew(true);
              setSelectedSessionId("");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-forest/5 px-3 py-2 text-xs font-semibold text-forest"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {chatQuery.data.sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => {
                setCreatingNew(false);
                setSelectedSessionId(session.id);
              }}
              className={`w-full rounded-[1.3rem] border p-4 text-left ${
                selectedSessionId === session.id
                  ? "border-gold/50 bg-gold/10"
                  : "border-forest/10 bg-white/70"
              }`}
            >
              <p className="font-semibold text-forest">{session.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-forest/55">{session.preview}</p>
            </button>
          ))}
        </div>
      </aside>

      <div className="glass-panel flex min-h-[720px] flex-col rounded-[2rem] p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-forest/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">AI Agronomist</p>
            <h2 className="mt-2 text-3xl font-semibold text-forest">Multilingual advisory support</h2>
          </div>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-full border border-forest/10 bg-white/75 px-4 py-2 text-sm outline-none"
          >
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto py-6">
          {!selectedSession && !loading ? (
            <div className="rounded-[1.6rem] border border-dashed border-forest/15 bg-white/60 p-6 text-sm text-forest/60">
              Start a fresh session to ask about crop stress, irrigation, pest pressure, or nutrient deficiency.
            </div>
          ) : null}
          {(selectedSession?.messages || []).map((message) => (
            <div key={message.id} className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-[1.6rem] px-5 py-4 text-sm leading-7 ${
                  message.role === "USER" ? "bg-forest text-background" : "bg-white/75 text-forest"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-3 rounded-[1.6rem] bg-white/75 px-5 py-4 text-forest">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Typing response...
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 border-t border-forest/10 pt-5">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 rounded-full border border-forest/10 bg-white/80 px-5 py-3 outline-none"
            placeholder="Ask about crop stress, irrigation, nutrient deficiency, or disease..."
          />
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest text-background">
            <SendHorizonal className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
