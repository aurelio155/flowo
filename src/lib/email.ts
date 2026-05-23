import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendMagicLink({
  clientName,
  clientEmail,
  freelanceName,
  projectName,
  portalUrl,
}: {
  clientName: string;
  clientEmail: string;
  freelanceName: string;
  projectName: string;
  portalUrl: string;
}) {
  await transporter.sendMail({
    from: `"Flowo" <${process.env.GMAIL_USER}>`,
    to: clientEmail,
    subject: `Votre espace projet : ${projectName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f4f4f8;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:32px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:28px;font-weight:900;">⚡ Flowo</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Votre espace projet est prêt</p>
          </div>
          <div style="padding:40px 32px;">
            <p style="color:#374151;font-size:16px;margin:0 0 8px;">Bonjour <strong>${clientName}</strong>,</p>
            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 32px;">
              <strong>${freelanceName}</strong> vous a créé un espace projet dédié pour <strong>${projectName}</strong>.
              Vous pouvez y suivre l'avancement, valider les livrables et consulter vos factures — sans créer de compte.
            </p>
            <div style="text-align:center;margin:0 0 32px;">
              <a href="${portalUrl}"
                style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:700;font-size:16px;">
                Accéder à mon espace →
              </a>
            </div>
            <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">
              Ou copiez ce lien dans votre navigateur :<br/>
              <a href="${portalUrl}" style="color:#6366f1;word-break:break-all;">${portalUrl}</a>
            </p>
          </div>
          <div style="background:#f9fafb;padding:20px 32px;text-align:center;">
            <p style="color:#d1d5db;font-size:12px;margin:0;">
              Propulsé par <a href="https://flowo.io" style="color:#6366f1;text-decoration:none;">Flowo</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
