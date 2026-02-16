import { createClient } from '@/utils/supabase/server';
import { FaMoneyBillWave, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

export default async function FinancialsPage() {
  const supabase = await createClient();

  // Fetch all payments (active/paid)
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
        *,
        student_subscriptions (
            memberships (name),
            profiles (full_name, email)
        )
    `)
    .order('payment_date', { ascending: false });

  if (error) return <div>Error cargando finanzas</div>;

  // Calculate Totals
  const totalRevenue = payments?.reduce((acc, curr) => {
      return curr.status === 'paid' ? acc + curr.amount : acc;
  }, 0) || 0;

  const totalTransactions = payments?.filter(p => p.status === 'paid').length || 0;
  const pendingTransactions = payments?.filter(p => p.status === 'pending').length || 0;

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Finanzas</h1>
            <p className="text-gray-500 mt-1">Resumen de ingresos y transacciones</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                    <FaMoneyBillWave />
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">Ingresos Totales</h3>
                    <p className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString('es-CL')}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    <FaChartLine />
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">Transacciones Exitosas</h3>
                    <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl">
                    <FaCalendarAlt />
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">Pagos Pendientes</h3>
                    <p className="text-2xl font-bold text-gray-800">{pendingTransactions}</p>
                </div>
            </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Historial de Transacciones</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Fecha</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Usuario</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Plan</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Detalle</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Estado</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {payments?.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(payment.payment_date).toLocaleDateString()} <br/>
                                    <span className="text-xs text-gray-400">{new Date(payment.payment_date).toLocaleTimeString()}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                    {payment.student_subscriptions?.profiles?.full_name || 'Desconocido'}
                                    <div className="text-xs text-gray-500 font-normal">{payment.student_subscriptions?.profiles?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {payment.student_subscriptions?.memberships?.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={payment.notes}>
                                    {payment.notes || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {payment.status === 'paid' ? 'Pagado' : payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-800">
                                    ${payment.amount.toLocaleString('es-CL')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
