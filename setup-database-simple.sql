-- Script simple et robuste pour configurer la base de données
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer la table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table subjects
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'BookOpen',
  category TEXT DEFAULT 'Mathématiques',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table courses
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

-- 4. Créer la table exercises
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

-- 5. Créer la table user_progress
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

-- 6. Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 7. Créer les politiques RLS pour profiles
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Créer les politiques RLS pour subjects
CREATE POLICY IF NOT EXISTS "Anyone can view subjects" ON subjects
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage subjects" ON subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Créer les politiques RLS pour courses
CREATE POLICY IF NOT EXISTS "Anyone can view courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Créer les politiques RLS pour exercises
CREATE POLICY IF NOT EXISTS "Anyone can view exercises" ON exercises
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage exercises" ON exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. Créer les politiques RLS pour user_progress
CREATE POLICY IF NOT EXISTS "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all progress" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 12. Vérifier si les données existent déjà avant insertion
DO $$
BEGIN
  -- Insérer les matières seulement si elles n'existent pas
  IF NOT EXISTS (SELECT 1 FROM subjects WHERE slug = 'mathematiques') THEN
    INSERT INTO subjects (name, slug, description, color, icon, category) VALUES
      ('Mathématiques', 'mathematiques', 'Cours de mathématiques pour tous les niveaux', '#3B82F6', 'Calculator', 'Mathématiques');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM subjects WHERE slug = 'sciences') THEN
    INSERT INTO subjects (name, slug, description, color, icon, category) VALUES
      ('Sciences', 'sciences', 'Physique, chimie et biologie', '#10B981', 'Microscope', 'Sciences');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM subjects WHERE slug = 'langues') THEN
    INSERT INTO subjects (name, slug, description, color, icon, category) VALUES
      ('Langues', 'langues', 'Français, anglais et autres langues', '#F59E0B', 'BookOpen', 'Langues');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM subjects WHERE slug = 'histoire') THEN
    INSERT INTO subjects (name, slug, description, color, icon, category) VALUES
      ('Histoire', 'histoire', 'Histoire du monde et du Sénégal', '#EF4444', 'Clock', 'Histoire');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM subjects WHERE slug = 'geographie') THEN
    INSERT INTO subjects (name, slug, description, color, icon, category) VALUES
      ('Géographie', 'geographie', 'Géographie physique et humaine', '#8B5CF6', 'Globe', 'Géographie');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM subjects WHERE slug = 'ressources') THEN
    INSERT INTO subjects (name, slug, description, color, icon, category) VALUES
      ('Ressources', 'ressources', 'Ressources pédagogiques et outils', '#06B6D4', 'Book', 'Ressources');
  END IF;
END $$;

-- 13. Créer une fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Créer les triggers pour updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. Message de confirmation
SELECT 'Base de données configurée avec succès !' as message;
