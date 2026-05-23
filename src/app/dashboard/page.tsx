import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderOpen, Users, TrendingUp, ArrowRight, Plus, Clock, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { deliverables: true, invoices: true, messages: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const totalProjects = await prisma.project.count({ where: { userId: user.id } });
  const activeProjects = await prisma.project.count({ where: { userId: user.id, status: "active" } });
  const totalRevenue = await prisma.invoice.aggregate({
    where: { project: { userId: user.id }, status: "paid" },
    _sum: { amount: true },
  });

  const stats = [
    { label: "Projets actifs", value: activeProjects, icon: FolderOpen, color: "#6366f1" },
    { label: "Total projets", value: totalProjects, icon: Users, color: "#a855f7" },
    { label: "Revenus encaissés", value: `${(totalRevenue._sum.amount || 0).toFixed(0)}€`, icon: TrendingUp, color: "#10b981" },
  ];

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: "Actif", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    completed: { label: "Terminé", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
    paused: { label: "En pause", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  };

  return (
    <div className="text-white max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Bonjour, {user.name || "toi"} 👋
        </h1>
        <p className="text-gray-400 mt-1">Voici un résumé de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}20` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="font-bold">Projets récents</h2>
          <Link href="/dashboard/projects"
            className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-16 text-center">
            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Aucun projet pour l&apos;instant</p>
            <p className="text-gray-600 text-sm mb-6">Créez votre premier projet et partagez un lien avec votre client</p>
            <Link href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <Plus className="w-4 h-4" />
              Créer mon premier projet
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {projects.map((project) => {
              const s = statusConfig[project.status] || statusConfig.active;
              const approved = project.deliverables.filter((d) => d.status === "approved").length;
              const total = project.deliverables.length;
              const pending = project.invoices.filter((i) => i.status === "pending").length;
              const unread = project.messages.length;

              return (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                    {project.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.clientName} · {project.clientEmail}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {total > 0 && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        {approved}/{total}
                      </span>
                    )}
                    {pending > 0 && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Clock className="w-3.5 h-3.5" />
                        {pending} facture{pending > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ color: s.color, background: s.bg }}>
                    {s.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
