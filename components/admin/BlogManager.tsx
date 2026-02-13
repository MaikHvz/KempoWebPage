import { useState, useEffect } from 'react';
import { BlogPost, getAllPosts, createPost, updatePost, deletePost } from '@/lib/blogService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';
import Image from 'next/image';
import ImageUpload from '../ImageUpload';
import TiptapEditor from './TiptapEditor';

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '/placeholder.svg',
    published: true
  });

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      setPosts(Array.isArray(data) ? data : (data === null ? [] : data));
    };
    fetchPosts();
  }, []);

  const handleCreate = () => {
    setCurrentPost({
      title: '',
      excerpt: '',
      content: '',
      image_url: '/placeholder.svg',
      published: true
    });
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      const success = await deletePost(id);
      if (success) {
        const data = await getAllPosts();
        setPosts(Array.isArray(data) ? data : []);
      } else {
        alert('Error al eliminar la publicación');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.content) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    let result;
    if (currentPost.id) {
      result = await updatePost(currentPost.id, currentPost);
    } else {
      result = await createPost(currentPost as Omit<BlogPost, 'id' | 'created_at'>);
    }

    if (result) {
      const data = await getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
      setIsEditing(false);
    } else {
      alert('Error al guardar la publicación');
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">
            {currentPost.id ? 'Editar Publicación' : 'Nueva Publicación'}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-primary transition-colors cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={currentPost.title}
              onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Resumen</label>
            <textarea
              value={currentPost.excerpt}
              onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contenido</label>
            <TiptapEditor
              content={currentPost.content || ''}
              onChange={value => setCurrentPost({ ...currentPost, content: value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
            <select
              value={currentPost.published !== undefined ? currentPost.published.toString() : 'true'}
              onChange={e => setCurrentPost({ ...currentPost, published: e.target.value === 'true' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="true">Publicado</option>
              <option value="false">Borrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen del Post</label>
            <ImageUpload
              currentImageUrl={currentPost.image_url}
              onImageSelect={(imageUrl) => setCurrentPost({ ...currentPost, image_url: imageUrl })}
              source="blog"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FaSave /> Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary">Gestión de Blog</h2>
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FaPlus /> Nueva Entrada
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(Array.isArray(posts) ? posts : []).map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-10 w-16">
                      <Image
                        src={post.image_url || '/placeholder.svg'}
                        alt={post.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                      title="Editar"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      title="Eliminar"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay publicaciones todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
