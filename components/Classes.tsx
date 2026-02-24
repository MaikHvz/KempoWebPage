'use client';

import { FaUsers, FaUser, FaLaptop, FaGift, FaMedal, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { contactWhatsApp } from '../utils';

export default function Classes() {
  return (
    <section id="clases" className="py-24 bg-white">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <h2 className="text-4xl text-center mb-12 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Nuestras Modalidades de Entrenamiento
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Clases Presenciales */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-5 right-[-35px] bg-primary text-white py-1 px-10 rotate-45 text-sm font-bold shadow-md z-10">
                    Más Popular
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <FaUsers />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-secondary">Clases Presenciales</h3>
                <p className="text-gray-600 mb-6">
                    Entrena en nuestro dojo con la supervisión directa de los maestros Valenzuela. Experiencia completa de formación marcial.
                </p>
                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Entrenamiento grupal motivador</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Corrección técnica personalizada</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Ambiente tradicional del dojo</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Sparring y práctica con compañeros</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Acceso a equipamiento profesional</li>
                </ul>
                <div className="bg-light-gray p-4 rounded-xl mb-8">
                    <h4 className="font-bold text-secondary mb-2">Horarios Disponibles:</h4>
                    <p className="text-sm text-gray-600">Lun-Vie: 18:00 - 21:00<br/>Sábados: 09:00 - 12:00</p>
                </div>
                <Link 
                    href="/planes"
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors cursor-pointer block text-center"
                >
                    Inscribirme Ahora
                </Link>
            </div>

            {/* Clases Personalizadas */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <FaUser />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-secondary">Clases Personalizadas</h3>
                <p className="text-gray-600 mb-6">
                    Entrenamiento individual adaptado a tus objetivos específicos. Ideal para competidores y perfeccionamiento técnico.
                </p>
                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Atención 100% personalizada</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Programa adaptado a tus metas</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Horarios flexibles</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Progreso acelerado</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Preparación para competencias</li>
                </ul>
                <div className="bg-light-gray p-4 rounded-xl mb-8">
                    <h4 className="font-bold text-secondary mb-2">Modalidades:</h4>
                    <p className="text-sm text-gray-600">Presencial o Online<br/>Horarios coordinados</p>
                </div>
                <button 
                    className="w-full bg-transparent border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    onClick={() => contactWhatsApp('¡Hola! Me gustaría solicitar una clase personalizada. ¿Qué horarios tienen disponibles?')}
                >
                    Consultar Disponibilidad
                </button>
            </div>

            {/* Clases Online */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <FaLaptop />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-secondary">Clases Online</h3>
                <p className="text-gray-600 mb-6">
                    Entrena desde cualquier lugar con nuestras clases virtuales en vivo. Mantén tu disciplina sin importar la distancia.
                </p>
                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Clases en vivo interactivas</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Acceso desde cualquier lugar</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Grabaciones para repasar</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Seguimiento personalizado</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="w-2 h-2 bg-primary rounded-full"></span> Comunidad virtual activa</li>
                </ul>
                <div className="bg-light-gray p-4 rounded-xl mb-8">
                    <h4 className="font-bold text-secondary mb-2">Horarios Online:</h4>
                    <p className="text-sm text-gray-600">Mar-Jue: 19:00 - 20:00<br/>Sábados: 10:00 - 11:00</p>
                </div>
                <button 
                    className="w-full bg-transparent border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    onClick={() => contactWhatsApp('¡Hola! Me gustaría solicitar una clase online. ¿Qué horarios tienen disponibles?')}
                >
                    Probar Clase Gratis
                </button>
            </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-secondary rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar tu transformación?</h3>
                <p className="text-xl text-gray-300 mb-8 max-w-[600px] mx-auto">
                    Únete a la tradición Valenzuela y descubre tu potencial en el Kempo Karate
                </p>
                
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                    <div className="flex items-center gap-2">
                        <FaGift className="text-primary text-xl" />
                        <span>Clase de prueba gratuita</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-primary text-xl" />
                        <span>Grupos reducidos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMedal className="text-primary text-xl" />
                        <span>Instructores certificados</span>
                    </div>
                </div>

                <Link 
                    href="/planes"
                    className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
                >
                    Inscríbete aquí
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
