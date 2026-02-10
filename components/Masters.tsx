'use client';

import Image from 'next/image';
import { FaStar, FaMedal, FaTrophy, FaGlobe, FaGraduationCap, FaUsers, FaCertificate, FaYinYang, FaHeart, FaChalkboardTeacher, FaFlag, FaShieldAlt, FaAward } from 'react-icons/fa';

export default function Masters() {
  return (
    <section id="maestros" className="py-24 bg-white">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <h2 className="text-4xl text-center mb-4 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Nuestros Maestros
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12 max-w-[600px] mx-auto">
            Conoce a los expertos que guiarán tu camino en el Kempo Karate
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Master 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 border-2 border-primary transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative h-[300px] bg-gray-200 overflow-hidden group">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                        {/* Placeholder for image */}
                        <span className="text-6xl"><FaUsers /></span>
                    </div>
                    <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <FaStar />
                        <span>Maestro Principal</span>
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-3xl text-secondary font-bold mb-2">Maestro Juan Valenzuela Jr</h3>
                    <p className="text-primary font-semibold mb-4 text-lg">Fundador y Director del Dojo</p>
                    <div className="flex items-center gap-2 bg-light-gray p-3 rounded-lg mb-6 font-semibold text-secondary w-fit">
                        <FaMedal className="text-gold text-xl" />
                        <span>5° Dan Cinturón Negro</span>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-secondary font-bold mb-4 text-lg">Trayectoria Destacada:</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-gray-600"><FaTrophy className="text-primary mt-1" /> Campeón Nacional de Kempo (2000-2xxx)</li>
                            <li className="flex gap-3 text-gray-600"><FaGlobe className="text-primary mt-1" /> Representante de Chile en 2 mundiales</li>
                            <li className="flex gap-3 text-gray-600"><FaGraduationCap className="text-primary mt-1" /> Más de 15 años enseñando</li>
                            <li className="flex gap-3 text-gray-600"><FaUsers className="text-primary mt-1" /> Formador de 15 campeones nacionales</li>
                            <li className="flex gap-3 text-gray-600"><FaCertificate className="text-primary mt-1" /> Certificado por la Federación Mundial de Kempo</li>
                        </ul>
                    </div>

                    <div className="bg-light-gray p-6 border-l-4 border-primary rounded-r-lg italic text-gray-700">
                        <p>"El Kempo no es solo técnica, es disciplina, respeto y superación personal. Cada alumno es único y merece una enseñanza personalizada."</p>
                    </div>
                </div>
            </div>

            {/* Master 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 border-2 border-transparent hover:border-transparent transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative h-[300px] bg-gray-200 overflow-hidden group">
                    <div className="w-full h-full relative">
                         <Image 
                            src="/placeholder.svg" 
                            alt="Maestro John Valenzuela" 
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <FaStar />
                        <span>Maestro Asociado</span>
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-3xl text-secondary font-bold mb-2">Maestro John Valenzuela</h3>
                    <p className="text-primary font-semibold mb-4 text-lg">Especialista en Combate, Jiujitsu y Técnicas Tradicionales</p>
                    <div className="flex items-center gap-2 bg-light-gray p-3 rounded-lg mb-6 font-semibold text-secondary w-fit">
                        <FaMedal className="text-gold text-xl" />
                        <span>Cinturón Negro</span>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-secondary font-bold mb-4 text-lg">Especialidades:</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-gray-600"><FaYinYang className="text-primary mt-1" /> Katas tradicionales y modernas</li>
                            <li className="flex gap-3 text-gray-600"><FaHeart className="text-primary mt-1" /> Entrenamiento para niños, jóvenes y adultos</li>
                            <li className="flex gap-3 text-gray-600"><FaTrophy className="text-primary mt-1" /> x veces campeon nacional de combate</li>
                            <li className="flex gap-3 text-gray-600"><FaChalkboardTeacher className="text-primary mt-1" /> 5 años de experiencia docente</li>
                            <li className="flex gap-3 text-gray-600"><FaFlag className="text-primary mt-1" /> Pionero del Kempo en Chile</li>
                        </ul>
                    </div>

                    <div className="bg-light-gray p-6 border-l-4 border-primary rounded-r-lg italic text-gray-700">
                        <p>"La precisión y la gracia en cada movimiento reflejan el alma del Kempo. Enseño a mis alumnos a encontrar su equilibrio interior."</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-light-gray p-12 rounded-3xl text-center">
            <h3 className="text-3xl text-secondary font-bold mb-8">Certificaciones y Reconocimientos</h3>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition-transform duration-300">
                    <FaCertificate className="text-primary text-4xl shrink-0" />
                    <div className="text-left">
                        <h4 className="text-secondary font-bold mb-1">Federación Mundial de Kempo</h4>
                        <p className="text-gray-600 text-sm">Dojo oficialmente reconocido y certificado</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition-transform duration-300">
                    <FaAward className="text-primary text-4xl shrink-0" />
                    <div className="text-left">
                        <h4 className="text-secondary font-bold mb-1">Asociación Chilena de Artes Marciales</h4>
                        <p className="text-gray-600 text-sm">Miembro fundador y activo desde 1990</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition-transform duration-300">
                    <FaShieldAlt className="text-primary text-4xl shrink-0" />
                    <div className="text-left">
                        <h4 className="text-secondary font-bold mb-1">Registro Nacional de Deportes</h4>
                        <p className="text-gray-600 text-sm">Institución deportiva registrada oficialmente</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
