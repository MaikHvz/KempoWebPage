'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';
import { FaSignOutAlt, FaBlog, FaTrophy, FaImages, FaGraduationCap } from 'react-icons/fa';
import BlogManager from '@/components/admin/BlogManager';
import TournamentManager from '@/components/admin/TournamentManager';
import GalleryManager from '@/components/admin/GalleryManager';
import CeremonyManager from '@/components/admin/CeremonyManager';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'blog' | 'tournaments' | 'gallery' | 'ceremony'>('blog');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  const navItems = [
    { id: 'blog', label: 'Blog', icon: FaBlog },
    { id: 'tournaments', label: 'Torneos', icon: FaTrophy },
    { id: 'gallery', label: 'Galería', icon: FaImages },
    { id: 'ceremony', label: 'Ceremonia', icon: FaGraduationCap },
  ];

  return (
    <div className="min-h-screen bg-light-gray flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-secondary text-white w-full md:w-64 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm opacity-60">Dojo Valenzuela</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/30 hover:text-red-100 rounded-lg transition-colors cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'tournaments' && <TournamentManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'ceremony' && <CeremonyManager />}
        </div>
      </main>
    </div>
  );
}
