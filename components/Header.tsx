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
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <span className="text-white font-semibold">
                      Hola, {user.user_metadata.full_name || user.email?.split('@')[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 font-medium text-sm border border-red-900/50 px-3 py-1 rounded-full transition-colors"
                    >
                      Cerrar Sesión
                    </button>
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
