import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, CheckCircle, Clock, XCircle, MessageSquare, FileText, Plus } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import SendLinkButton from "@/components/SendLinkButton";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import AddDeliverableForm from "@/components/AddDeliverableForm";
import ChatBox from "@/components/ChatBox";
import AutoRefreshOnFocus from "@/components/AutoRefreshOnFocus";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    include: { deliverables: true, invoices: true, files: true, messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!project) notFound();

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3001";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const portalUrl = `${protocol}://${host}/portal/${project.magicToken}`;

  const statusIcon: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4 text-yellow-400" />,
    approved: <CheckCircle className="w-4 h-4 text-green-400" />,
    rejected: <XCircle className="w-4 h-4 text-red-400" />,
  };

  const invoiceStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "En attente", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    paid: { label: "Payé", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  };

  return (
    <div className="text-white max-w-5xl">
      <AutoRefreshOnFocus interval={8000} />
      <Link href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">{project.name}</h1>
          <p className="text-gray-400 mt-1">{project.clientName} · {project.clientEmail}</p>
          {project.description && <p className="text-gray-500 text-sm mt-2">{project.description}</p>}
        </div>
      </div>

      {/* Magic Link */}
      <div className="p-5 rounded-2xl mb-6"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-indigo-300 mb-1">🔗 Lien magique client</div>
            <div className="text-gray-400 text-sm font-mono truncate max-w-md">{portalUrl}</div>
          </div>
          <div className="flex gap-2">
            <SendLinkButton projectId={project.id} clientEmail={project.clientEmail} />
            <CopyButton text={portalUrl} />
            <a href={portalUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-300 hover:text-white transition-colors"
              style={{ background: "rgba(99,102,241,0.2)" }}>
              <ExternalLink className="w-4 h-4" />
              Ouvrir
            </a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Deliverables */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              Livrables ({project.deliverables.length})
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {project.deliverables.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Aucun livrable</p>
            ) : (
              project.deliverables.map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  {statusIcon[d.status] || statusIcon.pending}
                  <span className="text-sm flex-1">{d.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    d.status === "approved" ? "text-green-400 bg-green-400/10" :
                    d.status === "rejected" ? "text-red-400 bg-red-400/10" :
                    "text-yellow-400 bg-yellow-400/10"
                  }`}>
                    {d.status === "approved" ? "Validé" : d.status === "rejected" ? "Rejeté" : "En attente"}
                  </span>
                </div>
              ))
            )}
            <AddDeliverableForm projectId={project.id} />
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Factures ({project.invoices.length})
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {project.invoices.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Aucune facture</p>
            ) : (
              project.invoices.map((inv) => {
                const s = invoiceStatusConfig[inv.status] || invoiceStatusConfig.pending;
                return (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div>
                      <div className="text-sm font-medium">{inv.description || "Facture"}</div>
                      <div className="text-xs text-gray-500">{new Date(inv.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{inv.amount}€</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <AddInvoiceForm projectId={project.id} />
          </div>
        </div>

        {/* Messages */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Messages ({project.messages.length})
            </h2>
          </div>
          <ChatBox
            initialMessages={project.messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }))}
            currentSender="freelance"
            projectId={project.id}
          />
        </div>
      </div>
    </div>
  );
}
