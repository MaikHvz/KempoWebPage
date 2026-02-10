'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost, getPosts } from '@/lib/blogService';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-light-gray">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-2 after:bg-primary after:rounded-sm">
          Noticias y Artículos
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !Array.isArray(posts) || posts.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">No hay publicaciones disponibles por el momento.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Array.isArray(posts) ? posts : []).map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image_url || '/placeholder.svg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-secondary line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-block bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-colors text-center mt-auto"
                  >
                    Leer más
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
