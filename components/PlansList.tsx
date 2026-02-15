'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  description: string;
}

export default function PlansList({ plans }: { plans: Plan[] }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      alert('Debes iniciar sesión para contratar un plan. Por favor, ingresa desde el botón "Acceso Alumnos" en el menú.');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres contratar el plan "${plan.name}"?`)) return;

    setLoading(true);
    try {
        // Calculate end date
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.duration_months);

        const { error } = await supabase
            .from('student_subscriptions')
            .insert([{
                user_id: user.id,
                membership_id: plan.id,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: 'pending_payment',
                payment_method: 'transfer' // Default for now until Stripe
            }]);

        if (error) throw error;

        setSuccessMsg(`¡Solicitud recibida! Para activar tu "${plan.name}", realiza la transferencia y envía el comprobante al instructor.`);
        
        // Scroll to top to see message
        window.scrollTo(0,0);

    } catch (err: any) {
        alert('Error al contratar: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="py-12">
        {successMsg && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 mb-8 rounded shadow-md animate-in slide-in-from-top">
                <p className="font-bold text-lg mb-2">¡Plan Solicitado con Éxito!</p>
                <p>{successMsg}</p>
                <div className="mt-4 bg-white/50 p-4 rounded text-sm">
                    <p className="font-semibold">Datos de Transferencia:</p>
                    <p>Banco Estado</p>
                    <p>Cuenta RUT: 12.345.678-9</p>
                    <p>Nombre: Dojo Valenzuela</p>
                    <p>Email: pagos@dojovalenzuela.cl</p>
                </div>
                <button 
                    onClick={() => setSuccessMsg('')}
                    className="mt-4 text-green-800 underline hover:text-green-900"
                >
                    Entendido, cerrar mensaje
                </button>
            </div>
        )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col">
            <div className="bg-secondary p-6 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FaFistRaisedIcon />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-extrabold text-primary">
                    ${plan.price.toLocaleString('es-CL')}
                </div>
                <p className="text-white/70 text-sm mt-1">
                    por {plan.duration_months} {plan.duration_months === 1 ? 'mes' : 'meses'}
                </p>
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1 mb-6">
                    <p className="text-gray-600 italic mb-4 border-b border-gray-100 pb-4">
                        {plan.description || "Plan completo de entrenamiento Kempo."}
                    </p>
                    
                </div>

                <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading || !!successMsg}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Procesando...' : 'Contratar Plan'}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaFistRaisedIcon() {
    return (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="100" width="100" xmlns="http://www.w3.org/2000/svg">
            <path d="M448 358.4V25.6c0-14.1-11.5-25.6-25.6-25.6H96C43 0 0 43 0 96v320c0 53 43 96 96 96h326.4c14.1 0 25.6-11.5 25.6-25.6v-96c0-15.6-8.2-29.4-20.5-37 12.3-7.6 20.5-21.4 20.5-37zM169 224h-42c-7.2 0-13-5.8-13-13v-42c0-7.2 5.8-13 13-13h42c7.2 0 13 5.8 13 13v42c0 7.2-5.8 13-13 13zm154 0h-42c-7.2 0-13-5.8-13-13v-42c0-7.2 5.8-13 13-13h42c7.2 0 13 5.8 13 13v42c0 7.2-5.8 13-13 13z"></path>
        </svg>
    )
}
