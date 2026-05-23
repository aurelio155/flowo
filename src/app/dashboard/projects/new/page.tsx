"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, ArrowRight } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([""]);

  function addDeliverable() {
    setDeliverables([...deliverables, ""]);
  }

  function updateDeliverable(index: number, value: string) {
    const updated = [...deliverables];
    updated[index] = value;
    setDeliverables(updated);
  }

  function removeDeliverable(index: number) {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const filtered = deliverables.filter((d) => d.trim());

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        description: fd.get("description"),
        clientName: fd.get("clientName"),
        clientEmail: fd.get("clientEmail"),
        deliverables: filtered,
      }),
    });

    if (res.ok) {
      const project = await res.json();
      router.push(`/dashboard/projects/${project.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Erreur lors de la création");
      setLoading(false);
    }
  }

  return (
    <div className="text-white max-w-2xl">
      <Link href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      <h1 className="text-3xl font-black mb-2">Nouveau projet</h1>
      <p className="text-gray-400 mb-8">Un lien magique sera généré pour votre client</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl space-y-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Informations du projet</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom du projet *</label>
            <input name="name" required placeholder="ex: Refonte site web Acme"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description (optionnel)</label>
            <textarea name="description" rows={3} placeholder="Décrivez brièvement le projet..."
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
        </div>

        <div className="p-6 rounded-2xl space-y-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Informations client</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom du client *</label>
            <input name="clientName" required placeholder="ex: Sophie Martin"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email du client *</label>
            <input name="clientEmail" type="email" required placeholder="client@exemple.com"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
        </div>

        <div className="p-6 rounded-2xl space-y-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Livrables à valider</h2>
          <p className="text-gray-500 text-sm">Listez ce que le client devra approuver</p>

          {deliverables.map((d, i) => (
            <div key={i} className="flex gap-2">
              <input value={d} onChange={(e) => updateDeliverable(i, e.target.value)}
                placeholder={`Livrable ${i + 1} — ex: Maquette page d'accueil`}
                className="flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
              {deliverables.length > 1 && (
                <button type="button" onClick={() => removeDeliverable(i)}
                  className="p-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addDeliverable}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter un livrable
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          {loading ? "Création en cours..." : <>Créer le projet et générer le lien <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
}
