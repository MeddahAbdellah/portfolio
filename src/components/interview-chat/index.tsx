import { Component, useEffect, useRef, useState } from "react";
import type { ErrorInfo, FormEvent, KeyboardEvent, ReactNode } from "react";
import { ArrowUp, Code2, Github, Linkedin, LockKeyhole, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./interview-chat.module.css";

type Message = { role: "user" | "assistant"; content: string };
type Language = "en" | "fr";

const LOG_PREFIX = "[AskAbdallah]";
const printable = (details?: Record<string, unknown>) => details ? JSON.stringify(details) : "";
const log = (event: string, details?: Record<string, unknown>) => console.info(`${LOG_PREFIX} ${event} ${printable(details)}`);
const logError = (event: string, details: Record<string, unknown>) => console.error(`${LOG_PREFIX} ${event} ${printable(details)}`);

const copy = {
  en: {
    welcome: "Hi, I’m Abdallah’s AI portfolio. Interview him about his experience, technical decisions, leadership, and the systems he has built.",
    prompts: ["Tell me about an AI system you took to production.", "How do you approach frontend architecture at scale?", "Describe a difficult technical decision you made.", "How do you lead and mentor engineering teams?", "Present your career path.", "Why should we hire you?"],
    available: "Available for opportunities", role: "Senior Fullstack & AI Engineer building production-grade AI, cloud, web, and distributed systems.",
    years: "8+ years", open: "Open to work", experience: "EXPERIENCE", resume: "View résumé", interview: "Interview Abdallah’s AI",
    subtitle: "Professional experience and technical work", newChat: "New chat", chatLabel: "Interview chat", suggestions: "TRY ASKING",
    you: "YOU", placeholder: "Ask Abdallah an interview question…", inputLabel: "Your interview question", send: "Send question",
    privacy: "Privacy-first: personal details are never shared", keyboard: "Enter to send · Shift + Enter for a new line",
    footer: "AI-generated portfolio summaries may occasionally be incomplete.", retry: "Try again", language: "Choose language",
    errors: { timeout: "The interview assistant timed out. Please try again.", unavailable: "The interview assistant is temporarily unavailable.", invalid: "The interview assistant returned an invalid response.", empty: "The interview assistant returned an empty response.", generic: "Something went wrong. Please try again." },
  },
  fr: {
    welcome: "Bonjour, je suis le portfolio IA d’Abdallah. Interrogez-moi sur son expérience, ses décisions techniques, son leadership et les systèmes qu’il a conçus.",
    prompts: ["Parlez-moi d’un système d’IA mis en production.", "Comment abordez-vous l’architecture frontend à grande échelle ?", "Décrivez une décision technique difficile.", "Comment dirigez-vous et accompagnez-vous les équipes ?", "Présentez votre parcours professionnel.", "Pourquoi devrions-nous vous recruter ?"],
    available: "Disponible pour de nouvelles opportunités", role: "Ingénieur Fullstack & IA senior, spécialisé dans les systèmes IA, cloud, web et distribués en production.",
    years: "8+ ans", open: "Disponible", experience: "EXPÉRIENCE", resume: "Voir le CV", interview: "Interrogez l’IA d’Abdallah",
    subtitle: "Expérience professionnelle et réalisations techniques", newChat: "Nouvelle discussion", chatLabel: "Discussion d’entretien", suggestions: "SUGGESTIONS",
    you: "VOUS", placeholder: "Posez une question d’entretien sur Abdallah…", inputLabel: "Votre question d’entretien", send: "Envoyer la question",
    privacy: "Confidentialité : les données personnelles ne sont jamais partagées", keyboard: "Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne",
    footer: "Les résumés générés par l’IA peuvent parfois être incomplets.", retry: "Réessayer", language: "Choisir la langue",
    errors: { timeout: "L’assistant a mis trop de temps à répondre. Veuillez réessayer.", unavailable: "L’assistant est temporairement indisponible.", invalid: "L’assistant a renvoyé une réponse invalide.", empty: "L’assistant a renvoyé une réponse vide.", generic: "Une erreur est survenue. Veuillez réessayer." },
  },
} as const;

class ChatErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  override componentDidCatch(error: Error, info: ErrorInfo) { logError("React render failure", { name: error.name, message: error.message, stack: error.stack, componentStack: info.componentStack }); }
  override render() { return this.state.error ? <main className={styles.shell}><section className={styles.fatal} role="alert"><div className={styles.botAvatar}><Code2 size={18} /></div><p className={styles.eyebrow}>INTERVIEW CHAT ERROR</p><h1>The chat hit an unexpected browser error.</h1><p>The details were written to the developer console with the <code>{LOG_PREFIX}</code> prefix.</p><button onClick={() => window.location.reload()}>Reload the chat</button></section></main> : this.props.children; }
}

