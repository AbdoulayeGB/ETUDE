-- Script SQL pour créer l'utilisateur admin dans Supabase
-- Email: abdoulaye@cdp.sn
-- Mot de passe: ABDOULAHI1989

-- 1. Vérifier si l'utilisateur existe déjà
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Vérifier si l'utilisateur existe
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abdoulaye@cdp.sn';
  
  IF admin_user_id IS NULL THEN
    -- Créer l'utilisateur s'il n'existe pas
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
    
    -- Récupérer l'ID de l'utilisateur créé
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abdoulaye@cdp.sn';
  ELSE
    -- Mettre à jour le mot de passe si l'utilisateur existe
    UPDATE auth.users 
    SET 
      encrypted_password = crypt('ABDOULAHI1989', gen_salt('bf')),
      updated_at = now()
    WHERE email = 'abdoulaye@cdp.sn';
  END IF;
  
  -- Stocker l'ID pour la suite
  PERFORM set_config('app.admin_user_id', admin_user_id::text, false);
END $$;

-- 2. Créer le profil admin dans la table profiles
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur admin
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abdoulaye@cdp.sn';
  
  IF admin_user_id IS NOT NULL THEN
    -- Insérer ou mettre à jour le profil
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
      admin_user_id,
      'abdoulaye@cdp.sn',
      'Abdoulaye Administrateur',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = 'abdoulaye@cdp.sn',
      full_name = 'Abdoulaye Administrateur',
      role = 'admin',
      updated_at = now();
  END IF;
END $$;

-- 3. Vérifier que l'utilisateur a été créé
SELECT 
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'abdoulaye@cdp.sn';
