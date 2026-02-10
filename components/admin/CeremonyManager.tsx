'use client';

import { useState, useEffect } from 'react';
import { Ceremony, getCeremony, saveCeremony } from '@/lib/dataService';
import { FaSave } from 'react-icons/fa';

const BELTS = [
  'Blanco', 'Amarillo', 'Naranja', 'Morado', 'Azul', 'Verde', 'Café', 'Negro'
];

export default function CeremonyManager() {
  const [ceremony, setCeremony] = useState<Ceremony | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadedCeremony = getCeremony();
    // Ensure attendingBelts exists with default value
    if (loadedCeremony && !loadedCeremony.attendingBelts) {
      loadedCeremony.attendingBelts = [];
    }
    setCeremony(loadedCeremony);
  }, []);

  const handleBeltChange = (belt: string) => {
    if (!ceremony) return;
    const attendingBelts = ceremony.attendingBelts || [];
    const updatedBelts = attendingBelts.includes(belt)
      ? attendingBelts.filter(b => b !== belt)
      : [...attendingBelts, belt];
    setCeremony({ ...ceremony, attendingBelts: updatedBelts });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ceremony) {
      saveCeremony(ceremony);
      setMessage('Información actualizada correctamente');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!ceremony) return <div>Cargando...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-secondary mb-8">Gestión de Ceremonia</h2>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fecha</label>
              <input
                type="text"
                value={ceremony.date}
                onChange={e => setCeremony({ ...ceremony, date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                placeholder="Ej: Sábado 28 de Marzo, 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Horario</label>
              <input
                type="text"
                value={ceremony.time}
                onChange={e => setCeremony({ ...ceremony, time: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                placeholder="Ej: 17:00 - 20:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ubicación</label>
            <input
              type="text"
              value={ceremony.location}
              onChange={e => setCeremony({ ...ceremony, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cinturones Convocados</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
              {BELTS.map(belt => (
                <label key={belt} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(ceremony.attendingBelts || []).includes(belt)}
                    onChange={() => handleBeltChange(belt)}
                    className="h-4 w-4 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{belt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción / Notas Adicionales</label>
            <textarea
              value={ceremony.description || ''}
              onChange={e => setCeremony({ ...ceremony, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-32"
            />
          </div>

          {message && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center font-medium">
              {message}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                console.log('Ceremonia actual:', ceremony);
                console.log('Cinturones:', ceremony?.attendingBelts);
                alert(`Cinturones guardados: ${JSON.stringify(ceremony?.attendingBelts || [])}`);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Ver Cinturones Actuales
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-bold cursor-pointer shadow-lg"
            >
              <FaSave /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}