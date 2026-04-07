// Script de test pour vérifier la connexion Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Test de connexion Supabase...');
console.log('URL:', supabaseUrl);
console.log('Clé:', supabaseKey ? '✅ Présente' : '❌ Manquante');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.log('Créez un fichier .env avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔄 Test de connexion...');
    
    // Test de connexion basique
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie !');
    
    // Test des tables
    console.log('🔄 Vérification des tables...');
    
    const tables = ['profiles', 'subjects', 'courses'];
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('id').limit(1);
        if (tableError) {
          console.log(`⚠️  Table ${table}: ${tableError.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: Erreur`);
      }
    }
    
    return true;
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Configuration Supabase terminée avec succès !');
    console.log('Vous pouvez maintenant utiliser l\'application.');
  } else {
    console.log('\n💡 Consultez le fichier SETUP_ENV.md pour les instructions de configuration.');
  }
});
