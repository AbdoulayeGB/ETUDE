-- Script SQL pour créer l'utilisateur admin via l'API Auth
-- Ce script utilise les fonctions Supabase Auth

-- 1. Créer l'utilisateur via l'API Auth (plus sûr)
SELECT auth.signup('abdoulaye@cdp.sn', 'ABDOULAHI1989', '{"full_name": "Abdoulaye Administrateur"}');

-- 2. Attendre un peu pour que l'utilisateur soit créé
SELECT pg_sleep(2);

-- 3. Récupérer l'ID de l'utilisateur créé
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur admin
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abdoulaye@cdp.sn';
  
  IF admin_user_id IS NOT NULL THEN
    -- Créer le profil admin
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
      admin_user_id,
      'abdoulaye@cdp.sn',
      'Abdoulaye Administrateur',
      'admin'
    );
    
    RAISE NOTICE 'Utilisateur admin créé avec succès !';
  ELSE
    RAISE NOTICE 'Erreur: Utilisateur non trouvé';
  END IF;
END $$;

-- 4. Vérifier le résultat
SELECT 
  'Vérification finale' as status,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'abdoulaye@cdp.sn';
