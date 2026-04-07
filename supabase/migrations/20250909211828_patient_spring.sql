/*
  # Schéma initial pour okétudes.sn

  1. Nouvelles Tables
    - `profiles` - Profils utilisateurs étendus
      - `id` (uuid, clé primaire, référence auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - 'student', 'teacher', 'admin'
      - `level` (text) - niveau scolaire
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `subjects` - Matières disponibles
      - `id` (uuid, clé primaire)
      - `name` (text) - nom de la matière
      - `slug` (text) - identifiant URL
      - `description` (text)
      - `color` (text) - couleur thématique
      - `icon` (text) - nom de l'icône
      - `created_at` (timestamp)
    
    - `courses` - Cours par matière
      - `id` (uuid, clé primaire)
      - `subject_id` (uuid, référence subjects)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `level` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `exercises` - Exercices
      - `id` (uuid, clé primaire)
      - `course_id` (uuid, référence courses)
      - `title` (text)
      - `question` (text)
      - `answer` (text)
      - `difficulty` (text) - 'easy', 'medium', 'hard'
      - `points` (integer)
      - `created_at` (timestamp)
    
    - `user_progress` - Progression des utilisateurs
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence auth.users)
      - `course_id` (uuid, référence courses)
      - `completed` (boolean)
      - `score` (integer)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques pour les utilisateurs authentifiés
    - Politiques spécifiques par rôle
*/

-- Créer la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  level text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des matières
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT 'blue',
  icon text DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT now()
);

-- Créer la table des cours
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text,
  level text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des exercices
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Créer la table de progression des utilisateurs
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Insertion automatique du profil"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politiques pour la table subjects (lecture publique)
CREATE POLICY "Tout le monde peut voir les matières"
  ON subjects
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Politiques pour la table courses (lecture publique)
CREATE POLICY "Tout le monde peut voir les cours"
  ON courses
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Politiques pour la table exercises (lecture publique)
CREATE POLICY "Tout le monde peut voir les exercices"
  ON exercises
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Politiques pour la table user_progress
CREATE POLICY "Les utilisateurs peuvent voir leur propre progression"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre progression"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre progression"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insérer les matières par défaut
INSERT INTO subjects (name, slug, description, color, icon) VALUES
  ('Mathématiques', 'mathematiques', 'Algèbre, géométrie, statistiques et plus encore', 'blue', 'Calculator'),
  ('Sciences', 'sciences', 'Physique, chimie, biologie et sciences de la terre', 'green', 'Microscope'),
  ('Langues', 'langues', 'Français, anglais, espagnol et autres langues', 'purple', 'Languages'),
  ('Histoire', 'histoire', 'Histoire de France et du monde, civilisations', 'orange', 'Clock'),
  ('Géographie', 'geographie', 'Géographie physique et humaine, cartographie', 'teal', 'Globe'),
  ('Ressources', 'ressources', 'Outils pédagogiques, exercices et supports', 'indigo', 'BookOpen')
ON CONFLICT (slug) DO NOTHING;