-- Script pour mettre à jour les identifiants admin
-- Email: abdoulaye@cdp.sn
-- Mot de passe: ABDOULAHI1989

-- Mettre à jour l'utilisateur dans auth.users
UPDATE auth.users 
SET 
  email = 'abdoulaye@cdp.sn',
  encrypted_password = crypt('ABDOULAHI1989', gen_salt('bf'))
WHERE email = 'admin@okétudes.sn';

-- Mettre à jour le profil dans profiles
UPDATE profiles 
SET 
  email = 'abdoulaye@cdp.sn',
  full_name = 'Abdoulaye Administrateur'
WHERE email = 'admin@okétudes.sn';

-- Si l'utilisateur n'existe pas encore, le créer
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'abdoulaye@cdp.sn',
  crypt('ABDOULAHI1989', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('ABDOULAHI1989', gen_salt('bf')),
  updated_at = now();

-- Créer ou mettre à jour le profil admin
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  u.id,
  'abdoulaye@cdp.sn',
  'Abdoulaye Administrateur',
  'admin'
FROM auth.users u
WHERE u.email = 'abdoulaye@cdp.sn'
ON CONFLICT (id) DO UPDATE SET
  email = 'abdoulaye@cdp.sn',
  full_name = 'Abdoulaye Administrateur',
  role = 'admin',
  updated_at = now();
