import { NextRequest } from "next/server";
import { z } from "zod";
import { requireRequestUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { appendChatMessages, getChatSessions } from "@/lib/dashboard-data";
import { askGemini } from "@/lib/gemini";

const schema = z.object({
  sessionId: z.string().optional(),
  language: z.string().min(2),
  message: z.string().min(1)
});

export async function GET(request: NextRequest) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;

  const sessions = await getChatSessions(user.sub);
  return jsonOk({ sessions });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Invalid chat payload.");
  }

  try {
    const sessions = await getChatSessions(user.sub);
    const existingSession = parsed.data.sessionId
      ? sessions.find((session: (typeof sessions)[number]) => session.id === parsed.data.sessionId)
      : sessions[0];
    const history = (existingSession?.messages || []).map((message) => ({
      role: (message.role === "USER" ? "user" : "assistant") as "user" | "assistant",
      content: message.content
    }));

    const answer = await askGemini(
      [...history, { role: "user" as const, content: parsed.data.message }],
      parsed.data.language
    );

    const saved = await appendChatMessages({
      userId: user.sub,
      sessionId: parsed.data.sessionId,
      userMessage: parsed.data.message,
      assistantMessage: answer
    });

    const updatedSessions = await getChatSessions(user.sub);
    return jsonOk({
      sessionId: saved.sessionId,
      messages: saved.messages,
      sessions: updatedSessions
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to generate advice right now. Please try again.",
      500
    );
  }
}
