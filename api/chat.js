import { INTERVIEWER_SYSTEM_PROMPT } from "../src/lib/interviewer-system-prompt.js";
import { getGitHubContext } from "./github-context.js";

const requests = new Map();
// Plain Vercel `/api` functions read duration from the exported config object.
// A named `maxDuration` export is for framework routes and was ignored here,
// leaving this function on the platform's 10-second default.
export const config = { maxDuration: 300 };
export const AGENT_RESPONSE_TIMEOUT_MS = 240_000;
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
export function validateMessages(value) {
  if (!Array.isArray(value) || !value.length) return null;
  const messages = value.map((message) => ({
    role: message?.role,
    content: typeof message?.content === "string" ? message.content.trim() : "",
  }));
  if (messages.some(({ role, content }) => !["user", "assistant"].includes(role) || !content)) return null;
  return messages[messages.length - 1].role === "user" ? messages : null;
}
export default async function handler(request, response) {
  const requestId = request.headers["x-vercel-id"] || crypto.randomUUID();
  const startedAt = Date.now();
  const model = configuredModel();
  response.setHeader("X-Request-Id", requestId);
  response.setHeader("Cache-Control", "no-store");
  console.info("[AskAbdallah API] request started", { requestId, method: request.method, model, responseTimeoutMs: AGENT_RESPONSE_TIMEOUT_MS });
  if (request.method !== "POST") return fail(response, 405, "Method not allowed.", requestId, "request", "method_not_allowed");
  if (rateLimited(request.headers["x-forwarded-for"]?.split(",")[0] || "unknown")) return fail(response, 429, "Too many questions. Please wait a minute.", requestId, "request", "rate_limited");
  const messages = validateMessages(request.body?.messages);
  const language = request.body?.language === "fr" ? "fr" : "en";
  if (!messages) return fail(response, 400, "Please send a valid interview question.", requestId, "request", "invalid_messages");
  if (!process.env.OPENAI_API_KEY) return fail(response, 503, "The interview assistant has not been configured yet.", requestId, "configuration", "missing_openai_key");

  let githubContext;
  try {
    githubContext = await getGitHubContext();
    console.info("[AskAbdallah API] GitHub context loaded", { requestId, repositoryCount: githubContext.repositories.length, fetchedAt: githubContext.fetchedAt });
  } catch (error) {
    console.error("[AskAbdallah API] GitHub context failed", { requestId, message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    return fail(response, 502, "GitHub activity is temporarily unavailable. Please try again shortly.", requestId, "github", "context_unavailable");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error("OpenAI response timeout")), AGENT_RESPONSE_TIMEOUT_MS);
  response.on("close", () => { if (!response.writableEnded) controller.abort(); });
  let outputLength = 0;
  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        instructions: `${INTERVIEWER_SYSTEM_PROMPT}\n\nRESPONSE LANGUAGE\nAnswer exclusively in ${language === "fr" ? "French" : "English"}, matching the language selected by the visitor.\n\nLIVE GITHUB EVIDENCE:\n${JSON.stringify(githubContext)}`,
        input: messages,
        stream: true,
      }),
    });
    if (!apiResponse.ok) {
      const data = await apiResponse.json().catch(() => ({}));
      console.error("[AskAbdallah API] OpenAI response failed", { requestId, status: apiResponse.status, code: data.error?.code || data.error?.type || "unknown", message: data.error?.message });
      return fail(response, 502, openAIError(apiResponse.status), requestId, "openai", `upstream_${apiResponse.status}`);
    }
    if (!apiResponse.body) throw new Error("The model returned no response stream");

    response.status(200);
    response.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    response.setHeader("X-Accel-Buffering", "no");
    response.flushHeaders?.();

    const reader = apiResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let firstDeltaAt;
    let completion;
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split(/\r?\n/);
      buffer = done ? "" : lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
        const event = JSON.parse(line.slice(6));
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
          firstDeltaAt ||= Date.now();
          outputLength += event.delta.length;
          response.write(`${JSON.stringify({ type: "delta", delta: event.delta })}\n`);
        } else if (event.type === "response.completed" || event.type === "response.incomplete") {
          completion = event.response;
        } else if (event.type === "error" || event.type === "response.failed") {
          throw new Error(event.error?.message || event.response?.error?.message || "The model response failed");
        }
      }
      if (done) break;
    }
    if (!outputLength) throw new Error("The model returned no answer");
    if (!completion) {
      console.warn("[AskAbdallah API] OpenAI stream ended without a completion event", {
        requestId,
        model,
        outputLength,
        durationMs: Date.now() - startedAt,
      });
    }
    const incompleteReason = completion?.incomplete_details?.reason;
    if (completion?.status === "incomplete" || incompleteReason) {
      const error = new Error(`The model response was incomplete${incompleteReason ? `: ${incompleteReason}` : ""}`);
      error.code = "incomplete_response";
      throw error;
    }
    response.write(`${JSON.stringify({ type: "done", requestId })}\n`);
    response.end();
    console.info("[AskAbdallah API] request completed", {
      requestId,
      outputLength,
      language,
      model,
      status: completion?.status || "stream_closed_after_output",
      completionEventReceived: Boolean(completion),
      inputTokens: completion?.usage?.input_tokens,
      outputTokens: completion?.usage?.output_tokens,
      timeToFirstDeltaMs: firstDeltaAt ? firstDeltaAt - startedAt : undefined,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[AskAbdallah API] OpenAI request failed", { requestId, model, outputLength, durationMs: Date.now() - startedAt, code: error?.code, message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    const timedOut = controller.signal.aborted && error?.name !== "AbortError" || error?.name === "TimeoutError";
    const message = timedOut ? "The interview assistant timed out. Please try again." : "The interview assistant is temporarily unavailable.";
    if (!response.headersSent) return fail(response, timedOut ? 504 : 502, message, requestId, "openai", timedOut ? "response_timeout" : error instanceof SyntaxError ? "invalid_json" : "request_failed");
    if (!response.writableEnded) response.end(`${JSON.stringify({ type: "error", error: message, requestId })}\n`);
  } finally {
    clearTimeout(timeout);
  }
}
