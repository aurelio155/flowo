"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password") }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Erreur d'inscription");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#050508" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-black text-white">Flowo</span>
          </Link>
          <h1 className="text-3xl font-black text-white">Créez votre compte</h1>
          <p className="text-gray-400 mt-2">Gratuit, sans CB, prêt en 2 minutes</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          {["Sans engagement", "14j d'essai Pro", "Support inclus"].map((item) => (
            <span key={item} className="flex items-center gap-1 text-xs text-gray-400">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              {item}
            </span>
          ))}
        </div>

        <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Votre prénom</label>
              <input name="name" type="text" required placeholder="Marie"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email professionnel</label>
              <input name="email" type="email" required placeholder="vous@exemple.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <input name="password" type="password" required placeholder="Minimum 8 caractères" minLength={8}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              {loading ? "Création..." : <>Créer mon compte gratuit <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-xs text-gray-600 text-center">
              En créant un compte, vous acceptez nos{" "}
              <a href="#" className="text-gray-500 underline">CGU</a> et notre{" "}
              <a href="#" className="text-gray-500 underline">politique de confidentialité</a>.
            </p>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
