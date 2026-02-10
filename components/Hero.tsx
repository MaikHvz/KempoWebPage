'use client';

import { FaFistRaised } from 'react-icons/fa';
import { contactWhatsApp, scrollToSection } from '../utils';

export default function Hero() {
  return (
    <section id="inicio" className="min-h-screen flex items-center relative overflow-hidden bg-[linear-gradient(135deg,#dc2626_0%,#991b1b_100%)]">
        {/* Overlay with grain pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')`
        }}></div>

        <div className="container mx-auto px-5 pt-24 pb-12 relative z-10 max-w-[1200px]">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="animate-slideInLeft text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                        DOJO BIOKEMPO <span className="text-white text-shadow">KEMPO KARATE</span>
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Tradición, excelencia y formación de campeones nacionales. Entrena con la familia más destacada del Kempo en Chile
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button 
                            className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            onClick={() => contactWhatsApp('¡Hola! Me interesa comenzar mi entrenamiento en el Dojo Valenzuela. ¿Podrían darme más información sobre las clases disponibles?')}
                        >
                            Comenzar Entrenamiento
                        </button>
                        <button 
                            className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer"
                            onClick={() => scrollToSection('nosotros')}
                        >
                            Conocer Más
                        </button>
                    </div>
                </div>

                <div className="flex justify-center items-center animate-slideInRight">
                    <div className="text-[15rem] text-white/10 animate-float">
                        <FaFistRaised />
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
