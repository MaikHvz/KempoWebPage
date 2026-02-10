'use client';

import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-8 border-t border-gray-800">
      <div className="container mx-auto px-5 text-center">
        <p className="mb-2">
            &copy; {new Date().getFullYear()} Dojo Valenzuela - Kempo Karate. Todos los derechos reservados.
        </p>
        <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Diseñado con <FaHeart className="text-primary" /> y disciplina marcial
        </p>
      </div>
    </footer>
  );
}
