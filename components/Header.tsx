'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { FaFistRaised } from 'react-icons/fa';
import AuthModal from './AuthModal';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    window.location.reload(); // Reload to clear any protected state
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Inicio', href: '/#inicio' },
    { name: 'Maestros', href: '/#maestros' },
    { name: 'Galería', href: '/#galeria' },
    { name: 'Clases', href: '/#clases' },
    { name: 'Torneos', href: '/#torneos' },
    { name: 'Ceremonias', href: '/#ceremonias' },
    { name: 'Blog', href: '/blog' },
    { name: 'Planes', href: '/planes' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/98' : 'bg-black/95 backdrop-blur-md'
        }`}
      >
        <nav className="py-4">
          <div className="container mx-auto px-5 flex justify-between items-center max-w-[1200px]">
            <Link href="/" className="flex items-center text-2xl font-bold text-accent">
              <FaFistRaised className="text-primary mr-2 text-3xl" />
              <span>DOJO BIOKEMPO</span>
            </Link>

            <ul
              className={`flex gap-6 list-none md:flex items-center ${
                isOpen
                  ? 'flex-col absolute top-[70px] left-0 w-full bg-black/95 p-8 items-center h-screen'
                  : 'hidden'
              }`}
            >
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-accent no-underline font-medium transition-colors duration-300 relative group hover:text-primary"
                    onClick={closeMenu}
                  >
                    {link.name}
                    <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
              
              {/* User Menu or Login Button */}
              <li className="flex items-center">
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-white font-semibold hover:text-primary transition-colors py-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <span>Hola, {user.user_metadata.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-0 w-48 bg-white rounded-xl shadow-xl overflow-hidden hidden group-hover:block border border-gray-100 animate-in fade-in slide-in-from-top-2">
                        <Link href="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100">
                            Mi Perfil
                        </Link>
                        {user.email === 'admin@kempo.cl' && ( // Simple check, ideally use role from metadata or profile
                            <Link href="/admin/dashboard" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100">
                                Panel Admin
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      closeMenu();
                    }}
                    className="bg-primary text-white border border-primary px-5 py-2 rounded-full font-bold hover:bg-black hover:text-primary transition-all duration-300 shadow-lg shadow-red-900/20"
                  >
                    Acceso Alumnos
                  </button>
                )}
              </li>
            </ul>

            <div
              className={`md:hidden flex flex-col cursor-pointer gap-[6px] z-50 ${
                isOpen ? 'active' : ''
              }`}
              onClick={toggleMenu}
            >
              <span
                className={`w-[25px] h-[3px] bg-accent transition-all duration-300 ${
                  isOpen ? 'rotate-[-45deg] translate-x-[-5px] translate-y-[6px]' : ''
                }`}
              ></span>
              <span
                className={`w-[25px] h-[3px] bg-accent transition-all duration-300 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`w-[25px] h-[3px] bg-accent transition-all duration-300 ${
                  isOpen ? 'rotate-[45deg] translate-x-[-5px] translate-y-[-6px]' : ''
                }`}
              ></span>
            </div>
          </div>
        </nav>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
