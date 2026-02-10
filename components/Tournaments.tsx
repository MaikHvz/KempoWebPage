'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { getTournaments, Tournament } from '@/lib/tournamentService';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await getTournaments();
      setTournaments(data);
    };
    fetchTournaments();
  }, []);

  const getBgColor = (index: number) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-dark-gray'];
    return colors[index % colors.length];
  };

  return (
    <section id="torneos" className="py-24 bg-light-gray">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <h2 className="text-4xl text-center mb-12 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Próximos Torneos y Competencias
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
            {tournaments.map((tournament, index) => (
                <div key={tournament.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                    <div className={`${getBgColor(index)} p-4 text-center text-white`}>
                        <span className="block text-4xl font-bold">{tournament.day}</span>
                        <span className="block text-sm font-bold tracking-widest">{tournament.month}</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-4 text-secondary">{tournament.title}</h3>
                        <div className="space-y-2 mb-6 text-gray-600 text-sm">
                            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary" /> {tournament.location}</p>
                            <p className="flex items-center gap-2"><FaClock className="text-primary" /> {tournament.time}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tournament.categories.map((cat, idx) => (
                                <span key={idx} className="bg-light-gray text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{cat}</span>
                            ))}
                        </div>
                        <p className="mt-auto text-sm italic text-gray-500 border-t pt-4">
                            <strong>{tournament.description}</strong>
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
