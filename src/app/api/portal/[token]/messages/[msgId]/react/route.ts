import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string; msgId: string }> }) {
  const { token, msgId } = await params;
  const { emoji } = await req.json();

  const project = await prisma.project.findUnique({ where: { magicToken: token } });
  if (!project) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });

  const msg = await prisma.message.findUnique({ where: { id: msgId } });
  if (!msg) return NextResponse.json({ error: "Message introuvable" }, { status: 404 });

  const reactions: Record<string, string[]> = JSON.parse(msg.reactions || "{}");
  const who = "client";
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
