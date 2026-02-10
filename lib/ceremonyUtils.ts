// Función para forzar actualización de ceremonia en la página principal
export const forceCeremonyUpdate = () => {
  if (typeof window !== 'undefined') {
    console.log('Forzando actualización de ceremonia...');
    const ceremonyData = localStorage.getItem('dojo-ceremony');
    console.log('Datos encontrados:', ceremonyData);
    
    // Disparar ambos eventos para asegurar actualización
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('ceremonyUpdate'));
    
    // También podemos actualizar directamente el estado si tenemos acceso
    const ceremonySection = document.getElementById('ceremonias');
    if (ceremonySection) {
      console.log('Sección de ceremonias encontrada, forzando re-render...');
      ceremonySection.style.display = 'none';
      setTimeout(() => {
        ceremonySection.style.display = 'block';
      }, 100);
    }
  }
};

// Hacer la función disponible globalmente para pruebas
if (typeof window !== 'undefined') {
  (window as any).forceCeremonyUpdate = forceCeremonyUpdate;
}