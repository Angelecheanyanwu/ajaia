"use client";

import { useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, List, ListOrdered, 
  Quote, Undo, Redo 
} from "lucide-react";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("bold") ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("italic") ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("underline") ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <UnderlineIcon size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <Heading2 size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded transition-all hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600"}`}
      >
        <Quote size={18} />
      </button>
      <div className="ml-auto flex gap-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
};

export default function Editor({ content, onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: JSON.parse(content || '{"type":"doc","content":[]}'),
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[500px]",
      },
    },
  });

  // Sync editor content with prop changes (e.g. on import/merge)
  useEffect(() => {
    if (editor && content && content !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(JSON.parse(content));
    }
  }, [content, editor]);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm ring-1 ring-gray-950/5">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
