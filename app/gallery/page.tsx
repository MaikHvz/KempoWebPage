'use client';

import { useState, useEffect } from 'react';
import { GalleryItem, getAllGalleryItems } from '@/lib/galleryService';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'dojo', label: 'Instalaciones' },
  { id: 'students', label: 'Alumnos' },
  { id: 'training', label: 'Entrenamientos' },
  { id: 'competitions', label: 'Competencias' },
  { id: 'ceremonies', label: 'Ceremonias' },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getAllGalleryItems();
      setItems(data);
      setFilteredItems(data);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, items]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-5 py-24">
        <h1 className="text-4xl text-center mb-12 text-secondary font-bold">Galería de Imágenes</h1>

        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-full shadow-md">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative h-60 w-full">
                <Image
                  src={item.image_url || '/placeholder.svg'}
                  alt={item.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FaSearch className="text-white text-3xl" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-secondary truncate">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-500 truncate">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={selectedImage.image_url || '/placeholder.svg'}
              alt={selectedImage.title}
              width={1200}
              height={800}
              className="object-contain w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              {selectedImage.description && <p>{selectedImage.description}</p>}
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