const career = [
  { period: "2025 — Present", periodFr: "2025 — Aujourd’hui", role: "Senior Fullstack & AI Engineer", roleFr: "Ingénieur Fullstack & IA senior", company: "Sanofi · Freelance", logo: "/company-logos/sanofi.svg" },
  { period: "2024 — 2025", role: "Senior Fullstack Engineer", roleFr: "Ingénieur Fullstack senior", company: "Padoa · Freelance", logo: "/company-logos/padoa.svg" },
  { period: "2024", role: "Senior Fullstack & AI Engineer", roleFr: "Ingénieur Fullstack & IA senior", company: "Engie Digital · Freelance", logo: "/company-logos/engie.svg" },
  { period: "2023 — 2024", role: "Lead Software Engineer", roleFr: "Lead Software Engineer", company: "Citron", logo: "/company-logos/citron.svg" },
  { period: "2020 — 2023", role: "Fullstack Engineer", roleFr: "Ingénieur Fullstack", company: "Padoa", logo: "/company-logos/padoa.svg" },
  { period: "2018 — 2020", role: "Embedded IoT Devices Engineer", roleFr: "Ingénieur systèmes embarqués IoT", company: "Ursum", logo: "/company-logos/ursum.svg" },
];

function MessageText({ children }: { children: string }) { return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>; }

