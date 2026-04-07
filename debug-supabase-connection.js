// Script de diagnostic pour l'erreur 500 Supabase
import { createClient } from '@supabase/supabase-js';

console.log('🔍 DIAGNOSTIC SUPABASE - ERREUR 500');
console.log('====================================');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('📋 Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✅ Présente' : '❌ MANQUANTE');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('\n🔗 Test de connexion de base...');
  
  try {
    // Test simple de connexion
    const { data, error } = await supabase
      .from('subjects')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ ERREUR 500 DÉTECTÉE:', error);
      console.log('Code d\'erreur:', error.code);
      console.log('Message:', error.message);
      console.log('Détails:', error.details);
      console.log('Hint:', error.hint);
      
      if (error.code === 'PGRST301') {
        console.log('\n💡 SOLUTION: La table "subjects" n\'existe pas !');
        console.log('Exécutez le script setup-database-simple.sql dans Supabase');
      } else if (error.code === 'PGRST301') {
        console.log('\n💡 SOLUTION: Problème de permissions RLS !');
        console.log('Vérifiez les politiques RLS dans Supabase');
      }
    } else {
      console.log('✅ Connexion réussie !');
    }
  } catch (err) {
    console.error('❌ ERREUR INATTENDUE:', err);
  }
}

async function testTables() {
  console.log('\n🗄️ Test des tables...');
  
  const tables = ['profiles', 'subjects', 'courses', 'exercises', 'user_progress'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message} (${error.code})`);
      } else {
        console.log(`✅ Table ${table}: OK`);
      }
    } catch (err) {
      console.log(`❌ Table ${table}: Erreur inattendue`);
    }
  }
}

async function testRLSPolicies() {
  console.log('\n🔒 Test des politiques RLS...');
  
  try {
    // Test sans authentification
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ RLS bloque l\'accès:', error.message);
    } else {
      console.log('✅ RLS permet l\'accès public aux subjects');
    }
  } catch (err) {
    console.log('❌ Erreur RLS:', err);
  }
}

async function runDiagnostic() {
  await testConnection();
  await testTables();
  await testRLSPolicies();
  
  console.log('\n📋 RÉSUMÉ:');
  console.log('1. Vérifiez que le fichier .env existe et contient les bonnes valeurs');
  console.log('2. Exécutez setup-database-simple.sql dans Supabase');
  console.log('3. Vérifiez que les politiques RLS permettent l\'accès public aux subjects');
  console.log('4. Redémarrez le serveur de développement');
}

runDiagnostic();
