import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; invoiceId: string }> }
) {
  const { token, invoiceId } = await params;

  const project = await prisma.project.findUnique({
    where: { magicToken: token },
    include: { invoices: true },
  });
  if (!project) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });

  const invoice = project.invoices.find((i) => i.id === invoiceId);
  if (!invoice) return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  if (invoice.status === "paid") return NextResponse.json({ error: "Déjà payée" }, { status: 400 });

  const origin = req.headers.get("origin") || "https://flowo-ivory.vercel.app";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: invoice.description || "Facture" },
          unit_amount: Math.round(invoice.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/portal/${token}/payment-success?session_id={CHECKOUT_SESSION_ID}&invoiceId=${invoiceId}`,
    cancel_url: `${origin}/portal/${token}`,
    metadata: { invoiceId, token },
  });

  return NextResponse.json({ url: session.url });
}
