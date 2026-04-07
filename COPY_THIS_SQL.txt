-- Script SQL simplifié pour créer l'utilisateur admin
-- Email: abdoulaye@cdp.sn
-- Mot de passe: ABDOULAHI1989

-- 1. Supprimer l'utilisateur existant s'il y en a un
DELETE FROM profiles WHERE email = 'abdoulaye@cdp.sn';
DELETE FROM auth.users WHERE email = 'abdoulaye@cdp.sn';

-- 2. Créer l'utilisateur admin
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
);

-- 3. Créer le profil admin
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  u.id,
  'abdoulaye@cdp.sn',
  'Abdoulaye Administrateur',
  'admin'
FROM auth.users u
WHERE u.email = 'abdoulaye@cdp.sn';

-- 4. Vérifier que l'utilisateur a été créé
SELECT 
  'Utilisateur créé avec succès !' as message,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'abdoulaye@cdp.sn';
