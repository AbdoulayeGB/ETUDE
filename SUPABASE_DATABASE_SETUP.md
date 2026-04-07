# 🗄️ Configuration de la Base de Données Supabase

## 🎯 Objectif
Créer toutes les tables nécessaires et ajouter l'utilisateur admin dans votre base de données Supabase.

## 📋 Étapes à Suivre

### 1. Accéder à l'Éditeur SQL de Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet : `dpqrcrwaryzfxhujzbcr`
4. Dans le menu de gauche, cliquez sur **"SQL Editor"**

### 2. Créer les Tables de Base de Données

1. Dans l'éditeur SQL, cliquez sur **"New query"**
2. Copiez et collez le contenu du fichier `create-database-tables.sql`
3. Cliquez sur **"Run"** pour exécuter le script
4. Vérifiez que toutes les tables ont été créées

### 3. Créer l'Utilisateur Admin

1. Créez une nouvelle requête SQL
2. Copiez et collez le contenu du fichier `create-admin-user.sql`
3. Cliquez sur **"Run"** pour exécuter le script
4. Vérifiez que l'utilisateur admin a été créé

### 4. Vérifier la Configuration

1. Allez dans **"Table Editor"** dans le menu de gauche
2. Vérifiez que ces tables existent :
   - ✅ `profiles`
   - ✅ `subjects`
   - ✅ `courses`
   - ✅ `exercises`
   - ✅ `user_progress`

3. Dans la table `profiles`, vérifiez qu'il y a un utilisateur avec :
   - Email : `abdoulaye@cdp.sn`
   - Rôle : `admin`

## 🔐 Connexion Admin

Une fois la base de données configurée :

1. Allez sur `http://localhost:5176/`
2. Cliquez sur **"Admin"** dans le menu
3. Connectez-vous avec :
   - **Email** : `abdoulaye@cdp.sn`
   - **Mot de passe** : `ABDOULAHI1989`

## 🧪 Test de la Configuration

1. Allez sur `http://localhost:5176/`
2. Cliquez sur **"Diagnostic"** dans le menu
3. Vérifiez que toutes les vérifications passent :
   - ✅ Variables d'environnement
   - ✅ Connexion Supabase
   - ✅ Tables de base de données
   - ✅ Utilisateur admin

## 📊 Données d'Exemple

Le script crée automatiquement :
- **5 matières** : Mathématiques, Sciences, Langues, Histoire, Géographie
- **1 cours d'exemple** : Introduction aux équations
- **Utilisateur admin** : abdoulaye@cdp.sn

## 🆘 Dépannage

### Erreur "relation does not exist"
- Vérifiez que le script `create-database-tables.sql` a été exécuté
- Vérifiez que vous êtes dans le bon projet Supabase

### Erreur "duplicate key value"
- L'utilisateur admin existe déjà, c'est normal
- Le script utilise `ON CONFLICT` pour gérer les doublons

### Problème de permissions
- Vérifiez que les politiques RLS ont été créées
- Vérifiez que l'utilisateur admin a le rôle correct

## 🔄 Scripts Disponibles

1. **`create-database-tables.sql`** - Crée toutes les tables et politiques
2. **`create-admin-user.sql`** - Crée l'utilisateur admin
3. **`update-admin-credentials.sql`** - Met à jour les identifiants admin

## ✅ Vérification Finale

Après avoir exécuté les scripts :

1. **Base de données** : Toutes les tables créées
2. **Utilisateur admin** : Créé et configuré
3. **Application** : Fonctionne sans erreurs
4. **Connexion admin** : Réussie

---

**Note** : Gardez ces scripts pour référence future et pour d'autres environnements.
