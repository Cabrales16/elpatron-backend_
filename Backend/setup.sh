#!/bin/bash

# ElPatrón CRM Backend - Setup Script

echo "🚀 ElPatrón Backend Setup"
echo "========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Copy .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your values."
else
    echo "✅ .env file already exists."
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Install dependencies
echo "📦 Installing Node dependencies..."
docker-compose exec -T backend npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
docker-compose exec -T backend npm run prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T backend npm run prisma:migrate:prod

# Seed database
echo "🌱 Seeding database..."
docker-compose exec -T backend npm run prisma:seed

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📚 Access the API:"
echo "   - API: http://localhost:3000"
echo "   - Swagger Docs: http://localhost:3000/api/docs"
echo ""
echo "👤 Default credentials:"
echo "   - Admin: admin@elpatron.com / admin123"
echo "   - Operator: operator@elpatron.com / operator123"
echo ""
echo "🛑 To stop services: docker-compose down"
echo "🔄 To restart services: docker-compose restart"
