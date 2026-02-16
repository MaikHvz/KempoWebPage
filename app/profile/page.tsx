'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { FaUserCircle, FaMoneyBillWave, FaHistory, FaCreditCard, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          window.location.href = '/';
          return;
      }
      setUser(user);

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // 2. Fetch Subscriptions with Plans and Beneficiaries
      const { data: subsData } = await supabase
        .from('student_subscriptions')
        .select(`
            *,
            memberships ( name, price, description ),
            beneficiaries ( full_name, relationship )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setSubscriptions(subsData || []);

      // 3. Fetch Payments
      // We need payments linked to the user's subscriptions
      // Could be done with a join, but let's do safe separate query for now or intricate join
      if (subsData && subsData.length > 0) {
          const subIds = subsData.map(s => s.id);
          const { data: payData } = await supabase
            .from('payments')
            .select(`*, student_subscriptions(memberships(name))`)
            .in('subscription_id', subIds)
            .order('payment_date', { ascending: false });
          setPayments(payData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleRenew = async (sub: any) => {
      // Logic to renew: essentially buy the same plan again
      // Redirect to WebPay flow for this plan
      if (!confirm(`¿Quieres renovar tu plan ${sub.memberships.name}? Serás redirigido a WebPay.`)) return;
      
      try {
        const response = await fetch('/api/webpay/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId: sub.membership_id }), // Using the original plan ID
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        // Auto-submit form
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

      } catch (error: any) {
          alert('Error al renovar: ' + error.message);
      }
  };

  if (loading) return <div className="min-h-screen pt-32 text-center">Cargando perfil...</div>;

  const activeSub = subscriptions.find(s => s.status === 'active');
  const pendingSub = subscriptions.find(s => s.status === 'pending_payment');

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profile */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
                {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" /> : <FaUserCircle />}
            </div>
            <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-800">{profile?.full_name || user.email}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${activeSub ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {activeSub ? 'Membresía Activa' : 'Sin Membresía Activa'}
                </div>
            </div>
            
             {/* Main Action based on Status */}
            <div>
                 {pendingSub ? (
                    <button onClick={() => handleRenew(pendingSub)} className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-lg animate-pulse">
                         Completar Pago Pendiente
                    </button>
                 ) : !activeSub ? (
                    <Link href="/planes" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                         Contratar Plan
                    </Link>
                 ) : (
                     <button disabled className="bg-green-100 text-green-700 border border-green-200 px-6 py-3 rounded-xl font-bold cursor-default">
                         Membresía al Día
                     </button>
                 )}
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            
            {/* Active/Latest Memberships */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaCreditCard className="text-primary" /> Mis Membresías
                </h2>
                
                {subscriptions.length === 0 ? (
                    <p className="text-gray-500 italic">No tienes historial de membresías.</p>
                ) : (
                    <div className="space-y-4">
                        {subscriptions.map((sub) => (
                            <div key={sub.id} className={`p-4 rounded-2xl border ${sub.status === 'active' ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{sub.memberships.name}</h3>
                                        {/* Display Beneficiary */}
                                        <p className="text-xs text-primary font-semibold flex items-center gap-1">
                                            <FaUserCircle className="text-xs" />
                                            {sub.beneficiaries ? `${sub.beneficiaries.full_name} (${sub.beneficiaries.relationship})` : 'Para mí'}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        sub.status === 'active' ? 'bg-green-200 text-green-800' : 
                                        sub.status === 'pending_payment' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {sub.status === 'pending_payment' ? 'Pendiente Pago' : sub.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Vence: <span className="font-semibold">{new Date(sub.end_date).toLocaleDateString()}</span></p>
                                    <p>Precio: ${sub.memberships.price.toLocaleString('es-CL')}</p>
                                </div>
                                
                                {sub.status !== 'active' && sub.status !== 'pending_payment' && (
                                    <button 
                                        onClick={() => handleRenew(sub)}
                                        className="mt-3 w-full text-center text-primary font-bold text-sm hover:underline"
                                    >
                                        Renovar este plan
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaHistory className="text-primary" /> Historial de Pagos
                </h2>

                {payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <FaMoneyBillWave className="mx-auto text-4xl mb-2 opacity-30" />
                        <p>No hay pagos registrados.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {payments.map((pay) => (
                            <div key={pay.id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-colors">
                                <div>
                                    <p className="font-bold text-gray-800">{pay.student_subscriptions?.memberships?.name || 'Pago'}</p>
                                    <p className="text-xs text-gray-500">{new Date(pay.payment_date).toLocaleDateString()} a las {new Date(pay.payment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">${pay.amount.toLocaleString('es-CL')}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        pay.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {pay.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
