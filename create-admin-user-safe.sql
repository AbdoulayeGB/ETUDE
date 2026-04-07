-- Script sécurisé pour créer l'utilisateur admin
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer l'utilisateur admin dans auth.users (si il n'existe pas)
INSERT INTO auth.users (
  id,
  instance_id,
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
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'abdoulaye@cdp.sn',
  crypt('ABDOULAHI1989', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- 2. Récupérer l'ID de l'utilisateur admin
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur admin
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'abdoulaye@cdp.sn';
  
  -- Créer le profil admin (si il n'existe pas)
  INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    level,
    created_at,
    updated_at
  ) VALUES (
    admin_user_id,
    'abdoulaye@cdp.sn',
    'Abdoulaye Admin',
    'admin',
    'admin',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Abdoulaye Admin',
    updated_at = NOW();
    
  -- Afficher un message de confirmation
  RAISE NOTICE 'Utilisateur admin créé/mis à jour avec succès !';
  RAISE NOTICE 'Email: abdoulaye@cdp.sn';
  RAISE NOTICE 'Mot de passe: ABDOULAHI1989';
  RAISE NOTICE 'ID utilisateur: %', admin_user_id;
END $$;

-- 3. Vérifier que l'utilisateur admin existe
SELECT 
  u.email,
  p.full_name,
  p.role,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'abdoulaye@cdp.sn';
