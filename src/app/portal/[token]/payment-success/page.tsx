export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string; invoiceId?: string }>;
}) {
  const { token } = await params;
  const { session_id, invoiceId } = await searchParams;

  if (session_id && invoiceId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        const project = await prisma.project.findUnique({
          where: { magicToken: token },
          include: { invoices: { where: { id: invoiceId } } },
        });
        if (project && project.invoices.length > 0) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              status: "paid",
              stripePaymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : undefined,
            },
          });
        }
      }
    } catch {}
  }

  redirect(`/portal/${token}`);
}
