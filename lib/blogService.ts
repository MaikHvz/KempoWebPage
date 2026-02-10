import { supabase } from './supabaseClient';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  published: boolean;
  created_at: string;
}

export const getPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
};

export const getPost = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPost:', error);
    return null;
  }
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        image_url: post.image_url || null,
        published: post.published !== undefined ? post.published : true,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createPost:', error);
    return null;
  }
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updatePost:', error);
    return null;
  }
};

export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePost:', error);
    return false;
  }
};

// Funciones adicionales para el admin
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
};