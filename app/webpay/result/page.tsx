'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

function ResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const message = searchParams.get('message');
  const amount = searchParams.get('amount');
  const order = searchParams.get('order');

  let content;

  if (status === 'success') {
    content = (
      <div className="text-center">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-6">Tu suscripción ha sido activada correctamente.</p>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 max-w-sm mx-auto mb-8 text-left">
            <div className="flex justify-between mb-2">
                <span className="text-gray-500">Orden:</span>
                <span className="font-mono font-bold text-gray-800">{order}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Monto:</span>
                <span className="font-bold text-gray-800">${parseInt(amount || '0').toLocaleString('es-CL')}</span>
            </div>
        </div>

        <Link 
            href="/admin/dashboard" 
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
        >
            Ir a mi Panel
        </Link>
      </div>
    );
  } else if (status === 'failed' || status === 'aborted') {
    content = (
      <div className="text-center">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pago Rechazado</h1>
        <p className="text-gray-600 mb-6">
            {status === 'aborted' ? 'Anulaste la compra.' : 'La transacción fue rechazada por el banco.'}
        </p>
        
        <div className="flex gap-4 justify-center">
            <Link 
                href="/planes" 
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
                Volver a Planes
            </Link>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="text-center">
        <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Algo salió mal</h1>
        <p className="text-gray-600 mb-6">{message || 'Hubo un error al procesar tu solicitud.'}</p>
        
        <Link 
            href="/planes" 
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
        >
            Volver a intentar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full">
        {content}
      </div>
    </div>
  );
}

export default function WebPayResultPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Cargando resultado...</div>}>
            <ResultContent />
        </Suspense>
    );
}
