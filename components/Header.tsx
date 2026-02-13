'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFistRaised } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Contacto', href: '/#contacto' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/98' : 'bg-black/95 backdrop-blur-md'
      }`}
    >
      <nav className="py-4">
        <div className="container mx-auto px-5 flex justify-between items-center max-w-[1200px]">
          <div className="flex items-center text-2xl font-bold text-accent">
            <FaFistRaised className="text-primary mr-2 text-3xl" />
            <span>DOJO BIOKEMPO</span>
          </div>

          <ul
            className={`flex gap-8 list-none md:flex ${
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
  );
}
