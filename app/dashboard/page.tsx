"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FilePlus,
    FileText,
    Search,
    Clock,
    Users,
    Trash2,
    Upload,
    User as UserIcon,
    Share2,
    Check,
    Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [shareDoc, setShareDoc] = useState<any | null>(null);
    const [shareEmail, setShareEmail] = useState("");
    const [sharing, setSharing] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/documents");
            const data = await res.json();
            setDocuments(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load documents");
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchDocuments();
        }
    }, [status]);

    const createDocument = async () => {
        try {
            const res = await fetch("/api/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Untitled Document" }),
            });
            const doc = await res.json();
            router.push(`/documents/${doc.id}`);
        } catch (error) {
            toast.error("Failed to create document");
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            await fetch(`/api/documents/${id}`, { method: "DELETE" });
            setDocuments(documents.filter((doc) => doc.id !== id));
            toast.success("Document deleted");
            setDeleteId(null);
        } catch (error) {
            toast.error("Failed to delete document");
        }
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to upload file");
            }

            toast.success("File imported successfully");
            router.push(`/documents/${data.id}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to upload file");
        } finally {
            setUploading(false);
            // Reset input value to allow uploading same file again
            event.target.value = "";
        }
    };

    const shareDocument = async () => {
        if (!shareDoc || !shareEmail) return;
        setSharing(true);
        try {
            const res = await fetch(`/api/documents/${shareDoc.id}/share`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: shareEmail }),
            });
            if (res.ok) {
                toast.success(`Shared with ${shareEmail}`);
                setShareEmail("");
                setShareSuccess(true);
                fetchDocuments();
                // Update shareDoc to reflect new collaborator
                const updated = await fetch(`/api/documents/${shareDoc.id}`);
                if (updated.ok) setShareDoc(await updated.json());
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to share");
            }
        } catch {
            toast.error("Failed to share document");
        } finally {
            setSharing(false);
        }
    };

    const filteredDocs = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const myDocs = filteredDocs.filter(
        (doc) => doc.ownerId === session?.user?.id,
    );
    const sharedDocs = filteredDocs.filter(
        (doc) => doc.ownerId !== session?.user?.id,
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Workspace
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Capture ideas, collaborate, and ship faster.
                    </p>
                </div>

                <div className="flex gap-3">
                    <label
                        className={cn(
                            "cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-2xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm",
                            uploading && "opacity-50 cursor-not-allowed",
                        )}
                    >
                        {uploading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                            <Upload size={18} className="text-gray-400" />
                        )}
                        <span>{uploading ? "Importing..." : "Import"}</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".txt,.md,.docx"
                            disabled={uploading}
                        />
                    </label>
                    <button
                        onClick={createDocument}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/30"
                    >
                        <FilePlus size={18} />
                        <span>New Document</span>
                    </button>
                </div>
            </div>

            <div className="relative group max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search
                        size={20}
                        className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    />
                </div>
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-56 bg-gray-50 rounded-3xl animate-pulse border border-gray-100"
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-12">
                    {/* My Documents */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-gray-900">
                            <UserIcon size={20} className="text-blue-600" />
                            <h2 className="text-xl font-bold tracking-tight">
                                My Documents
                            </h2>
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-md text-xs font-bold text-gray-500">
                                {myDocs.length}
                            </span>
                        </div>

                        {myDocs.length === 0 ? (
                            <div className="p-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                <p className="text-gray-500 font-medium">
                                    No documents owned by you yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myDocs.map((doc) => (
                                    <DocumentCard
                                        key={doc.id}
                                        doc={doc}
                                        onDelete={() => setDeleteId(doc.id)}
                                        onShare={() => {
                                            setShareDoc(doc);
                                            setShareSuccess(false);
                                        }}
                                        isOwner={true}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Shared with Me */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-gray-900">
                            <Users size={20} className="text-indigo-600" />
                            <h2 className="text-xl font-bold tracking-tight">
                                Shared with Me
                            </h2>
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-md text-xs font-bold text-gray-500">
                                {sharedDocs.length}
                            </span>
                        </div>

                        {sharedDocs.length === 0 ? (
                            <div className="p-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                <p className="text-gray-500 font-medium">
                                    No documents shared with you yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sharedDocs.map((doc) => (
                                    <DocumentCard
                                        key={doc.id}
                                        doc={doc}
                                        isOwner={false}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-950/20 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Delete Document
                                </h2>
                                <p className="text-sm text-gray-500">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => deleteDocument(deleteId)}
                                className="w-full py-3 bg-red-600 rounded-xl text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all"
                            >
                                Delete Permanently
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {shareDoc && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-950/20 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Share "{shareDoc.title}"
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Invite collaborators by email
                                </p>
                            </div>
                        </div>

                        {/* Current collaborators */}
                        {shareDoc.sharedWith?.length > 0 && (
                            <div className="mb-5">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">
                                    People with access
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                            {shareDoc.owner?.name?.[0]?.toUpperCase() ||
                                                "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-700 truncate">
                                                {shareDoc.owner?.name || "You"}
                                            </p>
                                            <p className="text-xs text-blue-500 font-medium">
                                                Owner
                                            </p>
                                        </div>
                                        <Lock
                                            size={14}
                                            className="text-gray-400 flex-shrink-0"
                                        />
                                    </div>
                                    {shareDoc.sharedWith.map((user: any) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold">
                                                {user.name?.[0]?.toUpperCase() ||
                                                    "U"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-700 truncate">
                                                    {user.name || user.email}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Can edit
                                                </p>
                                            </div>
                                            <Check
                                                size={14}
                                                className="text-green-500 flex-shrink-0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {shareSuccess ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Successfully Shared!
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Invitation has been sent.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShareDoc(null);
                                        setShareSuccess(false);
                                    }}
                                    className="w-full mt-4 py-3 bg-gray-900 rounded-xl text-white font-bold hover:bg-black transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 pl-1">
                                        Add by email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        value={shareEmail}
                                        onChange={(e) =>
                                            setShareEmail(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && shareDocument()
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2 pt-1">
                                    <button
                                        onClick={shareDocument}
                                        disabled={!shareEmail || sharing}
                                        className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sharing ? "Sharing..." : "Send Invite"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShareDoc(null);
                                            setShareEmail("");
                                        }}
                                        className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function DocumentCard({
    doc,
    onDelete,
    onShare,
    isOwner,
}: {
    doc: any;
    onDelete?: () => void;
    onShare?: () => void;
    isOwner: boolean;
}) {
    return (
        <div
            className={cn(
                "group bg-white border rounded-2xl p-6 hover:shadow-2xl transition-all relative overflow-hidden",
                isOwner
                    ? "border-blue-100 hover:border-blue-300 hover:shadow-blue-500/5"
                    : "border-indigo-100 hover:border-indigo-300 hover:shadow-indigo-500/5",
            )}
        >
            {/* Visual badge: ownership indicator */}
            <div className="absolute top-3 right-3">
                {isOwner ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[10px] font-black tracking-wider uppercase">
                        Owner
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full text-[10px] font-black tracking-wider uppercase">
                        <Users size={10} /> Shared
                    </span>
                )}
            </div>

            <div className="flex justify-between items-start mb-6">
                <div
                    className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                        isOwner
                            ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                            : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                    )}
                >
                    <FileText size={28} />
                </div>
            </div>

            <Link href={`/documents/${doc.id}`} className="block">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2 pr-8">
                    {doc.title}
                </h3>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                        <Clock size={14} />
                        <span>
                            Updated{" "}
                            {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                {doc.owner?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="text-xs font-medium text-gray-500">
                                {isOwner
                                    ? "You"
                                    : `Shared by ${doc.owner?.name || doc.owner?.email}`}
                            </span>
                        </div>

                        {/* Collaborator avatars for owned docs */}
                        {isOwner && doc.sharedWith?.length > 0 && (
                            <div className="flex -space-x-1">
                                {doc.sharedWith.slice(0, 3).map((u: any) => (
                                    <div
                                        key={u.id}
                                        title={u.name || u.email}
                                        className="w-5 h-5 rounded-full bg-indigo-500 text-white border border-white flex items-center justify-center text-[9px] font-bold"
                                    >
                                        {u.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                ))}
                                {doc.sharedWith.length > 3 && (
                                    <div className="w-5 h-5 rounded-full bg-gray-300 text-gray-600 border border-white flex items-center justify-center text-[9px] font-bold">
                                        +{doc.sharedWith.length - 3}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Actions row for owners */}
            {isOwner && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onShare}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                        <Share2 size={14} />
                        Share
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
