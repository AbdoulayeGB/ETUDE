-- Script de vérification de la configuration Supabase
-- Exécutez ce script pour vérifier que tout est correctement configuré

-- 1. Vérifier les tables
SELECT 
  'Tables créées' as check_type,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'subjects', 'courses', 'exercises', 'user_progress');

-- 2. Vérifier l'utilisateur admin
SELECT 
  'Utilisateur admin' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Créé'
    ELSE '❌ Manquant'
  END as status
FROM auth.users 
WHERE email = 'abdoulaye@cdp.sn';

-- 3. Vérifier le profil admin
SELECT 
  'Profil admin' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Créé'
    ELSE '❌ Manquant'
  END as status
FROM profiles 
WHERE email = 'abdoulaye@cdp.sn' AND role = 'admin';

-- 4. Vérifier les matières
SELECT 
  'Matières créées' as check_type,
  COUNT(*) as count
FROM subjects;

-- 5. Vérifier les cours
SELECT 
  'Cours créés' as check_type,
  COUNT(*) as count
FROM courses;

-- 6. Vérifier les politiques RLS
SELECT 
  'Politiques RLS' as check_type,
  COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public';

-- 7. Résumé complet
SELECT 
  '=== RÉSUMÉ DE LA CONFIGURATION ===' as message
UNION ALL
SELECT 
  'Tables: ' || COUNT(*)::text
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'subjects', 'courses', 'exercises', 'user_progress')
UNION ALL
SELECT 
  'Utilisateur admin: ' || CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'MANQUANT' END
FROM auth.users 
WHERE email = 'abdoulaye@cdp.sn'
UNION ALL
SELECT 
  'Profil admin: ' || CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'MANQUANT' END
FROM profiles 
WHERE email = 'abdoulaye@cdp.sn' AND role = 'admin'
UNION ALL
SELECT 
  'Matières: ' || COUNT(*)::text
FROM subjects
UNION ALL
SELECT 
  'Cours: ' || COUNT(*)::text
FROM courses
UNION ALL
SELECT 
  'Politiques RLS: ' || COUNT(*)::text
FROM pg_policies 
WHERE schemaname = 'public';
