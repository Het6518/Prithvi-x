type GeminiMessage = {
  role: "user" | "model";
  content: string;
};

const SYSTEM_PROMPT = `You are an expert agricultural advisor helping Indian farmers with practical and localized advice.
You provide simple, action-oriented guidance that field teams can immediately apply.
Keep responses clear, safe, and easy to understand. Use local Indian agricultural context.
When asked in a specific language, respond in that language.`;

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;
const RATE_LIMIT_INTERVAL_MS = 2000; // 1 request per 2 seconds

// Server-side rate limiter — tracks last request timestamp
let lastRequestTime = 0;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFallbackResponse(language: string): string {
  const responses: Record<string, string> = {
    Hindi:
      "मैं अभी उपलब्ध नहीं हूँ। कृपया सिंचाई तनाव की जाँच करें, निचली पत्तियों में पोषक तत्वों की कमी का निरीक्षण करें, और 3 से 5 दिनों के भीतर अनुवर्ती क्षेत्र यात्रा की सलाह दें।",
    Gujarati:
      "હું હાલમાં ઉપલબ્ધ નથી. કૃપા કરીને સિંચાઈ તણાવ તપાસો, નીચેના પાંદડામાં પોષક તત્વોની ઉણપનું નિરીક્ષણ કરો, અને 3 થી 5 દિવસમાં ફોલો-અપ ફિલ્ડ મુલાકાતની સલાહ આપો.",
    Marathi:
      "मी सध्या उपलब्ध नाही. कृपया सिंचन ताण तपासा, खालच्या पानांमध्ये पोषक तत्वांची कमतरता तपासा आणि 3 ते 5 दिवसांत फॉलो-अप फील्ड भेटीचा सल्ला द्या.",
    Rajasthani:
      "म्हे अबे उपलब्ध कोनी। कृपया सिंचाई तनाव री जांच करो, नीचली पत्तियां में पोषक तत्वां री कमी रो निरीक्षण करो, अर 3 सूं 5 दिनां में फॉलो-अप फील्ड विजिट री सलाह दो।"
  };

  return (
    responses[language] ||
    "I'm temporarily unavailable due to high demand. In the meantime: Check irrigation stress first, inspect lower leaves for nutrient deficiency signs, and advise a follow-up field visit within 3 to 5 days. Use a balanced micronutrient spray only if symptoms continue."
  );
}

async function enforceRateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed < RATE_LIMIT_INTERVAL_MS) {
    const waitTime = RATE_LIMIT_INTERVAL_MS - elapsed;
    console.log(`[Gemini] Rate limiter: waiting ${waitTime}ms before next request`);
    await sleep(waitTime);
  }

  lastRequestTime = Date.now();
}

export async function askGemini(messages: GeminiMessage[], language: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("[Gemini] API key not found. Using fallback response.");
    return getFallbackResponse(language);
  }

  // Enforce server-side rate limit: max 1 request per 2 seconds
  await enforceRateLimit();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(
        // Change this in your fetch URL
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            system: `${SYSTEM_PROMPT}\n\nRespond in: ${language}`,
            contents: messages.map((message) => ({
              role: message.role === "user" ? "user" : "model",
              parts: [{ text: message.content }]
            }))
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      // Handle rate limiting with exponential backoff retry
      if (response.status === 429) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[Gemini] Rate limited (429). Retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms...`);
        lastError = new Error("The AI advisor is busy. Please wait a moment and try again.");
        await sleep(delay);
        continue;
      }

      if (response.status === 403) {
        console.error("[Gemini] API key invalid or quota exhausted (403).");
        return getFallbackResponse(language);
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "Unknown error");
        console.error("[Gemini] API error:", response.status, errorBody);
        throw new Error("Unable to reach AI advisor. Please try again shortly.");
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
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn("[Gemini] Request timed out.");
        lastError = new Error("Request timed out. Please try again.");
      } else if (lastError?.message?.includes("busy") && attempt < MAX_RETRIES - 1) {
        continue;
      } else {
        console.error("[Gemini] Request failed:", error);
        lastError = error instanceof Error ? error : new Error("Unknown error");
      }
    }
  }

  // All retries exhausted — return a helpful fallback instead of crashing
  console.warn("[Gemini] All retries exhausted. Returning fallback response.");
  return getFallbackResponse(language);
}