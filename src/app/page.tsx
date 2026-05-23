import Link from "next/link";
import {
  ArrowRight, CheckCircle, Star, Zap, Shield, Users,
  FileText, MessageSquare, CreditCard, Globe
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,8,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold">Flowo</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Témoignages</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Connexion
          </Link>
          <Link href="/register"
            className="text-sm font-medium px-4 py-2 rounded-full text-white shimmer"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #6366f1 0%, #a855f7 40%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-indigo-300">Déjà utilisé par 500+ freelances</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Vos clients adorent{" "}
            <span className="gradient-text">travailler avec vous.</span>
            <br />
            Grâce à Flowo.
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Un portail client élégant. Partagez un lien, vos clients voient tout en temps réel —
            livrables, fichiers, factures. Fini le chaos des emails.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"
              className="group flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all animate-pulse-glow"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              Créer mon portail gratuit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-medium text-gray-300 hover:text-white transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              Voir comment ça marche
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Gratuit pour démarrer</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Sans CB requise</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Prêt en 2 minutes</span>
          </div>
        </div>

        {/* Mock UI Preview */}
        <div className="relative mt-20 w-full max-w-5xl mx-auto">
          <div className="absolute inset-0 rounded-3xl opacity-30"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", filter: "blur(40px)", transform: "scale(0.95) translateY(20px)" }} />
          <div className="relative rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "#0d0d14" }}>
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#111118", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
              </div>
              <div className="flex-1 mx-4 px-3 py-1 rounded-md text-xs text-gray-500"
                style={{ background: "#0a0a10", border: "1px solid rgba(255,255,255,0.06)" }}>
                flowo.io/portal/abc123
              </div>
            </div>
            {/* Mock dashboard */}
            <div className="p-6 grid grid-cols-12 gap-4 min-h-[320px]">
              {/* Sidebar */}
              <div className="col-span-3 space-y-2">
                <div className="h-8 rounded-lg opacity-60 shimmer" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }} />
                {["Projets", "Clients", "Factures", "Fichiers"].map((item) => (
                  <div key={item} className="h-7 rounded-lg flex items-center px-3 text-xs text-gray-500"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    {item}
                  </div>
                ))}
              </div>
              {/* Main */}
              <div className="col-span-9 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Projets actifs", value: "12", color: "#6366f1" },
                    { label: "En attente", value: "3", color: "#a855f7" },
                    { label: "Revenus", value: "4 800€", color: "#10b981" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                      <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs text-gray-400 font-medium">Projets récents</div>
                  {["Refonte site e-commerce", "App mobile iOS", "Identité visuelle"].map((p, i) => (
                    <div key={p} className="flex items-center justify-between py-1">
                      <span className="text-xs text-gray-300">{p}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? "text-green-400 bg-green-400/10" : i === 1 ? "text-yellow-400 bg-yellow-400/10" : "text-indigo-400 bg-indigo-400/10"}`}>
                        {i === 0 ? "Validé" : i === 1 ? "En cours" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 px-6 border-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-center text-sm text-gray-600 mb-8">Utilisé par des freelances dans toute la francophonie</p>
        <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
          {["Graphiste", "Développeur Web", "Consultant", "Photographe", "Rédacteur", "Designer UX"].map((role) => (
            <span key={role} className="text-gray-400 font-medium text-sm">{role}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tout ce dont vous avez besoin,{" "}
              <span className="gradient-text">rien de superflu</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Conçu pour les freelances qui veulent impressionner leurs clients et gagner du temps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe, color: "#6366f1",
                title: "Portail client magic link",
                desc: "Un lien unique, pas de compte requis. Vos clients accèdent instantanément à tout leur espace projet.",
              },
              {
                icon: CheckCircle, color: "#a855f7",
                title: "Validation en 1 clic",
                desc: "Vos clients approuvent ou rejettent les livrables directement. Fini les allers-retours par email.",
              },
              {
                icon: CreditCard, color: "#ec4899",
                title: "Paiement intégré",
                desc: "Envoyez vos factures et recevez vos paiements directement via Stripe, sans quitter Flowo.",
              },
              {
                icon: MessageSquare, color: "#10b981",
                title: "Messagerie intégrée",
                desc: "Communiquez avec vos clients dans le contexte du projet. Plus de mails perdus.",
              },
              {
                icon: FileText, color: "#f59e0b",
                title: "Partage de fichiers",
                desc: "Déposez et recevez des fichiers directement sur le portail. Organisé par projet automatiquement.",
              },
              {
                icon: Shield, color: "#06b6d4",
                title: "Branding personnalisé",
                desc: "Votre logo, vos couleurs. Vos clients voient votre marque, pas la nôtre.",
              },
            ].map((f) => (
              <div key={f.title} className="group relative p-6 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(ellipse at top left, ${f.color}15, transparent 70%)` }} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}20` }}>
                    <f.icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-16">
            En 3 étapes, <span className="gradient-text">vos clients sont bluffés</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Créez votre projet", desc: "Ajoutez le nom du client, ses emails, les livrables à valider. 2 minutes chrono." },
              { step: "02", title: "Envoyez le lien", desc: "Copiez le magic link et envoyez-le par mail ou SMS. Votre client clique, c'est tout." },
              { step: "03", title: "Suivez en temps réel", desc: "Validations, paiements, messages — tout apparaît dans votre dashboard instantanément." },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-7xl font-black mb-4 gradient-text opacity-30">{s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">
            Ils ont adopté Flowo, <span className="gradient-text">ils ne reviennent pas en arrière</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Marie L.", role: "Designer UX freelance", text: "Mes clients me disent que je suis la seule freelance à utiliser un outil aussi pro. Flowo m'a clairement fait gagner des clients." },
              { name: "Thomas R.", role: "Développeur web", text: "J'ai arrêté d'envoyer des PDFs par email. Maintenant tout est sur le portail. Mes clients valident en 5 minutes là où ça prenait 3 jours." },
              { name: "Sofia M.", role: "Consultante marketing", text: "Le magic link c'est la fonctionnalité qui tue. Le client reçoit un lien, tout est là. Pas de login, pas de friction. Révolutionnaire." },
            ].map((t) => (
              <div key={t.name} className="p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Prix <span className="gradient-text">simple et transparent</span>
            </h2>
            <p className="text-gray-400">Commencez gratuitement. Upgradez quand vous êtes prêt.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-lg font-bold mb-1">Gratuit</div>
              <div className="text-4xl font-black mb-1">0€</div>
              <div className="text-gray-500 text-sm mb-8">Pour toujours</div>
              <ul className="space-y-3 mb-8">
                {["1 projet actif", "Portail client magic link", "Messagerie intégrée", "Partage de fichiers"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="block w-full py-3 rounded-xl text-center font-medium text-sm transition-all hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro */}
            <div className="relative p-8 rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(99,102,241,0.5)" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                Le plus populaire
              </div>
              <div className="text-lg font-bold mb-1">Pro</div>
              <div className="text-4xl font-black mb-1">19€<span className="text-lg font-normal text-gray-400">/mois</span></div>
              <div className="text-gray-400 text-sm mb-8">Tout illimité</div>
              <ul className="space-y-3 mb-8">
                {[
                  "Projets illimités",
                  "Clients illimités",
                  "Paiement Stripe intégré",
                  "Branding personnalisé",
                  "Factures automatiques",
                  "Support prioritaire",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-200">
                    <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="block w-full py-3 rounded-xl text-center font-bold text-sm text-white shimmer"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                Démarrer l&apos;essai gratuit 14j
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Prêt à impressionner{" "}
              <span className="gradient-text">vos clients ?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Rejoignez 500+ freelances qui ont transformé leur relation client avec Flowo.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-white font-bold text-lg animate-pulse-glow"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-gray-600 text-sm"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="font-bold text-white">Flowo</span>
        </div>
        <p>© 2024 Flowo. Tous droits réservés.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-gray-400 transition-colors">CGU</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
