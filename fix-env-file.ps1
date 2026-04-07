# Script PowerShell pour corriger le fichier .env
Write-Host "🔧 Correction du fichier .env..." -ForegroundColor Yellow

# Supprimer l'ancien fichier s'il existe
if (Test-Path ".env") {
    Remove-Item ".env" -Force
    Write-Host "✅ Ancien fichier .env supprimé" -ForegroundColor Green
}

# Créer le nouveau fichier .env
$envContent = @"
VITE_SUPABASE_URL=https://dpqrcrwaryzfxhujzbcr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcXJjcndhcnl6ZnhodWp6YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE3OTUsImV4cCI6MjA3MzAyNzc5NX0.MnvpmaWM4rnGnzMO5vKbUjJgxohQbW3hxihxHxAhog0
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline

Write-Host "✅ Nouveau fichier .env créé" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Contenu du fichier .env:" -ForegroundColor Cyan
Get-Content .env
Write-Host ""
Write-Host "🔄 Redémarrez maintenant le serveur avec: npm run dev" -ForegroundColor Yellow
