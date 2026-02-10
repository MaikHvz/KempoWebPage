
export interface Tournament {
  id: string;
  day: string;
  month: string;
  title: string;
  location: string;
  time: string;
  categories: string[];
  description: string;
}

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
}

export interface Ceremony {
  date: string;
  time: string;
  location: string;
  description?: string;
  attendingBelts: string[];
}

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    day: '15',
    month: 'MAR',
    title: 'Campeonato Nacional de Kempo',
    location: 'Centro Deportivo Nacional, Santiago',
    time: '09:00 - 18:00',
    categories: ['Juvenil', 'Adulto', 'Senior'],
    description: 'Nuestros alumnos participarán representando al Dojo BioKempo'
  },
  {
    id: '2',
    day: '22',
    month: 'ABR',
    title: 'Copa Sudamericana de Artes Marciales',
    location: 'Polideportivo Regional, Valparaíso',
    time: '10:00 - 16:00',
    categories: ['Kata', 'Kumite', 'Defensa Personal'],
    description: 'Selección de alumnos avanzados del dojo'
  },
  {
    id: '3',
    day: '10',
    month: 'MAY',
    title: 'Torneo Interescolar Valenzuela',
    location: 'Dojo BioKempo, La Serena',
    time: '08:00 - 17:00',
    categories: ['Principiantes', 'Intermedios'],
    description: 'Torneo interno para todos los niveles'
  }
];

const INITIAL_GALLERY: GalleryItem[] = [
  { id: '1', category: 'dojo', title: 'Dojo Principal', description: 'Amplio espacio de entrenamiento con tatami profesional', imageUrl: '/placeholder.svg', isFeatured: true },
  { id: '2', category: 'dojo', title: 'Área de Equipamiento', description: 'Sacos, makiwaras y equipos de entrenamiento profesional', imageUrl: '/placeholder.svg', isFeatured: false },
  { id: '3', category: 'dojo', title: 'Recepción y Descanso', description: 'Espacio cómodo para padres y visitantes', imageUrl: '/placeholder.svg', isFeatured: false },
  { id: '4', category: 'students', title: 'Clase Infantil', description: 'Nuestros pequeños guerreros en acción', imageUrl: '/placeholder.svg', isFeatured: true },
  { id: '5', category: 'students', title: 'Clase Juvenil', description: 'Adolescentes desarrollando disciplina y técnica', imageUrl: '/placeholder.svg', isFeatured: false },
  { id: '6', category: 'students', title: 'Clase de Adultos', description: 'Entrenamiento intensivo para adultos', imageUrl: '/placeholder.svg', isFeatured: true },
  { id: '7', category: 'training', title: 'Práctica de Kata', description: 'Perfeccionando las formas tradicionales', imageUrl: '/placeholder.svg', isFeatured: true },
  { id: '8', category: 'training', title: 'Sesión de Sparring', description: 'Combate controlado y técnico', imageUrl: '/placeholder.svg', isFeatured: false },
  { id: '9', category: 'training', title: 'Entrenamiento con Armas', description: 'Técnicas tradicionales con armas del Kempo', imageUrl: '/placeholder.svg', isFeatured: false },
  { id: '10', category: 'competitions', title: 'Campeonato Nacional', description: 'Nuestros alumnos compitiendo al más alto nivel', imageUrl: '/placeholder.svg', isFeatured: true },
  { id: '11', category: 'competitions', title: 'Podium de Ganadores', description: 'Celebrando los logros de nuestros campeones', imageUrl: '/placeholder.svg', isFeatured: false },
  { id: '12', category: 'ceremonies', title: 'Ceremonia de Graduación y seminarios', description: 'Momento especial de reconocimiento y progreso', imageUrl: '/placeholder.svg', isFeatured: true },
];

const INITIAL_CEREMONY: Ceremony = {
  date: 'Sábado 28 de Marzo, 2024',
  time: '17:00 - 20:00',
  location: 'Dojo Valenzuela - Salón Principal',
  description: 'Cada graduación es presidida por los maestros de la familia Valenzuela, manteniendo la autenticidad y el rigor tradicional del Kempo Karate.',
  attendingBelts: ['Blanco', 'Amarillo', 'Naranja']
};

const STORAGE_KEYS = {
  TOURNAMENTS: 'kempo_tournaments',
  GALLERY: 'kempo_gallery',
  CEREMONY: 'kempo_ceremony'
};

// --- Helpers ---
const isBrowser = typeof window !== 'undefined';

// --- Tournaments ---
export const getTournaments = (): Tournament[] => {
  if (!isBrowser) return INITIAL_TOURNAMENTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    return stored ? JSON.parse(stored) : INITIAL_TOURNAMENTS;
  } catch {
    return INITIAL_TOURNAMENTS;
  }
};

export const saveTournaments = (tournaments: Tournament[]) => {
  if (isBrowser) localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
};

export const createTournament = (tournament: Omit<Tournament, 'id'>) => {
  const current = getTournaments();
  const newItem = { ...tournament, id: Date.now().toString() };
  saveTournaments([...current, newItem]);
  return newItem;
};

export const updateTournament = (id: string, updates: Partial<Tournament>) => {
  const current = getTournaments();
  const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
  saveTournaments(updated);
};

export const deleteTournament = (id: string) => {
  const current = getTournaments();
  saveTournaments(current.filter(item => item.id !== id));
};

// --- Gallery ---
export const getGalleryItems = (): GalleryItem[] => {
  if (!isBrowser) return INITIAL_GALLERY;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return stored ? JSON.parse(stored) : INITIAL_GALLERY;
  } catch {
    return INITIAL_GALLERY;
  }
};

export const saveGalleryItems = (items: GalleryItem[]) => {
  if (isBrowser) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
};

export const createGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
  const current = getGalleryItems();
  const newItem = { ...item, id: Date.now().toString() };
  saveGalleryItems([...current, newItem]);
  return newItem;
};

export const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
  const current = getGalleryItems();
  const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
  saveGalleryItems(updated);
};

export const deleteGalleryItem = (id: string) => {
  const current = getGalleryItems();
  saveGalleryItems(current.filter(item => item.id !== id));
};

// --- Ceremony ---
export const getCeremony = (): Ceremony => {
  if (!isBrowser) return INITIAL_CEREMONY;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CEREMONY);
    return stored ? JSON.parse(stored) : INITIAL_CEREMONY;
  } catch {
    return INITIAL_CEREMONY;
  }
};

export const saveCeremony = (ceremony: Ceremony) => {
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEYS.CEREMONY, JSON.stringify(ceremony));
    // Evento para cambios entre pestañas
    window.dispatchEvent(new Event('storage'));
    // Evento personalizado para la misma pestaña
    window.dispatchEvent(new CustomEvent('ceremonyUpdate'));
  }
};
