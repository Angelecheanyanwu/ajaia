import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: documentId } = await params;
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json(
            { error: "No file provided" },
            { status: 400 },
        );
    }

    // Verify access to the document
    const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: { sharedWith: true },
    });

    if (!document) {
        return NextResponse.json(
            { error: "Document not found" },
            { status: 404 },
        );
    }

    if (
        document.ownerId !== session.user.id &&
        !document.sharedWith.some(
            (u: { id: string }) => u.id === session.user?.id,
        )
    ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Simulating file storage - in a real app, we'd upload to S3/Cloudinary
    // For this assignment, we'll use a data URL or just store meta
    // Let's use a dummy URL for now as requested by the assignment scope (demonstrate logic)
    const attachment = await prisma.attachment.create({
        data: {
            filename: file.name,
            url: `/uploads/${file.name}`, // Placeholder
            documentId,
        },
    });

    return NextResponse.json(attachment);
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: documentId } = await params;

    const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: { sharedWith: true },
    });

    if (!document) {
        return NextResponse.json(
            { error: "Document not found" },
            { status: 404 },
        );
    }

    if (
        document.ownerId !== session.user.id &&
        !document.sharedWith.some(
            (u: { id: string }) => u.id === session.user?.id,
        )
    ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const attachments = await prisma.attachment.findMany({
        where: { documentId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(attachments);
}
