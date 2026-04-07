# ✅ Contenu SQL Correct à Copier

## 🚨 Problème Identifié
Vous avez copié du code JavaScript au lieu du code SQL. L'erreur `import { createClient }` indique que vous avez collé du JavaScript dans l'éditeur SQL.

## 📋 Contenu SQL Correct

**Copiez EXACTEMENT ce contenu** dans l'éditeur SQL de Supabase :

```sql
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
```

## 🚀 Instructions

### 1. Aller sur Supabase
- Allez sur [https://supabase.com](https://supabase.com)
- Connectez-vous et sélectionnez votre projet
- Cliquez sur **"SQL Editor"** dans le menu de gauche

### 2. Créer une Nouvelle Requête
- Cliquez sur **"New query"**
- Effacez tout le contenu existant

### 3. Copier le Code SQL
- **Copiez TOUT le contenu ci-dessus** (de `-- Script SQL simplifié` jusqu'à la fin)
- **Collez-le dans l'éditeur SQL**
- **Vérifiez qu'il n'y a pas de code JavaScript**

### 4. Exécuter
- Cliquez sur **"Run"** ou appuyez sur **Ctrl+Enter**

## ✅ Résultat Attendu

Si tout fonctionne, vous devriez voir :
```
Utilisateur créé avec succès ! | abdoulaye@cdp.sn | [timestamp] | Abdoulaye Administrateur | admin
```

## 🆘 Si Vous Avez Encore des Erreurs

### Erreur "relation does not exist"
- Exécutez d'abord `create-database-tables.sql`
- Puis exécutez ce script

### Erreur "permission denied"
- Vérifiez que vous êtes connecté en tant qu'administrateur du projet

### Erreur de syntaxe
- Vérifiez que vous avez copié TOUT le contenu SQL
- Assurez-vous qu'il n'y a pas de code JavaScript mélangé

## 📁 Fichiers à NE PAS Copier

❌ **NE COPIEZ PAS** ces fichiers (ils contiennent du JavaScript) :
- `debug-admin-login.js`
- `test-connection.js`
- `test-admin-connection.html`

✅ **COPIEZ SEULEMENT** ces fichiers (ils contiennent du SQL) :
- `create-admin-user-simple.sql`
- `create-database-tables.sql`
- `verify-setup.sql`

---

**IMPORTANT** : Assurez-vous de copier le contenu SQL ci-dessus, pas du JavaScript !
