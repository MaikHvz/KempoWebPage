import { supabase } from './supabaseClient';

export interface Tournament {
  id: string;
  day: string;
  month: string;
  title: string;
  location: string;
  time: string;
  categories: string[];
  description: string;
  published: boolean;
  created_at: string;
}

// Función auxiliar para convertir mes a número para ordenamiento
const monthToNumber = (month: string): number => {
  const months = {
    'ENE': 1, 'FEB': 2, 'MAR': 3, 'ABR': 4, 'MAY': 5, 'JUN': 6,
    'JUL': 7, 'AGO': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DIC': 12
  };
  return months[month.toUpperCase() as keyof typeof months] || 0;
};

// Función auxiliar para ordenar torneos por fecha
const sortTournamentsByDate = (tournaments: Tournament[]): Tournament[] => {
  return tournaments.sort((a, b) => {
    const monthA = monthToNumber(a.month);
    const monthB = monthToNumber(b.month);
    
    if (monthA !== monthB) {
      return monthA - monthB;
    }
    
    return parseInt(a.day) - parseInt(b.day);
  });
};

export const getTournaments = async (): Promise<Tournament[]> => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }

    return sortTournamentsByDate(data || []);
  } catch (error) {
    console.error('Error in getTournaments:', error);
    return [];
  }
};

export const getTournament = async (id: string): Promise<Tournament | null> => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching tournament:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getTournament:', error);
    return null;
  }
};

export const createTournament = async (tournament: Omit<Tournament, 'id' | 'created_at'>): Promise<Tournament | null> => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([{
        day: tournament.day,
        month: tournament.month,
        title: tournament.title,
        location: tournament.location,
        time: tournament.time,
        categories: tournament.categories,
        description: tournament.description,
        published: tournament.published !== undefined ? tournament.published : true,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating tournament:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createTournament:', error);
    return null;
  }
};

export const updateTournament = async (id: string, updates: Partial<Tournament>): Promise<Tournament | null> => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tournament:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateTournament:', error);
    return null;
  }
};

export const deleteTournament = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tournament:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTournament:', error);
    return false;
  }
};

// Funciones adicionales para el admin
export const getAllTournaments = async (): Promise<Tournament[]> => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all tournaments:', error);
      return [];
    }

    return sortTournamentsByDate(data || []);
  } catch (error) {
    console.error('Error in getAllTournaments:', error);
    return [];
  }
};