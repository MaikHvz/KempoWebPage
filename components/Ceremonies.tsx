'use client';

import { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaMedal } from 'react-icons/fa';
import { contactWhatsApp } from '../utils';
import { getCeremony, Ceremony } from '@/lib/dataService';

export default function Ceremonies() {
  const [ceremony, setCeremony] = useState<Ceremony | null>(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const updateCeremony = () => {
      const ceremonyData = getCeremony();
      console.log('Ceremonia actualizada:', ceremonyData);
      console.log('Cinturones:', ceremonyData?.attendingBelts);
      setCeremony(ceremonyData);
      setDebugInfo(`Última actualización: ${new Date().toLocaleTimeString()} - Cinturones: ${JSON.stringify(ceremonyData?.attendingBelts || [])}`);
    };
    
    updateCeremony(); // Carga inicial

    // Listener para cambios en localStorage desde otras pestañas
    window.addEventListener('storage', updateCeremony);
    
    // Listener personalizado para cambios en la misma pestaña
    window.addEventListener('ceremonyUpdate', updateCeremony);

    return () => {
      window.removeEventListener('storage', updateCeremony);
      window.removeEventListener('ceremonyUpdate', updateCeremony);
    };
  }, []);

  if (!ceremony) return null;

  return (
    <section id="ceremonias" className="py-24 bg-white">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <h2 className="text-4xl text-center mb-12 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Ceremonias, Graduaciones y Seminarios
        </h2>
        
        <div className="bg-light-gray rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2">
            <div className="p-10 md:p-14">
                <h3 className="text-2xl font-bold mb-8 text-secondary">Próxima Ceremonia de Graduación</h3>
                
                <div className="space-y-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm text-xl shrink-0">
                            <FaCalendar />
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Fecha</span>
                            <span className="font-bold text-lg">{ceremony.date}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm text-xl shrink-0">
                            <FaClock />
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Hora</span>
                            <span className="font-bold text-lg">{ceremony.time}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm text-xl shrink-0">
                            <FaMapMarkerAlt />
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Ubicación</span>
                            <span className="font-bold text-lg">{ceremony.location}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <h4 className="font-bold mb-4">Cinturones Convocados:</h4>
                    <div className="flex flex-wrap gap-2">
                        {ceremony.attendingBelts && ceremony.attendingBelts.length > 0 ? (
                            ceremony.attendingBelts.map(belt => (
                                <span key={belt} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                                    {belt}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No se han especificado cinturones para esta ceremonia.</p>
            )}
          </div>

          <div className="mb-4">
            <button
              onClick={() => {
                const freshData = getCeremony();
                console.log('Forzando actualización manual...', freshData);
                setCeremony(freshData);
                setDebugInfo(`Actualización forzada: ${new Date().toLocaleTimeString()} - Cinturones: ${JSON.stringify(freshData?.attendingBelts || [])}`);
              }}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              Actualizar Datos
            </button>
          </div>
                </div>

                {ceremony.description && (
                  <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary mb-8 text-sm leading-relaxed text-gray-700">
                      {ceremony.description}
                  </div>
                )}

                <button 
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                    onClick={() => contactWhatsApp('¡Hola! Me interesa confirmar mi asistencia a la próxima ceremonia de graduación del Dojo Valenzuela. ¿Podrían darme más detalles sobre el evento?')}
                >
                    Confirmar mi Asistencia
                </button>

                {debugInfo && (
                  <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
                    {debugInfo}
                  </div>
                )}
            </div>
            
            <div className="bg-secondary relative min-h-[300px] flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')`
                }}></div>
                <div className="text-[15rem] text-white/10">
                    <FaMedal />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                        <FaMedal className="text-6xl text-gold mb-4 mx-auto animate-bounce" />
                        <h3 className="text-3xl font-bold text-white mb-2">Excelencia Marcial</h3>
                        <p className="text-white/80">Reconociendo el esfuerzo y la disciplina</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
