import { supabase } from './supabaseClient';

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  description?: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

// Funciones de utilidad para Supabase Storage
const STORAGE_BUCKET = 'gallery';
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB en bytes

// Función para subir imagen a Supabase Storage
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      alert('La imagen no debe superar los 3MB');
      return null;
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPEG, PNG o WebP');
      return null;
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      return null;
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error en uploadImage:', error);
    return null;
  }
};

// Función para eliminar imagen de Supabase Storage
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extraer el path del URL
    const url = new URL(imageUrl);
    const path = url.pathname.split('/').pop();

    if (!path) return false;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error('Error al eliminar imagen:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteImage:', error);
    return false;
  }
};

// Funciones CRUD para galería
export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getGalleryItems:', error);
    return [];
  }
};

export const getGalleryItem = async (id: string): Promise<GalleryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching gallery item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getGalleryItem:', error);
    return null;
  }
};

export const createGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([{
        category: item.category,
        title: item.title,
        description: item.description || '',
        image_url: item.image_url,
        is_featured: item.is_featured !== undefined ? item.is_featured : false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating gallery item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createGalleryItem:', error);
    return null;
  }
};

export const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating gallery item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateGalleryItem:', error);
    return null;
  }
};

export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  try {
    // Primero obtener el item para saber la URL de la imagen
    const item = await getGalleryItem(id);
    if (item && item.image_url) {
      // Eliminar la imagen del storage
      await deleteImage(item.image_url);
    }

    // Eliminar el registro de la base de datos
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteGalleryItem:', error);
    return false;
  }
};

// Funciones adicionales para el admin
export const getAllGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all gallery items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllGalleryItems:', error);
    return [];
  }
};

// Función para obtener imágenes del storage (útil para el selector)
export const getStorageImages = async (folder?: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error fetching storage images:', error);
      return [];
    }

    const imageUrls = data.map(file => {
      const path = folder ? `${folder}/${file.name}` : file.name;
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      return publicUrl;
    });

    return imageUrls;
  } catch (error) {
    console.error('Error in getStorageImages:', error);
    return [];
  }
};

export const getAllStorageImages = async (): Promise<string[]> => {
  return getStorageImages();
};
