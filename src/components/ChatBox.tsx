"use client";
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
}

interface Props {
  initialMessages: Message[];
  currentSender: "client" | "freelance";
  projectId: string;
  portalToken?: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatBox({ initialMessages, currentSender, projectId, portalToken }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [lastOtherMsgTime, setLastOtherMsgTime] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const otherSender = currentSender === "client" ? "freelance" : "client";

  const fetchMessages = async () => {
    const url = portalToken
      ? `/api/portal/${portalToken}/messages`
      : `/api/projects/${projectId}/messages`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data: Message[] = await res.json();
    setMessages(prev => {
      const newOther = data.filter(m => m.sender === otherSender);
      const prevOther = prev.filter(m => m.sender === otherSender);
      if (newOther.length > prevOther.length) {
        const latest = new Date(newOther[newOther.length - 1].createdAt).getTime();
        setLastOtherMsgTime(latest);
        setOtherTyping(false);
      }
      return data;
    });
  };

  useEffect(() => {
    const id = setInterval(fetchMessages, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherTyping]);

  // Show typing indicator 8s after last message from other
  useEffect(() => {
    if (lastOtherMsgTime === 0) return;
    const diff = Date.now() - lastOtherMsgTime;
    if (diff < 8000) {
      setOtherTyping(true);
      const t = setTimeout(() => setOtherTyping(false), 8000 - diff);
      return () => clearTimeout(t);
    }
  }, [lastOtherMsgTime]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      content,
      sender: currentSender,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setContent("");

    if (portalToken) {
      await fetch(`/api/portal/${portalToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "message", data: { content: optimistic.content } }),
      });
    } else {
      await fetch(`/api/projects/${projectId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: optimistic.content }),
      });
    }
    setSending(false);
    await fetchMessages();
  }

  const lastClientMsg = [...messages].reverse().find(m => m.sender === currentSender);
  const seenByOther = lastClientMsg
    ? messages.some(m => m.sender === otherSender && new Date(m.createdAt) > new Date(lastClientMsg.createdAt))
    : false;

  return (
    <div className="flex flex-col">
      <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">Aucun message pour l&apos;instant</p>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.sender === currentSender;
          const isLast = i === messages.length - 1 && isMine;
          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              <div className="max-w-xs px-4 py-2 rounded-2xl text-sm" style={{
                background: isMine ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.09)",
                borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
              }}>
                {msg.content}
              </div>
              <div className="flex items-center gap-1 mt-0.5 px-1">
                <span className="text-xs text-gray-500">{formatTime(msg.createdAt)}</span>
                {isLast && seenByOther && (
                  <span className="text-xs text-indigo-400">· Vu ✓✓</span>
                )}
              </div>
            </div>
          );
        })}
        {otherTyping && (
          <div className="flex items-start">
            <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.09)", borderRadius: "4px 18px 18px 18px" }}>
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 px-4 pb-4 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 px-4 py-2 rounded-xl text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="px-3 py-2 rounded-xl text-white disabled:opacity-40"
          style={{ background: "rgba(99,102,241,0.6)" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
