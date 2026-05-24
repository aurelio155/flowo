import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function baseHtml(content: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f8;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:28px 32px;">
      <h1 style="color:white;margin:0;font-size:24px;font-weight:900;">⚡ Flowo</h1>
    </div>
    <div style="padding:36px 32px;">${content}</div>
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;">
      <p style="color:#d1d5db;font-size:12px;margin:0;">Propulsé par <a href="https://flowo-ivory.vercel.app" style="color:#6366f1;text-decoration:none;">Flowo</a></p>
    </div>
  </div></body></html>`;
}

export async function sendMagicLink({ clientName, clientEmail, freelanceName, projectName, portalUrl }: {
  clientName: string; clientEmail: string; freelanceName: string; projectName: string; portalUrl: string;
}) {
  await transporter.sendMail({
    from: `"Flowo" <${process.env.GMAIL_USER}>`,
    to: clientEmail,
    subject: `Votre espace projet : ${projectName}`,
    html: baseHtml(`
      <p style="color:#374151;font-size:16px;margin:0 0 8px;">Bonjour <strong>${clientName}</strong>,</p>
      <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 32px;">
        <strong>${freelanceName}</strong> vous a créé un espace projet pour <strong>${projectName}</strong>.
        Suivez l'avancement, validez les livrables et payez vos factures — sans créer de compte.
      </p>
      <div style="text-align:center;margin:0 0 32px;">
        <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:700;font-size:16px;">
          Accéder à mon espace →
        </a>
      </div>
      <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">
        Lien direct : <a href="${portalUrl}" style="color:#6366f1;word-break:break-all;">${portalUrl}</a>
      </p>
    `),
  });
}

export async function sendPaymentReceived({ to, clientName, projectName, amount }: {
  to: string; clientName: string; projectName: string; amount: number;
}) {
  await transporter.sendMail({
    from: `"Flowo" <${process.env.GMAIL_USER}>`,
    to,
    subject: `💰 Paiement reçu — ${amount}€ de ${clientName}`,
    html: baseHtml(`
      <p style="color:#374151;font-size:16px;margin:0 0 16px;">Bonne nouvelle !</p>
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="margin:0;font-size:28px;font-weight:900;color:#10b981;">${amount}€ encaissés</p>
        <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Projet <strong>${projectName}</strong> · Payé par <strong>${clientName}</strong></p>
      </div>
      <p style="color:#6b7280;font-size:14px;margin:0;">Le statut de la facture a été mis à jour automatiquement dans votre dashboard.</p>
    `),
  });
}

export async function sendDeliverableAction({ to, clientName, projectName, deliverableTitle, approved }: {
  to: string; clientName: string; projectName: string; deliverableTitle: string; approved: boolean;
}) {
  const emoji = approved ? "✅" : "❌";
  const action = approved ? "validé" : "refusé";
  const color = approved ? "#10b981" : "#ef4444";
  await transporter.sendMail({
    from: `"Flowo" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${emoji} Livrable ${action} par ${clientName}`,
    html: baseHtml(`
      <p style="color:#374151;font-size:16px;margin:0 0 16px;">
        <strong>${clientName}</strong> vient de <strong style="color:${color};">${action}</strong> un livrable sur le projet <strong>${projectName}</strong>.
      </p>
      <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:16px;margin:0 0 24px;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#374151;">📄 ${deliverableTitle}</p>
      </div>
      <p style="color:#6b7280;font-size:14px;margin:0;">Connectez-vous à votre dashboard pour voir les détails.</p>
    `),
  });
}

export async function sendClientMessage({ to, clientName, projectName, messagePreview, portalUrl }: {
  to: string; clientName: string; projectName: string; messagePreview: string; portalUrl: string;
}) {
  await transporter.sendMail({
    from: `"Flowo" <${process.env.GMAIL_USER}>`,
    to,
    subject: `💬 Nouveau message de ${clientName} — ${projectName}`,
    html: baseHtml(`
      <p style="color:#374151;font-size:16px;margin:0 0 16px;">
        <strong>${clientName}</strong> vous a envoyé un message sur le projet <strong>${projectName}</strong> :
      </p>
      <div style="background:#f9fafb;border-left:4px solid #6366f1;padding:16px;border-radius:0 8px 8px 0;margin:0 0 24px;">
        <p style="margin:0;color:#374151;font-size:15px;font-style:italic;">"${messagePreview}"</p>
      </div>
    `),
  });
}
