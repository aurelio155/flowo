import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { deliverables: true, invoices: true, messages: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { name, description, clientName, clientEmail, deliverables } = await req.json();

  const project = await prisma.project.create({
    data: {
      name,
      description,
      clientName,
      clientEmail,
      userId: user.id,
      deliverables: {
        create: (deliverables || []).map((t: string) => ({ title: t })),
      },
    },
    include: { deliverables: true },
  });

  return NextResponse.json(project);
}
