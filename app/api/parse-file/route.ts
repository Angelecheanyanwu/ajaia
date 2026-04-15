import { auth } from "@/lib/auth";
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
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  let text: string;

  if (file.name.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    text = await file.text();
  }

  return NextResponse.json({ text });
}
