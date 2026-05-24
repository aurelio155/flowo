"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Smile } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  reactions: string;
  createdAt: string;
}

interface Props {
  initialMessages: Message[];
  currentSender: "client" | "freelance";
  projectId: string;
  portalToken?: string;
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatBox({ initialMessages, currentSender, projectId, portalToken }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [lastOtherMsgTime, setLastOtherMsgTime] = useState(0);
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const otherSender = currentSender === "client" ? "freelance" : "client";

  function isNearBottom() {
    const el = scrollContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }

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
    if (isNearBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, otherTyping]);

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
      reactions: "{}",
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

  async function handleReact(msgId: string, emoji: string) {
    if (msgId.startsWith("opt-")) return;
    const url = portalToken
      ? `/api/portal/${portalToken}/messages/${msgId}/react`
      : `/api/projects/${projectId}/messages/${msgId}/react`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    if (res.ok) {
      const updated: Message = await res.json();
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reactions: updated.reactions } : m));
    }
    setPickerOpen(null);
  }

  const lastMyMsg = [...messages].reverse().find(m => m.sender === currentSender);
  const seenByOther = lastMyMsg
    ? messages.some(m => m.sender === otherSender && new Date(m.createdAt) > new Date(lastMyMsg.createdAt))
    : false;

  return (
    <div className="flex flex-col">
      {/* Backdrop pour fermer le picker en cliquant ailleurs */}
      {pickerOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(null)} />
      )}
      <div ref={scrollContainerRef} className="p-4 space-y-2 max-h-72 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">Aucun message pour l&apos;instant</p>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.sender === currentSender;
          const isLast = i === messages.length - 1 && isMine;
          const reactions: Record<string, string[]> = JSON.parse(msg.reactions || "{}");
          const hasReactions = Object.keys(reactions).length > 0;
          const isOptimistic = msg.id.startsWith("opt-");

          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              <div className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {/* Emoji trigger button */}
                {!isOptimistic && (
                  <button
                    onClick={() => setPickerOpen(pickerOpen === msg.id ? null : msg.id)}
                    className="mb-1 w-7 h-7 flex items-center justify-center rounded-full opacity-40 hover:opacity-80 active:opacity-100 transition-opacity flex-shrink-0 z-20"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    title="Réagir"
                  >
                    <Smile className="w-4 h-4 text-gray-300" />
                  </button>
                )}

                <div className="relative">
                  {/* Emoji picker popup */}
                  {pickerOpen === msg.id && (
                    <div
                      className={`absolute z-30 flex gap-1 p-1.5 rounded-2xl shadow-xl bottom-full mb-2 ${isMine ? "right-0" : "left-0"}`}
                      style={{ background: "rgba(20,20,30,0.98)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      {EMOJIS.map(e => (
                        <button
                          key={e}
                          onClick={() => handleReact(msg.id, e)}
                          className="text-lg hover:scale-125 active:scale-110 transition-transform px-0.5"
                        >{e}</button>
                      ))}
                    </div>
                  )}

                  <div className="max-w-xs px-4 py-2 rounded-2xl text-sm" style={{
                    background: isMine ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.09)",
                    borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                    opacity: isOptimistic ? 0.7 : 1,
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>

              {/* Reactions */}
              {hasReactions && (
                <div className={`flex gap-1 mt-1 px-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                  {Object.entries(reactions).map(([emoji, users]) => (
                    <button
                      key={emoji}
                      onClick={() => handleReact(msg.id, emoji)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      {emoji} <span className="text-gray-300">{users.length}</span>
                    </button>
                  ))}
                </div>
              )}

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
              <span className="flex gap-1 items-center">
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
