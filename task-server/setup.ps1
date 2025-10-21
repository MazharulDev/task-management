# Setup Script for Task Management Backend

Write-Host "🚀 Setting up Task Management Backend..." -ForegroundColor Cyan

# Check if .env exists
if (Test-Path .env) {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please update .env with your configuration" -ForegroundColor Yellow
    Write-Host "   Especially: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma Client
Write-Host "`n🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Ask about database migration
Write-Host "`n" -NoNewline
$runMigration = Read-Host "Do you want to run database migrations now? (y/n)"

if ($runMigration -eq "y" -or $runMigration -eq "Y") {
    Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
    npx prisma migrate dev --name init
    Write-Host "✅ Database setup complete!" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipping migrations. Run 'npx prisma migrate dev' when ready." -ForegroundColor Yellow
}

Write-Host "`n✨ Setup Complete! ✨" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env file with correct values" -ForegroundColor White
Write-Host "2. If you skipped migrations, run: npx prisma migrate dev" -ForegroundColor White
Write-Host "3. Start the development server: npm run dev" -ForegroundColor White
Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Quick Start: QUICKSTART.md" -ForegroundColor White
Write-Host "   - API Docs: API_DOCS.md" -ForegroundColor White
Write-Host "   - README: README.md" -ForegroundColor White
Write-Host "`nHappy Coding! 🎉" -ForegroundColor Green
