import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await prisma.project.findUnique({ where: { magicToken: token } });
  if (!project) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  const messages = await prisma.message.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}
