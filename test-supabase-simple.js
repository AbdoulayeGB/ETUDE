// Test simple de connexion Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpqrcrwaryzfxhujzbcr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXJjcndhcnl6ZnhodWp6YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE3OTUsImV4cCI6MjA3MzAyNzc5NX0.MnvpmaWM4rnGnzMO5vKbUjJgxohQbW3hxihxHxAhog0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Test de connexion Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erreur:', error);
    } else {
      console.log('Succès:', data);
    }
  } catch (err) {
    console.error('Erreur inattendue:', err);
  }
}

test();
