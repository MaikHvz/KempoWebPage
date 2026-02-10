'use client';

export default function Schedule() {
  const scheduleData = [
    { day: 'Lunes', children: '17:00 - 18:30', adults: '19:00 - 20:30', specialized: '20:30 - 21:30' },
    { day: 'Miércoles', children: '17:00 - 18:30', adults: '19:00 - 20:30', specialized: '20:30 - 21:30' },
    { day: 'Viernes', children: '17:00 - 18:30', adults: '19:00 - 20:30', specialized: 'Sparring / Open Mat' },
  ];

  return (
    <section id="horarios" className="py-24 bg-white">
      <div className="container mx-auto px-5 max-w-[1200px]">
        <h2 className="text-4xl text-center mb-4 text-secondary relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-sm font-bold">
            Horarios de Clase
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12 max-w-[600px] mx-auto">
            Encuentra el horario perfecto para tu entrenamiento
        </p>

        <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl overflow-hidden shadow-lg min-w-[600px]">
                <thead>
                    <tr className="bg-secondary text-white text-left">
                        <th className="p-5 text-lg">Día</th>
                        <th className="p-5 text-lg">Kempo Kids (5-12 años)</th>
                        <th className="p-5 text-lg">Adultos y Juveniles</th>
                        <th className="p-5 text-lg">Entrenamiento Especializado</th>
                    </tr>
                </thead>
                <tbody>
                    {scheduleData.map((row, index) => (
                        <tr key={index} className={`border-b border-gray-200 hover:bg-light-gray transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="p-5 font-bold text-secondary">{row.day}</td>
                            <td className="p-5 text-gray-700">{row.children}</td>
                            <td className="p-5 text-gray-700">{row.adults}</td>
                            <td className="p-5 text-gray-700 font-semibold text-primary">{row.specialized}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </section>
  );
}
