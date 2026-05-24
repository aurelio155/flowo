"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronDown } from "lucide-react";

const STATUSES = [
  { value: "active", label: "Actif", color: "#6366f1" },
  { value: "paused", label: "En pause", color: "#f59e0b" },
  { value: "completed", label: "Terminé", color: "#10b981" },
];

export function ProjectStatusSelect({ projectId, currentStatus }: { projectId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(val: string) {
    setStatus(val);
    setSaving(true);
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: val }),
    });
    setSaving(false);
    router.refresh();
  }

  const current = STATUSES.find(s => s.value === status) || STATUSES[0];

  return (
    <div className="relative">
      <select
        value={status}
        onChange={e => handleChange(e.target.value)}
        disabled={saving}
        className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-sm font-medium cursor-pointer outline-none disabled:opacity-50"
        style={{ background: `${current.color}20`, color: current.color, border: `1px solid ${current.color}40` }}
      >
        {STATUSES.map(s => (
          <option key={s.value} value={s.value} style={{ background: "#1a1a2e", color: "white" }}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
        style={{ color: current.color }} />
    </div>
  );
}

export function ProjectNotes({ projectId, initialNotes }: { projectId: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-2">
      <textarea
        value={notes}
        onChange={e => { setNotes(e.target.value); setSaved(false); }}
        placeholder="Notes internes, brief, contrat, mots de passe... (jamais visibles par le client)"
        rows={4}
        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-all"
        style={{ background: saved ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.4)", border: `1px solid ${saved ? "rgba(16,185,129,0.4)" : "rgba(99,102,241,0.3)"}` }}
      >
        <Save className="w-3.5 h-3.5" />
        {saving ? "Sauvegarde..." : saved ? "Sauvegardé ✓" : "Sauvegarder"}
      </button>
    </div>
  );
}
