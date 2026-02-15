import { createClient } from '@/utils/supabase/server';
import MembershipManager from '@/components/admin/MembershipManager';

export default async function FinancialsPage() {
  const supabase = await createClient();

  // Fetch all memberships sorted by price
  const { data: memberships } = await supabase
    .from('memberships')
    .select('*')
    .order('price', { ascending: true });

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Finanzas</h1>
            <p className="text-gray-500 mt-1">Gestiona los planes de suscripción y revisa los ingresos.</p>
        </div>

        <MembershipManager initialMemberships={memberships || []} />
    </div>
  );
}
