import { INTERVIEWER_SYSTEM_PROMPT } from "../src/lib/interviewer-system-prompt.js";
import { getGitHubContext } from "./github-context.js";

const requests = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter((time) => time > now - 60_000);
  recent.push(now); requests.set(ip, recent); return recent.length > 12;
}
function validateMessages(value) {
  if (!Array.isArray(value) || !value.length || value.length > 10) return null;
  const messages = value.map(({ role, content }) => ({ role, content: typeof content === "string" ? content.trim() : "" }));
  if (messages.some(({ role, content }) => !["user", "assistant"].includes(role) || !content || content.length > 1200)) return null;
  return messages[messages.length - 1].role === "user" ? messages : null;
}
export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  if (rateLimited(request.headers["x-forwarded-for"]?.split(",")[0] || "unknown")) return response.status(429).json({ error: "Too many questions. Please wait a minute." });
  const messages = validateMessages(request.body?.messages);
  if (!messages) return response.status(400).json({ error: "Please send a valid interview question." });
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: "The interview assistant has not been configured yet." });
  try {
    const githubContext = await getGitHubContext();
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5.6-sol", instructions: `${INTERVIEWER_SYSTEM_PROMPT}\n\nLIVE PUBLIC GITHUB EVIDENCE:\n${JSON.stringify(githubContext)}`, input: messages, max_output_tokens: 700 }),
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data.error?.message || "OpenAI request failed");
    const message = data.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
    if (!message) throw new Error("The model returned no answer");
    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json({ message });
  } catch (error) {
    console.error("Interview chat error:", error instanceof Error ? error.message : error);
    return response.status(502).json({ error: "The interview assistant is temporarily unavailable." });
  }
}
