'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaUserCircle, FaWhatsapp, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChild, FaUser } from 'react-icons/fa';

interface Subscription {
  id: string;
  status: 'active' | 'expired' | 'pending_payment';
  end_date: string;
  user_id: string;
  beneficiary_id: string | null;
  profiles: {
      full_name: string;
      email: string;
      avatar_url: string | null;
  };
  beneficiaries: {
      full_name: string;
      relationship: string;
  } | null;
  memberships: {
    name: string;
    price: number;
  };
}

export default function StudentsTable({ initialSubscriptions }: { initialSubscriptions: Subscription[] }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState('');

  const handleApprovePayment = async (subscriptionId: string) => {
    if (!confirm('¿Confirmas que recibiste el pago para esta suscripción?')) return;

    setLoadingMap(prev => ({ ...prev, [subscriptionId]: true }));
    try {
        const { error: subError } = await supabase
            .from('student_subscriptions')
            .update({ status: 'active' })
            .eq('id', subscriptionId);
        
        if (subError) throw subError;

        setSubscriptions(prev => prev.map(sub => 
            sub.id === subscriptionId ? { ...sub, status: 'active' } : sub
        ));

        alert('Pago verificado y suscripción activada.');

    } catch (error: any) {
        alert('Error: ' + error.message);
    } finally {
        setLoadingMap(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
        active: { color: 'bg-green-100 text-green-700 border-green-200', text: 'AL DÍA', icon: FaCheckCircle },
        pending_payment: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'PENDIENTE PAGO', icon: FaExclamationCircle },
        expired: { color: 'bg-red-100 text-red-700 border-red-200', text: 'VENCIDO', icon: FaTimesCircle },
    };

    const config = statusConfig[status] || statusConfig.expired;
    const Icon = config.icon;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${config.color}`}>
            <Icon /> {config.text}
        </span>
    );
  };

  const filteredSubs = subscriptions.filter(sub => {
      const search = filter.toLowerCase();
      const studentName = sub.beneficiaries?.full_name || sub.profiles?.full_name || '';
      return studentName.toLowerCase().includes(search) || sub.profiles?.email?.toLowerCase().includes(search);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
            <input 
                type="text" 
                placeholder="Buscar alumno..." 
                className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Alumno</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Estado</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Plan</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Vence</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubs.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-gray-500">
                       No hay alumnos registrados aún.
                   </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => {
                  const isBeneficiary = !!sub.beneficiary_id;
                  const name = isBeneficiary ? sub.beneficiaries?.full_name : sub.profiles?.full_name;
                  const relationship = isBeneficiary ? sub.beneficiaries?.relationship : 'Titular';
                  const avatar = sub.profiles?.avatar_url;

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {avatar ? (
                                    <img src={avatar} alt={name || ''} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <FaUserCircle size={24} />
                                    </div>
                                )}
                                {isBeneficiary && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 text-[8px] border-2 border-white" title="Beneficiario">
                                        <FaChild size={8}/>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-gray-800">{name || 'Sin Nombre'}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    {isBeneficiary ? (
                                        <>
                                            <span className="bg-blue-100 text-blue-700 px-1.5 rounded-[4px]">{relationship}</span>
                                            <span>de {sub.profiles?.full_name}</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-400">Titular ({sub.profiles?.email})</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                            {getStatusBadge(sub.status)}
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm">
                                <p className="font-semibold text-gray-700">{sub.memberships?.name || 'Plan Eliminado'}</p>
                                <p className="text-xs text-gray-400">${sub.memberships?.price.toLocaleString('es-CL')}</p>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`text-sm ${sub.status === 'expired' ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                                {new Date(sub.end_date).toLocaleDateString()}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end items-center gap-2">
                               {sub.status === 'pending_payment' && (
                                    <button 
                                        onClick={() => handleApprovePayment(sub.id)}
                                        disabled={loadingMap[sub.id]}
                                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loadingMap[sub.id] ? '...' : 'Aprobar Pago'}
                                    </button>
                                )}
                           </div>
                        </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}
