"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@/components/Editor";
import { 
  ChevronLeft, 
  CloudCheck, 
  CloudIcon, 
  Share2, 
  Settings,
  MoreVertical,
  Eye,
  Edit3,
  UserPlus,
  Paperclip,
  FileUp,
  File,
  X,
  Plus
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error("Document not found");
      const data = await res.json();
      setDoc(data);
      setTitle(data.title);
      setAttachments(data.attachments || []);
    } catch (error) {
      toast.error("Failed to load document");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const saveContent = useCallback(
    async (content: string) => {
      setSaving(true);
      try {
        await fetch(`/api/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } catch (error) {
        toast.error("Failed to save changes");
      } finally {
        setTimeout(() => setSaving(false), 500);
      }
    },
    [id]
  );

  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle);
    try {
      await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (error) {
      toast.error("Failed to update title");
    }
  };

  const shareDocument = async () => {
    try {
      const res = await fetch(`/api/documents/${id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shareEmail }),
      });
      if (res.ok) {
        toast.success(`Shared with ${shareEmail}`);
        setShareEmail("");
        setShowShareModal(false);
        fetchDocument();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to share");
      }
    } catch (error) {
      toast.error("Failed to share document");
    }
  };

  const handleAttachmentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/documents/${id}/attachments`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Attachment added");
        fetchDocument();
      }
    } catch (error) {
      toast.error("Failed to upload attachment");
    }
  };

  const handleImportToDraft = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const appendText = async (text: string) => {
      const currentContent = JSON.parse(doc.content || '{"type":"doc","content":[]}');
      const lines = text.split("\n").map((line) => ({
        type: "paragraph",
        content: line.trim() ? [{ type: "text", text: line }] : [],
      }));
      const newNodes = [
        { type: "horizontalRule" },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: `Imported from ${file.name}` }] },
        ...lines,
      ];
      const mergedContent = { ...currentContent, content: [...currentContent.content, ...newNodes] };
      const contentString = JSON.stringify(mergedContent);
      setDoc({ ...doc, content: contentString });
      saveContent(contentString);
      toast.success("Content merged into draft");
    };

    if (file.name.endsWith(".docx")) {
      // Use the server-side parser for .docx
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/parse-file", { method: "POST", body: formData });
        if (res.ok) {
          const { text } = await res.json();
          await appendText(text);
        }
      } catch {
        toast.error("Failed to read file");
      }
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        await appendText(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => updateTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full p-0"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mt-1">
              {saving ? (
                <div className="flex items-center gap-1">
                  <CloudIcon size={14} className="animate-pulse" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-500">
                  <CloudCheck size={14} />
                  <span>Saved to cloud</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="cursor-pointer flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            <FileUp size={18} />
            <span>Import to Draft</span>
            <input type="file" className="hidden" onChange={handleImportToDraft} accept=".txt,.md,.docx" />
          </label>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>
          <div className="w-[1px] h-8 bg-gray-200 hidden sm:block mx-1" />
          <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Editor content={doc.content} onChange={saveContent} />
        </div>

        {/* Sidebar for Attachments */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Paperclip size={16} className="text-blue-500" />
                Attachments
              </h3>
              <label className="cursor-pointer p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                <Plus size={18} />
                <input type="file" className="hidden" onChange={handleAttachmentUpload} />
              </label>
            </div>

            {attachments.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-xs text-gray-400 font-medium">No attachments yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attachments.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl group transition-all hover:bg-blue-50/50">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                      <File size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate">{file.filename}</p>
                      <p className="text-[10px] text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Share document</h2>
                <p className="text-sm text-gray-500">Add people to collaborate</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 pl-1">Email address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={shareDocument}
                  className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
