import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderOpen, ArrowRight, CheckCircle, Clock } from "lucide-react";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { deliverables: true, invoices: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="text-white max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Mes projets</h1>
          <p className="text-gray-400 mt-1">{projects.length} projet{projects.length !== 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/dashboard/projects/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl py-24 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-300 text-xl font-bold mb-2">Aucun projet</p>
          <p className="text-gray-500 mb-8">Créez votre premier projet et envoyez un lien magique à votre client</p>
          <Link href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <Plus className="w-4 h-4" />
            Créer mon premier projet
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const approved = project.deliverables.filter((d) => d.status === "approved").length;
            const total = project.deliverables.length;
            const paidAmount = project.invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
            const pendingAmount = project.invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);

            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}
                className="group p-6 rounded-2xl transition-all hover:scale-[1.01]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                    {project.name[0]}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.clientName}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {total > 0 && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      {approved}/{total} livrables
                    </span>
                  )}
                  {paidAmount > 0 && (
                    <span className="flex items-center gap-1 text-green-400">
                      {paidAmount}€ encaissé
                    </span>
                  )}
                  {pendingAmount > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Clock className="w-3.5 h-3.5" />
                      {pendingAmount}€ en attente
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
