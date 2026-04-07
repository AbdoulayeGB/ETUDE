# 🔧 Solution - Erreur ON CONFLICT

## 🚨 Problème
```
ERROR: 42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification
```

## 🎯 Cause
L'erreur indique que la table `auth.users` n'a pas de contrainte unique sur l'email, ou que la structure est différente de ce qui était attendu.

## ✅ Solutions

### Solution 1 : Script Simplifié (RECOMMANDÉ)
Utilisez le fichier `create-admin-user-simple.sql` qui :
- Supprime d'abord l'utilisateur existant
- Crée l'utilisateur sans ON CONFLICT
- Plus simple et plus fiable

### Solution 2 : Script avec API Auth
Utilisez le fichier `create-admin-user-auth.sql` qui :
- Utilise `auth.signup()` (fonction Supabase)
- Plus sûr et conforme aux bonnes pratiques
- Gère automatiquement les conflits

### Solution 3 : Script Corrigé
Le fichier `create-admin-user.sql` a été corrigé avec :
- Blocs DO $$ pour éviter les conflits
- Vérifications d'existence
- Gestion d'erreurs améliorée

## 🚀 Instructions

### Étape 1 : Choisir un Script
**Recommandé** : `create-admin-user-simple.sql`

### Étape 2 : Exécuter dans Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Ouvrez l'éditeur SQL
3. Copiez et collez le contenu du script choisi
4. Cliquez sur "Run"

### Étape 3 : Vérifier
Le script devrait afficher :
```
Utilisateur créé avec succès !
abdoulaye@cdp.sn | [timestamp] | Abdoulaye Administrateur | admin
```

## 🧪 Test de Connexion

Après avoir exécuté le script :

1. **Ouvrez `test-admin-connection.html`** dans votre navigateur
2. **Cliquez sur "Tester la Connexion"**
3. **Vérifiez que la connexion réussit**

## 🆘 Si le Problème Persiste

### Vérifier la Structure de la Table
```sql
-- Vérifier les contraintes de la table auth.users
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'auth.users'::regclass;
```

### Vérifier l'Utilisateur
```sql
-- Vérifier si l'utilisateur existe
SELECT * FROM auth.users WHERE email = 'abdoulaye@cdp.sn';
SELECT * FROM profiles WHERE email = 'abdoulaye@cdp.sn';
```

## 📋 Scripts Disponibles

1. **`create-admin-user-simple.sql`** - Script simplifié (RECOMMANDÉ)
2. **`create-admin-user-auth.sql`** - Script avec API Auth
3. **`create-admin-user.sql`** - Script corrigé avec DO $$
4. **`verify-setup.sql`** - Script de vérification

## ✅ Résultat Attendu

Après avoir exécuté un des scripts :
- ✅ Utilisateur admin créé dans `auth.users`
- ✅ Profil admin créé dans `profiles`
- ✅ Connexion admin fonctionnelle
- ✅ Accès au dashboard admin

---

**Note** : Si vous continuez à avoir des problèmes, utilisez le script `create-admin-user-simple.sql` qui est le plus fiable.
