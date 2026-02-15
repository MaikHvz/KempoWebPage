import { createClient } from '@/utils/supabase/server';
import PlansList from '@/components/PlansList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const revalidate = 0; // Disable static caching to always get latest plans

export default async function PlansPage() {
  const supabase = await createClient();

  const { data: plans, error } = await supabase
    .from('memberships')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) {
    return <div className="p-12 text-center text-red-500">Error cargando planes: {error.message}</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-gray pt-32 pb-20">
        <div className="container mx-auto px-5 max-w-[1200px]">
            <div className="text-center mb-16">
                <span className="text-primary font-bold tracking-wider uppercase text-sm">Membresías</span>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary mt-2 mb-6">Elige tu Camino en el Dojo</h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Invierte en tu formación física y mental. Nuestros planes flexibles te permiten entrenar a tu propio ritmo con acceso completo a nuestras instalaciones.
                </p>
            </div>

            {plans && plans.length > 0 ? (
                <PlansList plans={plans} />
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                    <p className="text-xl text-gray-500">No hay planes activos en este momento.</p>
                    <p className="text-gray-400 mt-2">Por favor, contacta con administración.</p>
                </div>
            )}

            <div className="mt-20 bg-secondary text-white rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">¿Tienes dudas sobre qué plan elegir?</h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        Acércate a una clase de prueba gratuita y conversa con nuestros instructores para encontrar la mejor opción para ti.
                    </p>
                    <a href="/#contacto" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-secondary transition-colors shadow-lg">
                        Contáctanos
                    </a>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
