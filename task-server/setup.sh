#!/bin/bash

# Setup Script for Task Management Backend

echo "🚀 Setting up Task Management Backend..."

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
    echo "   Especially: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Ask about database migration
echo ""
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running database migrations..."
    npx prisma migrate dev --name init
    echo "✅ Database setup complete!"
else
    echo "⏭️  Skipping migrations. Run 'npx prisma migrate dev' when ready."
fi

echo ""
echo "✨ Setup Complete! ✨"
echo ""
echo "Next steps:"
echo "1. Update your .env file with correct values"
echo "2. If you skipped migrations, run: npx prisma migrate dev"
echo "3. Start the development server: npm run dev"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICKSTART.md"
echo "   - API Docs: API_DOCS.md"
echo "   - README: README.md"
echo ""
echo "Happy Coding! 🎉"
