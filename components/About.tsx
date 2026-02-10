'use client';

import { useEffect, useRef, useState } from 'react';
import { FaMedal, FaDumbbell, FaTrophy, FaUsers } from 'react-icons/fa';

const stats = [
  { number: 30, label: 'Años de Experiencia' },
  { number: 500, label: 'Alumnos Formados' },
  { number: 50, label: 'Campeones Nacionales' },
  { number: 15, label: 'Títulos Internacionales' },
];

const specialties = [
  {
    icon: FaMedal,
    title: 'Kempo Karate Tradicional',
    description: 'Enseñanza auténtica del Kempo con técnicas tradicionales y filosofía marcial profunda.'
  },
  {
    icon: FaDumbbell,
    title: 'Entrenamiento Funcional',
    description: 'Preparación física adaptada específicamente al Kempo y al combate moderno.'
  },
  {
    icon: FaTrophy,
    title: 'Formación de Campeones',
    description: 'Preparación de alumnos seleccionados para competencias nacionales e internacionales.'
  },
  {
    icon: FaUsers,
    title: 'Experiencia Familiar',
    description: 'Más de 30 años de trayectoria de la familia Valenzuela en el Kempo chileno.'
  }
];

export default function About() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          stats.forEach((stat, index) => {
            let start = 0;
            const end = stat.number;
            const duration = 2000;
            const increment = end / (duration / 16);
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                start = end;
                clearInterval(timer);
              }
              setCounts(prev => {
                const newCounts = [...prev];
                newCounts[index] = Math.floor(start);
                return newCounts;
              });
            }, 16);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="nosotros" className="py-24 bg-light-gray">
      <div className="container  mx-auto px-5 max-w-[1200px]">
        <h2 className="text-4xl text-center mb-12 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Sobre Nuestro Dojo
        </h2>
        
        <div className=" lg:grid-cols-[2fr_1fr]
">
            <div>
                <h3 className="text-3xl mb-6 text-secondary font-bold">La Tradición Valenzuela en el Kempo Karate</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    El Dojo Valenzuela representa décadas de excelencia en el Kempo Karate chileno. Nuestra familia ha sido pionera en el desarrollo y perfeccionamiento de las artes marciales en Chile, formando campeones nacionales y transmitiendo los valores fundamentales del Kempo.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                    {specialties.map((item, index) => (
                        <div key={index} className="flex  gap-4 p-6 bg-white rounded-2xl shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <item.icon className="text-primary text-3xl mt-1 shrink-0" />
                            <div>
                                <h4 className="text-secondary font-bold mb-2 text-lg">{item.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                        <div className="text-5xl font-bold text-primary mb-2">
                            {counts[index]}+
                        </div>
                        <div className="text-secondary font-semibold">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
