type GeminiMessage = {
  role: "user" | "assistant";
  content: string;
};

function buildPrompt(messages: GeminiMessage[], language: string) {
  const prompt = [
    "You are an agricultural expert helping Indian farmers.",
    `Provide simple, practical advice in the selected language: ${language}.`,
    "Keep the answer action-oriented, safe, and easy to understand for field teams.",
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
    throw new Error("Gemini request failed");
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") ||
    "No response received."
  );
}
