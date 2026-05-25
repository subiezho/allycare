import OpenAI from "openai";

let client = null;

function getClient() {
  if (client) {
    return client;
  }

  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateStrategicNarrative({ systemPrompt, userPrompt }) {
  const ai = getClient();

  if (!ai) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const response = await ai.responses.create({
    model,
    temperature: 0.2,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: userPrompt }]
      }
    ]
  });

  return response.output_text || null;
}