function InterviewChatContent() {
  const [language, setLanguageState] = useState<Language>("en");
  const t = copy[language];
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: copy.en.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedQuestion, setFailedQuestion] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const saved = localStorage.getItem("portfolio-language"); if (saved === "fr") changeLanguage("fr"); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  function changeLanguage(next: Language) {
    setLanguageState(next); setMessages([{ role: "assistant", content: copy[next].welcome }]); setInput(""); setError(""); setFailedQuestion("");
    document.documentElement.lang = next; localStorage.setItem("portfolio-language", next);
  }

  async function send(question = input) {
    const content = question.trim(); if (!content || loading) return;
    const startedAt = performance.now();
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next); setInput(""); setError(""); setFailedQuestion(""); setLoading(true);
    log("Sending interview question", { messageCount: next.length, questionLength: content.length, language });
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, language }) });
      const requestId = response.headers.get("x-request-id");
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const serverError = typeof data.error === "string" ? data.error : "";
        throw new Error(response.status === 504 ? t.errors.timeout : language === "fr" ? t.errors.unavailable : serverError || t.errors.unavailable);
      }
      if (!response.body) throw new Error(t.errors.invalid);
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let answer = ""; let chunkCount = 0; let receivedDone = false; let firstDeltaAt: number | undefined;
      while (true) {
        const { done, value } = await reader.read();
        if (value) chunkCount += 1;
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n"); buffer = done ? "" : lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as { type: "delta" | "error" | "done"; delta?: string; error?: string };
          if (event.type === "error") throw new Error(language === "fr" ? (event.error?.includes("timed out") ? t.errors.timeout : t.errors.unavailable) : event.error || t.errors.unavailable);
          if (event.type === "done") receivedDone = true;
          if (event.type === "delta" && event.delta) { firstDeltaAt ??= performance.now(); answer += event.delta; setMessages([...next, { role: "assistant", content: answer }]); }
        }
        if (done) break;
      }
      if (!answer.trim()) throw new Error(t.errors.empty);
      if (!receivedDone) throw new Error(t.errors.invalid);
      log("Chat stream completed", { requestId, outputLength: answer.length, chunkCount, timeToFirstDeltaMs: firstDeltaAt ? Math.round(firstDeltaAt - startedAt) : undefined, durationMs: Math.round(performance.now() - startedAt) });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : t.errors.generic;
      logError("Interview request failed", { name: cause instanceof Error ? cause.name : "UnknownError", message, durationMs: Math.round(performance.now() - startedAt) });
      setMessages(next); setFailedQuestion(content); setError(message);
    } finally { setLoading(false); }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }

  return <main className={styles.shell}>
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="Meddah Abdallah home"><span className={styles.mark}><span>MA</span></span><span>Meddah Abdallah</span><span className={styles.beta}>AI PORTFOLIO</span></a>
      <nav className={styles.nav} aria-label="Profile links">
        <div className={styles.language} role="group" aria-label={t.language}>
          <button className={language === "en" ? styles.activeLanguage : ""} onClick={() => changeLanguage("en")} aria-label="English" aria-pressed={language === "en"}>🇬🇧</button>
          <button className={language === "fr" ? styles.activeLanguage : ""} onClick={() => changeLanguage("fr")} aria-label="Français" aria-pressed={language === "fr"}>🇫🇷</button>
        </div>
        <span className={styles.available}><i /> {t.available}</span><a href="https://github.com/MeddahAbdellah" target="_blank" rel="noreferrer"><Github size={17} /> <span>GitHub</span></a><a href="https://www.linkedin.com/in/meddahabdallah/" target="_blank" rel="noreferrer"><Linkedin size={17} /> <span>LinkedIn</span></a>
      </nav>
    </header>
    <section className={styles.workspace}>
      <aside className={styles.profile}><p className={styles.role}>{t.role}</p><div className={styles.meta}><span>Paris, France</span><span>{t.years}</span><span>{t.open}</span></div><div className={styles.rule} /><p className={styles.timelineLabel}>{t.experience}</p><ol className={styles.timeline}>{career.map((entry) => <li key={`${entry.company}-${entry.period}`}><img src={entry.logo} alt={`${entry.company} logo`} loading="lazy" /><div><time>{language === "fr" && entry.periodFr ? entry.periodFr : entry.period}</time><strong>{language === "fr" ? entry.roleFr : entry.role}</strong><span>{entry.company}</span></div></li>)}</ol><a className={styles.cv} href="/cv_meddah_abdallah.pdf" target="_blank"><span>{t.resume}</span><ArrowUp size={16} /></a></aside>
      <section className={styles.chat} aria-label={t.chatLabel}>
        <div className={styles.chatTop}><div><Sparkles size={16} /><div><strong>{t.interview}</strong><span>{t.subtitle}</span></div></div><button onClick={() => { setMessages([{ role: "assistant", content: t.welcome }]); setError(""); setFailedQuestion(""); }} aria-label={t.newChat}><RotateCcw size={15} /> <span>{t.newChat}</span></button></div>
        <div className={styles.messages} aria-live="polite">
          {messages.map((message, index) => <article key={index} className={`${styles.message} ${styles[message.role]}`}>{message.role === "assistant" && <div className={styles.botAvatar}><Code2 size={16} /></div>}<div><span className={styles.speaker}>{message.role === "assistant" ? "ABDALLAH AI" : t.you}</span><div className={styles.messageText}><MessageText>{message.content}</MessageText></div></div></article>)}
          {messages.length === 1 && <div className={styles.suggestions}><span>{t.suggestions}</span><div>{t.prompts.map((prompt) => <button key={prompt} onClick={() => void send(prompt)}>{prompt}<ArrowUp size={14} /></button>)}</div></div>}
          {loading && messages.at(-1)?.role === "user" && <article className={`${styles.message} ${styles.assistant}`}><div className={styles.botAvatar}><Code2 size={16} /></div><div className={styles.typing}><i /><i /><i /></div></article>}
          {error && <p className={styles.error}>{error} <button onClick={() => void send(failedQuestion)}>{t.retry}</button></p>}<div ref={endRef} />
        </div>
        <form className={styles.composer} onSubmit={(e: FormEvent) => { e.preventDefault(); void send(); }}><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder={t.placeholder} rows={1} aria-label={t.inputLabel} /><button type="submit" disabled={!input.trim() || loading} aria-label={t.send}><ArrowUp size={19} /></button><div><span><LockKeyhole size={11} /> {t.privacy}</span><span>{t.keyboard}</span></div></form>
      </section>
    </section><footer>{t.footer}</footer>
  </main>;
}

export function InterviewChat() { return <ChatErrorBoundary><InterviewChatContent /></ChatErrorBoundary>; }
