import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Zap, CheckCircle, Clock, XCircle, MessageSquare, FileText } from "lucide-react";
import ClientPortalActions from "@/components/ClientPortalActions";

export default async function PortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const project = await prisma.project.findUnique({
    where: { magicToken: token },
    include: {
      deliverables: true,
      invoices: true,
      files: true,
      messages: { orderBy: { createdAt: "asc" } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!project) notFound();

  const approved = project.deliverables.filter((d) => d.status === "approved").length;
  const total = project.deliverables.length;
  const progress = total > 0 ? Math.round((approved / total) * 100) : 0;

  const pendingInvoices = project.invoices.filter((i) => i.status === "pending");
  const totalPending = pendingInvoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="min-h-screen" style={{ background: "#050508", color: "white" }}>
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between"
        style={{ background: "#0a0a12", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <div className="font-black text-white">Flowo</div>
            <div className="text-xs text-gray-500">Portail client</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-white">{project.clientName}</div>
          <div className="text-xs text-gray-500">par {project.user.name || project.user.email}</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Project Header */}
        <div className="p-8 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))", border: "1px solid rgba(99,102,241,0.3)" }}>
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Votre projet</div>
          <h1 className="text-3xl font-black text-white mb-2">{project.name}</h1>
          {project.description && <p className="text-gray-300">{project.description}</p>}

          {total > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{approved} livrable{approved !== 1 ? "s" : ""} validé{approved !== 1 ? "s" : ""}</span>
                <span className="text-indigo-300 font-bold">{progress}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-2 rounded-full transition-all"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
              </div>
            </div>
          )}
        </div>

        {/* Alert factures */}
        {pendingInvoices.length > 0 && (
          <div className="p-5 rounded-2xl flex items-center justify-between"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <div>
              <div className="text-yellow-400 font-bold mb-1">💳 Paiement en attente</div>
              <div className="text-gray-300 text-sm">{pendingInvoices.length} facture{pendingInvoices.length > 1 ? "s" : ""} — {totalPending}€ au total</div>
            </div>
            <div className="text-2xl font-black text-yellow-400">{totalPending}€</div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Deliverables */}
          {project.deliverables.length > 0 && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                  Livrables à valider
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {project.deliverables.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      {d.status === "approved" && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {d.status === "rejected" && <XCircle className="w-4 h-4 text-red-400" />}
                      {d.status === "pending" && <Clock className="w-4 h-4 text-yellow-400" />}
                      <span className="text-sm font-medium">{d.title}</span>
                    </div>
                    {d.status === "pending" && (
                      <ClientPortalActions
                        token={token}
                        action="deliverable"
                        deliverableId={d.id}
                      />
                    )}
                    {d.status !== "pending" && (
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        d.status === "approved" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                      }`}>
                        {d.status === "approved" ? "✓ Validé par vous" : "✗ Rejeté"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {project.invoices.length > 0 && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Mes factures
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {project.invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div>
                      <div className="text-sm font-medium">{inv.description || "Facture"}</div>
                      <div className="text-xs text-gray-500">{new Date(inv.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{inv.amount}€</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        inv.status === "paid" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"
                      }`}>
                        {inv.status === "paid" ? "Payé" : "En attente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Messagerie
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {project.messages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Posez vos questions directement ici 👇
                </p>
              ) : (
                project.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-sm px-4 py-2 rounded-2xl text-sm"
                      style={{
                        background: msg.sender === "client" ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.08)",
                        borderRadius: msg.sender === "client" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                      }}>
                      <div className="text-xs text-gray-500 mb-1">{msg.sender === "client" ? "Vous" : project.user.name || "Freelance"}</div>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <ClientPortalActions token={token} action="message" />
          </div>
        </div>
      </div>

      <footer className="text-center py-8 text-gray-600 text-xs">
        Portail sécurisé propulsé par{" "}
        <a href="/" className="text-indigo-400 hover:text-indigo-300">Flowo</a>
      </footer>
    </div>
  );
}
