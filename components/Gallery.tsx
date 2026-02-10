'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaExpand, FaTimes } from 'react-icons/fa';
import { getGalleryItems, GalleryItem } from '@/lib/dataService';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const filters = [
  { id: 'all', label: 'Todas' },
  { id: 'dojo', label: 'Instalaciones' },
  { id: 'students', label: 'Alumnos' },
  { id: 'training', label: 'Entrenamientos' },
  { id: 'competitions', label: 'Competencias' },
  { id: 'ceremonies', label: 'Ceremonias' },
];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setGalleryItems(getGalleryItems().filter(item => item.isFeatured));
  }, []);

  return (
    <section id="galeria" className="py-24 bg-light-gray">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <h2 className="text-4xl text-center mb-4 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Imágenes Destacadas
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12 max-w-[600px] mx-auto">
            Un vistazo a nuestros mejores momentos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map(item => (
                <div key={item.id} className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer animate-fadeIn">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                        <h4 className="text-white text-xl font-bold mb-2">{item.title}</h4>
                        <p className="text-white/90 text-sm">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/gallery" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-red-700 transition-colors cursor-pointer">
              Ver Galería Completa <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
