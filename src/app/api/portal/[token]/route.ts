import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDeliverableAction, sendClientMessage } from "@/lib/email";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await prisma.project.findUnique({
    where: { magicToken: token },
    include: { deliverables: true, invoices: true, files: true, messages: true },
  });
  if (!project) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  return NextResponse.json(project);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { action, data } = await req.json();

  const project = await prisma.project.findUnique({
    where: { magicToken: token },
    include: { user: true },
  });
  if (!project) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });

  if (action === "message") {
    const message = await prisma.message.create({
      data: { content: data.content, sender: "client", projectId: project.id },
    });
    // Notification email au freelance (silencieux si pas configuré)
    try {
      const recentMessages = await prisma.message.count({
        where: {
          projectId: project.id,
          sender: "client",
          createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
        },
      });
      if (recentMessages === 1) {
        await sendClientMessage({
          to: project.user.email,
          clientName: project.clientName,
          projectName: project.name,
          messagePreview: data.content.slice(0, 120),
          portalUrl: "",
        });
      }
    } catch {}
    return NextResponse.json(message);
  }

  if (action === "approve_deliverable") {
    const deliverable = await prisma.deliverable.update({
      where: { id: data.deliverableId },
      data: { status: "approved" },
    });
    try {
      await sendDeliverableAction({
        to: project.user.email,
        clientName: project.clientName,
        projectName: project.name,
        deliverableTitle: deliverable.title,
        approved: true,
      });
    } catch {}
    return NextResponse.json(deliverable);
  }

  if (action === "reject_deliverable") {
    const deliverable = await prisma.deliverable.update({
      where: { id: data.deliverableId },
      data: { status: "rejected" },
    });
    try {
      await sendDeliverableAction({
        to: project.user.email,
        clientName: project.clientName,
        projectName: project.name,
        deliverableTitle: deliverable.title,
        approved: false,
      });
    } catch {}
    return NextResponse.json(deliverable);
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
