'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaUserPlus, FaUser, FaChild } from 'react-icons/fa';

interface Beneficiary {
    id: string;
    full_name: string;
    relationship: string;
}

interface BeneficiaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (beneficiaryId: string | null) => void;
    planName: string;
}

export default function BeneficiaryModal({ isOpen, onClose, onSelect, planName }: BeneficiaryModalProps) {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'create'>('list');
    const [newBen, setNewBen] = useState({ full_name: '', relationship: '', birth_date: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchBeneficiaries();
        }
    }, [isOpen]);

    const fetchBeneficiaries = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('beneficiaries')
                .select('*')
                .eq('user_id', user.id);
            setBeneficiaries(data || []);
        }
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user");

            const { data, error } = await supabase
                .from('beneficiaries')
                .insert([{
                    user_id: user.id,
                    full_name: newBen.full_name,
                    relationship: newBen.relationship,
                    birth_date: newBen.birth_date || null
                }])
                .select()
                .single();

            if (error) throw error;
            
            setBeneficiaries([...beneficiaries, data]);
            setView('list');
            setNewBen({ full_name: '', relationship: '', birth_date: '' });
        } catch (error: any) {
            alert('Error creando beneficiario: ' + error.message);
        } finally {
            setCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-primary p-6 text-white text-center">
                    <h3 className="text-xl font-bold">¿Para quién es el plan?</h3>
                    <p className="text-white/80 text-sm">{planName}</p>
                </div>
                
                <div className="p-6">
                    {view === 'list' ? (
                        <div className="space-y-3">
                            <button 
                                onClick={() => onSelect(null)}
                                className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary transition-all group"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <FaUser />
                                </div>
                                <div className="ml-3 text-left">
                                    <span className="block font-bold text-gray-800">Para Mí</span>
                                    <span className="text-xs text-gray-500">Soy el alumno</span>
                                </div>
                            </button>

                            {loading ? (
                                <p className="text-center text-sm text-gray-400 py-2">Cargando...</p>
                            ) : beneficiaries.map((ben) => (
                                <button 
                                    key={ben.id}
                                    onClick={() => onSelect(ben.id)}
                                    className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-primary transition-all group"
                                >
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FaChild />
                                    </div>
                                    <div className="ml-3 text-left">
                                        <span className="block font-bold text-gray-800">{ben.full_name}</span>
                                        <span className="text-xs text-gray-500">{ben.relationship}</span>
                                    </div>
                                </button>
                            ))}

                            <button 
                                onClick={() => setView('create')}
                                className="w-full flex items-center justify-center gap-2 p-3 text-primary font-bold hover:bg-gray-50 rounded-xl transition-colors mt-2"
                            >
                                <FaUserPlus /> Agregar nuevo familiar
                            </button>
                            
                            <button onClick={onClose} className="w-full text-center text-gray-400 text-sm mt-4 hover:text-gray-600">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    value={newBen.full_name}
                                    onChange={e => setNewBen({...newBen, full_name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
                                    <select 
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                                        value={newBen.relationship}
                                        onChange={e => setNewBen({...newBen, relationship: e.target.value})}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Hijo/a">Hijo/a</option>
                                        <option value="Esposo/a">Esposo/a</option>
                                        <option value="Hermano/a">Hermano/a</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nac.</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                                        value={newBen.birth_date}
                                        onChange={e => setNewBen({...newBen, birth_date: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setView('list')}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Volver
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={creating}
                                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
                                >
                                    {creating ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
