"use client";
import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

export default function SendLinkButton({ projectId, clientEmail }: { projectId: string; clientEmail: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSend() {
    setStatus("loading");
    const res = await fetch(`/api/projects/${projectId}/send-link`, { method: "POST" });
    if (res.ok) {
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 4000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <button onClick={handleSend} disabled={status === "loading" || status === "sent"}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-70"
      style={{
        background: status === "sent" ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.2)",
        color: status === "sent" ? "#10b981" : status === "error" ? "#ef4444" : "#a5b4fc",
        border: `1px solid ${status === "sent" ? "rgba(16,185,129,0.4)" : "rgba(99,102,241,0.4)"}`,
      }}>
      {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === "sent" && <Check className="w-4 h-4" />}
      {status === "idle" && <Send className="w-4 h-4" />}
      {status === "error" && <Send className="w-4 h-4" />}
      {status === "loading" ? "Envoi..." : status === "sent" ? `Envoyé à ${clientEmail}` : status === "error" ? "Erreur — réessaye" : "Envoyer au client"}
    </button>
  );
}
