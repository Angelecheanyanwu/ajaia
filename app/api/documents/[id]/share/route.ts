import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (document.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Only owners can share documents" }, { status: 403 });
  }

  const userToShareWith = await prisma.user.findUnique({
    where: { email },
  });

  if (!userToShareWith) {
    // For simplicity, let's create the user if they don't exist
    // In a real app, you might send an invite email
    const newUser = await prisma.user.create({
      data: {
        email,
        name: email.split("@")[0],
      },
    });

    await prisma.document.update({
      where: { id },
      data: {
        sharedWith: {
          connect: { id: newUser.id },
        },
      },
    });
  } else {
    await prisma.document.update({
      where: { id },
      data: {
        sharedWith: {
          connect: { id: userToShareWith.id },
        },
      },
    });
  }

  return NextResponse.json({ message: "Shared successfully" });
}
