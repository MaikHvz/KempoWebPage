'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FaSignOutAlt, FaBlog, FaTrophy, FaImages, FaGraduationCap, FaUserGraduate, FaMoneyBillWave } from 'react-icons/fa';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems = [
    { href: '/admin/dashboard/students', label: 'Alumnos', icon: FaUserGraduate },
    { href: '/admin/dashboard/financials', label: 'Finanzas & Planes', icon: FaMoneyBillWave },
    { href: '/admin/dashboard/blog', label: 'Blog', icon: FaBlog },
    { href: '/admin/dashboard/tournaments', label: 'Torneos', icon: FaTrophy },
    { href: '/admin/dashboard/gallery', label: 'Galería', icon: FaImages },
    { href: '/admin/dashboard/ceremonies', label: 'Ceremonias', icon: FaGraduationCap },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="bg-slate-900 text-white w-full md:w-64 flex-shrink-0 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-gray-700 bg-slate-950">
          <h1 className="text-xl font-bold tracking-wider text-primary">ADMIN PANEL</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Dojo Valenzuela</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold translate-x-1'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                }`}
              >
                <Icon className={`text-lg ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 bg-slate-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-xl transition-colors cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
         {/* Top decorative bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
             <span className="text-gray-500 text-sm">Bienvenido al panel de control</span>
             <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-gray-600 uppercase">Sistema Online</span>
             </div>
        </div>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
