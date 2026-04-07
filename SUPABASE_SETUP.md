# Configuration Supabase - Guide de Setup

## 🚨 Problème Actuel
Vous recevez des erreurs 400 lors de la connexion à Supabase car les variables d'environnement ne sont pas configurées.

## 🔧 Solution

### 1. Créer le fichier .env
Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
VITE_SUPABASE_URL=https://dpqrcrwaryzfxhujzbcr.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-ici
```

### 2. Obtenir vos clés Supabase

#### Option A: Si vous avez déjà un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet
4. Allez dans **Settings** > **API**
5. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

#### Option B: Créer un nouveau projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"New Project"**
3. Choisissez votre organisation
4. Donnez un nom au projet (ex: "oketudes")
5. Créez un mot de passe fort pour la base de données
6. Choisissez une région proche (Europe West pour le Sénégal)
7. Cliquez sur **"Create new project"**
8. Attendez que le projet soit créé (2-3 minutes)
9. Allez dans **Settings** > **API** et copiez les clés

### 3. Configurer la base de données

#### Exécuter les migrations
Une fois votre projet Supabase créé, exécutez les migrations :

```bash
# Si vous avez Supabase CLI installé
supabase db push

# Ou importez manuellement le fichier de migration
# supabase/migrations/20250911095804_teal_feather.sql
```

#### Créer l'utilisateur admin
Exécutez ce script SQL dans l'éditeur SQL de Supabase :

```sql
-- Créer l'utilisateur admin
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

-- Créer le profil admin
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
```

### 4. Redémarrer le serveur
Après avoir créé le fichier `.env` :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

## ✅ Vérification

Une fois configuré, vous devriez pouvoir :
1. Accéder au site sans erreurs
2. Cliquer sur "Admin" dans le menu
3. Se connecter avec :
   - Email: `abdoulaye@cdp.sn`
   - Mot de passe: `ABDOULAHI1989`

## 🆘 Dépannage

### Erreur 400 persistante
- Vérifiez que les clés dans `.env` sont correctes
- Vérifiez que le projet Supabase est actif
- Vérifiez que les tables existent dans la base de données

### Erreur de connexion
- Vérifiez votre connexion internet
- Vérifiez que l'URL Supabase est correcte
- Vérifiez que la clé anon est correcte

### Problème d'authentification
- Vérifiez que l'utilisateur admin a été créé
- Vérifiez que le profil a le rôle 'admin'
- Vérifiez que les migrations ont été exécutées

---

**Note** : Le fichier `.env` ne doit jamais être commité dans Git pour des raisons de sécurité.
