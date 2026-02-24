'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AuthModal from './AuthModal'; // Fixed path
import BeneficiaryModal from './BeneficiaryModal'; // Import new modal

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
  const router = useRouter();
  
  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes (fixes login without reload issue)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 1. First Click: Check Auth & Open Beneficiary Modal
  const handleSubscribeClick = (plan: Plan) => {
    if (!user) {
      toast.warning('Debes iniciar sesión para contratar un plan.'); 
      setAuthModalOpen(true);
      return;
    }
    setSelectedPlan(plan);
    setBeneficiaryModalOpen(true);
  };

  // 2. Selection Made: Proceed to Payment
  const handleBeneficiarySelect = async (beneficiaryId: string | null, buyerName?: string) => {
    if (!selectedPlan) return;
    setBeneficiaryModalOpen(false); // Close modal
    
    // Proceed with WebPay
    initiateWebPay(selectedPlan, beneficiaryId, buyerName);
  };

  const initiateWebPay = async (plan: Plan, beneficiaryId: string | null, buyerName?: string) => {
    setLoading(true);
    try {
        const response = await fetch('/api/webpay/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                planId: plan.id,
                beneficiaryId: beneficiaryId, // Send the ID
                buyerName: buyerName // Send buyer's real name
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error iniciando pago');
        }

        const form = document.createElement('form');
        form.action = data.url;
        form.method = 'POST';
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token_ws';
        tokenInput.value = data.token;
        
        form.appendChild(tokenInput);
        document.body.appendChild(form);
        form.submit();

    } catch (err: any) {
        toast.error('Error al iniciar pago: ' + err.message);
        setLoading(false);
        setSelectedPlan(null);
    }
  };

  return (
    <div className="py-12">
        <AuthModal 
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
        />
        <BeneficiaryModal 
            isOpen={beneficiaryModalOpen}
            onClose={() => setBeneficiaryModalOpen(false)}
            onSelect={handleBeneficiarySelect}
            planName={selectedPlan?.name || ''}
        />

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
                    onClick={() => handleSubscribeClick(plan)}
                    disabled={loading}
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

