import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const project = await prisma.project.findUnique({ where: { magicToken: token } });
  if (!project) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });

  if (action === "message") {
    const message = await prisma.message.create({
      data: { content: data.content, sender: "client", projectId: project.id },
    });
    return NextResponse.json(message);
  }

  if (action === "approve_deliverable") {
    const deliverable = await prisma.deliverable.update({
      where: { id: data.deliverableId },
      data: { status: "approved" },
    });
    return NextResponse.json(deliverable);
  }

  if (action === "reject_deliverable") {
    const deliverable = await prisma.deliverable.update({
      where: { id: data.deliverableId },
      data: { status: "rejected" },
    });
    return NextResponse.json(deliverable);
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
