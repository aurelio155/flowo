"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Send } from "lucide-react";

interface Props {
  token: string;
  action: "deliverable" | "message";
  deliverableId?: string;
}

export default function ClientPortalActions({ token, action, deliverableId }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDeliverable(type: "approve" | "reject") {
    setLoading(type);
    await fetch(`/api/portal/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: type === "approve" ? "approve_deliverable" : "reject_deliverable",
        data: { deliverableId },
      }),
    });
    setLoading(null);
    router.refresh();
  }

  async function handleMessage() {
    if (!message.trim()) return;
    setLoading("message");
    await fetch(`/api/portal/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "message", data: { content: message } }),
    });
    setMessage("");
    setLoading(null);
    router.refresh();
  }

  if (action === "deliverable") {
    return (
      <div className="flex gap-2">
        <button onClick={() => handleDeliverable("approve")} disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-green-400 transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <CheckCircle className="w-4 h-4" />
          {loading === "approve" ? "..." : "Valider"}
        </button>
        <button onClick={() => handleDeliverable("reject")} disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-red-400 transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <XCircle className="w-4 h-4" />
          {loading === "reject" ? "..." : "Refuser"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input value={message} onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleMessage()}
        placeholder="Écrivez votre message..."
        className="flex-1 px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
      <button onClick={handleMessage} disabled={!message.trim() || loading === "message"}
        className="px-4 py-3 rounded-xl text-white disabled:opacity-50 transition-all"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
