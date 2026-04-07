-- Script SQL sécurisé pour créer les tables (gère les conflits)
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer la table profiles (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table subjects (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'BookOpen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.1. Ajouter la colonne category si elle n'existe pas
DO $$ 
BEGIN
  ALTER TABLE subjects ADD COLUMN category TEXT DEFAULT 'Mathématiques';
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- 2.2. Créer la contrainte unique sur slug si elle n'existe pas
DO $$ 
BEGIN
  ALTER TABLE subjects ADD CONSTRAINT subjects_slug_unique UNIQUE (slug);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Créer la table courses (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  level TEXT DEFAULT 'débutant' CHECK (level IN ('débutant', 'intermédiaire', 'avancé')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table exercises (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Créer la table user_progress (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 6. Activer RLS (Row Level Security) - ignore si déjà activé
DO $$ 
BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 7. Supprimer les politiques existantes et les recréer
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 8. Créer les politiques RLS pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Supprimer et recréer les politiques pour subjects
DROP POLICY IF EXISTS "Anyone can view subjects" ON subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;

CREATE POLICY "Anyone can view subjects" ON subjects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Supprimer et recréer les politiques pour courses
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;

CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. Supprimer et recréer les politiques pour exercises
DROP POLICY IF EXISTS "Anyone can view exercises" ON exercises;
DROP POLICY IF EXISTS "Admins can manage exercises" ON exercises;

CREATE POLICY "Anyone can view exercises" ON exercises
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage exercises" ON exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 12. Supprimer et recréer les politiques pour user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON user_progress;

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 13. Insérer des données d'exemple (ignore les conflits)
INSERT INTO subjects (name, slug, description, color, icon, category) VALUES
  ('Mathématiques', 'mathematiques', 'Cours de mathématiques pour tous les niveaux', '#3B82F6', 'Calculator', 'Mathématiques'),
  ('Sciences', 'sciences', 'Physique, chimie et biologie', '#10B981', 'Microscope', 'Sciences'),
  ('Langues', 'langues', 'Français, anglais et autres langues', '#F59E0B', 'BookOpen', 'Langues'),
  ('Histoire', 'histoire', 'Histoire du monde et du Sénégal', '#EF4444', 'Clock', 'Histoire'),
  ('Géographie', 'geographie', 'Géographie physique et humaine', '#8B5CF6', 'Globe', 'Géographie'),
  ('Ressources', 'ressources', 'Ressources pédagogiques et outils', '#06B6D4', 'Book', 'Ressources')
ON CONFLICT (slug) DO NOTHING;

-- 14. Créer une fonction pour mettre à jour updated_at (si elle n'existe pas)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 15. Créer les triggers pour updated_at (ignore si existent)
DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
  CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 16. Message de confirmation
SELECT 'Tables et politiques créées/mises à jour avec succès !' as message;
