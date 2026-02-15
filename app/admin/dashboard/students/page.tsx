import { createClient } from '@/utils/supabase/server';
import { FaSearch } from 'react-icons/fa';
import StudentsTable from '@/components/admin/StudentsTable';

export default async function StudentsPage() {
  const supabase = await createClient();

  // Fetch profiles with role 'student' and their subscriptions including membership details
  const { data: students, error } = await supabase
    .from('profiles')
    .select(`
        *,
        student_subscriptions (
            id,
            status,
            end_date,
            memberships (
                name,
                price
            )
        )
    `)
    .eq('role', 'student')
    .order('full_name', { ascending: true });

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

      <StudentsTable initialStudents={students || []} />
    </div>
  );
}
