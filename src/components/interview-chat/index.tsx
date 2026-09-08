import { Component, useEffect, useRef, useState } from "react";
import type { ErrorInfo, FormEvent, KeyboardEvent, ReactNode } from "react";
import { ArrowUp, Code2, Github, Linkedin, LockKeyhole, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./interview-chat.module.css";

type Message = { role: "user" | "assistant"; content: string };

const LOG_PREFIX = "[AskAbdallah]";
const printable = (details?: Record<string, unknown>) => details ? JSON.stringify(details) : "";
const log = (event: string, details?: Record<string, unknown>) => console.info(`${LOG_PREFIX} ${event} ${printable(details)}`);
const logError = (event: string, details: Record<string, unknown>) => console.error(`${LOG_PREFIX} ${event} ${printable(details)}`);

class ChatErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) { return { error }; }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    logError("React render failure", { name: error.name, message: error.message, stack: error.stack, componentStack: info.componentStack });
  }

  override render() {
    if (this.state.error) {
      return (
        <main className={styles.shell}>
          <section className={styles.fatal} role="alert">
            <div className={styles.botAvatar}><Code2 size={18} /></div>
            <p className={styles.eyebrow}>INTERVIEW CHAT ERROR</p>
            <h1>The chat hit an unexpected browser error.</h1>
            <p>The details were written to the developer console with the <code>{LOG_PREFIX}</code> prefix.</p>
            <button onClick={() => window.location.reload()}>Reload the chat</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

const welcome: Message = {
  role: "assistant",
  content:
    "Hi, I’m Abdallah’s AI portfolio. Interview him about his experience, technical decisions, leadership, and the systems he has built.",
};

const prompts = [
  "Tell me about an AI system you took to production.",
  "How do you approach frontend architecture at scale?",
  "Describe a difficult technical decision you made.",
  "How do you lead and mentor engineering teams?",
  "Presentation de parcour",
  "Why should we hire you?",
];

const career = [
  { period: "2025 — Present", role: "Senior Fullstack & AI Engineer", company: "Sanofi · Freelance" },
  { period: "2024 — 2025", role: "Senior Fullstack Engineer", company: "Padoa · Freelance" },
  { period: "2024", role: "Senior Fullstack & AI Engineer", company: "Engie Digital · Freelance" },
  { period: "2023 — 2024", role: "Lead Software Engineer", company: "Citron" },
  { period: "2020 — 2023", role: "Fullstack Engineer", company: "Padoa" },
  { period: "2018 — 2020", role: "Embedded IoT Devices Engineer", company: "Ursum" },
];

function MessageText({ children }: { children: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}

function InterviewChatContent() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedQuestion, setFailedQuestion] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question = input) {
    const content = question.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setError("");
    setFailedQuestion("");
    setLoading(true);
    log("Sending interview question", { messageCount: next.length, questionLength: content.length });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const requestId = response.headers.get("x-request-id");
      const rawBody = await response.text();
      let data: { message?: unknown; error?: unknown; requestId?: unknown; diagnostic?: { stage?: unknown; code?: unknown } } = {};
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        logError("Chat API returned non-JSON", { status: response.status, requestId, bodyLength: rawBody.length });
        if (response.status === 504) throw new Error("The interview assistant timed out. Please try again.");
        if (!response.ok) throw new Error("The interview assistant is temporarily unavailable.");
        throw new Error("The interview assistant returned an invalid response.");
      }
      log("Chat API response", { status: response.status, ok: response.ok, requestId: data.requestId || requestId, stage: data.diagnostic?.stage, code: data.diagnostic?.code, hasMessage: typeof data.message === "string", hasError: Boolean(data.error) });
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "The interview assistant is unavailable.");
      if (typeof data.message !== "string" || !data.message.trim()) throw new Error("The interview assistant returned an empty response.");
      setMessages((current) => [...current, { role: "assistant", content: data.message as string }]);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Something went wrong. Please try again.";
      logError("Interview request failed", { name: cause instanceof Error ? cause.name : "UnknownError", message });
      setMessages(messages);
      setFailedQuestion(content);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="Meddah Abdallah home">
          <span className={styles.mark}><span>MA</span></span>
          <span>Meddah Abdallah</span>
          <span className={styles.beta}>AI PORTFOLIO</span>
        </a>
        <nav className={styles.nav} aria-label="Profile links">
          <span className={styles.available}><i /> Available for opportunities</span>
          <a href="https://github.com/MeddahAbdellah" target="_blank" rel="noreferrer"><Github size={17} /> <span>GitHub</span></a>
          <a href="https://www.linkedin.com/in/meddahabdallah/" target="_blank" rel="noreferrer"><Linkedin size={17} /> <span>LinkedIn</span></a>
        </nav>
      </header>

      <section className={styles.workspace}>
        <aside className={styles.profile}>
          <p className={styles.role}>Senior Fullstack &amp; AI Engineer building production-grade AI, cloud, web, and distributed systems.</p>
          <div className={styles.meta}>
            <span>Paris, France</span><span>8+ years</span><span>Open to work</span>
          </div>
          <div className={styles.rule} />
          <p className={styles.timelineLabel}>EXPERIENCE</p>
          <ol className={styles.timeline}>
            {career.map((entry) => (
              <li key={`${entry.company}-${entry.period}`}>
                <time>{entry.period}</time>
                <strong>{entry.role}</strong>
                <span>{entry.company}</span>
              </li>
            ))}
          </ol>
          <a className={styles.cv} href="/cv_meddah_abdallah.pdf" target="_blank"><span>View résumé</span><ArrowUp size={16} /></a>
        </aside>

        <section className={styles.chat} aria-label="Interview chat">
          <div className={styles.chatTop}>
            <div><Sparkles size={16} /><div><strong>Interview Abdallah’s AI</strong><span>Professional experience and technical work</span></div></div>
            <button onClick={() => { setMessages([welcome]); setError(""); setFailedQuestion(""); }} aria-label="Start a new conversation"><RotateCcw size={15} /> <span>New chat</span></button>
          </div>

          <div className={styles.messages} aria-live="polite">
            {messages.map((message, index) => (
              <article key={index} className={`${styles.message} ${styles[message.role]}`}>
                {message.role === "assistant" && <div className={styles.botAvatar}><Code2 size={16} /></div>}
                <div>
                  <span className={styles.speaker}>{message.role === "assistant" ? "ABDALLAH AI" : "YOU"}</span>
                  <div className={styles.messageText}><MessageText>{message.content}</MessageText></div>
                </div>
              </article>
            ))}
            {messages.length === 1 && (
              <div className={styles.suggestions}>
                <span>TRY ASKING</span>
                <div>{prompts.map((prompt) => <button key={prompt} onClick={() => void send(prompt)}>{prompt}<ArrowUp size={14} /></button>)}</div>
              </div>
            )}
            {loading && <article className={`${styles.message} ${styles.assistant}`}><div className={styles.botAvatar}><Code2 size={16} /></div><div className={styles.typing}><i /><i /><i /></div></article>}
            {error && <p className={styles.error}>{error} <button onClick={() => void send(failedQuestion)}>Try again</button></p>}
            <div ref={endRef} />
          </div>

          <form className={styles.composer} onSubmit={(e: FormEvent) => { e.preventDefault(); void send(); }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Ask Abdallah an interview question…" rows={1} aria-label="Your interview question" />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Send question"><ArrowUp size={19} /></button>
            <div><span><LockKeyhole size={11} /> Privacy-first: personal details are never shared</span><span>Enter to send · Shift + Enter for a new line</span></div>
          </form>
        </section>
      </section>
      <footer>AI-generated portfolio summaries may occasionally be incomplete.</footer>
    </main>
  );
}

export function InterviewChat() {
  return <ChatErrorBoundary><InterviewChatContent /></ChatErrorBoundary>;
}
