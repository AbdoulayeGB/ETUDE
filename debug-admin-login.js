// Script de diagnostic pour le problème de connexion admin
import { createClient } from '@supabase/supabase-js';

// Vérifier les variables d'environnement
console.log('🔍 DIAGNOSTIC DE CONNEXION ADMIN');
console.log('================================');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('📋 Variables d\'environnement:');
console.log('URL:', supabaseUrl || '❌ MANQUANTE');
console.log('Clé:', supabaseKey ? '✅ Présente' : '❌ MANQUANTE');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ PROBLÈME: Variables d\'environnement manquantes !');
  console.log('💡 SOLUTION: Créez un fichier .env avec:');
  console.log('VITE_SUPABASE_URL=https://dpqrcrwaryzfxhujzbcr.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXJjcndhcnl6ZnhodWp6YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE3OTUsImV4cCI6MjA3MzAyNzc5NX0.MnvpmaWM4rnGnzMO5vKbUjJgxohQbW3hxihxHxAhog0');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminLogin() {
  console.log('\n🔐 Test de connexion admin...');
  
  try {
    // Test de connexion avec les identifiants admin
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'abdoulaye@cdp.sn',
      password: 'ABDOULAHI1989'
    });

    if (error) {
      console.error('❌ ERREUR DE CONNEXION:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 SOLUTIONS POSSIBLES:');
        console.log('1. L\'utilisateur admin n\'existe pas dans la base de données');
        console.log('2. Le mot de passe est incorrect');
        console.log('3. Les scripts SQL n\'ont pas été exécutés');
        console.log('\n🔧 ACTIONS À EFFECTUER:');
        console.log('1. Allez sur https://supabase.com');
        console.log('2. Ouvrez l\'éditeur SQL');
        console.log('3. Exécutez le script create-admin-user.sql');
      }
      
      return false;
    }

    console.log('✅ CONNEXION RÉUSSIE !');
    console.log('Utilisateur:', data.user?.email);
    
    // Vérifier le profil admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('❌ ERREUR PROFIL:', profileError.message);
      return false;
    }

    console.log('✅ PROFIL ADMIN TROUVÉ:');
    console.log('Email:', profile.email);
    console.log('Nom:', profile.full_name);
    console.log('Rôle:', profile.role);

    if (profile.role !== 'admin') {
      console.error('❌ PROBLÈME: L\'utilisateur n\'a pas le rôle admin !');
      console.log('💡 SOLUTION: Exécutez le script create-admin-user.sql');
      return false;
    }

    console.log('\n🎉 TOUT FONCTIONNE CORRECTEMENT !');
    return true;

  } catch (err) {
    console.error('❌ ERREUR INATTENDUE:', err.message);
    return false;
  }
}

async function checkDatabaseTables() {
  console.log('\n🗄️ Vérification des tables...');
  
  const tables = ['profiles', 'subjects', 'courses'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: OK`);
      }
    } catch (err) {
      console.log(`❌ Table ${table}: Erreur`);
    }
  }
}

async function runDiagnostic() {
  await checkDatabaseTables();
  await testAdminLogin();
  
  console.log('\n📋 RÉSUMÉ:');
  console.log('Si vous voyez des erreurs, suivez les instructions ci-dessus.');
  console.log('Si tout est vert, le problème vient peut-être de l\'interface utilisateur.');
}

runDiagnostic();
