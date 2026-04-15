import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { sharedWith: { some: { id: session.user.id } } },
      ],
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      sharedWith: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();

  const document = await prisma.document.create({
    data: {
      title: title || "Untitled Document",
      content: JSON.stringify({ type: "doc", content: [] }), // Initial Tiptap content
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(document);
}
