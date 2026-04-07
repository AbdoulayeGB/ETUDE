import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifier si les variables d'environnement Supabase sont configurées
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key';

// Créer le client Supabase seulement si configuré, sinon utiliser un client mock
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: () => Promise.reject(new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement.')),
      },
    });

export const isSupabaseReady = isSupabaseConfigured;

// Types TypeScript pour la base de données
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'student' | 'teacher' | 'admin';
  level?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Course {
  id: string;
  subject_id: string;
  title: string;
  description?: string;
  content?: string;
  level: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  subject?: Subject;
}

export interface Exercise {
  id: string;
  course_id: string;
  title: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  created_at: string;
  course?: Course;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed: boolean;
  score: number;
  completed_at?: string;
  created_at: string;
  course?: Course;
}