"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function AddInvoiceForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!amount || isNaN(Number(amount))) return;
    setLoading(true);
    await fetch(`/api/projects/${projectId}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), description }),
    });
    setAmount("");
    setDescription("");
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors mt-2">
        <Plus className="w-4 h-4" /> Ajouter une facture
      </button>
    );
  }

  return (
    <div className="space-y-2 mt-2">
      <input value={description} onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (ex: Acompte 50%)"
        className="w-full px-3 py-2 rounded-xl text-white text-sm placeholder-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
      <div className="flex gap-2">
        <input value={amount} onChange={(e) => setAmount(e.target.value)}
          type="number" min="1" placeholder="Montant en €" autoFocus
          className="flex-1 px-3 py-2 rounded-xl text-white text-sm placeholder-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
        <button onClick={handleAdd} disabled={loading}
          className="px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
          {loading ? "..." : "Envoyer"}
        </button>
        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-gray-400 hover:text-white text-sm"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          Annuler
        </button>
      </div>
    </div>
  );
}
