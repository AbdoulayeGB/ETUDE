# Script PowerShell pour créer le fichier .env
$envContent = @"
VITE_SUPABASE_URL=https://dpqrcrwaryzfxhujzbcr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXJjcndhcnl6ZnhodWp6YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE3OTUsImV4cCI6MjA3MzAyNzc5NX0.MnvpmaWM4rnGnzMO5vKbUjJgxohQbW3hxihxHxAhog0
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "Fichier .env créé avec succès !"
Write-Host "Contenu du fichier :"
Get-Content .env
