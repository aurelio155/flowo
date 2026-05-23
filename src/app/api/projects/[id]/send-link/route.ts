import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendMagicLink } from "@/lib/email";
import { headers } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3001";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const portalUrl = `${protocol}://${host}/portal/${project.magicToken}`;

  await sendMagicLink({
    clientName: project.clientName,
    clientEmail: project.clientEmail,
    freelanceName: user.name || user.email,
    projectName: project.name,
    portalUrl,
  });

  return NextResponse.json({ success: true });
}
