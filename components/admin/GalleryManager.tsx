'use client';

import { useState, useEffect } from 'react';
import { GalleryItem, getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/dataService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaStar } from 'react-icons/fa';
import Image from 'next/image';

const CATEGORIES = [
  { id: 'dojo', label: 'Instalaciones' },
  { id: 'students', label: 'Alumnos' },
  { id: 'training', label: 'Entrenamientos' },
  { id: 'competitions', label: 'Competencias' },
  { id: 'ceremonies', label: 'Ceremonias' },
];

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
    category: 'dojo',
    title: '',
    description: '',
    imageUrl: '/placeholder.svg',
    isFeatured: false
  });

  useEffect(() => {
    setItems(getGalleryItems());
  }, []);

  const handleCreate = () => {
    setCurrentItem({
      category: 'dojo',
      title: '',
      description: '',
    imageUrl: '/placeholder.svg',
    isFeatured: false
  });
    setIsEditing(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
      deleteGalleryItem(id);
      setItems(getGalleryItems());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem.title || !currentItem.imageUrl) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (currentItem.id) {
      updateGalleryItem(currentItem.id, currentItem);
    } else {
      createGalleryItem(currentItem as Omit<GalleryItem, 'id'>);
    }

    setItems(getGalleryItems());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">
            {currentItem.id ? 'Editar Imagen' : 'Nueva Imagen'}
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
            <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
            <select
              value={currentItem.category}
              onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={currentItem.title}
              onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea
              value={currentItem.description}
              onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">URL de Imagen</label>
            <input
              type="text"
              value={currentItem.imageUrl}
              onChange={e => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={currentItem.isFeatured || false}
              onChange={e => setCurrentItem({ ...currentItem, isFeatured: e.target.checked })}
              className="h-4 w-4 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm font-bold text-gray-700">
              Marcar como imagen destacada
            </label>
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
        <h2 className="text-3xl font-bold text-secondary">Gestión de Galería</h2>
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FaPlus /> Nueva Imagen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
            <div className="relative h-48 w-full">
              <Image
                src={item.imageUrl || '/placeholder.svg'}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs font-bold text-primary uppercase mb-1">
                {CATEGORIES.find(c => c.id === item.category)?.label || item.category}
              </div>
              <h3 className="font-bold text-secondary mb-1 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              {item.isFeatured && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                  <FaStar /> Destacada
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}