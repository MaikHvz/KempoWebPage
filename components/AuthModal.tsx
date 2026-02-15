'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaGoogle, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose(); // Cerrar modal al éxito
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0], // Nombre temporal
            },
          },
        });
        if (error) throw error;
        alert('¡Registro exitoso! Por favor, verifica tu correo.');
        onClose();
      }
    } catch (err: any) {
      // Translate common Supabase errors
      let errorMessage = err.message;
      if (err.message.includes('User already registered') || err.message.includes('duplicate key')) {
        errorMessage = 'Este correo ya está registrado. Por favor, inicia sesión.';
      } else if (err.message === 'Invalid login credentials') {
        errorMessage = 'Correo o contraseña incorrectos.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-primary p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Bienvenido de nuevo' : 'Únete al Dojo'}
          </h2>
          <p className="text-white/80 text-sm">
            {isLogin ? 'Ingresa para gestionar tus clases' : 'Comienza tu camino en el Kempo'}
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all mb-6 group"
          >
            <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
            <span>Continuar con Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">O usa tu correo</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Crear Cuenta')}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 text-sm">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
