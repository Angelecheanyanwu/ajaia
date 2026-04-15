import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, email: true, id: true } },
      sharedWith: { select: { name: true, email: true, id: true } },
      attachments: true,
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const isOwner = document.ownerId === userId;
  const isShared = document.sharedWith.some((u: { id: string }) => u.id === userId);

  if (!isOwner && !isShared) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(document);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;
  const { title, content } = await req.json();

  const document = await prisma.document.findUnique({
    where: { id },
    include: { sharedWith: true },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const isOwner = document.ownerId === userId;
  const isShared = document.sharedWith.some((u: { id: string }) => u.id === userId);

  if (!isOwner && !isShared) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedDocument = await prisma.document.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
  });

  return NextResponse.json(updatedDocument);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (document.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Only owners can delete documents" }, { status: 403 });
  }

  await prisma.document.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Document deleted" });
}
