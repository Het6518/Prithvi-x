type GeminiMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `You are an expert agricultural advisor helping Indian farmers with practical and localized advice.
You provide simple, action-oriented guidance that field teams can immediately apply.
Keep responses clear, safe, and easy to understand. Use local Indian agricultural context.
When asked in a specific language, respond in that language.`;

function buildPrompt(messages: GeminiMessage[], language: string) {
  const prompt = [
    SYSTEM_PROMPT,
    `Respond in: ${language}`,
    "",
    ...messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`)
  ];

  return prompt.join("\n");
}

export async function askGemini(messages: GeminiMessage[], language: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return `Prithvix AI (${language}): Check irrigation stress first, inspect lower leaves for nutrient deficiency, and advise a follow-up field visit within 3 to 5 days. Use a balanced micronutrient spray only if symptoms continue.`;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: buildPrompt(messages, language)
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error");
      console.error("[Gemini] API error:", response.status, errorBody);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    // Safely extract response text
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") ||
      null;

    if (!text) {
      console.error("[Gemini] Empty response:", JSON.stringify(data));
      return "I apologize, I could not generate a response at this time. Please try rephrasing your question.";
    }

    return text;
  } catch (error) {
    console.error("[Gemini] Request failed:", error);
    throw new Error(
      error instanceof Error
        ? `AI service error: ${error.message}`
        : "Unable to reach AI service. Please try again."
    );
  }
}
