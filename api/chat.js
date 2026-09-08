import { INTERVIEWER_SYSTEM_PROMPT } from "../src/lib/interviewer-system-prompt.js";
import { getGitHubContext } from "./github-context.js";

const requests = new Map();
function configuredModel() {
  const model = process.env.OPENAI_MODEL?.trim();
  // Keep deployments configured from the earlier README working: `gpt-5.6`
  // is the product name, while `gpt-5.6-sol` is its Responses API model ID.
  return !model || model === "gpt-5.6" ? "gpt-5.6-sol" : model;
}

function openAIError(status) {
  if (status === 401 || status === 403) return "The OpenAI API key is invalid or cannot use the configured model.";
  if (status === 404) return "The configured OpenAI model is unavailable. Set OPENAI_MODEL to gpt-5.6-sol in Vercel and redeploy.";
  if (status === 429) return "The interview assistant has reached its OpenAI usage limit. Please try again later.";
  return "The interview assistant is temporarily unavailable.";
}

function fail(response, status, error, requestId, stage, code) {
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json({ error, requestId, diagnostic: { stage, code } });
}

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
  const requestId = request.headers["x-vercel-id"] || crypto.randomUUID();
  response.setHeader("X-Request-Id", requestId);
  response.setHeader("Cache-Control", "no-store");
  console.info("[AskMeddah API] request started", { requestId, method: request.method });
  if (request.method !== "POST") return fail(response, 405, "Method not allowed.", requestId, "request", "method_not_allowed");
  if (rateLimited(request.headers["x-forwarded-for"]?.split(",")[0] || "unknown")) return fail(response, 429, "Too many questions. Please wait a minute.", requestId, "request", "rate_limited");
  const messages = validateMessages(request.body?.messages);
  if (!messages) return fail(response, 400, "Please send a valid interview question.", requestId, "request", "invalid_messages");
  if (!process.env.OPENAI_API_KEY) return fail(response, 503, "The interview assistant has not been configured yet.", requestId, "configuration", "missing_openai_key");

  let githubContext;
  try {
    githubContext = await getGitHubContext();
    console.info("[AskMeddah API] GitHub context loaded", { requestId, repositoryCount: githubContext.repositories.length, fetchedAt: githubContext.fetchedAt });
  } catch (error) {
    console.error("[AskMeddah API] GitHub context failed", { requestId, message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    return fail(response, 502, "GitHub activity is temporarily unavailable. Please try again shortly.", requestId, "github", "context_unavailable");
  }

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: configuredModel(), instructions: `${INTERVIEWER_SYSTEM_PROMPT}\n\nLIVE GITHUB EVIDENCE:\n${JSON.stringify(githubContext)}`, input: messages, max_output_tokens: 700 }),
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      console.error("[AskMeddah API] OpenAI response failed", { requestId, status: apiResponse.status, code: data.error?.code || data.error?.type || "unknown", message: data.error?.message });
      return fail(response, 502, openAIError(apiResponse.status), requestId, "openai", `upstream_${apiResponse.status}`);
    }
    const message = data.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
    if (!message) throw new Error("The model returned no answer");
    console.info("[AskMeddah API] request completed", { requestId, outputLength: message.length });
    return response.status(200).json({ message, requestId });
  } catch (error) {
    console.error("[AskMeddah API] OpenAI request failed", { requestId, message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    return fail(response, 502, "The interview assistant is temporarily unavailable.", requestId, "openai", error instanceof SyntaxError ? "invalid_json" : "request_failed");
  }
}
