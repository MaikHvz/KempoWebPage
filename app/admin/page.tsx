'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { FaLock } from 'react-icons/fa';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      router.push('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark-gray px-5">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
            <FaLock />
          </div>
          <h1 className="text-2xl font-bold text-secondary">Acceso Administrativo</h1>
          <p className="text-gray-500">Ingresa la contraseña para gestionar el blog</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
            {error && <p className="text-primary text-sm mt-2">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}
