import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderOpen, TrendingUp, ArrowRight, Plus, Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import AutoRefreshOnFocus from "@/components/AutoRefreshOnFocus";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [projects, totalRevenue, monthRevenue, pendingInvoices, overdueInvoices, recentMessages] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id },
      include: { deliverables: true, invoices: true, messages: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.invoice.aggregate({
      where: { project: { userId: user.id }, status: "paid" },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { project: { userId: user.id }, status: "paid", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { project: { userId: user.id }, status: "pending" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.count({
      where: {
        project: { userId: user.id },
        status: "pending",
        dueDate: { lt: now },
      },
    }),
    prisma.message.findMany({
      where: { project: { userId: user.id }, sender: "client" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { project: { select: { name: true, clientName: true } } },
    }),
  ]);

  const activeProjects = projects.filter(p => p.status === "active").length;
  const totalEarned = totalRevenue._sum.amount || 0;
  const monthEarned = monthRevenue._sum.amount || 0;
  const pendingAmount = pendingInvoices._sum.amount || 0;
  const pendingCount = pendingInvoices._count;

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: "Actif", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    completed: { label: "Terminé", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
    paused: { label: "En pause", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  };

  return (
    <div className="text-white max-w-5xl">
      <AutoRefreshOnFocus interval={10000} />

      <div className="mb-8">
        <h1 className="text-3xl font-black">Bonjour, {user.name || "toi"} 👋</h1>
        <p className="text-gray-400 mt-1">Voici votre activité en temps réel</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl col-span-2 md:col-span-1"
          style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05))", border: "1px solid rgba(16,185,129,0.25)" }}>
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wide mb-2">Ce mois</p>
          <p className="text-3xl font-black text-emerald-400">{monthEarned.toFixed(0)}€</p>
          <p className="text-xs text-gray-500 mt-1">Total : {totalEarned.toFixed(0)}€</p>
        </div>

        <div className="p-5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-wide mb-2">En attente</p>
          <p className="text-2xl font-black text-yellow-400">{pendingAmount.toFixed(0)}€</p>
          <p className="text-xs text-gray-500 mt-1">{pendingCount} facture{pendingCount > 1 ? "s" : ""}</p>
        </div>

        <div className="p-5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wide mb-2">Projets actifs</p>
          <p className="text-2xl font-black text-indigo-400">{activeProjects}</p>
          <p className="text-xs text-gray-500 mt-1">sur {projects.length} total</p>
        </div>

        {overdueInvoices > 0 ? (
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <p className="text-xs text-red-400 font-bold uppercase tracking-wide mb-2">En retard</p>
            <p className="text-2xl font-black text-red-400">{overdueInvoices}</p>
            <p className="text-xs text-gray-500 mt-1">facture{overdueInvoices > 1 ? "s" : ""} en retard</p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">Retards</p>
            <p className="text-2xl font-black text-green-400">0</p>
            <p className="text-xs text-gray-500 mt-1">tout est à jour ✓</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Projets récents */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-indigo-400" />
              Projets récents
            </h2>
            <Link href="/dashboard/projects"
              className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 mb-4">Aucun projet pour l&apos;instant</p>
              <Link href="/dashboard/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                <Plus className="w-4 h-4" /> Créer un projet
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {projects.map((project) => {
                const s = statusConfig[project.status] || statusConfig.active;
                const approved = project.deliverables.filter(d => d.status === "approved").length;
                const total = project.deliverables.length;
                const pending = project.invoices.filter(i => i.status === "pending").length;
                return (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                      {project.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.clientName}</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {total > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          {approved}/{total}
                        </span>
                      )}
                      {pending > 0 && (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Clock className="w-3.5 h-3.5" />
                          {pending}
                        </span>
                      )}
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                      style={{ color: s.color, background: s.bg }}>{s.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Messages récents */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Messages clients
            </h2>
          </div>
          {recentMessages.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500 text-sm">Aucun message reçu</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {recentMessages.map(msg => (
                <div key={msg.id} className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400">{msg.project.clientName}</span>
                    <span className="text-xs text-gray-600">{new Date(msg.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerte factures en retard */}
      {overdueInvoices > 0 && (
        <div className="p-4 rounded-2xl flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-bold text-sm">
              {overdueInvoices} facture{overdueInvoices > 1 ? "s" : ""} en retard de paiement
            </p>
            <p className="text-gray-500 text-xs">Envoyez un rappel à vos clients depuis la page du projet.</p>
          </div>
          <Link href="/dashboard/projects"
            className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors font-medium whitespace-nowrap">
            Voir →
          </Link>
        </div>
      )}
    </div>
  );
}
