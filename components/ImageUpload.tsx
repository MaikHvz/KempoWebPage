'use client';

import { useState, useRef } from 'react';
import { FaUpload, FaFolderOpen, FaImage } from 'react-icons/fa';
import { uploadImage, getStorageImages, getAllStorageImages } from '@/lib/galleryService';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageSelect: (imageUrl: string) => void;
  className?: string;
  source?: 'blog' | 'gallery';
}

export default function ImageUpload({ currentImageUrl, onImageSelect, className = '', source = 'gallery' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [storageImages, setStorageImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        onImageSelect(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
      // Resetear el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const loadStorageImages = async () => {
    setShowImageSelector(true);
    try {
      const images = source === 'blog' ? await getAllStorageImages() : await getStorageImages('gallery');
      setStorageImages(images);
    } catch (error) {
      console.error('Error loading storage images:', error);
      alert('Error al cargar imágenes');
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setShowImageSelector(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Vista previa de la imagen actual */}
      {currentImageUrl && (
        <div className="relative">
          <img 
            src={currentImageUrl} 
            alt="Imagen actual" 
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              title="Subir nueva imagen"
              disabled={isUploading}
            >
              <FaUpload className="text-primary" />
            </button>
            <button
              type="button"
              onClick={loadStorageImages}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              title="Seleccionar de galería"
            >
              <FaFolderOpen className="text-secondary" />
            </button>
          </div>
        </div>
      )}

      {/* Opciones cuando no hay imagen */}
      {!currentImageUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Selecciona una imagen</p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              disabled={isUploading}
            >
              <FaUpload /> Subir Imagen
            </button>
            <button
              type="button"
              onClick={loadStorageImages}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <FaFolderOpen /> Galería
            </button>
          </div>
        </div>
      )}

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Selector de imágenes del storage */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-secondary">Seleccionar Imagen</h3>
              <button
                onClick={() => setShowImageSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {storageImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => handleImageSelect(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border hover:border-primary transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">Seleccionar</span>
                  </div>
                </div>
              ))}
              {storageImages.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No hay imágenes en la galería
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Subiendo imagen...</p>
          </div>
        </div>
      )}
    </div>
  );
}