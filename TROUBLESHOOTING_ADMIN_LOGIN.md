# 🚨 Dépannage - Problème de Connexion Admin

## 🔍 Diagnostic du Problème

Le compte admin ne peut pas se connecter. Voici les causes possibles et solutions :

## 📋 Causes Possibles

### 1. ❌ Fichier .env manquant ou incorrect
**Symptôme** : Erreurs 400, pas de connexion Supabase
**Solution** : Créer le fichier .env manuellement

### 2. ❌ Base de données non configurée
**Symptôme** : "Invalid login credentials"
**Solution** : Exécuter les scripts SQL dans Supabase

### 3. ❌ Utilisateur admin non créé
**Symptôme** : "User not found"
**Solution** : Créer l'utilisateur admin

### 4. ❌ Rôle admin incorrect
**Symptôme** : Connexion réussie mais accès refusé
**Solution** : Vérifier le rôle dans la table profiles

## 🔧 Solutions Étape par Étape

### ÉTAPE 1 : Vérifier le fichier .env

1. **Créer manuellement le fichier .env** :
   - Créez un nouveau fichier nommé `.env` à la racine du projet
   - Ajoutez ce contenu exact :

```env
VITE_SUPABASE_URL=https://dpqrcrwaryzfxhujzbcr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXJjcndhcnl6ZnhodWp6YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE3OTUsImV4cCI6MjA3MzAyNzc5NX0.MnvpmaWM4rnGnzMO5vKbUjJgxohQbW3hxihxHxAhog0
```

2. **Sauvegarder et redémarrer** :
   - Sauvegardez le fichier
   - Arrêtez le serveur (Ctrl+C)
   - Redémarrez avec `npm run dev`

### ÉTAPE 2 : Configurer la Base de Données

1. **Aller sur Supabase** :
   - Allez sur [https://supabase.com](https://supabase.com)
   - Connectez-vous et sélectionnez votre projet
   - Allez dans **"SQL Editor"**

2. **Exécuter les scripts** :
   - Copiez et exécutez `create-database-tables.sql`
   - Copiez et exécutez `create-admin-user.sql`
   - Copiez et exécutez `verify-setup.sql`

### ÉTAPE 3 : Tester la Configuration

1. **Utiliser le diagnostic** :
   - Allez sur `http://localhost:5176/`
   - Cliquez sur **"Diagnostic"** dans le menu
   - Vérifiez que tout passe au vert

2. **Tester la connexion admin** :
   - Cliquez sur **"Admin"** dans le menu
   - Utilisez les identifiants :
     - Email : `abdoulaye@cdp.sn`
     - Mot de passe : `ABDOULAHI1989`

## 🧪 Tests de Diagnostic

### Test 1 : Vérifier les Variables d'Environnement
```javascript
// Dans la console du navigateur
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### Test 2 : Vérifier la Connexion Supabase
```javascript
// Dans la console du navigateur
import { supabase } from './src/lib/supabase.js';
supabase.from('profiles').select('count').then(console.log);
```

### Test 3 : Vérifier l'Utilisateur Admin
```sql
-- Dans l'éditeur SQL de Supabase
SELECT * FROM auth.users WHERE email = 'abdoulaye@cdp.sn';
SELECT * FROM profiles WHERE email = 'abdoulaye@cdp.sn';
```

## 🆘 Messages d'Erreur Courants

### "Invalid login credentials"
- **Cause** : Utilisateur admin non créé
- **Solution** : Exécuter `create-admin-user.sql`

### "Failed to load resource: 400"
- **Cause** : Variables d'environnement manquantes
- **Solution** : Créer le fichier .env

### "Access denied"
- **Cause** : Rôle admin incorrect
- **Solution** : Vérifier le rôle dans la table profiles

### "Table doesn't exist"
- **Cause** : Tables non créées
- **Solution** : Exécuter `create-database-tables.sql`

## 📞 Support Rapide

Si le problème persiste :

1. **Vérifiez les logs** dans la console du navigateur
2. **Utilisez le composant Diagnostic** dans l'application
3. **Vérifiez que tous les scripts SQL ont été exécutés**
4. **Redémarrez le serveur** après chaque modification

## ✅ Checklist de Vérification

- [ ] Fichier .env créé avec les bonnes clés
- [ ] Serveur redémarré après création du .env
- [ ] Scripts SQL exécutés dans Supabase
- [ ] Tables créées (profiles, subjects, courses)
- [ ] Utilisateur admin créé
- [ ] Rôle admin configuré
- [ ] Diagnostic passe au vert
- [ ] Connexion admin réussie

---

**Note** : Suivez les étapes dans l'ordre et vérifiez chaque étape avant de passer à la suivante.
