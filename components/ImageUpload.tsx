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
  const [showImagePreview, setShowImagePreview] = useState(false);
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
      // Both sources should list from root for now as uploadImage saves to root
      // Or we can organize, but let's fix the immediate mismatch first.
      const images = await getAllStorageImages();
      setStorageImages(images);
    } catch (error) {
      console.error('Error loading storage images:', error);
      // Removed alert to prevent freezing/crashing UX
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
            className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowImagePreview(true)}
            title="Click para ver en tamaño completo"
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

      {/* Selector de imágenes del storage - Lista simple sin previews */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-secondary">Seleccionar Imagen</h3>
              <button
                type="button"
                onClick={() => setShowImageSelector(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {storageImages.map((imageUrl, index) => {
                // Extraer el nombre del archivo de la URL
                const fileName = imageUrl.split('/').pop() || `Imagen ${index + 1}`;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleImageSelect(imageUrl)}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <FaImage className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">{fileName}</div>
                      <div className="text-xs text-gray-500 truncate">{imageUrl}</div>
                    </div>
                  </button>
                );
              })}
              {storageImages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
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

      {/* Overlay de vista previa completa */}
      {showImagePreview && currentImageUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              type="button"
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl font-bold"
              title="Cerrar"
            >
              ✕
            </button>
            <img 
              src={currentImageUrl} 
              alt="Vista previa completa" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}