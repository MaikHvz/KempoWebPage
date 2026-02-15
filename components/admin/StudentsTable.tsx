'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaUserCircle, FaWhatsapp, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

interface Student {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  student_subscriptions: Subscription[];
}

interface Subscription {
  id: string;
  status: 'active' | 'expired' | 'pending_payment';
  end_date: string;
  memberships: {
    name: string;
    price: number;
  };
}

export default function StudentsTable({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleApprovePayment = async (subscriptionId: string) => {
    if (!confirm('¿Confirmas que recibiste el pago para esta suscripción?')) return;

    setLoadingMap(prev => ({ ...prev, [subscriptionId]: true }));
    try {
        // 1. Update Subscription Status
        const { error: subError } = await supabase
            .from('student_subscriptions')
            .update({ status: 'active' })
            .eq('id', subscriptionId);
        
        if (subError) throw subError;

        // 2. Refresh local state
        setStudents(prevStudents => prevStudents.map(student => ({
            ...student,
            student_subscriptions: student.student_subscriptions.map(sub => 
                sub.id === subscriptionId ? { ...sub, status: 'active' } : sub
            )
        })));

        alert('Pago verificado y suscripción activada.');

    } catch (error: any) {
        alert('Error: ' + error.message);
    } finally {
        setLoadingMap(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const getLatestSubscription = (subs: Subscription[]) => {
    if (!subs || subs.length === 0) return null;
    // Sort by end_date descending to get the most relevant one
    return subs.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0];
  };

  const getStatusBadge = (sub: Subscription | null) => {
    if (!sub) return <span className="text-gray-400 text-sm">Sin Plan</span>;

    const statusConfig = {
        active: { color: 'bg-green-100 text-green-700 border-green-200', text: 'AL DÍA', icon: FaCheckCircle },
        pending_payment: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'PENDIENTE PAGO', icon: FaExclamationCircle },
        expired: { color: 'bg-red-100 text-red-700 border-red-200', text: 'VENCIDO', icon: FaTimesCircle },
    };

    const config = statusConfig[sub.status] || statusConfig.expired;
    const Icon = config.icon;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${config.color}`}>
            <Icon /> {config.text}
        </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Alumno</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Estado</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Plan Actual</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Vence</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-gray-500">
                       No hay alumnos registrados aún.
                   </td>
                </tr>
              ) : (
                students.map((student) => {
                  const latestSub = getLatestSubscription(student.student_subscriptions);
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            {student.avatar_url ? (
                            <img src={student.avatar_url} alt={student.full_name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <FaUserCircle size={24} />
                            </div>
                            )}
                            <div>
                            <div className="font-bold text-gray-800">{student.full_name || 'Sin Nombre'}</div>
                            <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                            {getStatusBadge(latestSub)}
                        </td>
                        <td className="px-6 py-4">
                            {latestSub ? (
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-700">{latestSub.memberships?.name || 'Plan Eliminado'}</p>
                                    <p className="text-xs text-gray-400">${latestSub.memberships?.price.toLocaleString('es-CL')}</p>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">--</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                             {latestSub ? (
                                <span className="text-sm text-gray-600">
                                    {new Date(latestSub.end_date).toLocaleDateString()}
                                </span>
                            ) : (
                                <span className="text-gray-400 text-sm">N/A</span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end items-center gap-2">
                               <button className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-full transition-colors" title="Contactar Whatsapp">
                                   <FaWhatsapp size={18} />
                                </button>
                                
                                {latestSub?.status === 'pending_payment' && (
                                    <button 
                                        onClick={() => handleApprovePayment(latestSub.id)}
                                        disabled={loadingMap[latestSub.id]}
                                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loadingMap[latestSub.id] ? '...' : 'Aprobar Pago'}
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
