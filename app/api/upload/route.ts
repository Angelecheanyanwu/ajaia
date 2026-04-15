import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const title = file.name.replace(/\.[^/.]+$/, "");
  let text: string;

  if (file.name.endsWith(".docx")) {
    // Parse .docx using mammoth
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    // .txt or .md — read as plain text
    text = await file.text();
  }

  // Build a simple Tiptap document content structure, preserving line breaks as paragraphs
  const paragraphs = text
    .split("\n")
    .map((line) => ({
      type: "paragraph",
      content: line.trim() ? [{ type: "text", text: line }] : [],
    }));

  const content = JSON.stringify({
    type: "doc",
    content: paragraphs.length ? paragraphs : [{ type: "paragraph", content: [] }],
  });

  const document = await prisma.document.create({
    data: {
      title: title || "Imported Document",
      content,
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(document);
}
