"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export default function ReplyMessageForm({ projectId }: { projectId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await fetch(`/api/projects/${projectId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setContent("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Répondre au client..."
        className="flex-1 px-4 py-2 rounded-xl text-sm text-white outline-none"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
        style={{ background: "rgba(99,102,241,0.5)" }}
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
