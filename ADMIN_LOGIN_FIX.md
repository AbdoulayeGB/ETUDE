# 🚨 SOLUTION - Problème de Connexion Admin

## 🎯 Problème Identifié

Le compte admin ne peut pas se connecter. Voici les solutions complètes :

## 🔧 Solutions Immédiates

### 1. 📁 Créer le fichier .env (PRIORITÉ 1)

**Créez manuellement** un fichier `.env` à la racine du projet avec ce contenu :

```env
VITE_SUPABASE_URL=https://dpqrcrwaryzfxhujzbcr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXJjcndhcnl6ZnhodWp6YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE3OTUsImV4cCI6MjA3MzAyNzc5NX0.MnvpmaWM4rnGnzMO5vKbUjJgxohQbW3hxihxHxAhog0
```

**Puis redémarrez le serveur** :
```bash
# Arrêter (Ctrl+C) puis redémarrer
npm run dev
```

### 2. 🗄️ Configurer la Base de Données (PRIORITÉ 2)

1. **Allez sur [https://supabase.com](https://supabase.com)**
2. **Ouvrez l'éditeur SQL**
3. **Exécutez ces scripts dans l'ordre** :
   - `create-database-tables.sql`
   - `create-admin-user.sql`
   - `verify-setup.sql`

### 3. 🧪 Tester la Configuration

1. **Ouvrez `test-admin-connection.html`** dans votre navigateur
2. **Cliquez sur "Tester la Connexion"**
3. **Vérifiez les résultats**

## 📋 Fichiers de Diagnostic Créés

1. **`TROUBLESHOOTING_ADMIN_LOGIN.md`** - Guide complet de dépannage
2. **`test-admin-connection.html`** - Test de connexion dans le navigateur
3. **`debug-admin-login.js`** - Script de diagnostic Node.js
4. **`fix-env-file.ps1`** - Script PowerShell pour corriger .env

## 🔍 Diagnostic Rapide

### Test 1 : Vérifier le fichier .env
```bash
# Dans le terminal
Get-Content .env
```

### Test 2 : Vérifier la connexion
1. Allez sur `http://localhost:5176/`
2. Cliquez sur **"Diagnostic"**
3. Vérifiez que tout passe au vert

### Test 3 : Test de connexion admin
1. Cliquez sur **"Admin"**
2. Utilisez :
   - Email : `abdoulaye@cdp.sn`
   - Mot de passe : `ABDOULAHI1989`

## 🆘 Messages d'Erreur et Solutions

### "Failed to load resource: 400"
- **Cause** : Fichier .env manquant
- **Solution** : Créer le fichier .env et redémarrer

### "Invalid login credentials"
- **Cause** : Utilisateur admin non créé
- **Solution** : Exécuter `create-admin-user.sql`

### "Access denied"
- **Cause** : Rôle admin incorrect
- **Solution** : Vérifier le rôle dans la table profiles

## ✅ Checklist de Résolution

- [ ] Fichier .env créé avec les bonnes clés
- [ ] Serveur redémarré après création du .env
- [ ] Scripts SQL exécutés dans Supabase
- [ ] Tables créées (profiles, subjects, courses)
- [ ] Utilisateur admin créé
- [ ] Rôle admin configuré
- [ ] Test de connexion réussi

## 🎯 Résultat Attendu

Après avoir suivi ces étapes :
1. ✅ Le diagnostic passe au vert
2. ✅ La connexion admin fonctionne
3. ✅ L'accès au dashboard admin est possible
4. ✅ Toutes les fonctionnalités admin sont disponibles

## 📞 Support

Si le problème persiste :
1. Utilisez `test-admin-connection.html` pour diagnostiquer
2. Consultez `TROUBLESHOOTING_ADMIN_LOGIN.md` pour plus de détails
3. Vérifiez les logs dans la console du navigateur

---

**IMPORTANT** : Suivez les étapes dans l'ordre et vérifiez chaque étape avant de passer à la suivante.
