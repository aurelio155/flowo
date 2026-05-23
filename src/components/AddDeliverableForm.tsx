"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function AddDeliverableForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!title.trim()) return;
    setLoading(true);
    await fetch(`/api/projects/${projectId}/deliverables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-2">
        <Plus className="w-4 h-4" /> Ajouter un livrable
      </button>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Titre du livrable"
        autoFocus
        className="flex-1 px-3 py-2 rounded-xl text-white text-sm placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
      <button onClick={handleAdd} disabled={loading}
        className="px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
        {loading ? "..." : "Ajouter"}
      </button>
      <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-gray-400 hover:text-white text-sm"
        style={{ background: "rgba(255,255,255,0.05)" }}>
        Annuler
      </button>
    </div>
  );
}
