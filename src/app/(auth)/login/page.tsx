"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Erreur de connexion");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#050508" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-black text-white">Flowo</span>
          </Link>
          <h1 className="text-3xl font-black text-white">Bon retour !</h1>
          <p className="text-gray-400 mt-2">Connectez-vous à votre espace</p>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input name="email" type="email" required placeholder="vous@exemple.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <input name="password" type="password" required placeholder="••••••••"
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
              {loading ? "Connexion..." : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Créer un compte gratuit
          </Link>
        </p>
      </div>
    </div>
  );
}
