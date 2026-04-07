# Configuration des Variables d'Environnement

## 🚨 Action Requise

Vous devez créer manuellement le fichier `.env` à la racine du projet avec les clés Supabase que vous avez fournies.

## 📝 Étapes à suivre

### 1. Créer le fichier .env
Créez un nouveau fichier nommé `.env` dans le dossier racine du projet (même niveau que `package.json`).

### 2. Ajouter le contenu suivant
Copiez et collez exactement ce contenu dans le fichier `.env` :

```env
VITE_SUPABASE_URL=https://dpqrcrwaryzfxhujzbcr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXJjcndhcnl6ZnhodWp6YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE3OTUsImV4cCI6MjA3MzAyNzc5NX0.MnvpmaWM4rnGnzMO5vKbUjJgxohQbW3hxihxHxAhog0
```

### 3. Sauvegarder le fichier
Assurez-vous de sauvegarder le fichier avec l'extension `.env` (sans extension supplémentaire).

### 4. Redémarrer le serveur
Après avoir créé le fichier `.env` :

1. Arrêtez le serveur de développement (Ctrl+C dans le terminal)
2. Redémarrez avec : `npm run dev`

## ✅ Vérification

Une fois le fichier créé et le serveur redémarré :

1. Allez sur `http://localhost:5176/`
2. Cliquez sur **"Diagnostic"** dans le menu
3. Vérifiez que toutes les vérifications passent au vert

## 🔐 Connexion Admin

Une fois la configuration terminée, vous pourrez vous connecter avec :
- **Email** : `abdoulaye@cdp.sn`
- **Mot de passe** : `ABDOULAHI1989`

## 🆘 Si vous avez des problèmes

1. Vérifiez que le fichier `.env` est bien à la racine du projet
2. Vérifiez qu'il n'y a pas d'espaces supplémentaires dans les clés
3. Vérifiez que le serveur a été redémarré après la création du fichier
4. Utilisez le composant "Diagnostic" pour identifier les problèmes

---

**Note** : Le fichier `.env` ne doit jamais être partagé ou commité dans Git pour des raisons de sécurité.
