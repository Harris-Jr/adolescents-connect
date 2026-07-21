import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, ShieldCheck, Headphones, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { getAccessToken } from "@/contexts/AuthContext";

const POLL_INTERVAL = 4000; // poll every 4 seconds

function SupportChat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const existingSessionId = searchParams.get("session");
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // On mount: resume the session from ?session= (e.g. coming from the
  // "I Need Help" flow) if present, otherwise start a fresh session.
  useEffect(() => {
    if (existingSessionId) {
      resumeSession(existingSessionId);
    } else {
      startSession();
    }
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function resumeSession(sid) {
    setStarting(true);
    try {
      setSessionId(sid);
      await pollMessages(sid);
      pollRef.current = setInterval(() => pollMessages(sid), POLL_INTERVAL);
    } catch {
      setError("Failed to load your chat");
    } finally {
      setStarting(false);
    }
  }

  async function startSession() {
    setStarting(true);
    try {
      const tok = getAccessToken();
      const res = await fetch(`${API_URL}/support/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
        },
        body: JSON.stringify({
          guestName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start chat");
      setSessionId(data.session.id);
      setMessages(data.session.messages ?? []);
      // Start polling for new messages
      pollRef.current = setInterval(() => pollMessages(data.session.id), POLL_INTERVAL);
    } catch (err) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  }

  async function pollMessages(sid) {
    try {
      const tok = getAccessToken();
      const res = await fetch(`${API_URL}/support/chat/${sid}/messages`, {
        headers: tok ? { Authorization: `Bearer ${tok}` } : {},
      });
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {
      // non-fatal — just try again next poll
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || !sessionId || sending) return;
    setSending(true);
    setInput("");
    // Optimistic update
    setMessages((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, from: "user", text, createdAt: new Date().toISOString() },
    ]);
    try {
      const tok = getAccessToken();
      await fetch(`${API_URL}/support/chat/${sessionId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
        },
        body: JSON.stringify({ text }),
      });
      // Immediate poll to get server-assigned id
      await pollMessages(sessionId);
    } catch {
      // keep optimistic message — will reconcile on next poll
    } finally {
      setSending(false);
    }
  }

  if (starting) {
    return (
      <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-[800px] flex-col items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
        <p className="mt-3 text-sm text-muted-foreground">Connecting you to a counsellor…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[800px] px-4 py-16 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={startSession}
          className="mt-4 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-bold text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-[800px] flex-col px-4 py-6 sm:px-6">
      <Link
        to="/support"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Support
      </Link>

      <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-3xl bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-brand-teal px-5 py-4 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Headphones className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold">You are chatting with a counsellor</p>
            <p className="text-xs text-white/90">A counsellor will join shortly</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.from === "user"
                  ? "flex justify-end"
                  : m.from === "system"
                    ? "flex justify-center"
                    : "flex justify-start"
              }
            >
              <div
                className={
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm " +
                  (m.from === "user"
                    ? "bg-brand-navy text-white"
                    : m.from === "system"
                      ? "bg-muted text-muted-foreground text-xs italic"
                      : "bg-surface-mint text-foreground")
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30"
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal text-white transition-transform hover:scale-105 disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" /> This is a safe and confidential space
          </p>
        </div>
      </div>
    </main>
  );
}

export default SupportChat;
