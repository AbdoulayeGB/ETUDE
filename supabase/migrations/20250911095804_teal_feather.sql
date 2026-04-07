/*
  # Configuration complète de la base de données okétudes.sn

  1. Nouvelles Tables
    - `profiles` - Profils utilisateurs avec rôles
    - `subjects` - Matières scolaires
    - `courses` - Cours par matière
    - `exercises` - Exercices par cours
    - `user_progress` - Progression des utilisateurs

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques d'accès appropriées pour chaque table
    - Fonction de création automatique de profil

  3. Données initiales
    - Matières par défaut
    - Utilisateur administrateur
*/

-- Créer la fonction pour gérer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger pour les nouveaux utilisateurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  level text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
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

-- Table des matières
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT 'blue',
  icon text DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les matières"
  ON subjects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Table des cours
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

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les cours"
  ON courses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Table des exercices
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

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les exercices"
  ON exercises
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Table de progression des utilisateurs
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

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

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

-- Politiques admin pour profils : accès complet pour les admins
CREATE POLICY "Admins peuvent voir tous les profils"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent insérer des profils"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent modifier tous les profils"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent supprimer des profils"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Politiques admin pour matières : CRUD complet pour admins
CREATE POLICY "Admins peuvent insérer des matières"
  ON subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent modifier les matières"
  ON subjects
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent supprimer des matières"
  ON subjects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Politiques admin pour cours : CRUD complet pour admins
CREATE POLICY "Admins peuvent insérer des cours"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent modifier les cours"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent supprimer des cours"
  ON courses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Politiques admin pour exercices : CRUD complet pour admins
CREATE POLICY "Admins peuvent insérer des exercices"
  ON exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent modifier les exercices"
  ON exercises
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins peuvent supprimer des exercices"
  ON exercises
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Politiques admin pour progression : admins peuvent voir tout
CREATE POLICY "Admins peuvent voir toute la progression"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Insérer les matières par défaut
INSERT INTO subjects (name, slug, description, color, icon) VALUES
  ('Mathématiques', 'mathematiques', 'Algèbre, géométrie, statistiques et plus encore', 'blue', 'Calculator'),
  ('Sciences', 'sciences', 'Physique, chimie, biologie et sciences de la terre', 'green', 'Microscope'),
  ('Langues', 'langues', 'Français, anglais, espagnol et autres langues', 'purple', 'Languages'),
  ('Histoire', 'histoire', 'Histoire de France et du monde, civilisations', 'orange', 'Clock'),
  ('Géographie', 'geographie', 'Géographie physique et humaine, cartographie', 'teal', 'Globe'),
  ('Ressources', 'ressources', 'Outils pédagogiques, exercices et supports', 'indigo', 'BookOpen')
ON CONFLICT (slug) DO NOTHING;

-- Créer l'utilisateur administrateur
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Insérer l'utilisateur dans auth.users s'il n'existe pas
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'abdoulaye@cdp.sn',
    crypt('ABDOULAHI1989', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Abdoulaye Administrateur"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- Si l'utilisateur existait déjà, récupérer son ID
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abdoulaye@cdp.sn';
  END IF;

  -- Insérer ou mettre à jour le profil admin
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    admin_user_id,
    'abdoulaye@cdp.sn',
    'Abdoulaye Administrateur',
    'admin'
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Abdoulaye Administrateur',
    updated_at = now();

END $$;