import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  role: 'student' | 'teacher' | 'admin';
  level?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  icon: string;
  category?: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  subject_id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  level: string;
  order_index: number;
  media_type?: string | null;
  media_url?: string | null;
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
  completed_at?: string | null;
  created_at: string;
  course?: Course;
}
