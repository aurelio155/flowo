import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; msgId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id, msgId } = await params;
  const { emoji } = await req.json();

  const project = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!project) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });

  const msg = await prisma.message.findUnique({ where: { id: msgId } });
  if (!msg) return NextResponse.json({ error: "Message introuvable" }, { status: 404 });

  const reactions: Record<string, string[]> = JSON.parse(msg.reactions || "{}");
  const who = "freelance";
  if (!reactions[emoji]) reactions[emoji] = [];
  if (reactions[emoji].includes(who)) {
    reactions[emoji] = reactions[emoji].filter(r => r !== who);
    if (reactions[emoji].length === 0) delete reactions[emoji];
  } else {
    reactions[emoji].push(who);
  }

  const updated = await prisma.message.update({
    where: { id: msgId },
    data: { reactions: JSON.stringify(reactions) },
  });
  return NextResponse.json(updated);
}
