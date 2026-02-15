'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const description = searchParams.get('description');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error de Autenticación</h1>
        <p className="text-gray-600 mb-4">
          Hubo un problema al intentar iniciar sesión.
        </p>
        
        {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6 border border-red-200 text-left">
                <p className="font-bold font-mono break-all mb-1">Error: {error}</p>
                {description && <p className="text-red-600 s break-words">{description}</p>}
            </div>
        )}

        <Link 
          href="/"
          className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-colors shadow-lg"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
