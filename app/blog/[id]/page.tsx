'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, getPost } from '@/lib/blogService';
import { FaArrowLeft } from 'react-icons/fa';

export default function BlogPostPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const foundPost = await getPost(id);
        if (foundPost) {
          setPost(foundPost);
        }
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-32 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!post) return (
    <div className="min-h-screen pt-32 text-center px-5">
      <h2 className="text-2xl font-bold mb-4">Entrada no encontrada</h2>
      <Link href="/blog" className="text-primary hover:underline">Volver al Blog</Link>
    </div>
  );

  return (
    <main className="min-h-screen pt-24 pb-12 bg-white">
      <div className="container mx-auto px-5 max-w-[800px]">
        <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors font-medium">
          <FaArrowLeft className="mr-2" /> Volver al Blog
        </Link>
        
        <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden mb-8 shadow-xl">
           <Image
             src={post.image_url || '/placeholder.svg'}
             alt={post.title}
             fill
             className="object-cover"
           />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-secondary leading-tight">{post.title}</h1>
        <div className="text-gray-500 mb-8 border-b border-gray-200 pb-4 flex items-center gap-4">
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>Dojo BioKempo</span>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            {/* Renderizado seguro de HTML simple */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </main>
  );
}
