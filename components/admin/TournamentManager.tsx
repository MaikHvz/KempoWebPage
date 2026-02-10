'use client';

import { useState, useEffect } from 'react';
import { Tournament, getAllTournaments, createTournament, updateTournament, deleteTournament } from '@/lib/tournamentService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

export default function TournamentManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTournament, setCurrentTournament] = useState<Partial<Tournament>>({
    day: '',
    month: '',
    title: '',
    location: '',
    time: '',
    categories: [],
    description: '',
    published: true
  });
  const [categoriesInput, setCategoriesInput] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await getAllTournaments();
      setTournaments(data);
    };
    fetchTournaments();
  }, []);

  const handleCreate = () => {
    setCurrentTournament({
      day: '',
      month: '',
      title: '',
      location: '',
      time: '',
      categories: [],
      description: '',
      published: true
    });
    setCategoriesInput('');
    setIsEditing(true);
  };

  const handleEdit = (tournament: Tournament) => {
    setCurrentTournament(tournament);
    setCategoriesInput(tournament.categories.join(', '));
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este torneo?')) {
      const success = await deleteTournament(id);
      if (success) {
        const updatedTournaments = await getAllTournaments();
        setTournaments(updatedTournaments);
      } else {
        alert('Error al eliminar el torneo');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoriesArray = categoriesInput.split(',').map(c => c.trim()).filter(c => c.length > 0);
    
    const tournamentData = {
      ...currentTournament,
      categories: categoriesArray
    } as Tournament;

    if (!tournamentData.title || !tournamentData.day || !tournamentData.month) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    let success = false;
    if (currentTournament.id) {
      const result = await updateTournament(currentTournament.id, tournamentData);
      success = result !== null;
    } else {
      const result = await createTournament(tournamentData);
      success = result !== null;
    }

    if (success) {
      const updatedTournaments = await getAllTournaments();
      setTournaments(updatedTournaments);
      setIsEditing(false);
    } else {
      alert('Error al guardar el torneo');
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">
            {currentTournament.id ? 'Editar Torneo' : 'Nuevo Torneo'}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-primary transition-colors cursor-pointer"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Día (ej: 15)</label>
              <input
                type="text"
                value={currentTournament.day}
                onChange={e => setCurrentTournament({ ...currentTournament, day: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mes (ej: MAR)</label>
              <input
                type="text"
                value={currentTournament.month}
                onChange={e => setCurrentTournament({ ...currentTournament, month: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={currentTournament.title}
              onChange={e => setCurrentTournament({ ...currentTournament, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ubicación</label>
              <input
                type="text"
                value={currentTournament.location}
                onChange={e => setCurrentTournament({ ...currentTournament, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Horario</label>
              <input
                type="text"
                value={currentTournament.time}
                onChange={e => setCurrentTournament({ ...currentTournament, time: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Categorías (separadas por coma)</label>
            <input
              type="text"
              value={categoriesInput}
              onChange={e => setCategoriesInput(e.target.value)}
              placeholder="Juvenil, Adulto, Senior"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea
              value={currentTournament.description}
              onChange={e => setCurrentTournament({ ...currentTournament, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
            <select
              value={currentTournament.published !== undefined ? currentTournament.published.toString() : 'true'}
              onChange={e => setCurrentTournament({ ...currentTournament, published: e.target.value === 'true' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="true">Publicado</option>
              <option value="false">Borrador</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FaSave /> Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary">Gestión de Torneos</h2>
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FaPlus /> Nuevo Torneo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tournaments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-primary">{item.day} {item.month}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                      title="Editar"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      title="Eliminar"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
              {tournaments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay torneos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}