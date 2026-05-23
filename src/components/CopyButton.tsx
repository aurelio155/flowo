"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button onClick={copy}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
      style={{ background: "rgba(99,102,241,0.2)", color: copied ? "#10b981" : "#a5b4fc" }}>
      {copied ? <><Check className="w-4 h-4" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier le lien</>}
    </button>
  );
}
