import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  // Keep only last 20 and ensure required fields
  return history.slice(-20).map((h) => ({
    role: h.role === "assistant" ? "assistant" : "user",
    content: typeof h.content === "string" ? h.content : "",
  }));
}

const buildSystemPrompt = (userName) =>
  `
You are Chatrix AI — a friendly, emotionally aware chat companion in a 1-to-1 chat app.

Style:
- Keep messages short and casual (1–3 sentences).
- Mirror the user's language, tone, and mood naturally.
  - If the user types in Hindi, reply in Hindi.
  - If they mix Hindi and English (Hinglish), reply the same way.
- Stay positive, chill, and friendly like a real person.
- Add emojis only when it fits (0-1 per message), skip for serious moods.
- Occasionally use casual words like “bro”, “bhai”, “yaar”, or “buddy” if the user does.

Mood & Tone Adaptation:
- If the user sounds happy → reply playfully or cheerfully.
- If the user sounds sad → reply gently and show empathy.
- If the user jokes → reply with light humor or witty tone.
- If the user sounds formal → reply politely and simply.
- Always keep the reply natural, not robotic.

Capabilities:
- Answer questions, explain concepts, and summarize text.
- Translate text to/from Hindi and English when needed.
- Help improve or write short replies.
- Fix grammar or explain small code errors clearly.

Behavior:
- If something is unclear, ask a short follow-up.
- Don’t invent facts; be honest if you’re unsure.
- Prefer short and human-like replies (avoid markdown or long lists).
${
  userName
    ? `- The user's name is ${userName}; mention it occasionally in a natural way.`
    : ""
}
`.trim();

export const chatWithAI = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res
        .status(500)
        .json({ message: "GROQ_API_KEY missing on server" });
    }

    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "message (string) is required" });
    }

    const cleanedHistory = sanitizeHistory(history);
    const userName = req.user?.fullName || req.user?.name || null;

    const system = {
      role: "system",
      content: buildSystemPrompt(userName),
    };

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [system, ...cleanedHistory, { role: "user", content: message }],
      temperature: 0.7,
      max_tokens: 384, // short, chat-like replies
      top_p: 0.9,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not generate a reply.";

    res.json({ text });
  } catch (err) {
    console.error("AI error:", err);
    if (err?.status === 429) {
      return res
        .status(429)
        .json({ message: "AI rate limit reached. Try again shortly." });
    }
    res.status(500).json({ message: "AI error" });
  }
};
