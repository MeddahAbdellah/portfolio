import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ArrowUp, Check, Code2, Github, Linkedin, LockKeyhole, RotateCcw, Sparkles } from "lucide-react";
import styles from "./interview-chat.module.css";

type Message = { role: "user" | "assistant"; content: string };

const welcome: Message = {
  role: "assistant",
  content:
    "Hi, I’m Meddah’s AI portfolio. Ask me what his public repositories and latest commits demonstrate about his projects, technical choices, and engineering skills.",
};

const prompts = [
  "What do his latest commits focus on?",
  "Which repositories should I explore first?",
  "What technical skills do his repos demonstrate?",
  "What would you ask him in a code interview?",
];

function MessageText({ children }: { children: string }) {
  const parts = children.split(/(`[^`]+`)/g);
  return <>{parts.map((part, i) => part.startsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : <span key={i}>{part}</span>)}</>;
}

export function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  async function send(question = input) {
    const content = question.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The interview assistant is unavailable.");
      setMessages((current) => [...current, { role: "assistant", content: data.message }]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
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
        <a className={styles.brand} href="/" aria-label="Ask Meddah home">
          <span className={styles.mark}><span>M</span></span>
          <span>Ask Meddah</span>
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
          <div className={styles.portraitWrap}>
            <img src="/user-avatar.webp" alt="Meddah Abdallah" />
            <span className={styles.online} />
          </div>
          <p className={styles.eyebrow}>YOUR CANDIDATE</p>
          <h1>Meddah<br />Abdallah</h1>
          <p className={styles.role}>Full-stack engineer building thoughtful products and reliable systems.</p>
          <div className={styles.meta}>
            <span>Paris, France</span><span>Full-stack</span><span>Open to work</span>
          </div>
          <div className={styles.rule} />
          <p className={styles.about}>This AI reads Meddah’s public repositories, READMEs, technology manifests, and latest commits. It cites observable work without claiming access to private conversations.</p>
          <a className={styles.cv} href="/cv_meddah_abdallah.pdf" target="_blank"><span>View résumé</span><ArrowUp size={16} /></a>
        </aside>

        <section className={styles.chat} aria-label="Interview chat">
          <div className={styles.chatTop}>
            <div><Sparkles size={16} /><div><strong>Interview Meddah’s AI</strong><span>Live from public GitHub activity</span></div></div>
            <button onClick={() => { setMessages([welcome]); setError(""); }} aria-label="Start a new conversation"><RotateCcw size={15} /> <span>New chat</span></button>
          </div>

          <div className={styles.messages} aria-live="polite">
            {messages.map((message, index) => (
              <article key={index} className={`${styles.message} ${styles[message.role]}`}>
                {message.role === "assistant" && <div className={styles.botAvatar}><Code2 size={16} /></div>}
                <div>
                  <span className={styles.speaker}>{message.role === "assistant" ? "MEDDAH AI" : "YOU"}</span>
                  <p><MessageText>{message.content}</MessageText></p>
                  {message.role === "assistant" && index > 0 && <span className={styles.verified}><Check size={11} /> Based on public GitHub evidence</span>}
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
            {error && <p className={styles.error}>{error} <button onClick={() => void send(messages.at(-1)?.content)}>Try again</button></p>}
            <div ref={endRef} />
          </div>

          <form className={styles.composer} onSubmit={(e: FormEvent) => { e.preventDefault(); void send(); }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Ask what Meddah’s repositories reveal about his work…" rows={1} maxLength={1200} aria-label="Your interview question" />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Send question"><ArrowUp size={19} /></button>
            <div><span><LockKeyhole size={11} /> Privacy-first: personal details are never shared</span><span>Enter to send · Shift + Enter for a new line</span></div>
          </form>
        </section>
      </section>
      <footer>AI responses can be imperfect. Confirm important details with Meddah during your interview.</footer>
    </main>
  );
}
