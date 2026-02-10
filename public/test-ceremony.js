// Script de prueba para verificar los datos de la ceremonia
if (typeof window !== 'undefined') {
  console.log('=== DATOS DE CEREMONIA GUARDADOS ===');
  const ceremonyData = localStorage.getItem('dojo-ceremony');
  console.log('Raw data:', ceremonyData);
  
  if (ceremonyData) {
    try {
      const parsed = JSON.parse(ceremonyData);
      console.log('Parsed ceremony:', parsed);
      console.log('Attending belts:', parsed.attendingBelts);
    } catch (e) {
      console.error('Error parsing ceremony data:', e);
    }
  } else {
    console.log('No ceremony data found in localStorage');
  }
  console.log('=== FIN DE DATOS ===');
}