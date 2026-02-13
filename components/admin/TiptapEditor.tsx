'use client';

import { Editor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  FaBold, FaItalic, FaStrikethrough, FaHeading, FaListOl, FaListUl, FaQuoteLeft, FaUndo, FaRedo, FaImage
} from 'react-icons/fa';
import { useState, useCallback } from 'react';
import ImageUpload from '@/components/ImageUpload';

interface MenuBarProps {
  editor: Editor | null;
  onImageUploadClick: () => void;
}

const MenuBar = ({ editor, onImageUploadClick }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap gap-2 p-2 bg-gray-100 rounded-t-lg border border-gray-300">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <FaHeading />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <FaQuoteLeft />
      </button>
      <button onClick={onImageUploadClick}>
        <FaImage />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>
        <FaUndo />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        <FaRedo />
      </button>
    </div>
  );
};

interface TiptapEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 border border-gray-300 rounded-b-lg focus:outline-none min-h-[200px]',
      },
    },
    immediatelyRender: false,
  });

  const addImage = useCallback((url: string) => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setIsImageUploadOpen(false);
  }, [editor]);

  return (
    <div>
      <MenuBar editor={editor} onImageUploadClick={() => setIsImageUploadOpen(true)} />
      <EditorContent editor={editor} />
      {isImageUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-4">Seleccionar Imagen</h2>
            <ImageUpload onImageSelect={addImage} source="blog" />
            <button
              onClick={() => setIsImageUploadOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;
