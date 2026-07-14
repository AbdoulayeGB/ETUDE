/*
# Rebuild: add columns, admin CRUD policies, ensure admin user

1. Schema changes
  - subjects: add `category` (text, default 'Autres')
  - courses: add `media_type` (text), `media_url` (text)

2. Security (RLS)
  - profiles: keep self SELECT/UPDATE/INSERT; add admin SELECT/UPDATE/INSERT/DELETE
  - subjects: keep public SELECT; add admin INSERT/UPDATE/DELETE
  - courses: keep public SELECT; add admin INSERT/UPDATE/DELETE
  - exercises: keep public SELECT; add admin INSERT/UPDATE/DELETE
  - user_progress: keep self SELECT/INSERT/UPDATE; add admin SELECT

3. Admin user
  - Ensure abdoulaye@cdp.sn exists in auth.users with role admin in profiles

4. Notes
  - All policy creation is idempotent (DROP POLICY IF EXISTS first)
  - No data is deleted
*/

-- ---------- Schema additions ----------
DO $$ BEGIN
  ALTER TABLE subjects ADD COLUMN IF NOT EXISTS category text DEFAULT 'Autres';
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE courses ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'texte';
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE courses ADD COLUMN IF NOT EXISTS media_url text DEFAULT '';
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ---------- profiles policies ----------
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Insertion automatique du profil" ON profiles;
CREATE POLICY "Insertion automatique du profil"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins peuvent voir tous les profils" ON profiles;
CREATE POLICY "Admins peuvent voir tous les profils"
  ON profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent modifier tous les profils" ON profiles;
CREATE POLICY "Admins peuvent modifier tous les profils"
  ON profiles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent insérer des profils" ON profiles;
CREATE POLICY "Admins peuvent insérer des profils"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent supprimer des profils" ON profiles;
CREATE POLICY "Admins peuvent supprimer des profils"
  ON profiles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ---------- subjects policies ----------
DROP POLICY IF EXISTS "Tout le monde peut voir les matières" ON subjects;
CREATE POLICY "Tout le monde peut voir les matières"
  ON subjects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins peuvent insérer des matières" ON subjects;
CREATE POLICY "Admins peuvent insérer des matières"
  ON subjects FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent modifier les matières" ON subjects;
CREATE POLICY "Admins peuvent modifier les matières"
  ON subjects FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent supprimer des matières" ON subjects;
CREATE POLICY "Admins peuvent supprimer des matières"
  ON subjects FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ---------- courses policies ----------
DROP POLICY IF EXISTS "Tout le monde peut voir les cours" ON courses;
CREATE POLICY "Tout le monde peut voir les cours"
  ON courses FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins peuvent insérer des cours" ON courses;
CREATE POLICY "Admins peuvent insérer des cours"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent modifier les cours" ON courses;
CREATE POLICY "Admins peuvent modifier les cours"
  ON courses FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent supprimer des cours" ON courses;
CREATE POLICY "Admins peuvent supprimer des cours"
  ON courses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ---------- exercises policies ----------
DROP POLICY IF EXISTS "Tout le monde peut voir les exercices" ON exercises;
CREATE POLICY "Tout le monde peut voir les exercices"
  ON exercises FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins peuvent insérer des exercices" ON exercises;
CREATE POLICY "Admins peuvent insérer des exercices"
  ON exercises FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent modifier les exercices" ON exercises;
CREATE POLICY "Admins peuvent modifier les exercices"
  ON exercises FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins peuvent supprimer des exercices" ON exercises;
CREATE POLICY "Admins peuvent supprimer des exercices"
  ON exercises FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ---------- user_progress policies ----------
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre progression" ON user_progress;
CREATE POLICY "Les utilisateurs peuvent voir leur propre progression"
  ON user_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre progression" ON user_progress;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre progression"
  ON user_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre progression" ON user_progress;
CREATE POLICY "Les utilisateurs peuvent modifier leur propre progression"
  ON user_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins peuvent voir toute la progression" ON user_progress;
CREATE POLICY "Admins peuvent voir toute la progression"
  ON user_progress FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ---------- Ensure handle_new_user trigger exists ----------
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ---------- Ensure admin user exists ----------
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abdoulaye@cdp.sn';

  IF admin_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      recovery_sent_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(), 'authenticated', 'authenticated',
      'abdoulaye@cdp.sn',
      crypt('ABDOULAHI1989', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Abdoulaye Administrateur"}',
      now(), now(), '', '', '', ''
    )
    RETURNING id INTO admin_user_id;
  END IF;

  -- Upsert admin profile
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (admin_user_id, 'abdoulaye@cdp.sn', 'Abdoulaye Administrateur', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Abdoulaye Administrateur',
    email = 'abdoulaye@cdp.sn',
    updated_at = now();
END $$;