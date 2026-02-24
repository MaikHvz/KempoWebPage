'use client';

import { useState } from 'react';
import { FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
import { contactWhatsApp } from '../utils';
import { toast } from 'sonner';

export default function Contact() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.warning('Por favor ingresa tu nombre.');
      return;
    }
    if (!mensaje.trim()) {
      toast.warning('Por favor escribe un mensaje.');
      return;
    }
    const whatsappMessage = `Hola mi nombre es ${nombre.trim()}. ${mensaje.trim()}`;
    contactWhatsApp(whatsappMessage);
  };

  return (
    <section id="contacto" className="py-24 bg-dark-gray text-white relative overflow-hidden">
      <div className="container mx-auto px-5 max-w-[1200px] relative z-10">
        <h2 className="text-4xl text-center mb-4 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Únete a Nosotros
        </h2>
        <p className="text-center text-xl text-gray-400 mb-16 max-w-[600px] mx-auto">
            Estamos listos para recibirte. ¡Contáctanos hoy mismo!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <div className="flex items-start gap-6">
                    <div className="bg-primary p-4 rounded-full text-2xl">
                        <FaWhatsapp />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-2">WhatsApp</h4>
                        <p className="text-gray-400 mb-2">Respuesta rápida para consultas</p>
                        <button 
                            onClick={() => contactWhatsApp('Hola, quisiera más información sobre las clases.')}
                            className="text-primary hover:text-white transition-colors font-semibold cursor-pointer"
                        >
                            +56 9 8765 4321
                        </button>
                    </div>
                </div>

                <div className="flex items-start gap-6">
                    <div className="bg-primary p-4 rounded-full text-2xl">
                        <FaMapMarkerAlt />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-2">Ubicación</h4>
                        <p className="text-gray-400">Av. Principal 1234, Comuna, Santiago</p>
                        <p className="text-sm text-gray-500 mt-1">A pasos del Metro [Estación]</p>
                    </div>
                </div>

                <div className="flex items-start gap-6">
                    <div className="bg-primary p-4 rounded-full text-2xl">
                        <FaEnvelope />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-2">Email</h4>
                        <p className="text-gray-400">contacto@dojovalenzuela.cl</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-700">
                    <h4 className="text-xl font-bold mb-6">Síguenos en Redes Sociales</h4>
                    <div className="flex gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-full hover:bg-primary hover:-translate-y-1 transition-all duration-300 text-2xl">
                            <FaInstagram />
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-full hover:bg-primary hover:-translate-y-1 transition-all duration-300 text-2xl">
                            <FaFacebook />
                        </a>
                    </div>
                </div>
            </div>

            <form className="bg-white p-8 rounded-2xl text-secondary space-y-6" onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold mb-2">Envíanos un Mensaje</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">Nombre</label>
                        <input 
                          type="text" 
                          className="w-full bg-light-gray border-none p-4 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" 
                          placeholder="Tu nombre"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">Teléfono</label>
                        <input type="tel" className="w-full bg-light-gray border-none p-4 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="+56 9..." />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Mensaje</label>
                    <textarea 
                      className="w-full bg-light-gray border-none p-4 rounded-lg h-32 resize-none focus:ring-2 focus:ring-primary outline-none transition-all" 
                      placeholder="¿En qué podemos ayudarte?"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg cursor-pointer">
                    Enviar Mensaje
                </button>
            </form>
        </div>
      </div>
    </section>
  );
}

