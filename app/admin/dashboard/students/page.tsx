import { createClient } from '@/utils/supabase/server';
import { FaSearch } from 'react-icons/fa';
import StudentsTable from '@/components/admin/StudentsTable';

export default async function StudentsPage() {
  const supabase = await createClient();

  // Fetch all subscriptions with related data
  // This allows us to list every student (beneficiary or main user) who has a plan
  const { data: subscriptions, error } = await supabase
    .from('student_subscriptions')
    .select(`
        *,
        profiles (full_name, email, avatar_url),
        beneficiaries (full_name, relationship),
        memberships (name, price)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 text-red-500">Error cargando alumnos: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Alumnos</h1>
            <p className="text-gray-500 mt-1">Administra la asistencia y pagos de tus estudiantes</p>
        </div>
      </div>

      <StudentsTable initialSubscriptions={subscriptions || []} />
    </div>
  );
}
