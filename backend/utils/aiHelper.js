const OpenAI = require("openai");

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const generateAISummary = async (transcript) => {
  if (!openai) {
    return {
      summary: "AI summary not available (no OpenAI key configured).",
      actionItems: [],
    };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a meeting intelligence assistant. Analyze meeting transcripts and return JSON with:
{
  "summary": "2-3 sentence concise summary",
  "actionItems": [
    { "task": "task description", "assignee": "person name or 'TBD'", "dueDate": null }
  ]
}
Return ONLY valid JSON, nothing else.`,
      },
      {
        role: "user",
        content: `Analyze this meeting transcript:\n\n${transcript}`,
      },
    ],
    max_tokens: 1000,
  });

  const text = response.choices[0].message.content;
  try {
    const parsed = JSON.parse(text);
    return {
      summary: parsed.summary || "",
      actionItems: parsed.actionItems || [],
    };
  } catch {
    return { summary: text, actionItems: [] };
  }
};

module.exports = { generateAISummary };
