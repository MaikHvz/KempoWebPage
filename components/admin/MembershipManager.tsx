'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaPlus, FaMoneyBillWave, FaToggleOn, FaToggleOff, FaEdit } from 'react-icons/fa';

interface Membership {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  description: string;
  is_active: boolean;
}

export default function MembershipManager({ initialMemberships }: { initialMemberships: Membership[] }) {
  const [memberships, setMemberships] = useState<Membership[]>(initialMemberships);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // Track editing ID
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_months: '1',
    description: '',
  });

  const resetForm = () => {
      setFormData({ name: '', price: '', duration_months: '1', description: '' });
      setEditingId(null);
      setIsCreating(false);
  };

  const handleEditClick = (plan: Membership) => {
      setFormData({
          name: plan.name,
          price: plan.price.toString(),
          duration_months: plan.duration_months.toString(),
          description: plan.description || '',
      });
      setEditingId(plan.id);
      setIsCreating(true);
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        // UPDATE existing plan
        const { data, error } = await supabase
            .from('memberships')
            .update({
                name: formData.name,
                price: parseInt(formData.price),
                duration_months: parseInt(formData.duration_months),
                description: formData.description,
            })
            .eq('id', editingId)
            .select()
            .single();

        if (error) throw error;

        setMemberships(memberships.map(m => m.id === editingId ? data : m));
        alert('Plan actualizado correctamente');

      } else {
        // CREATE new plan
        const { data, error } = await supabase
            .from('memberships')
            .insert([{
                name: formData.name,
                price: parseInt(formData.price),
                duration_months: parseInt(formData.duration_months),
                description: formData.description,
                is_active: true
            }])
            .select()
            .single();

        if (error) throw error;
        setMemberships([...memberships, data]);
        alert('Plan creado correctamente');
      }
      
      resetForm();

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('memberships')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setMemberships(memberships.map(m => 
        m.id === id ? { ...m, is_active: !currentStatus } : m
      ));
    } catch (error: any) {
      alert('Error updating status: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Planes y Membresías</h2>
          <p className="text-gray-500">Configura los precios y planes disponibles para los alumnos.</p>
        </div>
        <button 
          onClick={() => {
              if (isCreating) resetForm();
              else setIsCreating(true);
          }}
          className={`px-6 py-3 rounded-xl shadow-lg transition-colors font-bold flex items-center gap-2 ${
              isCreating ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-primary text-white hover:bg-black'
          }`}
        >
          <FaPlus className={isCreating ? 'rotate-45 transition-transform' : 'transition-transform'} /> 
          {isCreating ? 'Cancelar' : 'Nuevo Plan'}
        </button>
      </div>

      {/* Creation/Edit Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-primary/20 animate-in slide-in-from-top-4">
            <h3 className="font-bold text-lg mb-4 text-gray-700">
                {editingId ? 'Editar Plan' : 'Crear Nuevo Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre del Plan</label>
                    <input 
                        type="text" 
                        required
                        placeholder="Ej: Plan Mensual Adultos"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Precio (CLP)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input 
                            type="number" 
                            required
                            placeholder="35000"
                            className="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Duración (Meses)</label>
                    <select 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.duration_months}
                        onChange={e => setFormData({...formData, duration_months: e.target.value})}
                    >
                        <option value="1">1 Mes</option>
                        <option value="3">3 Meses (Trimestral)</option>
                        <option value="6">6 Meses (Semestral)</option>
                        <option value="12">12 Meses (Anual)</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Descripción / Beneficios</label>
                    <textarea 
                        rows={2}
                        placeholder="Incluye 3 clases semanales y acceso al gimnasio..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : (editingId ? 'Actualizar Plan' : 'Guardar Plan')}
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Plans List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberships.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-300" />
                <p>No hay planes creados aún.</p>
            </div>
        ) : (
            memberships.map((plan) => (
                <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border p-6 relative group transition-all hover:shadow-md ${!plan.is_active ? 'opacity-60 grayscale' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                            {plan.duration_months} {plan.duration_months === 1 ? 'Mes' : 'Meses'}
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleEditClick(plan)}
                                className="text-gray-400 hover:text-blue-500 transition-colors bg-gray-100 p-2 rounded-full"
                                title="Editar Plan"
                            >
                                <FaEdit className="text-sm" /> 
                            </button>
                            <button 
                                onClick={() => toggleStatus(plan.id, plan.is_active)}
                                className={`text-2xl transition-colors ${plan.is_active ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-green-500'}`}
                                title={plan.is_active ? 'Desactivar Plan' : 'Activar Plan'}
                            >
                                {plan.is_active ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
                    <div className="text-3xl font-extrabold text-gray-900 mb-4">
                        ${plan.price.toLocaleString('es-CL')}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                        {plan.description || 'Sin descripción'}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-400">
                        <span>ID: {plan.id.slice(0, 8)}...</span>
                        <span>{plan.is_active ? 'Activo' : 'Inactivo'}</span>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
